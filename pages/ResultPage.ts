import { type Locator, type Page } from '@playwright/test';

/** Screen shown at the end of a round. */
export class ResultPage {
  readonly page: Page;
  readonly message: Locator;
  readonly score: Locator;
  readonly playAgainButton: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.message = page.locator('.result h1');
    this.score = page.locator('.result .score');
    this.playAgainButton = page.getByRole('button', { name: 'Še enkrat' });
    this.homeButton = page.getByRole('button', { name: 'Domov' });
  }
}
