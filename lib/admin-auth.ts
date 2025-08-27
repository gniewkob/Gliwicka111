import { type NextRequest, NextResponse } from "next/server";

function isTokenValid(header: string | null, token?: string): boolean {
  if (!header || !token) return false;
  return header === `Bearer ${token}`;
}

function isBasicValid(
  header: string | null,
  user?: string,
  pass?: string,
): boolean {
  if (!header || !user || !pass) return false;
  const expected = Buffer.from(`${user}:${pass}`).toString("base64");
  return header === `Basic ${expected}`;
}

export function requireAdminAuth(request: NextRequest): NextResponse | null {
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  const token = process.env.ADMIN_AUTH_TOKEN;
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  if (!token && !(user && pass)) {
    console.warn(
      "Missing admin auth configuration: define ADMIN_AUTH_TOKEN or both ADMIN_USER and ADMIN_PASS",
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const header = request.headers.get("authorization");
  if (isTokenValid(header, token) || isBasicValid(header, user, pass)) {
    return null;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
