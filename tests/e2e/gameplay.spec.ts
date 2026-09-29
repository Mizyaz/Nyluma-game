import { expect, test, type Page } from '@playwright/test';
import { E2E, hold, probe, seedSave, startNewGame, tap, waitState, watchErrors } from './helpers';
import { Bot } from './bot';
import { ROUTES } from './routes';


// Gameplay flows against the e2e build (the production game plus a read-only
// state probe). `?canvas=1` selects Phaser's Canvas renderer: headless
// Chromium's software WebGL is too slow for real-time input tests.
const GAME = `${E2E}?canvas=1`;

const save = (progress: Record<string, unknown>, profile: Record<string, unknown> = {}) => ({
  schema: 1,
  savedAt: Date.now(),
  progress: { flags: [], abilities: [], form: 'root', playMs: 0, ...progress },
  profile: { memories: [], endingSeen: false, chaptersReached: [1], ...profile },
});

async function freshPage(page: Page): Promise<void> {
  await page.goto(GAME);
  await page.evaluate(() => localStorage.clear());
}

test.describe('gameplay', () => {
  test('walks, jumps, passes the furniture and inspects in the first room', async ({ page }) => {
    const errors = watchErrors(page);
    await freshPage(page);
    await startNewGame(page, GAME);
    const bot = new Bot(page);
    await bot.settle();
    const s0 = await probe(page);
    await hold(page, 'KeyD', 700);
    const s1 = await probe(page);
    expect(s1.player!.x).toBeGreaterThan(s0.player!.x + 60);

    // Variable-height jump: leaves the ground and comes back down.
    await page.keyboard.down('Space');
    await waitState(page, (s) => !s.player!.onGround && s.player!.vy < 0, 3000, 'airborne');
    await page.keyboard.up('Space');
    await waitState(page, (s) => s.player!.onGround, 4000, 'landed');

    // Contextual interaction: the toy whale.
    await bot.walkTo(620, 10);
    await bot.act('İncele');
    await waitState(page, (s) => s.dialogueOpen, 5000, 'dialogue');
    await bot.settle();
    expect((await probe(page)).flags).toContain('r01.toywhale');

    // The toy blocks and the chest stand against the back wall: Gorti walks
    // in front of them to the window without jumping.
    await bot.walkTo(1441, 10);
    const s2 = await probe(page);
    expect(s2.player!.onGround).toBe(true);
    expect(Math.abs(s2.player!.y - 660)).toBeLessThan(4);
    await bot.act('İncele');
    await bot.settle();
    expect((await probe(page)).flags).toContain('r01.window');
    expect(errors).toEqual([]);
  });

  test('pauses, resumes and drops held keys when the window loses focus', async ({ page }) => {
    await freshPage(page);
    await startNewGame(page, GAME);
    await new Bot(page).settle();

    await tap(page, 'Escape');
    await waitState(page, (s) => s.paused, 3000, 'paused');
    await expect(page.getByRole('heading', { name: 'Duraklatıldı' })).toBeVisible();
    const x = (await probe(page)).player!.x;
    await page.waitForTimeout(400);
    expect((await probe(page)).player!.x).toBe(x);
    await page.getByRole('button', { name: 'Devam', exact: true }).click();
    await waitState(page, (s) => !s.paused && s.context === 'gameplay', 3000, 'resumed');

    // Hold "right", then blur: the hold is released and the game pauses.
    await page.keyboard.down('KeyD');
    await waitState(page, (s) => s.player!.vx > 50, 3000, 'moving');
    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    const after = await waitState(page, (s) => s.paused, 3000, 'auto-pause');
    expect(after.heldSources).toBe(0);
    await page.keyboard.up('KeyD');
    await page.getByRole('button', { name: 'Devam', exact: true }).click();
    await waitState(page, (s) => !s.paused, 3000, 'resumed again');
    await page.waitForTimeout(500);
    const still = await probe(page);
    expect(Math.abs(still.player!.vx)).toBeLessThan(5);
  });

  test('saves at checkpoints and continues after a reload', async ({ page }) => {
    await seedSave(page, GAME, save({ room: 'r04', checkpoint: 'r04_start', abilities: ['pulse', 'reach', 'song', 'focus'] }, { chaptersReached: [1, 2] }));
    await page.reload();
    const cont = page.getByRole('button', { name: 'Devam Et' });
    await expect(cont).toBeEnabled({ timeout: 60_000 });
    await cont.click();
    await waitState(page, (s) => s.room === 'r04' && !!s.player, 60_000, 'room r04');
    const bot = new Bot(page);
    await bot.settle();
    // Walking onto the next checkpoint lights and saves it.
    await bot.walkTo(1100, 20);
    await waitState(page, (s) => s.checkpoint === 'r04_focus', 5000, 'checkpoint r04_focus');
    await page.reload();
    await page.getByRole('button', { name: 'Devam Et' }).click();
    const back = await waitState(page, (s) => s.room === 'r04' && !!s.player && s.context === 'gameplay', 60_000, 'continued');
    expect(back.checkpoint).toBe('r04_focus');
    expect(Math.abs(back.player!.x - 1100)).toBeLessThan(80);
  });

  test('every main-menu and pause-menu button works', async ({ page }) => {
    const errors = watchErrors(page);
    await freshPage(page);
    await page.reload();
    const back = page.getByRole('button', { name: 'Geri' });
    for (const [name, heading] of [
      ['Bölümler', 'Bölümler'],
      ['Anılar', 'Anılar'],
      ['Ayarlar', 'Ayarlar'],
      ['Katkıda Bulunanlar', 'Katkıda Bulunanlar'],
    ] as const) {
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
      await back.click();
      await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Devam Et' })).toBeDisabled();
    await page.getByRole('button', { name: 'Yeni Oyun' }).click();
    await waitState(page, (s) => s.room === 'r01' && !!s.player, 60_000, 'room r01');
    await new Bot(page).settle();

    await tap(page, 'Escape');
    await expect(page.getByRole('heading', { name: 'Duraklatıldı' })).toBeVisible();
    const pauseMenu = page.getByRole('navigation', { name: 'Duraklatma menüsü' });
    await pauseMenu.getByRole('button', { name: 'Hedef', exact: true }).click();
    await expect(pauseMenu.getByText('Odayı tanı: üç şeyi incele.')).toBeVisible();
    await page.getByRole('button', { name: 'Anılar' }).click();
    await expect(page.getByRole('heading', { name: 'Anılar' })).toBeVisible();
    await back.click();
    await page.getByRole('button', { name: 'Ayarlar' }).click();
    await expect(page.getByRole('heading', { name: 'Ayarlar' })).toBeVisible();
    await back.click();
    await page.getByRole('button', { name: 'Ana Menü' }).click();
    await page.getByRole('button', { name: 'Evet' }).click();
    const cont = page.getByRole('button', { name: 'Devam Et' });
    await expect(cont).toBeEnabled({ timeout: 20_000 });
    await cont.click();
    await waitState(page, (s) => s.room === 'r01' && !!s.player && s.context === 'gameplay', 60_000, 'continued');
    expect(errors).toEqual([]);
  });

  test('settings persist across reloads', async ({ page }) => {
    await freshPage(page);
    await page.reload();
    await page.getByRole('button', { name: 'Ayarlar' }).click();
    const speed = page.getByRole('group', { name: 'Metin hızı' });
    await speed.getByRole('button', { name: 'Anında' }).click();
    await page.getByRole('group', { name: 'Hikâye yardımı' }).getByRole('button', { name: 'Açık' }).click();
    await page.getByRole('group', { name: 'Nefes (odak)' }).getByRole('button', { name: 'Aç / kapa' }).click();
    await page.getByLabel('Müzik').fill('20');
    await page.reload();
    await page.getByRole('button', { name: 'Ayarlar' }).click();
    await expect(page.getByRole('group', { name: 'Metin hızı' }).getByRole('button', { name: 'Anında' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('group', { name: 'Hikâye yardımı' }).getByRole('button', { name: 'Açık' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('group', { name: 'Nefes (odak)' }).getByRole('button', { name: 'Aç / kapa' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Müzik')).toHaveValue('20');
  });

  test('recovers from a corrupt save and runs without storage', async ({ page, context }) => {
    await page.goto(GAME);
    await page.evaluate(() => localStorage.setItem('kristaller-dunyasi:save', '{not json'));
    await page.reload();
    await expect(page.getByText('Kayıt okunamadı; yeni bir oyun başlatabilirsiniz.')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByRole('button', { name: 'Devam Et' })).toBeDisabled();
    await page.getByRole('button', { name: 'Yeni Oyun' }).click();
    await waitState(page, (s) => s.room === 'r01' && !!s.player, 60_000, 'new game after corrupt save');

    const blocked = await context.newPage();
    await blocked.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('blocked', 'SecurityError');
        },
      });
    });
    const errors = watchErrors(blocked);
    await blocked.goto(GAME);
    await expect(blocked.getByText('Bu oturumda kayıt kullanılamıyor')).toBeVisible({ timeout: 60_000 });
    await blocked.getByRole('button', { name: 'Yeni Oyun' }).click();
    await waitState(blocked, (s) => s.room === 'r01' && !!s.player && s.context === 'gameplay', 60_000, 'playable without storage');
    expect(errors).toEqual([]);
  });

  test('chapter select starts an unlocked chapter', async ({ page }) => {
    await seedSave(page, GAME, save({ room: 'r01', checkpoint: 'r01_start' }, { chaptersReached: [1, 2, 3] }));
    await page.reload();
    await page.getByRole('button', { name: 'Bölümler' }).click();
    await expect(page.getByRole('button', { name: /IV\./ })).toBeDisabled();
    await page.getByRole('button', { name: /III\./ }).click();
    const confirm = page.getByRole('button', { name: 'Evet' });
    if (await confirm.isVisible().catch(() => false)) await confirm.click();
    await waitState(page, (s) => s.room === 'r07' && !!s.player, 60_000, 'chapter III');
  });

  test('the final office ends with the sale and the fixed line', async ({ page }) => {
    test.setTimeout(240_000);
    await seedSave(page, GAME, save({ room: 'r12', checkpoint: 'r12_start', abilities: ['pulse', 'reach', 'song', 'focus', 'form'], form: 'human' }, { chaptersReached: [1, 2, 3, 4, 5] }));
    await page.reload();
    await page.getByRole('button', { name: 'Devam Et' }).click();
    await waitState(page, (s) => s.room === 'r12' && !!s.player, 60_000, 'room r12');
    await ROUTES.r12!(new Bot(page));
    await expect(page.locator('.ending .final-line')).toHaveText('Gorti, içindeki tüm ruhların sahipliğini kaybetmişti.');
    await expect(page.getByRole('button', { name: 'Yeniden oyna' })).toBeVisible({ timeout: 15_000 });
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('kristaller-dunyasi:save') ?? '{}') as { profile?: { endingSeen?: boolean } });
    expect(saved.profile?.endingSeen).toBe(true);
    // The card returns to the menu, where every chapter is now open.
    await page.getByRole('button', { name: 'Ana menü' }).click();
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 20_000 });
    await page.getByRole('button', { name: 'Bölümler' }).click();
    for (const r of ['I', 'II', 'III', 'IV', 'V']) await expect(page.getByRole('button', { name: new RegExp(`^${r}\\. `) })).toBeEnabled();
    await page.getByRole('button', { name: 'Geri' }).click();
  });
});

