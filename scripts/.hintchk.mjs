import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('http://localhost:4176/?room=r03&canvas=1&flags=r03.intro,r03.pulseTut');
await page.waitForFunction(() => window.__kd && window.__kd.state().room === 'r03' && window.__kd.state().context === 'gameplay', undefined, { timeout: 120000 });
for (let i = 0; i < 3; i++) {
  await page.waitForTimeout(2000);
  console.log(await page.evaluate(() => { const b = document.querySelector('.hint-btn'); return JSON.stringify({ hidden: b?.classList.contains('hidden'), t: performance.now() | 0 }); }));
}
await browser.close();
