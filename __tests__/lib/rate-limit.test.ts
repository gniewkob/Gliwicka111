import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("blocks requests exceeding the limit", async () => {
    const store = new Map<string, { count: number; reset_time: number }>();
    const db = {
      async query(sql: string, params: any[]) {
        if (sql.startsWith("SELECT")) {
          const record = store.get(params[0]);
          return { rows: record ? [record] : [] };
        }
        if (sql.startsWith("INSERT")) {
          store.set(params[0], { count: 1, reset_time: params[1] });
          return { rows: [], rowCount: 1 };
        }
        if (sql.startsWith("UPDATE rate_limits SET count = count + 1")) {
          const record = store.get(params[0]);
          if (record) {
            record.count += 1;
            store.set(params[0], record);
          }
          return { rows: [], rowCount: 1 };
        }
        throw new Error("Unexpected query: " + sql);
      },
    };

    const id = "test";
    const limit = 2;
    const windowMs = 60000;

    expect(await checkRateLimit(db, id, limit, windowMs)).toBe(true);
    expect(await checkRateLimit(db, id, limit, windowMs)).toBe(true);
    expect(await checkRateLimit(db, id, limit, windowMs)).toBe(false);
  });
});
