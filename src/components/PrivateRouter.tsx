import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { RouteComponentProps, withRouter } from 'react-router';
import { setUserAction, getUserDataAction } from "../app/auth/action";
import { connect } from "react-redux";
import { RootState } from "../rootReducer";
import { RouteProps } from "react-router";
import { AppRoutes } from "../config/routes";

interface PrivateRouteProps {
  component: React.ComponentType<RouteComponentProps<any>>;
}

interface ReduxStateProps {
  isAuthenticated?: boolean;
  isLoading: boolean;
}

type Props = PrivateRouteProps & RouteComponentProps & ReduxStateProps & RouteProps;

const PrivateRoute: React.FC<Props> =
  ({ component: Component, isAuthenticated, isLoading, location, ...rest}) => {
    if (!Component) {
      return null;
    }
    if (isLoading) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      isAuthenticated ?
        <Route
          {...rest}
          render={(props) => <Component {...{ ...props, location}} />}
        /> :
        <Redirect  to={{ pathname: AppRoutes.SIGN_IN, state: { from: location } }} />
    );
  };

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state?.auth?.isAuthenticated,
  isLoading: state?.auth?.isAuthLoading
});

const mapDispatchToProps = { setUser: setUserAction, getUserData: getUserDataAction };
const PrivateRouterConnected = connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);

export default withRouter(PrivateRouterConnected);