import React from "react";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { uiConfig, authInstance } from "../config/firebase";

const SignInPage: React.FC = () => {


  return (
    <div>
      <h1>Sign In Page</h1>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={authInstance} />
    </div>);
};

export { SignInPage };