import { chromium } from '@playwright/test';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:4176/?room=r03&flags=r03.intro,r03.pulseTut');
// The room jump starts the crystal tunnel right after the menu appears.
await page.waitForFunction(() => window.__kd && window.__kd.state().scenes.includes('warp'), undefined, { timeout: 120000 });
for (let i = 0; i < 4; i++) { await page.screenshot({ path: `/tmp/claude-0/warp-${i}.png` }); await page.waitForTimeout(250); }
await page.waitForFunction(() => window.__kd && window.__kd.state().room === 'r03' && window.__kd.state().context === 'gameplay', undefined, { timeout: 120000 });
await page.waitForTimeout(1200);
await page.keyboard.down('KeyD'); await page.waitForTimeout(700);
await page.screenshot({ path: '/tmp/claude-0/web-r03.png' });
await page.keyboard.up('KeyD');
console.log(errors.join('\n') || 'no errors');
await browser.close();
