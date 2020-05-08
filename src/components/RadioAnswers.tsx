import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Input, Radio, IconButton } from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
  root: {
    marginTop: "2rem"
  },
});

const Answer = ({ onDelete, onChange, text }) => {
  return (
    <div>
      <Radio size="small" checked={false} />
      <Input value={text} onChange={(e) => onChange(e.target.value)} />
      <IconButton onClick={onDelete}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

const RadioAnswers = () => {

  const classes = useStyles();
  const [answers, setAnswers] = useState([]);

  return (
    <div className={classes.root}>
      {answers.map((answerText, i) =>
        <Answer
          key={`answer${i}`}
          onDelete={() => setAnswers(answers.filter((a, index) => i !== index))}
          onChange={(newText) => setAnswers(answers.map((a, index) => i !== index ? a : newText))}
          text={answerText}
        />
      )}
      <IconButton onClick={() => {
        setAnswers([...answers, ""]);
      }}>
        <AddIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export { RadioAnswers };
