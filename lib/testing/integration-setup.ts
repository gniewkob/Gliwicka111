import { vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest"
import "@testing-library/jest-dom"
import { cleanup } from "@testing-library/react"
import { createConnection, type Connection } from "mysql2/promise"

let connection: Connection

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
  connection = await createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "test_user",
    password: process.env.DB_PASSWORD || "test_password",
    database: process.env.DB_NAME || "test_db",
  })

  // Run database migrations
  await runMigrations(connection)
})

beforeEach(async () => {
  // Clean database before each test
  await cleanDatabase(connection)

  // Seed test data
  await seedTestData(connection)

  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

afterAll(async () => {
  if (connection) {
    await connection.end()
  }
})

async function runMigrations(conn: Connection) {
  // Create tables for testing
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      form_type VARCHAR(50) NOT NULL,
      data JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      processed_at TIMESTAMP NULL,
      status ENUM('pending', 'processed', 'failed') DEFAULT 'pending'
    )
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      form_type VARCHAR(50) NOT NULL,
      event_type VARCHAR(50) NOT NULL,
      session_id VARCHAR(100) NOT NULL,
      timestamp BIGINT NOT NULL,
      data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

async function cleanDatabase(conn: Connection) {
  await conn.execute("DELETE FROM form_submissions")
  await conn.execute("DELETE FROM analytics_events")
}

async function seedTestData(conn: Connection) {
  // Insert test form submission
  await conn.execute(
    `
    INSERT INTO form_submissions (form_type, data, status) 
    VALUES (?, ?, ?)
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
