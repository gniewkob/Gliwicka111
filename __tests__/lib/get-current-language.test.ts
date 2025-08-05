import { vi, describe, it, expect } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { getCurrentLanguage } from "@/lib/get-current-language";
import { cookies } from "next/headers";

describe("getCurrentLanguage", () => {
  it("returns language from cookie", async () => {
    (cookies as any).mockReturnValue({ get: () => ({ value: "en" }) });
    await expect(getCurrentLanguage()).resolves.toBe("en");
  });

  it("defaults to pl when cookie missing", async () => {
    (cookies as any).mockReturnValue({ get: () => undefined });
    await expect(getCurrentLanguage()).resolves.toBe("pl");
  });
});
