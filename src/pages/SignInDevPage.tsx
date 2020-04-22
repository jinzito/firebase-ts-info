import React, { useEffect } from "react";
import { authInstance } from "../config/firebase";
import { UserCredential } from "@firebase/auth-types";

export const {
  REACT_APP_CONFIG_DEV_USER = "",
  REACT_APP_CONFIG_DEV_PASS = "",
} = process.env;

const SignInDevPage: React.FC = () => {

  useEffect(() => {
    (async () => {
      try {
        const creds: UserCredential = await authInstance.signInWithEmailAndPassword(
          REACT_APP_CONFIG_DEV_USER, REACT_APP_CONFIG_DEV_PASS
        );
        console.log("creds", creds);
      } catch (e) {
        console.log("error", e);
      }
    })();
  }, []);

  return (
    <div>
      <h1>Sign In Page</h1>
    </div>);
};

export { SignInDevPage };