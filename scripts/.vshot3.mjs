import { chromium } from '@playwright/test';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
await page.goto('http://localhost:4176/?room=r04&canvas=1&flags=r04.focusTut&cp=r04_start');
await page.waitForFunction(() => window.__kd && window.__kd.state().room === 'r04' && window.__kd.state().context === 'gameplay', undefined, { timeout: 90000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/claude-0/v3-full.png' });
// crop around the player's head: the camera centres near the player
const crop = async (name) => page.screenshot({ path: `/tmp/claude-0/b3-${name}.png`, clip: { x: 520, y: 180, width: 300, height: 220 } });
await crop('idle');
await page.keyboard.down('Space'); await page.waitForTimeout(140); await crop('rise'); await page.keyboard.up('Space');
await page.waitForTimeout(700);
await page.keyboard.down('KeyQ'); await page.waitForTimeout(600); await crop('breath'); await page.keyboard.up('KeyQ');
await browser.close();
