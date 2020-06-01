import { Action } from "redux";
import { SET_USER, SET_USER_ROLE } from "./action";

import {isEmpty} from "lodash";
import { UserClaims } from "../model";

interface PayloadAction<P> extends Action {
  payload:P;
}

export interface AuthState {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isCurator: boolean;
}

export const initialState = (): AuthState => ({
  isAuthLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isMember: false,
  isCurator: false

});

export default (state = initialState(), action: Action): AuthState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty((action as any)?.payload?.uid),
        isAuthLoading: false
      };
    case SET_USER_ROLE:
      const { isAdmin, isCurator, isMember }: UserClaims =
        (action as PayloadAction<UserClaims>)?.payload || {};
      return {
        ...state, isMember, isAdmin, isCurator
      };
    case "RESTORE_TO_INITIAL_STATE":
      return initialState();
    default:
      return state;
  }
};
