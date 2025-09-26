import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";

function getSecurityHeaders(
  req: NextRequest,
  nonce: string,
): Record<string, string> {
  const isProd = process.env.NODE_ENV === "production";
  const isE2E = process.env.NEXT_PUBLIC_E2E === "true";

  // Relax CSP in dev and E2E to allow Next.js dev tooling (inline styles, eval, HMR websockets)
  const csp =
    !isProd || isE2E
      ? [
          "default-src 'self'",
          "img-src 'self' data: blob: https://stats0.mydevil.net https://maps.googleapis.com https://maps.gstatic.com",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://stats0.mydevil.net https://maps.googleapis.com https://maps.gstatic.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' ws: http://localhost:* https://stats0.mydevil.net https://maps.googleapis.com",
          "frame-src 'self' https://www.google.com",
        ].join("; ")
      : [
          "default-src 'self'",
          // Allow images from self, data URIs, blob URLs, and Google Maps
          "img-src 'self' data: blob: https://stats0.mydevil.net https://maps.googleapis.com https://maps.gstatic.com",
          // Allow analytics domain and Google Maps; use nonce for inline Next runtime/bootstrap
          `script-src 'self' https://stats0.mydevil.net https://maps.googleapis.com https://maps.gstatic.com 'nonce-${nonce}'`,
          // Permit inline styles used by UI libs / style attributes and Google Fonts
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' https://stats0.mydevil.net https://maps.googleapis.com",
          // Allow Google Maps iframe
          "frame-src 'self' https://www.google.com",
        ].join("; ");

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

  const nonce = crypto.randomUUID();
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Apply security headers to all responses
  const securityHeaders = getSecurityHeaders(req, nonce);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
  res.headers.set("x-nonce", nonce);

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
  const isAdminPath = req.nextUrl.pathname.startsWith("/api/admin");
  const auth = req.headers.get("authorization") || "";
  const hasBearer = /^Bearer\s+/i.test(auth);

  if (req.method === "POST" && req.nextUrl.pathname.startsWith("/api") && !(isAdminPath && hasBearer)) {
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
