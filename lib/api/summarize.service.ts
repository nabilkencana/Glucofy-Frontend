/**
 * Summarize service — Premium Personalization & Decision Support.
 * Requires an active premium subscription; returns 403 otherwise.
 */

import { apiFetch } from "./client";

export interface SummarizeResponse {
  recommendation: string;
  // bmi is null until the user's health profile has weight + height set.
  bmi: number | null;
  bmiCategory: string;
  avgDailySugar: number | null;
  tips: string[];
}

/**
 * POST /summarize
 * Generates personalized recommendations & decision support from the user's consumption history,
 * BMI, and activity level. Premium users only — throws ApiError(403) if not subscribed.
 */
export async function getAIRecommendations(): Promise<SummarizeResponse> {
  return apiFetch<SummarizeResponse>("/summarize", { method: "POST" });
}
