import { NextRequest, NextResponse } from 'next/server'

const securityHeaders: Record<string, string> = {
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data: https://stats0.mydevil.net; script-src 'self' 'unsafe-inline' https://stats0.mydevil.net; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://stats0.mydevil.net;",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
}

const CSRF_COOKIE = 'csrf-token'

function generateCsrfToken(): string {
  return crypto.randomUUID()
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })

  // Ensure CSRF token cookie exists
  let csrfToken = req.cookies.get(CSRF_COOKIE)?.value
  if (!csrfToken) {
    csrfToken = generateCsrfToken()
    res.cookies.set(CSRF_COOKIE, csrfToken, {
      sameSite: 'strict',
      secure: true,
      httpOnly: false,
      path: '/',
    })
  }

  // Basic CSRF validation for API POST requests
  if (req.method === 'POST' && req.nextUrl.pathname.startsWith('/api')) {
    const headerToken = req.headers.get('x-csrf-token')
    if (!headerToken || headerToken !== csrfToken) {
      return new NextResponse('Invalid CSRF token', { status: 403 })
    }
  }

  return res
}

export const config = {
  matcher: '/:path*',
}

