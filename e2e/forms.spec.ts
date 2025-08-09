import { test, expect, type Request } from "@playwright/test";
import { messages } from "@/lib/i18n";

// Helper used in tests to match Next.js server action form submissions while
// excluding analytics and other unrelated requests. We require the
// `next-action` header and a known URL segment (either `/_actions/` or the
// `/forms` page path) to ensure the request is a genuine form submission.
const isServerActionRequest = (req: Request) => {
  if (req.method() !== "POST") return false;

  const url = req.url();
  if (url.includes("/api/analytics")) return false;

  return (
    !!req.headerValue("next-action") &&
    (url.includes("/_actions/") || url.includes("/forms"))
  );
};

test.describe("Contact Forms", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forms");
    const consent = page.getByRole("button", { name: /accept/i });
    if (await consent.isVisible()) await consent.click();
  });

  test("should display all form types", async ({ page }) => {
    await expect(page.getByTestId("tab-virtual-office")).toBeVisible();
    await expect(page.getByTestId("tab-coworking")).toBeVisible();
    await expect(page.getByTestId("tab-meeting-rooms")).toBeVisible();
    await expect(page.getByTestId("tab-advertising")).toBeVisible();
    await expect(page.getByTestId("tab-special-deals")).toBeVisible();
  });

  test("should submit virtual office form successfully", async ({ page }) => {
    await page.route("**", async (route) => {
      const req = route.request();
      if (isServerActionRequest(req)) {
        console.log(req.url());
        await route.fulfill({
          status: 200,
          headers: { "content-type": "text/x-component" },
          body: `0:${JSON.stringify({
            success: true,
            message: messages.form.success.pl,
          })}\n`,
        });
      } else {
        await route.continue();
      }
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
    await page
      .getByRole("option", { name: /Działalność gospodarcza/i })
      .click();
    const businessTypeInput = form.locator('input[name="businessType"]');
    if (await businessTypeInput.count()) {
      await expect(businessTypeInput).toHaveValue("sole-proprietorship");
    }
    await form.getByTestId("package-select").click();
    await page.getByRole("option", { name: /Pakiet Podstawowy/i }).click();
    const packageInput = form.locator('input[name="package"]');
    if (await packageInput.count()) {
      await expect(packageInput).toHaveValue("basic");
    }
    await form.locator('[name="startDate"]').fill("2024-12-01");
    await form.getByTestId("gdpr-checkbox").click();
    await form
      .locator('[name="message"]')
      .fill("Test message for virtual office");

    // Submit the form and wait for server action response
    const [response] = await Promise.all([
      page.waitForResponse((res) => isServerActionRequest(res.request())),
      form.locator('button[type="submit"]').click(),
    ]);
    expect(response.ok()).toBeTruthy();

    // Check for success message
    await expect(form.getByTestId("form-success-alert")).toBeVisible();
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
    await form.getByTestId("businessType-select").click();
    await page
      .getByRole("option", { name: /Działalność gospodarcza/i })
      .click();
    await form.getByTestId("package-select").click();
    await page.getByRole("option", { name: /Pakiet Podstawowy/i }).click();
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

    // Check for email validation error and ensure a single element is targeted
    const emailError = form
      .locator('[data-testid="virtual-office-email-error"]')
      .filter({ hasText: /Nieprawidłowy format adresu email/ })
      .first();
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText("Nieprawidłowy format adresu email");
  });

  test("should submit coworking form successfully", async ({ page }) => {
    await page.route("**", async (route) => {
      const req = route.request();
      if (isServerActionRequest(req)) {
        console.log(req.url());
        await route.fulfill({
          status: 200,
          headers: { "content-type": "text/x-component" },
          body: `0:${JSON.stringify({
            success: true,
            message: messages.form.success.pl,
          })}\n`,
        });
      } else {
        await route.continue();
      }
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
    await page.getByRole("option", { name: /Hot Desk/i }).click();
    const workspaceTypeInput = form.locator('input[name="workspaceType"]');
    if (await workspaceTypeInput.count()) {
      await expect(workspaceTypeInput).toHaveValue("hot-desk");
    }
    await form.getByTestId("duration-select").click();
    await page.getByRole("option", { name: /Miesięcznie/i }).click();
    const durationInput = form.locator('input[name="duration"]');
    if (await durationInput.count()) {
      await expect(durationInput).toHaveValue("monthly");
    }
    await form.locator('[name="startDate"]').fill("2024-12-01");
    await form.locator('[name="teamSize"]').fill("3");
    await form.getByTestId("gdpr-checkbox").click();
    await form.locator('[name="message"]').fill("Test message for coworking");

    // Submit the form and wait for server action response
    const [response] = await Promise.all([
      page.waitForResponse((res) => isServerActionRequest(res.request())),
      form.locator('button[type="submit"]').click(),
    ]);
    expect(response.ok()).toBeTruthy();

    // Check for success message
    await expect(form.getByTestId("form-success-alert")).toBeVisible();
  });

  test("should submit meeting room form successfully", async ({ page }) => {
    await page.route("**", async (route) => {
      const req = route.request();
      if (isServerActionRequest(req)) {
        console.log(req.url());
        await route.fulfill({
          status: 200,
          headers: { "content-type": "text/x-component" },
          body: `0:${JSON.stringify({
            success: true,
            message: messages.form.success.pl,
          })}\n`,
        });
      } else {
        await route.continue();
      }
    });

    // Navigate to meeting room form
    await page.getByTestId("tab-meeting-rooms").click();

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
    await page.getByRole("option", { name: /Sala Konferencyjna/i }).click();
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

    // Submit the form and wait for server action response
    const [response] = await Promise.all([
      page.waitForResponse((res) => isServerActionRequest(res.request())),
      form.locator('button[type="submit"]').click(),
    ]);
    expect(response.ok()).toBeTruthy();

    // Check for success message
    await expect(form.getByTestId("form-success-alert")).toBeVisible();
  });

  test("should handle form submission errors gracefully", async ({ page }) => {
    await page.route("**", async (route) => {
      const req = route.request();
      if (isServerActionRequest(req)) {
        console.log(req.url());
        await route.fulfill({
          status: 200,
          headers: { "content-type": "text/x-component" },
          body: `0:${JSON.stringify({
            success: false,
            message: messages.form.serverError.pl,
          })}\n`,
        });
      } else {
        await route.continue();
      }
    });

    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form-virtual-office");
    await expect(form).toBeVisible();

    // Fill out minimal required fields
    await form.locator('[name="companyName"]').fill("Test Company");
    await form.locator('[name="firstName"]').fill("Jan");
    await form.locator('[name="lastName"]').fill("Kowalski");
    await form.locator('[name="email"]').fill("jan@example.com");
    await form.locator('[name="phone"]').fill("+48 123 456 789");
    await form.getByTestId("gdpr-checkbox").click();

    // Submit the form and wait for server action response
    const [response] = await Promise.all([
      page.waitForResponse((res) => isServerActionRequest(res.request())),
      form.locator('button[type="submit"]').click(),
    ]);
    expect(response.ok()).toBeTruthy();

    // Check for error message
    const errorAlert = form.getByTestId("form-error-alert");
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toHaveText(messages.form.serverError.pl);
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
    await page.route("**", async (route) => {
      const req = route.request();
      if (isServerActionRequest(req)) {
        console.log(req.url());
        await route.fulfill({
          status: 200,
          headers: { "content-type": "text/x-component" },
          body: `0:${JSON.stringify({
            success: true,
            message: messages.form.success.pl,
          })}\n`,
        });
      } else {
        await route.continue();
      }
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
    await page
      .getByRole("option", { name: /Działalność gospodarcza/i })
      .click();
    await form.getByTestId("package-select").click();
    await page.getByRole("option", { name: /Pakiet Podstawowy/i }).click();
    await form.locator('[name="startDate"]').fill("2024-12-01");
    await form.getByTestId("gdpr-checkbox").click();
    await form.locator('[name="message"]').fill("Mobile test message");

    // Submit the form and wait for server action response
    const [response] = await Promise.all([
      page.waitForResponse((res) => isServerActionRequest(res.request())),
      form.locator('button[type="submit"]').click(),
    ]);
    expect(response.ok()).toBeTruthy();

    // Check for success message
    await expect(form.getByTestId("form-success-alert")).toBeVisible();
  });
});
