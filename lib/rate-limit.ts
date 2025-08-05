export async function checkRateLimit(
  db: any,
  identifier: string,
  limit = 100,
  windowMs = 60000,
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
    return false
  }

  await db.query("UPDATE rate_limits SET count = count + 1 WHERE identifier = $1", [identifier])
  return true
}
