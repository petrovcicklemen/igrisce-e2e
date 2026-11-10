import { test as base } from '@playwright/test';
import { HomePage } from './HomePage';
import { LevelPickerPage } from './LevelPickerPage';
import { GamePage } from './GamePage';
import { ResultPage } from './ResultPage';
import { TimesTablePage } from './TimesTablePage';

type Pages = {
  home: HomePage;
  levels: LevelPickerPage;
  game: GamePage;
  result: ResultPage;
  timesTable: TimesTablePage;
};

/** Tests import `test` from here and get ready-made page objects as fixtures. */
export const test = base.extend<Pages>({
  home: async ({ page }, use) => { await use(new HomePage(page)); },
  levels: async ({ page }, use) => { await use(new LevelPickerPage(page)); },
  game: async ({ page }, use) => { await use(new GamePage(page)); },
  result: async ({ page }, use) => { await use(new ResultPage(page)); },
  timesTable: async ({ page }, use) => { await use(new TimesTablePage(page)); },
});

export { expect } from '@playwright/test';
