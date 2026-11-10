import { test, expect } from '../pages/fixtures';

test.describe('Seštevanje in odštevanje', () => {
  test.beforeEach(async ({ home, levels }) => {
    await home.goto();
    await home.openModule('Seštevanje in odštevanje');
    await expect(levels.heading).toHaveText('Seštevanje in odštevanje');
    await levels.choose('Lažje');
  });

  test('a perfect round gives 10 out of 10 and 10 pearls', async ({ game, result, home }) => {
    await game.playPerfectRound(10);

    await expect(result.message).toHaveText('Čudovit rezultat!');
    await expect(result.score).toHaveText('10 od 10');

    await result.homeButton.click();
    await expect(home.pearlCount).toHaveText('10');
  });

  test('checking without an answer asks for one', async ({ game }) => {
    await game.check();
    await expect(game.feedback).toHaveText('Najprej vpiši rezultat.');
  });

  test('first wrong answer allows a retry, second reveals the right answer', async ({ game }) => {
    const right = await game.correctAnswer();
    const wrong = await game.wrongAnswer();

    await game.type(wrong);
    await game.check();
    await expect(game.feedback).toHaveAttribute('data-state', 'retry');
    await expect(game.feedback).toHaveText('Skoraj! Poskusi še enkrat.');

    await game.type(wrong);
    await game.check();
    await expect(game.feedback).toHaveAttribute('data-state', 'wrong');
    await expect(game.feedback).toContainText(`Pravilen odgovor je ${right}.`);
    await expect(game.answer).toHaveText(String(right));
    await expect(game.goButton).toHaveText('Naprej');
  });

  test('erase removes the last digit', async ({ game }) => {
    await game.type('12');
    await expect(game.answer).toHaveText('12');
    await game.eraseButton.click();
    await expect(game.answer).toHaveText('1');
  });
});
