import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from "firebase-functions/lib/providers/https";

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

const checkAuth = (context: CallableContext) => {
  if (!context.auth) {
    throwError(
      "The user is not authenticated. Only authenticated Admin users can create new users.",
      FunctionsErrorCode.UNAUTHENTICATED
    );
  }
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

    let memberId = ""
    try {
      const newUser = { phoneNumber, displayName, disabled: false };
      const userRecord = await admin.auth().createUser(newUser);
      memberId = userRecord.uid;
    } catch (createUserError) {
      throwError(`auth createUser error:${createUserError.message}`);
    }

    const claims = { isAdmin, isMember, isCurator };
    try {
      await admin.auth().setCustomUserClaims(memberId, claims);
    } catch (e) {
      throwError(`setCustomUserClaims ${memberId} ${claims} error:${e.message}`);
    }

    try {
      const member = { phoneNumber, displayName, house, apt, isAdmin, isMember, isCurator, aptSquare }
      await admin.firestore().collection("members").doc(memberId).set(member);
      return { member };
    } catch (membersCollectionError) {
      throwError(`add to members collection error:${membersCollectionError?.message}`);
    }

    return undefined;
  }
);