import { type Locator, type Page } from '@playwright/test';

/** "Tabela poštevanke": 10 × 10 grid; tapping a cell explains the product. */
export class TimesTablePage {
  readonly page: Page;
  readonly banner: Locator;
  readonly cells: Locator;

  constructor(page: Page) {
    this.page = page;
    this.banner = page.locator('.banner');
    this.cells = page.locator('.mtab button.mc');
  }

  cell(row: number, col: number): Locator {
    return this.page.getByRole('button', { name: `${row} krat ${col}`, exact: true });
  }
}
