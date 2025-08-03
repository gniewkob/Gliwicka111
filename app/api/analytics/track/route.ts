import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import db from "@/lib/db"
import { requireAuth } from "@/lib/analytics-auth"

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

// Rate limiting backed by database storage
async function checkRateLimit(identifier: string, limit = 100, windowMs = 60000): Promise<boolean> {
  const now = Date.now()
  const { rows } = await db.query<{ count: number; reset_time: number }>(
    "SELECT count, reset_time FROM rate_limits WHERE identifier = $1",
    [identifier],
  )

  if (rows.length === 0 || now > Number(rows[0].reset_time)) {
    await db.query(
      "INSERT INTO rate_limits (identifier, count, reset_time) VALUES ($1, 1, $2) ON CONFLICT (identifier) DO UPDATE SET count = 1, reset_time = $2",
      [identifier, now + windowMs],
    )
    return true
  }

  if (rows[0].count >= limit) {
    return false
  }

  await db.query("UPDATE rate_limits SET count = count + 1 WHERE identifier = $1", [identifier])
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

export async function POST(request: NextRequest) {
  const unauthorized = requireAuth(request)
  if (unauthorized) return unauthorized
  try {
    const clientIP = getClientIP(request)
    const hashedIP = await hashIP(clientIP)

    // Rate limiting
    if (!(await checkRateLimit(hashedIP))) {
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

    return NextResponse.json({
      events: rows,
      total: rows.length,
      filtered: rows.length,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
