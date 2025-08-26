import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/analytics-auth"
import { type AnalyticsEventRow } from "@/lib/analytics-types"

export async function GET(request: NextRequest) {
  const unauthorized = requireAuth(request)
  if (unauthorized) return unauthorized
  try {
    const { getPool } = await import("@/lib/database/connection-pool")
    let db
    try {
      db = await getPool()
      await db.query("SELECT 1")
    } catch {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"
    const timeRange = searchParams.get("timeRange") || "30d"
    const formType = searchParams.get("formType")

    const now = Date.now()
    const timeRangeMs =
      {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
      }[timeRange] || 30 * 24 * 60 * 60 * 1000

    const params: any[] = [now - timeRangeMs]
    let query =
      'SELECT form_type AS "formType", event_type AS "eventType", field_name AS "fieldName", timestamp, language FROM analytics_events WHERE timestamp >= $1'
    if (formType && formType !== "all") {
      query += ` AND form_type = $2`
      params.push(formType)
    }

    const { rows } = await db.query(query, params)

    const sanitizedEvents = rows.map((event: AnalyticsEventRow) => ({
      formType: event.formType,
      eventType: event.eventType,
      fieldName: event.fieldName,
      timestamp: event.timestamp,
      date: new Date(event.timestamp).toISOString(),
      language: event.language,
    }))

    if (format === "csv") {
      const csvHeaders = ["formType", "eventType", "fieldName", "timestamp", "date", "language"]
      const csvRows = sanitizedEvents.map((event: any) =>
        csvHeaders.map((header) => event[header as keyof typeof event] || "").join(","),
      )
      const csvContent = [csvHeaders.join(","), ...csvRows].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="analytics-export-${timeRange}-${Date.now()}.csv"`,
        },
      })
    }

    return NextResponse.json(
      {
        success: true,
        data: sanitizedEvents,
        metadata: {
          exportedAt: new Date().toISOString(),
          timeRange,
          formType: formType || "all",
          totalEvents: sanitizedEvents.length,
          privacyNote: "Personal identifiers have been removed for privacy protection",
        },
      },
      {
        headers: {
          "Content-Disposition": `attachment; filename="analytics-export-${timeRange}-${Date.now()}.json"`,
        },
      },
    )
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
