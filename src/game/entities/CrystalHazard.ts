import * as Phaser from 'phaser';
import { app } from '../App';
import { DEPTH } from '../constants';
import { hex, P } from '../art/palette';
import { frameRef } from '../art/TextureFactory';
import type { Gate, HazardDef } from '../data/roomTypes';

// Three light hazard archetypes, each with readable anticipation, active and
// recovery states: stationary crystal thorns, floating memory wisps and timed
// root lashes. Unstable thorns and wisps disperse under a resonance pulse.

export interface HitInfo {
  fromX: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function overlap(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function img(scene: Phaser.Scene, key: string, x: number, y: number, depth: number): Phaser.GameObjects.Image {
  const f = frameRef(key);
  return scene.add.image(x, y, f.atlas, f.frame).setOrigin(f.px / f.w, f.py / f.h).setScale(1 / f.scale).setDepth(depth);
}

abstract class HazardRt {
  active = true;
  gated = true;
  constructor(readonly def: HazardDef) {}
  abstract fixed(dt: number, player: Box, scale: number): HitInfo | null;
  abstract visual(dtMs: number, time: number): void;
  abstract setShown(on: boolean): void;
  dispersible(): boolean {
    return false;
  }
  center(): { x: number; y: number } {
    return { x: this.def.x, y: this.def.y - 20 };
  }
  disperse(): void {}
  reset(): void {}
}

class Thorns extends HazardRt {
  private imgs: Phaser.GameObjects.Image[] = [];
  private extend = 0.6;
  private recover = 0;
  private gone = false;
  constructor(private scene: Phaser.Scene, readonly d: Extract<HazardDef, { kind: 'thorns' }>) {
    super(d);
    const n = Math.max(1, Math.round(d.w / 38));
    const key = d.unstable ? 'hz.thorns.unstable' : 'hz.thorns';
    for (let i = 0; i < n; i++) {
      const x = d.x - d.w / 2 + (d.w / n) * (i + 0.5);
      const im = img(scene, key, x, d.y + 3, DEPTH.props + 2);
      im.setFlipX(i % 2 === 1);
      this.imgs.push(im);
    }
  }
  box(): Box {
    return { x: this.d.x - this.d.w / 2 + 4, y: this.d.y - 24, w: this.d.w - 8, h: 24 };
  }
  fixed(dt: number, p: Box): HitInfo | null {
    if (!this.active || this.gone) return null;
    const near = Math.abs(p.x + p.w / 2 - this.d.x) < this.d.w / 2 + 140;
    // Anticipation: thorns bristle as Gorti approaches; recovery after a hit.
    if (this.recover > 0) {
      this.recover -= dt;
      this.extend = Math.max(0.55, this.extend - dt * 3);
    } else this.extend = Phaser.Math.Clamp(this.extend + (near ? dt * 2.5 : -dt), 0.6, 1);
    if (overlap(p, this.box())) {
      this.recover = 0.8;
      return { fromX: this.d.x };
    }
    return null;
  }
  visual(_dt: number, time: number): void {
    this.imgs.forEach((im, i) => {
      const f = frameRef(this.d.unstable ? 'hz.thorns.unstable' : 'hz.thorns');
      im.setScale((1 / f.scale) * (0.92 + 0.08 * Math.sin(time / 400 + i)), (1 / f.scale) * this.extend);
      if (this.d.unstable) im.setAlpha(0.85 + 0.15 * Math.sin(time / 180 + i));
    });
  }
  setShown(on: boolean): void {
    for (const im of this.imgs) im.setVisible(on && !this.gone);
  }
  override dispersible(): boolean {
    return !!this.d.unstable && !this.gone && this.active;
  }
  override disperse(): void {
    if (this.gone) return;
    this.gone = true;
    app.audio.sfx('shard', { pitch: 1.2 });
    for (const im of this.imgs) {
      this.scene.tweens.add({ targets: im, alpha: 0, scaleY: 0, y: im.y + 6, duration: 420, onComplete: () => im.setVisible(false) });
    }
    (this.scene as unknown as { burst?: (x: number, y: number, c: number, n: number) => void }).burst?.(this.d.x, this.d.y - 16, hex(P.vein), 14);
  }
  override reset(): void {
    if (!this.gone) return;
    this.gone = false;
    const f = frameRef(this.d.unstable ? 'hz.thorns.unstable' : 'hz.thorns');
    for (const im of this.imgs) im.setVisible(this.active).setAlpha(1).setScale(1 / f.scale).setY(this.d.y + 3);
  }
}

type WispState = 'drift' | 'windup' | 'dash' | 'recover' | 'gone';

class Wisp extends HazardRt {
  private im: Phaser.GameObjects.Image;
  private glowIm: Phaser.GameObjects.Image;
  private x: number;
  private y: number;
  private t = Math.random() * 10;
  private st: WispState = 'drift';
  private stT = 0;
  private vx = 0;
  private vy = 0;
  constructor(private scene: Phaser.Scene, readonly d: Extract<HazardDef, { kind: 'wisp' }>) {
    super(d);
    this.x = d.x;
    this.y = d.y;
    this.im = img(scene, 'hz.wisp', d.x, d.y, DEPTH.actors);
    const g = frameRef('fx.glow');
    this.glowIm = scene.add.image(d.x, d.y, g.atlas, g.frame).setBlendMode(Phaser.BlendModes.ADD).setTint(hex(P.vein)).setAlpha(0.35).setScale(0.9).setDepth(DEPTH.actors - 1);
  }
  box(): Box {
    return { x: this.x - 16, y: this.y - 18, w: 32, h: 36 };
  }
  override center(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
  fixed(dt: number, p: Box, scale: number): HitInfo | null {
    if (!this.active) return null;
    this.t += dt;
    this.stT += dt;
    const px = p.x + p.w / 2;
    const py = p.y + p.h / 2;
    const dx = this.d.dx ?? 120;
    const dy = this.d.dy ?? 20;
    switch (this.st) {
      case 'drift': {
        const tx = this.d.x + Math.sin(this.t * 0.6 * scale) * dx;
        const ty = this.d.y + Math.sin(this.t * 1.1 * scale) * dy;
        this.x += (tx - this.x) * Math.min(1, dt * 2);
        this.y += (ty - this.y) * Math.min(1, dt * 2);
        if (Math.hypot(px - this.x, py - this.y) < 230 && this.stT > 1.2) {
          this.st = 'windup';
          this.stT = 0;
          app.audio.sfx('wisp');
        }
        break;
      }
      case 'windup': {
        if (this.stT > 0.75 / scale) {
          const a = Math.atan2(py - this.y, px - this.x);
          this.vx = Math.cos(a) * 190 * scale;
          this.vy = Math.sin(a) * 190 * scale;
          this.st = 'dash';
          this.stT = 0;
        }
        break;
      }
      case 'dash': {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        if (this.stT > 0.9 || Math.hypot(this.x - this.d.x, this.y - this.d.y) > 320) {
          this.st = 'recover';
          this.stT = 0;
        }
        break;
      }
      case 'recover': {
        this.x += (this.d.x - this.x) * Math.min(1, dt * 0.9);
        this.y += (this.d.y - this.y) * Math.min(1, dt * 0.9);
        if (this.stT > 1.3 / scale) {
          this.st = 'drift';
          this.stT = 0;
        }
        break;
      }
      case 'gone': {
        if (this.stT > 6) {
          this.st = 'drift';
          this.stT = 0;
          this.x = this.d.x;
          this.y = this.d.y;
          this.im.setVisible(true).setAlpha(0);
          this.scene.tweens.add({ targets: this.im, alpha: 1, duration: 800 });
        }
        return null;
      }
    }
    if (this.st !== 'recover' && overlap(p, this.box())) {
      this.st = 'recover';
      this.stT = 0;
      return { fromX: this.x };
    }
    return null;
  }
  visual(_dt: number, time: number): void {
    const bob = Math.sin(time / 300) * 3;
    let s = 1;
    let a = 0.9;
    if (this.st === 'windup') {
      s = 1 + 0.25 * Math.min(1, this.stT / 0.7);
      this.im.x = this.x + Math.sin(time / 25) * 2;
    } else this.im.x = this.x;
    if (this.st === 'recover') a = 0.45;
    this.im.y = this.y + bob;
    const f = frameRef('hz.wisp');
    this.im.setScale((s * 1) / f.scale);
    if (this.st !== 'gone') this.im.setAlpha(a);
    this.glowIm.setPosition(this.im.x, this.im.y).setAlpha(this.st === 'gone' ? 0 : this.st === 'windup' ? 0.6 : 0.3).setScale(0.8 * s);
  }
  setShown(on: boolean): void {
    this.im.setVisible(on && this.st !== 'gone');
    this.glowIm.setVisible(on);
  }
  override dispersible(): boolean {
    return this.active && this.st !== 'gone';
  }
  override disperse(): void {
    this.st = 'gone';
    this.stT = 0;
    app.audio.sfx('crystal', { pitch: 1.4 });
    this.scene.tweens.add({ targets: this.im, alpha: 0, duration: 350, onComplete: () => this.im.setVisible(false) });
    (this.scene as unknown as { burst?: (x: number, y: number, c: number, n: number) => void }).burst?.(this.x, this.y, hex(P.vein), 16);
  }
  override reset(): void {
    this.st = 'drift';
    this.stT = 0;
    this.x = this.d.x;
    this.y = this.d.y;
    this.im.setVisible(this.active).setAlpha(0.9);
  }
}

type LashPhase = 'idle' | 'warn' | 'strike' | 'recover';

class Lash extends HazardRt {
  private crack: Phaser.GameObjects.Image;
  private root: Phaser.GameObjects.Image;
  private phase: LashPhase = 'idle';
  private clock: number;
  constructor(private scene: Phaser.Scene, readonly d: Extract<HazardDef, { kind: 'lash' }>) {
    super(d);
    this.clock = d.offset;
    this.crack = img(scene, 'hz.crack', d.x, d.y + 2, DEPTH.props + 1).setAlpha(0.15);
    this.root = img(scene, 'hz.lash', d.x, d.y + 6, DEPTH.props + 3).setVisible(false);
  }
  fixed(dt: number, p: Box, scale: number): HitInfo | null {
    if (!this.active) return null;
    const period = this.d.period / scale;
    const warn = 0.95 / scale;
    const strike = 0.38;
    const rec = 0.5;
    this.clock = (this.clock + dt) % period;
    const t = this.clock;
    const idleEnd = period - warn - strike - rec;
    let ph: LashPhase;
    if (t < idleEnd) ph = 'idle';
    else if (t < idleEnd + warn) ph = 'warn';
    else if (t < idleEnd + warn + strike) ph = 'strike';
    else ph = 'recover';
    if (ph !== this.phase) {
      if (ph === 'warn' && this.near(p)) app.audio.sfx('lashWarn');
      if (ph === 'strike' && this.near(p)) {
        app.audio.sfx('lash');
        (this.scene as unknown as { shake?: (i: number, ms: number) => void }).shake?.(0.004, 120);
      }
      this.phase = ph;
    }
    if (ph === 'strike') {
      const box = { x: this.d.x - 22, y: this.d.y - 150, w: 44, h: 150 };
      if (overlap(p, box)) return { fromX: this.d.x };
    }
    return null;
  }
  private near(p: Box): boolean {
    return Math.abs(p.x - this.d.x) < 900;
  }
  visual(): void {
    const f = frameRef('hz.lash');
    const base = 1 / f.scale;
    switch (this.phase) {
      case 'idle':
        this.crack.setAlpha(0.15);
        this.root.setVisible(false);
        break;
      case 'warn':
        this.crack.setAlpha(0.55 + 0.45 * Math.abs(Math.sin(this.clock * 9)));
        this.root.setVisible(true).setScale(base, base * 0.12);
        break;
      case 'strike':
        this.crack.setAlpha(1);
        this.root.setVisible(true).setScale(base, base);
        break;
      case 'recover':
        this.crack.setAlpha(0.3);
        this.root.setVisible(true).setScale(base, base * 0.4);
        break;
    }
  }
  setShown(on: boolean): void {
    this.crack.setVisible(on);
    if (!on) this.root.setVisible(false);
  }
}

export class Hazards {
  list: HazardRt[] = [];
  constructor(scene: Phaser.Scene, defs: readonly HazardDef[], private isOn: (g: Gate) => boolean) {
    for (const d of defs) {
      if (d.kind === 'thorns') this.list.push(new Thorns(scene, d));
      else if (d.kind === 'wisp') this.list.push(new Wisp(scene, d));
      else this.list.push(new Lash(scene, d));
    }
    this.refresh();
  }

  refresh(): void {
    for (const h of this.list) {
      h.active = this.isOn(h.def);
      h.setShown(h.active);
    }
  }

  fixed(dt: number, player: Box, scale: number): HitInfo | null {
    let hit: HitInfo | null = null;
    for (const h of this.list) {
      const r = h.fixed(dt, player, scale);
      if (r && !hit) hit = r;
    }
    return hit;
  }

  visual(dtMs: number, time: number): void {
    for (const h of this.list) if (h.active) h.visual(dtMs, time);
  }

  /** Disperses unstable growths within radius. Returns how many. */
  pulse(x: number, y: number, radius: number): number {
    let n = 0;
    for (const h of this.list) {
      if (!h.dispersible()) continue;
      const c = h.center();
      if (Math.hypot(c.x - x, c.y - y) <= radius + (h.def.kind === 'thorns' ? h.def.w / 2 : 0)) {
        h.disperse();
        n++;
      }
    }
    return n;
  }

  anyDispersibleNear(x: number, y: number, r: number): boolean {
    return this.list.some((h) => {
      if (!h.dispersible()) return false;
      const c = h.center();
      return Math.hypot(c.x - x, c.y - y) <= r;
    });
  }

  resetAll(): void {
    for (const h of this.list) h.reset();
  }
}
