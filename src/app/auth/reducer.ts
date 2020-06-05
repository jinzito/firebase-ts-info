import { Action } from "redux";
import { SET_USER, SET_USER_ROLE } from "./action";

import {isEmpty} from "lodash";
import { UserClaims, PayloadAction } from "../model";
import { AuthState } from "./model";

export const initialState = (): AuthState => ({
  isAuthLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isMember: false,
  isCurator: false,
  userName: undefined
});

export default (state = initialState(), action: Action): AuthState => {
  switch (action.type) {
    case SET_USER:
      const { uid, displayName }: any = (action as PayloadAction<any>)?.payload || {}
      return {
        ...state,
        isAuthenticated: !isEmpty(uid),
        userName: displayName,
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
