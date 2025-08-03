import { vi, beforeAll, afterAll, beforeEach } from "vitest"

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

// Setup integration test environment
beforeAll(async () => {
  // Initialize test database
  console.log("Setting up integration test environment...")
})

afterAll(async () => {
  // Cleanup test database
  console.log("Cleaning up integration test environment...")
})

beforeEach(() => {
  vi.clearAllMocks()
})
