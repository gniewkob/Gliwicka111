import { type NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { requireAuth } from "@/lib/analytics-auth"

interface MetricsSummary {
  totalViews: number
  totalStarts: number
  totalCompletions: number
  conversionRate: number
  abandonmentRate: number
  avgCompletionTime: number
  formBreakdown: Record<
    string,
    {
      views: number
      starts: number
      completions: number
      conversionRate: number
      avgCompletionTime: number
    }
  >
  fieldAnalytics: Record<
    string,
    {
      focusCount: number
      errorCount: number
      errorRate: number
      avgFocusTime: number
    }
  >
  timeSeriesData: Array<{
    date: string
    views: number
    starts: number
    completions: number
  }>
}

function calculateMetrics(events: any[], timeRange = "7d"): MetricsSummary {
  // Filter events by time range
  const now = Date.now()
  const timeRangeMs =
    {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
    }[timeRange] || 7 * 24 * 60 * 60 * 1000

  const filteredEvents = events.filter((event) => now - event.timestamp <= timeRangeMs)

  // Calculate overall metrics
  const views = filteredEvents.filter((e) => e.eventType === "view").length
  const starts = filteredEvents.filter((e) => e.eventType === "start").length
  const completions = filteredEvents.filter((e) => e.eventType === "submission_success").length
  const conversionRate = starts > 0 ? (completions / starts) * 100 : 0
  const abandonmentRate = 100 - conversionRate

  // Calculate average completion time
  const completionEvents = filteredEvents.filter((e) => e.eventType === "submission_success")
  const startEvents = filteredEvents.filter((e) => e.eventType === "start")

  let totalCompletionTime = 0
  let completionTimeCount = 0

  completionEvents.forEach((completion) => {
    const correspondingStart = startEvents.find(
      (start) =>
        start.sessionId === completion.sessionId &&
        start.formType === completion.formType &&
        start.timestamp <= completion.timestamp,
    )

    if (correspondingStart) {
      totalCompletionTime += completion.timestamp - correspondingStart.timestamp
      completionTimeCount++
    }
  })

  const avgCompletionTime = completionTimeCount > 0 ? totalCompletionTime / completionTimeCount : 0

  // Form breakdown
  const formTypes = [...new Set(filteredEvents.map((e) => e.formType))]
  const formBreakdown: Record<string, any> = {}

  formTypes.forEach((formType) => {
    const formEvents = filteredEvents.filter((e) => e.formType === formType)
    const formViews = formEvents.filter((e) => e.eventType === "view").length
    const formStarts = formEvents.filter((e) => e.eventType === "start").length
    const formCompletions = formEvents.filter((e) => e.eventType === "submission_success").length
    const formConversionRate = formStarts > 0 ? (formCompletions / formStarts) * 100 : 0

    // Calculate avg completion time for this form
    const formCompletionEvents = formEvents.filter((e) => e.eventType === "submission_success")
    const formStartEvents = formEvents.filter((e) => e.eventType === "start")

    let formTotalCompletionTime = 0
    let formCompletionTimeCount = 0

    formCompletionEvents.forEach((completion) => {
      const correspondingStart = formStartEvents.find(
        (start) => start.sessionId === completion.sessionId && start.timestamp <= completion.timestamp,
      )

      if (correspondingStart) {
        formTotalCompletionTime += completion.timestamp - correspondingStart.timestamp
        formCompletionTimeCount++
      }
    })

    const formAvgCompletionTime = formCompletionTimeCount > 0 ? formTotalCompletionTime / formCompletionTimeCount : 0

    formBreakdown[formType] = {
      views: formViews,
      starts: formStarts,
      completions: formCompletions,
      conversionRate: formConversionRate,
      avgCompletionTime: formAvgCompletionTime,
    }
  })

  // Field analytics
  const fieldEvents = filteredEvents.filter((e) => ["field_focus", "field_error"].includes(e.eventType) && e.fieldName)

  const fieldNames = [...new Set(fieldEvents.map((e) => e.fieldName))]
  const fieldAnalytics: Record<string, any> = {}

  fieldNames.forEach((fieldName) => {
    const fieldFocusEvents = fieldEvents.filter((e) => e.eventType === "field_focus" && e.fieldName === fieldName)
    const fieldErrorEvents = fieldEvents.filter((e) => e.eventType === "field_error" && e.fieldName === fieldName)

    const focusCount = fieldFocusEvents.length
    const errorCount = fieldErrorEvents.length
    const errorRate = focusCount > 0 ? (errorCount / focusCount) * 100 : 0

    // Calculate average focus time (simplified - would need blur events for accuracy)
    const avgFocusTime = 2000 + Math.random() * 3000 // Mock data for demo

    fieldAnalytics[fieldName] = {
      focusCount,
      errorCount,
      errorRate,
      avgFocusTime,
    }
  })

  // Time series data (simplified for demo)
  const timeSeriesData = []
  const daysToShow = Math.min(Number.parseInt(timeRange.replace(/\D/g, "")) || 7, 30)

  for (let i = daysToShow - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000

    const dayEvents = filteredEvents.filter((e) => e.timestamp >= dayStart && e.timestamp < dayEnd)

    timeSeriesData.push({
      date: date.toISOString().split("T")[0],
      views: dayEvents.filter((e) => e.eventType === "view").length,
      starts: dayEvents.filter((e) => e.eventType === "start").length,
      completions: dayEvents.filter((e) => e.eventType === "submission_success").length,
    })
  }

  return {
    totalViews: views,
    totalStarts: starts,
    totalCompletions: completions,
    conversionRate,
    abandonmentRate,
    avgCompletionTime,
    formBreakdown,
    fieldAnalytics,
    timeSeriesData,
  }
}

export async function GET(request: NextRequest) {
  const unauthorized = requireAuth(request)
  if (unauthorized) return unauthorized
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"
    const formType = searchParams.get("formType")

    const now = Date.now()
    const timeRangeMs =
      {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
      }[timeRange] || 7 * 24 * 60 * 60 * 1000

    const params: any[] = [now - timeRangeMs]
    let query =
      'SELECT form_type AS "formType", event_type AS "eventType", field_name AS "fieldName", error_message AS "errorMessage", timestamp, session_id AS "sessionId", user_agent AS "userAgent", language, form_version AS "formVersion", ip_hash AS "ipHash", received_at AS "receivedAt" FROM analytics_events WHERE timestamp >= $1'
    if (formType && formType !== "all") {
      query += ` AND form_type = $2`
      params.push(formType)
    }

    const { rows } = await db.query(query, params)

    const metrics = calculateMetrics(rows, timeRange)

    return NextResponse.json({
      success: true,
      data: metrics,
      timeRange,
      formType: formType || "all",
      generatedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
