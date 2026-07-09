import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MockRole = "USER" | "MERCHANT";

type CachedUser = { userId: string; nickname: string };

type AuthState = {
  usersByRole: Partial<Record<MockRole, CachedUser>>;
  setUserForRole: (role: MockRole, userId: string, nickname: string) => void;
};

// Cached per-role rather than a single "current user": the demo script
// switches between the consumer view (USER) and the merchant view
// (MERCHANT) in the same browser tab, and each should keep its own
// identity instead of clobbering the other on every visit.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usersByRole: {},
      setUserForRole: (role, userId, nickname) =>
        set((state) => ({
          usersByRole: { ...state.usersByRole, [role]: { userId, nickname } },
        })),
    }),
    { name: "dadamda-auth" },
  ),
);
