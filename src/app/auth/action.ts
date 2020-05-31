import { IdTokenResult } from "@firebase/auth-types";
import { DocumentSnapshot, DocumentData } from '@firebase/firestore-types';
import { firestore } from "firebase";
import { MemberVO } from "../model";

export const SET_USER: string = "SET_USER";
export const SET_USER_ROLE: string = "SET_USER_ROLE";
export const GET_USER_DATA: string = "GET_USER_DATA";
export const GET_USER_DATA_SUCCESS: string = "GET_USER_DATA_SUCCESS";
export const GET_USER_DATA_FAILURE: string = "GET_USER_DATA_FAILURE";

export const setUserRoleAction = (claims: any) => async dispatch => {
  dispatch( { type: SET_USER_ROLE, payload: claims })
};

export const setUserAction = (user: any) => async dispatch => {
  dispatch( { type: SET_USER, payload: user })
  try {
    const token: IdTokenResult = await user.getIdTokenResult();
    dispatch(setUserRoleAction(token?.claims));
  } catch (e) {
    console.error(e?.message);
  }
};

export const getUserDataAction = (uid: string) => async dispatch => {
  dispatch({ type: GET_USER_DATA });
  try {
    const memberDoc: DocumentSnapshot<DocumentData> = await firestore().collection('members').doc(uid).get();
    const member: MemberVO = memberDoc.exists && memberDoc.data() as MemberVO;
    dispatch({ type: GET_USER_DATA_SUCCESS, payload: member });
  } catch (e) {
    dispatch({ type: GET_USER_DATA_FAILURE, payload: e });
  }
};