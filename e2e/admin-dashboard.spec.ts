import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard", () => {
  test("renders metrics with basic auth", async ({ page }) => {
    const user = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
    const pass = process.env.NEXT_PUBLIC_ADMIN_PASS || "password";
    const auth = Buffer.from(`${user}:${pass}`).toString("base64");

    await page.setExtraHTTPHeaders({ authorization: `Basic ${auth}` });
    await page.goto("/admin/dashboard");

    await expect(page.getByRole("heading", { name: "Admin Metrics" })).toBeVisible();
    await expect(page.getByText("Avg Processing Time")).toBeVisible();
  });
});

