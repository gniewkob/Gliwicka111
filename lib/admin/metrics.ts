import { getPool } from "@/lib/database/connection-pool";

async function getDb() {
  try {
    return await getPool();
  } catch (error) {
    console.error("Database connection error", error);
    throw error;
  }
}

export async function getSubmissionMetrics() {
  const db = await getDb();
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
  const db = await getDb();
  const result = await db.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM duplicate_attempts`,
  );
  return Number.parseInt(result.rows[0]?.count || "0");
}
