import type { DoorArt, DoorPiece } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { leaf } from '../../characters/kit';
import { circleP, comic, crescent, darkOf, doorPart, fillP, glowDisc, holed, ink, lightOf, lining, LINE, page, poly, Rng, smooth, softStar, thread, tuft, twinkle, type Pt } from './doorKit';

// The hill's way on: a moon gate, a round opening in an old garden wall at
// the end of the meadow, the moon herself carved as its keystone. She dozes
// until Gorti comes; then she opens her eye, the moonflowers on the wall
// open one after another, and the paper stars hung in the ring swing and
// shine. Through the ring the next wood shows under the night: the stone
// trees, a pink trunk, the dark meadow, fireflies.

const C = {
  wall: '#aeb3c7',
  wall2: '#a3a8bf',
  wall3: '#b9bdd0',
  mortar: '#7d7f98',
  cope: '#c4c8d8',
  vouss: '#c7cde0',
  vouss2: '#bcc2d8',
  moon: '#d6eef6',
  moonCheek: '#f3b6c8',
  vine: '#8fb48c',
  leafy: '#a9cea3',
  flower: '#fbf8f0',
  throat: '#e8f0a8',
  bud: '#e9efe0',
  star: '#f6e7a6',
  star2: '#f3c1d3',
  star3: '#c9dcf3',
  thread: '#8d88a6',
  moss: '#a6c79a',
  // Inside: the wall's thickness, then the wood.
  in0: '#8e92ab',
  in1: '#7b7f99',
  floorIn: '#9aa48f',
  night: '#2f2e36',
  nightLow: '#45434f',
  hill: '#3f3d47',
  stoneTree: '#55525d',
  stoneTrunk: '#6e4a66',
  pink: '#c99ab8',
  crown: '#a9c79a',
  meadow: '#8fa889',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The ring: a circle of radius R standing on the floor. */
const R = 86;
const CY = -R - 2;
const OPEN: Pt[] = Array.from({ length: 44 }, (_, i) => {
  const a = (i / 44) * Math.PI * 2;
  return [Math.cos(a) * R, Math.min(0, CY + Math.sin(a) * R)] as Pt;
});
/** The wall: from its pier on the left to the room's side on the right. */
const LEFT = -170;
const RIGHT = 62;
const TOP = -236;

function wall(): string {
  const rng = new Rng(hashSeed('door.moon.wall'));
  // Its top: a coping that rises a little over the ring.
  const top = (x: number): number => TOP + 26 - 26 * Math.exp(-(x * x) / (2 * 70 * 70));
  const outline: Pt[] = [];
  for (let x = LEFT + 30; x <= RIGHT; x += 10) outline.push([x, top(x)]);
  outline.push([RIGHT, 4], [LEFT + 30, 4]);
  let stones = '';
  for (let row = 0; row < 9; row++) {
    const y = -4 - row * 27;
    let x = LEFT + 30 - (row % 2 ? 18 : 2);
    while (x < RIGHT) {
      const w = rng.range(26, 40);
      const cx = x + w / 2;
      const cy = y - 12;
      if (Math.hypot(cx, cy - CY) > R + 18 && cy > top(cx) + 8) {
        stones += comic(rrect(x + 1.5, y - 24, w - 3, 23, 8), rng.pick([C.wall, C.wall2, C.wall3]), { line: LINE.detail, rim: [2.4, -1.1], glint: [-0.8, 0.8] });
      }
      x += w;
    }
  }
  let s = comic(holed(outline, [OPEN]), C.mortar, { line: LINE.body, rim: [5, -2.2], glint: [-1, 1], hatch: 2.6, hatchWidth: 0.55, inner: stones });
  // The coping: flat stones along the top.
  for (let x = LEFT + 30; x < RIGHT; x += 24) {
    const w = Math.min(24, RIGHT - x);
    const y0 = top(x + w / 2);
    s += comic(rrect(x - 1, y0 - 6, w + 1, 12, 4), C.cope, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8] });
  }
  // The ring of wedge stones round the opening (the top one is the moon, a piece of her own).
  const n = 18;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + Math.PI / n;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 + Math.PI / n;
    if (i === n - 1) continue;
    const g = 0.015;
    const P = (a: number, r: number): Pt => [Math.cos(a) * r, CY + Math.sin(a) * r];
    const bottom = Math.sin((a0 + a1) / 2) > 0.92;
    if (bottom) continue;
    const d = poly([P(a0 + g, R - 1), P(a0 + g, R + 19), P(a1 - g, R + 19), P(a1 - g, R - 1)].map(([x, y]) => [x, Math.min(3, y)] as Pt));
    s += comic(d, i % 2 ? C.vouss : C.vouss2, { line: LINE.small, rim: [2.4, -1.1], glint: [-0.8, 0.8] });
  }
  // The pier at the wall's left end, with its round cap stone.
  s += comic(rrect(LEFT, TOP + 14, 44, -TOP - 10, 6), C.wall3, {
    line: LINE.body,
    rim: [4.5, -2],
    glint: [-1, 1],
    hatch: 2.6,
    hatchWidth: 0.55,
    inner: ink(`M${LEFT} ${TOP + 70}h44M${LEFT} ${TOP + 130}h44M${LEFT} ${TOP + 190}h44`, LINE.detail, darkOf(C.wall3, 0.35)),
  });
  s += comic(ellipsePath(LEFT + 22, TOP + 12, 30, 12), C.cope, { line: LINE.small, rim: [2.4, -1.1], glint: [-0.8, 0.8] });
  s += comic(circleP(LEFT + 22, TOP - 6, 13), C.cope, { line: LINE.small, rim: [3, -1.4], glint: [-1, 1] });
  // Moss and grass at its foot, a vine up the ring's left side.
  for (const x of [LEFT + 6, LEFT + 40, -110, -80, 40]) s += tuft(x, 2, 9, C.moss, x);
  const vine: Pt[] = [[-120, 2], [-118, -40], [-104, -96], [-96, -140], [-76, -170], [-48, -192], [-20, -204]];
  s += ink(smooth(vine, 1, false), 1.6, darkOf(C.vine, 0.25));
  vine.forEach(([x, y], i) => {
    if (i > 0) s += leaf([x, y], i % 2 ? -0.6 : Math.PI + 0.5, 12, i % 2 ? C.leafy : C.vine);
  });
  void rng;
  return s;
}

