import React from 'react';
import VoteEdit from "../components/VoteEdit";
import { makeStyles } from "@material-ui/core/styles";
// import { Paper } from '@material-ui/core';
// import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#e8e8e8',
    padding: '2rem',
    // display: 'flex',
    // position: 'relative',
    // justifyContent: 'center'
  },
});

const LandingPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {/*<Paper elevation={3} >*/}
      {/*  <Typography variant={"h4"}> Тестовый опрос номер 2</Typography>*/}
      {/*</Paper>*/}


      <VoteEdit/>
      <VoteEdit/>
      <VoteEdit/>
      <VoteEdit/>
    </div>
  )
}

export default LandingPage;