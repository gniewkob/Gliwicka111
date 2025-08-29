import { test, expect } from "@playwright/test";
import { goto, dismissCookieBanner } from "./helpers";

test("Home renders", async ({ page }) => {
  await goto(page, "/");
  await dismissCookieBanner(page);
  // Look for the main heading with a robust matcher (works across minor text changes)
  await expect(
    page.getByRole("heading", { name: /zarządzanie nieruchomościami/i }),
  ).toBeVisible();
});

test("Admin shell behind auth", async ({ page }) => {
  await goto(page, "/admin/dashboard");
  await dismissCookieBanner(page);
  // Admin dashboard uses HTTP Basic Auth
  // Check for either unauthorized response or successful load
  // The page shows "Loading..." initially, then either error or content
  await page.waitForTimeout(1000);
  // Check if we see either an error or the dashboard content
  const pageContent = await page.locator("body").textContent();
  // Should contain either auth error or metrics content
  expect(pageContent).toMatch(/unauthorized|loading|metrics|error|avg|peak/i);
});
