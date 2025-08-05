import { hashIP } from "@/lib/security/ip";
import { vi, describe, it, expect, afterEach } from "vitest";

const originalSalt = process.env.IP_SALT;
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  if (originalSalt === undefined) {
    delete process.env.IP_SALT;
  } else {
    process.env.IP_SALT = originalSalt;
  }
  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }
  vi.restoreAllMocks();
});

describe("hashIP", () => {
  it("generates deterministic hash when IP_SALT is set", async () => {
    process.env.IP_SALT = "test-salt";
    const hash = await hashIP("127.0.0.1");
    expect(hash).toBe("bdbb9fe01a7cea10");
  });

  it("warns and falls back when IP_SALT is undefined", async () => {
    delete process.env.IP_SALT;
    process.env.NODE_ENV = "development";
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const hash = await hashIP("127.0.0.1");
    expect(warn).toHaveBeenCalledWith("IP_SALT environment variable is not set");
    expect(hash).toBe("165e2bb85429fd34");
  });
});
