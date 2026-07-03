/**
 * Nutrition service — scan flow, manual entry, and analytics.
 *
 * Scan label flow (3 steps):
 *   1. getScanUploadUrl()  →  { uploadUrl, s3Key }
 *   2. uploadImageToS3()   →  PUT binary directly to S3 (no auth header)
 *   3. processScan()       →  POST /nutrition/scan { s3Key, ... }
 *
 * The convenience helper `scanLabel()` wraps all three steps.
 */

import { apiFetch, putBinaryToUrl } from "./client";

// ── Shared types ──────────────────────────────────────────────────────────────

export type NutriGrade = "A" | "B" | "C" | "D";
export type EntryMethod = "SCAN" | "MANUAL";

export interface ConsumptionLog {
  id: string;
  productName: string;
  nutriGrade: NutriGrade;
  servingSizeMl: number;
  sugarPer100ml: number;
  saltPer100ml: number;
  saturatedFatPer100ml: number;
  entryMethod: EntryMethod;
  consumedAt: string;
  /** Present only on SCAN entries (pre-signed read URL). */
  scanImageUrl?: string;
}

// ── Step 1: Get pre-signed upload URL ────────────────────────────────────────

export interface ScanUploadUrlResponse {
  uploadUrl: string;
  s3Key: string;
}

export type ImageContentType = "image/jpeg" | "image/png";

/** GET /nutrition/scan-upload-url */
export async function getScanUploadUrl(
  contentType: ImageContentType = "image/jpeg"
): Promise<ScanUploadUrlResponse> {
  return apiFetch<ScanUploadUrlResponse>("/nutrition/scan-upload-url", {
    params: { contentType },
  });
}

// ── Step 2: Upload image binary to S3 (direct PUT, no API auth) ───────────────

/** PUT <uploadUrl> — sends the image file directly to S3. */
export async function uploadImageToS3(
  uploadUrl: string,
  file: File | Blob,
  contentType: ImageContentType = "image/jpeg"
): Promise<void> {
  await putBinaryToUrl(uploadUrl, file, contentType);
}

// ── Step 3: Trigger OCR + grading ────────────────────────────────────────────

export interface ProcessScanInput {
  s3Key: string;
  productName?: string;
  /** Required if Gemini fails to detect serving size from the label. */
  servingSizeMl?: number;
}

/** POST /nutrition/scan */
export async function processScan(input: ProcessScanInput): Promise<ConsumptionLog> {
  return apiFetch<ConsumptionLog>("/nutrition/scan", {
    method: "POST",
    body: input,
  });
}

// ── Convenience: full 3-step scan ─────────────────────────────────────────────

export interface ScanLabelInput {
  file: File | Blob;
  contentType?: ImageContentType;
  productName?: string;
  servingSizeMl?: number;
}

/**
 * Runs all three scan steps in order.
 * Throws ApiError at the failing step — caller can inspect `error.status`.
 */
export async function scanLabel(input: ScanLabelInput): Promise<ConsumptionLog> {
  const ct = input.contentType ?? "image/jpeg";
  const { uploadUrl, s3Key } = await getScanUploadUrl(ct);
  await uploadImageToS3(uploadUrl, input.file, ct);
  return processScan({
    s3Key,
    productName: input.productName,
    servingSizeMl: input.servingSizeMl,
  });
}

// ── Manual entry ──────────────────────────────────────────────────────────────

export interface ManualEntryInput {
  productName: string;
  servingSizeMl: number;
  sugarPer100ml: number;
  saltPer100ml: number;
  saturatedFatPer100ml: number;
}

/** POST /nutrition/manual */
export async function createManualEntry(
  input: ManualEntryInput
): Promise<ConsumptionLog> {
  return apiFetch<ConsumptionLog>("/nutrition/manual", {
    method: "POST",
    body: input,
  });
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface LastConsumptionResponse {
  data: ConsumptionLog[];
  count: number;
}

/** GET /nutrition/last-consumption — 10 most recent logs. */
export async function getLastConsumption(): Promise<LastConsumptionResponse> {
  return apiFetch<LastConsumptionResponse>("/nutrition/last-consumption");
}

export interface DashboardSummary {
  consumedToday: number;
  dailyLimit: number;
  limitExceeded: boolean;
  currentStreak: number;
  longestStreak: number;
  lastConsumptionAt: string | null;
}

/** GET /nutrition/dashboard-summary */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiFetch<DashboardSummary>("/nutrition/dashboard-summary");
}

export interface WeeklyDataPoint {
  date: string;
  totalSugar: number;
  logCount: number;
  exceeded: boolean;
}

export interface WeeklyChartResponse {
  data: WeeklyDataPoint[];
  dailyLimit: number;
}

/** GET /nutrition/charts/weekly — last 7 days of sugar data. */
export async function getWeeklyChart(): Promise<WeeklyChartResponse> {
  return apiFetch<WeeklyChartResponse>("/nutrition/charts/weekly");
}

export interface DailyPatternPoint {
  period: "morning" | "afternoon" | "night";
  timeRange: string;
  totalSugar: number;
  logCount: number;
  percentage: number;
}

export interface DailyPatternResponse {
  data: DailyPatternPoint[];
  /** ISO date string, e.g. "2024-01-15" */
  date: string;
}

/**
 * GET /nutrition/daily-pattern
 * @param date  YYYY-MM-DD — defaults to today on the server if omitted.
 */
export async function getDailyPattern(date?: string): Promise<DailyPatternResponse> {
  return apiFetch<DailyPatternResponse>("/nutrition/daily-pattern", {
    params: date ? { date } : undefined,
  });
}
