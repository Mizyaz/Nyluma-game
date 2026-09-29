import { test } from '@playwright/test';
import { Bot } from './bot';
import { ROUTES } from './routes';

// Developer harness (skipped unless DEV_ROUTE is set): runs one room route
// against the e2e build's room jump (run `npm run build:e2e` first), e.g.
//   DEV_ROUTE=r02 npx playwright test devroute
const room = process.env.DEV_ROUTE;

test.describe('dev route', () => {
  test.skip(!room, 'DEV_ROUTE not set');
  test('run single room route', async ({ page }) => {
    test.setTimeout(600_000);
    const q = new URLSearchParams({ room: room!, canvas: '1' });
    if (process.env.DEV_FLAGS) q.set('flags', process.env.DEV_FLAGS);
    if (process.env.DEV_CP) q.set('cp', process.env.DEV_CP);
    page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
    await page.goto(`http://localhost:4175/?${q.toString()}`);
    await page.waitForFunction(() => {
      const w = window as unknown as { __kd?: { state(): { room: string | null } } };
      return !!w.__kd && !!w.__kd.state().room;
    }, undefined, { timeout: 60_000 });
    const bot = new Bot(page);
    const trace = setInterval(() => {
      void bot
        .s()
        .then((st) => console.log(`TRACE ${JSON.stringify({ room: st.room, ctx: st.context, busy: st.busy, p: st.player && { x: Math.round(st.player.x), y: Math.round(st.player.y), g: st.player.onGround, st: st.player.state, f: st.player.form, h: st.player.halves }, obj: st.objective, prompts: st.prompts, extra: st.extra })}`))
        .catch(() => undefined);
    }, 5000);
    try {
      await Promise.race([
        ROUTES[room!]!(bot),
        new Promise((_, rej) => setTimeout(() => rej(new Error(`route timeout; log:\n${bot.log.slice(-30).join('\n')}`)), 540_000)),
      ]);
    } finally {
      clearInterval(trace);
      await page.screenshot({ path: `/tmp/claude-0/route-${room}.png` });
      const st = await bot.s();
      console.log(JSON.stringify({ room: st.room, p: st.player, obj: st.objective, flags: st.flags.slice(-8) }));
    }
  });
});