/** The moon, the keystone (her pivot at her middle): asleep, or awake. */
function moon(awake: boolean): string {
  const d = crescent(8, 0, 24, 1.28);
  let s = comic(d, C.moon, { line: LINE.limb, rim: [3, -1.4], glint: [-1, 1] });
  s += fillP(ellipsePath(-12, 9, 4, 2.4), C.moonCheek, 0.8);
  if (awake) {
    s += comic(ellipsePath(-12, -2, 4.4, 5.4), '#ffffff', { line: LINE.detail, ink: darkOf(C.moon, 0.6) });
    s += fillP(circleP(-13, -1, 2.8), '#e2779d') + fillP(circleP(-13, -1, 1.3), '#4a3546') + fillP(circleP(-12, -2.4, 0.8), '#ffffff');
    s += ink('M-17 -8Q-12 -11 -7 -7.5', 1, darkOf(C.moon, 0.6));
    s += ink('M-15 15Q-11 18 -7 15', 1, darkOf(C.moon, 0.6));
  } else {
    s += ink('M-17 -1Q-12 3 -7 -1', 1.2, darkOf(C.moon, 0.6)) + ink('M-15 1.6l-1 2.4M-12 2.4v2.6M-9 1.6l1 2.4', 0.8, darkOf(C.moon, 0.6));
    s += ink('M-14 15Q-11 16.5 -8 15', 1, darkOf(C.moon, 0.6));
  }
  return s;
}

/** A moonflower: shut (a twisted bud) or open (a white trumpet, seen into). */
function flower(open: boolean): string {
  if (!open) {
    let s = comic(smooth([[-3, 0], [-4, -8], [0, -16], [4, -8], [3, 0]]), C.bud, { line: LINE.detail, rim: [1, -0.5], over: ink('M-2 -2Q2 -8 -1 -14', 0.6, darkOf(C.bud, 0.3)) });
    s += leaf([0, 0], Math.PI / 2 + 0.6, 7, C.leafy);
    return s;
  }
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? 7.5 : 10;
    pts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  let s = comic(smooth(pts, 0.8), C.flower, { line: LINE.detail, rim: [1.4, -0.6], glint: [-0.5, 0.5] });
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    s += ink(`M${f(Math.cos(a) * 3)} ${f(Math.sin(a) * 3)}L${f(Math.cos(a) * 9)} ${f(Math.sin(a) * 9)}`, 0.5, darkOf(C.flower, 0.2));
  }
  s += fillP(circleP(0, 0, 3.6), C.throat) + fillP(circleP(0, 0, 1.4), lightOf(C.throat, 0.4));
  s += glowDisc(0, 0, 13, '#ffffff', 0.25);
  return s;
}

