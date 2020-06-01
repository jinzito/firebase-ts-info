import React, { useEffect } from 'react';

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppRoutes } from "./config/routes";
import LandingPage from "./app/lenta/LandingPage";
import { SignInPage } from "./app/auth/components/SignInPage";
import { MembersList } from "./app/members/MembersList";
import { SignOutPage } from "./app/auth/components/SignOutPage";
import { SignInDevPage } from "./app/auth/components/SignInDevPage";
import AppHeader from "./app/AppHeader";
import PrivateRoute from "./components/common/PrivateRouter";
import { AvoidRoutes } from "./components/AvoidRoutes";
import { connect } from "react-redux";
import { authInstance } from "./config/firebase";
import { setUserAction, getUserDataAction } from "./app/auth/action";


interface DispatchProps {
  setUser: (user: any) => void;
  getUserData: (uid: string) => void;
}

type Props = DispatchProps;

const App: React.FC<Props> = ({ setUser, getUserData }:Props) => {

  useEffect(() => {
    authInstance.onAuthStateChanged((user) => {
      setUser(user);
      getUserData(user?.uid);
    })
  }, []);

  return (
    <BrowserRouter>
      <AvoidRoutes routes={[AppRoutes.SIGN_IN]}>
        <AppHeader />
      </AvoidRoutes>
      <Switch>
        <Route path={AppRoutes.SIGN_IN} component={SignInPage} />
        <Route path={AppRoutes.SIGN_IN_DEV} component={SignInDevPage} />
        <PrivateRoute path={AppRoutes.MEMBERS} component={MembersList} />
        <PrivateRoute path={AppRoutes.SIGN_OUT} component={SignOutPage} />
        <PrivateRoute path={AppRoutes.LANDING} component={LandingPage} />
      </Switch>
    </BrowserRouter>
  );
};

const mapDispatchToProps = { setUser: setUserAction, getUserData: getUserDataAction };
const AppContainer = connect(null, mapDispatchToProps)(App);
export default AppContainer;