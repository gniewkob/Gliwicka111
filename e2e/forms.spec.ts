import { test, expect, type Request, type Page } from "@playwright/test";
import { messages } from "@/lib/i18n";

test.setTimeout(120000);

// Helper used in tests to match Next.js server action form submissions while
// excluding analytics and other unrelated requests.
const isServerActionRequest = (req: Request) => {
  if (req.method() !== "POST") return false;
  const headers = req.headers();
  // Next.js server actions include this header
  if (!headers["next-action"]) return false;

  const url = req.url();
  if (url.includes("/api/analytics")) return false;

  return true;
};

const mockServerAction = async (
  page: Page,
  result: { success: boolean; message: string },
) => {
  const pattern = "**/*"; // match all requests
  await page.route(pattern, async (route) => {
    const req = route.request();
    if (isServerActionRequest(req)) {
      await route.fulfill({
        status: 200,
        headers: { "content-type": "text/x-component" },
        // Next.js server action responses use the RSC streaming format
        body: `0:${JSON.stringify(result)}\n1:0{}\n`,
      });
    } else {
      await route.continue();
    }
  });
  return async () => page.unroute(pattern);
};

const dismissBanner = async (page: Page) => {
  const closeButton = page.locator("button:has(svg.lucide-x)");
  if (await closeButton.count()) {
    try {
      await closeButton.click({ force: true });
      await expect(closeButton).not.toBeVisible();
    } catch {
      // If the banner isn't interactable, continue without failing the test.
    }
  }
};

