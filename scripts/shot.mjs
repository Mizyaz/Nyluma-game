// Dev helper: screenshot a URL with the preinstalled Chromium.
// usage: node scripts/shot.mjs <url> <out.png> [width] [height] [waitSelector]
import { chromium } from '@playwright/test';
const [url, out, w = '1400', h = '900', sel = 'body[data-ready]'] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
await page.goto(url);
try { await page.waitForSelector(sel, { timeout: 20000 }); } catch { errors.push('timeout waiting for ' + sel); }
await page.waitForTimeout(300);
const clip = process.env.CLIP ? (([x, y, cw, ch]) => ({ x, y, width: cw, height: ch }))(process.env.CLIP.split(',').map(Number)) : undefined;
await page.screenshot({ path: out, fullPage: !clip, clip });
console.log(errors.join('\n') || 'no errors');
await browser.close();
