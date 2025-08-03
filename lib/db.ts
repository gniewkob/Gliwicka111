import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("DATABASE_URL is not set. Database queries will fail.");
}

export const pool = new Pool({
  connectionString,
});

export const db = {
  async query<T = any>(
    text: string,
    params?: any[],
  ): Promise<{ rows: T[]; rowCount: number }> {
    return pool.query<T>(text, params);
  },
};

export default db;
