import { h } from './dom';
import { ACROSS, ALONG, PERSPECTIVE, across, bend, flat, hoverCurl, liftCurl, litAt, parts, shadowDrift, turnCurl, type Bent, type Curl, type Lit, type Sheet } from './pageCurl';

// A page of the storybook turning over, in real 3D: the frame just shown is
// the page. Picked up by its free edge, its foot first, it leaves the book
// over a tight roll and stands up toward the viewer, and is turned over and
// away past the spine (pageCurl.ts). It is drawn on one canvas every frame:
// the page still lying, then the paper beyond the fold in thin bands from
// the fold out, each in its own perspective and light and each laid a
// little over the last, so the paper shows no seam. The print bends into the
// roll; the back is a warmer, darker paper with the print showing faintly
// through, mirrored; the roll is lit from the upper right, dark in its
// crease and hatched in its shade; and the lifted paper throws a soft
// shadow on whatever lies beneath it.

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
const r2 = (n: number): string => (Math.round(n * 100) / 100).toString();

/**
 * Plays the transition's animations. Normally they run on the document's
 * timeline; with `window.__kdManualClock` set (the frame-by-frame harness)
 * they are paused and follow `tick` instead, so stepped frames show them
 * exactly where the game is.
 */
export class Clock {
  readonly manual: boolean;
  private now = 0;
  private list: { a: Animation; at: number }[] = [];
  private timers: { at: number; fn: () => void }[] = [];
  private frames: ((t: number) => void)[] = [];

  constructor() {
    this.manual = !!(window as unknown as { __kdManualClock?: boolean }).__kdManualClock;
  }

  /** Seconds since the transition began (the controller's time). */
  get t(): number {
    return this.now;
  }

  play(el: Element, frames: Keyframe[], o: { duration: number; delay?: number; iterations?: number; easing?: string; fill?: FillMode }): Animation {
    const a = el.animate(frames, { duration: Math.max(1, o.duration), delay: o.delay ?? 0, iterations: o.iterations ?? 1, easing: o.easing ?? 'linear', fill: o.fill ?? 'both' });
    this.list.push({ a, at: this.now });
    if (this.manual) {
      a.pause();
      a.currentTime = 0;
    }
    return a;
  }

  /** Calls `fn` once the controller's time has gone `s` seconds on from now. */
  after(s: number, fn: () => void): void {
    this.timers.push({ at: this.now + s, fn });
  }

  /** Calls `fn` with the controller's time on every tick from now on; the call returned stops it. */
  each(fn: (t: number) => void): () => void {
    this.frames.push(fn);
    return () => {
      this.frames = this.frames.filter((f) => f !== fn);
    };
  }

  tick(t: number): void {
    this.now = t;
    if (this.timers.length) {
      const due = this.timers.filter((e) => e.at <= t);
      if (due.length) {
        this.timers = this.timers.filter((e) => e.at > t);
        for (const e of due) e.fn();
      }
    }
    for (const f of this.frames.slice()) f(t);
    if (!this.manual) return;
    for (const e of this.list) {
      if (e.a.playState === 'idle') continue;
      e.a.currentTime = Math.max(0, (t - e.at) * 1000);
    }
  }

  /** Where an animation is in its own time (ms). */
  timeOf(a: Animation | null): number {
    if (!a) return 0;
    const c = a.currentTime;
    return typeof c === 'number' ? c : 0;
  }

  forget(a: Animation): void {
    a.cancel();
    this.list = this.list.filter((e) => e.a !== a);
  }

  clear(): void {
    for (const e of this.list) e.a.cancel();
    this.list = [];
    this.timers = [];
    this.frames = [];
  }
}

/** A rectangle in the transition layer (CSS px). */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** One breath of the held curl (s). */
const HOVER_S = (2 * Math.PI) / 5.2;
/** The paper: its back (warmer and darker than the print's white), a blank page, its cut edge, and its outline in its own darker tone. */
const PAPER = { back: '#dfc8a1', plain: '#f6eedd', edge: 'rgba(255, 250, 238, 0.95)', line: 'rgba(132, 106, 76, 0.85)' } as const;
/** The game's plum shadow tone, and the pale of paper turned to the light (rgb). */
const SHADOW = '58, 42, 74';
const PALE = '255, 249, 236';
/** The paper is drawn in bands turning at most this many radians… */
const ARC_STEP = 0.12;
/** …and rising at most about this many px each (perspective changes along it). */
const RISE_STEP = 9;
/** How far each band reaches back over the last (CSS px on screen), so no seam shows. */
const OVERLAP = 1.6;

