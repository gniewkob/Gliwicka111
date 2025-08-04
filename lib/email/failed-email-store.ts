import { db } from "../database/connection-pool";

export type FailedEmailRecord = {
  id: number;
  email_type: "confirmation" | "admin";
  payload: {
    data: any;
    formType: string;
    language: "pl" | "en";
  };
  error: string;
  retry_count: number;
  status: string;
};

export async function saveFailedEmail(
  type: "confirmation" | "admin",
  payload: FailedEmailRecord["payload"],
  error: unknown,
): Promise<void> {
  await db.query(
    `INSERT INTO failed_emails (email_type, payload, error) VALUES ($1, $2, $3)`,
    [type, JSON.stringify(payload), String(error)],
  );
}

export async function getPendingFailedEmails(
  limit = 50,
): Promise<FailedEmailRecord[]> {
  const res = await db.query(
    `SELECT id, email_type, payload, error, retry_count, status FROM failed_emails WHERE status = 'pending' ORDER BY created_at ASC LIMIT $1`,
    [limit],
  );
  return res.rows;
}

export async function markEmailSent(id: number): Promise<void> {
  await db.query(
    `UPDATE failed_emails SET status = 'sent', updated_at = NOW() WHERE id = $1`,
    [id],
  );
}

export async function markEmailFailed(
  id: number,
  error: unknown,
  maxRetries: number,
): Promise<{ retry_count: number; status: string }> {
  const res = await db.query(
    `UPDATE failed_emails SET retry_count = retry_count + 1, error = $2, updated_at = NOW(), status = CASE WHEN retry_count + 1 >= $3 THEN 'failed' ELSE 'pending' END WHERE id = $1 RETURNING retry_count, status`,
    [id, String(error), maxRetries],
  );
  return res.rows[0];
}
