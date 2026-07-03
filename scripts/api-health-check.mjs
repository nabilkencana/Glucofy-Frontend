/**
 * Glucofy API Health Check
 * Run: node scripts/api-health-check.mjs
 *
 * Verifies that essential endpoints on the Railway backend are reachable
 * and return the expected HTTP status codes.
 */

const BASE = "https://glucofy-be-production.up.railway.app/api/v1";

const CHECKS = [
  {
    label: "POST /auth/login — wrong password → expect 401",
    method: "POST",
    path: "/auth/login",
    body: { email: "health-check@glucofy.test", password: "wrong" },
    expect: [400, 401],
  },
  {
    label: "POST /auth/register — duplicate/new email → expect 201, 400, or 409",
    method: "POST",
    path: "/auth/register",
    body: { email: "health-check@glucofy.test", password: "Test1234!", name: "Health Check" },
    expect: [201, 400, 409],
  },
  {
    label: "GET /users/me — no token → expect 401",
    method: "GET",
    path: "/users/me",
    expect: [401],
  },
  {
    label: "GET /nutrition/dashboard-summary — no token → expect 401",
    method: "GET",
    path: "/nutrition/dashboard-summary",
    expect: [401],
  },
  {
    label: "GET /nutrition/last-consumption — no token → expect 401",
    method: "GET",
    path: "/nutrition/last-consumption",
    expect: [401],
  },
  {
    label: "GET /nutrition/charts/weekly — no token → expect 401",
    method: "GET",
    path: "/nutrition/charts/weekly",
    expect: [401],
  },
];

const GREEN = "\x1b[32m";
const RED   = "\x1b[31m";
const RESET = "\x1b[0m";

async function run() {
  console.log(`\n${"─".repeat(60)}`);
  console.log("  Glucofy API Health Check");
  console.log(`  ${BASE}`);
  console.log(`${"─".repeat(60)}\n`);

  let passed = 0;
  let failed = 0;

  for (const check of CHECKS) {
    const url = `${BASE}${check.path}`;
    try {
      const res = await fetch(url, {
        method: check.method,
        headers: { "Content-Type": "application/json" },
        body: check.body ? JSON.stringify(check.body) : undefined,
        signal: AbortSignal.timeout(10_000),
      });

      const ok = check.expect.includes(res.status);
      if (ok) {
        console.log(`${GREEN}✓ PASS${RESET}  ${check.label}`);
        console.log(`        → HTTP ${res.status} (expected one of: ${check.expect.join(", ")})`);
        passed++;
      } else {
        console.log(`${RED}✗ FAIL${RESET}  ${check.label}`);
        console.log(`        → HTTP ${res.status} (expected one of: ${check.expect.join(", ")})`);
        const text = await res.text().catch(() => "");
        if (text) console.log(`        → Body: ${text.slice(0, 200)}`);
        failed++;
      }
    } catch (err) {
      console.log(`${RED}✗ ERROR${RESET} ${check.label}`);
      console.log(`        → ${err.message} — backend may be down or CORS blocked`);
      failed++;
    }
    console.log();
  }

  console.log(`${"─".repeat(60)}`);
  console.log(`  Results: ${GREEN}${passed} passed${RESET}  ${failed > 0 ? RED : ""}${failed} failed${RESET}`);
  console.log(`${"─".repeat(60)}\n`);

  if (failed > 0) process.exit(1);
}

run();
