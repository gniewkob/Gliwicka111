import { test, expect } from "@playwright/test";

process.env.NEXT_PUBLIC_ADMIN_USER = "admin";
process.env.NEXT_PUBLIC_ADMIN_PASS = "password";

const mockData = {
  windowHours: 24,
  submissions: {
    averageProcessingTime: 10,
    peakProcessingTime: 20,
    averageEmailLatency: 5,
    peakEmailLatency: 10,
    errorRate: 0.01,
  },
  failedEmails: {
    averageRetryCount: 1,
    peakRetryCount: 2,
    retryRate: 0.05,
  },
  rateLimits: {
    averageCount: 1,
    peakCount: 5,
  },
};

test.describe("Admin Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/admin/metrics", (route) =>
      route.fulfill({ json: mockData })
    );
  });

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

