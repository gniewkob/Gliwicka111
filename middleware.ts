import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";

function getSecurityHeaders(req: NextRequest): Record<string, string> {
  const isProd = process.env.NODE_ENV === "production";
  const isE2E = process.env.NEXT_PUBLIC_E2E === "true";

  // Relax CSP in dev and E2E to allow Next.js dev tooling (inline styles, eval, HMR websockets)
  const csp =
    !isProd || isE2E
      ? [
          "default-src 'self'",
          "img-src 'self' data: blob: https://stats0.mydevil.net",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://stats0.mydevil.net",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "connect-src 'self' ws: http://localhost:* https://stats0.mydevil.net",
        ].join("; ")
      : [
          "default-src 'self'",
          // Allow images from self, data URIs and blob URLs (e.g. responsive images)
          "img-src 'self' data: blob: https://stats0.mydevil.net",
          // Allow analytics domain; permit inline scripts for Next runtime/bootstrap
          "script-src 'self' https://stats0.mydevil.net 'unsafe-inline'",
          // Permit inline styles used by UI libs / style attributes
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' data:",
          "connect-src 'self' https://stats0.mydevil.net",
        ].join("; " );

  return {
    "Content-Security-Policy": csp,
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
  };
}

const CSRF_COOKIE = "csrf-token";

function generateCsrfToken(): string {
  return crypto.randomUUID();
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname !== "/api/health" &&
    (pathname.startsWith("/api/admin") || pathname.startsWith("/admin"))
  ) {
    const unauthorized = requireAdminAuth(req);
    if (unauthorized) {
      return unauthorized;
    }
  }

  const res = NextResponse.next();

  // Apply security headers to all responses
  const securityHeaders = getSecurityHeaders(req);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });

  // Ensure CSRF token cookie exists
  let csrfToken = req.cookies.get(CSRF_COOKIE)?.value;
  if (!csrfToken) {
    csrfToken = generateCsrfToken();
    const isHttps = req.nextUrl.protocol === "https:";
    res.cookies.set(CSRF_COOKIE, csrfToken, {
      sameSite: "strict",
      secure: isHttps,
      httpOnly: false,
      path: "/",
    });
  }

  // Basic CSRF validation for API POST requests
  if (req.method === "POST" && req.nextUrl.pathname.startsWith("/api")) {
    const headerToken = req.headers.get("x-csrf-token");
    if (!headerToken || headerToken !== csrfToken) {
      return new NextResponse("Invalid CSRF token", { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: "/:path*",
};
