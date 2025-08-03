import { test, expect } from "@playwright/test"

test.describe("Contact Forms", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/forms")
  })

  test("should display all form types", async ({ page }) => {
    await expect(page.getByText("Biuro Wirtualne")).toBeVisible()
    await expect(page.getByText("Coworking")).toBeVisible()
    await expect(page.getByText("Sala Konferencyjna")).toBeVisible()
    await expect(page.getByText("Reklama")).toBeVisible()
    await expect(page.getByText("Oferty Specjalne")).toBeVisible()
  })

  test("should submit virtual office form successfully", async ({ page }) => {
    // Navigate to virtual office form
    await page.click("text=Biuro Wirtualne")

    // Fill out the form
    await page.fill('[name="companyName"]', "Test Company")
    await page.fill('[name="contactPerson"]', "Jan Kowalski")
    await page.fill('[name="email"]', "jan@example.com")
    await page.fill('[name="phone"]', "+48 123 456 789")
    await page.fill('[name="nip"]', "1234567890")
    await page.selectOption('[name="businessType"]', "consulting")
    await page.fill('[name="preferredDate"]', "2024-12-01")
    await page.fill('[name="message"]', "Test message for virtual office")

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for success message
    await expect(page.getByText(/formularz został wysłany/i)).toBeVisible()
  })

  test("should validate required fields", async ({ page }) => {
    // Navigate to virtual office form
    await page.click("text=Biuro Wirtualne")

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Check for validation errors
    await expect(page.getByText(/nazwa firmy jest wymagana/i)).toBeVisible()
    await expect(page.getByText(/imię i nazwisko jest wymagane/i)).toBeVisible()
    await expect(page.getByText(/email jest wymagany/i)).toBeVisible()
    await expect(page.getByText(/telefon jest wymagany/i)).toBeVisible()
  })

  test("should validate email format", async ({ page }) => {
    // Navigate to virtual office form
    await page.click("text=Biuro Wirtualne")

    // Fill with invalid email
    await page.fill('[name="email"]', "invalid-email")
    await page.click('button[type="submit"]')

    // Check for email validation error
    await expect(page.getByText(/nieprawidłowy format email/i)).toBeVisible()
  })

  test("should submit coworking form successfully", async ({ page }) => {
    // Navigate to coworking form
    await page.click("text=Coworking")

    // Fill out the form
    await page.fill('[name="contactPerson"]', "Anna Nowak")
    await page.fill('[name="email"]', "anna@example.com")
    await page.fill('[name="phone"]', "+48 987 654 321")
    await page.fill('[name="companyName"]', "Coworking Company")
    await page.selectOption('[name="workspaceType"]', "hot-desk")
    await page.selectOption('[name="duration"]', "monthly")
    await page.fill('[name="startDate"]', "2024-12-01")
    await page.fill('[name="teamSize"]', "3")
    await page.fill('[name="message"]', "Test message for coworking")

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for success message
    await expect(page.getByText(/formularz został wysłany/i)).toBeVisible()
  })

  test("should submit meeting room form successfully", async ({ page }) => {
    // Navigate to meeting room form
    await page.click("text=Sala Konferencyjna")

    // Fill out the form
    await page.fill('[name="contactPerson"]', "Piotr Kowalczyk")
    await page.fill('[name="email"]', "piotr@example.com")
    await page.fill('[name="phone"]', "+48 555 666 777")
    await page.fill('[name="companyName"]', "Meeting Company")
    await page.fill('[name="meetingDate"]', "2024-12-15")
    await page.fill('[name="startTime"]', "09:00")
    await page.fill('[name="endTime"]', "17:00")
    await page.fill('[name="attendees"]', "8")
    await page.selectOption('[name="roomType"]', "conference")
    await page.check('[name="equipment"][value="projector"]')
    await page.check('[name="catering"]')
    await page.fill('[name="message"]', "Test message for meeting room")

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for success message
    await expect(page.getByText(/formularz został wysłany/i)).toBeVisible()
  })

  test("should handle form submission errors gracefully", async ({ page }) => {
    // Mock network error
    await page.route("**/api/**", (route) => route.abort())

    // Navigate to virtual office form
    await page.click("text=Biuro Wirtualne")

    // Fill out minimal required fields
    await page.fill('[name="companyName"]', "Test Company")
    await page.fill('[name="contactPerson"]', "Jan Kowalski")
    await page.fill('[name="email"]', "jan@example.com")
    await page.fill('[name="phone"]', "+48 123 456 789")

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for error message
    await expect(page.getByText(/błąd podczas wysyłania/i)).toBeVisible()
  })

  test("should track analytics events", async ({ page }) => {
    // Listen for analytics requests
    const analyticsRequests = []
    page.on("request", (request) => {
      if (request.url().includes("/api/analytics/track")) {
        analyticsRequests.push(request)
      }
    })

    // Navigate to virtual office form
    await page.click("text=Biuro Wirtualne")

    // Interact with form fields
    await page.fill('[name="companyName"]', "Test Company")
    await page.fill('[name="contactPerson"]', "Jan Kowalski")

    // Wait a bit for analytics events to be sent
    await page.waitForTimeout(1000)

    // Check that analytics events were tracked
    expect(analyticsRequests.length).toBeGreaterThan(0)
  })

  test("should be accessible", async ({ page }) => {
    // Check for proper heading structure
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    // Navigate to virtual office form
    await page.click("text=Biuro Wirtualne")

    // Check form accessibility
    await expect(page.getByRole("form")).toBeVisible()

    // Check that all form fields have labels
    const inputs = await page.locator("input, select, textarea").all()
    for (const input of inputs) {
      const id = await input.getAttribute("id")
      if (id) {
        await expect(page.locator(`label[for="${id}"]`)).toBeVisible()
      }
    }

    // Check submit button
    await expect(page.getByRole("button", { name: /wyślij/i })).toBeVisible()
  })

  test("should work on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Navigate to virtual office form
    await page.click("text=Biuro Wirtualne")

    // Check that form is responsive
    await expect(page.locator("form")).toBeVisible()

    // Fill out form on mobile
    await page.fill('[name="companyName"]', "Mobile Test Company")
    await page.fill('[name="contactPerson"]', "Mobile User")
    await page.fill('[name="email"]', "mobile@example.com")
    await page.fill('[name="phone"]', "+48 123 456 789")

    // Submit the form
    await page.click('button[type="submit"]')

    // Check for success message
    await expect(page.getByText(/formularz został wysłany/i)).toBeVisible()
  })
})
