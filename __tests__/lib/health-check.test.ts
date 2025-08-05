import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/database/connection-pool", () => ({
  db: { query: vi.fn() },
}));

vi.mock("@/lib/email/smtp-client", () => ({
  emailClient: { verifyConnection: vi.fn() },
}));

import { db } from "@/lib/database/connection-pool";
import { emailClient } from "@/lib/email/smtp-client";
import { healthCheck } from "@/lib/monitoring/health-check";

function mockOtherChecks() {
  const healthy = (service: string) => ({
    service,
    status: "healthy" as const,
    responseTime: 0,
    message: "ok",
    timestamp: new Date().toISOString(),
  });
  const hc: any = healthCheck;
  vi.spyOn(hc, "checkFileSystem").mockImplementation(async () => healthy("filesystem"));
  vi.spyOn(hc, "checkMemoryUsage").mockImplementation(async () => healthy("memory"));
  vi.spyOn(hc, "checkExternalDependencies").mockImplementation(async () => healthy("external-dependencies"));
  vi.spyOn(hc, "checkFormSubmissionEndpoint").mockImplementation(async () => healthy("form-submission"));
  vi.spyOn(hc, "checkAnalyticsService").mockImplementation(async () => healthy("analytics"));
}

describe("HealthCheckService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports healthy when all checks pass", async () => {
    (db.query as any).mockResolvedValue({ rows: [], rowCount: 1 });
    (emailClient.verifyConnection as any).mockResolvedValue(true);
    mockOtherChecks();

    const result = await healthCheck.performHealthCheck();
    expect(result.status).toBe("healthy");
    expect(result.checks.find((c) => c.service === "database")?.status).toBe("healthy");
    expect(result.checks.find((c) => c.service === "email")?.status).toBe("healthy");

    const response = await healthCheck.createHealthCheckEndpoint({} as any);
    expect(response.status).toBe(200);
  });

  it("reports unhealthy when database check fails", async () => {
    (db.query as any).mockRejectedValue(new Error("db error"));
    (emailClient.verifyConnection as any).mockResolvedValue(true);
    mockOtherChecks();

    const result = await healthCheck.performHealthCheck();
    expect(result.status).toBe("unhealthy");
    expect(result.checks.find((c) => c.service === "database")?.status).toBe("unhealthy");

    const response = await healthCheck.createHealthCheckEndpoint({} as any);
    expect(response.status).toBe(503);
  });

  it("reports unhealthy when email service fails", async () => {
    (db.query as any).mockResolvedValue({ rows: [], rowCount: 1 });
    (emailClient.verifyConnection as any).mockResolvedValue(false);
    mockOtherChecks();

    const result = await healthCheck.performHealthCheck();
    expect(result.status).toBe("unhealthy");
    expect(result.checks.find((c) => c.service === "email")?.status).toBe("unhealthy");

    const response = await healthCheck.createHealthCheckEndpoint({} as any);
    expect(response.status).toBe(503);
  });
});

