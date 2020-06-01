import { apps, functions, initializeApp, firestore } from 'firebase/app';
import * as firebase from 'firebase';

import { VoteVO, VoteDetailsVO, InfoVO } from "../app/model";

export const {
  REACT_APP_CONFIG_API_KEY,
  REACT_APP_CONFIG_AUTH_DOMAIN,
  REACT_APP_CONFIG_DATABASE_URL,
  REACT_APP_CONFIG_PROJECT_ID,
  REACT_APP_CONFIG_STORAGE_BUCKET,
  REACT_APP_CONFIG_MESSAGING_SENDER_ID,
  REACT_APP_CONFIG_APP_ID,
  REACT_APP_CONFIG_MEASUREMENT_ID
} = process.env;

const config = {
  apiKey: REACT_APP_CONFIG_API_KEY,
  authDomain: REACT_APP_CONFIG_AUTH_DOMAIN,
  databaseURL: REACT_APP_CONFIG_DATABASE_URL,
  projectId: REACT_APP_CONFIG_PROJECT_ID,
  storageBucket: REACT_APP_CONFIG_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_CONFIG_MESSAGING_SENDER_ID,
  appId: REACT_APP_CONFIG_APP_ID,
  measurementId: REACT_APP_CONFIG_MEASUREMENT_ID
};

export const uiConfig = {
  signInSuccessUrl: "/",
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: "BY",
      defaultNationalNumber: localStorage.getItem("phone")
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // Before saving we should remove country code
      // localStorage.setItem("phone", authResult?.user.phoneNumber);
      uid = authResult?.user?.uid;
      return true;
    }
  }
};

let db;

if (!apps.length) {
  const app = initializeApp(config);
  db = firestore(app);
}

export const authInstance = firebase.auth();

let uid: string;
authInstance.onAuthStateChanged(async (user) => {
  if (user) {
    uid = user.uid
  }
});
export const createMember = functions().httpsCallable("createMember");
export const updateMember = functions().httpsCallable("updateMember");
export const deleteMember = functions().httpsCallable("deleteMember");
export const addVote = (vote: VoteVO) => db.collection("votes").add(vote);
export const getVotes = async () => {
  try {
    const qs = await db.collection('votes').get();
    const result: VoteVO[] = [];
    qs.forEach((doc) => {
      result.push({ ...doc.data(), id: doc.id } as VoteVO);
    });
    return Promise.resolve(result);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getVoteDetails = async (voteId: string) => {
  const result: VoteDetailsVO = {};
  try {
    const d = await db.collection("votes").doc(voteId).collection("data").doc(uid).get();
    result.data = d.data();
  } catch (e) {
    result.dataError = e.message;
  }
  try {
    const s = await db.collection("votes").doc(voteId).collection("summary").doc("summary").get();
    result.summary =  s.data();
  } catch (e) {
    result.summaryError = e.message;
  }
  return Promise.resolve(result);
};

export const placeVote = (data: { voteId: string, answerIndex: number }) => functions().httpsCallable("placeVote")(data);

export const getInfos = async () => {
  try {
    const qs = await db.collection('infos').get();
    const result: InfoVO[] = [];
    qs.forEach((doc) => {
      result.push({ ...doc.data(), id: doc.id } as InfoVO);
    });
    return Promise.resolve(result);
  } catch (e) {
    return Promise.reject(e);
  }
};
export const addInfo = (info: InfoVO) => db.collection("infos").add(info);
