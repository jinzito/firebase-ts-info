import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { VoteVO, VoteSummaryVO, VoteDetailsVO } from "../../app/model";
import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { placeVote, getVoteDetails } from "../../config/firebase";
import VoteViewSummary from "./VoteViewSummary";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: "2rem"
  },
  title: {
    fontSize: 16,
  },
  progress: {
    // width: "100%"
  }
});

interface VoteViewProps {
  vote: VoteVO;
}

const VoteView: React.FC<VoteViewProps> = ({ vote }: VoteViewProps) => {
  const classes = useStyles();
  const { title, answers, endDate } = vote || {};
  const msLeft: number = endDate?.seconds - new Date().getTime() / 1000;
  const daysLeft = Math.ceil(msLeft / (24 * 60 * 60));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDetailsLoaded, setIsDetailsLoaded] = useState<boolean>(false);
  const [isVoteMode, setIsVoteMode] = useState<boolean>(false);
  const [savedAnswerIndex, setSavedAnswerIndex] = useState<number>();
  const [answerIndex, setAnswerIndex] = useState<number>(-1);
  const [summary, setSummary] = useState<VoteSummaryVO>();

  const placeVoteRequest = () => {
    (async () => {
      try {
        setIsLoading(true);
        const placeVoteRequest = { voteId: vote.id, answerIndex };
        const result = await placeVote(placeVoteRequest);
        const detailsInfo: VoteDetailsVO = result.data;
        setIsDetailsLoaded(true);
        setSavedAnswerIndex(detailsInfo?.data?.answerIndex);
        setSummary(detailsInfo?.summary);
      } catch (e) {
        console.log(">>> placeVote error", e);
      } finally {
        setIsLoading(false);
        setIsVoteMode(false);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      const d = await getVoteDetails(vote.id);
      setIsDetailsLoaded(true);
      setSavedAnswerIndex(d?.data?.answerIndex);
      setIsVoteMode(!d?.data?.answerIndex)
      setSummary(d?.summary);
    })();
  }, [vote.id]);

  return (
    <Container>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title} gutterBottom>
            {title}
          </Typography>
          {isLoading &&
          <LinearProgress className={classes.progress} />
          }
          {isVoteMode &&
          <RadioGroup value={answerIndex} onChange={(e) => setAnswerIndex(Number(e?.target.value))}>
            {answers.map((answerText, i) =>
              <FormControlLabel
                key={`check-${i}`}
                value={i}
                control={<Radio disabled={!isDetailsLoaded} />}
                label={answerText}
              />
            )}
          </RadioGroup>
          }
          {isDetailsLoaded && !isVoteMode &&
          <VoteViewSummary
            voteSummary={summary}
            answerIndex={savedAnswerIndex}
            answers={answers}
          />
          }
          <Typography variant="body2" component="p">
            {`days left:${daysLeft}`}
          </Typography>
        </CardContent>
        <CardActions>
          {(isDetailsLoaded && isVoteMode && answerIndex !== savedAnswerIndex) &&
          <Button
            disabled={isDetailsLoaded && answerIndex < 0}
            onClick={() => placeVoteRequest()}
          >
            {isDetailsLoaded && answerIndex !== savedAnswerIndex && isVoteMode ? 'Сохранить измемения' : 'Проголосовать'}
          </Button>
          }
          {isDetailsLoaded && isVoteMode && savedAnswerIndex >= 0 &&
          <Button onClick={() => setIsVoteMode(false)} size="small">
            Отменить
          </Button>
          }
          {isDetailsLoaded && !isVoteMode &&
          <Button onClick={() => {
            setIsVoteMode(true);
            setAnswerIndex(savedAnswerIndex);
          }} size="small">
            Изменить выбор
          </Button>
          }

        </CardActions>
      </Card>
    </Container>
  );
};

export default VoteView;