import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/health/route";
import { emailClient } from "@/lib/email/smtp-client";

describe("GET /api/health", () => {
  beforeEach(() => {
    (emailClient.verifyConnection as any).mockResolvedValue(true);
    vi.spyOn(globalThis, "fetch" as any).mockResolvedValue(
      new Response(null, { status: 405 }) as any,
    );
  });

  it("returns healthy status", async () => {
    const res = await GET(new Request("http://localhost/api/health"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("healthy");
  });
});
