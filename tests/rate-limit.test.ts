import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  const identifier = "test";
  let db: { query: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    db = { query: vi.fn() } as any;
  });

  it("creates record when none exists", async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({});
    const result = await checkRateLimit(db, identifier, 5, 1000);
    expect(result).toBe(true);
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("INSERT INTO rate_limits"),
      [identifier, expect.any(Number)],
    );
  });

  it("blocks when limit exceeded", async () => {
    const future = Date.now() + 1000;
    db.query
      .mockResolvedValueOnce({ rows: [{ count: 5, reset_time: future }] })
      .mockResolvedValueOnce({});
    const result = await checkRateLimit(db, identifier, 5, 1000);
    expect(result).toBe(false);
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("INSERT INTO duplicate_attempts"),
      [identifier],
    );
  });

  it("increments count when under limit", async () => {
    const future = Date.now() + 1000;
    db.query
      .mockResolvedValueOnce({ rows: [{ count: 1, reset_time: future }] })
      .mockResolvedValueOnce({});
    const result = await checkRateLimit(db, identifier, 5, 1000);
    expect(result).toBe(true);
    expect(db.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("UPDATE rate_limits"),
      [identifier],
    );
  });
});
