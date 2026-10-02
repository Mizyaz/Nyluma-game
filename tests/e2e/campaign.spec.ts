import { expect, test } from '@playwright/test';
import { Bot } from './bot';
import { E2E, probe, startNewGame, watchErrors } from './helpers';
import { ROUTES } from './routes';
import { MEMORY_IDS } from '../../src/content/data/memories';

// The whole campaign, New Game to the ending card, played with ordinary
// keyboard input only (no room jumps, no state writes). The bot reads the
// e2e probe to decide which keys to press. Long: run with
//   npx playwright test campaign
const ORDER = ['r01', 'r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08', 'r09', 'r10', 'r11', 'r12'] as const;

test('@campaign full playthrough with normal inputs from New Game to the ending', async ({ page }) => {
  test.setTimeout(90 * 60_000);
  const errors = watchErrors(page);
  const url = `${E2E}?canvas=1`;
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await startNewGame(page, url);
  const bot = new Bot(page);
  const times: string[] = [];
  for (const room of ORDER) {
    const s = await probe(page);
    expect(s.room, `expected to be in ${room}`).toBe(room);
    const t0 = Date.now();
    await ROUTES[room]!(bot);
    const line = `${room}: ${((Date.now() - t0) / 1000).toFixed(0)} s`;
    times.push(line);
    console.log(line);
  }
  await expect(page.locator('.ending .final-line')).toHaveText('Kâğıt üstünde, Gorti’nin içindeki ruhların hiçbiri artık onun değildi.');
  await expect(page.getByRole('button', { name: 'Yeniden oyna' })).toBeVisible({ timeout: 15_000 });
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('kristaller-dunyasi:save') ?? '{}') as { profile?: { endingSeen?: boolean; chaptersReached?: number[]; memories?: string[] } });
  expect(saved.profile?.endingSeen).toBe(true);
  expect(saved.profile?.chaptersReached).toEqual([1, 2, 3, 4, 5]);
  // Every memory lies on the one floor of its room: walking picks them all up.
  expect([...(saved.profile?.memories ?? [])].sort()).toEqual([...MEMORY_IDS].sort());
  await test.info().attach('room-times', { body: times.join('\n'), contentType: 'text/plain' });
  expect(errors).toEqual([]);
});
