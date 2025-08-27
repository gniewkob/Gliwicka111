import { test, expect } from '@playwright/test';
import { goto, dismissCookieBanner } from './helpers';

test('Virtual office form submits (UI)', async ({ page }) => {
  await goto(page, '/forms');
  await dismissCookieBanner(page);
  // Click on the virtual office tab first
  await page.getByTestId('tab-virtual-office').click();
  await page.waitForTimeout(1000); // Wait for tab to load
  // Fill form fields
  await page.fill('#firstName', 'Jan');
  await page.fill('#lastName', 'Kowalski');
  await page.fill('#email', 'jan@example.com');
  await page.fill('#phone', '+48123123123');
  await page.fill('#companyName', 'Test Company');
  // Select business type using the data-testid
  await page.getByTestId('businessType-select').click();
  await page.getByText('Działalność gospodarcza').click();
  // Select package using the data-testid
  await page.getByTestId('package-select').click();
  await page.getByText('Pakiet Podstawowy (99 zł/miesiąc)').click();
  // Set start date
  await page.fill('#startDate', '2024-12-01');
  // Check GDPR consent
  await page.check('[data-testid="gdpr-checkbox"]');
  // Submit form
  await page.click('button[type="submit"]');
  // Wait for success message in the alert
  await expect(page.getByTestId('form-success-alert')).toBeVisible({ timeout: 10000 });
});

test('Virtual office email validation', async ({ page }) => {
  await goto(page, '/forms');
  await dismissCookieBanner(page);
  // Click on the virtual office tab
  await page.getByTestId('tab-virtual-office').click();
  await page.waitForTimeout(1000); // Wait for tab to load
  // Fill form with invalid email
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', 'bad-email');
  await page.fill('#phone', '+48123123123');
  await page.fill('#companyName', 'Test Company');
  // Select required fields
  await page.getByTestId('businessType-select').click();
  await page.getByText('Działalność gospodarcza').click();
  await page.getByTestId('package-select').click();
  await page.getByText('Pakiet Podstawowy (99 zł/miesiąc)').click();
  await page.fill('#startDate', '2024-12-01');
  // Check GDPR consent
  await page.check('[data-testid="gdpr-checkbox"]');
  // Try to submit to trigger validation
  await page.click('button[type="submit"]');
  // Check for email error message
  const emailErr = page.getByTestId('virtual-office-email-error');
  await expect(emailErr).toBeVisible();
  await expect(emailErr).toContainText(/Nieprawidłowy|Invalid|email/i);
});
