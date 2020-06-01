import React, { useEffect, useState } from 'react';
import VoteEdit from "../../components/votes/VoteEdit";
import { makeStyles } from "@material-ui/core/styles";
import { getVotes } from "../../config/firebase";
import { VoteVO } from "../model";
import VoteView from "../../components/votes/VoteView";
import DateLabel from "../../components/DateLabel";
// import { Paper } from '@material-ui/core';
// import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#e8e8e8',
    padding: '2rem',
    paddingTop: "5rem"
    // display: 'flex',
    // position: 'relative',
    // justifyContent: 'center'
  },
});

const LandingPage = () => {
  const classes = useStyles();

  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const votesList: VoteVO[] = await getVotes();
        setList(votesList);
      } catch (e) {
        console.log("error", e);
      }
    })();
  }, []);

  return (
    <div className={classes.root}>
      {/*<Paper elevation={3} >*/}
      {/*  <Typography variant={"h4"}> Тестовый опрос номер 2</Typography>*/}
      {/*</Paper>*/}
      <>
      {list.map((voteVO, i) => <VoteView vote={voteVO} key={`vote-${i}`}/>)}
      </>

      <DateLabel/>
      <VoteEdit key={`k1`} />
    </div>
  );
};

export default LandingPage;