import { expect, test, type Page } from '@playwright/test';
import { Bot } from './bot';
import { E2E, probe, waitState, watchErrors } from './helpers';
import { ROUTES } from './routes';
import { JUMPING } from '../../src/engine/constants';
import { TOUCH } from '../../src/tuning';

// Phone-sized landscape screen with touch only: menus are tapped, the game
// is played through the on-screen controls (the walking stick, the action
// button and Zıpla, two thumbs at once) and the dialogue and document
// pages are touched directly. No keyboard input.
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
    // The stick and the action button are all the game needs; Zıpla is
    // there for fun (when jumping is on), the chips come with the story.
    await expect(page.locator('#touch .tc-stick')).toBeVisible();
    const shown = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('#touch .tc:not(.hidden)')].map((e) => e.dataset.key).sort());
    expect(shown).toEqual(JUMPING ? ['action', 'jump'] : ['action']);
    await expect(page.getByRole('button', { name: 'Zıpla' })).toBeVisible();
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

  test('touch controls never overlap, keep clear of the subtitles and the top corners, held upright or sideways, for either hand', async ({ page }) => {
    await newGameByTouch(page);
    await new Bot(page, 'touch').settle();
    const check = async (hand: 'right' | 'left'): Promise<void> => {
      for (const [w, h] of [
        [915, 412],
        [740, 340],
        [412, 915],
        [355, 620],
        [320, 568],
      ] as const) {
        await page.setViewportSize({ width: w, height: h });
        await page.waitForTimeout(400);
        // Every button showing, even the ones the story has not given yet
        // (measured once they have popped onto the page).
        await page.evaluate(async () => {
          const all = [...document.querySelectorAll<HTMLElement>('#touch .tc')];
          for (const e of all) e.classList.remove('hidden');
          await Promise.all(all.flatMap((e) => e.getAnimations().map((a) => a.finished)));
        });
        const r = await page.evaluate(
          ({ clear, topClear }) => {
            type Circle = { k: string; x: number; y: number; r: number };
            type Rect = { k: string; l: number; t: number; r: number; b: number };
            const discs: Circle[] = [];
            const tags: Rect[] = [];
            for (const e of document.querySelectorAll<HTMLElement>('#touch .tc-stick, #touch .tc')) {
              const k = e.dataset.key ?? 'stick';
              const b = e.getBoundingClientRect();
              discs.push({ k, x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2 });
              const t = e.querySelector('.tc-tag')?.getBoundingClientRect();
              if (t && t.width) tags.push({ k: `${k} tag`, l: t.left, t: t.top, r: t.right, b: t.bottom });
            }
            const out: string[] = [];
            // Apart: discs from discs, tags from other discs and tags.
            for (let i = 0; i < discs.length; i++)
              for (let j = i + 1; j < discs.length; j++) {
                const a = discs[i]!;
                const b = discs[j]!;
                if (Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r) out.push(`${a.k}×${b.k}`);
              }
            for (const t of tags) {
              for (const c of discs) {
                if (t.k === `${c.k} tag`) continue;
                const nx = Math.max(t.l, Math.min(c.x, t.r));
                const ny = Math.max(t.t, Math.min(c.y, t.b));
                if (Math.hypot(nx - c.x, ny - c.y) < c.r) out.push(`${t.k}×${c.k}`);
              }
              for (const u of tags) if (u !== t && t.l < u.r && t.r > u.l && t.t < u.b && t.b > u.t) out.push(`${t.k}×${u.k}`);
            }
            // On the screen, big enough for a thumb.
            for (const c of discs) {
              if (c.x - c.r < 0 || c.y - c.r < 0 || c.x + c.r > innerWidth || c.y + c.r > innerHeight) out.push(`${c.k} off the screen`);
              if (c.r * 2 < 44) out.push(`${c.k} smaller than 44 px`);
            }
            // Clear of the subtitles (under the game view upright, the
            // column at the bottom middle sideways) and of the top corners.
            const portrait = document.getElementById('app')!.classList.contains('portrait');
            const view = document.querySelector('#game canvas')!.getBoundingClientRect();
            const col = document.querySelector('#stage .hud-stack')!.getBoundingClientRect();
            const boxes = [...discs.map((c) => ({ k: c.k, l: c.x - c.r, t: c.y - c.r, r: c.x + c.r, b: c.y + c.r })), ...tags];
            for (const b of boxes) {
              if (portrait && b.t < view.bottom + clear) out.push(`${b.k} over the subtitles`);
              if (!portrait && b.r > col.left && b.l < col.right) out.push(`${b.k} over the subtitle column`);
              if (!portrait && b.t < innerHeight * topClear) out.push(`${b.k} in the top corners`);
            }
            const stick = discs.find((c) => c.k === 'stick')!;
            const jump = discs.find((c) => c.k === 'jump')!;
            return { problems: out, stickLeft: stick.x < innerWidth / 2, jumpRight: jump.x > innerWidth / 2 };
          },
          { clear: TOUCH.clearBelowView, topClear: TOUCH.topClear },
        );
        expect(r, `${w}×${h}, ${hand} hand`).toEqual({ problems: [], stickLeft: hand === 'right', jumpRight: hand === 'right' });
      }
    };
    await check('right');
    // Mirrored for a left hand, from the settings.
    await page.setViewportSize({ width: 915, height: 412 });
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Duraklat' }).tap();
    await page.getByRole('button', { name: 'Ayarlar' }).tap();
    await page.getByRole('group', { name: 'Dokunmatik düzen' }).getByRole('button', { name: 'Solak' }).tap();
    await page.getByRole('button', { name: 'Geri' }).tap();
    await page.getByRole('button', { name: 'Devam', exact: true }).tap();
    await waitState(page, (s) => !s.paused && s.context === 'gameplay', 5000, 'resumed');
    await check('left');
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
    await expect(page.locator('.ending .final-line')).toHaveText('Kâğıt üstünde, Gorti’nin içindeki ruhların hiçbiri artık onun değildi.');
    const menu = page.getByRole('button', { name: 'Ana menü' });
    await expect(menu).toBeVisible({ timeout: 15_000 });
    await menu.tap();
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 20_000 });
    expect(errors).toEqual([]);
  });
});
