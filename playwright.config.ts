import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Two ways to run:
 *  - Default: serve a local copy of the app (folder ./app, or APP_DIR) with http-server.
 *    This is what CI does: it checks out petrovcicklemen/igrisce into ./app first.
 *  - BASE_URL=https://petrovcicklemen.github.io/igrisce/  -> test the live GitHub Pages site,
 *    no local server is started.
 */
const PORT = 4173;
const liveUrl = process.env.BASE_URL;
const appDir = process.env.APP_DIR ?? './app';
const isCI = !!process.env.CI;

// Fail fast with a clear message instead of a 30 s webServer timeout (the server would only return 404s).
if (!liveUrl && !existsSync(join(appDir, 'index.html'))) {
  throw new Error(
    `App not found in "${appDir}". Clone it first:\n` +
    `  git clone https://github.com/petrovcicklemen/igrisce app\n` +
    `or set APP_DIR to the app folder, or BASE_URL to test the live site.`,
  );
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,              // fail CI if someone left test.only in the code
  retries: isCI ? 2 : 0,         // retry flaky tests on CI only
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'results/junit.xml' }], ['github']]
    : [['list'], ['html', { open: 'on-failure' }]],

  use: {
    baseURL: liveUrl ?? `http://localhost:${PORT}/`,
    trace: 'on-first-retry',     // full trace (DOM, network, console) when a test is retried
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    serviceWorkers: 'block',     // the app caches itself offline; tests should always load fresh files
    locale: 'sl-SI',
    // SLOWMO=500 waits 500 ms between actions, so you can follow a headed run with your eyes
    launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) },
  },

  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    // The app is used on a Samsung tablet, so also run on a tablet-sized touch viewport.
    { name: 'tablet', use: { ...devices['Galaxy Tab S4'], browserName: 'chromium' } },
  ],

  webServer: liveUrl
    ? undefined
    : {
        command: `npx http-server "${appDir}" -p ${PORT} -c-1 --silent`,
        url: `http://localhost:${PORT}/`,
        reuseExistingServer: !isCI,
        timeout: 30_000,
      },
});
