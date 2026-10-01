import { expect, type Page } from '@playwright/test';
import { PORTS } from './ports';

export const ROOT = `http://localhost:${PORTS.root}/`;
export const SUBPATH = `http://localhost:${PORTS.sub}/kristaller-dunyasi/`;
export const E2E = `http://localhost:${PORTS.e2e}/`;

export interface ProbeState {
  scenes: string[];
  context: string;
  room: string | null;
  player: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    onGround: boolean;
    state: string;
    form: string;
    kind: string;
    focus: number;
    facing: number;
    /** Depth: before (+) or behind (−) the actors' plane, world px. */
    z: number;
  } | null;
  paused: boolean;
  busy: boolean;
  flags: string[];
  checkpoint: string | null;
  memories: string[];
  dialogueOpen: boolean;
  docOpen: boolean;
  endingOpen: boolean;
  heldSources: number;
  /** Facts room scripts publish (the horse, the Sun encounter). */
  extra: Record<string, unknown>;
  /** Interaction prompts on screen ("E İncele"). */
  prompts: string[];
  music: { cue: string; source: 'piano' | 'strings' | 'track' | 'none'; track: string | null; bars: number; notes: number };
  /** Colour bombardments since the room started; `active` while one plays. */
  bursts: { count: number; active: boolean } | null;
  /** Which of the Sun and the Moon is out (the amca's kahkaha swaps them). */
  sky: 'sun' | 'moon' | 'none' | null;
  /** Rezonans moves in this room: the next one, effects still running, birds flying. */
  moves: { count: number; last: string | null; ready: boolean; next: string | null; running: string[]; birds: number } | null;
  /** Self-handling things Gorti can inspect (paintings). */
  features: string[];
}

/** Collects anything that would indicate a broken build. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
    if (m.type() === 'warning' && m.text().includes('missing art')) errors.push(`missing art: ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText ?? ''}`));
  page.on('response', (r) => {
    if (r.status() >= 400) errors.push(`http ${r.status()}: ${r.url()}`);
  });
  return errors;
}

export async function probe(page: Page): Promise<ProbeState> {
  return page.evaluate(() => (window as unknown as { __kd: { state(): ProbeState } }).__kd.state());
}

export async function waitState(page: Page, pred: (s: ProbeState) => boolean, timeout = 30_000, label = 'state'): Promise<ProbeState> {
  const start = Date.now();
  let last: ProbeState | null = null;
  while (Date.now() - start < timeout) {
    last = await probe(page).catch(() => null as unknown as ProbeState);
    if (last && pred(last)) return last;
    await page.waitForTimeout(100);
  }
  throw new Error(`Timed out waiting for ${label}: ${JSON.stringify(last)}`);
}

export async function openMenu(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await expect(page.getByRole('button', { name: 'Yeni Oyun' })).toBeVisible({ timeout: 60_000 });
}

export async function startNewGame(page: Page, url = E2E): Promise<void> {
  await openMenu(page, url);
  await page.getByRole('button', { name: 'Yeni Oyun' }).click();
  const confirm = page.getByRole('button', { name: 'Evet' });
  if (await confirm.isVisible().catch(() => false)) await confirm.click();
  await waitState(page, (s) => s.room === 'r01' && !!s.player && s.context === 'gameplay', 60_000, 'room r01');
}

export async function hold(page: Page, key: string, ms: number): Promise<void> {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
}

export async function tap(page: Page, key: string): Promise<void> {
  await page.keyboard.down(key);
  await page.waitForTimeout(70);
  await page.keyboard.up(key);
}

/** Advances any open dialogue until it closes. */
export async function drainDialogue(page: Page, maxPresses = 30): Promise<void> {
  for (let i = 0; i < maxPresses; i++) {
    const s = await probe(page);
    if (!s.dialogueOpen) return;
    await tap(page, 'Space');
    await page.waitForTimeout(160);
  }
}

/** Writes a save directly (fixture) before the game boots. */
export async function seedSave(page: Page, url: string, save: unknown, settings?: unknown): Promise<void> {
  await page.goto(url);
  await page.evaluate(
    ([s, st]) => {
      localStorage.setItem('kristaller-dunyasi:save', JSON.stringify(s));
      if (st) localStorage.setItem('kristaller-dunyasi:settings', JSON.stringify(st));
    },
    [save, settings] as const,
  );
}
