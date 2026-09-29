import { chromium } from '@playwright/test';
const [room, flags = '', cp = '', out, walkMs = '0', form = ''] = process.argv.slice(2);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const q = new URLSearchParams({ room, canvas: '1' });
if (flags) q.set('flags', flags);
if (cp) q.set('cp', cp);
if (form) q.set('form', form);
await page.goto(`http://localhost:4176/?${q}`);
await page.waitForFunction((r) => window.__kd && window.__kd.state().room === r && window.__kd.state().context === 'gameplay', room, { timeout: 90000 });
await page.waitForTimeout(1500);
if (Number(walkMs) > 0) { await page.keyboard.down('KeyD'); await page.waitForTimeout(Number(walkMs)); await page.keyboard.up('KeyD'); await page.waitForTimeout(150); }
await page.screenshot({ path: out });
console.log(errors.join('\n') || 'no errors');
await browser.close();
