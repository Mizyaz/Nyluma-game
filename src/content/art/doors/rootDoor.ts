import type { DoorArt, DoorPiece } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { leaf } from '../../characters/kit';
import {
  archPts,
  barkRoot,
  bit,
  circleP,
  comic,
  crescent,
  crystals,
  darkOf,
  deckle,
  doorPart,
  fillP,
  glowDisc,
  holed,
  ink,
  lightOf,
  LINE,
  lining,
  page,
  poly,
  Rng,
  slab,
  smooth,
  tuft,
  twinkle,
  type Pt,
} from './doorKit';

// The fossil-root chamber's way on: the tunnel mouth in the far wall. A
// mouth of old stones set in an arch, overgrown by the roots, and closed by
// them: a curtain of root strands hangs across it, knotted in the middle
// round a sleepy eye. While it is shut the strands shiver as Gorti comes
// and the knot opens its eye to look at him; when the whales' song wakes
// the way on, the strands draw aside like curtains, the knot slips up into
// the arch, and the light of the crystal chamber spills out. Inside, rings
// of stone and root run down to a glimpse of that chamber: its grey-lilac
// stones, the moon carved in one of them, teal crystals and the tail of a
// whale sticking up out of its floor, which waves at Gorti.

const C = {
  mortar: '#77678c',
  stone: '#a895bd',
  stone2: '#9d8bb3',
  stone3: '#b19fc5',
  vouss: '#b6a6c9',
  key: '#c2b3d3',
  bark: '#c9a0c0',
  barkDark: '#ae86a8',
  tangle: '#94708f',
  leaf: '#a9cea3',
  moss: '#a6c79a',
  crystal: '#8fe0d0',
  crystal2: '#b9f0e6',
  crystal3: '#d4c4f2',
  eyeWhite: '#fbf4f8',
  iris: '#5fc9b5',
  pupil: '#2f2a3a',
  lid: '#a68cb7',
  // Inside.
  in0: '#5f5274',
  in0f: '#8a7d96',
  in1: '#57486a',
  in1f: '#7d6f8a',
  in2: '#6e6284',
  in2f: '#968aa4',
  in3: '#7d7294',
  in3f: '#ab9fb7',
  farWall: '#968fae',
  farStone: '#aea7c3',
  farFloor: '#e8d8de',
  whale: '#aab4e3',
  whaleBelly: '#dfe4f8',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The mouth: a rough arch 100 wide, 216 high. */
const W = 100;
const H = 216;
const RISE = 50;
const OPEN = deckle(archPts(W, H, { rise: RISE, n: 30 }), 0.9, hashSeed('door.root.open'), 6).map(([x, y]) => [x, Math.min(0, y)] as Pt);
/** Where the slab of the far wall ends (its right edge meets the room's side wall). */
const LEFT = -98;
const RIGHT = 68;
const TOP = -900;

/** The arch's top edge at x (y, negative up). */
function archTop(x: number): number {
  const r = W / 2;
  const u = Math.max(-1, Math.min(1, x / r));
  return -(H - RISE) - RISE * Math.sqrt(1 - u * u);
}

/** The far wall: stones, the arch of wedge stones round the mouth, roots over it all, crystals, moss. */
function wall(): string {
  const rng = new Rng(hashSeed('door.root.wall'));
  // The slab's outline: a straight right edge against the side wall, stones jutting on the left.
  const outer: Pt[] = [[RIGHT, 4], [RIGHT, TOP]];
  for (let y = TOP; y < 4; y += 26) outer.push([LEFT + rng.range(-4, 6), Math.min(4, y)]);
  outer.push([LEFT, 4]);
  const ordered: Pt[] = [[LEFT, TOP], ...outer.slice(2, -1).reverse(), [LEFT, 4]];
  const outline: Pt[] = [[LEFT, TOP], [RIGHT, TOP], [RIGHT, 4], [LEFT, 4], ...ordered.reverse().slice(1, -1)];
  let stones = '';
  // Courses of rounded stones, skipping the mouth and its arch.
  for (let row = 0; row * 30 < -TOP; row++) {
    const y = -6 - row * 30;
    let x = LEFT - (row % 2 ? 22 : 4);
    while (x < RIGHT) {
      const w = rng.range(30, 46);
      const cx = x + w / 2;
      const inArch = Math.abs(cx) < W / 2 + 26 && y - 13 > archTop(Math.min(W / 2, Math.abs(cx))) - 26;
      if (!inArch) {
        const col = rng.pick([C.stone, C.stone2, C.stone3]);
        stones += comic(rrect(x + 1.5, y - 26, w - 3, 25, 9), col, { line: LINE.detail, rim: [2.6, -1.2], glint: [-0.9, 0.9], hatch: 0 });
        if (rng.chance(0.18)) stones += ink(`M${f(x + w * 0.3)} ${f(y - 22)}l${f(rng.range(2, 6))} ${f(rng.range(5, 9))}l${f(rng.range(-2, 3))} ${f(rng.range(4, 7))}`, 0.6, darkOf(col, 0.4));
      }
      x += w;
    }
  }
  let s = comic(holed(outline, [OPEN]), C.mortar, { line: LINE.body, rim: [5, -2.2], glint: [-1, 1], hatch: 2.6, hatchWidth: 0.55, inner: stones });
  // The arch: wedge stones round the mouth, a keystone with the moon carved in it.
  const n = 13;
  for (let i = 0; i < n; i++) {
    const t0 = Math.PI - (i / n) * Math.PI;
    const t1 = Math.PI - ((i + 1) / n) * Math.PI;
    const ring = (t: number, k: number): Pt => [Math.cos(t) * (W / 2 + k), -(H - RISE) - Math.sin(t) * (RISE + k)];
    const g = 0.012;
    const d = poly([ring(t0 - g, 1), ring(t0 - g, 24 + (i % 2) * 3), ring(t1 + g, 24 + (i % 2) * 3), ring(t1 + g, 1)]);
    const key = i === Math.floor(n / 2);
    s += comic(d, key ? C.key : i % 2 ? C.vouss : lightOf(C.vouss, 0.12), { line: LINE.small, rim: [2.4, -1.1], glint: [-0.8, 0.8] });
    if (key) {
      const [kx, ky] = ring((t0 + t1) / 2, 13);
      s += ink(crescent(kx + 2, ky, 6, 1.3), 0.9, darkOf(C.key, 0.45));
    }
  }
  // Jamb stones down both sides to the floor.
  for (const sx of [-1, 1]) {
    for (let k = 0; k < 6; k++) {
      const y1 = -k * 28;
      const y0 = y1 - 27;
      if (y0 < -(H - RISE) - 2) continue;
      const x0 = sx < 0 ? -W / 2 - 25 - (k % 2) * 3 : W / 2 + 1;
      const x1 = sx < 0 ? -W / 2 - 1 : W / 2 + 25 + (k % 2) * 3;
      s += comic(rrect(x0, y0 + 1, x1 - x0, 26, 4), k % 2 ? C.vouss : lightOf(C.vouss, 0.1), { line: LINE.small, rim: [2.4, -1.1], glint: [-0.8, 0.8] });
    }
  }
  // Roots: two great ones down the sides, one across, rootlets over the mouth.
  s += barkRoot([[-74, TOP], [-80, -700], [-64, -520], [-76, -380], [-70, -250], [-84, -120], [-80, -40], [-92, 2]], 26, 13, C.bark, 1);
  s += barkRoot([[-80, -40], [-66, -12], [-56, 3]], 10, 5, C.bark, 2);
  s += barkRoot([[44, TOP], [52, -760], [36, -600], [54, -430], [60, -300], [72, -220]], 22, 12, C.bark, 3);
  s += barkRoot([[-92, -610], [-40, -560], [10, -575], [60, -520], [70, -500]], 14, 9, C.barkDark, 4);
  s += barkRoot([[-70, -330], [-46, -296], [-20, -282], [6, -288]], 11, 4, C.bark, 5);
  s += barkRoot([[56, -320], [34, -296], [26, -270], [30, -252]], 9, 3, C.bark, 6);
  for (const [x, len, cur] of [[-30, 26, 1], [-6, 18, -1], [16, 30, 1]] as const) {
    const y0 = archTop(x) - 24;
    s += barkRoot([[x, y0], [x + cur * 3, y0 + len * 0.5], [x - cur * 2, y0 + len], [x + cur * 3, y0 + len + 4]], 5, 2, C.bark, 7 + x);
  }
  s += leaf([-72, -360], -2.6, 16, C.leaf) + leaf([60, -300], -0.6, 14, C.leaf) + leaf([-40, -296], -2.2, 12, C.leaf);
  // Crystals in the cracks and at its foot; moss on the stones.
  s += crystals(-80, 0, 34, [C.crystal, C.crystal2, C.crystal], 11);
  s += crystals(58, -2, 22, [C.crystal3, C.crystal], 12);
  s += crystals(-64, -456, 18, [C.crystal, C.crystal2], 13, 1.2);
  for (const [x, y, k] of [[-56, -170, 10], [-30, -222, 8], [40, -205, 9], [60, -96, 8], [-62, -64, 9]] as const) s += tuft(x, y, k, C.moss, x * 7 + y);
  return s;
}

/** One root strand of the curtain, hanging `len` from its top (0,0). */
function strand(len: number, seed: number, w0: number, curl: number, leaves: number): string {
  const rng = new Rng(seed);
  const pts: Pt[] = [];
  const amp = rng.range(2.5, 4.5);
  const ph = rng.range(0, Math.PI * 2);
  const k = rng.range(1.2, 2);
  for (let i = 0; i <= 10; i++) {
    const y = (len * i) / 10;
    pts.push([amp * Math.sin((y / len) * Math.PI * k + ph) - amp * Math.sin(ph), y]);
  }
  // A curl at the bottom, lying on the floor.
  const end = pts[pts.length - 1]!;
  pts.push([end[0] + curl * 5, end[1] + 1], [end[0] + curl * 8, end[1] - 3], [end[0] + curl * 6, end[1] - 6]);
  // Rootlets off its sides, under it.
  let s = '';
  for (let i = 0; i < 3; i++) {
    const at = pts[2 + i * 3]!;
    const side = (i + seed) % 2 ? 1 : -1;
    const l = rng.range(7, 12);
    s += barkRoot([[at[0], at[1]], [at[0] + side * l * 0.6, at[1] + l * 0.4], [at[0] + side * l, at[1] + l * 0.9]], 3, 1, C.barkDark, seed * 7 + i, { grooves: 0 });
  }
  s += barkRoot(pts, w0, 3.5, C.bark, seed, { grooves: 2 });
  for (let i = 0; i < leaves; i++) {
    const at = pts[3 + i * 3]!;
    s += leaf([at[0] + (i % 2 ? 2 : -2), at[1]], i % 2 ? -0.3 : Math.PI + 0.3, 11, C.leaf);
  }
  return s;
}

/** A tie-back: a young green root wound twice round a bunch of strands, a leaf and a curl (its pivot in the middle). */
function tie(): string {
  const green = '#9cc994';
  let s = '';
  for (const [y, w] of [[-3.5, 4], [2.5, 4.4]] as const) s += barkRoot([[-12, y + 1.5], [-4, y - 1], [5, y - 0.5], [12, y + 1.6]], w, w, green, 500 + y, { grooves: 0 });
  s += barkRoot([[11, 1], [16, 4], [18, 10], [14, 13], [12, 9]], 3, 1.6, green, 503, { grooves: 0 });
  s += leaf([-11, -1], Math.PI + 0.6, 10, C.leaf) + leaf([10, -3], -0.5, 9, C.leaf);
  return s;
}

/** Roots grown together behind the strands, lacing the mouth shut (its pivot at the top of the mouth). */
function tangle(): string {
  const rng = new Rng(hashSeed('door.root.tangle'));
  let s = '';
  // Across, from jamb to jamb, sagging, one under another.
  for (let i = 0; i < 9; i++) {
    const y = 26 + i * 21 + rng.range(-4, 4);
    const sag = rng.range(4, 10);
    const half = W / 2 + 6;
    const pts: Pt[] = [];
    for (let j = 0; j <= 8; j++) {
      const u = j / 8;
      pts.push([-half + u * half * 2, y + Math.sin(u * Math.PI) * sag + Math.sin(u * 9 + i) * 1.6]);
    }
    s += barkRoot(i % 2 ? pts : [...pts].reverse(), rng.range(4.5, 7), 2.5, i % 3 ? C.tangle : darkOf(C.tangle, 0.12), 300 + i, { grooves: 1 });
  }
  // A few down and slanting, through them.
  for (let i = 0; i < 5; i++) {
    const x0 = -40 + i * 20 + rng.range(-5, 5);
    const pts: Pt[] = [];
    for (let j = 0; j <= 6; j++) pts.push([x0 + Math.sin(j * 1.3 + i) * 6 + (j - 3) * (i % 2 ? 2 : -2), 10 + j * 32]);
    s += barkRoot(pts, 5, 3, darkOf(C.tangle, 0.06), 320 + i, { grooves: 1 });
  }
  return s;
}

/** The knot in the middle of the curtain: loops of root round a sleepy eye. */
function knot(): string {
  const loop = (rx: number, ry: number, rot: number, w: number, seed: number, from = 0, to = 1): string => {
    const pts: Pt[] = [];
    const c = Math.cos(rot);
    const sn = Math.sin(rot);
    for (let i = 0; i <= 14; i++) {
      const t = (from + ((to - from) * i) / 14) * Math.PI * 2;
      const x = Math.cos(t) * rx;
      const y = Math.sin(t) * ry;
      pts.push([x * c - y * sn, x * sn + y * c]);
    }
    return barkRoot(pts, w, w * 0.8, C.bark, seed, { grooves: 1 });
  };
  let s = comic(ellipsePath(0, 0, 17, 12.5), C.barkDark, { line: LINE.small, rim: [2.4, -1.1], hatch: 2, hatchWidth: 0.5 });
  s += loop(23, 11, 0.35, 6.5, 401, 0.05, 0.92) + loop(20, 13, -0.6, 6, 402, 0.5, 1.4) + loop(17, 14.5, 1.3, 5.5, 403, 0.2, 1.05);
  // Two ends sticking out, a leaf on one.
  s += barkRoot([[18, -8], [26, -15], [30, -24]], 5, 2, C.bark, 404) + barkRoot([[-18, 9], [-27, 13], [-31, 21]], 5, 2, C.bark, 405);
  s += leaf([30, -24], -1.1, 10, C.leaf);
  // The eye's socket, and its lid shut with lashes.
  s += comic(smooth([[-12, 0], [0, -7.5], [12, 0], [0, 7]]), C.lid, { line: LINE.detail, rim: [1.4, -0.6] });
  s += ink('M-11 0.5Q0 7 11 0.5', 1.1, darkOf(C.lid, 0.6));
  for (const [x, a] of [[-6, -0.5], [0, 0], [6, 0.5]] as const) s += ink(`M${f(x)} ${f(4)}l${f(Math.sin(a) * 3)} ${f(3.4)}`, 0.9, darkOf(C.lid, 0.6));
  return s;
}

/** Its eye, open (faded in over the shut one as Gorti comes); the iris is a piece of its own, to look at him. */
function knotEye(): string {
  let s = fillP(smooth([[-12.5, 0], [0, -8], [12.5, 0], [0, 7.5]]), C.lid);
  s += comic(smooth([[-10.5, 0.5], [0, -6.4], [10.5, 0.5], [0, 5.6]]), C.eyeWhite, { line: LINE.detail, ink: darkOf(C.lid, 0.6) });
  s += ink('M-11 -0.5Q0 -9.5 11 -0.5', 1.1, darkOf(C.lid, 0.6));
  return s;
}

function knotIris(): string {
  let s = comic(circleP(0, 0, 4.2), C.iris, { line: 0.6, ink: darkOf(C.iris, 0.5) });
  s += fillP(circleP(0, 0, 2), C.pupil) + fillP(circleP(1.1, -1.4, 0.9), '#ffffff');
  return s;
}

// ---------------------------------------------------------------- inside: down to the crystal chamber

function ring(hole: Pt[], x0: number, x1: number, y0: number, y1: number, fill: string, floor: string, over: string): string {
  return page(hole, x0, x1, y0, y1, fill, floor, { wallOver: over, rim: 4 });
}

function in0(): string {
  const rng = new Rng(hashSeed('door.root.in0'));
  let over = '';
  for (let i = 0; i < 16; i++) over += bit(ellipsePath(rng.range(-96, 96), rng.range(-240, -4), rng.range(4, 8), rng.range(3, 5)), lightOf(C.in0, 0.15), 12);
  // The mouth's own stones, seen edge on as the eye goes by.
  over += lining(OPEN, { every: 17, thick: 13, fills: [lightOf(C.in0, 0.22), lightOf(C.in0, 0.3), lightOf(C.in0, 0.16)], seed: 101, round: 0.6 });
  return ring(OPEN, -100, 100, -246, 10, C.in0, C.in0f, over);
}

const HOLE1 = deckle(archPts(96, 210, { rise: 48 }), 1.2, 21, 6).map(([x, y]) => [x, Math.min(0, y)] as Pt);
function in1(): string {
  // Roots lining the tunnel, mushrooms glowing at their feet.
  let over = '';
  for (let k = 0; k < 4; k++) {
    const r = 51 + k * 9;
    const pts: Pt[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = Math.PI - (i / 12) * Math.PI;
      pts.push([Math.cos(t) * (r + Math.sin(i * 1.7 + k) * 3), -(210 - 48) - Math.sin(t) * (r - 6 + Math.sin(i + k) * 3)]);
    }
    over += barkRoot([[pts[0]![0], 0], ...pts, [pts[pts.length - 1]![0], 0]], 9 - k, 7 - k, k % 2 ? C.barkDark : C.bark, 30 + k, { grooves: 1 });
  }
  let s = ring(HOLE1, -120, 120, -250, 20, C.in1, C.in1f, over);
  for (const [x, h] of [[-44, 9], [-36, 6], [40, 8]] as const) {
    s += comic(`M${f(x - 1)} 0L${f(x - 1)} ${f(-h)}L${f(x + 1)} ${f(-h)}L${f(x + 1)} 0Z`, '#e8e2ee', { line: 0.6 });
    s += comic(smooth([[x - 5, -h], [x, -h - 4.5], [x + 5, -h]]), '#9ff0de', { line: 0.7 });
  }
  return s;
}

const HOLE2 = deckle(archPts(94, 204, { rise: 47 }), 1.4, 22, 6).map(([x, y]) => [x, Math.min(0, y)] as Pt);
function in2(): string {
  const rng = new Rng(hashSeed('door.root.in2'));
  let over = '';
  for (let i = 0; i < 22; i++) {
    const a = rng.range(-0.1, Math.PI + 0.1);
    const r = rng.range(58, 120);
    const x = Math.cos(a) * r;
    const y = -158 - Math.sin(a) * r * 0.7;
    over += bit(ellipsePath(x, y, rng.range(7, 12), rng.range(4, 7)), lightOf(C.in2, 0.18), 20);
  }
  over += lining(HOLE2, { every: 15, thick: 12, fills: [lightOf(C.in2, 0.2), lightOf(C.in2, 0.28), lightOf(C.in2, 0.12)], seed: 102, round: 0.6 });
  let s = ring(HOLE2, -140, 140, -250, 30, C.in2, C.in2f, over);
  s += crystals(-47, -40, 18, [C.crystal, C.crystal2], 41, 1.4);
  s += crystals(47, -96, 15, [C.crystal2, C.crystal], 42, 1.4);
  s += crystals(-40, -180, 13, [C.crystal, C.crystal3], 43, 1.4);
  return s;
}

const HOLE3 = deckle(archPts(92, 198, { rise: 46 }), 1.2, 23, 6).map(([x, y]) => [x, Math.min(0, y)] as Pt);
function in3(): string {
  // Glow-worms hanging on their threads from the tunnel's roof.
  let over = '';
  for (let k = 0; k < 3; k++) {
    const r = 49 + k * 9;
    const pts: Pt[] = [];
    for (let i = 0; i <= 10; i++) {
      const t = Math.PI - (i / 10) * Math.PI;
      pts.push([Math.cos(t) * r, -(198 - 46) - Math.sin(t) * (r - 2)]);
    }
    over += barkRoot([[pts[0]![0], 0], ...pts, [pts[pts.length - 1]![0], 0]], 7 - k, 6 - k, C.barkDark, 50 + k, { grooves: 1 });
  }
  let s = ring(HOLE3, -160, 160, -250, 40, C.in3, C.in3f, over);
  for (const [x, len] of [[-22, 30], [-4, 46], [14, 24], [30, 38]] as const) {
    const top = -192 + Math.abs(x) * 0.5;
    s += ink(`M${f(x)} ${f(top)}L${f(x + 0.6)} ${f(top + len)}`, 0.5, '#d9e9e6');
    s += glowDisc(x + 0.6, top + len + 1.5, 4.5, '#c8fff2') + fillP(circleP(x + 0.6, top + len + 1.5, 1.6), '#eafff9');
  }
  return s;
}

/** The crystal chamber beyond: grey-lilac stones, the carved moon, crystals, its pale floor. */
function beyond(): string {
  const rng = new Rng(hashSeed('door.root.beyond'));
  let s = `<rect x="-170" y="-250" width="340" height="252" fill="${C.farWall}"/>`;
  s += glowDisc(0, -96, 120, '#e9fff8', 0.6);
  for (let row = 0; row < 9; row++) {
    const y = -8 - row * 30;
    for (let x = -176 + (row % 2 ? 24 : 0); x < 170; x += 50) {
      const w = rng.range(42, 48);
      const near = Math.abs(x + w / 2) < 46 && y > -200;
      if (near && rng.chance(0.75)) continue;
      s += comic(rrect(x, y - 26, w, 25, 9), C.farStone, { line: LINE.detail, rim: [2, -1], glint: [-0.7, 0.7] });
    }
  }
  // The moon carved in a stone up on the left.
  s += ink(crescent(-62, -165, 11, 1.3), 1, darkOf(C.farStone, 0.35));
  s += fillP(rrect(-170, -1, 340, 92, 0), C.farFloor) + ink('M-170 0H170', LINE.small, darkOf(C.farFloor, 0.3));
  s += crystals(-42, 0, 40, [C.crystal, C.crystal2, C.crystal], 61);
  s += crystals(-74, 0, 22, [C.crystal2, C.crystal], 62);
  s += crystals(58, 0, 30, [C.crystal3, C.crystal], 63);
  for (let i = 0; i < 7; i++) s += bit(ellipsePath(rng.range(-120, 120), rng.range(8, 60), rng.range(2.4, 4.5), rng.range(1.5, 2.6)), '#d9c9d2', 8);
  s += twinkle(-30, -120, 3.4, '#f6fffd', 0.5) + twinkle(36, -150, 2.6, '#f6fffd', 0.5) + twinkle(10, -70, 2.2, '#f6fffd', 0.5);
  return s;
}

/** The tail of the chamber's whale, up out of the floor (its pivot at the floor). */
function tail(): string {
  const d = smooth([
    [-6, 2],
    [-5, -14],
    [-3, -26],
    [-14, -34],
    [-20, -40],
    [-8, -38],
    [0, -32],
    [8, -38],
    [20, -42],
    [14, -33],
    [4, -26],
    [6, -12],
    [6, 2],
  ]);
  let s = comic(d, C.whale, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8], over: ink('M-1 -30Q0 -16 0 0', 0.7, darkOf(C.whale, 0.3)) });
  s += `<ellipse cx="0" cy="2" rx="12" ry="2.6" fill="${darkOf(C.farFloor, 0.25)}" opacity="0.7"/>`;
  return s;
}

