import { type Locator, type Page, expect } from '@playwright/test';

/** One round of number-pad questions (addition, subtraction, times tables ...). */
export class GamePage {
  readonly page: Page;
  readonly counter: Locator;
  readonly expression: Locator;
  readonly answer: Locator;
  readonly feedback: Locator;
  readonly goButton: Locator;
  readonly eraseButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.counter = page.locator('header.bar .count');
    this.expression = page.locator('.qcard .expr');
    this.answer = page.locator('.qcard .ans');
    this.feedback = page.getByRole('status');
    // The same button reads "Preveri", then "Naprej", and "Končaj" on the last question.
    this.goButton = page.locator('.pad .key.go');
    this.eraseButton = page.getByRole('button', { name: 'Briši' });
  }

  digit(d: string): Locator {
    return this.page.locator('.pad').getByRole('button', { name: d, exact: true });
  }

  /** Tap the digits of `value` on the on-screen keypad. */
  async type(value: number | string) {
    for (const d of String(value)) await this.digit(d).click();
  }

  async check() {
    await this.goButton.click();
  }

  /** Read the visible problem, e.g. "43 + 25" or "71 − 18", and compute the answer like a player would. */
  async correctAnswer(): Promise<number> {
    const text = (await this.expression.textContent())?.trim() ?? '';
    const m = text.match(/^(\d+)\s*([+−×÷])\s*(\d+)$/);
    if (!m) throw new Error(`Unexpected problem text: "${text}"`);
    const a = Number(m[1]), b = Number(m[3]);
    switch (m[2]) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      default: return a / b;
    }
  }

  /** A guaranteed-wrong answer for the current problem. */
  async wrongAnswer(): Promise<number> {
    const right = await this.correctAnswer();
    return right === 1 ? 2 : right - 1;
  }

  async answerCorrectly() {
    await this.type(await this.correctAnswer());
    await this.check();
    await expect(this.feedback).toHaveAttribute('data-state', 'ok');
  }

  /** Answer every question in the round correctly and move on, until the result screen. */
  async playPerfectRound(questions = 10) {
    for (let i = 1; i <= questions; i++) {
      await expect(this.counter).toHaveText(`Vprašanje ${i} od ${questions}`);
      await this.answerCorrectly();
      await this.goButton.click(); // "Naprej" / "Končaj"
    }
  }
}
