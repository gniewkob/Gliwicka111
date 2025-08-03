import { readdir, readFile } from "fs/promises";
import path from "path";
import { Client } from "pg";

async function runMigrations() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  try {
    const migrationsDir = path.join(__dirname, "..", "migrations");
    const files = (await readdir(migrationsDir))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const fullPath = path.join(migrationsDir, file);
      const sql = await readFile(fullPath, "utf8");
      console.log(`Running migration: ${file}`);
      await client.query(sql);
    }

    console.log("All migrations executed successfully");
  } finally {
    await client.end();
  }
}

runMigrations().catch((err) => {
  console.error("Migration failed", err);
  process.exit(1);
});