test.describe('touch', () => {
  test.use({ hasTouch: true, isMobile: false });

  test('two simultaneous touches move and jump; cancelling releases everything', async ({ page }) => {
    await freshPage(page);
    await startNewGame(page, GAME);
    await new Bot(page).settle();
    const pad = await page.locator('.tc-pad').boundingBox();
    const jump = await page.locator('.tc[data-key="jump"]').boundingBox();
    expect(pad && jump).toBeTruthy();
    const cdp = await page.context().newCDPSession(page);
    const right = { x: pad!.x + pad!.width * 0.8, y: pad!.y + pad!.height / 2, id: 1 };
    const j = { x: jump!.x + jump!.width / 2, y: jump!.y + jump!.height / 2, id: 2 };
    const x0 = (await probe(page)).player!.x;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [right] });
    await page.waitForTimeout(250);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [right, j] });
    await waitState(page, (s) => !s.player!.onGround, 3000, 'jump while moving');
    const mid = await probe(page);
    expect(mid.heldSources).toBe(2);
    expect(mid.player!.vx).toBeGreaterThan(50);
    // Lift the jump finger (touchEnd lists the fingers that lift); the
    // movement finger keeps moving.
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [j] });
    await page.waitForTimeout(300);
    const one = await probe(page);
    expect(one.heldSources).toBe(1);
    expect(one.player!.x).toBeGreaterThan(x0 + 40);
    // Slide the movement finger to the left half: direction flips.
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ ...right, x: pad!.x + pad!.width * 0.2 }] });
    await waitState(page, (s) => s.player!.vx < -50, 3000, 'moving left');
    // The system cancels the touch: nothing stays held.
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await waitState(page, (s) => s.heldSources === 0, 3000, 'released');
    await page.waitForTimeout(400);
    expect(Math.abs((await probe(page)).player!.vx)).toBeLessThan(5);
  });
});

