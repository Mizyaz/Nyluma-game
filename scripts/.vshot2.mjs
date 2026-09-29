import { chromium } from '@playwright/test';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await page.goto('http://localhost:4176/?room=r01&canvas=1&flags=r01.intro');
await page.waitForFunction(() => window.__kd && window.__kd.state().room === 'r01' && window.__kd.state().context === 'gameplay', undefined, { timeout: 90000 });
await page.waitForTimeout(3500);
const head = async (name) => {
  const p = await page.evaluate(() => window.__kd.state().player);
  // Camera: find the player's screen position via the rig container transform.
  const pos = await page.evaluate(() => { const c = document.querySelector('#game canvas').getBoundingClientRect(); return { w: c.width, h: c.height }; });
  await page.screenshot({ path: `/tmp/claude-0/brow-${name}.png`, clip: { x: 380, y: 300, width: 260, height: 180 } });
  return p;
};
await page.screenshot({ path: '/tmp/claude-0/v2-r01.png' });
console.log('idle', JSON.stringify(await head('idle')));
await page.keyboard.down('Space'); await page.waitForTimeout(160);
console.log('rise', JSON.stringify(await head('rise')));
await page.keyboard.up('Space'); await page.waitForTimeout(500);
await head('land');
await browser.close();
