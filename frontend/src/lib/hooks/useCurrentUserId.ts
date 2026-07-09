import { useEffect } from "react";
import { mockLogin } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth";

// Docs/04 §63: the demo has no real login, just a persona picker. This
// hook lazily calls POST /auth/mock-login the first time a user identity
// is needed and caches it in localStorage via useAuthStore, so every
// screen that needs "the current user" can just read userId.
export function useCurrentUserId(): string | null {
  const userId = useAuthStore((state) => state.userId);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!userId) {
      mockLogin("USER").then((res) => setUser(res.user_id, res.nickname));
    }
  }, [userId, setUser]);

  return userId;
}
