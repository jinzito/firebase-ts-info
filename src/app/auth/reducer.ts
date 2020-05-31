import { Action } from "redux";
import { SET_USER } from "./action";

import {isEmpty} from "lodash";

export interface AuthState {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
}

export const initialState = (): AuthState => ({
  isAuthLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  isMember: false
});

export default (state = initialState(), action: Action): AuthState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty((action as any)?.payload?.uid),
        isAuthLoading: false
      };
    case "RESTORE_TO_INITIAL_STATE":
      return initialState();
    default:
      return state;
  }
};
