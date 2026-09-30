import type { Rng } from '../svg';

// Geometry of the gem tunnel (no Phaser here, so it is unit-tested): square
// frames of gems nested inside each other, each one smaller by a constant
// ratio and turned a little further than the one around it, zooming toward
// the viewer. Like a picture that contains itself.

/** One sprite of a frame, in frame units (the frame's outer half-size is 1). */
export interface FrameSlot {
  /** A gem, or a piece (rib or band) along one side of the square, under the gems. */
  kind: 'gem' | 'side';
  x: number;
  y: number;
  /** Direction of the long axis (radians); a side piece's top faces outward. */
  angle: number;
  /** Long-axis length. */
  length: number;
  /** Gem shape or side piece kind. */
  variant: number;
}

export interface FrameSpec {
  /** Gems per frame: one on each corner, the rest spread along the sides. */
  gems: number;
  /** Lay a piece along each side, under the gems. */
  sides: boolean;
  /** Half-size of the square the gems sit on. */
  band: number;
  /** Half-size of the square the side pieces' edge lines run on. */
  edge: number;
  /** Long-axis length of a gem. */
  gemLength: number;
  /** Orientation jitter (radians). */
  jitter: number;
  shapes: number;
  sideKinds: number;
}

/** The sides clockwise from the top: outward-facing angle and a point at t ∈ [-1, 1] on the square of half-size b. */
const SIDES: readonly { angle: number; at: (t: number, b: number) => [number, number] }[] = [
  { angle: 0, at: (t, b) => [t * b, -b] },
  { angle: Math.PI / 2, at: (t, b) => [b, t * b] },
  { angle: Math.PI, at: (t, b) => [-t * b, b] },
  { angle: -Math.PI / 2, at: (t, b) => [-b, -t * b] },
];

/** Gems on each side between the corners; the long top and bottom sides get the remainder first. */
export function sideCounts(gems: number): number[] {
  const rest = Math.max(0, gems - 4);
  const base = Math.floor(rest / 4);
  const extra = rest - base * 4;
  return [0, 1, 2, 3].map((s) => base + ([0, 2, 1, 3].indexOf(s) < extra ? 1 : 0));
}

/**
 * The slots of one square frame: a piece along each side (first, so it is
 * drawn under the gems), a gem on each corner lying along the corner's
 * diagonal tangent, and gems along each side oriented with it, all a little
 * jittered, as if placed by hand.
 */
export function frameSlots(spec: FrameSpec, rng: Rng): FrameSlot[] {
  const slots: FrameSlot[] = [];
  const b = spec.band;
  // Gems are symmetric: keep them within half a turn so their painted
  // highlight stays on the upper left.
  const upright = (a: number): number => a - Math.PI * Math.round(a / Math.PI);
  const gem = (x: number, y: number, angle: number): FrameSlot => ({
    kind: 'gem',
    x: x + rng.range(-0.02, 0.02),
    y: y + rng.range(-0.02, 0.02),
    angle: upright(angle + rng.range(-spec.jitter, spec.jitter)),
    length: spec.gemLength * rng.range(0.88, 1.12),
    variant: rng.int(0, spec.shapes - 1),
  });
  if (spec.sides) {
    for (const side of SIDES) {
      const [x, y] = side.at(rng.range(-0.03, 0.03), spec.edge + rng.range(-0.01, 0.01));
      slots.push({ kind: 'side', x, y, angle: side.angle + rng.range(-0.012, 0.012), length: 2, variant: rng.int(0, spec.sideKinds - 1) });
    }
  }
  const counts = sideCounts(spec.gems);
  SIDES.forEach((side, s) => {
    const [cx, cy] = side.at(-1, b * 0.96);
    slots.push(gem(cx, cy, side.angle - Math.PI / 4));
    const n = counts[s]!;
    for (let i = 0; i < n; i++) {
      const [x, y] = side.at(-1 + (2 * (i + 1)) / (n + 1), b);
      slots.push(gem(x, y, side.angle));
    }
  });
  return slots;
}

export interface TunnelSpec {
  /** Frames in the tunnel. */
  frames: number;
  /** Size of each frame relative to the next bigger one (0..1). */
  ratio: number;
  /** How much further each frame is turned than the next bigger one (radians). */
  twist: number;
  /** Levels at the near end where frames are gone (they would only be huge, costly and mostly off screen). */
  nearCut?: number;
  /** Levels over which a frame fades out as it comes near (beyond the cut). */
  nearFade: number;
  /** Levels over which a new frame fades in at the vanishing point. */
  farFade: number;
}

const smooth = (v: number): number => {
  const c = Math.min(1, Math.max(0, v));
  return c * c * (3 - 2 * c);
};

/**
 * The zoom: every frame sits at a level u in [0, frames): 0 is the biggest
 * (at the viewer), `frames` the vanishing point. Advancing moves all frames
 * toward the viewer; a frame that passes it comes back at the far end.
 */
export class ZoomTunnel {
  /** 0..1: how far the tube has moved (one unit = every frame moved one tube length). */
  private phase = 0;

  constructor(readonly spec: TunnelSpec) {}

  /** Moves the tube by `tubes` tube lengths (a frame travels the tube in one unit). */
  advance(tubes: number): void {
    this.phase = (((this.phase + tubes) % 1) + 1) % 1;
  }

  /** Level of frame k: 0 nearest … `frames` at the vanishing point. */
  level(k: number): number {
    const n = this.spec.frames;
    const u = (k - this.phase * n) % n;
    return u < 0 ? u + n : u;
  }

  /** Size at a level relative to level 0. */
  scale(u: number): number {
    return this.spec.ratio ** u;
  }

  /** Extra turn of a frame at a level. */
  turn(u: number): number {
    return this.spec.twist * u;
  }

  /**
   * Opacity at a level: fades in at the vanishing point, out as it comes
   * near. `recede` cuts further levels at the near end (the tunnel pulls
   * back into the distance).
   */
  fade(u: number, recede = 0): number {
    const s = this.spec;
    return smooth((u - (s.nearCut ?? 0) - recede) / s.nearFade) * smooth((s.frames - u) / s.farFade);
  }
}
