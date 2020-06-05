export interface AuthState {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isCurator: boolean;
  userName: string;
}