/**
 * User & Health Profile service.
 * All endpoints require a valid JWT (handled automatically by the client).
 */

import { apiFetch } from "./client";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Gender = "MALE" | "FEMALE";
export type ActivityLevel = "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImage: string | null;
  createdAt: string;
}

export interface HealthProfileInput {
  age?: number;
  weight?: number;  // kg
  height?: number;  // cm
  gender?: Gender;
  activityLevel?: ActivityLevel;
}

export interface HealthProfile {
  id: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: Gender | null;
  activityLevel: ActivityLevel | null;
  bmi: number | null;
  /** Personalized daily sugar limit (grams). Null until profile is complete. */
  dailySugarLimit: number | null;
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** GET /users/me */
export async function getMyProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/users/me");
}

/**
 * PATCH /users/me/health-profile
 * All fields are optional — only send what changed.
 * BMI and dailySugarLimit are computed by the backend.
 */
export async function updateHealthProfile(
  input: HealthProfileInput
): Promise<HealthProfile> {
  return apiFetch<HealthProfile>("/users/me/health-profile", {
    method: "PATCH",
    body: input,
  });
}
