import React from 'react';
import { makeStyles, withStyles, lighten } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { VoteSummaryVO } from "../app/model";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: "2rem"
  },
  title: {
    fontSize: 16,
  },
});

interface VoteViewSummaryProps {
  voteSummary: VoteSummaryVO;
  answerIndex: number;
  answers: string[];
}

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#ff6c5c',
  },
})(LinearProgress);

const VoteViewSummary: React.FC<VoteViewSummaryProps> =
  ({
     voteSummary: { totalMembers, totalSquares, votesCount, votesCountBySquare } = {},
     answerIndex = -1,
     answers = []
   }: VoteViewSummaryProps) => {
    const classes = useStyles();
    return (
      <>
        <Typography className={classes.title} gutterBottom>
          {`Total voted members:${totalMembers}`}
        </Typography>
        {answers.map((answerText, i) =>
          <div key={`summary-item-${i}`}>
            <div>{answerText} {i == answerIndex && ` - You choose`}</div>
            <BorderLinearProgress
              value={totalMembers > 0  && votesCount[i] > 0 ? votesCount[i] * 100 / totalMembers : 0}
              variant="determinate"
            />
            <BorderLinearProgress
              color={`secondary`}
              value={totalSquares > 0 && votesCountBySquare[i] > 0 ? votesCountBySquare[i] * 100 / totalSquares : 0}
              variant="determinate"
            />
          </div>
        )}
      </>
    );
  };

export default VoteViewSummary;