import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from "firebase-functions/lib/providers/https";
import { DocumentData } from '@firebase/firestore-types';

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase 2");
});

admin.initializeApp();

enum FunctionsErrorCode {
  UNAUTHENTICATED = "unauthenticated",
  FAILED_PRECONDITION = "failed-precondition"
}

const throwError = (message: string, type: FunctionsErrorCode = FunctionsErrorCode.FAILED_PRECONDITION) => {
  throw new functions.https.HttpsError(
    type,
    message
  );
};

const validateMember = (data: any): boolean => {
  const { displayName = "", phoneNumber, house = "", apt = "", aptSquare = "", isMember } = data;
  if (!phoneNumber || !displayName) {
    throwError(
      "Created Member must have at least 'phoneNumber' and 'displayName'"
    );
  }
  if (isMember && !(house || apt || aptSquare)) {
    throwError(
      "To make user member you need ti specify 'house', 'apt' and 'ptSquare' params"
    );
  }
  return true;
};

interface CustomClaims {
  isAdmin?: boolean;
  isMember?: boolean;
  isCurator?: boolean;
}

const checkAdminRights = async (context: CallableContext) => {
  if (context.auth?.uid == "DnYgTkebIQQ7XTQu0MZnVCWcKTf2") {
    // super admin
    return true;
  }
  const callerUserRecord = await admin.auth().getUser(context.auth?.uid || "");
  const cc: CustomClaims = callerUserRecord.customClaims as CustomClaims;
  if (!cc?.isAdmin) {
    throwError(
      "Only Admin users can manage Members.",
      FunctionsErrorCode.UNAUTHENTICATED
    );
  }
  return true;
};

const checkMemberRights = async (context: CallableContext) => {
  const callerUserRecord = await admin.auth().getUser(context.auth?.uid || "");
  const cc: CustomClaims = callerUserRecord.customClaims as CustomClaims;
  if (!cc?.isMember) {
    throwError(
      "Access Denied for not Members.",
      FunctionsErrorCode.UNAUTHENTICATED
    );
  }
  return true;
};

const checkAuth = (context: CallableContext) => {
  if (!context.auth) {
    throwError(
      "The user is not authenticated. Only authenticated Admin users can create new users.",
      FunctionsErrorCode.UNAUTHENTICATED
    );
  }
};

const getUserByUid = async (uid: string) => {
  try {
    const user = await admin.auth().getUser(uid);
    if (!user?.uid) {
      throwError(`auth getUser error: wrong uid`);
    }
    return user;
  } catch (getUserError) {
    throwError(`auth getUser error: ${getUserError.message}`);
  }
  return null;
};

export const createMember = functions.https.onCall(async (data, context: CallableContext) => {

    checkAuth(context);
    await checkAdminRights(context);
    validateMember(data);

    const { phoneNumber, displayName, house, apt, isAdmin = false, isMember = false, isCurator = false, aptSquare } = data;

    try {
      const existedUser = await admin.auth().getUserByPhoneNumber(phoneNumber);
      if (existedUser && existedUser.uid) {
        throwError(`Member already exist`);
      }
    } catch (e3) {
      console.log("e3", e3);
    }

    let uid = "";
    try {
      const newUser = { phoneNumber, displayName, disabled: false };
      const userRecord = await admin.auth().createUser(newUser);
      uid = userRecord.uid;
    } catch (createUserError) {
      throwError(`auth createUser error:${createUserError.message}`);
    }

    const claims = { isAdmin, isMember, isCurator };
    try {
      await admin.auth().setCustomUserClaims(uid, claims);
    } catch (e) {
      throwError(`setCustomUserClaims ${uid} ${claims} error:${e.message}`);
    }

    try {
      const member = {
        phoneNumber,
        displayName,
        house,
        apt,
        isAdmin,
        isMember,
        isCurator,
        aptSquare,
        uid
      };
      await admin.firestore().collection("members").doc(uid).set(member);
      return { ...member };
    } catch (membersCollectionError) {
      throwError(`add to member collection error:${membersCollectionError?.message}`);
    }
    return undefined;
  }
);