test.describe('music', () => {
  test('the generated piano starts with the first key press and follows the rooms', async ({ page }) => {
    const errors = watchErrors(page);
    await freshPage(page);
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 60_000 });
    expect((await probe(page)).music.source).toBe('none');
    // Sound needs a user gesture: the first key press anywhere starts the title music.
    await page.keyboard.press('ArrowDown');
    await waitState(page, (s) => s.music.cue === 'menu' && s.music.source === 'piano' && s.music.notes > 4, 10_000, 'title piano');
    await page.getByRole('button', { name: 'Yeni Oyun' }).click();
    await waitState(page, (s) => s.room === 'r01' && s.music.cue === 'roots' && s.music.source === 'piano', 60_000, 'chapter I piano');
    const before = (await probe(page)).music.notes;
    await page.waitForTimeout(3000);
    expect((await probe(page)).music.notes).toBeGreaterThan(before);
    // Every cue is audible at the default volume and never clips.
    for (const cue of ['menu', 'roots', 'forest', 'ride', 'sun', 'inner', 'final']) {
      const r = await page.evaluate(([c]) => (window as unknown as { __kd: { renderMusic(c: string, s: number): Promise<{ peak: number; rms: number; notes: number }> } }).__kd.renderMusic(c!, 8), [cue]);
      expect(r.rms, cue).toBeGreaterThan(0.008);
      expect(r.peak, cue).toBeLessThan(0.9);
      expect(r.notes, cue).toBeGreaterThan(8);
    }
    expect(errors).toEqual([]);
  });

  test('a library recording plays for its cue; one that cannot play hands over to the piano', async ({ page }) => {
    // A two-second tone stands in for a licensed recording.
    const rate = 22050;
    const n = rate * 2;
    const wav = Buffer.alloc(44 + n * 2);
    wav.write('RIFF', 0);
    wav.writeUInt32LE(36 + n * 2, 4);
    wav.write('WAVEfmt ', 8);
    wav.writeUInt32LE(16, 16);
    wav.writeUInt16LE(1, 20);
    wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(rate, 24);
    wav.writeUInt32LE(rate * 2, 28);
    wav.writeUInt16LE(2, 32);
    wav.writeUInt16LE(16, 34);
    wav.write('data', 36);
    wav.writeUInt32LE(n * 2, 40);
    for (let i = 0; i < n; i++) wav.writeInt16LE(Math.round(Math.sin((2 * Math.PI * 440 * i) / rate) * 6000), 44 + i * 2);
    const track = { title: 'Test', artist: 'Test', license: 'CC0-1.0', source: 'generated by the test' };
    await page.route('**/music/tracks.json', (r) =>
      r.fulfill({
        json: {
          tracks: [
            { ...track, id: 'tone', file: 'tracks/tone.wav', cues: ['menu'] },
            { ...track, id: 'broken', file: 'tracks/broken.mp3', cues: ['roots'] },
          ],
        },
      }),
    );
    await page.route('**/music/tracks/tone.wav', (r) => r.fulfill({ body: wav, contentType: 'audio/wav' }));
    await page.route('**/music/tracks/broken.mp3', (r) => r.fulfill({ status: 404, body: '' }));
    await freshPage(page);
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 60_000 });
    await page.keyboard.press('ArrowDown');
    await waitState(page, (s) => s.music.cue === 'menu' && s.music.source === 'track' && s.music.track === 'tone', 10_000, 'library track');
    await page.getByRole('button', { name: 'Yeni Oyun' }).click();
    await waitState(page, (s) => s.room === 'r01' && s.music.cue === 'roots' && s.music.source === 'piano' && s.music.notes > 0, 60_000, 'piano after a broken track');
  });
});

