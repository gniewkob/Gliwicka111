import { vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { Client, type Pool } from "pg";
import { readFile } from "node:fs/promises";
import path from "node:path";

let client: Client;

// Mock environment variables for integration tests
Object.assign(process.env, {
  NODE_ENV: "test",
  DB_HOST: "localhost",
  DB_PORT: "5432",
  DB_NAME: "test_db",
  DB_USER: "test_user",
  DB_PASSWORD: "test_password",
  SMTP_HOST: "smtp.example.com",
  SMTP_PORT: "587",
  SMTP_USER: "test@example.com",
  SMTP_PASS: "test_password",
  ADMIN_EMAIL: "admin@example.com",
  IP_SALT: "test_salt",
});

// Mock database connection
vi.mock("@/lib/database/connection-pool", () => {
  const db = {
    query: vi.fn(),
    transaction: vi.fn(),
  };
  const getPool = vi.fn().mockResolvedValue(db as unknown as Pool);
  return { getPool, default: getPool };
});

// Mock email service
vi.mock("@/lib/email/smtp-client", () => ({
  emailClient: {
    sendEmail: vi.fn(),
    verifyConnection: vi.fn(),
  },
}));

// Database setup for integration tests
beforeAll(async () => {
  // Create test database connection
  client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "test_user",
    password: process.env.DB_PASSWORD || "test_password",
    database: process.env.DB_NAME || "test_db",
  });

  await client.connect();

  // Run database migrations
  await runMigrations(client);
});

beforeEach(async () => {
  // Clean database before each test
  await cleanDatabase(client);

  // Seed test data
  await seedTestData(client);

  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

afterAll(async () => {
  if (client) {
    await client.end();
  }
});

async function runMigrations(conn: Client) {
  const migrations = [
    "migrations/001_create_form_submissions.sql",
    "migrations/002_create_analytics_tables.sql",
  ];

  for (const migration of migrations) {
    const sql = await readFile(path.join(process.cwd(), migration), "utf8");
    await conn.query(sql);
  }
}

async function cleanDatabase(conn: Client) {
  await conn.query("TRUNCATE TABLE form_submissions RESTART IDENTITY CASCADE");
  await conn.query("TRUNCATE TABLE analytics_events RESTART IDENTITY CASCADE");
  await conn.query("TRUNCATE TABLE rate_limits RESTART IDENTITY CASCADE");
}

async function seedTestData(conn: Client) {
  // Insert test form submission
  await conn.query(
    `
    INSERT INTO form_submissions (id, form_type, data, status, ip_hash)
    VALUES ($1, $2, $3, $4, $5)
  `,
    [
      "sub_test_1",
      "virtual-office",
      JSON.stringify({
        companyName: "Test Company",
        contactPerson: "Test User",
        email: "test@example.com",
        phone: "+48 123 456 789",
      }),
      "completed",
      "test_ip_hash",
    ],
  );
}
