import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CallableContext } from "firebase-functions/lib/providers/https";

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase1y!");
});

admin.initializeApp();
export const addAdminRole = functions.https.onCall((data, context: CallableContext) => {
  //get user and add custom claims
  return admin.auth().getUserByPhoneNumber(data.phoneNumber).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
  }).then(() => {
    return {
      message: `Success${data.phoneNumber} has been made an admin`
    };
  }).catch(err => {
    return err;
  });
});