/** The mouth of the root tunnel, closed until the song. */
export function rootDoor(): DoorArt {
  const xs = [-42, -30, -18, -6, 6, 18, 30, 42];
  const strands: { x: number; len: number; w: number; curl: number; leaves: number }[] = xs.map((x, i) => ({
    x,
    len: -archTop(x) - 2,
    w: 12 - Math.abs(i - 3.5) * 0.5,
    curl: x < 0 ? -1 : 1,
    leaves: i % 3 === 1 ? 2 : 1,
  }));
  const parts = [
    doorPart('door.root.wall', { x0: LEFT - 10, y0: TOP - 4, x1: RIGHT + 4, y1: 8 }, wall()),
    doorPart('door.root.knot', { x0: -36, y0: -34, x1: 36, y1: 30 }, knot()),
    doorPart('door.root.knot.eye', { x0: -14, y0: -10, x1: 14, y1: 9 }, knotEye()),
    doorPart('door.root.knot.iris', { x0: -5, y0: -5, x1: 5, y1: 5 }, knotIris()),
    doorPart('door.root.tangle', { x0: -60, y0: 0, x1: 60, y1: H + 4 }, tangle()),
    doorPart('door.root.tie', { x0: -22, y0: -12, x1: 22, y1: 16 }, tie()),
    ...strands.map((s, i) => doorPart(`door.root.strand${i}`, { x0: -14, y0: -4, x1: 14, y1: s.len + 6 }, strand(s.len, 70 + i, s.w, s.curl, s.leaves))),
    doorPart('door.root.in0', { x0: -100, y0: -246, x1: 100, y1: 10 }, in0()),
    doorPart('door.root.in1', { x0: -120, y0: -250, x1: 120, y1: 20 }, in1()),
    doorPart('door.root.in2', { x0: -140, y0: -250, x1: 140, y1: 30 }, in2()),
    doorPart('door.root.in3', { x0: -160, y0: -250, x1: 160, y1: 40 }, in3()),
    doorPart('door.root.beyond', { x0: -170, y0: -250, x1: 170, y1: 91 }, beyond()),
    doorPart('door.root.tail', { x0: -24, y0: -46, x1: 24, y1: 6 }, tail()),
  ];
  const pieces: DoorPiece[] = strands.map((s, i) => {
    const side = s.x < 0 ? -1 : 1;
    // Its place in the bunch it is drawn into at the jamb (0: outermost).
    const k = side < 0 ? i : strands.length - 1 - i;
    const top = archTop(s.x) + 4;
    const nx = side * (W / 2 - 5 - k * 4.2);
    const ny = archTop(nx) + 4;
    return {
      key: `door.root.strand${i}`,
      x: s.x,
      y: top,
      dz: 2 + (i % 2) * 0.5,
      // Hanging tangled across the mouth; drawn aside like curtains to the jambs.
      shut: { angle: (i % 2 ? 1 : -1) * (2 + (i % 3)) },
      open: { x: nx - s.x, y: ny - top, angle: -side * (3 + k * 1.5), sy: ((-ny - 2) / s.len) * 0.97 },
      lag: 0.05 + (3 - k) * 0.07,
      // While shut they shiver as Gorti comes; once open they sway a little.
      sway: { angle: 1.4, ms: 2100 + i * 230 },
      wake: { angle: -side * 2.5 },
      wakeShut: true,
    };
  });
  // The knot climbs into the crown of the arch as the strands part, and
  // keeps watching from there; its eye opens as Gorti comes, follows him
  // and blinks.
  const knotUp = { y: archTop(0) + 20 - -112, sx: 0.66, sy: 0.66 };
  const knotSway = { angle: 2, y: 1.2, ms: 2600 };
  pieces.unshift({ key: 'door.root.tangle', inside: true, x: 0, y: -H - 2, dz: -3, order: 50, shut: {}, open: { sy: 0.12, y: -6, alpha: 0 }, lag: 0, sway: { y: 0.8, ms: 3100 } });
  pieces.push(
    { key: 'door.root.knot', x: 0, y: -112, dz: 3, shut: {}, open: knotUp, lag: 0.15, sway: knotSway, wake: { y: -3 }, wakeShut: true },
    { key: 'door.root.knot.eye', x: 0, y: -112, dz: 3, shut: { alpha: 0 }, open: { ...knotUp, alpha: 0 }, lag: 0.15, wake: { y: -3, alpha: 1 }, wakeShut: true, sway: knotSway, blink: true },
    { key: 'door.root.knot.iris', x: 0, y: -112, dz: 3, shut: { alpha: 0 }, open: { ...knotUp, alpha: 0 }, lag: 0.15, wake: { y: -3, alpha: 1 }, wakeShut: true, sway: knotSway, blink: true, look: { x: 3.6, y: 0.8 } },
    { key: 'door.root.tail', inside: true, x: 46, y: 0, dz: -128, order: 1, sway: { angle: 5, ms: 2400 }, peek: { y: -10, angle: -8 } },
    // Once drawn aside, the bunches tie themselves back.
    { key: 'door.root.tie', x: -47, y: -78, dz: 3, shut: { alpha: 0, sx: 0.2, sy: 0.2 }, open: {}, lag: 0.72 },
    { key: 'door.root.tie', x: 47, y: -80, dz: 3, flipX: true, shut: { alpha: 0, sx: 0.2, sy: 0.2 }, open: {}, lag: 0.78 },
  );
  return {
    parts,
    opening: OPEN,
    frame: [{ key: 'door.root.wall', x: 0, y: 0, dz: 0 }],
    front: [],
    inside: [
      { key: 'door.root.beyond', x: 0, y: 0, dz: -132, order: 0 },
      { key: 'door.root.in3', x: 0, y: 0, dz: -86, order: 2 },
      { key: 'door.root.in2', x: 0, y: 0, dz: -54, order: 3 },
      { key: 'door.root.in1', x: 0, y: 0, dz: -26, order: 4 },
      { key: 'door.root.in0', x: 0, y: 0, dz: -8, order: 5 },
    ],
    backdrop: 0x2f2a3d,
    shutDim: 0.45,
    pieces,
    leaves: [],
    light: { color: 0xa8f0e0, radius: 340, intensity: 1, y: 96 },
    glow: { color: 0x9fe6da, pool: 0xb6f2e2 },
    sparks: { colors: [0x9ff0de, 0xd8fff6, 0xc9b8f2], frame: 'fx.dot', rate: 1.6, size: 0.32 },
    sounds: { wake: ['root', 0.3, 1.25], open: [['rootGrow', 0.9, 1]], peek: ['drip', 0.35, 0.8] },
    openMs: 1700,
    openEase: 'Back.easeOut',
  };
}

void slab;
