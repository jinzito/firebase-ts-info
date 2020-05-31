import { combineReducers } from 'redux';

import authReducer from './app/auth/reducer';

export interface RootState {
  auth: any;
  router: any;
}

export default combineReducers({
  auth: authReducer
});