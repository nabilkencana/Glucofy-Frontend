// Client for the Glucofy BFF. Every call goes to same-origin Next routes
// (app/api/v1/[...path]/route.ts) which talk to the real backend server-side.
// The session lives in an httpOnly cookie — no token ever exists client-side.

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };
  if (typeof init.body === "string") headers["Content-Type"] = "application/json";

  const res = await fetch(`/api/v1${path}`, { ...init, headers });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const j = await res.json();
      message = Array.isArray(j.message) ? j.message.join(", ") : j.message || message;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, message);
  }
  return res.json() as Promise<T>;
}

// ---- types (shapes verified against the live BE) ----

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  profileImage: string | null;
  createdAt: string;
}

export type NutriGrade = "A" | "B" | "C" | "D";

export interface ConsumptionLog {
  id: string;
  productName: string;
  nutriGrade: NutriGrade;
  servingSizeMl: number;
  sugarPer100ml: number;
  saltPer100ml: number;
  saturatedFatPer100ml: number;
  entryMethod: "SCAN" | "MANUAL";
  consumedAt: string;
  scanImageUrl?: string;
}

export interface DashboardSummary {
  consumedToday: number;
  dailyLimit: number;
  limitExceeded: boolean;
  currentStreak: number;
  longestStreak: number;
  lastConsumptionAt: string | null;
}

export interface WeeklyChartDay {
  date: string; // YYYY-MM-DD
  totalSugar: number;
  logCount: number;
  exceeded: boolean;
}

export interface WeeklyChartResponse {
  data: WeeklyChartDay[];
  dailyLimit: number;
}

// ---- auth (session cookie is set/cleared by the proxy, never exposed) ----

export const login = (email: string, password: string) =>
  api<{ ok: true }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (email: string, password: string, name: string) =>
  api<{ ok: true }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });

export const logout = () => api<{ ok: true }>("/auth/logout", { method: "POST" });

// ---- users ----

export const getMe = () => api<UserProfile>("/users/me");

export interface HealthProfile {
  age?: number;
  weight?: number;
  height?: number;
  gender?: "MALE" | "FEMALE";
  activityLevel?: "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE";
  dailySugarLimit?: number;
}

export const getHealthProfile = () => api<HealthProfile>("/users/me/health-profile");

export const updateHealthProfile = (input: {
  age?: number;
  weight?: number;
  height?: number;
  gender?: "MALE" | "FEMALE";
  activityLevel?: "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE";
}) =>
  api<{ dailySugarLimit: number }>("/users/me/health-profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });

// ---- nutrition ----

export const getLastConsumption = () =>
  api<{ data: ConsumptionLog[]; count: number }>("/nutrition/last-consumption");

export const getDashboardSummary = () =>
  api<DashboardSummary>("/nutrition/dashboard-summary");

export const getWeeklyChart = () => api<WeeklyChartResponse>("/nutrition/charts/weekly");

export const logManualEntry = (input: {
  productName: string;
  servingSizeMl: number;
  sugarPer100ml: number;
  saltPer100ml: number;
  saturatedFatPer100ml: number;
}) =>
  api<ConsumptionLog>("/nutrition/manual", {
    method: "POST",
    body: JSON.stringify(input),
  });

/** Uploads the label image; the server handles the pre-signed URL + S3 PUT. */
export async function uploadScan(file: File): Promise<{ s3Key: string }> {
  const res = await fetch("/api/scan-upload", {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) {
    let message = "Upload failed";
    try {
      message = (await res.json()).message ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }
  return res.json();
}

export const processScan = (input: {
  s3Key: string;
  productName?: string;
  servingSizeMl?: number;
}) =>
  api<ConsumptionLog>("/nutrition/scan", {
    method: "POST",
    body: JSON.stringify(input),
  });
