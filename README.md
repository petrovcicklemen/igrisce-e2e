# igrisce-e2e

Playwright + TypeScript end-to-end tests for [Matematično igrišče](https://github.com/petrovcicklemen/igrisce), built with the **Page Object Model** and run on **GitHub Actions**.

## Structure

```
pages/                  Page objects: one class per screen
  HomePage.ts           start screen: greeting, name, pearls, module cards
  LevelPickerPage.ts    difficulty picker (Lažje / Težje / Mešano)
  GamePage.ts           number-pad round: reads the problem, types answers
  ResultPage.ts         end-of-round screen
  TimesTablePage.ts     10 × 10 times table
  fixtures.ts           injects the page objects into tests as fixtures
tests/                  Specs: they only talk to page objects, never to raw selectors
.github/workflows/      CI pipeline (e2e.yml)
playwright.config.ts    projects (desktop + tablet), retries, reporters, web server
```

## Run locally

```bash
npm ci
npx playwright install chromium
git clone https://github.com/petrovcicklemen/igrisce app   # the app under test
npx playwright test               # headless
npx playwright test --headed      # watch the browser
npx playwright test --ui          # UI mode
npx playwright show-report
```

Test the live site instead of a local copy:

```bash
BASE_URL=https://petrovcicklemen.github.io/igrisce/ npx playwright test
```

(PowerShell: `$env:BASE_URL="https://petrovcicklemen.github.io/igrisce/"; npx playwright test`)

## CI

The workflow runs on every push and pull request, every Saturday at 05:00 (Ljubljana time), and on demand (**Actions → E2E tests → Run workflow**).
Each run checks out this repo and the app repo, serves the app with `http-server`, and runs the
`desktop-chrome` and `tablet` projects in parallel. HTML reports and JUnit XML are attached to every run as artifacts.
