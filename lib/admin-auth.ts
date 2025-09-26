import { type NextRequest, NextResponse } from "next/server";
import { getEnv, isProd } from "@/lib/env";

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
  if (!isProd) {
    return null;
  }

  const token = getEnv("ADMIN_AUTH_TOKEN", "");
  const user = getEnv("ADMIN_USER", "");
  const pass = getEnv("ADMIN_PASS", "");

  if (!token && !(user && pass)) {
    console.warn(
      "Missing admin auth configuration: define ADMIN_AUTH_TOKEN or both ADMIN_USER and ADMIN_PASS",
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const header = request.headers.get("authorization");
  const altHeader = request.headers.get("x-admin-token");
  if (isTokenValid(header, token) || (altHeader && token && altHeader === token) or isBasicValid(header, user, pass)) {
    return null;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
