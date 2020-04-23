import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from "firebase-functions/lib/providers/https";
import ListUsersResult = admin.auth.ListUsersResult;

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase1y!");
});

admin.initializeApp();

export const addAdminRole = functions.https.onCall((data, context: CallableContext) => {
  //get user and add custom claims
  return admin.auth().getUserByPhoneNumber(data.phoneNumber).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      isAdmin: true
    });
  }).then(() => {
    return {
      message: `Success${data.phoneNumber} has been made an admin`
    };
  }).catch(err => {
    return err;
  });
});

enum FunctionsErrorCode {
  UNAUTHENTICATED = "unauthenticated",
  FAILED_PRECONDITION = "failed-precondition"
}

const validateMember = (data: any): boolean => {
  const { displayName = "", phoneNumber, house = "", apt = "", aptSquare = "", isMember } = data;
  if (!phoneNumber || !displayName) {
    throw new functions.https.HttpsError(
      FunctionsErrorCode.FAILED_PRECONDITION,
      "Created Member must have at least 'phoneNumber' and 'displayName'"
    );
  }
  if (isMember && !(house | apt | aptSquare)) {
    throw new functions.https.HttpsError(
      FunctionsErrorCode.FAILED_PRECONDITION,
      "To make user member you need ti specify 'house', 'apt' and 'ptSquare' params"
    );
  }
  return true;
};

const checkAdminRights = async (context: CallableContext) => {
  const { getUser } = admin.auth();
  const userUid = context?.auth?.uid || "";
  const callerUserRecord = await getUser(userUid);
  if (!callerUserRecord?.customClaims?.isAdmin || callerUserRecord?.customClaims?.admin) {
    throw new functions.https.HttpsError(
      FunctionsErrorCode.FAILED_PRECONDITION,
      "Only Admin users can create new users."
    );
  }
  return true;
};

const checkAuth = (context: CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      FunctionsErrorCode.UNAUTHENTICATED,
      "The user is not authenticated. Only authenticated Admin users can create new users."
    );
  }
};


export const getMembersList = functions.https.onCall(async (data, context: CallableContext) => {

  checkAuth(context);
  await checkAdminRights(context);

  const { listUsers } = admin.auth();
  const list: ListUsersResult = await listUsers(1000, data?.pageToken);
  const members = list.users.map((user: admin.auth.UserRecord) => {
    const { phoneNumber, displayName } = user;
    const { house, apt, aptSquare, isMember, isCurator, isAdmin } = user?.customClaims || {};
    return { ...{ phoneNumber, displayName, house, apt, aptSquare, isMember, isCurator, isAdmin } };
  });
  return {
    pageToken: list.pageToken,
    members
  };
});

export const createMember = functions.https.onCall(async (data, context: CallableContext) => {

    checkAuth(context);
    await checkAdminRights(context);
    validateMember(data);

    const { createUser, setCustomUserClaims } = admin.auth();

    const { phoneNumber, displayName } = data;
    const newUser = { phoneNumber, displayName, disabled: false };
    const userRecord = await createUser(newUser);
    const userId = userRecord.uid;

    const { house = "", apt = "", aptSquare = "", isAdmin, isMember, isCurator } = data;
    const claims = { house, apt, aptSquare, isAdmin, isMember, isCurator };
    await setCustomUserClaims(userId, claims);

    return { result: 'The new Member has been successfully created.' };
  }
);