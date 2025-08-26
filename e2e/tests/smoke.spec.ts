import { test, expect } from '@playwright/test';
import { goto, dismissCookieBanner } from './helpers';

test('Home renders', async ({ page }) => {
  await goto(page, '/');
  await dismissCookieBanner(page);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('Admin shell behind auth', async ({ page }) => {
  await goto(page, '/admin');
  await dismissCookieBanner(page);
  const user = process.env.NEXT_PUBLIC_ADMIN_USER ?? 'admin';
  const pass = process.env.NEXT_PUBLIC_ADMIN_PASS ?? 'admin';
  const userInput = page.locator('[name="username"]');
  const passInput = page.locator('[name="password"]');
  if (await userInput.isVisible().catch(() => false)) {
    await userInput.fill(user);
    await passInput.fill(pass);
    await page.click('button[type="submit"]');
  }
  await expect(page.getByTestId(/admin|dashboard|shell/i)).toBeVisible();
});
