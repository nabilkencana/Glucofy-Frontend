import { NextResponse, type NextRequest } from "next/server";

// Server-side proxy to the Glucofy backend (BFF pattern). The browser only
// ever talks to this same-origin route: the Railway origin, the JWT, and all
// Authorization headers stay on the server. The token lives in an httpOnly
// cookie, so it is invisible to client-side JS and DevTools consoles.
const API_ORIGIN = process.env.API_ORIGIN ?? "https://glucofy-be-production.up.railway.app";
const TOKEN_COOKIE = "glucofy_token";

// Railway spins the app down when idle; the first request can 502/503/504
// ("Application failed to respond") while it cold-starts. Retry those so the
// wake-up is transparent. We do NOT retry 500 — that's a real app error
// (e.g. the scan/OCR crash) and retrying could double-write on POSTs.
const RETRIABLE = new Set([502, 503, 504]);

async function fetchUpstream(url: string, init: RequestInit): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 700 * attempt));
    try {
      const ac = new AbortController();
      const timer = setTimeout(() => ac.abort(), 25_000);
      const res = await fetch(url, { ...init, signal: ac.signal });
      clearTimeout(timer);
      if (RETRIABLE.has(res.status) && attempt < 2) continue;
      return res;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError ?? new Error("upstream unreachable");
}

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const pathname = path.join("/");

  // Local-only endpoint: the BE has no logout — just drop the session cookie.
  if (pathname === "auth/logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  const headers: Record<string, string> = {};
  const contentType = req.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  let upstream: Response;
  try {
    upstream = await fetchUpstream(`${API_ORIGIN}/api/v1/${pathname}${req.nextUrl.search}`, {
      method: req.method,
      headers,
      body,
    });
  } catch {
    // Cold start never finished / network failure — a clean, retryable message.
    return NextResponse.json(
      { message: "Server sedang sibuk atau baru bangun. Coba lagi sebentar." },
      { status: 503 }
    );
  }

  // Auth endpoints: capture the token into the httpOnly cookie and return a
  // bare success — the access token itself never reaches the browser.
  if ((pathname === "auth/login" || pathname === "auth/register") && upstream.ok) {
    const data = await upstream.json();
    const res = NextResponse.json({ ok: true }, { status: upstream.status });
    res.cookies.set(TOKEN_COOKIE, data.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expiresIn ?? 604800,
      path: "/",
    });
    return res;
  }

  const text = await upstream.text();
  const upstreamType = upstream.headers.get("content-type") ?? "";
  // Railway's 5xx pages are HTML/plain text — normalise them to JSON so the
  // client always gets a parseable, friendly error instead of a markup dump.
  if (!upstream.ok && !upstreamType.includes("application/json")) {
    return NextResponse.json(
      { message: "Server sedang sibuk atau baru bangun. Coba lagi sebentar." },
      { status: upstream.status }
    );
  }
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": upstreamType || "application/json" },
  });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
