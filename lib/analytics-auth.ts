import { type NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.ANALYTICS_AUTH_TOKEN || "dev-token";
const BASIC_USER = process.env.ANALYTICS_BASIC_USER;
const BASIC_PASS = process.env.ANALYTICS_BASIC_PASS;

function isTokenValid(header: string | null): boolean {
  if (!header || !TOKEN) return false;
  return header === `Bearer ${TOKEN}`;
}

function isBasicValid(header: string | null): boolean {
  if (!header || !BASIC_USER || !BASIC_PASS) return false;
  const expected = Buffer.from(`${BASIC_USER}:${BASIC_PASS}`).toString(
    "base64",
  );
  return header === `Basic ${expected}`;
}

export function requireAuth(request: NextRequest): NextResponse | null {
  const header = request.headers.get("authorization");
  if (!TOKEN && !(BASIC_USER && BASIC_PASS)) {
    return null;
  }
  if (isTokenValid(header) || isBasicValid(header)) {
    return null;
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
