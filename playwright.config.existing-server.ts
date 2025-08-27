import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  retries: 0,
  workers: process.env.CI ? 2 : '50%',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['junit', { outputFile: 'junit.xml' }], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    trace: process.env.CI ? 'retain-on-failure' : 'off',
    video: 'off',
    screenshot: 'only-on-failure',
  },
  // No webServer config - we'll use an already running server
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium',  use: { ...devices['iPhone 12'] } },
  ],
});
