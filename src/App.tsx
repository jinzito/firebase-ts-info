import React from 'react';

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppRoutes } from "./config/routes";
import LandingPage from "./pages/LandingPage";
import { SignInPage } from "./pages/SignInPage";
import { MembersList } from "./pages/MembersList";
import { EventsList } from "./pages/EventsList";
import { SignOutPage } from "./pages/SignOutPage";
import { SignInDevPage } from "./pages/SignInDevPage";
import { AppHeader } from "./pages/AppHeader";
const App = () =>
  <BrowserRouter>
    <div>
      <AppHeader/>
      <Switch>
        <Route path={AppRoutes.SIGN_IN} component={SignInPage} />
        <Route path={AppRoutes.SIGN_IN_DEV} component={SignInDevPage} />
        {/*<PrivateRoute path={AppRoutes.MEMBERS} component={MembersList} />*/}
        <Route path={AppRoutes.MEMBERS} component={MembersList} />
        <Route path={AppRoutes.EVENTS} component={EventsList} />
        <Route path={AppRoutes.SIGN_OUT} component={SignOutPage} />

        <Route path={AppRoutes.LANDING} component={LandingPage} />
      </Switch>
    </div>
  </BrowserRouter>;

export default App;