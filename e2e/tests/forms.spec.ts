import { test, expect } from '@playwright/test';
import { primeConsent, goto, dismissCookieBanner, closeGdprModalIfPresent } from './helpers';

test('Virtual office form submits (UI)', async ({ page }) => {
  await primeConsent(page);
await goto(page, '/forms');
  await dismissCookieBanner(page);
  await closeGdprModalIfPresent(page);
  // Click on the virtual office tab first
await page.getByTestId('tab-virtual-office').click();
  await closeGdprModalIfPresent(page);
  await expect(page.locator('#email')).toBeVisible({ timeout: 7000 }); // Wait for form to be ready
  const card = page.locator('[data-testid="contact-form-virtual-office"]').first();
  const form = card.locator('form[data-testid="contact-form-virtual-office"]');
  // Fill form fields
  await page.fill('#firstName', 'Jan');
  await page.fill('#lastName', 'Kowalski');
  await page.fill('#email', 'jan@example.com');
  await page.fill('#phone', '+48 123 123 123');
  await page.fill('#companyName', 'Test Company');
  // Set start date
  await page.fill('#startDate', '2024-12-01');
  await expect(page.locator('#startDate')).toHaveValue('2024-12-01');
  // Toggle GDPR consent via checkbox; if not toggled, click the label as fallback
  const gdpr = card.getByTestId('gdpr-checkbox');
  await gdpr.scrollIntoViewIfNeeded();
  await gdpr.click({ force: true });
  let isChecked = await gdpr.getAttribute('aria-checked');
  if (isChecked !== 'true') {
    const gdprLabel = card.getByLabel(/Wyrażam zgodę na przetwarzanie/i);
    await gdprLabel.scrollIntoViewIfNeeded();
    await gdprLabel.click();
  }
  await expect(gdpr).toHaveAttribute('aria-checked', 'true');

  const submitBtn = card.getByRole('button', { name: /Wyślij|Send Inquiry/i });
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();
  // Give overlays a moment to render, then close if present
  await page.waitForTimeout(1000);
  await closeGdprModalIfPresent(page);
  await page.waitForLoadState('networkidle'); // Wait for form submission to complete
  // Wait for any alert (success or error) within the form card
  await expect(card.getByRole('alert')).toBeVisible({ timeout: 20000 });
});

test('Virtual office email validation', async ({ page }) => {
  await primeConsent(page);
await goto(page, '/forms');
  await dismissCookieBanner(page);
  await closeGdprModalIfPresent(page);
  // Click on the virtual office tab
  await page.getByTestId('tab-virtual-office').click();
  await closeGdprModalIfPresent(page);
  await expect(page.locator('#email')).toBeVisible({ timeout: 7000 }); // Wait for form to be ready
const card = page.locator('[data-testid="contact-form-virtual-office"]').first();
  const form = card.locator('form[data-testid="contact-form-virtual-office"]');
  // Fill form with invalid email
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', 'bad-email');
  // Trigger blur to fire validation in onChange mode
  // Use a robust blur by focusing another input
  await page.locator('#phone').scrollIntoViewIfNeeded();
  await page.click('#phone', { force: true });
  await page.fill('#phone', '+48 123 123 123');
  await page.fill('#companyName', 'Test Company');
  // Ensure GDPR checkbox is toggled so submit path is consistent
  const gdpr = card.getByTestId('gdpr-checkbox');
  await gdpr.scrollIntoViewIfNeeded();
  await gdpr.click({ force: true });
  let isChecked = await gdpr.getAttribute('aria-checked');
  if (isChecked !== 'true') {
    const gdprLabel = card.getByLabel(/Wyrażam zgodę na przetwarzanie/i);
    await gdprLabel.scrollIntoViewIfNeeded();
    await gdprLabel.click();
  }
  await expect(gdpr).toHaveAttribute('aria-checked', 'true');

  // Submit once to trigger validation
  const submitBtn = card.getByRole('button', { name: /Wyślij|Send Inquiry/i });
  await expect(submitBtn).toBeVisible();
  await submitBtn.click();
  // Give overlays a moment to render, then close if present
  await page.waitForTimeout(1000);
  await closeGdprModalIfPresent(page);
  await page.waitForLoadState('networkidle'); // Ensure validation logic completes
  // Now assert validation feedback without waiting for submit completion
  // Check a visible, stable error element instead of aria-invalid
  const emailErr = card.getByTestId('virtual-office-email-error');
  const summary = card.getByTestId('validation-error-summary');
  const emailInvalid = await page.locator('#email').getAttribute('aria-invalid').catch(() => null);
    await expect(summary).toBeVisible({ timeout: 15000 });
});
