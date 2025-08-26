import { Page, Locator, expect } from '@playwright/test';

export async function goto(page: Page, path = '/') {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
}

export async function dismissCookieBanner(page: Page) {
  const btn = page.getByRole('button', { name: /akceptuj|accept/i });
  if (await btn.isVisible().catch(() => false)) await btn.click();
}

export async function ensureSubmitVisible(form: Locator) {
  const btn = form.locator('button[type="submit"]');
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
}

