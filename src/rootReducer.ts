import { combineReducers } from 'redux';

import authReducer from './app/auth/reducer';
import lentReducer from './app/lent/reducer';
import { AuthState } from "./app/auth/model";
import { LentState } from "./app/lent/action";

export interface RootState {
  auth: AuthState;
  lent: LentState;
  router: any;
}

export default combineReducers({
  auth: authReducer,
  lent: lentReducer
});