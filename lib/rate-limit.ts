export async function checkRateLimit(
  db: any,
  identifier: string,
  limit = Number(process.env.RATE_LIMIT_COUNT ?? "100"),
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? "60000"),
): Promise<boolean> {
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
    await db.query(
      "INSERT INTO duplicate_attempts (ip_hash, attempted_at) VALUES ($1, NOW())",
      [identifier],
    )
    return false
  }

  await db.query("UPDATE rate_limits SET count = count + 1 WHERE identifier = $1", [identifier])
  return true
}
