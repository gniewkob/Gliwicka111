import { defineConfig, devices } from '@playwright/test';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Use port 3001 for tests to avoid conflicts with development server
const portFile = path.resolve(process.cwd(), 'tmp', 'e2e-port');
const pickPort = () => {
  if (process.env.TEST_PORT) return Number(process.env.TEST_PORT);
  try {
    if (fs.existsSync(portFile)) {
      const v = Number(fs.readFileSync(portFile, 'utf8').trim());
      if (!Number.isNaN(v) && v > 0) {
        process.env.TEST_PORT = String(v);
        return v;
      }
    }
    const out = execSync('node scripts/free-port.js', { stdio: ['ignore', 'pipe', 'ignore'] });
    const p = Number(String(out).trim());
    if (!Number.isNaN(p) && p > 0) {
      fs.mkdirSync(path.dirname(portFile), { recursive: true });
      fs.writeFileSync(portFile, String(p), 'utf8');
      process.env.TEST_PORT = String(p);
      return p;
    }
  } catch {}
  process.env.TEST_PORT = '3001';
  return 3001;
}
const TEST_PORT = pickPort();
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`;

console.log(`Using port ${TEST_PORT} for tests`);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: process.env.CI ? 2 : '50%',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['junit', { outputFile: 'junit.xml' }], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: process.env.CI ? 'retain-on-failure' : 'off',
    video: 'off',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `PORT=${TEST_PORT} npm run start`,
    url: BASE_URL,
    timeout: 60000,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: TEST_PORT.toString(),
      MOCK_DB: 'true',
      NEXT_PUBLIC_E2E: 'true',
      // Provide admin auth config so middleware doesn't crash during tests
      ADMIN_AUTH_TOKEN: process.env.ADMIN_AUTH_TOKEN || 'test-admin-token',
      // Provide a test salt for any hashing that may run during requests
      IP_SALT: process.env.IP_SALT || 'test-ip-salt',
    },
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium',  use: { ...devices['iPhone 12'] } },
  ],
});
