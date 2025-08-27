import { test, expect } from '@playwright/test';
import { goto, dismissCookieBanner } from './helpers';

test('Home renders', async ({ page }) => {
  await goto(page, '/');
  await dismissCookieBanner(page);
  // Look for the main heading with specific text to avoid strict mode violation
  await expect(page.getByRole('heading', { name: 'Profesjonalne zarządzanie nieruchomościami' })).toBeVisible();
});

test('Admin shell behind auth', async ({ page }) => {
  await goto(page, '/admin/dashboard');
  await dismissCookieBanner(page);
  // Admin dashboard doesn't have login form, it uses HTTP Basic Auth via headers
  // The page should load directly if auth is configured in env
  // Look for admin metrics heading or table
  await expect(page.getByRole('heading', { name: 'Admin Metrics' })).toBeVisible();
});
