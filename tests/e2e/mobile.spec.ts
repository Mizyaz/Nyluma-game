import { expect, test, type Page } from '@playwright/test';
import { Bot } from './bot';
import { E2E, probe, waitState, watchErrors } from './helpers';
import { ROUTES } from './routes';

// Phone-sized landscape screen with touch only: menus are tapped, the game
// is played through the on-screen controls (multi-touch pad + buttons) and
// the song/puzzle/document panels are touched directly. No keyboard input.
// PHONE_UPRIGHT=1 runs the same tests with the phone held upright.
const UPRIGHT = !!process.env.PHONE_UPRIGHT;
const PHONE = { viewport: UPRIGHT ? { width: 412, height: 915 } : { width: 915, height: 412 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 };
const GAME = `${E2E}?canvas=1`;

async function newGameByTouch(page: Page): Promise<void> {
  await page.goto(GAME);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const start = page.getByRole('button', { name: 'Yeni Oyun' });
  await expect(start).toBeVisible({ timeout: 90_000 });
  await start.tap();
  await waitState(page, (s) => s.room === 'r01' && !!s.player && (s.context === 'gameplay' || s.context === 'dialogue' || s.context === 'cutscene'), 60_000, 'room r01');
}

test.describe('mobile (touch only)', () => {
  test.use(PHONE);

  test('the first room is playable with touch alone', async ({ page }) => {
    const errors = watchErrors(page);
    await newGameByTouch(page);
    await expect(page.locator('#touch')).not.toHaveClass(/off/);
    // Touch wording replaces key names in the instructions.
    await expect(page.locator('html')).toHaveClass(/touch-ui/);
    const bot = new Bot(page, 'touch');
    await ROUTES.r01!(bot);
    expect((await probe(page)).room).toBe('r02');
    // The HUD pause button and the pause menu work by touch.
    await bot.settle();
    await bot.touchSelector('.hud [aria-label="Duraklat"]');
    await waitState(page, (s) => s.paused, 5000, 'paused by touch');
    await page.getByRole('button', { name: 'Devam', exact: true }).tap();
    await waitState(page, (s) => !s.paused, 5000, 'resumed by touch');
    expect(errors).toEqual([]);
  });

  test('touch controls never overlap, held upright or sideways', async ({ page }) => {
    await newGameByTouch(page);
    for (const [w, h] of [
      [915, 412],
      [740, 340],
      [412, 915],
      [355, 620],
      [320, 568],
    ] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(400);
      // Show every contextual button too.
      await page.evaluate(() => document.querySelectorAll('#touch .tc.hidden').forEach((e) => e.classList.remove('hidden')));
      const r = await page.evaluate(() => {
        const rs = [...document.querySelectorAll('#touch .tc, #touch .tc-pad')].map((e) => ({ k: (e as HTMLElement).dataset.key ?? 'pad', r: e.getBoundingClientRect() }));
        const hits: string[] = [];
        for (let i = 0; i < rs.length; i++)
          for (let j = i + 1; j < rs.length; j++) {
            const a = rs[i]!.r;
            const b = rs[j]!.r;
            if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) hits.push(`${rs[i]!.k}×${rs[j]!.k}`);
          }
        const out = rs.filter((x) => x.r.left < 0 || x.r.top < 0 || x.r.right > innerWidth || x.r.bottom > innerHeight).map((x) => x.k);
        return { hits, out };
      });
      expect(r, `${w}×${h}`).toEqual({ hits: [], out: [] });
    }
  });

  test('@campaign touch-only full playthrough on a phone-sized screen', async ({ page }) => {
    test.setTimeout(90 * 60_000);
    const errors = watchErrors(page);
    await newGameByTouch(page);
    const bot = new Bot(page, 'touch');
    for (const room of ['r01', 'r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'r11', 'r12'] as const) {
      expect((await probe(page)).room, `expected to be in ${room}`).toBe(room);
      const t0 = Date.now();
      await ROUTES[room]!(bot);
      console.log(`touch ${room}: ${((Date.now() - t0) / 1000).toFixed(0)} s`);
    }
    await expect(page.locator('.ending .final-line')).toHaveText('Gorti, içindeki tüm ruhların sahipliğini kaybetmişti.');
    const menu = page.getByRole('button', { name: 'Ana menü' });
    await expect(menu).toBeVisible({ timeout: 15_000 });
    await menu.tap();
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 20_000 });
    expect(errors).toEqual([]);
  });
});
