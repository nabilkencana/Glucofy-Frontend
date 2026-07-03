import { NextResponse, type NextRequest } from "next/server";

// Server-side scan upload: fetches the pre-signed URL from the BE and relays
// the image bytes to S3 — the AWS URL and the JWT never reach the browser.
// (The S3 bucket has no CORS anyway, so a direct browser PUT would fail.)
const API_ORIGIN = process.env.API_ORIGIN ?? "https://glucofy-be-production.up.railway.app";
const TOKEN_COOKIE = "glucofy_token";

export async function POST(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const contentType = req.headers.get("content-type") ?? "image/jpeg";
  if (!["image/jpeg", "image/png"].includes(contentType)) {
    return NextResponse.json({ message: "Only JPEG or PNG images are allowed" }, { status: 400 });
  }

  // Step 1: pre-signed URL from the BE.
  const urlRes = await fetch(
    `${API_ORIGIN}/api/v1/nutrition/scan-upload-url?contentType=${encodeURIComponent(contentType)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!urlRes.ok) {
    const body = await urlRes.text();
    return new NextResponse(body, {
      status: urlRes.status,
      headers: { "Content-Type": "application/json" },
    });
  }
  const { uploadUrl, s3Key } = await urlRes.json();

  // Step 2: relay the image to S3.
  const s3Res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: await req.arrayBuffer(),
  });
  if (!s3Res.ok) {
    return NextResponse.json({ message: `S3 upload failed (${s3Res.status})` }, { status: 502 });
  }

  return NextResponse.json({ s3Key });
}
