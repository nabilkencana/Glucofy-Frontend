/**
 * Glucofy API — base HTTP client
 *
 * - Reads the JWT from localStorage (key: "glucofy:token")
 * - Automatically injects "Authorization: Bearer <token>" on every request
 *   except when `auth: false` is passed explicitly.
 * - Throws ApiError on non-2xx responses.
 */

export const BASE_URL = "/api/v1";

export const TOKEN_KEY = "glucofy:token";

// ── Token helpers (localStorage — client-side only) ──────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Error type ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Pass `false` to skip the Authorization header (for auth endpoints). */
  auth?: boolean;
  body?: unknown;
  /** Query params appended to the URL. */
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiFetch<T>(
  path: string,
  { auth = true, body, params, headers: extraHeaders, ...rest }: RequestOptions = {}
): Promise<T> {
  // Build URL + query string
  let url = `${BASE_URL}${path}`;
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");
    if (qs) url += `?${qs}`;
  }

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Parse response (may be empty for 204)
  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    // ponytail: clear token on 401 so callers don't need to handle it
    if (res.status === 401) clearToken();

    const message =
      (data as { message?: string })?.message ??
      `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

/**
 * PUT raw binary to a pre-signed S3 URL (no auth header, no JSON wrapping).
 * Throws ApiError on non-2xx.
 */
export async function putBinaryToUrl(
  url: string,
  file: File | Blob,
  contentType: string
): Promise<void> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!res.ok) {
    throw new ApiError(res.status, `S3 upload failed with status ${res.status}`);
  }
}
