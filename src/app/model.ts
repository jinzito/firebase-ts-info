import { QueryDocumentSnapshot, DocumentData, Timestamp } from '@firebase/firestore-types';

export interface FirebaseVO {
  doc: QueryDocumentSnapshot<DocumentData>
}

export interface MemberVO extends DocumentData {
  uid?: string
  displayName?: string;
  phoneNumber?: string;
  house?: string;
  apt?: string;
  aptSquare?: number;
  isAdmin?: boolean;
  isMember?: boolean;
  isCurator?: boolean;
}

export interface VoteVO extends DocumentData {
  id?: string;
  beginDate: Timestamp;
  endDate: Timestamp;
  title: string;
  answers: string[];
  data?: any;
  ref?: any;
}

export interface VoteDataVO extends DocumentData {
  voteId?: string;
  uid?: string;
  answerIndex: number;
}

export interface VoteSummaryVO extends DocumentData {
  voteId?: string;
  totalMembers?: number;
  totalSquares?: number;
  votedMembers?: number;
  votesCount?: number[];
  votesCountBySquare?: number[];
}

export interface VoteDetailsVO extends DocumentData {
  data?: VoteDataVO;
  dataError?: Error;
  summary?: VoteSummaryVO;
  summaryError?: Error;
}