import type { UserInfo } from "../../types";

export interface UserStore {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  error: string | null;

  setError: (error: string | null) => void;
  clearError: () => void;
}
