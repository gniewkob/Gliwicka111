import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/analytics-auth"
import { checkRateLimit } from "@/lib/rate-limit"

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

// Hash IP for privacy
async function hashIP(ip: string): Promise<string> {
  const crypto = await import("crypto")
  const salt = process.env.IP_SALT
  if (!salt) {
    const message = "IP_SALT environment variable is not set"
    if (process.env.NODE_ENV === "production") {
      throw new Error(message)
    } else {
      console.warn(message)
    }
  }
  return crypto
    .createHash("sha256")
    .update(ip + (salt || "default-salt"))
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

export async function POST(request: NextRequest) {
  const unauthorized = requireAuth(request)
  if (unauthorized) return unauthorized
  try {
    const { db } = await import("@/lib/database/connection-pool")
    try {
      await db.query("SELECT 1")
    } catch {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const clientIP = getClientIP(request)
    const hashedIP = await hashIP(clientIP)

    // Rate limiting
    if (!(await checkRateLimit(db, hashedIP))) {
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
      userAgent: event.userAgent.substring(0, 200),
      sessionId: event.sessionId.replace(/[^a-zA-Z0-9_-]/g, ""),
    }

    await db.query(
      `INSERT INTO analytics_events (form_type, event_type, field_name, error_message, timestamp, session_id, user_agent, language, form_version, ip_hash, received_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
      [
        sanitizedEvent.formType,
        sanitizedEvent.eventType,
        sanitizedEvent.fieldName ?? null,
        sanitizedEvent.errorMessage ?? null,
        sanitizedEvent.timestamp,
        sanitizedEvent.sessionId,
        sanitizedEvent.userAgent,
        sanitizedEvent.language,
        sanitizedEvent.formVersion ?? null,
        sanitizedEvent.ipHash,
      ],
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint for retrieving analytics data (admin only)
export async function GET(request: NextRequest) {
  const unauthorized = requireAuth(request)
  if (unauthorized) return unauthorized
  try {
    const { db } = await import("@/lib/database/connection-pool")
    try {
      await db.query("SELECT 1")
    } catch {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const formType = searchParams.get("formType")
    const eventType = searchParams.get("eventType")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const conditions: string[] = []
    const params: any[] = []

    if (formType) {
      conditions.push(`form_type = $${params.length + 1}`)
      params.push(formType)
    }

    if (eventType) {
      conditions.push(`event_type = $${params.length + 1}`)
      params.push(eventType)
    }

    let query =
      'SELECT form_type AS "formType", event_type AS "eventType", field_name AS "fieldName", error_message AS "errorMessage", timestamp, session_id AS "sessionId", user_agent AS "userAgent", language, form_version AS "formVersion", ip_hash AS "ipHash", received_at AS "receivedAt" FROM analytics_events'
    if (conditions.length) {
      query += ` WHERE ${conditions.join(" AND ")}`
    }
    query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`
    params.push(limit)

    const { rows } = await db.query(query, params)

    const sanitizedEvents = rows.map((event) => ({
      formType: event.formType,
      eventType: event.eventType,
      fieldName: event.fieldName,
      errorMessage: event.errorMessage,
      timestamp: event.timestamp,
      language: event.language,
      formVersion: event.formVersion,
      receivedAt: event.receivedAt,
    }))

    return NextResponse.json({
      events: sanitizedEvents,
      total: sanitizedEvents.length,
      filtered: sanitizedEvents.length,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