type P2 = [number, number];
/** An affine map, as a canvas transform: x' = a·x + c·y + e, y' = b·x + d·y + f. */
type Mat = [number, number, number, number, number, number];

/** A band of the paper beyond the fold. */
interface Band {
  /** Its ends, along the paper from the fold (px). */
  d0: number;
  d1: number;
  b0: Bent;
  b1: Bent;
  /** Its print toward the viewer (else its back). */
  front: boolean;
  /** Its height at its middle (px). */
  z: number;
  /** The page's frame → the page's frame as seen (in perspective). */
  m: Mat;
  /** Its outline in the page's frame, reaching back a little over the last band (for its paper)… */
  poly: P2[];
  /** …and exactly (for its light and shade). */
  exact: P2[];
}

/** The part of the page between two lines across it (`lo` ≤ s ≤ `hi`, s along ACROSS), as a polygon. */
function bandOf(sh: Sheet, lo: number, hi: number): P2[] {
  let poly: P2[] = [
    [0, 0],
    [sh.w, 0],
    [sh.w, sh.h],
    [0, sh.h],
  ];
  if (lo > -Infinity) poly = clipHalf(poly, lo, 1);
  if (hi < Infinity && poly.length) poly = clipHalf(poly, hi, -1);
  return poly;
}

/** Keeps the side of a polygon where sign·(s − v) ≥ 0. */
function clipHalf(poly: P2[], v: number, sign: 1 | -1): P2[] {
  const out: P2[] = [];
  const val = (p: P2): number => sign * (p[0] * ACROSS.x + p[1] * ACROSS.y - v);
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i]!;
    const b = poly[(i + 1) % poly.length]!;
    const va = val(a);
    const vb = val(b);
    if (va >= 0) out.push(a);
    if (va >= 0 !== vb >= 0) {
      const t = va / (va - vb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out.length >= 3 ? out : [];
}

const apply = (m: Mat, p: P2): P2 => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
const compose = (a: Mat, b: Mat): Mat => [
  a[0] * b[0] + a[2] * b[1],
  a[1] * b[0] + a[3] * b[1],
  a[0] * b[2] + a[2] * b[3],
  a[1] * b[2] + a[3] * b[3],
  a[0] * b[4] + a[2] * b[5] + a[4],
  a[1] * b[4] + a[3] * b[5] + a[5],
];

/** Paper's grain: a small tile of soft flecks, laid over the paper's back. */
let grainTile: HTMLCanvasElement | null = null;
function grain(): HTMLCanvasElement {
  if (grainTile) return grainTile;
  const c = document.createElement('canvas');
  c.width = c.height = 96;
  const g = c.getContext('2d');
  if (g) {
    let seed = 7;
    const rnd = (): number => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < 900; i++) {
      const dark = rnd() < 0.55;
      g.fillStyle = dark ? `rgba(120, 96, 70, ${(0.05 + rnd() * 0.08).toFixed(3)})` : `rgba(255, 252, 244, ${(0.12 + rnd() * 0.2).toFixed(3)})`;
      g.fillRect(rnd() * 96, rnd() * 96, 0.6 + rnd() * 1.6, 0.5 + rnd() * 0.8);
    }
  }
  grainTile = c;
  return c;
}

/** Light hatching for the paper's shade, in its shadow tone (lines about 59° and 5px apart, as everywhere in the game). */
let hatchTile: HTMLCanvasElement | null = null;
function hatch(): HTMLCanvasElement {
  if (hatchTile) return hatchTile;
  const c = document.createElement('canvas');
  c.width = 6;
  c.height = 10;
  const g = c.getContext('2d');
  if (g) {
    g.strokeStyle = `rgba(${SHADOW}, 0.9)`;
    g.lineWidth = 0.9;
    // From corner to corner, so the lines run on from tile to tile.
    for (const dx of [-6, 0, 6]) {
      g.beginPath();
      g.moveTo(dx, 10);
      g.lineTo(dx + 6, 0);
      g.stroke();
    }
  }
  hatchTile = c;
  return c;
}

