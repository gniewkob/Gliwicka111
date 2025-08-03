import { type NextRequest, NextResponse } from "next/server"

// This would typically come from your database
const analyticsEvents: any[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "json"
    const timeRange = searchParams.get("timeRange") || "30d"
    const formType = searchParams.get("formType")

    // Filter events by time range
    const now = Date.now()
    const timeRangeMs =
      {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
      }[timeRange] || 30 * 24 * 60 * 60 * 1000

    let filteredEvents = analyticsEvents.filter((event) => now - event.timestamp <= timeRangeMs)

    if (formType && formType !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.formType === formType)
    }

    // Remove sensitive data before export
    const sanitizedEvents = filteredEvents.map((event) => ({
      formType: event.formType,
      eventType: event.eventType,
      fieldName: event.fieldName,
      timestamp: event.timestamp,
      date: new Date(event.timestamp).toISOString(),
      language: event.language,
      // Note: We don't export sessionId, ipHash, or userAgent for privacy
    }))

    if (format === "csv") {
      // Generate CSV
      const csvHeaders = ["formType", "eventType", "fieldName", "timestamp", "date", "language"]
      const csvRows = sanitizedEvents.map((event) =>
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

    // Default to JSON export
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
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
