import { test, expect } from '../pages/fixtures';

test.describe('Home screen', () => {
  test.beforeEach(async ({ home }) => {
    await home.goto();
  });

  test('shows the title, module groups and all modules', async ({ home }) => {
    await expect(home.greeting).toHaveText('Živijo!');
    await expect(home.groupHeadings).toHaveText([
      'Računanje',
      'Čas, mere in liki',
      'Logika, jezik in glasba',
      'Vaja',
    ]);
    await expect(home.modules).toHaveCount(18);
    await expect(home.module('Seštevanje in odštevanje')).toBeEnabled();
  });

  test('a new player starts with 0 pearls', async ({ home }) => {
    await expect(home.pearlCount).toHaveText('0');
  });

  test('remembers the player name after reload', async ({ home, page }) => {
    await home.setName('Ana');
    await expect(home.greeting).toHaveText('Živijo, Ana!');

    await page.reload();
    await expect(home.greeting).toHaveText('Živijo, Ana!');
  });
});
