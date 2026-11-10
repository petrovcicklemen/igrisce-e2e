import { test, expect } from '../pages/fixtures';

test('times table explains the tapped cell', async ({ home, timesTable }) => {
  await home.goto();
  await home.openModule('Tabela poštevanke');

  await expect(timesTable.cells).toHaveCount(100);
  await expect(timesTable.banner).toHaveText('Tapni na število v tabeli.');

  await timesTable.cell(7, 8).click();
  await expect(timesTable.banner).toHaveText('7 × 8 = 56');
  await expect(timesTable.cell(7, 8)).toHaveClass(/\bon\b/);
});
