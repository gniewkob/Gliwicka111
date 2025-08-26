import { type NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";

const METRICS_WINDOW_HOURS = Number(process.env.METRICS_WINDOW_HOURS || "24");

interface SubmissionRow {
  hour: Date;
  count: number;
  avgProcessing: number;
  maxProcessing: number;
  avgEmailLatency: number;
  maxEmailLatency: number;
  errors: number;
}

interface FailureRow {
  hour: Date;
  count: number;
  avgRetry: number;
  maxRetry: number;
  retries: number;
}

interface RateLimitRow {
  hour: Date;
  count: number;
  avgCount: number;
  maxCount: number;
}

export async function GET(request: NextRequest) {
  const unauthorized = requireAdminAuth(request);
  if (unauthorized) return unauthorized;

  let db;
  try {
    const { getPool } = await import("@/lib/database/connection-pool");
    db = await getPool();
  } catch {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }

  const params = [METRICS_WINDOW_HOURS];

  const submissionsQuery = `
    SELECT
      date_trunc('hour', created_at) AS hour,
      AVG(processing_time_ms)::float AS avg_processing_time_ms,
      MAX(processing_time_ms)::int AS max_processing_time_ms,
      AVG(email_latency_ms)::float AS avg_email_latency_ms,
      MAX(email_latency_ms)::int AS max_email_latency_ms,
      COUNT(*)::int AS submissions,
      SUM(CASE WHEN status != 'success' THEN 1 ELSE 0 END)::int AS errors
    FROM form_submissions
    WHERE created_at >= NOW() - $1 * INTERVAL '1 hour'
    GROUP BY hour
    ORDER BY hour
  `;

  const failedEmailsQuery = `
    SELECT
      date_trunc('hour', created_at) AS hour,
      AVG(retry_count)::float AS avg_retry_count,
      MAX(retry_count)::int AS max_retry_count,
      COUNT(*)::int AS failures,
      SUM(retry_count)::int AS total_retries
    FROM failed_emails
    WHERE created_at >= NOW() - $1 * INTERVAL '1 hour'
    GROUP BY hour
    ORDER BY hour
  `;

  const rateLimitsQuery = `
    SELECT
      date_trunc('hour', created_at) AS hour,
      AVG(count)::float AS avg_count,
      MAX(count)::int AS max_count,
      COUNT(*)::int AS hits,
      SUM(count)::int AS total_count
    FROM rate_limits
    WHERE created_at >= NOW() - $1 * INTERVAL '1 hour'
    GROUP BY hour
    ORDER BY hour
  `;

  const [submissionsRes, failedRes, rateRes] = await Promise.all([
    db.query(submissionsQuery, params),
    db.query(failedEmailsQuery, params),
    db.query(rateLimitsQuery, params),
  ]);

  const submissionsHourly: SubmissionRow[] = submissionsRes.rows.map(
    (r: any): SubmissionRow => ({
      hour: r.hour,
      count: Number(r.submissions || 0),
      avgProcessing: Number(r.avg_processing_time_ms || 0),
      maxProcessing: Number(r.max_processing_time_ms || 0),
      avgEmailLatency: Number(r.avg_email_latency_ms || 0),
      maxEmailLatency: Number(r.max_email_latency_ms || 0),
      errors: Number(r.errors || 0),
    }),
  );

  const totalSubmissions = submissionsHourly.reduce(
    (sum: number, r: SubmissionRow) => sum + r.count,
    0,
  );
  const totalErrors = submissionsHourly.reduce(
    (sum: number, r: SubmissionRow) => sum + r.errors,
    0,
  );
  const avgProcessingTime =
    submissionsHourly.reduce(
      (sum: number, r: SubmissionRow) => sum + r.avgProcessing,
      0,
    ) /
    (submissionsHourly.length || 1);
  const peakProcessingTime = Math.max(
    0,
    ...submissionsHourly.map((r: SubmissionRow) => r.maxProcessing),
  );
  const avgEmailLatency =
    submissionsHourly.reduce(
      (sum: number, r: SubmissionRow) => sum + r.avgEmailLatency,
      0,
    ) /
    (submissionsHourly.length || 1);
  const peakEmailLatency = Math.max(
    0,
    ...submissionsHourly.map((r: SubmissionRow) => r.maxEmailLatency),
  );
  const errorRate = totalSubmissions ? totalErrors / totalSubmissions : 0;

  const failedHourly: FailureRow[] = failedRes.rows.map(
    (r: any): FailureRow => ({
      hour: r.hour,
      count: Number(r.failures || 0),
      avgRetry: Number(r.avg_retry_count || 0),
      maxRetry: Number(r.max_retry_count || 0),
      retries: Number(r.total_retries || 0),
    }),
  );

  const totalFailures = failedHourly.reduce(
    (sum: number, r: FailureRow) => sum + r.count,
    0,
  );
  const totalRetries = failedHourly.reduce(
    (sum: number, r: FailureRow) => sum + r.retries,
    0,
  );
  const avgRetryCount =
    failedHourly.reduce(
      (sum: number, r: FailureRow) => sum + r.avgRetry,
      0,
    ) /
    (failedHourly.length || 1);
  const peakRetryCount = Math.max(
    0,
    ...failedHourly.map((r: FailureRow) => r.maxRetry),
  );
  const retryRate = totalFailures ? totalRetries / totalFailures : 0;

  const rateHourly: RateLimitRow[] = rateRes.rows.map(
    (r: any): RateLimitRow => ({
      hour: r.hour,
      count: Number(r.hits || 0),
      avgCount: Number(r.avg_count || 0),
      maxCount: Number(r.max_count || 0),
    }),
  );

  const avgRateCount =
    rateHourly.reduce(
      (sum: number, r: RateLimitRow) => sum + r.avgCount,
      0,
    ) /
    (rateHourly.length || 1);
  const peakRateCount = Math.max(
    0,
    ...rateHourly.map((r: RateLimitRow) => r.maxCount),
  );

  return NextResponse.json({
    windowHours: METRICS_WINDOW_HOURS,
    submissions: {
      averageProcessingTime: avgProcessingTime,
      peakProcessingTime: peakProcessingTime,
      averageEmailLatency: avgEmailLatency,
      peakEmailLatency: peakEmailLatency,
      hourlyVolume: submissionsHourly.map((r: SubmissionRow) => ({
        hour: r.hour,
        count: r.count,
      })),
      errorRate,
    },
    failedEmails: {
      averageRetryCount: avgRetryCount,
      peakRetryCount: peakRetryCount,
      hourlyVolume: failedHourly.map((r: FailureRow) => ({
        hour: r.hour,
        count: r.count,
      })),
      retryRate,
    },
    rateLimits: {
      averageCount: avgRateCount,
      peakCount: peakRateCount,
      hourlyVolume: rateHourly.map((r: RateLimitRow) => ({
        hour: r.hour,
        count: r.count,
      })),
    },
  });
}
