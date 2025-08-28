import { Page, Locator, expect } from '@playwright/test';

export async function primeConsent(page: Page) {
  // Seed consent before any navigations to prevent the banner from mounting
  await page.addInitScript(({ consent }) => {
    try {
      const payload = { ...consent, timestamp: Date.now() };
      window.localStorage.setItem('analytics-consent', JSON.stringify(payload));
      document.cookie = 'cookie_consent=1;path=/;SameSite=Lax';
    } catch {}
  }, { consent: { necessary: true, analytics: true, marketing: false } });
}

export async function goto(page: Page, path = '/') {
  // Ensure an `e2e=1` param to enable client-side E2E toggles even without build-time env
  let url = path;
  if (!/\be2e=1\b/.test(path)) {
    if (path.includes('?')) url = path + '&e2e=1';
    else url = path + '?e2e=1';
  }
  await page.goto(url, { waitUntil: 'domcontentloaded' });
}

export async function dismissCookieBanner(page: Page) {
  // Try to close if banner slipped through (e.g., first page before init script)
  const acceptAll = page.getByRole('button', { name: /akceptuj.*|accept.*all/i });
  if (await acceptAll.isVisible().catch(() => false)) {
    await acceptAll.click();
    return;
  }
  const necessaryOnly = page.getByRole('button', { name: /tylko.*niezbędne|necessary\s+only/i });
  if (await necessaryOnly.isVisible().catch(() => false)) {
    await necessaryOnly.click();
    return;
  }
  const close = page.getByRole('button', { name: /x/i });
  if (await close.isVisible().catch(() => false)) {
    await close.click();
  }
}

// Closes any GDPR/RODO/cookie dialog overlay if visible
export async function closeGdprModalIfPresent(page: Page) {
  const dialog = page.getByRole('dialog');
  if (await dialog.isVisible().catch(() => false)) {
    // Try common action buttons
    const accept = dialog.getByRole('button', { name: /akceptuj|accept|allow|ok|zamknij|close/i });
    if (await accept.isVisible().catch(() => false)) {
      await accept.click();
    } else {
      // Fallback to Escape
      await page.keyboard.press('Escape');
    }
    await expect(dialog).toBeHidden({ timeout: 5000 });
  }
}

export async function ensureSubmitVisible(form: Locator) {
  const btn = form.locator('button[type="submit"]');
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
}
