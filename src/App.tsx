import React, { useEffect } from 'react';

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AppRoutes } from "./config/routes";
import LandingPage from "./app/lent/components/LandingPage";
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
import dateFormat from "dateformat";

dateFormat.i18n = {
  dayNames: [
    'Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб',
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'
  ],
  monthNames: [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрть', 'Декабрь'
  ],
  timeNames: [
    'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
  ]
};

interface DispatchProps {
  setUser: (user: any) => void;
  getUserData: (uid: string) => void;
}

type Props = DispatchProps;

const App: React.FC<Props> = ({ setUser, getUserData }:Props) => {

  useEffect(() => {
    // TODO: set another way to use callback, because it add callback in each didMount
    authInstance.onAuthStateChanged((user) => {
      setUser(user);
      getUserData(user?.uid);
    })
  }, [setUser, getUserData]);

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