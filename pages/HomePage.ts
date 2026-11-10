import { type Locator, type Page, expect } from '@playwright/test';

/** Start screen: greeting, Hobi, pearl/streak stats and the list of modules. */
export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly greeting: Locator;
  readonly groupHeadings: Locator;
  readonly modules: Locator;
  readonly pearlCount: Locator;
  readonly editNameButton: Locator;
  readonly nameInput: Locator;
  readonly saveNameButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { level: 1, name: 'Matematično igrišče' });
    this.greeting = page.locator('header.top .hello');
    this.groupHeadings = page.getByRole('heading', { level: 2 });
    this.modules = page.locator('button.module');
    this.pearlCount = page.locator('.stats .stat').first().locator('b');
    this.editNameButton = page.getByRole('button', { name: 'Spremeni ime' });
    this.nameInput = page.getByLabel('Kako ti je ime?');
    this.saveNameButton = page.getByRole('button', { name: 'Shrani' });
  }

  async goto() {
    await this.page.goto('./');
    await expect(this.title).toBeVisible();
  }

  /** Module card whose title is exactly `title` (the card also contains a subtitle). */
  module(title: string): Locator {
    return this.modules.filter({ has: this.page.locator('.t').getByText(title, { exact: true }) });
  }

  async openModule(title: string) {
    await this.module(title).click();
  }

  async setName(name: string) {
    await this.editNameButton.click();
    await this.nameInput.fill(name);
    await this.saveNameButton.click();
  }
}
