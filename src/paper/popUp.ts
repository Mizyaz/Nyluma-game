import type { Lens } from './lens';
import type { PlaneCamera } from './planes';

// A room arriving like the page of a pop-up book: every card starts lying
// flat on the floor of its paper box and stands up on its hinge, the far
// ones first and the near ones last, each with a little spring past
// standing. Each plane's camera is squashed upright about the floor line at
// its depth, so the floor (and the box, drawn by its own shaders) never
// moves while what stands on it rises. Nothing in the world moves: only how
// its planes are drawn, for a moment.

/** How long one card takes to stand up (s), and how much later the nearest starts than the farthest (s). */
export const RISE = { dur: 0.56, spread: 0.42 } as const;

/** Lower than this a card lies flat and is not drawn at all. */
const FLAT = 0.035;

/** A card's height while it stands up (u: 0..1 of its rise): from 0, a little past 1, settling on 1. */
export function riseAt(u: number): number {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  return 1 - Math.exp(-5.5 * u) * Math.cos(7.6 * u);
}

/** When the card at depth z starts to rise (s), for cards from `far` to `near`. */
export function riseDelay(z: number, far: number, near: number, spread: number = RISE.spread): number {
  if (!(near > far)) return 0;
  return spread * Math.min(1, Math.max(0, (z - far) / (near - far)));
}

export class PopUp {
  /** Seconds since the cards began to rise (they lie flat until `start`). */
  private t = 0;
  private running = false;
  private over = false;

  constructor(private readonly opt: { dur: number; spread: number } = RISE) {}

  /** The cards begin to rise. */
  start(): void {
    this.running = true;
  }

  /** Stands everything up at once. */
  finish(): void {
    this.running = true;
    this.over = true;
  }

  get started(): boolean {
    return this.running;
  }

  /** Everything is standing. */
  get done(): boolean {
    return this.over;
  }

  /** The whole rise (s), from the first card to the last one settled. */
  get length(): number {
    return this.opt.dur + this.opt.spread;
  }

  tick(dt: number): void {
    if (this.running && !this.over) {
      this.t += dt;
      if (this.t >= this.length) this.over = true;
    }
  }

  /**
   * After the planes have followed the lens this frame: squashes each
   * plane's camera upright about the floor line at its depth.
   */
  apply(cameras: readonly PlaneCamera[], lens: Lens, floor: number): void {
    let far = Infinity;
    let near = -Infinity;
    for (const c of cameras) {
      if (c.screen || !Number.isFinite(c.z)) continue;
      far = Math.min(far, c.z);
      near = Math.max(near, c.z);
    }
    for (const c of cameras) {
      if (c.screen || !Number.isFinite(c.z)) continue;
      if (this.over) {
        c.visible = true;
        continue;
      }
      const delay = riseDelay(c.z, far, near, this.opt.spread);
      const u = this.running ? (this.t - delay) / this.opt.dur : 0;
      const k = riseAt(u);
      if (u >= 1) {
        c.visible = true;
        continue;
      }
      c.visible = k > FLAT;
      if (!c.visible) continue;
      // The camera set by the planes shows the plane at scale s; drawn
      // k as tall about the floor line yF: screen y = yF + k·s·(y − floor).
      const s = c.zoomX;
      const ky = s * k;
      const oy = c.height * c.originY;
      const yF = lens.project(0, floor, c.z).y;
      c.setZoom(s, ky);
      c.scrollY = floor - oy - (yF - oy) / ky;
    }
  }
}
