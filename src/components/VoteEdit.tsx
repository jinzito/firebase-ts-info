import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import { RadioAnswers } from "./RadioAnswers";

import { TextField } from "@material-ui/core";
import {
  DateRangePicker,
  DateRange,
  DateRangeDelimiter,
  LocalizationProvider
} from "@material-ui/pickers";
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns'; // choose your lib

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

});

const VoteEdit = () => {

  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [selectedDate, handleDateChange] = React.useState<DateRange>([null, null]);
  return (
    <Container>
      <Card className={classes.root}>
        <CardContent>
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
          <RadioAnswers />
        </CardContent>

        <CardActions disableSpacing>
          <Button className={classes.expand}> Save </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default VoteEdit;