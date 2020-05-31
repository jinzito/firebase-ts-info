import React, { FC } from 'react';
import Typography from '@material-ui/core/Typography';

import "./GeneralTitle.scss";

export const GeneralTitle: FC = () =>
  <div className="general-title">
    <Typography color="textPrimary" align="center" variant="h4" className="general-title__caption">
      Товарищество ЖК “УРУЧСКИЙ”
    </Typography>
    <Typography color="textSecondary" align="center" className="general-title__about">
      Данный портал предназначен для ознакомления с новостями в товариществе, а так же для
      проведения онлайн голосования собственников товарищества.
    </Typography>
  </div>;