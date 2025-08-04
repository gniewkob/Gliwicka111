import { vi, describe, it, expect } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { getCurrentLanguage } from "@/lib/i18n";
import { cookies } from "next/headers";

describe("getCurrentLanguage", () => {
  it("returns language from cookie", () => {
    (cookies as any).mockReturnValue({ get: () => ({ value: "en" }) });
    expect(getCurrentLanguage()).toBe("en");
  });

  it("defaults to pl when cookie missing", () => {
    (cookies as any).mockReturnValue({ get: () => undefined });
    expect(getCurrentLanguage()).toBe("pl");
  });
});
