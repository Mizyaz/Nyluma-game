import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { Bot } from './bot';
import { E2E, probe, waitState, watchErrors } from './helpers';

// Reference screenshots for the QA report (WebGL renderer). Skipped unless
// SHOTS=1; uses the e2e build's room jump to reach each scene quickly:
//   npm run build:e2e && SHOTS=1 npx playwright test screenshots
// SHOTS_DIR writes them elsewhere. `bursts=0` keeps the colour bombardment
// out of the pictures.
const OUT = process.env.SHOTS_DIR ?? 'qa/screenshots';
const GAME = `${E2E}?bursts=0`;

async function jump(page: Page, room: string, extra: Record<string, string> = {}): Promise<Bot> {
  const q = new URLSearchParams({ room, bursts: '0', ...extra });
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
    await page.goto(GAME);
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 90_000 });
    await page.waitForTimeout(2500);
    await shot(page, '01-menu');
    expect(errors).toEqual([]);
  });

  test('scene change transition', async ({ page }) => {
    await page.goto(`${GAME}&room=r05`);
    await waitState(page, (s) => s.scenes.includes('warp'), 120_000, 'scene change');
    await page.waitForTimeout(450);
    await shot(page, '08-scene-change');
  });

  test('root Gorti in the forest', async ({ page }) => {
    const bot = await jump(page, 'r06', { cp: 'r06_knots', flags: 'r06.shout', form: 'root' });
    await bot.walkTo(860, 10);
    await page.waitForTimeout(600);
    await shot(page, '02-root-forest');
  });

  test('human form by the memory stones', async ({ page }) => {
    const bot = await jump(page, 'r05', { form: 'human', flags: 'r05.enter' });
    await bot.walkTo(1000, 8);
    await bot.keyDown('KeyD');
    await page.waitForTimeout(1500);
    await shot(page, '03-human-stones');
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

  test('colour bombardment', async ({ page }) => {
    await jump(page, 'r02', { bursts: 'fast' });
    await waitState(page, (s) => !!s.bursts?.active, 30_000, 'bombardment');
    await page.waitForTimeout(900);
    await shot(page, '11-colour-storm');
  });

  test('Gorti mid-stride in the forest', async ({ page }) => {
    // Jumping is off: the story rooms are walked.
    const bot = await jump(page, 'r06', { cp: 'r06_knots', flags: 'r06.shout', form: 'root' });
    await bot.walkTo(760, 10);
    await bot.keyDown('KeyD');
    await waitState(page, (s) => !!s.player && s.player.onGround && s.player.vx > 150, 5000, 'walking');
    await page.waitForTimeout(300);
    await shot(page, '12-walk');
    await bot.keyUp('KeyD');
  });

  test('final document', async ({ page }) => {
    await jump(page, 'r12', { cp: 'r12_room', flags: 'r12.intercut,r12.door' });
    // At the end of the table the last pages open by themselves.
    await page.keyboard.down('KeyD');
    await waitState(page, (s) => s.docOpen, 60_000, 'clause page');
    await page.keyboard.up('KeyD');
    await expect(page.locator('.doc .close')).toContainText('Sayfayı çevir');
    await page.waitForTimeout(800);
    await page.keyboard.press('KeyE');
    await expect(page.locator('.doc .close')).toContainText('Bırak');
    await page.waitForTimeout(1600);
    await shot(page, '07-final-document');
    const st = await probe(page);
    expect(st.docOpen).toBe(true);
  });
});

test.describe('reference screenshots, phone held upright', () => {
  test.skip(!process.env.SHOTS, 'SHOTS not set');
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  test.setTimeout(300_000);

  test('main menu (upright phone)', async ({ page }) => {
    await page.goto(GAME);
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 90_000 });
    await page.waitForTimeout(2500);
    await shot(page, '09-phone-menu');
  });

  test('first room with subtitles (upright phone)', async ({ page }) => {
    await page.goto(`${GAME}&room=r01`);
    await waitState(page, (s) => s.room === 'r01' && !!s.player, 90_000, 'room r01');
    await expect(page.locator('.caption.show')).toBeVisible({ timeout: 60_000 });
    await page.waitForTimeout(1200);
    await shot(page, '10-phone-game');
  });
});

