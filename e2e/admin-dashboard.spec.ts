import { test, expect } from "@playwright/test";

process.env.NEXT_PUBLIC_ADMIN_USER = "admin";
process.env.NEXT_PUBLIC_ADMIN_PASS = "password";

test.describe("Admin Dashboard", () => {
  test("renders metrics with basic auth", async ({ page }) => {
    const user = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
    const pass = process.env.NEXT_PUBLIC_ADMIN_PASS || "password";
    const auth = Buffer.from(`${user}:${pass}`).toString("base64");

    await page.setExtraHTTPHeaders({ authorization: `Basic ${auth}` });
    await page.goto("/admin/dashboard");
    const consent = page.getByRole("button", { name: /accept/i });
    if (await consent.isVisible()) await consent.click();

    await expect(page.getByRole("heading", { name: "Admin Metrics" })).toBeVisible();
  });
});

