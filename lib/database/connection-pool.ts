import { Pool } from "pg"

let pool: Pool | null = null

function createPool(): Pool {
  const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env

  const instance = new Pool({
    host: DB_HOST,
    port: DB_PORT ? Number.parseInt(DB_PORT, 10) : undefined,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    max: 20,
  })

  instance.on("error", (err) => {
    console.error("Database connection error", err)
    throw err
  })

  return instance
}

export function getPool(): Pool {
  if (!pool) {
    pool = createPool()
  }
  return pool
}

export const db = getPool()
export default db
