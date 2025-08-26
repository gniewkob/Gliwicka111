import { test, expect } from '@playwright/test';
import { goto, dismissCookieBanner, ensureSubmitVisible } from './helpers';

test('Virtual office form submits (UI)', async ({ page }) => {
  await goto(page, '/forms');
  await dismissCookieBanner(page);
  const form = page.getByTestId('contact-form-virtual-office');
  await expect(form).toBeVisible();
  await form.locator('[name="name"]').fill('Jan Kowalski');
  await form.locator('[name="email"]').fill('jan@example.com');
  await form.locator('[name="phone"]').fill('+48123123123');
  // fill/select other required fields if present (businessType/package/date/GDPR)
  await ensureSubmitVisible(form);
  await form.locator('button[type="submit"]').click();
  await expect(form.getByTestId('form-success-alert')).toBeVisible();
});

test('Virtual office email validation', async ({ page }) => {
  await goto(page, '/forms');
  await dismissCookieBanner(page);
  const form = page.getByTestId('contact-form-virtual-office');
  await form.locator('[name="name"]').fill('A B');
  await form.locator('[name="email"]').fill('bad-email');
  await form.locator('[name="phone"]').fill('+48123123123');
  // fill other required fields so submit triggers validation
  await ensureSubmitVisible(form);
  await form.locator('button[type="submit"]').click();
  const emailErr = form.getByTestId('virtual-office-email-error');
  await expect(emailErr).toBeVisible();
  await expect(emailErr).toHaveText('Nieprawidłowy format adresu email');
});
