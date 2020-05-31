import React from "react";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { uiConfig, authInstance } from "../config/firebase";
import { GeneralTitle } from "../app/GeneralTitle";

const SignInPage: React.FC = () => {

  return (
    <div>
      <GeneralTitle/>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={authInstance} />
    </div>
  );
};

export { SignInPage };