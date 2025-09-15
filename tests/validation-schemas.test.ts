import { describe, it, expect } from "vitest";
import {
  phoneRegex,
  nipRegex,
  baseFormSchema,
  virtualOfficeFormSchema,
} from "@/lib/validation-schemas";

describe("validation schemas", () => {
  it("validates phone numbers", () => {
    expect(phoneRegex.test("+48 123 123 123")).toBe(true);
    expect(phoneRegex.test("123" )).toBe(false);
  });

  it("validates NIP numbers", () => {
    expect(nipRegex.test("1234567890")).toBe(true);
    expect(nipRegex.test("1234")).toBe(false);
  });

  it("fails invalid base form data", () => {
    const result = baseFormSchema.safeParse({
      firstName: "A",
      lastName: "B",
      email: "bad",
      phone: "123",
      gdprConsent: false,
    });
    expect(result.success).toBe(false);
  });

  it("parses valid virtual office form", () => {
    const result = virtualOfficeFormSchema.safeParse({
      firstName: "Jan",
      lastName: "Kowalski",
      email: "jan@example.com",
      phone: "+48 123 123 123",
      gdprConsent: true,
      package: "basic",
      startDate: "2024-01-01",
      businessType: "llc",
    });
    expect(result.success).toBe(true);
  });
});
