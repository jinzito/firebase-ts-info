import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { InfoVO } from "../../app/model";
import dateFormat from "dateformat";

interface Props {
  info: InfoVO;
}

const InfoView: React.FC<Props> = ({ info }: Props) => {
  const { title, text, date } = info || {};
  return (
    <Container style={{ paddingBottom: "2rem" }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {dateFormat(date?.toDate(), "yyyy-mm-dd") }
            {` `}
            {title}
          </Typography>
          <Typography gutterBottom>
            {text}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default InfoView;