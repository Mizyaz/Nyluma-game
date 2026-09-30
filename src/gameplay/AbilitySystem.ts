import { FOCUS_MAX_S, FOCUS_RECHARGE_DELAY_S, FOCUS_RECHARGE_RATE, REACH_RANGE } from '../engine/constants';
import type { Rect } from '../content/data/roomTypes';

// Pure ability logic (no Phaser): focus meter, reach targeting and segment
// obstruction tests. Kept separate so it can be unit-tested.

export class FocusMeter {
  value = FOCUS_MAX_S;
  active = false;
  private rest = 0;
  /** Seconds focus has been continuously active. */
  heldFor = 0;
  /** Toggle mode: a press latches focus until the meter empties or the next press. */
  latched = false;

  get fraction(): number {
    return this.value / FOCUS_MAX_S;
  }

  /**
   * Advances the meter. `want` is the player's intent this step (hold or
   * latched toggle). Returns 'start' | 'stop' on transitions.
   */
  step(dt: number, want: boolean, enabled: boolean, assist: boolean): 'start' | 'stop' | null {
    let ev: 'start' | 'stop' | null = null;
    const canStart = this.value > 0.25;
    if (enabled && want && (this.active || canStart)) {
      if (!this.active) {
        this.active = true;
        this.heldFor = 0;
        ev = 'start';
      }
      this.heldFor += dt;
      this.value = Math.max(0, this.value - dt * (assist ? 0.7 : 1));
      this.rest = 0;
      if (this.value <= 0) {
        this.active = false;
        this.latched = false;
        ev = 'stop';
      }
    } else {
      if (this.active) {
        this.active = false;
        this.latched = false;
        ev = 'stop';
      }
      this.heldFor = 0;
      this.rest += dt;
      if (this.rest >= FOCUS_RECHARGE_DELAY_S) this.value = Math.min(FOCUS_MAX_S, this.value + dt * FOCUS_RECHARGE_RATE);
    }
    return ev;
  }

  refill(): void {
    this.value = FOCUS_MAX_S;
    this.active = false;
    this.latched = false;
    this.heldFor = 0;
  }
}

/** Liang–Barsky segment vs axis-aligned rectangle. */
export function segmentHitsRect(x0: number, y0: number, x1: number, y1: number, r: Rect, shrink = 2): boolean {
  const rx0 = r.x + shrink;
  const ry0 = r.y + shrink;
  const rx1 = r.x + r.w - shrink;
  const ry1 = r.y + r.h - shrink;
  const dx = x1 - x0;
  const dy = y1 - y0;
  let t0 = 0;
  let t1 = 1;
  const p = [-dx, dx, -dy, dy];
  const q = [x0 - rx0, rx1 - x0, y0 - ry0, ry1 - y0];
  for (let i = 0; i < 4; i++) {
    const pi = p[i]!;
    const qi = q[i]!;
    if (pi === 0) {
      if (qi < 0) return false;
    } else {
      const t = qi / pi;
      if (pi < 0) {
        if (t > t1) return false;
        if (t > t0) t0 = t;
      } else {
        if (t < t0) return false;
        if (t < t1) t1 = t;
      }
    }
  }
  return t0 <= t1;
}

export interface ReachCandidate {
  id: string;
  x: number;
  y: number;
}

/**
 * Picks the nearest eligible anchor in the facing direction within range with
 * an unobstructed straight path from the chest. No precise aiming needed.
 */
export function pickReachTarget(
  chest: { x: number; y: number },
  facing: 1 | -1,
  candidates: readonly ReachCandidate[],
  blockers: readonly Rect[],
  range = REACH_RANGE,
): ReachCandidate | null {
  let best: ReachCandidate | null = null;
  let bestD = Infinity;
  for (const c of candidates) {
    const dx = c.x - chest.x;
    const dy = c.y - chest.y;
    if (dx * facing < -24) continue;
    const d = Math.hypot(dx, dy);
    if (d > range || d < 20) continue;
    let blocked = false;
    for (const b of blockers) {
      if (segmentHitsRect(chest.x, chest.y, c.x, c.y, b)) {
        blocked = true;
        break;
      }
    }
    if (blocked) continue;
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return best;
}

/** Quadratic Bézier used for the controlled root-pull path. */
export function bezier(p0: { x: number; y: number }, c: { x: number; y: number }, p1: { x: number; y: number }, t: number): { x: number; y: number } {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * c.x + t * t * p1.x,
    y: u * u * p0.y + 2 * u * t * c.y + t * t * p1.y,
  };
}
