import { expect, test, type Page } from '@playwright/test';
import { E2E, probe, startNewGame, tap, waitState, watchErrors, type ProbeState } from './helpers';
import { Bot } from './bot';

// The experience layer: the paintings at the chapter starts, the Rezonans
// moves that grow with the story, and the face-animated dialogue scenes.
// Rooms are entered through the e2e build's room jump (?room=…).
const GAME = `${E2E}?canvas=1`;

async function jump(page: Page, params: Record<string, string>): Promise<Bot> {
  await page.goto(`${E2E}?${new URLSearchParams({ canvas: '1', ...params }).toString()}`);
  await waitState(page, (s) => s.room === params.room && !!s.player, 60_000, `room ${params.room}`);
  const bot = new Bot(page);
  await bot.settle();
  return bot;
}

/** Collects every effect kind seen while `pred` is waited for. */
async function watchMoves(page: Page, pred: (s: ProbeState) => boolean, timeout: number, label: string): Promise<{ kinds: Set<string>; birds: number }> {
  const kinds = new Set<string>();
  let birds = 0;
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const s = await probe(page);
    for (const k of s.moves?.running ?? []) kinds.add(k);
    birds = Math.max(birds, s.moves?.birds ?? 0);
    if (pred(s)) return { kinds, birds };
    await page.waitForTimeout(80);
  }
  throw new Error(`Timed out waiting for ${label}: ${JSON.stringify(await probe(page))}`);
}

test.describe('experience', () => {
  test('the painting at the chapter start: Gorti looks at his future and his past', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(GAME);
    await page.evaluate(() => localStorage.clear());
    await startNewGame(page, GAME);
    const bot = new Bot(page);
    await bot.settle();
    expect((await probe(page)).features).toEqual(['painting:stranger']);

    // It hangs on the back wall by the bed.
    await bot.walkTo(270, 12);
    await bot.act('İncele');
    await waitState(page, (s) => s.docOpen, 5000, 'painting open');
    const card = page.locator('.doc.painting .painting-card');
    await expect(card).toBeVisible();
    await expect(card.locator('figcaption b')).toHaveText('House of The Stranger');
    await expect(card.locator('.line')).toHaveText('Gorti geleceğine ve geçmişine bakış attı.');
    // The artwork itself has loaded.
    await expect.poll(() => card.locator('img').evaluate((img) => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

    await page.waitForTimeout(700);
    await page.getByRole('button', { name: 'Kapat' }).click();
    const after = await waitState(page, (s) => !s.docOpen && s.context === 'gameplay', 5000, 'painting closed');
    expect(after.flags).toContain('painting.stranger');
    expect(errors).toEqual([]);
  });

  test('the last chapter hangs the whole life along the corridor', async ({ page }) => {
    await jump(page, { room: 'r12' });
    expect((await probe(page)).features).toEqual(['painting:stranger', 'painting:moon', 'painting:youth', 'painting:warrior']);
  });

  test('Rezonans: a flower opens and a bird flies out of it, then everything clears', async ({ page }) => {
    const errors = watchErrors(page);
    const bot = await jump(page, { room: 'r01' });
    // The room starts under the painting; between the bed and the toy whale
    // nothing asks to be looked at, so E is a Rezonans move.
    await bot.walkTo(525, 8);
    const s0 = await probe(page);
    expect(s0.prompts).toEqual([]);
    expect(s0.moves).toMatchObject({ count: 0, ready: true, next: 'bloom' });

    await tap(page, 'KeyE');
    await waitState(page, (s) => s.moves!.count === 1, 3000, 'first move');
    const seen = await watchMoves(page, (s) => s.moves!.birds > 0, 3000, 'a bird');
    expect([...seen.kinds]).toEqual(['bloom']);
    expect((await probe(page)).moves!.last).toBe('bloom');
    // The flower fades, the bird flies away: nothing is left running.
    await waitState(page, (s) => s.moves!.running.length === 0 && s.moves!.birds === 0, 8000, 'effects over');
    expect(errors).toEqual([]);
  });

  test('Rezonans grows: a bed of flowers and a flock later in the story', async ({ page }) => {
    await jump(page, { room: 'r09' });
    const s0 = await probe(page);
    expect(s0.prompts).toEqual([]);
    expect(s0.moves!.next).toBe('bloom');
    await tap(page, 'KeyE');
    const first = await waitState(page, (s) => s.moves!.count === 1, 3000, 'move');
    expect(first.moves!.running.filter((k) => k === 'bloom').length).toBeGreaterThanOrEqual(3);
    const seen = await watchMoves(page, (s) => s.moves!.running.length === 0 && s.moves!.birds === 0, 10_000, 'effects over');
    expect(seen.birds).toBeGreaterThanOrEqual(4);
  });

  test('as the Sivaslı amca, Gorti laughs, and his kahkaha swaps the Sun and the Moon', async ({ page }) => {
    const errors = watchErrors(page);
    await jump(page, { room: 'r06', form: 'human' });
    const s0 = await probe(page);
    expect(s0.player!.form).toBe('human');
    expect(s0.moves!.next).toBe('laugh');

    // E: he holds his belly and laughs.
    await tap(page, 'KeyE');
    const s1 = await waitState(page, (s) => s.moves!.count === 1, 5000, 'laugh');
    expect(s1.moves!.last).toBe('laugh');
    expect(s1.sky).toBe(s0.sky);

    // E held on: the laugh becomes a kahkaha and the other one comes out.
    await waitState(page, (s) => s.moves!.ready, 5000, 'ready again');
    await page.keyboard.down('KeyE');
    const s2 = await waitState(page, (s) => s.sky !== s0.sky, 10_000, 'kahkaha');
    await page.keyboard.up('KeyE');
    expect(s2.sky).toBe(s0.sky === 'sun' ? 'moon' : 'sun');
    expect(errors).toEqual([]);
  });

  test('a face scene frames the speakers and leaves with the dialogue', async ({ page }) => {
    const errors = watchErrors(page);
    const bot = await jump(page, { room: 'r05', cp: 'r05_hill' });
    const s0 = await probe(page);
    expect(s0.scenes).not.toContain('cinema');
    const roomCue = s0.music.cue;
    expect(roomCue).not.toBe('tension');
    await page.keyboard.down('KeyD');
    await waitState(page, (s) => s.dialogueOpen, 30_000, 'the Moon speaks').finally(() => page.keyboard.up('KeyD'));
    // The face scene starts on the game's next step.
    await waitState(page, (s) => s.dialogueOpen && s.scenes.includes('cinema'), 2000, 'face scene');
    // The intense strings play under the scene…
    await waitState(page, (s) => s.music.cue === 'tension', 3000, 'strings');
    await bot.settle();
    // …and the room's music comes back with it.
    await waitState(page, (s) => !s.scenes.includes('cinema') && s.music.cue === roomCue, 5000, 'face scene closed');
    expect(errors).toEqual([]);
  });
});
