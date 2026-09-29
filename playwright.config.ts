import { defineConfig, devices } from '@playwright/test';

// Browser tests run against real builds: dist/ (production) mounted at the
// domain root and under a repository sub-path, and dist-e2e/ (the same game
// plus a read-only state probe) for gameplay flows.
const chromiumArgs = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'];

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    viewport: { width: 1280, height: 720 },
    launchOptions: { args: chromiumArgs },
    trace: 'off',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 }, launchOptions: { args: chromiumArgs } } },
  ],
  // DEV_ROUTE runs only need the e2e build.
  webServer: process.env.DEV_ROUTE ? [{ command: 'node scripts/serve.mjs dist-e2e 4175 /', port: 4175, reuseExistingServer: true }] : [
    { command: 'node scripts/serve.mjs dist 4173 /', port: 4173, reuseExistingServer: true },
    { command: 'node scripts/serve.mjs dist 4174 /kristaller-dunyasi/', url: 'http://localhost:4174/kristaller-dunyasi/', reuseExistingServer: true },
    { command: 'node scripts/serve.mjs dist-e2e 4175 /', port: 4175, reuseExistingServer: true },
  ],
});