type Phase = { kind: 'still' } | { kind: 'lift'; at: number; dur: number } | { kind: 'turn'; at: number; dur: number; from: Curl };

export class Leaf {
  readonly el: HTMLCanvasElement;
  private readonly g: CanvasRenderingContext2D | null;
  private readonly sheet: Sheet;
  private readonly dpr: number;
  /** The page's frame → the layer (CSS px). */
  private readonly toLayer: Mat;
  /** The eye: over the page's middle, PERSPECTIVE widths away. */
  private readonly eye: { s: number; t: number; d: number };
  private readonly print: CanvasPattern | null;
  private readonly ghost: CanvasPattern | null;
  private readonly grain: CanvasPattern | null;
  private readonly hatch: CanvasPattern | null;
  /** A picture that cannot be laid on as a pattern (old browsers): it is shown lying as it is. */
  private fallback: HTMLCanvasElement | null = null;
  private phase: Phase = { kind: 'still' };
  private stop: (() => void) | null = null;
  private live: Animation[] = [];

  /**
   * A page over `rect` printed with `source` (null: plain paper); `dir`: the
   * way its free edge points (1: right, the page turns over to the left).
   * `still`: it will only fade.
   */
  constructor(
    private readonly clock: Clock,
    parent: HTMLElement,
    readonly rect: Rect,
    source: HTMLCanvasElement | null,
    readonly dir: 1 | -1,
    still = false,
  ) {
    this.sheet = { w: Math.max(1, rect.w), h: Math.max(1, rect.h) };
    const box = parent.getBoundingClientRect();
    const lw = Math.max(1, Math.round(box.width || rect.x + rect.w));
    const lh = Math.max(1, Math.round(box.height || rect.y + rect.h));
    this.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    this.el = h('canvas', { class: 'pt-leaf' });
    this.el.width = Math.round(lw * this.dpr);
    this.el.height = Math.round(lh * this.dpr);
    this.el.style.cssText = `width:${lw}px;height:${lh}px`;
    this.g = this.el.getContext('2d');
    const { w, h: ht } = this.sheet;
    this.toLayer = [dir, 0, 0, 1, rect.x + (dir > 0 ? 0 : w), rect.y];
    const mid: P2 = [w / 2, ht / 2];
    this.eye = { s: mid[0] * ACROSS.x + mid[1] * ACROSS.y, t: mid[0] * ALONG.x + mid[1] * ALONG.y, d: w * PERSPECTIVE };
    const g = this.g;
    // The print, laid on the page's frame (mirrored with it when the page turns the other way).
    const fit = (p: CanvasPattern | null, cw: number, chh: number): CanvasPattern | null => {
      if (!p) return null;
      if (typeof p.setTransform !== 'function') return null;
      p.setTransform(new DOMMatrix(dir > 0 ? [w / cw, 0, 0, ht / chh, 0, 0] : [-w / cw, 0, 0, ht / chh, w, 0]));
      return p;
    };
    this.print = g && source ? fit(g.createPattern(source, 'no-repeat'), source.width, source.height) : null;
    const ghost = source ? shrink(source, 0.25) : null;
    this.ghost = g && ghost ? fit(g.createPattern(ghost, 'no-repeat'), ghost.width, ghost.height) : null;
    this.grain = g ? g.createPattern(grain(), 'repeat') : null;
    this.hatch = g ? g.createPattern(hatch(), 'repeat') : null;
    // A picture that cannot be laid on as a pattern is shown as it is.
    if (source && !this.print && g) this.fallback = source;
    parent.append(this.el);
    this.render(flat(this.sheet));
    if (!still) this.stop = clock.each((t) => this.render(this.curlAt(t)));
  }

  /** The pose at the controller's time `t`. */
  private curlAt(t: number): Curl {
    const p = this.phase;
    if (p.kind === 'lift') {
      const held = t - p.at - p.dur;
      return held < 0 ? liftCurl((t - p.at) / p.dur, this.sheet) : hoverCurl(held % HOVER_S, this.sheet);
    }
    if (p.kind === 'turn') return turnCurl((t - p.at) / p.dur, this.sheet, p.from);
    return flat(this.sheet);
  }

