import firebase from 'firebase';
import { functions } from "firebase";

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
      return true;
    }
  }
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const authInstance = firebase.auth();
export const getMembersList = functions().httpsCallable("getMembersList");
export const createMember = functions().httpsCallable("createMember");
export const updateMember = functions().httpsCallable("updateMember");
export const deleteMember = functions().httpsCallable("deleteMember");