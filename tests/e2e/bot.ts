import type { CDPSession, Page } from '@playwright/test';
import { probe, type ProbeState } from './helpers';

// A normal-input player. In 'keys' mode every action is a real keyboard
// event; in 'touch' mode the same intents become real multi-touch events on
// the on-screen controls and panels (no keyboard at all). The bot only
// *reads* the e2e probe to decide when to press or release.

type Key = 'KeyA' | 'KeyD' | 'Space' | 'KeyE' | 'KeyQ' | 'KeyR' | 'KeyF' | 'Enter' | 'Escape' | 'ArrowLeft' | 'ArrowRight' | 'ArrowDown';
type Control = 'left' | 'right' | 'jump' | 'action' | 'focus' | 'form' | 'song';
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type InputMode = 'keys' | 'touch';

export class Bot {
  private down = new Set<Key>();
  log: string[] = [];
  readonly touch: boolean;
  private cdp: CDPSession | null = null;
  /** Active touch points by the key that holds them. */
  private points = new Map<Key | string, { id: number; x: number; y: number }>();
  private nextTouchId = 1;

  constructor(
    public page: Page,
    mode: InputMode = process.env.BOT_INPUT === 'touch' ? 'touch' : 'keys',
  ) {
    this.touch = mode === 'touch';
  }

  async s(): Promise<ProbeState & { extra: Record<string, unknown>; prompts: string[] }> {
    return (await probe(this.page)) as ProbeState & { extra: Record<string, unknown>; prompts: string[] };
  }

  note(msg: string): void {
    const line = `${new Date().toISOString().slice(11, 19)} ${msg}`;
    this.log.push(line);
    if (process.env.BOT_VERBOSE) console.log(line);
  }

  async keyDown(k: Key): Promise<void> {
    if (this.down.has(k)) return;
    this.down.add(k);
    if (this.touch) await this.touchDown(k);
    else await this.page.keyboard.down(k);
  }

  async keyUp(k: Key): Promise<void> {
    if (!this.down.has(k)) return;
    this.down.delete(k);
    if (this.touch) await this.touchUp(k);
    else await this.page.keyboard.up(k);
  }

  async releaseAll(): Promise<void> {
    for (const k of [...this.down]) await this.keyUp(k);
  }

  async tap(k: Key, ms = 70): Promise<void> {
    await this.keyDown(k);
    await this.page.waitForTimeout(ms);
    await this.keyUp(k);
  }

  // ------------------------------------------------------------ touch driver

  private async session(): Promise<CDPSession> {
    this.cdp ??= await this.page.context().newCDPSession(this.page);
    return this.cdp;
  }

  private toPoint(p: { id: number; x: number; y: number }): { x: number; y: number; id: number; radiusX: number; radiusY: number; force: number } {
    return { x: p.x, y: p.y, id: p.id, radiusX: 6, radiusY: 6, force: 1 };
  }

