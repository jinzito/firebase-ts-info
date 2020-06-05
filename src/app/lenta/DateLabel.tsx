import React from 'react';
import Typography from '@material-ui/core/Typography';
import './DateLabel.scss';
import dateFormat from "dateformat";

interface DateLabelProps {
  date?: Date;
}

const DateLabel: React.FC<DateLabelProps> = ({ date }: DateLabelProps) =>
  <Typography className="date-label">
    { dateFormat(date, "mmmm yyyy") }
  </Typography>;

export default DateLabel;