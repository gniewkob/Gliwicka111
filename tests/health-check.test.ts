import { describe, it, expect, vi, afterEach } from "vitest";
import { HealthCheckService } from "@/lib/monitoring/health-check";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("health check form endpoints", () => {
  it("checks all form endpoints", async () => {
    const service = HealthCheckService.getInstance();
    const mockResponse = new Response(null, { status: 405 });
    const fetchMock = vi
      .spyOn(globalThis, "fetch" as any)
      .mockResolvedValue(mockResponse as any);

    const result = await (service as any).checkFormSubmissionEndpoint();

    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(result.status).toBe("healthy");
    expect(result.details.endpoints).toEqual([
      "/api/forms/virtual-office",
      "/api/forms/coworking",
      "/api/forms/meeting-room",
      "/api/forms/advertising",
      "/api/forms/special-deals",
    ]);
  });
});
