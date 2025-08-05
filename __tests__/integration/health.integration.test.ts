import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { GET } from "@/app/api/health/route"
import { db } from "@/lib/database/connection-pool"
import { emailClient } from "@/lib/email/smtp-client"
import { healthCheck } from "@/lib/monitoring/health-check"

function mockOtherChecks() {
  const healthy = (service: string) => ({
    service,
    status: "healthy" as const,
    responseTime: 0,
    message: "ok",
    timestamp: new Date().toISOString(),
  })
  const hc: any = healthCheck
  vi.spyOn(hc, "checkFileSystem").mockImplementation(async () => healthy("filesystem"))
  vi.spyOn(hc, "checkMemoryUsage").mockImplementation(async () => healthy("memory"))
  vi
    .spyOn(hc, "checkExternalDependencies")
    .mockImplementation(async () => healthy("external-dependencies"))
  vi
    .spyOn(hc, "checkFormSubmissionEndpoint")
    .mockImplementation(async () => healthy("form-submission"))
  vi
    .spyOn(hc, "checkAnalyticsService")
    .mockImplementation(async () => healthy("analytics"))
}

describe("GET /api/health", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("returns 200 when dependencies are healthy", async () => {
    vi.spyOn(db, "query").mockResolvedValue({ rows: [], rowCount: 1 } as any)
    vi.spyOn(emailClient, "verifyConnection").mockResolvedValue(true as any)
    mockOtherChecks()

    const response = await GET(new Request("http://localhost/api/health"))
    expect(response.status).toBe(200)
  })

  it("returns 503 when database check fails", async () => {
    vi.spyOn(db, "query").mockRejectedValue(new Error("db error"))
    vi.spyOn(emailClient, "verifyConnection").mockResolvedValue(true as any)
    mockOtherChecks()

    const response = await GET(new Request("http://localhost/api/health"))
    expect(response.status).toBe(503)
  })

  it("returns 503 when email service check fails", async () => {
    vi.spyOn(db, "query").mockResolvedValue({ rows: [], rowCount: 1 } as any)
    vi.spyOn(emailClient, "verifyConnection").mockResolvedValue(false as any)
    mockOtherChecks()

    const response = await GET(new Request("http://localhost/api/health"))
    expect(response.status).toBe(503)
  })
})

