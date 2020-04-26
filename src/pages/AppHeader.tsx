import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import WhereToVoteIcon from '@material-ui/icons/WhereToVote';
import { Link } from "react-router-dom";
import { AppRoutes } from "../config/routes";
import { authInstance } from "../config/firebase";
import { firestore } from "firebase";
import { isEmpty } from "lodash";
import { MemberVO } from "../app/model";
import { DocumentSnapshot, DocumentData } from '@firebase/firestore-types';
import { IdTokenResult } from '@firebase/auth-types';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppHeader: React.FC = () => {

  const [user, setUser] = useState();
  const [userName, setUserName] = useState();

  useEffect(() => {
    authInstance.onAuthStateChanged(async (user) => {
      if (user) {
        const token: IdTokenResult = await user.getIdTokenResult();
        console.log("> claims:", token?.claims);
        console.log(`> isAdmin:${!!token?.claims?.isAdmin} isCurator:${!!token?.claims?.isCurator} isMember:${!!token?.claims?.isMember}`);
      }
      setUser(user);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (!isEmpty(user.uid)) {
          const memberDoc: DocumentSnapshot<DocumentData> = await firestore().collection('members').doc(user.uid).get();
          const member: MemberVO = memberDoc.exists && memberDoc.data() as MemberVO;
          console.log("> memberVO:", member);
          setUserName(member.phone);
        } else {
          setUserName(undefined);
        }
      } catch (e) {
        setUserName(undefined);
      }
    })();
  }, [user]);

  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <WhereToVoteIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          News
        </Typography>
        <li><Link to={AppRoutes.SIGN_IN}>Sign In</Link></li>
        <li><Link to={AppRoutes.MEMBERS}>Members</Link></li>
        <li><Link to={AppRoutes.EVENTS}>Events</Link></li>
        <li><Link to={AppRoutes.SIGN_OUT}>Sign Out</Link></li>
        <Button color="inherit">{userName || "Login"}</Button>
      </Toolbar>
    </AppBar>
  );
};

export { AppHeader };