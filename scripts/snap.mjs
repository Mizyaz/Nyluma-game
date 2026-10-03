// Dev helper: open a room on a running dev or e2e server, step the game and take screenshots.
// usage: node scripts/snap.mjs '<json>'
// json: { port, url?: query (default "room=r01"), w?, h?, dpr?, touch?: bool, canvas?: bool, log?: bool,
//         noSettle?: bool, steps: [["tp", x], ["z", z], ["wait", ms], ["frames", n], ["shot", path],
//         ["eval", js], ["key", code, ms], ["down", code], ["up", code], ["settle", ms]] }
// It waits until play is free (pressing Space through any scene) unless noSettle is set.
import { chromium } from '@playwright/test';
const cfg = JSON.parse(process.argv[2]);
const port = cfg.port ?? Number(process.env.KD_PORT ?? 5173);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: cfg.w ?? 1280, height: cfg.h ?? 720 }, deviceScaleFactor: cfg.dpr ?? 1, hasTouch: !!cfg.touch, isMobile: !!cfg.touch });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error' && !m.text().includes('AudioContext')) errors.push(m.text());
  if (cfg.log && (m.type() === 'log' || m.type() === 'warning')) console.log('[page]', m.text());
});
const q = (cfg.url ?? 'room=r01') + (cfg.canvas ? '&canvas=1' : '');
const t0 = Date.now();
await page.goto(`http://127.0.0.1:${port}/${cfg.path ?? ''}?${q}`, { timeout: 240000 });
const settle = async (limit = 120000) => {
  const s0 = Date.now();
  let st;
  while (Date.now() - s0 < limit) {
    st = await page.evaluate(() => window.__kd && window.__kd.state());
    if (st && st.room) {
      const p = st.player;
      if (st.context === 'gameplay' && !st.busy && !st.dialogueOpen && p && p.state === 'normal') return st;
      if (st.dialogueOpen || st.context === 'cutscene' || st.context === 'dialogue') await page.keyboard.press('Space');
    }
    await page.waitForTimeout(400);
  }
  return st;
};
if (!cfg.noSettle) {
  await page.waitForFunction(() => !!window.__kd && !!window.__kd.state().room, null, { timeout: 240000 });
  const st = await settle();
  console.log('ready after', Date.now() - t0, 'ms', JSON.stringify({ ctx: st?.context, room: st?.room, x: st?.player && Math.round(st.player.x) }));
}
for (const [op, a, b] of cfg.steps ?? []) {
  if (op === 'tp') await page.evaluate((x) => window.__kd.tp(x), a);
  else if (op === 'z') await page.evaluate((z) => { window.__kd.world().player.z = z; }, a);
  else if (op === 'wait') await page.waitForTimeout(a);
  else if (op === 'frames') {
    const f0 = await page.evaluate(() => window.__kd.game().loop.frame);
    await page.waitForFunction((n) => window.__kd.game().loop.frame >= n, f0 + a, { timeout: 300000, polling: 100 });
  } else if (op === 'shot') { await page.screenshot({ path: a, timeout: 240000 }); console.log('shot', a); }
  else if (op === 'eval') console.log('eval', JSON.stringify(await page.evaluate(a)));
  else if (op === 'key') { await page.keyboard.down(a); await page.waitForTimeout(b ?? 300); await page.keyboard.up(a); }
  else if (op === 'down') await page.keyboard.down(a);
  else if (op === 'up') await page.keyboard.up(a);
  else if (op === 'settle') console.log('settle', JSON.stringify((await settle(a ?? 60000))?.context));
}
console.log(errors.length ? 'ERRORS:\n' + errors.slice(0, 8).join('\n') : 'no errors');
await browser.close();
