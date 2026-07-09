import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  userId: string | null;
  nickname: string | null;
  setUser: (userId: string, nickname: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      nickname: null,
      setUser: (userId, nickname) => set({ userId, nickname }),
    }),
    { name: "dadamda-auth" },
  ),
);
