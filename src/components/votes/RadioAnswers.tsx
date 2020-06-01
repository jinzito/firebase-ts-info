import React from "react";
import { Input, Radio, IconButton } from "@material-ui/core";

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const Answer = ({ onDelete, onChange, text }) =>
  <div>
    <Radio size="small" checked={false} />
    <Input value={text} onChange={(e) => onChange(e.target.value)} />
    <IconButton onClick={onDelete}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  </div>;

interface RadioAnswersProps {
  answers: string[],
  setAnswers: (answers: string[]) => void,
  className?: string
}

const RadioAnswers: React.FC<RadioAnswersProps> = ({ answers, setAnswers, className }: RadioAnswersProps) =>
  <div className={className}>
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
  </div>;

export { RadioAnswers };
