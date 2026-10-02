import type { DoorArt, DoorPiece } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed } from '../../../render/2d/svg';
import { circleP, comic, crescent, crystals, darkOf, doorPart, fillP, glowDisc, ink, leafPart, lightOf, LINE, Rng, shard, smooth, twinkle, type Pt } from './doorKit';

// A crystal gate turned across the path, so Gorti walks through it: two
// crystal pillars (one behind him, one before him), an arch of crystal
// along the depth between their tops, and while it is shut a row of
// crystal bars standing across the way, humming and trembling as Gorti
// comes near. When its condition comes true the bars shrink back into the
// ground one after another, down to little stubs he steps over.
//
// "Ay Kapısı" (b02) wears the Moon over its arch: asleep in a dark disc
// while the Sun is out, a bright crescent wide awake once the Moon rises.
// In r05 the gate stands under the stone; the two memory stones resting on
// their plates opened it long ago, and their sign glows in its arch.

const C = {
  teal: '#a6dcd5',
  lilac: '#c8b8ea',
  blue: '#b5d2f2',
  pale: '#e3f3f4',
  night: '#4f5584',
  nightDeep: '#3d416b',
  moon: '#fff1b8',
  moonDim: '#c9c6dc',
  stone: '#b9b1c9',
  stoneGlow: '#e9e2ff',
} as const;

/** The pillars stand on the diagonal: the back one at (-D, dz -D), the near one at (D, dz +D). */
const D = 32;

export interface CrystalGateOpts {
  /** Its parts' names (each gate prints its own). */
  id: string;
  /** How tall the pillars stand (the arch rests on them). */
  tall: number;
  /** What its arch wears: the Moon (over it), or the two stones' sign (in it). */
  sign: 'moon' | 'stones';
}

/**
 * A crystal pillar: a long shard with others leaning out from it (to the
 * left: the near pillar is flipped, so the way between them stays clear).
 */
function pillar(tall: number, seed: number): string {
  const rng = new Rng(seed);
  let s = '';
  s += shard(-12, 0, tall * 0.56, 12, -Math.PI / 2 - 0.22, C.lilac);
  s += shard(-7, 2, tall * 0.8, 14, -Math.PI / 2 - 0.08, C.blue);
  s += shard(0, 2, tall, 20, -Math.PI / 2 + rng.range(-0.02, 0.02), C.teal);
  s += crystals(-14, 0, 28, [C.blue, C.lilac, C.teal], seed + 1, 1.3);
  s += crystals(6, 0, 13, [C.lilac, C.teal], seed + 2, 0.9);
  return s;
}

/** The arch between the pillars' tops, seen along the depth (a leaf that never moves). */
function arch(w: number, h: number, sign: 'moon' | 'stones'): string {
  const rng = new Rng(hashSeed(`door.crystal.arch.${sign}`));
  const band: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const u = i / 16;
    band.push([u * w, h - 14 - Math.sin(u * Math.PI) * (h - 40)]);
  }
  let s = '';
  // Shards sprouting from the top of the band, leaning out from its middle; icicles under it.
  for (let i = 1; i < 16; i++) {
    const u = i / 16;
    const p = band[i]!;
    const lean = (u - 0.5) * 1.3;
    const len = rng.range(13, 22) * (1 - Math.abs(u - 0.5) * 0.9) * (i % 2 ? 1 : 0.7);
    s += shard(p[0], p[1] - 2, len, 7, -Math.PI / 2 + lean, rng.pick([C.teal, C.lilac, C.blue]));
  }
  for (let i = 3; i < 14; i += 2) {
    const p = band[i]!;
    s += shard(p[0], p[1] + 4, rng.range(6, 11), 4.4, Math.PI / 2 + (i / 16 - 0.5) * 0.6, rng.pick([C.pale, C.blue]));
  }
  const top = band.map(([x, y]) => [x, y - 7] as Pt);
  const bottom = [...band].reverse().map(([x, y]) => [x, y + 7] as Pt);
  let facets = '';
  for (let i = 2; i < 16; i += 2) {
    const p = band[i]!;
    facets += ink(`M${p[0] - 2} ${p[1] - 6}L${p[0] + 2} ${p[1] + 6}`, 0.6, darkOf(C.pale, 0.18));
  }
  s += comic(smooth([...top, ...bottom], 0.8), C.pale, { line: LINE.small, ink: darkOf(C.teal, 0.3), rim: [2.6, -1.3], glint: [-0.8, 0.8], inner: facets, over: ink(smooth(band.map(([x, y]) => [x, y - 2.6] as Pt), 1, false), 0.8, '#ffffff', 0.8) });
  if (sign === 'stones') {
    // The two memory stones resting side by side.
    const cx = w / 2;
    const cy = h - 14 - (h - 40);
    s += comic(ellipsePath(cx - 7.4, cy + 0.6, 6.8, 5.8), C.stone, { line: LINE.detail, rim: [1.4, -0.6], glint: [-0.5, 0.5] });
    s += comic(ellipsePath(cx + 7.4, cy + 1, 6.2, 5.4), lightOf(C.stone, 0.08), { line: LINE.detail, rim: [1.4, -0.6], glint: [-0.5, 0.5] });
  }
  return s;
}