test.describe("Contact Forms", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forms");
    await dismissBanner(page);
    const consent = page.getByRole("button", { name: /accept/i });
    if (await consent.isVisible()) await consent.click();
  });

  test("should display all form types", async ({ page }) => {
    await expect(page.getByTestId("tab-virtual-office")).toBeVisible();
    await expect(page.getByTestId("tab-coworking")).toBeVisible();
    await expect(page.getByTestId("tab-meeting-room")).toBeVisible();
    await expect(page.getByTestId("tab-advertising")).toBeVisible();
    await expect(page.getByTestId("tab-special-deals")).toBeVisible();
  });

  test("should submit virtual office form successfully", async ({ page }) => {
    const unroute = await mockServerAction(page, {
      success: true,
      message: messages.form.success.pl,
    });

    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form-virtual-office");
    await expect(form).toBeVisible();

    // Fill out the form
    await form.locator('[name="companyName"]').fill("Test Company");
    await form.locator('[name="firstName"]').fill("Jan");
    await form.locator('[name="lastName"]').fill("Kowalski");
    await form.locator('[name="email"]').fill("jan@example.com");
    await form.locator('[name="phone"]').fill("+48 123 456 789");
    await form.locator('[name="nip"]').fill("1234567890");
    await form.getByTestId("businessType-select").click();
    const businessTypeOption = page.getByRole("option", {
      name: /Działalność gospodarcza/i,
    });
    await businessTypeOption.scrollIntoViewIfNeeded();
    await businessTypeOption.click();
    const businessTypeInput = form.locator('input[name="businessType"]');
    if (await businessTypeInput.count()) {
      await expect(businessTypeInput).toHaveValue("sole-proprietorship");
    }
    await form.getByTestId("package-select").click();
    const packageOption = page.getByRole("option", {
      name: /Pakiet Podstawowy/i,
    });
    await packageOption.scrollIntoViewIfNeeded();
    await packageOption.click();
    const packageInput = form.locator('input[name="package"]');
    if (await packageInput.count()) {
      await expect(packageInput).toHaveValue("basic");
    }
    await form.locator('[name="startDate"]').fill("2024-12-01");
    await form.getByTestId("gdpr-checkbox").click();
    await form
      .locator('[name="message"]')
      .fill("Test message for virtual office");

    // Submit the form and check for success message
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.request().method() === "POST" &&
          isServerActionRequest(res.request()) &&
          res.url().includes("/forms"),
      ),
      form.locator('button[type="submit"]').click(),
    ]);
    await expect(
      page.getByTestId("form-success-alert"),
    ).toBeVisible({ timeout: 15000 });

    await unroute();
  });

  test("should validate required fields", async ({ page }) => {
    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form-virtual-office");
    await expect(form).toBeVisible();

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(
      page.getByText(/zgoda na przetwarzanie danych jest wymagana/i),
    ).toBeVisible();
    await expect(
      page.getByText(/typ działalności jest wymagany/i),
    ).toBeVisible();
    await expect(page.getByText(/wybór pakietu jest wymagany/i)).toBeVisible();
    await expect(
      page.getByText(/data rozpoczęcia jest wymagana/i),
    ).toBeVisible();
  });

  test("should validate email format", async ({ page }) => {
    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form-virtual-office");
    await expect(form).toBeVisible();

    // Fill required fields with valid data scoped to the virtual office form
    await form.locator('[name="companyName"]').fill("Test Company");
    await form.locator('[name="firstName"]').fill("Jan");
    await form.locator('[name="lastName"]').fill("Kowalski");
    await form.locator('[name="phone"]').fill("+48 123 456 789");
    await form.locator('[name="nip"]').fill("1234567890");
    // Enter invalid email for validation early
    await form.locator('[name="email"]').fill("invalid-email");
    // Blur the email field to trigger validation
    await form.locator('[name="email"]').blur();
    await form.getByTestId("businessType-select").click();
    const businessTypeOption = page.getByRole("option", {
      name: /Działalność gospodarcza/i,
    });
    await businessTypeOption.scrollIntoViewIfNeeded();
    await businessTypeOption.click();
    await form.getByTestId("package-select").click();
    const packageOption = page.getByRole("option", {
      name: /Pakiet Podstawowy/i,
    });
    await packageOption.scrollIntoViewIfNeeded();
    await packageOption.click();
    await form.locator('[name="startDate"]').fill("2024-12-01");
    await form.getByTestId("gdpr-checkbox").click();
    await form
      .locator('[name="message"]')
      .fill("Test message for email validation");

    // Ensure the email field remains unchanged before submission
    await expect(form.locator('[name="email"]').first()).toHaveValue(
      "invalid-email",
    );

    await form.locator('button[type="submit"]').click();

    // Confirm the invalid email value persists after submission
    await expect(form.locator('[name="email"]').first()).toHaveValue(
      "invalid-email",
    );

    // Check for email validation error
    const emailError = form.getByTestId("virtual-office-email-error");
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText("Nieprawidłowy format adresu email");
  });

  test("should submit coworking form successfully", async ({ page }) => {
    const unroute = await mockServerAction(page, {
      success: true,
      message: messages.form.success.pl,
    });

    // Navigate to coworking form
    await page.getByTestId("tab-coworking").click();

    const form = page.getByTestId("contact-form-coworking");
    await expect(form).toBeVisible();

    // Fill out the form
    await form.locator('[name="firstName"]').fill("Anna");
    await form.locator('[name="lastName"]').fill("Nowak");
    await form.locator('[name="email"]').fill("anna@example.com");
    await form.locator('[name="phone"]').fill("+48 987 654 321");
    await form.locator('[name="companyName"]').fill("Coworking Company");
    await form.getByTestId("workspaceType-select").click();
    const workspaceTypeOption = page.getByRole("option", {
      name: /Hot Desk/i,
    });
    await workspaceTypeOption.scrollIntoViewIfNeeded();
    await workspaceTypeOption.click();
    const workspaceTypeInput = form.locator('input[name="workspaceType"]');
    if (await workspaceTypeInput.count()) {
      await expect(workspaceTypeInput).toHaveValue("hot-desk");
    }
    await form.getByTestId("duration-select").click();
    const durationOption = page.getByRole("option", { name: /Miesięcznie/i });
    await durationOption.scrollIntoViewIfNeeded();
    await durationOption.click();
    const durationInput = form.locator('input[name="duration"]');
    if (await durationInput.count()) {
      await expect(durationInput).toHaveValue("monthly");
    }
    await form.locator('[name="startDate"]').fill("2024-12-01");
    await form.locator('[name="teamSize"]').fill("3");
    await form.getByTestId("gdpr-checkbox").click();
    await form.locator('[name="message"]').fill("Test message for coworking");

    // Submit the form and check for success message
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.request().method() === "POST" &&
          isServerActionRequest(res.request()) &&
          res.url().includes("/forms"),
      ),
      form.locator('button[type="submit"]').click(),
    ]);
    await expect(
      page.getByTestId("form-success-alert"),
    ).toBeVisible({ timeout: 15000 });

    await unroute();
  });

  test("should submit meeting room form successfully", async ({ page }) => {
    const unroute = await mockServerAction(page, {
      success: true,
      message: messages.form.success.pl,
    });

    // Navigate to meeting room form
    await page.getByTestId("tab-meeting-room").click();

    const form = page.getByTestId("contact-form-meeting-room");
    await expect(form).toBeVisible();

    // Fill out the form
    await form.locator('[name="firstName"]').fill("Piotr");
    await form.locator('[name="lastName"]').fill("Kowalczyk");
    await form.locator('[name="email"]').fill("piotr@example.com");
    await form.locator('[name="phone"]').fill("+48 555 666 777");
    await form.locator('[name="companyName"]').fill("Meeting Company");
    await form.locator('[name="date"]').fill("2024-12-15");
    await form.locator('[name="startTime"]').fill("09:00");
    await form.locator('[name="endTime"]').fill("17:00");
    await form.locator('[name="attendees"]').fill("8");
    await form.getByTestId("roomType-select").click();
    const roomTypeOption = page.getByRole("option", {
      name: /Sala Konferencyjna/i,
    });
    await roomTypeOption.scrollIntoViewIfNeeded();
    await roomTypeOption.click();
    const roomTypeInput = form.locator('input[name="roomType"]');
    if (await roomTypeInput.count()) {
      await expect(roomTypeInput).toHaveValue("conference");
    }
    await form.getByLabel(/projektor/i).check();
    await form.getByLabel(/catering/i).check({ force: true });
    await form.getByTestId("gdpr-checkbox").click();
    await form
      .locator('[name="message"]')
      .fill("Test message for meeting room");

    // Submit the form and check for success message
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.request().method() === "POST" &&
          isServerActionRequest(res.request()) &&
          res.url().includes("/forms"),
      ),
      form.locator('button[type="submit"]').click(),
    ]);
    await expect(
      page.getByTestId("form-success-alert"),
    ).toBeVisible({ timeout: 15000 });

    await unroute();
  });

  test("should handle form submission errors gracefully", async ({ page }) => {
    const unroute = await mockServerAction(page, {
      success: false,
      message: messages.form.serverError.pl,
    });

    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form-virtual-office");
    await expect(form).toBeVisible();

    // Fill out all required fields
    await form.locator('[name="companyName"]').fill("Test Company");
    await form.locator('[name="firstName"]').fill("Jan");
    await form.locator('[name="lastName"]').fill("Kowalski");
    await form.locator('[name="email"]').fill("jan@example.com");
    await form.locator('[name="phone"]').fill("+48 123 456 789");
    await form.locator('[name="nip"]').fill("1234567890");
    await form.getByTestId("businessType-select").click();
    const businessTypeOption = page.getByRole("option", {
      name: /Działalność gospodarcza/i,
    });
    await businessTypeOption.scrollIntoViewIfNeeded();
    await businessTypeOption.click();
    await form.getByTestId("package-select").click();
    const packageOption = page.getByRole("option", {
      name: /Pakiet Podstawowy/i,
    });
    await packageOption.scrollIntoViewIfNeeded();
    await packageOption.click();
    await form.locator('[name="startDate"]').fill("2024-12-01");
    await form.getByTestId("gdpr-checkbox").click();
    await form
      .locator('[name="message"]')
      .fill("Test message for error handling");

    // Submit the form and check for error message
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.request().method() === "POST" &&
          isServerActionRequest(res.request()) &&
          res.url().includes("/forms"),
      ),
      form.locator('button[type="submit"]').click(),
    ]);
    const errorToast = page
      .locator("[data-sonner-toast]")
      .filter({ hasText: messages.form.serverError.pl });
    await expect(errorToast).toBeVisible({ timeout: 15000 });

    await unroute();
  });

  test("should track analytics events", async ({ page }) => {
    // Listen for analytics requests
    const analyticsRequests = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/analytics/track")) {
        analyticsRequests.push(request);
      }
    });

    // Simulate analytics consent
    await page.evaluate(() => {
      localStorage.setItem(
        "analytics-consent",
        JSON.stringify({
          necessary: true,
          analytics: true,
          marketing: false,
          timestamp: Date.now(),
        }),
      );
    });
    await page.reload();
    await dismissBanner(page);
    const consent = page.getByRole("button", { name: /accept/i });
    if (await consent.isVisible()) await consent.click();

    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form-virtual-office");
    await expect(form).toBeVisible();

    // Interact with form fields
    await page.fill('[name="companyName"]', "Test Company");
    await page.fill('[name="firstName"]', "Jan");
    await page.fill('[name="lastName"]', "Kowalski");

    // Wait a bit for analytics events to be sent
    await page.waitForTimeout(1000);

    // Check that analytics events were tracked
    expect(analyticsRequests.length).toBeGreaterThan(0);
  });

  test("should be accessible", async ({ page }) => {
    // Check for proper heading structure
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form-virtual-office");
    await expect(form).toBeVisible();

    // Check that all form fields have labels
    const inputs = await form.locator("input, select, textarea").all();
    for (const input of inputs) {
      const id = await input.getAttribute("id");
      if (id) {
        await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
      }
    }

    // Check submit button
    await expect(page.getByRole("button", { name: /wyślij/i })).toBeVisible();
  });

  test("should work on mobile devices", async ({ page }) => {
    const unroute = await mockServerAction(page, {
      success: true,
      message: messages.form.success.pl,
    });

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState("networkidle");

    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form-virtual-office");
    await expect(form).toBeVisible();

    // Fill out form on mobile
    await form.locator('[name="companyName"]').fill("Mobile Test Company");
    await form.locator('[name="firstName"]').fill("Mobile");
    await form.locator('[name="lastName"]').fill("User");
    await form.locator('[name="email"]').fill("mobile@example.com");
    await form.locator('[name="phone"]').fill("+48 123 456 789");
    await form.getByTestId("businessType-select").click();
    const businessTypeOption = page.getByRole("option", {
      name: /Działalność gospodarcza/i,
    });
    await businessTypeOption.scrollIntoViewIfNeeded();
    await businessTypeOption.click();
    await form.getByTestId("package-select").click();
    const packageOption = page.getByRole("option", {
      name: /Pakiet Podstawowy/i,
    });
    await packageOption.scrollIntoViewIfNeeded();
    await packageOption.click();
    await form.locator('[name="startDate"]').fill("2024-12-01");
    await form.getByTestId("gdpr-checkbox").click();
    await form.locator('[name="message"]').fill("Mobile test message");

    // Submit the form and check for success message
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.request().method() === "POST" &&
          isServerActionRequest(res.request()) &&
          res.url().includes("/forms"),
      ),
      form.locator('button[type="submit"]').click(),
    ]);
    const successToast = page
      .locator("[data-sonner-toast]")
      .filter({ hasText: messages.form.success.pl });
    await expect(successToast).toBeVisible({ timeout: 15000 });

    await unroute();
  });
});
