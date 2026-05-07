import { apiRequest } from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export function register(input: { name: string; email: string; password: string }) {
  return apiRequest<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function login(input: { email: string; password: string }) {
  return apiRequest<AuthUser>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function logout() {
  return apiRequest<null>("/auth/logout", {
    method: "POST"
  });
}

export function getCurrentUser() {
  return apiRequest<AuthUser | null>("/auth/me");
}
