import { QueryDocumentSnapshot, DocumentData } from '@firebase/firestore-types';

export interface FirebaseVO {
  doc: QueryDocumentSnapshot<DocumentData>
}

export interface MemberVO extends DocumentData {
  name?: string;
  email?: string;
  phone?: string;
  house?: string;
  apt?: string;
  aptSquare?: string;
  isAdmin?: boolean;
  isMember?: boolean;
  isCurator?: boolean;
}