import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type UserInfo } from "../types/user";

interface UserStore {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const userState: Partial<UserStore> = JSON.parse(
  localStorage.getItem("auth-storage") || "{}"
);

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isAuthenticated: userState.isAuthenticated || false,
      user: userState.user || null,
      token: userState.token || null,
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({}),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);
