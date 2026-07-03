/**
 * Summarize service — Premium AI health recommendations.
 * Requires an active premium subscription; returns 403 otherwise.
 */

import { apiFetch } from "./client";

export interface SummarizeResponse {
  recommendation: string;
  bmi: number;
  bmiCategory: string;
  avgDailySugar: number;
  tips: string[];
}

/**
 * POST /summarize
 * Generates personalized AI recommendations from the user's consumption history,
 * BMI, and activity level. Premium users only — throws ApiError(403) if not subscribed.
 */
export async function getAIRecommendations(): Promise<SummarizeResponse> {
  return apiFetch<SummarizeResponse>("/summarize", { method: "POST" });
}
