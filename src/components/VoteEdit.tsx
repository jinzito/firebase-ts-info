import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { RadioAnswers } from "./RadioAnswers";
import { TextField } from "@material-ui/core";
import {
  DateRangePicker,
  DateRange,
  DateRangeDelimiter,
  LocalizationProvider
} from "@material-ui/pickers";
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import { addVote } from "../config/firebase";
import { firestore } from "firebase";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: "2rem"
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  expand: {
    marginLeft: 'auto',
  },
  answers: {
    marginTop: "2rem"
  }

});
const VoteEdit = () => {

  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [selectedDate, handleDateChange] = React.useState<DateRange>([null, null]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(undefined);
  const saveVote = async () => {
    setError("");
    try {
      await addVote({
        beginDate: firestore.Timestamp.fromDate(selectedDate[0]),
        endDate: firestore.Timestamp.fromDate(selectedDate[1]),
        title,
        answers
      });
      setError("success")
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container>
      <Card className={classes.root} onClick={() => setError("")}>
        <CardContent>
          {error && <Alert severity="error">{error}</Alert>}
          <LocalizationProvider dateAdapter={DateFnsAdapter}>
            <DateRangePicker
              startText="Check-in"
              endText="Check-out"
              value={selectedDate}
              onChange={date => handleDateChange(date)}
              renderInput={(startProps, endProps) => (
                <>
                  <TextField {...startProps} />
                  <DateRangeDelimiter> to </DateRangeDelimiter>
                  <TextField {...endProps} />
                </>
              )}
            />
          </LocalizationProvider>
          <TextField
            label="Title"
            multiline
            fullWidth={true}
            value={title}
            onChange={(e) => setTitle(e?.target?.value || "")}
          />
          <RadioAnswers
            className={classes.answers}
            setAnswers={setAnswers}
            answers={answers}
          />
        </CardContent>

        <CardActions disableSpacing>
          <Button onClick={saveVote} className={classes.expand}> Save </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default VoteEdit;