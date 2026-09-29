import { defineConfig, devices } from '@playwright/test';

// Browser tests run against real builds: dist/ (production) mounted at the
// domain root and under a repository sub-path, and dist-e2e/ (the same game
// plus a read-only state probe) for gameplay flows.
//
// Two projects: the boot checks and reference screenshots need WebGL, which
// headless Chromium only offers through SwiftShader (software GL). Gameplay
// flows use `?canvas=1`, and SwiftShader's software compositing would slow
// their frames down for nothing, so they run with Chromium's defaults.
const autoplay = '--autoplay-policy=no-user-gesture-required';
const webglArgs = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', autoplay];
const WEBGL_SPECS = /(boot|screenshots)\.spec\.ts/;
const viewport = { width: 1280, height: 720 };

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    viewport,
    trace: 'off',
  },
  projects: [
    { name: 'webgl', testMatch: WEBGL_SPECS, use: { ...devices['Desktop Chrome'], viewport, launchOptions: { args: webglArgs } } },
    { name: 'desktop', testIgnore: WEBGL_SPECS, use: { ...devices['Desktop Chrome'], viewport, launchOptions: { args: [autoplay] } } },
  ],
  // DEV_ROUTE runs only need the e2e build.
  webServer: process.env.DEV_ROUTE ? [{ command: 'node scripts/serve.mjs dist-e2e 4175 /', port: 4175, reuseExistingServer: true }] : [
    { command: 'node scripts/serve.mjs dist 4173 /', port: 4173, reuseExistingServer: true },
    { command: 'node scripts/serve.mjs dist 4174 /kristaller-dunyasi/', url: 'http://localhost:4174/kristaller-dunyasi/', reuseExistingServer: true },
    { command: 'node scripts/serve.mjs dist-e2e 4175 /', port: 4175, reuseExistingServer: true },
  ],
});
