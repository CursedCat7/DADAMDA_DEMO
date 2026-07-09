import { useEffect } from "react";
import { mockLogin } from "@/lib/api/auth";
import { type MockRole, useAuthStore } from "@/lib/store/auth";

// Docs/04 §63: the demo has no real login, just a persona picker. This
// hook lazily calls POST /auth/mock-login the first time a given role's
// identity is needed and caches it (per role) in localStorage via
// useAuthStore, so every screen that needs "the current user" can just
// read userId without re-logging-in on every visit.
export function useCurrentUserId(role: MockRole = "USER"): string | null {
  const cached = useAuthStore((state) => state.usersByRole[role]);
  const setUserForRole = useAuthStore((state) => state.setUserForRole);

  useEffect(() => {
    if (!cached) {
      mockLogin(role).then((res) => setUserForRole(role, res.user_id, res.nickname));
    }
  }, [role, cached, setUserForRole]);

  return cached?.userId ?? null;
}