  // CDP semantics (verified): touchStart with every active finger presses the
  // new one; touchEnd lists exactly the fingers that lift.
  private async pointDown(key: string, x: number, y: number): Promise<void> {
    if (this.points.has(key)) return;
    this.points.set(key, { id: this.nextTouchId++, x, y });
    const cdp = await this.session();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [...this.points.values()].map((p) => this.toPoint(p)) });
  }

  private async pointUp(key: string): Promise<void> {
    const p = this.points.get(key);
    if (!p) return;
    this.points.delete(key);
    const cdp = await this.session();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [this.toPoint(p)] });
  }

  /** A short finger tap on whatever is at (x, y), alongside held points. */
  async touchAt(x: number, y: number, ms = 60): Promise<void> {
    const key = `tap${this.nextTouchId}`;
    await this.pointDown(key, x, y);
    await this.page.waitForTimeout(ms);
    await this.pointUp(key);
  }

  /** Taps the n-th element matching a selector (DOM panels, HUD buttons). */
  async touchSelector(selector: string, index = 0): Promise<boolean> {
    const r = await this.page.evaluate(
      ([sel, i]) => {
        const el = document.querySelectorAll(sel)[i] as HTMLElement | undefined;
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return b.width && b.height ? { x: b.left + b.width / 2, y: b.top + b.height / 2 } : null;
      },
      [selector, index] as const,
    );
    if (!r) return false;
    await this.touchAt(r.x, r.y);
    return true;
  }

  private async controlRect(c: Control): Promise<Rect | null> {
    return this.page.evaluate((name) => {
      const el =
        name === 'left' || name === 'right'
          ? document.querySelectorAll('.tc-pad .half')[name === 'left' ? 0 : 1]
          : document.querySelector(`.tc[data-key="${name}"]`);
      if (!el) return null;
      const b = (el as HTMLElement).getBoundingClientRect();
      return b.width && b.height ? { x: b.left, y: b.top, w: b.width, h: b.height } : null;
    }, c);
  }

  private async touchDown(k: Key): Promise<void> {
    const st = await this.s();
    // Panels and dialogue are touched directly.
    if (st.songOpen && (k === 'ArrowLeft' || k === 'ArrowDown' || k === 'ArrowRight' || k === 'KeyA' || k === 'KeyD')) {
      const idx = k === 'ArrowLeft' || k === 'KeyA' ? 0 : k === 'ArrowDown' ? 1 : 2;
      await this.touchSelector('.song .note-btn', idx);
      return;
    }
    if (st.docOpen && (k === 'KeyE' || k === 'Space' || k === 'Enter')) {
      await this.touchSelector('.doc .close');
      return;
    }
    if (st.dialogueOpen && (k === 'KeyE' || k === 'Space' || k === 'Enter')) {
      await this.touchSelector('.dialogue');
      return;
    }
    if (k === 'Escape') {
      await this.touchSelector('.hud [aria-label="Duraklat"]');
      return;
    }
    const control: Control | null =
      k === 'KeyA' || k === 'ArrowLeft'
        ? 'left'
        : k === 'KeyD' || k === 'ArrowRight'
          ? 'right'
          : k === 'Space'
            ? 'jump'
            : k === 'KeyE' || k === 'Enter'
              ? 'action'
              : k === 'KeyQ'
                ? 'focus'
                : k === 'KeyR'
                  ? 'form'
                  : k === 'KeyF'
                    ? 'song'
                    : null;
    if (!control) return;
    const r = await this.controlRect(control);
    if (!r) {
      this.note(`touch: control ${control} not visible`);
      return;
    }
    await this.pointDown(k, r.x + r.w / 2, r.y + r.h / 2);
  }

  private async touchUp(k: Key): Promise<void> {
    await this.pointUp(k);
  }

  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /** Advances dialogues and skips cutscenes until the player has control. */
  async settle(timeout = 90_000): Promise<ProbeState> {
    const start = Date.now();
    let st = await this.s();
    while (Date.now() - start < timeout) {
      st = await this.s();
      if (st.context === 'gameplay' && !st.busy && !st.dialogueOpen && st.player && (st.player.state === 'normal' || st.player.state === 'hidden')) return st;
      if (st.dialogueOpen) {
        await this.tap('Space', 60);
        await this.wait(140);
      } else if (st.busy && (st.context === 'cutscene')) {
        await this.keyDown('Enter');
        await this.wait(1000);
        await this.keyUp('Enter');
        await this.wait(150);
      } else await this.wait(120);
    }
    throw new Error(`settle timed out: ${JSON.stringify(st)}`);
  }

  async waitFor(pred: (s: ProbeState & { extra: Record<string, unknown>; prompts: string[] }) => boolean, timeout = 30_000, label = 'condition'): Promise<ProbeState & { extra: Record<string, unknown>; prompts: string[] }> {
    const start = Date.now();
    let st = await this.s();
    while (Date.now() - start < timeout) {
      st = await this.s();
      if (pred(st)) return st;
      if (st.dialogueOpen) await this.tap('Space', 60);
      await this.wait(80);
    }
    throw new Error(`waitFor ${label} timed out: ${JSON.stringify({ room: st.room, p: st.player, ctx: st.context, busy: st.busy, obj: st.objective })}`);
  }

  /** Closed-loop walk to x. */
  async walkTo(x: number, tol = 8, timeout = 40_000): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const st = await this.s();
      const p = st.player!;
      if (st.dialogueOpen) {
        await this.releaseAll();
        await this.tap('Space', 60);
        continue;
      }
      if (st.busy || st.context !== 'gameplay') {
        await this.releaseAll();
        await this.settle();
        continue;
      }
      const dx = x - p.x;
      const brake = Math.min(28, (p.vx * p.vx) / (2 * 2000) + 4);
      if (Math.abs(dx) <= tol) {
        await this.keyUp('KeyD');
        await this.keyUp('KeyA');
        if (Math.abs(p.vx) < 20) return;
      } else if (Math.abs(dx) <= brake && Math.abs(p.vx) < 20) {
        // Standing just short of the target: nudge with a short press.
        await this.tap(dx > 0 ? 'KeyD' : 'KeyA', 30);
        await this.wait(60);
        continue;
      } else if (dx > 0) {
        await this.keyUp('KeyA');
        if (dx > brake) await this.keyDown('KeyD');
        else await this.keyUp('KeyD');
      } else {
        await this.keyUp('KeyD');
        if (-dx > brake) await this.keyDown('KeyA');
        else await this.keyUp('KeyA');
      }
      await this.wait(25);
    }
    await this.releaseAll();
    throw new Error(`walkTo ${x} timed out at ${JSON.stringify((await this.s()).player)}`);
  }

  /** Turns to face a direction without moving far. */
  async face(dir: 1 | -1): Promise<void> {
    const st = await this.s();
    if (st.player?.facing === dir) return;
    await this.tap(dir > 0 ? 'KeyD' : 'KeyA', 40);
    await this.wait(120);
  }

  /** Jumps and steers in the air toward targetX until landing. */
  async jumpTo(targetX: number, opts: { hold?: number; timeout?: number; tol?: number } = {}): Promise<ProbeState> {
    const hold = opts.hold ?? 320;
    const tol = opts.tol ?? 6;
    const t0 = Date.now();
    await this.keyDown('Space');
    let released = false;
    let st = await this.s();
    const y0 = st.player!.y;
    let left = false;
    while (Date.now() - t0 < (opts.timeout ?? 4000)) {
      st = await this.s();
      const p = st.player!;
      if (!released && Date.now() - t0 > hold) {
        await this.keyUp('Space');
        released = true;
      }
      if (!p.onGround || Math.abs(p.y - y0) > 2) left = true;
      const dx = targetX - p.x;
      if (dx > tol) {
        await this.keyUp('KeyA');
        await this.keyDown('KeyD');
      } else if (dx < -tol) {
        await this.keyUp('KeyD');
        await this.keyDown('KeyA');
      } else {
        await this.keyUp('KeyA');
        await this.keyUp('KeyD');
      }
      if (left && p.onGround && Date.now() - t0 > 200) break;
      await this.wait(20);
    }
    await this.keyUp('Space');
    await this.keyUp('KeyA');
    await this.keyUp('KeyD');
    await this.wait(60);
    return this.s();
  }

  /** Waits until a prompt with the label is shown, then presses E. */
  async act(label: string, timeout = 8000): Promise<void> {
    await this.waitFor((s) => s.prompts.some((p) => p.includes(label)), timeout, `prompt "${label}"`);
    await this.tap('KeyE');
    await this.wait(120);
  }

  async reach(): Promise<void> {
    const before = await this.s();
    await this.act('Köke uzan');
    await this.waitFor((s) => s.player!.state === 'normal' && s.player!.onGround && Math.hypot(s.player!.x - before.player!.x, s.player!.y - before.player!.y) > 40, 6000, 'reach landing');
  }

  async sing(pattern: ('low' | 'mid' | 'high')[]): Promise<void> {
    await this.waitFor((s) => s.prompts.some((p) => p.includes('Şarkı')), 8000, 'song prompt');
    await this.tap('KeyF');
    await this.waitFor((s) => s.songOpen, 5000, 'song panel');
    await this.wait(400 + pattern.length * 720 + 300);
    for (const n of pattern) {
      await this.tap(n === 'low' ? 'ArrowLeft' : n === 'mid' ? 'ArrowDown' : 'ArrowRight', 60);
      await this.wait(260);
    }
    await this.waitFor((s) => !s.songOpen, 6000, 'song closed');
  }

  async holdFocus(ms: number): Promise<void> {
    await this.keyDown('KeyQ');
    await this.wait(ms);
    await this.keyUp('KeyQ');
  }

  async untilRoom(room: string, timeout = 60_000): Promise<void> {
    await this.releaseAll();
    await this.waitFor((s) => s.room === room && s.context !== 'none', timeout, `room ${room}`);
    await this.wait(700);
  }
}
