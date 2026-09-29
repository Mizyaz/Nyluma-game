import { expect, test } from '@playwright/test';
import { ROOT, SUBPATH, watchErrors } from './helpers';

// Production build, served exactly as a static host would.
for (const [label, url] of [
  ['domain root', ROOT],
  ['repository sub-path', SUBPATH],
] as const) {
  test(`@smoke boots at the ${label} without missing assets or errors`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(url);
    await expect(page).toHaveTitle(/Kristaller Dünyası/);
    await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 60_000 });
    for (const name of ['Devam Et', 'Bölümler', 'Anılar', 'Ayarlar', 'Katkıda Bulunanlar']) {
      await expect(page.getByRole('button', { name })).toBeVisible();
    }
    // No state probe in the production bundle.
    expect(await page.evaluate(() => 'kd' in window || '__kd' in window)).toBe(false);
    await page.getByRole('button', { name: 'Yeni Oyun' }).click();
    await expect(page.locator('.hud')).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(1500);
    await page.keyboard.down('KeyD');
    await page.waitForTimeout(600);
    await page.keyboard.up('KeyD');
    expect(errors).toEqual([]);
  });
}
