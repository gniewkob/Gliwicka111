import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/database/connection-pool", () => ({
  db: { query: vi.fn() },
}));

import { db } from "@/lib/database/connection-pool";
import {
  getSubmissionMetrics,
  getDuplicateAttemptCount,
} from "@/lib/admin/metrics";

describe("admin metrics helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("aggregates submission metrics", async () => {
    const submissions = [
      { processing_time_ms: 10, email_latency_ms: 20 },
      { processing_time_ms: 30, email_latency_ms: 40 },
    ];

    (db.query as any).mockImplementationOnce(async () => {
      const total = submissions.length;
      const avg_processing_time_ms =
        submissions.reduce((s, r) => s + r.processing_time_ms, 0) / total;
      const avg_email_latency_ms =
        submissions.reduce((s, r) => s + r.email_latency_ms, 0) / total;
      return {
        rows: [
          { avg_processing_time_ms, avg_email_latency_ms, total },
        ],
      };
    });

    const metrics = await getSubmissionMetrics();
    expect(metrics.avg_processing_time_ms).toBe(20);
    expect(metrics.avg_email_latency_ms).toBe(30);
    expect(metrics.total).toBe(2);
    expect(db.query).toHaveBeenCalledOnce();
  });

  it("counts duplicate attempts", async () => {
    (db.query as any).mockImplementationOnce(async () => ({
      rows: [{ count: "5" }],
    }));

    const count = await getDuplicateAttemptCount();
    expect(count).toBe(5);
    expect(db.query).toHaveBeenCalledOnce();
  });
});

