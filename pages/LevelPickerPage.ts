import { type Locator, type Page } from '@playwright/test';

/** Difficulty picker shown after opening "Seštevanje in odštevanje". */
export class LevelPickerPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.backButton = page.getByRole('button', { name: 'Nazaj na začetek' });
  }

  level(name: 'Lažje' | 'Težje' | 'Mešano'): Locator {
    return this.page.locator('button.level').filter({ has: this.page.locator('.name').getByText(name, { exact: true }) });
  }

  async choose(name: 'Lažje' | 'Težje' | 'Mešano') {
    await this.level(name).click();
  }
}
