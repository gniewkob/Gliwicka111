import { Pool } from "pg";

let pool: Pool | null = null;

async function createPool(): Promise<Pool> {
  const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    MOCK_DB,
    DATABASE_URL,
  } = process.env;

  if (MOCK_DB === "true" || (!DB_HOST && !DATABASE_URL)) {
    return {
      query: async () => ({ rows: [], rowCount: 0 }),
    } as unknown as Pool;
  }

  const instance = DATABASE_URL
    ? new Pool({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
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
