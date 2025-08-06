import { describe, it, expect, vi } from "vitest";
import { GET } from "@/app/api/admin/metrics/route";
import { db } from "@/lib/database/connection-pool";

describe("GET /api/admin/metrics", () => {
  it("returns 401 without credentials", async () => {
    const res = await GET(new Request("http://localhost/api/admin/metrics") as any);
    expect(res.status).toBe(401);
  });

  it("returns metrics with valid credentials", async () => {
    const hour = new Date().toISOString();
    vi.spyOn(db, "query")
      .mockResolvedValueOnce({
        rows: [
          {
            hour,
            avg_processing_time_ms: 10,
            max_processing_time_ms: 20,
            avg_email_latency_ms: 5,
            max_email_latency_ms: 7,
            submissions: 2,
            errors: 1,
          },
        ],
      } as any)
      .mockResolvedValueOnce({
        rows: [
          {
            hour,
            avg_retry_count: 2,
            max_retry_count: 3,
            failures: 1,
            total_retries: 2,
          },
        ],
      } as any)
      .mockResolvedValueOnce({
        rows: [
          {
            hour,
            avg_count: 1,
            max_count: 2,
            hits: 1,
            total_count: 1,
          },
        ],
      } as any);

    const req = new Request("http://localhost/api/admin/metrics", {
      headers: { authorization: "Bearer dev-token" },
    });

    const res = await GET(req as any);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.submissions.averageProcessingTime).toBe(10);
    expect(data.failedEmails.averageRetryCount).toBe(2);
    expect(data.rateLimits.averageCount).toBe(1);
  });
});

