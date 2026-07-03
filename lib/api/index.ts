/**
 * Glucofy API — public barrel export.
 *
 * Usage:
 *   import { login, scanLabel, getDashboardSummary, ApiError } from "@/lib/api";
 */

// Core client helpers
export { ApiError, getToken, setToken, clearToken, BASE_URL } from "./client";

// Auth
export { register, login, logout } from "./auth.service";
export type { AuthResponse, RegisterInput, LoginInput } from "./auth.service";

// User & health profile
export { getMyProfile, updateHealthProfile } from "./user.service";
export type {
  UserProfile,
  HealthProfile,
  HealthProfileInput,
  Gender,
  ActivityLevel,
} from "./user.service";

// Nutrition — scan flow
export {
  getScanUploadUrl,
  uploadImageToS3,
  processScan,
  scanLabel,
} from "./nutrition.service";
export type {
  ScanUploadUrlResponse,
  ProcessScanInput,
  ScanLabelInput,
  ImageContentType,
} from "./nutrition.service";

// Nutrition — manual entry
export { createManualEntry } from "./nutrition.service";
export type { ManualEntryInput } from "./nutrition.service";

// Nutrition — analytics
export {
  getLastConsumption,
  getDashboardSummary,
  getWeeklyChart,
  getDailyPattern,
} from "./nutrition.service";
export type {
  ConsumptionLog,
  NutriGrade,
  EntryMethod,
  LastConsumptionResponse,
  DashboardSummary,
  WeeklyChartResponse,
  WeeklyDataPoint,
  DailyPatternResponse,
  DailyPatternPoint,
} from "./nutrition.service";

// Premium
export { getAIRecommendations } from "./summarize.service";
export type { SummarizeResponse } from "./summarize.service";
