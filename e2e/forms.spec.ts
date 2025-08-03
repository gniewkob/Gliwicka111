import { test, expect } from "@playwright/test"

test.describe("Form Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should navigate to forms page", async ({ page }) => {
    await page.click("text=Formularze")
    await expect(page).toHaveURL("/forms")
    await expect(page.locator("h1")).toContainText("Formularze kontaktowe")
  })

  test("should submit virtual office form successfully", async ({ page }) => {
    await page.goto("/forms")

    // Click on Virtual Office form tab
    await page.click("text=Biuro Wirtualne")

    // Fill out the form
    await page.fill('[name="firstName"]', "Jan")
    await page.fill('[name="lastName"]', "Kowalski")
    await page.fill('[name="email"]', "jan@example.com")
    await page.fill('[name="phone"]', "+48123456789")
    await page.fill('[name="companyName"]', "Test Company")

    // Select business type
    await page.selectOption('[name="businessType"]', "llc")

    // Select package
    await page.selectOption('[name="package"]', "standard")

    // Set start date
    await page.fill('[name="startDate"]', "2024-02-01")

    // Check GDPR consent
    await page.check('[name="gdprConsent"]')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success message
    await expect(page.locator("text=pomyślnie")).toBeVisible({ timeout: 10000 })
  })

  test("should show validation errors for empty required fields", async ({ page }) => {
    await page.goto("/forms")

    // Click on Virtual Office form tab
    await page.click("text=Biuro Wirtualne")

    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Check for validation errors
    await expect(page.locator("text=wymagane")).toBeVisible()
  })

  test("should validate email format", async ({ page }) => {
    await page.goto("/forms")

    // Click on Virtual Office form tab
    await page.click("text=Biuro Wirtualne")

    // Fill invalid email
    await page.fill('[name="email"]', "invalid-email")
    await page.click('button[type="submit"]')

    // Check for email validation error
    await expect(page.locator("text=nieprawidłowy format")).toBeVisible()
  })

  test("should switch between form types", async ({ page }) => {
    await page.goto("/forms")

    // Test switching between different form types
    const formTypes = ["Biuro Wirtualne", "Coworking", "Sala Konferencyjna", "Reklama", "Oferty Specjalne"]

    for (const formType of formTypes) {
      await page.click(`text=${formType}`)
      await expect(page.locator("form")).toBeVisible()
    }
  })

  test("should handle form submission errors gracefully", async ({ page }) => {
    // Mock API to return error
    await page.route("/api/forms/**", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Server error" }),
      })
    })

    await page.goto("/forms")
    await page.click("text=Biuro Wirtualne")

    // Fill and submit form
    await page.fill('[name="firstName"]', "Jan")
    await page.fill('[name="lastName"]', "Kowalski")
    await page.fill('[name="email"]', "jan@example.com")
    await page.fill('[name="phone"]', "+48123456789")
    await page.check('[name="gdprConsent"]')

    await page.click('button[type="submit"]')

    // Check for error message
    await expect(page.locator("text=błąd")).toBeVisible()
  })

  test("should be accessible", async ({ page }) => {
    await page.goto("/forms")

    // Check for proper heading structure
    const h1 = page.locator("h1")
    await expect(h1).toBeVisible()

    // Check for form labels
    await page.click("text=Biuro Wirtualne")
    const labels = page.locator("label")
    const labelCount = await labels.count()
    expect(labelCount).toBeGreaterThan(0)

    // Check for required field indicators
    const requiredFields = page.locator("text=*")
    const requiredCount = await requiredFields.count()
    expect(requiredCount).toBeGreaterThan(0)

    // Check form can be navigated with keyboard
    await page.keyboard.press("Tab")
    const focusedElement = page.locator(":focus")
    await expect(focusedElement).toBeVisible()
  })

  test("should work on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto("/forms")

    // Check mobile navigation
    const mobileMenu = page.locator('[aria-label="Menu"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
    }

    // Test form interaction on mobile
    await page.click("text=Biuro Wirtualne")
    await page.fill('[name="firstName"]', "Jan")

    // Check form is still usable
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test("should track analytics events", async ({ page }) => {
    // Mock analytics tracking
    const analyticsEvents: string[] = []

    await page.addInitScript(() => {
      ;(window as any).analyticsEvents = []
      const originalTrack = (window as any).analyticsClient?.trackFormView
      if (originalTrack) {
        ;(window as any).analyticsClient.trackFormView = (...args: any[]) => {
          ;(window as any).analyticsEvents.push("trackFormView")
          return originalTrack.apply(this, args)
        }
      }
    })

    await page.goto("/forms")
    await page.click("text=Biuro Wirtualne")

    // Check if analytics events were tracked
    const events = await page.evaluate(() => (window as any).analyticsEvents)
    expect(events).toContain("trackFormView")
  })
})

test.describe("Form Performance", () => {
  test("should load forms quickly", async ({ page }) => {
    const startTime = Date.now()

    await page.goto("/forms")
    await page.waitForLoadState("networkidle")

    const loadTime = Date.now() - startTime
    expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
  })

  test("should handle rapid form switching", async ({ page }) => {
    await page.goto("/forms")

    const formTypes = ["Biuro Wirtualne", "Coworking", "Sala Konferencyjna", "Reklama", "Oferty Specjalne"]

    // Rapidly switch between forms
    for (let i = 0; i < 3; i++) {
      for (const formType of formTypes) {
        await page.click(`text=${formType}`)
        await page.waitForTimeout(100) // Small delay to simulate user interaction
      }
    }

    // Form should still be functional
    await page.fill('[name="firstName"]', "Test")
    const firstNameField = page.locator('[name="firstName"]')
    await expect(firstNameField).toHaveValue("Test")
  })
})