/** A paper star on its thread (the thread's top at 0,0). */
function hanging(len: number, col: string, r: number): string {
  return thread([0, 0], [0, len], C.thread, 0.55) + comic(softStar(0, len + r * 0.8, r, 0.5, 0.1), col, { line: LINE.detail, rim: [1.2, -0.6], glint: [-0.5, 0.5] });
}

// ---------------------------------------------------------------- inside: through the wall, into the wood

function in0(): string {
  const over = lining(OPEN, { every: 16, thick: 14, fills: [lightOf(C.in0, 0.25), lightOf(C.in0, 0.32), lightOf(C.in0, 0.18)], seed: 91, round: 0.6, foot: -4 });
  return page(OPEN, -110, 110, -200, 12, C.in0, C.floorIn, { wallOver: over, rim: 4 });
}

const HOLE1: Pt[] = OPEN.map(([x, y]) => [x * 0.97, Math.min(0, CY + (y - CY) * 0.97)] as Pt);
function in1(): string {
  let over = lining(HOLE1, { every: 15, thick: 12, fills: [lightOf(C.in1, 0.25), lightOf(C.in1, 0.18)], seed: 92, round: 0.6, foot: -4 });
  for (const [x, y] of [[-70, -40], [74, -70], [-56, -150]] as const) over += leaf([x, y], x < 0 ? Math.PI + 0.4 : -0.4, 12, C.leafy);
  return page(HOLE1, -130, 130, -206, 22, C.in1, darkOf(C.floorIn, 0.1), { wallOver: over, rim: 4 });
}

/** The wood beyond, at night. */
function beyond(): string {
  const rng = new Rng(hashSeed('door.moon.beyond'));
  let s = `<linearGradient id="mgsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.night}"/><stop offset="1" stop-color="${C.nightLow}"/></linearGradient>`;
  s += `<rect x="-170" y="-230" width="340" height="232" fill="url(#mgsky)"/>`;
  for (let i = 0; i < 14; i++) s += fillP(circleP(rng.range(-160, 160), rng.range(-220, -90), rng.range(0.6, 1.3)), '#efeaff', rng.range(0.4, 0.8));
  s += comic(smooth([[-180, -60], [-100, -84], [-20, -74], [60, -92], [180, -70], [180, 4], [-180, 4]]), C.hill, { line: LINE.small, rim: [3, -1.4] });
  // Stone trees behind, the pink one before them.
  for (const [x, y, r] of [[-96, -110, 34], [90, -122, 38]] as const) {
    s += comic(rrect(x - 6, y, 12, -y, 4), C.stoneTrunk, { line: LINE.detail });
    s += comic(smooth([[x - r, y + 6], [x - r * 0.9, y - r * 0.8], [x - r * 0.1, y - r * 1.15], [x + r * 0.9, y - r * 0.75], [x + r, y + 8], [x, y + r * 0.35]]), C.stoneTree, { line: LINE.small, rim: [3, -1.4], over: ink(`M${f(x - 12)} ${f(y - 8)}q6 5 12 0M${f(x - 2)} ${f(y - 20)}q6 5 12 0`, 0.8, darkOf(C.stoneTree, 0.35)) });
  }
  s += comic(smooth([[-14, 4], [-10, -60], [-12, -120], [-6, -160], [6, -160], [10, -110], [8, -50], [16, 4]]), C.pink, { line: LINE.small, rim: [3, -1.4], glint: [-1, 1], over: ink('M-2 -20Q-4 -60 0 -110', 0.8, darkOf(C.pink, 0.3)) });
  for (const [x, y, r] of [[-30, -170, 34], [26, -176, 36], [0, -204, 30]] as const) s += comic(circleP(x, y, r), C.crown, { line: LINE.small, rim: [3, -1.4], glint: [-1, 1], over: ink(`M${f(x - 8)} ${f(y)}q6 5 12 0`, 0.8, darkOf(C.crown, 0.3)) });
  s += comic(smooth([[-180, -14], [-60, -22], [40, -16], [180, -24], [180, 92], [-180, 92]]), C.meadow, { line: LINE.small, rim: [3, -1.4] });
  for (let i = 0; i < 8; i++) s += tuft(rng.range(-150, 150), rng.range(-6, 40), rng.range(6, 9), lightOf(C.meadow, 0.1), 80 + i);
  for (const [x, y] of [[-60, -40], [50, -70], [10, -30], [-110, -90]] as const) s += glowDisc(x, y, 8, '#f6ffb0', 0.6) + fillP(circleP(x, y, 1.3), '#fffde0');
  s += twinkle(120, -190, 2.6, '#fff7d6', 0.5);
  return s;
}