/** A bar: one tall clean crystal on a little cluster (its pivot at its foot: it shrinks into the ground). */
function bar(len: number, seed: number): string {
  const rng = new Rng(seed);
  let s = shard(0, 2, len, 11, -Math.PI / 2 + rng.range(-0.03, 0.03), rng.pick([C.teal, C.blue]));
  s += shard(-3, 1, len * 0.16, 6, -Math.PI / 2 - 0.5, C.lilac) + shard(3, 1, len * 0.13, 5, -Math.PI / 2 + 0.5, C.blue);
  return s;
}

/** The Moon's medallion: asleep in a dark disc by day. */
function moonDay(): string {
  let s = comic(circleP(0, 0, 25), C.pale, { line: LINE.small, ink: darkOf(C.teal, 0.3), rim: [2.6, -1.2], glint: [-0.8, 0.8] });
  s += comic(circleP(0, 0, 19.5), C.nightDeep, { line: LINE.detail });
  s += comic(crescent(-2.4, 0, 13.5, 1.32), C.moonDim, { line: LINE.detail, rim: [1.6, -0.7] });
  const line = darkOf(C.moonDim, 0.5);
  s += ink('M-9 -1.6Q-6.6 0.8 -4.2 -1.4', 1, line);
  s += ink('M8 -9h3.4l-3.4 3.4h3.4M11.6 -14.4h2.4l-2.4 2.4h2.4', 0.8, '#e6e2f6');
  return s;
}

/** The Moon's medallion at night: a bright crescent, wide awake, a star beside her. */
function moonNight(): string {
  let s = comic(circleP(0, 0, 25), lightOf(C.pale, 0.2), { line: LINE.small, ink: darkOf(C.teal, 0.25), rim: [2.6, -1.2], glint: [-0.8, 0.8] });
  s += comic(circleP(0, 0, 19.5), C.night, { line: LINE.detail, inner: glowDisc(-2, 0, 17, '#8f96d8', 0.7) });
  s += comic(crescent(-2.4, 0, 13.5, 1.32), C.moon, { line: LINE.detail, rim: [1.6, -0.7], glint: [-0.6, 0.6] });
  const line = darkOf(C.moon, 0.55);
  s += comic(ellipsePath(-7.6, -2.2, 2.3, 2.8), '#ffffff', { line: 0.65, ink: line }) + fillP(circleP(-7.9, -2, 1.35), '#4a3f6a') + fillP(circleP(-7.4, -2.7, 0.45), '#ffffff');
  s += ink('M-10.8 5.4Q-8.2 8 -5.6 5.6', 1, line) + fillP(ellipsePath(-10, 2.4, 1.7, 1), '#f2a6b6', 0.8);
  s += twinkle(9.6, -7.4, 3.8, '#fff7d6', 0.5) + twinkle(6, 9, 2.2, '#fff7d6', 0.5);
  return s;
}

/** Light: the bars' hum, the Moon's glow (drawn additive). */
function hum(): string {
  return glowDisc(0, 0, 60, '#bfe6f0', 0.55);
}
function moonGlow(): string {
  return glowDisc(0, 0, 40, '#e6e8ff', 0.8);
}

