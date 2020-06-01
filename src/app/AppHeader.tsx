import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import WhereToVoteIcon from '@material-ui/icons/WhereToVote';
import { Link } from "react-router-dom";
import { AppRoutes } from "../config/routes";

import './AppHeader.scss';
import { RootState } from "../rootReducer";
import { connect } from "react-redux";
import { withRouter, RouteComponentProps, RouteProps } from "react-router";
import { AvoidRoutes } from "../components/AvoidRoutes";

interface ReduxStateProps {
  isAuthenticated?: boolean;
  isLoading: boolean;
  userName: string;
}

type Props = RouteComponentProps & ReduxStateProps & RouteProps;

const AppHeader: React.FC<Props> = ({isAuthenticated, isLoading, userName}: Props) => {

  return (
    <AppBar className="app-header" color="inherit">
      <Toolbar>
        <IconButton edge="start" className="app-header__menu_button" color="inherit" aria-label="menu">
          <WhereToVoteIcon />
        </IconButton>
        <Typography variant="h6" className="app-header__label" onClick={() => window.location.href = AppRoutes.LANDING}>
          ТС ЖК "Уручский"
        </Typography>
        {!isLoading && !isAuthenticated && (
          <AvoidRoutes routes={AppRoutes.SIGN_IN}>
            <Link color="inherit" to={AppRoutes.SIGN_IN}>Войти</Link>
          </AvoidRoutes>
        )}
        {!isLoading && isAuthenticated && (
          <>
            <Typography variant="inherit">
              {userName}{' '}
              <Link color="inherit" to={AppRoutes.SIGN_OUT}>[Выйти]</Link>
            </Typography>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state?.auth?.isAuthenticated,
  isLoading: state?.auth?.isAuthLoading,
  userName: state?.auth?.userName
});

const PrivateRouterConnected = connect(mapStateToProps)(AppHeader);

export default withRouter(PrivateRouterConnected);