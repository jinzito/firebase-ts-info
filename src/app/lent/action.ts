import { InfoVO, VoteVO } from "../model";
import { MonthGroupedVO } from "./components/MonthGrouped";
import { getVotes, getInfos } from "../../config/firebase";

export type LentItemVO = VoteVO | InfoVO;

export interface LentState {
  infosList: InfoVO[];
  isInfosLoading: boolean;
  infosLoadingError?: Error,

  votesList: VoteVO[];
  votesLoadingError?: Error,
  isVotesLoading: boolean;

  topList: LentItemVO[];
  groupedList: MonthGroupedVO[];
}

export const GET_VOTES_LIST: string = "lent/GET_VOTES_LIST";
export const GET_VOTES_LIST_SUCCESS: string = "lent/GET_VOTES_LIST_SUCCESS";
export const GET_VOTES_LIST_FAILURE: string = "lent/GET_VOTES_LIST_FAILURE";
export const GET_INFOS_LIST: string = "lent/GET_INFOS_LIST";
export const GET_INFOS_LIST_SUCCESS: string = "lent/GET_INFOS_LIST_SUCCESS";
export const GET_INFOS_LIST_FAILURE: string = "lent/GET_INFOS_LIST_FAILURE";

export const getVotesList = () => async dispatch => {
  dispatch({ type: GET_VOTES_LIST });
  try {
    const votesList: VoteVO[] = await getVotes();
    dispatch({ type: GET_VOTES_LIST_SUCCESS, payload: votesList });
  } catch (e) {
    dispatch({ type: GET_VOTES_LIST_FAILURE, payload: e });
  }
};

export const getInfosList = () => async dispatch => {
  dispatch({ type: GET_INFOS_LIST });
  try {
    const infosList: InfoVO[] = await getInfos();
    dispatch({ type: GET_INFOS_LIST_SUCCESS, payload: infosList });
  } catch (e) {
    dispatch({ type: GET_INFOS_LIST_FAILURE, payload: e });
  }
};