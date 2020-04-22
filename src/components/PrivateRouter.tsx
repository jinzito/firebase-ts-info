import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { RouteComponentProps, withRouter } from 'react-router';
import { auth } from 'firebase/app';

interface PrivateRouteProps {
  path: string;
  component: React.Component | React.FC<any>;
}

type Props = PrivateRouteProps & RouteComponentProps;

const PrivateRoute: React.FC<Props> = ({ path, component, location }) =>
  isAuthenticated() ? (
    <Route path={path} component={component as any} />
  ) : (
    <Redirect
      to={{ pathname: "/login", state: { from: location } }}
    />
  );

const isAuthenticated = (): boolean => {
  console.log("isAuthenticated", !!auth().currentUser, auth().currentUser);
  return !!auth().currentUser;
};

export default withRouter(PrivateRoute);

