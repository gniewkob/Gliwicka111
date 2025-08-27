import { test, expect } from '@playwright/test';

test('opens a blank page', async ({ page }) => {
  await page.goto('about:blank');
  await expect(page).toHaveTitle('');
});
