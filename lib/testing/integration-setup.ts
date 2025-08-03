import { vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest"
import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { Client } from "pg"

let client: Client

// Mock environment variables for integration tests
process.env.NODE_ENV = "test"
process.env.DB_HOST = "localhost"
process.env.DB_PORT = "5432"
process.env.DB_NAME = "test_db"
process.env.DB_USER = "test_user"
process.env.DB_PASSWORD = "test_password"
process.env.SMTP_HOST = "smtp.example.com"
process.env.SMTP_PORT = "587"
process.env.SMTP_USER = "test@example.com"
process.env.SMTP_PASS = "test_password"
process.env.ADMIN_EMAIL = "admin@example.com"
process.env.IP_SALT = "test_salt"

// Mock database connection
vi.mock("@/lib/database/connection-pool", () => ({
  db: {
    query: vi.fn(),
    transaction: vi.fn(),
  },
}))

// Mock email service
vi.mock("@/lib/email/smtp-client", () => ({
  emailClient: {
    sendEmail: vi.fn(),
    verifyConnection: vi.fn(),
  },
}))

// Database setup for integration tests
beforeAll(async () => {
  // Create test database connection
  client = new Client({
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "test_user",
    password: process.env.DB_PASSWORD || "test_password",
    database: process.env.DB_NAME || "test_db",
  })

  await client.connect()

  // Run database migrations
  await runMigrations(client)
})

beforeEach(async () => {
  // Clean database before each test
  await cleanDatabase(client)

  // Seed test data
  await seedTestData(client)

  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

afterAll(async () => {
  if (client) {
    await client.end()
  }
})

async function runMigrations(conn: Client) {
  // Create tables for testing
  await conn.query(`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id SERIAL PRIMARY KEY,
      form_type VARCHAR(50) NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      processed_at TIMESTAMP NULL,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed'))
    )
  `)

  await conn.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id SERIAL PRIMARY KEY,
      form_type VARCHAR(50) NOT NULL,
      event_type VARCHAR(50) NOT NULL,
      session_id VARCHAR(100) NOT NULL,
      timestamp BIGINT NOT NULL,
      data JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function cleanDatabase(conn: Client) {
  await conn.query("TRUNCATE TABLE form_submissions RESTART IDENTITY CASCADE")
  await conn.query("TRUNCATE TABLE analytics_events RESTART IDENTITY CASCADE")
}

async function seedTestData(conn: Client) {
  // Insert test form submission
  await conn.query(
    `
    INSERT INTO form_submissions (form_type, data, status)
    VALUES ($1, $2, $3)
  `,
    [
      "virtual-office",
      JSON.stringify({
        companyName: "Test Company",
        contactPerson: "Test User",
        email: "test@example.com",
        phone: "+48 123 456 789",
      }),
      "processed",
    ],
  )
}