test.describe('layout', () => {
  test('the overlay follows the canvas in landscape and the viewport in portrait', async ({ page }) => {
    await freshPage(page);
    await startNewGame(page, GAME);
    for (const [w, h] of [
      [1280, 720],
      [1600, 900],
      [1000, 760],
      [800, 380],
      [1366, 600],
      [390, 844],
      [360, 640],
      [768, 1024],
    ] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(500);
      const r = await page.evaluate(() => {
        const c = document.querySelector('#game canvas')!.getBoundingClientRect();
        const s = document.getElementById('stage')!.getBoundingClientRect();
        const t = document.querySelector('.hud-stack')!.getBoundingClientRect();
        return { c: [c.left, c.top, c.width, c.height], s: [s.left, s.top, s.width, s.height], stackTop: t.top, portrait: document.getElementById('app')!.classList.contains('portrait'), sw: document.documentElement.scrollWidth, iw: innerWidth };
      });
      expect(r.c[2]! / r.c[3]!).toBeCloseTo(16 / 9, 1);
      expect(r.sw).toBeLessThanOrEqual(r.iw);
      if (h > w * 0.9) {
        // Portrait: full-width game view under the HUD band, texts below it.
        expect(r.portrait).toBe(true);
        expect(Math.abs(r.c[2]! - w)).toBeLessThan(1.5);
        expect(r.c[1]).toBeGreaterThan(40);
        for (const [i, v] of [0, 0, w, h].entries()) expect(Math.abs(r.s[i]! - v)).toBeLessThan(1.5);
        expect(r.stackTop).toBeGreaterThanOrEqual(r.c[1]! + r.c[3]! - 1);
      } else {
        expect(r.portrait).toBe(false);
        for (let i = 0; i < 4; i++) expect(Math.abs(r.c[i]! - r.s[i]!)).toBeLessThan(1.5);
      }
      await expect(page.locator('.hud')).toBeVisible();
    }
  });

  test('every main-menu button is on screen at phone, tablet and desktop sizes', async ({ page }) => {
    await freshPage(page);
    for (const [w, h] of [
      [355, 620],
      [412, 915],
      [740, 340],
      [915, 412],
      [768, 1024],
      [1280, 720],
    ] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.reload();
      await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 60_000 });
      const off = await page.locator('.screen .btn').evaluateAll((els) =>
        els
          .filter((e) => {
            const r = e.getBoundingClientRect();
            return r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1;
          })
          .map((e) => e.textContent),
      );
      expect(off, `${w}×${h}`).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      if (h > w * 0.9) {
        // Held upright: the buttons sit below the picture, not across its edge.
        const across = await page.evaluate(() => {
          if (!document.getElementById('app')!.classList.contains('roomy')) return null;
          const bottom = document.querySelector('#game canvas')!.getBoundingClientRect().bottom;
          return [...document.querySelectorAll('.screen .btn')].filter((e) => e.getBoundingClientRect().top < bottom - 1).map((e) => e.textContent);
        });
        expect(across, `${w}×${h}`).toEqual([]);
      }
    }
  });
});
