import { Pool } from "pg";

type Queryable = {
  query: (...args: any[]) => Promise<any>;
};

let pool: (Pool | Queryable) | null = null;

async function createPool(): Promise<Pool | Queryable> {
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
    };
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

  instance.on("error", (err) => {
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

export async function getPool(): Promise<Pool | Queryable> {
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
