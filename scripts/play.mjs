// Dev helper: drive the game with real key presses and take screenshots.
// usage: node scripts/play.mjs <url> <outPrefix> <steps-json>
// steps: [["click","text"],["wait",ms],["down","KeyD"],["up","KeyD"],["press","Space"],["shot","name"],["eval","js"]]
import { chromium } from '@playwright/test';
const [url, prefix, stepsJson] = process.argv.slice(2);
const steps = JSON.parse(stepsJson);
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}\n${e.stack}`));
await page.goto(url);
for (const s of steps) {
  const [op, a, b] = s;
  if (op === 'click') await page.getByRole('button', { name: a }).first().click();
  else if (op === 'wait') await page.waitForTimeout(a);
  else if (op === 'down') await page.keyboard.down(a);
  else if (op === 'up') await page.keyboard.up(a);
  else if (op === 'press') await page.keyboard.press(a, { delay: b ?? 60 });
  else if (op === 'shot') await page.screenshot({ path: `${prefix}-${a}.png` });
  else if (op === 'eval') console.log(JSON.stringify(await page.evaluate(a)));
  else if (op === 'waitsel') await page.waitForSelector(a, { timeout: 30000 });
}
console.log(errors.slice(0, 30).join('\n') || 'no errors');
await browser.close();
