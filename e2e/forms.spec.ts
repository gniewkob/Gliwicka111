import { test, expect } from "@playwright/test";

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
    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form").first();
    await expect(form).toBeVisible();

    // Fill out the form
    await page.fill('[name="companyName"]', "Test Company");
    await page.fill('[name="firstName"]', "Jan");
    await page.fill('[name="lastName"]', "Kowalski");
    await page.fill('[name="email"]', "jan@example.com");
    await page.fill('[name="phone"]', "+48 123 456 789");
    await page.fill('[name="nip"]', "1234567890");
    await page
      .locator('label:has-text("Typ działalności") + div')
      .click();
    await page
      .getByRole('option', { name: /Działalność gospodarcza/i })
      .click();
    const businessTypeInput = page.locator('input[name="businessType"]');
    if (await businessTypeInput.count()) {
      await expect(businessTypeInput).toHaveValue('sole-proprietorship');
    }
    await page
      .locator('label:has-text("Wybierz pakiet") + div')
      .click();
    await page
      .getByRole('option', { name: /Pakiet Podstawowy/i })
      .click();
    const packageInput = page.locator('input[name="package"]');
    if (await packageInput.count()) {
      await expect(packageInput).toHaveValue('basic');
    }
    await page.fill('[name="startDate"]', "2024-12-01");
    await page.check('[name="gdprConsent"]');
    await page.fill('[name="message"]', "Test message for virtual office");

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.getByText(/formularz został wysłany/i)).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form").first();
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

    const form = page.getByTestId("contact-form").first();
    await expect(form).toBeVisible();

    // Fill required fields with valid data
    await page.fill('[name="companyName"]', "Test Company");
    await page.fill('[name="firstName"]', "Jan");
    await page.fill('[name="lastName"]', "Kowalski");
    await page.fill('[name="phone"]', "+48 123 456 789");
    await page
      .locator('label:has-text("Typ działalności") + div')
      .click();
    await page
      .getByRole('option', { name: /Działalność gospodarcza/i })
      .click();
    const businessTypeInput = page.locator('input[name="businessType"]');
    if (await businessTypeInput.count()) {
      await expect(businessTypeInput).toHaveValue('sole-proprietorship');
    }
    await page
      .locator('label:has-text("Wybierz pakiet") + div')
      .click();
    await page
      .getByRole('option', { name: /Pakiet Podstawowy/i })
      .click();
    const packageInput = page.locator('input[name="package"]');
    if (await packageInput.count()) {
      await expect(packageInput).toHaveValue('basic');
    }
    await page.fill('[name="startDate"]', "2024-12-01");
    await page.check('[name="gdprConsent"]');

    // Enter invalid email
    await page.fill('[name="email"]', "invalid-email");
    await page.click('button[type="submit"]');

    // Check for email validation error
    await expect(
      page.getByText(/nieprawidłowy format adresu email/i),
    ).toBeVisible();
  });

  test("should submit coworking form successfully", async ({ page }) => {
    // Navigate to coworking form
    await page.getByTestId("tab-coworking").click();

    const form = page.getByTestId("contact-form").nth(1);
    await expect(form).toBeVisible();

    // Fill out the form
    await page.fill('[name="firstName"]', "Anna");
    await page.fill('[name="lastName"]', "Nowak");
    await page.fill('[name="email"]', "anna@example.com");
    await page.fill('[name="phone"]', "+48 987 654 321");
    await page.fill('[name="companyName"]', "Coworking Company");
    await page
      .locator('label:has-text("Typ przestrzeni") + div')
      .click();
    await page.getByRole('option', { name: /Hot Desk/i }).click();
    const workspaceTypeInput = page.locator('input[name="workspaceType"]');
    if (await workspaceTypeInput.count()) {
      await expect(workspaceTypeInput).toHaveValue('hot-desk');
    }
    await page
      .locator('label:has-text("Okres wynajmu") + div')
      .click();
    await page.getByRole('option', { name: /Miesięcznie/i }).click();
    const durationInput = page.locator('input[name="duration"]');
    if (await durationInput.count()) {
      await expect(durationInput).toHaveValue('monthly');
    }
    await page.fill('[name="startDate"]', "2024-12-01");
    await page.fill('[name="teamSize"]', "3");
    await page.check('[name="gdprConsent"]');
    await page.fill('[name="message"]', "Test message for coworking");

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.getByText(/formularz został wysłany/i)).toBeVisible();
  });

  test("should submit meeting room form successfully", async ({ page }) => {
    // Navigate to meeting room form
    await page.getByTestId("tab-meeting-rooms").click();

    const form = page.getByTestId("contact-form").nth(2);
    await expect(form).toBeVisible();

    // Fill out the form
    await page.fill('[name="firstName"]', "Piotr");
    await page.fill('[name="lastName"]', "Kowalczyk");
    await page.fill('[name="email"]', "piotr@example.com");
    await page.fill('[name="phone"]', "+48 555 666 777");
    await page.fill('[name="companyName"]', "Meeting Company");
    await page.fill('[name="date"]', "2024-12-15");
    await page.fill('[name="startTime"]', "09:00");
    await page.fill('[name="endTime"]', "17:00");
    await page.fill('[name="attendees"]', "8");
    await page.locator('label:has-text("Typ sali") + div').click();
    await page
      .getByRole('option', { name: /Sala Konferencyjna/i })
      .click();
    const roomTypeInput = page.locator('input[name="roomType"]');
    if (await roomTypeInput.count()) {
      await expect(roomTypeInput).toHaveValue('conference');
    }
    await page.check('[name="equipment"][value="projector"]');
    await page.check('[name="catering"]');
    await page.check('[name="gdprConsent"]');
    await page.fill('[name="message"]', "Test message for meeting room");

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.getByText(/formularz został wysłany/i)).toBeVisible();
  });

  test("should handle form submission errors gracefully", async ({ page }) => {
    // Mock network error
    await page.route("**/api/**", (route) => route.abort());

    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form").first();
    await expect(form).toBeVisible();

    // Fill out minimal required fields
    await page.fill('[name="companyName"]', "Test Company");
    await page.fill('[name="firstName"]', "Jan");
    await page.fill('[name="lastName"]', "Kowalski");
    await page.fill('[name="email"]', "jan@example.com");
    await page.fill('[name="phone"]', "+48 123 456 789");
    await page.check('[name="gdprConsent"]');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for error message
    await expect(page.getByText(/błąd podczas wysyłania/i)).toBeVisible();
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

    const form = page.getByTestId("contact-form").first();
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

    const form = page.getByTestId("contact-form").first();
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
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigate to virtual office form
    await page.getByTestId("tab-virtual-office").click();

    const form = page.getByTestId("contact-form").first();
    await expect(form).toBeVisible();

    // Fill out form on mobile
    await page.fill('[name="companyName"]', "Mobile Test Company");
    await page.fill('[name="firstName"]', "Mobile");
    await page.fill('[name="lastName"]', "User");
    await page.fill('[name="email"]', "mobile@example.com");
    await page.fill('[name="phone"]', "+48 123 456 789");
    await page.check('[name="gdprConsent"]');

    // Submit the form
    await page.click('button[type="submit"]');

    // Check for success message
    await expect(page.getByText(/formularz został wysłany/i)).toBeVisible();
  });
});
