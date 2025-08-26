import { Page, Locator, expect } from '@playwright/test';

export async function goto(page: Page, path = '/') {
  const base = process.env.BASE_URL || 'http://localhost:3000';
  const url = new URL(path, base).toString();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
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

