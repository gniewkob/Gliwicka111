import { Pool } from "pg"

type Queryable = {
  query: (...args: any[]) => Promise<any>
}

let pool: (Pool | Queryable) | null = null

function createPool(): Pool | Queryable {
  const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    MOCK_DB,
  } = process.env

  if (MOCK_DB === "true" || !DB_HOST) {
    return {
      query: async () => ({ rows: [], rowCount: 0 }),
    }
  }

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

export function getPool(): Pool | Queryable {
  if (!pool) {
    pool = createPool()
  }
  return pool
}

export const db = getPool()
export default db
