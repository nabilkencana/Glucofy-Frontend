/**
 * Auth service — register & login.
 * Both endpoints are public (no Bearer token required).
 * On success, the accessToken is persisted automatically.
 */

import { apiFetch, setToken, clearToken } from "./client";

export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    auth: false,
    body: input,
  });
  setToken(res.accessToken);
  return res;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: input,
  });
  setToken(res.accessToken);
  return res;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {}
  clearToken();
}
