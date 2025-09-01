// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/integration',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['line', { printSteps: true }],
  ],
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    browserName: 'chromium',
    headless: false,
  },
  projects: [
    {
      name: 'frontend',
      testMatch: /.*\.test\.js/,
      exclude: /api\/.*/,
      use: {
        baseURL: 'http://localhost:5174',
      },
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:8000',
      },
    },
  ],
  webServer: [
    {
      name: 'frontend',
      command: 'yarn dev',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      name: 'api',
      command: 'cd ../services/api && uv run uvicorn src.main:app --host 0.0.0.0 --port 8000',
      url: 'http://localhost:8000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});
