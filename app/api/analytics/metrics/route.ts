import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/analytics-auth"
import type { Pool } from "pg"

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

export async function GET(request: NextRequest) {
  const unauthorized = requireAuth(request)
  if (unauthorized) return unauthorized
  try {
    const { getPool } = await import("@/lib/database/connection-pool")
    let db: Pool
    try {
      db = (await getPool()) as Pool
      await db.query("SELECT 1")
    } catch {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"
    const formType = searchParams.get("formType")
    const timeRangeMs =
      {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
        "90d": 90 * 24 * 60 * 60 * 1000,
      }[timeRange] || 7 * 24 * 60 * 60 * 1000
    const startTime = Date.now() - timeRangeMs

    const params: any[] = [startTime]
    const filter = formType && formType !== "all" ? "AND form_type = $2" : ""
    if (filter) params.push(formType)

    const overallQuery = `
      SELECT
        COUNT(*) FILTER (WHERE event_type = 'view') AS views,
        COUNT(*) FILTER (WHERE event_type = 'start') AS starts,
        COUNT(*) FILTER (WHERE event_type = 'submission_success') AS completions
      FROM analytics_events
      WHERE timestamp >= $1 ${filter}
    `
    const overallRes = await db.query<{
      views: string
      starts: string
      completions: string
    }>(overallQuery, params)
    const totalViews = Number(overallRes.rows[0]?.views ?? 0)
    const totalStarts = Number(overallRes.rows[0]?.starts ?? 0)
    const totalCompletions = Number(overallRes.rows[0]?.completions ?? 0)

    const avgTimeQuery = `
      SELECT AVG(c.timestamp - s.timestamp) AS avg_completion_time
      FROM analytics_events s
      JOIN analytics_events c ON s.session_id = c.session_id AND s.form_type = c.form_type
      WHERE s.event_type = 'start' AND c.event_type = 'submission_success'
        AND s.timestamp >= $1 AND c.timestamp >= $1 ${filter}
    `
    const avgTimeRes = await db.query<{
      avg_completion_time: string | null
    }>(avgTimeQuery, params)
    const avgCompletionTime = Number(avgTimeRes.rows[0]?.avg_completion_time ?? 0)

    const formStatsQuery = `
      SELECT
        form_type,
        COUNT(*) FILTER (WHERE event_type = 'view') AS views,
        COUNT(*) FILTER (WHERE event_type = 'start') AS starts,
        COUNT(*) FILTER (WHERE event_type = 'submission_success') AS completions
      FROM analytics_events
      WHERE timestamp >= $1 ${filter}
      GROUP BY form_type
    `
    const formStatsRes = await db.query<{
      form_type: string
      views: string
      starts: string
      completions: string
    }>(formStatsQuery, params)

    const formTimeQuery = `
      SELECT
        s.form_type,
        AVG(c.timestamp - s.timestamp) AS avg_completion_time
      FROM analytics_events s
      JOIN analytics_events c ON s.session_id = c.session_id AND s.form_type = c.form_type
      WHERE s.event_type = 'start' AND c.event_type = 'submission_success'
        AND s.timestamp >= $1 AND c.timestamp >= $1 ${filter}
      GROUP BY s.form_type
    `
    const formTimeRes = await db.query<{
      form_type: string
      avg_completion_time: string | null
    }>(formTimeQuery, params)
    const formTimeMap = Object.fromEntries(
      formTimeRes.rows.map((r) => [r.form_type, Number(r.avg_completion_time ?? 0)]),
    )

    const formBreakdown: Record<string, any> = {}
    formStatsRes.rows.forEach((r) => {
      const starts = Number(r.starts ?? 0)
      const completions = Number(r.completions ?? 0)
      const conversionRate = starts > 0 ? (completions / starts) * 100 : 0
      formBreakdown[r.form_type] = {
        views: Number(r.views ?? 0),
        starts,
        completions,
        conversionRate,
        avgCompletionTime: formTimeMap[r.form_type] || 0,
      }
    })

    const fieldQuery = `
      SELECT field_name,
             COUNT(*) FILTER (WHERE event_type = 'field_focus') AS focus_count,
             COUNT(*) FILTER (WHERE event_type = 'field_error') AS error_count
      FROM analytics_events
      WHERE timestamp >= $1 AND field_name IS NOT NULL AND event_type IN ('field_focus', 'field_error') ${filter}
      GROUP BY field_name
    `
    const fieldRes = await db.query<{
      field_name: string
      focus_count: string
      error_count: string
    }>(fieldQuery, params)
    const fieldAnalytics: Record<string, any> = {}
    fieldRes.rows.forEach((r) => {
      const focusCount = Number(r.focus_count ?? 0)
      const errorCount = Number(r.error_count ?? 0)
      fieldAnalytics[r.field_name] = {
        focusCount,
        errorCount,
        errorRate: focusCount > 0 ? (errorCount / focusCount) * 100 : 0,
        avgFocusTime: 0,
      }
    })

    const timeSeriesQuery = `
      SELECT
        to_char(to_timestamp(timestamp / 1000), 'YYYY-MM-DD') AS date,
        COUNT(*) FILTER (WHERE event_type = 'view') AS views,
        COUNT(*) FILTER (WHERE event_type = 'start') AS starts,
        COUNT(*) FILTER (WHERE event_type = 'submission_success') AS completions
      FROM analytics_events
      WHERE timestamp >= $1 ${filter}
      GROUP BY date
      ORDER BY date
    `
    const timeRes = await db.query<{
      date: string
      views: string
      starts: string
      completions: string
    }>(timeSeriesQuery, params)
    const timeSeriesData = timeRes.rows.map((r) => ({
      date: r.date,
      views: Number(r.views ?? 0),
      starts: Number(r.starts ?? 0),
      completions: Number(r.completions ?? 0),
    }))

    const conversionRate = totalStarts > 0 ? (totalCompletions / totalStarts) * 100 : 0
    const abandonmentRate = 100 - conversionRate

    const metrics: MetricsSummary = {
      totalViews,
      totalStarts,
      totalCompletions,
      conversionRate,
      abandonmentRate,
      avgCompletionTime,
      formBreakdown,
      fieldAnalytics,
      timeSeriesData,
    }

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