  /** The free edge is picked up and curls over; then it is held, breathing, until `turn`. */
  lift(ms: number): void {
    this.phase = { kind: 'lift', at: this.clock.t, dur: Math.max(0.001, ms / 1000) };
  }

  /** Turns the page over and away. */
  turn(ms: number): void {
    const from = this.curlAt(this.clock.t);
    this.phase = { kind: 'turn', at: this.clock.t, dur: Math.max(0.001, ms / 1000), from };
  }

  /** Reduced motion: the page only fades away. */
  fade(ms: number, delay = 0): void {
    this.live.push(this.clock.play(this.el, [{ opacity: 1 }, { opacity: 0 }], { duration: ms, delay, easing: 'ease-in-out' }));
  }

  destroy(): void {
    this.stop?.();
    this.stop = null;
    for (const a of this.live) this.clock.forget(a);
    this.live = [];
    this.el.remove();
  }

  // ------------------------------------------------------------ drawing

  /** Draws the page in pose `c`. */
  private render(c: Curl): void {
    const g = this.g;
    if (!g) return;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, this.el.width, this.el.height);
    if (this.fallback) {
      // Nothing can bend: the picture lies as it is.
      const r = this.rect;
      g.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      g.drawImage(this.fallback, r.x, r.y, r.w, r.h);
      return;
    }
    const sh = this.sheet;
    // The page still lying, up to the fold.
    this.frame(this.toLayer);
    const lying = bandOf(sh, -Infinity, c.f);
    if (lying.length) {
      this.path(lying);
      this.paper(true);
    }
    const past = across(sh) - c.f;
    if (past <= 0.5) return;
    const bands = this.bands(c, past);
    this.beneath(c, bands);
    // Each band's paper reaches back over the last band's edge, so no seam
    // shows in it. The light and shade go on over a whole run of bands at
    // once, as one shape with one gradient across it (laid band by band, their
    // soft edges would show as faint lines between them). A run goes one way
    // across the screen: where the paper turns back over the roll a new run
    // begins, laid over the last.
    for (const run of this.runs(c, bands)) {
      for (const b of run) this.base(b);
      this.light(c, run);
    }
    this.outline(c, bands);
  }

  /** The bands in runs, each run going one way across the screen. */
  private runs(c: Curl, bands: Band[]): Band[][] {
    const out: Band[][] = [];
    let run: Band[] = [];
    let way = 0;
    for (const b of bands) {
      const dx = this.seen(c.f + b.b1.s, b.b1.z) - this.seen(c.f + b.b0.s, b.b0.z);
      const w = Math.abs(dx) < 1e-3 ? way : Math.sign(dx);
      if (run.length && way !== 0 && w !== way) {
        out.push(run);
        run = [];
      }
      run.push(b);
      way = w;
    }
    if (run.length) out.push(run);
    return out;
  }

  /** Sets the canvas to draw in a frame mapped to the layer by `m` (CSS px). */
  private frame(m: Mat): void {
    const k = this.dpr;
    this.g!.setTransform(m[0] * k, m[1] * k, m[2] * k, m[3] * k, m[4] * k, m[5] * k);
  }

  /** Adds a closed outline to the path, turned the same way round as every other (so that outlines laid edge to edge make one shape). */
  private ring(pts: P2[]): void {
    const g = this.g!;
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]!;
      const q = pts[(i + 1) % pts.length]!;
      area += p[0] * q[1] - q[0] * p[1];
    }
    if (area < 0) pts.reverse();
    g.moveTo(pts[0]![0], pts[0]![1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i]![0], pts[i]![1]);
    g.closePath();
  }

  /** The path of a run of bands as one shape, as seen (in the layer's frame of the page). */
  private runPath(run: Band[]): void {
    this.frame(this.toLayer);
    this.g!.beginPath();
    for (const b of run) if (b.exact.length) this.ring(b.exact.map((p) => apply(b.m, p)));
  }

  private path(poly: readonly P2[]): void {
    const g = this.g!;
    g.beginPath();
    g.moveTo(poly[0]![0], poly[0]![1]);
    for (let i = 1; i < poly.length; i++) g.lineTo(poly[i]![0], poly[i]![1]);
    g.closePath();
  }

  /** Fills the current path with the paper: its print (or a blank page), or its back. */
  private paper(front: boolean): void {
    const g = this.g!;
    g.globalAlpha = 1;
    if (front) {
      g.fillStyle = this.print ?? PAPER.plain;
      g.fill();
      if (!this.print && this.grain) {
        g.fillStyle = this.grain;
        g.fill();
      }
      return;
    }
    g.fillStyle = PAPER.back;
    g.fill();
    if (this.ghost) {
      // The print showing through, faintly, mirrored (the band's own map mirrors it).
      g.globalAlpha = 0.17;
      g.fillStyle = this.ghost;
      g.fill();
    }
    if (this.grain) {
      g.globalAlpha = 0.8;
      g.fillStyle = this.grain;
      g.fill();
    }
    g.globalAlpha = 1;
  }

  /** The perspective at height z. */
  private k(z: number): number {
    return this.eye.d / Math.max(1, this.eye.d - Math.min(z, this.eye.d * 0.8));
  }

  /** How far across a line of paper at (s across, z up) shows. */
  private seen(s: number, z: number): number {
    return this.eye.s + (s - this.eye.s) * this.k(z);
  }

  /** The paper beyond the fold, cut in bands from the fold out (each nearer the eye than the last). */
  private bands(c: Curl, past: number): Band[] {
    // The roll, the bow and the straight paper beyond, each cut finely enough
    // for its light and its perspective.
    const p = parts(c);
    const cuts: number[] = [0];
    let at = 0;
    for (const end of [p.roll, p.roll + p.bow, past]) {
      const to = Math.min(end, past);
      if (to <= at + 0.25) continue;
      const b0 = bend(c, at);
      const b1 = bend(c, to);
      const n = Math.max(1, Math.min(48, Math.ceil(Math.max(Math.abs(b1.a - b0.a) / ARC_STEP, (b1.z - b0.z) / RISE_STEP))));
      for (let i = 1; i <= n; i++) cuts.push(at + ((to - at) * i) / n);
      at = to;
    }
    const out: Band[] = [];
    const A = ACROSS;
    const L = ALONG;
    let b0 = bend(c, 0);
    for (let i = 0; i + 1 < cuts.length; i++) {
      const d0 = cuts[i]!;
      const d1 = cuts[i + 1]!;
      const b1 = bend(c, d1);
      const s0 = c.f + d0;
      const s1 = c.f + d1;
      // Across: exact at both ends; along: the perspective at its middle.
      const x0 = this.seen(c.f + b0.s, b0.z);
      const x1 = this.seen(c.f + b1.s, b1.z);
      const gx = (x1 - x0) / Math.max(1e-6, s1 - s0);
      const z = (b0.z + b1.z) / 2;
      const km = this.k(z);
      const lin: Mat = [gx * A.x * A.x + km * L.x * L.x, gx * A.x * A.y + km * L.x * L.y, gx * A.y * A.x + km * L.y * L.x, gx * A.y * A.y + km * L.y * L.y, 0, 0];
      const ta = x0 - gx * s0;
      const tl = this.eye.t * (1 - km);
      const m: Mat = [lin[0], lin[1], lin[2], lin[3], ta * A.x + tl * L.x, ta * A.y + tl * L.y];
      // Which side the eye sees: the paper's printed side faces up the roll.
      const a = (b0.a + b1.a) / 2;
      const sm = c.f + (b0.s + b1.s) / 2;
      const front = -Math.sin(a) * (this.eye.s - sm) + Math.cos(a) * (this.eye.d - z) > 0;
      // Reaching back over the last band, a little on screen.
      const back = OVERLAP / Math.max(0.08, Math.abs(gx));
      const poly = bandOf(this.sheet, s0 - (i === 0 ? 0.5 : back), s1);
      const exact = bandOf(this.sheet, s0 - (i === 0 ? 0.5 : 0), s1);
      if (poly.length) out.push({ d0, d1, b0, b1, front, z, m, poly, exact });
      b0 = b1;
    }
    return out;
  }

  /** The shadows the lifted paper throws on what lies beneath it: soft, falling away from the light, darkest where the roll meets the page. */
  private beneath(c: Curl, bands: Band[]): void {
    const g = this.g!;
    const r = this.rect;
    const rise = clamp01(c.phi / 0.9);
    if (rise <= 0) return;
    const drift = shadowDrift();
    const k = this.dpr;
    g.save();
    // Only on the page.
    g.setTransform(k, 0, 0, k, 0, 0);
    g.beginPath();
    g.rect(r.x, r.y, r.w, r.h);
    g.clip();
    // The paper's own shape, laid on the page beneath and blurred (the shape
    // itself drawn far off, only its shadow brought back).
    const far = 40000;
    g.beginPath();
    let zMax = 0;
    for (const b of bands) {
      zMax = Math.max(zMax, b.z);
      const lift = Math.min(b.z, 600) * 0.16;
      const m = compose(this.toLayer, b.m);
      this.ring(
        b.poly.map((p) => {
          const q = apply(m, p);
          return [q[0] + drift.x * lift - far, q[1] + drift.y * lift] as P2;
        }),
      );
    }
    g.shadowColor = `rgba(${SHADOW}, ${r2(0.34 * rise)})`;
    g.shadowBlur = (4 + Math.min(26, zMax * 0.035)) * k;
    g.shadowOffsetX = far * k;
    g.shadowOffsetY = 0;
    g.fillStyle = '#000';
    g.fill();
    g.restore();
    // The roll's own shadow on what it has uncovered, once it has rolled
    // back over: a thin dark line where it meets the paper, a soft shade beyond.
    const rolled = clamp01((c.phi - 1.2) / 0.6);
    const sil = rolled > 0 ? this.silhouette(c, bands) : null;
    if (sil !== null) {
      const wide = c.r * 1.6 + 12;
      const zone = bandOf(this.sheet, sil - 0.5, sil + wide);
      if (zone.length) {
        this.frame(this.toLayer);
        const grd = g.createLinearGradient(sil * ACROSS.x, sil * ACROSS.y, (sil + wide) * ACROSS.x, (sil + wide) * ACROSS.y);
        const stops: [number, number][] = [
          [0, 0.5],
          [Math.min(0.2, 2.5 / wide), 0.26],
          [0.35, 0.13],
          [0.65, 0.04],
          [1, 0],
        ];
        for (const [at, a] of stops) grd.addColorStop(at, `rgba(${SHADOW}, ${r2(a * rolled)})`);
        this.path(zone);
        g.fillStyle = grd;
        g.fill();
      }
    }
    // The crease: the page darkens into the fold under the roll.
    const w = c.r * 1.1 + 4;
    const crease = bandOf(this.sheet, c.f - w, c.f);
    if (crease.length) {
      this.frame(this.toLayer);
      const grd = g.createLinearGradient((c.f - w) * ACROSS.x, (c.f - w) * ACROSS.y, c.f * ACROSS.x, c.f * ACROSS.y);
      grd.addColorStop(0, `rgba(${SHADOW}, 0)`);
      grd.addColorStop(1, `rgba(${SHADOW}, ${r2(0.4 * rise)})`);
      this.path(crease);
      g.fillStyle = grd;
      g.fill();
    }
  }

  /** How far out the lifted paper reaches, as seen (across, in the page's frame). */
  private silhouette(c: Curl, bands: Band[]): number | null {
    let best = -Infinity;
    for (const b of bands) best = Math.max(best, this.seen(c.f + b.b0.s, b.b0.z), this.seen(c.f + b.b1.s, b.b1.z));
    return best > -Infinity ? best : null;
  }

  /**
   * How the paper `d` px beyond the fold is lit (`b`: where it is). The
   * crease darkens the print where it leaves the page; the roll's back
   * darkens toward its underside. Where the paper curves toward the light it
   * pales, with a sheen; the straight of the sheet keeps the back's own
   * darker tone (paper is matte: only a breath of the light and the sheen
   * are on it).
   */
  private lit(c: Curl, d: number, b: Bent, front: boolean): Lit {
    const p = parts(c);
    const roll = d <= p.roll + 0.5;
    const curved = d <= p.roll + p.bow + 0.5;
    const l = litAt(b.a, front, this.dir);
    if (front) {
      const crease = 0.45 * clamp01(1 - b.a / 0.7) * clamp01(b.a / 0.08);
      l.dark = 1 - (1 - l.dark) * (1 - crease);
    } else if (roll) {
      const under = 0.6 * (1 - clamp01((b.a - Math.PI / 2) / 1.1)) ** 1.6;
      l.dark = 1 - (1 - l.dark) * (1 - under);
    }
    if (curved) l.sheen *= 0.9;
    else {
      l.sheen *= 0.12;
      if (!front) l.pale *= 0.3;
    }
    return l;
  }

  /** Lays a band's paper: its print, or its back. */
  private base(b: Band): void {
    this.frame(compose(this.toLayer, b.m));
    this.path(b.poly);
    this.paper(b.front);
  }

  /** Lays the light and shade on a run of bands. */
  private light(c: Curl, run: Band[]): void {
    const g = this.g!;
    // How each band's ends are lit, and where they show across the screen.
    const ends: { x: number; l: Lit }[] = [];
    for (const b of run) {
      ends.push({ x: this.seen(c.f + b.b0.s, b.b0.z), l: this.lit(c, b.d0, b.b0, b.front) });
      ends.push({ x: this.seen(c.f + b.b1.s, b.b1.z), l: this.lit(c, b.d1, b.b1, b.front) });
    }
    // In order across the screen (a run going the other way is read backward).
    if (ends.length > 1 && ends[ends.length - 1]!.x < ends[0]!.x) ends.reverse();
    const lo = ends[0]!.x;
    const hi = ends[ends.length - 1]!.x;
    this.runPath(run);
    const fill = (color: (l: Lit) => string, any: (l: Lit) => boolean): void => {
      if (!ends.some((e) => any(e.l))) return;
      if (hi - lo < 0.5) {
        g.fillStyle = color(ends[0]!.l);
      } else {
        const grd = g.createLinearGradient(lo * ACROSS.x, lo * ACROSS.y, hi * ACROSS.x, hi * ACROSS.y);
        for (const e of ends) grd.addColorStop(clamp01((e.x - lo) / (hi - lo)), color(e.l));
        g.fillStyle = grd;
      }
      g.fill('nonzero');
    };
    // Shade: the game's plum; or the pale of paper turned to the light.
    fill(
      (l) => (l.dark > 0.004 ? `rgba(${SHADOW}, ${r2(0.42 * l.dark ** 0.8)})` : `rgba(${PALE}, ${r2(0.42 * l.pale)})`),
      (l) => l.dark > 0.004 || l.pale > 0.004,
    );
    // A little hatching where the shade is deep.
    if (this.hatch) {
      for (const b of run) {
        const deep = Math.max(this.lit(c, b.d0, b.b0, b.front).dark, this.lit(c, b.d1, b.b1, b.front).dark);
        if (deep <= 0.3 || !b.exact.length) continue;
        this.frame(compose(this.toLayer, b.m));
        this.path(b.exact);
        g.globalAlpha = Math.min(0.28, (deep - 0.3) * 0.6);
        g.fillStyle = this.hatch;
        g.fill();
        g.globalAlpha = 1;
      }
    }
    // The sheen riding the curve of the paper.
    if (ends.some((e) => e.l.sheen > 0.01)) {
      this.runPath(run);
      fill(
        (l) => `rgba(${PALE}, ${r2(l.sheen)})`,
        (l) => l.sheen > 0.01,
      );
    }
  }

  /** Where a point of the page shows now (layer px). */
  private shown(c: Curl, x: number, y: number): P2 {
    const s = x * ACROSS.x + y * ACROSS.y;
    const t = x * ALONG.x + y * ALONG.y;
    let sa = s;
    let z = 0;
    if (s > c.f) {
      const b = bend(c, s - c.f);
      sa = c.f + b.s;
      z = b.z;
    }
    const k = this.k(z);
    const ss = this.eye.s + (sa - this.eye.s) * k;
    const tt = this.eye.t + (t - this.eye.t) * k;
    return apply(this.toLayer, [ss * ACROSS.x + tt * ALONG.x, ss * ACROSS.y + tt * ALONG.y]);
  }

  /** The lifted paper's edges: a pale cut edge inked in the paper's darker tone; and the roll's outline where it turns out of sight. */
  private outline(c: Curl, bands: Band[]): void {
    const g = this.g!;
    const { w, h: ht } = this.sheet;
    const k = this.dpr;
    g.setTransform(k, 0, 0, k, 0, 0);
    // Where the bands are cut, as places across the page: the edges are drawn through them.
    const cuts = [c.f, ...bands.map((b) => c.f + b.d1)];
    const lines: P2[][] = [];
    const run = (pt: (s: number) => P2 | null): void => {
      const pts: P2[] = [];
      for (const s of cuts) {
        const p = pt(s);
        if (p) pts.push(this.shown(c, p[0], p[1]));
      }
      if (pts.length > 1) lines.push(pts);
    };
    // The top edge, the foot and the spine's side where they are lifted (s = x·cos + y·sin).
    run((s) => (s >= c.f && s <= w * ACROSS.x ? [s / ACROSS.x, 0] : null));
    run((s) => (s >= Math.max(c.f, ht * ACROSS.y) ? [Math.min(w, (s - ht * ACROSS.y) / ACROSS.x), ht] : null));
    run((s) => (s >= c.f && s <= ht * ACROSS.y && s >= 0 ? [0, s / ACROSS.y] : null));
    // The free edge, top to foot.
    const free: P2[] = [];
    for (let i = 0; i <= 16; i++) {
      const y = (ht * i) / 16;
      if (w * ACROSS.x + y * ACROSS.y > c.f) free.push(this.shown(c, w, y));
    }
    if (free.length > 1) lines.push(free);
    g.lineJoin = 'round';
    g.lineCap = 'round';
    for (const [width, style] of [
      [2.6, PAPER.edge],
      [1.25, PAPER.line],
    ] as const) {
      g.lineWidth = width;
      g.strokeStyle = style;
      for (const pts of lines) {
        g.beginPath();
        g.moveTo(pts[0]![0], pts[0]![1]);
        for (let i = 1; i < pts.length; i++) g.lineTo(pts[i]![0], pts[i]![1]);
        g.stroke();
      }
    }
    // The roll's outline: where, seen from the eye, the paper turns out of
    // sight over it (once it has turned back over the roll, so that the roll
    // and not the paper beyond it is the outermost thing seen).
    const roll = parts(c).roll;
    let best = -Infinity;
    let at = -1;
    for (const b of bands) {
      const x = this.seen(c.f + b.b1.s, b.b1.z);
      if (x > best) {
        best = x;
        at = b.d1 < roll - 0.5 ? c.f + b.d1 : -1;
      }
    }
    if (at < 0) return;
    const seg = bandOf(this.sheet, at - 0.01, at + 0.01);
    if (!seg.length) return;
    // The ends of the line across the page at `at`: where it meets the page's edges.
    let lo: P2 = seg[0]!;
    let hi: P2 = seg[0]!;
    for (const p of seg) {
      const t = p[0] * ALONG.x + p[1] * ALONG.y;
      if (t < lo[0] * ALONG.x + lo[1] * ALONG.y) lo = p;
      if (t > hi[0] * ALONG.x + hi[1] * ALONG.y) hi = p;
    }
    const p0 = this.shown(c, lo[0], lo[1]);
    const p1 = this.shown(c, hi[0], hi[1]);
    g.strokeStyle = `rgba(${SHADOW}, 0.28)`;
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(p0[0] + this.dir * 1.6, p0[1]);
    g.lineTo(p1[0] + this.dir * 1.6, p1[1]);
    g.stroke();
    g.strokeStyle = PAPER.line;
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(p0[0], p0[1]);
    g.lineTo(p1[0], p1[1]);
    g.stroke();
  }
}

/** A smaller copy of a canvas. */
function shrink(src: HTMLCanvasElement, k: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(src.width * k));
  c.height = Math.max(1, Math.round(src.height * k));
  c.getContext('2d')?.drawImage(src, 0, 0, c.width, c.height);
  return c;
}
