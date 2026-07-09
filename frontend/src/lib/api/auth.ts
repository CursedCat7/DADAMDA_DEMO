import { apiFetch } from "./client";

export type MockLoginResponse = {
  user_id: string;
  nickname: string;
  role: "USER" | "MERCHANT" | "ADMIN";
};

export function mockLogin(role: "USER" | "MERCHANT" = "USER"): Promise<MockLoginResponse> {
  return apiFetch<MockLoginResponse>("/auth/mock-login", {
    method: "POST",
    body: JSON.stringify({ role }),
  });
}
