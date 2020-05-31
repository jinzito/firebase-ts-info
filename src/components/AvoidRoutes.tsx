import React, { FC } from 'react';
import { Route, Switch } from "react-router-dom";

interface AvoidRoutesProps {
  routes: string[] | string;
}

export const AvoidRoutes: FC<AvoidRoutesProps> =
  ({
     routes,
     children
   }) => (
    <Switch>
      <Route exact={true} render={null} path={routes} />
      <Route render={() => children as any} />
    </Switch>
  );