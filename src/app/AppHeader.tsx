import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import WhereToVoteIcon from '@material-ui/icons/WhereToVote';
import { Link } from "react-router-dom";
import { AppRoutes } from "../config/routes";

import './AppHeader.scss';

const AppHeader: React.FC = () => {

  return (
    <AppBar className="app-header" color="inherit">
      <Toolbar>
        <IconButton edge="start" className="app-header__menu_button" color="inherit" aria-label="menu">
          <WhereToVoteIcon />
        </IconButton>
        <Typography variant="h6" className="app-header__label" onClick={() => window.location.href = AppRoutes.LANDING}>
          ТС ЖК "Уручский"
        </Typography>
        <li><Link to={AppRoutes.SIGN_IN}>Sign In</Link></li>
        <li><Link to={AppRoutes.MEMBERS}>Members</Link></li>
        <li><Link to={AppRoutes.SIGN_OUT}>Sign Out</Link></li>
        <Button color="inherit">{"Login"}</Button>
      </Toolbar>
    </AppBar>
  );
};

export { AppHeader };