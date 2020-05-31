import React, { FC } from "react";

export interface AppContext {
  user: any;
  isAuthenticated: boolean;
  isMember: boolean;
  isAdmin: boolean;
  isCurator: boolean;
}

const appContext = React.createContext<AppContext | null>(null);

export const AppContextProvider = appContext.Provider;
export const AppContextConsumer = appContext.Consumer;

export interface AppContext {
  user: any;
  isAuthenticated: boolean;
  isMember: boolean;
  isAdmin: boolean;
  isCurator: boolean;
  userName: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function withContext<
  P extends { appContext?: AppContext },
  R = Omit<P, 'appContext'>
  >(
  Component: React.ComponentClass<P> | FC<P>
): FC<R> {
  return function BoundComponent(props: R) {
    return (
      <AppContextConsumer>
        {value => value && <Component {...props as unknown as P} appContext={value} />}
      </AppContextConsumer>
    );
  };
}