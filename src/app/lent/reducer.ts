import {
  LentState,
  GET_VOTES_LIST,
  GET_VOTES_LIST_SUCCESS,
  GET_VOTES_LIST_FAILURE, GET_INFOS_LIST, GET_INFOS_LIST_SUCCESS, GET_INFOS_LIST_FAILURE
} from "./action";
import { Action } from "redux";
import { PayloadAction, VoteVO, InfoVO } from "../model";

export const initialState = (): LentState => ({
  infosList: [],
  isInfosLoading: false,
  votesList: [],
  isVotesLoading: false,
  topList: [],
  groupedList: []
});

export default (state = initialState(), action: Action): LentState => {
  switch (action.type) {
    case GET_VOTES_LIST: return {
      ...state,
      isVotesLoading: true,
      votesLoadingError: undefined
    }
    case GET_VOTES_LIST_SUCCESS: return {
      ...state,
      isVotesLoading: false,
      votesList: (action as PayloadAction<VoteVO[]>)?.payload || [],
      votesLoadingError: undefined
    }
    case GET_VOTES_LIST_FAILURE: return {
      ...state,
      votesList: [],
      isVotesLoading: false,
      votesLoadingError: (action as PayloadAction<Error>)?.payload
    }
    case GET_INFOS_LIST: return {
      ...state,
      isInfosLoading: true,
      infosLoadingError: undefined
    }
    case GET_INFOS_LIST_SUCCESS: return {
      ...state,
      isInfosLoading: false,
      infosLoadingError: undefined,
      infosList: (action as PayloadAction<InfoVO[]>)?.payload || [],
    }
    case GET_INFOS_LIST_FAILURE: return {
      ...state,
      isInfosLoading: false,
      infosList: [],
      infosLoadingError: (action as PayloadAction<Error>)?.payload
    }
    default:
      return state;
  }
};
