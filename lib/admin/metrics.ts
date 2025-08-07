import { db } from "@/lib/database/connection-pool";

export async function getSubmissionMetrics() {
  const result = await db.query<{
    avg_processing_time_ms: number | null;
    avg_email_latency_ms: number | null;
    total: number;
  }>(
    `SELECT 
       AVG(processing_time_ms)::float AS avg_processing_time_ms,
       AVG(email_latency_ms)::float AS avg_email_latency_ms,
       COUNT(*)::int AS total
     FROM form_submissions`,
  );
  return result.rows[0];
}

export async function getDuplicateAttemptCount() {
  const result = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM duplicate_attempts`,
  );
  return Number.parseInt(result.rows[0]?.count || "0");
}
