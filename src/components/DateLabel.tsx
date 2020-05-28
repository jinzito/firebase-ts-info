import React from 'react';
import Typography from '@material-ui/core/Typography';
import './DateLabel.scss';


interface DateLabelProps {
  date?: Date;
}

const DateLabel: React.FC<DateLabelProps> = ({ date }: DateLabelProps) =>
  <Typography className="date-label">
    март 2020
  </Typography>;

export default DateLabel;