import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { Bot } from './bot';
import { E2E, probe, waitState, watchErrors } from './helpers';

// Reference screenshots for the QA report (WebGL renderer). Skipped unless
// SHOTS=1; uses the e2e build's room jump to reach each scene quickly:
//   npm run build:e2e && SHOTS=1 npx playwright test screenshots
const OUT = 'qa/screenshots';

async function jump(page: Page, room: string, extra: Record<string, string> = {}): Promise<Bot> {
  const q = new URLSearchParams({ room, ...extra });
  await page.goto(`${E2E}?${q.toString()}`);
  await waitState(page, (s) => s.room === room && !!s.player, 90_000, `room ${room}`);
  const bot = new Bot(page);
  await bot.settle(120_000);
  return bot;
}

async function shot(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 86 });
}

test.describe('reference screenshots', () => {
  test.skip(!process.env.SHOTS, 'SHOTS not set');
  test.beforeAll(() => mkdirSync(OUT, { recursive: true }));
  test.setTimeout(300_000);

  test('main menu', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(E2E);
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 90_000 });
    await page.waitForTimeout(2500);
    await shot(page, '01-menu');
    expect(errors).toEqual([]);
  });

  test('root Gorti in the forest', async ({ page }) => {
    const bot = await jump(page, 'r06', { cp: 'r06_knots', flags: 'r06.shout', form: 'root' });
    await bot.walkTo(860, 10);
    await page.waitForTimeout(600);
    await shot(page, '02-root-forest');
  });

  test('human form puzzle', async ({ page }) => {
    const bot = await jump(page, 'r05', { form: 'human', flags: 'r05.enter,r05.formTut' });
    await bot.walkTo(690, 8);
    await bot.keyDown('KeyD');
    await page.waitForTimeout(1500);
    await shot(page, '03-human-puzzle');
    await bot.keyUp('KeyD');
  });

  test('mounted ride', async ({ page }) => {
    await jump(page, 'r07');
    await page.waitForTimeout(9000);
    await shot(page, '04-ride');
  });

  test('Sun arena', async ({ page }) => {
    await jump(page, 'r08');
    await waitState(page, (s) => (s as unknown as { extra: { sun?: { phase: string } } }).extra.sun?.phase === 'p1', 60_000, 'phase 1');
    await page.waitForTimeout(3500);
    await shot(page, '05-sun');
  });

  test('inner dormitory', async ({ page }) => {
    const bot = await jump(page, 'r10');
    await bot.walkTo(640, 10);
    await page.waitForTimeout(500);
    await shot(page, '06-dormitory');
  });

  test('final document', async ({ page }) => {
    const bot = await jump(page, 'r12', { cp: 'r12_room', flags: 'r12.intercut,r12.door,r12.doc1,r12.doc2,r12.doc3,r12.read' });
    await bot.walkTo(2150, 10);
    await bot.act('Son sayfayı çevir');
    await waitState(page, (s) => s.docOpen, 5000, 'clause page');
    await page.waitForTimeout(800);
    await bot.tap('KeyE');
    await page.waitForTimeout(400);
    await waitState(page, (s) => s.docOpen, 5000, 'final page');
    await page.waitForTimeout(1600);
    await shot(page, '07-final-document');
    const st = await probe(page);
    expect(st.docOpen).toBe(true);
  });
});
