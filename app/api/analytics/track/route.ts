import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// Analytics event schema
const analyticsEventSchema = z.object({
  formType: z.string(),
  eventType: z.enum([
    "view",
    "start",
    "field_focus",
    "field_blur",
    "field_error",
    "submission_attempt",
    "submission_success",
    "submission_error",
    "abandonment",
  ]),
  fieldName: z.string().optional(),
  errorMessage: z.string().optional(),
  timestamp: z.number(),
  sessionId: z.string(),
  userAgent: z.string(),
  language: z.string(),
  formVersion: z.string().optional(),
})

// Simple rate limiting
function checkRateLimit(identifier: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (userLimit.count >= limit) {
    return false
  }

  userLimit.count++
  return true
}

// Hash IP for privacy
async function hashIP(ip: string): Promise<string> {
  const crypto = await import("crypto")
  const salt = process.env.IP_SALT || "default-salt"
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex")
    .substring(0, 16)
}

// Get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  return "127.0.0.1"
}

// In-memory storage for demo (use proper database in production)
const analyticsEvents: any[] = []

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const hashedIP = await hashIP(clientIP)

    // Rate limiting
    if (!checkRateLimit(hashedIP)) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const body = await request.json()

    // Validate the event data
    const validationResult = analyticsEventSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid event data", details: validationResult.error.errors }, { status: 400 })
    }

    const event = validationResult.data

    // Sanitize and enrich the event
    const sanitizedEvent = {
      ...event,
      ipHash: hashedIP,
      receivedAt: new Date().toISOString(),
      userAgent: event.userAgent.substring(0, 200), // Limit user agent length
      // Remove any potentially sensitive data
      sessionId: event.sessionId.replace(/[^a-zA-Z0-9_-]/g, ""),
    }

    // Store the event (in production, use proper database)
    analyticsEvents.push(sanitizedEvent)

    // Keep only last 10000 events in memory
    if (analyticsEvents.length > 10000) {
      analyticsEvents.splice(0, analyticsEvents.length - 10000)
    }

    // Log for debugging (remove in production)
    console.log("Analytics event received:", {
      formType: event.formType,
      eventType: event.eventType,
      fieldName: event.fieldName,
      timestamp: new Date(event.timestamp).toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint for retrieving analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    // In production, add proper authentication here
    const { searchParams } = new URL(request.url)
    const formType = searchParams.get("formType")
    const eventType = searchParams.get("eventType")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let filteredEvents = analyticsEvents

    if (formType) {
      filteredEvents = filteredEvents.filter((event) => event.formType === formType)
    }

    if (eventType) {
      filteredEvents = filteredEvents.filter((event) => event.eventType === eventType)
    }

    // Sort by timestamp (newest first) and limit
    const results = filteredEvents.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)

    return NextResponse.json({
      events: results,
      total: filteredEvents.length,
      filtered: results.length,
    })
  } catch (error) {
    console.error("Analytics retrieval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
