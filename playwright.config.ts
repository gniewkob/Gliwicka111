import { defineConfig, devices } from "@playwright/test";

const projects = [
  {
    name: "chromium",
    use: { ...devices["Desktop Chrome"] },
  },
  {
    name: "firefox",
    use: { ...devices["Desktop Firefox"] },
  },
  {
    name: "webkit",
    use: { ...devices["Desktop Safari"] },
  },
  {
    name: "Mobile Chrome",
    use: { ...devices["Pixel 5"] },
  },
  {
    name: "Mobile Safari",
    use: { ...devices["iPhone 12"] },
  },
];

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/results.xml" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: process.env.CI
    ? projects.filter(({ name }) => name === "chromium")
    : projects,
  webServer: {
    command: "npm run start",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      DB_HOST: "localhost",
      DB_PORT: "5432",
      DB_NAME: "test_db",
      DB_USER: "test_user",
      DB_PASSWORD: "test_password",
      MOCK_DB: "true",
      MOCK_EMAIL: "true",
      ADMIN_USER: "admin",
      ADMIN_PASS: "password",
      NEXT_PUBLIC_ADMIN_USER: "admin",
      NEXT_PUBLIC_ADMIN_PASS: "password",
    },
  },
});
