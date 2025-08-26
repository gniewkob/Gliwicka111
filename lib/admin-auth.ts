import { type NextRequest, NextResponse } from "next/server";

const TOKEN = process.env.ADMIN_AUTH_TOKEN;
const BASIC_USER = process.env.ADMIN_USER;
const BASIC_PASS = process.env.ADMIN_PASS;

if (!TOKEN && !(BASIC_USER && BASIC_PASS)) {
  throw new Error(
    "Missing admin auth configuration: define ADMIN_AUTH_TOKEN or both ADMIN_USER and ADMIN_PASS",
  );
}

function isTokenValid(header: string | null): boolean {
  if (!header || !TOKEN) return false;
  return header === `Bearer ${TOKEN}`;
}

function isBasicValid(header: string | null): boolean {
  if (!header || !BASIC_USER || !BASIC_PASS) return false;
  const expected = Buffer.from(`${BASIC_USER}:${BASIC_PASS}`).toString("base64");
  return header === `Basic ${expected}`;
}

export function requireAdminAuth(
  request: NextRequest,
): NextResponse | null {
  const header = request.headers.get("authorization");
  if (isTokenValid(header) || isBasicValid(header)) {
    return null;
  }
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
