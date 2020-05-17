import { QueryDocumentSnapshot, DocumentData } from '@firebase/firestore-types';

export interface FirebaseVO {
  doc: QueryDocumentSnapshot<DocumentData>
}

export interface MemberVO extends DocumentData {
  uid?: string
  displayName?: string;
  phoneNumber?: string;
  house?: string;
  apt?: string;
  aptSquare?: string;
  isAdmin?: boolean;
  isMember?: boolean;
  isCurator?: boolean;
}

export interface VoteVO extends DocumentData {
  startDate: Date,
  endDate: Date,
  title: string;
  answers: string[];
}