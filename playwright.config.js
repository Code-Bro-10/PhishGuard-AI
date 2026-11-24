import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm --prefix server start',
      port: 5000,
      reuseExistingServer: true,
      timeout: 120000,
    },
    {
      command: 'npm --prefix client run dev',
      port: 5173,
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
});