/** The moon gate. */
export function moonGate(): DoorArt {
  const flowers: [number, number][] = [[-112, -70], [-98, -132], [-70, -180], [-30, -206], [54, -170]];
  const stars: [number, number, string, number][] = [[-34, 38, C.star, 7], [6, 22, C.star2, 6], [38, 30, C.star3, 6.5]];
  const parts = [
    doorPart('door.moon.wall', { x0: LEFT - 6, y0: TOP - 30, x1: RIGHT + 4, y1: 8 }, wall()),
    doorPart('door.moon.moon', { x0: -26, y0: -26, x1: 26, y1: 26 }, moon(false)),
    doorPart('door.moon.moon.awake', { x0: -26, y0: -26, x1: 26, y1: 26 }, moon(true)),
    doorPart('door.moon.bud', { x0: -8, y0: -18, x1: 8, y1: 4 }, flower(false)),
    doorPart('door.moon.bloom', { x0: -14, y0: -14, x1: 14, y1: 14 }, flower(true)),
    ...stars.map(([, len, col, r], i) => doorPart(`door.moon.star${i}`, { x0: -10, y0: -2, x1: 10, y1: len + r * 2 + 2 }, hanging(len, col, r))),
    doorPart('door.moon.in0', { x0: -110, y0: -200, x1: 110, y1: 12 }, in0()),
    doorPart('door.moon.in1', { x0: -130, y0: -206, x1: 130, y1: 22 }, in1()),
    doorPart('door.moon.beyond', { x0: -180, y0: -230, x1: 180, y1: 92 }, beyond()),
  ];
  const pieces: DoorPiece[] = [
    // The moon, dozing; she wakes as Gorti comes (her open eye fades in), and keeps an eye on him.
    { key: 'door.moon.moon', x: 0, y: CY - R - 8, dz: 2, sway: { angle: 2, ms: 3600 }, wake: { angle: -6, alpha: -1 }, wakeShut: true },
    { key: 'door.moon.moon.awake', x: 0, y: CY - R - 8, dz: 2, shut: { alpha: 0 }, open: { alpha: 0 }, sway: { angle: 2, ms: 3600 }, wake: { angle: -6, alpha: 1 }, wakeShut: true },
  ];
  flowers.forEach(([x, y], i) => {
    // Buds that open, one after another, as she wakes.
    pieces.push({ key: 'door.moon.bud', x, y, dz: 3, sway: { angle: 4, ms: 2500 + i * 300 }, wake: { alpha: -1, sx: 0.4, sy: 0.4 }, wakeShut: true, wakeAt: i * 0.12 });
    pieces.push({ key: 'door.moon.bloom', x, y: y - 6, dz: 3, shut: { alpha: 0, sx: 0.3, sy: 0.3 }, open: { alpha: 0, sx: 0.3, sy: 0.3 }, wake: { alpha: 1, sx: 3.3, sy: 3.3, angle: 20 - i * 9 }, wakeShut: true, wakeAt: i * 0.12, sway: { angle: 3, ms: 2700 + i * 200 } });
  });
  stars.forEach(([x], i) => {
    pieces.push({ key: `door.moon.star${i}`, x, y: CY - R + 6 + Math.abs(x) * 0.12, dz: 3, sway: { angle: 7 - i * 3, ms: 2300 + i * 400 }, wake: { angle: (i - 1) * 9 } });
  });
  return {
    parts,
    opening: OPEN,
    frame: [{ key: 'door.moon.wall', x: 0, y: 0, dz: 0 }],
    front: [],
    inside: [
      { key: 'door.moon.beyond', x: 0, y: 0, dz: -120, order: 0 },
      { key: 'door.moon.in1', x: 0, y: 0, dz: -34, order: 2 },
      { key: 'door.moon.in0', x: 0, y: 0, dz: -10, order: 3 },
    ],
    backdrop: 0x26252d,
    pieces,
    leaves: [],
    light: { color: 0xdff2ff, radius: 340, intensity: 0.85, y: 90 },
    glow: { color: 0xcfe4ff, pool: 0xe4f0ff },
    sparks: { colors: [0xf6ffb0, 0xfff7d6, 0xd6eef6], frame: 'fx.dot', rate: 1.1, size: 0.3 },
    sounds: { wake: ['noteHigh', 0.18, 1.5], peek: ['bloom', 0.3, 1.1] },
  };
}
