import { Pool } from "pg";
import { getEnv } from "@/lib/env";

let pool: Pool | null = null;

async function createPool(): Promise<Pool> {
  const DB_HOST = getEnv("DB_HOST", "");
  const DB_PORT = getEnv("DB_PORT", "");
  const DB_NAME = getEnv("DB_NAME", "");
  const DB_USER = getEnv("DB_USER", "");
  const DB_PASSWORD = getEnv("DB_PASSWORD", "");
  const MOCK_DB = getEnv("MOCK_DB", "");
  const DATABASE_URL = getEnv("DATABASE_URL", "");
  const DB_SSL = getEnv("DB_SSL", "").toLowerCase() === "true";

  if (MOCK_DB === "true") {
    return {
      query: async () => ({ rows: [], rowCount: 0 }),
    } as unknown as Pool;
  }

  if (!DB_HOST && !DATABASE_URL) {
    throw new Error("Missing database configuration (set DATABASE_URL or DB_* envs)");
  }

  const needSSL = DB_SSL;

  const instance = DATABASE_URL
    ? new Pool({
        connectionString: DATABASE_URL,
        ...(needSSL ? { ssl: { rejectUnauthorized: false } } : {}),
        max: 20,
      })
    : new Pool({
        host: DB_HOST,
        port: DB_PORT ? Number.parseInt(DB_PORT, 10) : undefined,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PASSWORD,
        max: 20,
      });

  instance.on("error", (err: Error) => {
    console.error("Database connection error", err);
    throw err;
  });

  try {
    await instance.query("SELECT 1");
  } catch (error) {
    console.error("Database connection test failed", error);
    throw error;
  }

  return instance;
}

export async function getPool(): Promise<Pool> {
  if (!pool) {
    try {
      pool = await createPool();
    } catch (error) {
      console.error("Failed to initialize database pool", error);
      throw new Error("Database connection failed");
    }
  }
  return pool;
}

export default getPool;