export function crystalGate(o: CrystalGateOpts): DoorArt {
  const k = (name: string): string => `door.crystal.${o.id}.${name}`;
  const LW = 2 * Math.SQRT2 * D + 14;
  const LH = 68;
  const at = D + 7 / Math.SQRT2;
  const BAR = o.tall * 0.78;
  const parts = [
    doorPart(k('pillar'), { x0: -46, y0: -o.tall - 6, x1: 22, y1: 4 }, pillar(o.tall, hashSeed(k('pillar')))),
    doorPart(k('pillar.near'), { x0: -46, y0: -o.tall - 6, x1: 22, y1: 4 }, pillar(o.tall, hashSeed(k('pillar.near')))),
    leafPart(k('arch'), LW, LH, arch(LW, LH, o.sign)),
    leafPart(k('arch.back'), LW, LH, arch(LW, LH, o.sign)),
    doorPart(k('bar.a'), { x0: -14, y0: -BAR - 4, x1: 14, y1: 4 }, bar(BAR, hashSeed(k('bar.a')))),
    doorPart(k('bar.b'), { x0: -14, y0: -BAR * 0.9 - 4, x1: 14, y1: 4 }, bar(BAR * 0.9, hashSeed(k('bar.b')))),
    doorPart(k('hum'), { x0: -62, y0: -62, x1: 62, y1: 62 }, hum()),
  ];
  // The bars across the way, from the back pillar to the near one.
  const bars: DoorPiece[] = [-0.62, -0.21, 0.21, 0.62].map((t, i) => ({
    key: k(i % 2 ? 'bar.b' : 'bar.a'),
    x: t * D,
    y: 0,
    dz: t * D + (Math.abs(t * D) < 1 ? 1.5 : 0),
    flipX: i === 2,
    shut: {},
    open: { sy: 0.07, sx: 0.8, alpha: 0.85 },
    lag: i * 0.14,
    // Humming as Gorti comes: a tremble, a little lift.
    wake: { y: -1.2 },
    wakeShut: 'only',
    sway: { x: 0.7, ms: 140 + i * 17, byWake: true },
  }));
  const pieces: DoorPiece[] = [
    { key: k('hum'), x: 0, y: -o.tall * 0.42, dz: -3, additive: true, shut: { alpha: 0.14, sx: 0.5, sy: 1.9 }, open: { alpha: 0, sx: 0.5, sy: 0.4 }, wake: { alpha: 0.3 }, wakeShut: 'only', sway: { alpha: 0.12, ms: 420, byWake: true } },
    ...bars,
  ];
  if (o.sign === 'moon') {
    const my = -o.tall - 36;
    parts.push(
      doorPart(k('moon'), { x0: -27, y0: -27, x1: 27, y1: 27 }, moonDay()),
      doorPart(k('moon.night'), { x0: -27, y0: -27, x1: 27, y1: 27 }, moonNight()),
      doorPart(k('moon.glow'), { x0: -42, y0: -42, x1: 42, y1: 42 }, moonGlow()),
    );
    pieces.push(
      { key: k('moon.glow'), x: 0, y: my, dz: 0.5, additive: true, shut: { alpha: 0, sx: 0.5, sy: 0.5 }, open: { alpha: 0.55 }, wake: { alpha: 0.25, sx: 1.15, sy: 1.15 }, sway: { alpha: 0.08, ms: 2100 } },
      { key: k('moon'), x: 0, y: my, dz: 1, shut: {}, open: { alpha: 0 }, sway: { angle: 3, ms: 3400 } },
      { key: k('moon.night'), x: 0, y: my, dz: 1.2, shut: { alpha: 0, angle: -40, sx: 0.8, sy: 0.8 }, open: {}, sway: { angle: 3, ms: 3400 }, wake: { angle: -6, sx: 1.06, sy: 1.06 } },
    );
  } else {
    parts.push(doorPart(k('stones.glow'), { x0: -30, y0: -30, x1: 30, y1: 30 }, glowDisc(0, 0, 28, C.stoneGlow, 0.8)));
    pieces.push({ key: k('stones.glow'), x: 0, y: -o.tall - 18, dz: 0.5, additive: true, shut: { alpha: 0 }, open: { alpha: 0.35 }, wake: { alpha: 0.3 }, sway: { alpha: 0.08, ms: 2600 } });
  }
  return {
    parts,
    opening: [],
    frame: [{ key: k('pillar'), x: -D, y: 0, dz: -D }],
    inside: [],
    front: [{ key: k('pillar.near'), x: D, y: 0, dz: D, flipX: true }],
    pieces,
    leaves: [{ front: k('arch'), back: k('arch.back'), hinge: 'left', x: -at, y: -o.tall - LH + 24, dz: -at, shutAngle: 45, restAngle: 45, wideAngle: 45, strips: 10, still: true }],
    light: { color: 0xc4dcff, radius: 300, intensity: 0.8, y: o.tall * 0.5 },
    glow: { color: 0xd8e6ff, pool: 0xd8e6ff },
    sparks: { colors: [0xd8f0ff, 0xe6dcff, 0xffffff], frame: 'fx.spark', rate: 1.1, size: 0.36 },
    sounds: { wake: ['crystal', 0.18, 1.5], open: [['shard', 0.4, 1.3], ['noteHigh', 0.3, 1.05]] },
    openMs: 1500,
    openEase: 'Cubic.easeInOut',
  };
}

/** b02's "Ay Kapısı": opens only when the Moon is out. */
export const moonDoor = (): DoorArt => crystalGate({ id: 'moon', tall: 236, sign: 'moon' });
/** r05's gate under the stone, opened by the memory stones on their plates. */
export const stoneGate = (): DoorArt => crystalGate({ id: 'stones', tall: 212, sign: 'stones' });
