import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { TextField } from "@material-ui/core";
import { LocalizationProvider, DatePicker } from "@material-ui/pickers";
import DateFnsAdapter from '@material-ui/pickers/adapter/date-fns';
import { addInfo } from "../../config/firebase";
import { firestore } from "firebase/app";

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

interface InfoEditProps {
  onCancel: () => void;
}

const InfoEdit: React.FC<InfoEditProps> = ({ onCancel }: InfoEditProps) => {

  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [selectedDate, handleDateChange] = React.useState<Date>(null);
  const [error, setError] = useState(undefined);

  const saveInfo = async () => {
    setError("");
    try {
      await addInfo({
        date: firestore.Timestamp.fromDate(selectedDate),
        title,
        text
      });
      setError("success");
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
            <DatePicker
              renderInput={props => <TextField {...props} />}
              value={selectedDate}
              onChange={date => handleDateChange(date)}
            />
          </LocalizationProvider>
          <TextField
            label="Title"
            multiline
            fullWidth={true}
            value={title}
            onChange={(e) => setTitle(e?.target?.value || "")}
          />
          <TextField
            label="Text"
            multiline
            fullWidth={true}
            value={text}
            onChange={(e) => setText(e?.target?.value || "")}
          />
        </CardContent>

        <CardActions>
          <Button onClick={saveInfo} className={classes.expand}> Сохранить </Button>
          <Button onClick={() => onCancel()} className={classes.expand}> Отменить </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default InfoEdit;