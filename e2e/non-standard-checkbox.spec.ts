import { test, expect } from "@playwright/test";

// This test ensures that our custom checkbox component can be checked or
// unchecked whether it renders a native input or a purely ARIA element.
test("should handle non-standard checkbox", async ({ page }) => {
  await page.goto("/forms");

  // Dismiss potential banners or consent dialogs
  const consent = page.getByRole("button", { name: /accept/i });
  if (await consent.isVisible()) {
    await consent.click();
  }
  const closeButton = page.locator("button:has(svg.lucide-x)");
  if (await closeButton.isVisible()) {
    await closeButton.click();
    await expect(closeButton).not.toBeVisible();
  }

  // Navigate to a form that contains the custom checkbox
  await page.getByTestId("tab-virtual-office").click();
  const form = page.getByTestId("contact-form-virtual-office");

  const checkbox = form.getByTestId("gdpr-checkbox");
  const input = checkbox.locator("input#gdprConsent");

  if (await input.count()) {
    // Checkbox renders an underlying input element
    await input.setChecked(true);
    await expect(input).toBeChecked();
    await input.setChecked(false);
    await expect(input).not.toBeChecked();
  } else {
    // Checkbox is a pure ARIA widget
    await checkbox.click();
    await expect(checkbox).toHaveAttribute("aria-checked", "true");
    await checkbox.click();
    await expect(checkbox).toHaveAttribute("aria-checked", "false");
  }
});