export const updateMember = functions.https.onCall(async (data, context: CallableContext) => {

    checkAuth(context);
    await checkAdminRights(context);
    validateMember(data);

    const { phoneNumber, displayName, house, apt, isAdmin = false, isMember = false, isCurator = false, aptSquare, uid } = data;

    await getUserByUid(uid);

    try {
      await admin.auth().updateUser(uid, { phoneNumber, displayName });
    } catch (createUserError) {
      throwError(`auth updateUser error:${createUserError.message}`);
    }

    const claims = { isAdmin, isMember, isCurator };
    try {
      await admin.auth().setCustomUserClaims(uid, claims);
    } catch (e) {
      throwError(`auth setCustomUserClaims ${uid} ${claims} error:${e.message}`);
    }

    try {
      const member = {
        phoneNumber,
        displayName,
        house,
        apt,
        isAdmin,
        isMember,
        isCurator,
        aptSquare,
      };
      await admin.firestore().collection("members").doc(uid).update(member);
      return { ...member, uid };
    } catch (membersCollectionError) {
      throwError(`update member collection error:${membersCollectionError?.message}`);
    }
    return undefined;
  }
);

export const deleteMember = functions.https.onCall(async (data, context: CallableContext) => {

    checkAuth(context);
    await checkAdminRights(context);

    const uid = data;

    await getUserByUid(uid);

    try {
      await admin.auth().deleteUser(uid);
    } catch (createUserError) {
      throwError(`auth deleteUser error:${createUserError.message}`);
    }

    try {
      await admin.firestore().collection("members").doc(uid).delete();
      return uid;
    } catch (membersCollectionError) {
      throwError(`delete member collection error:${membersCollectionError?.message}`);
    }
    return undefined;
  }
);

export const placeVote = functions.https.onCall(async (data, context: CallableContext) => {
  checkAuth(context);
  await checkMemberRights(context);

  const result: any = {};
  const { voteId, answerIndex } = data;
  const vote: DocumentData = await admin.firestore().collection("votes").doc(voteId).get();
  const { answers } = vote.data();
  if (answerIndex < 0 || answerIndex >= answers.length) {
    throwError(`Answer number doesn't match with answers list`);
  }
  const userUid: string = context?.auth?.uid || "";
  const userVoteData = { answerIndex };
  try {
    await admin.firestore()
      .collection("votes").doc(voteId)
      .collection("data").doc(userUid).set(userVoteData);
    result.data = userVoteData;
  } catch (e) {
    throwError(`Save vote data ${userUid} error`);
  }

  const qs = await admin.firestore().collection("members").where("isMember", "==", true).get();
  const members: { [uid: string]: any } = {};
  let totalSquares: number = 0;
  let totalMembers: number = 0;
  qs.forEach((m) => {
    const member = m.data();
    members[m.id] = member;
    totalSquares += Number(member?.aptSquare) || 0;
    totalMembers++;
  });

  let votedMembers = 0;
  const votesCount: number[] = new Array(4).fill(0);
  const votesCountBySquare: number[] = new Array(4).fill(0);
  const a = await admin.firestore()
    .collection("votes").doc(voteId)
    .collection("data").get();
  a.forEach((m) => {
    votedMembers++;
    const memberId = m.id;
    const i = m.data().answerIndex;
    votesCount[i]++;
    votesCountBySquare[i] += Number(members[memberId]?.aptSquare || 0);
  });

  const summary = { totalSquares, totalMembers, votedMembers, votesCount, votesCountBySquare };
  try {
    await admin.firestore()
      .collection("votes").doc(voteId)
      .collection("summary").doc("summary").set(summary);
    result.summary = summary;
  } catch (e) {
    throwError(`Save summary ${voteId} error, ${e?.message}`);
  }

  return result;
});
