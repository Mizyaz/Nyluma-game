import type { DoorArt } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { leaf } from '../../characters/kit';
import { archPts, barkRoot, circleP, comic, crescent, darkOf, doorPart, fillP, glowDisc, holed, ink, leafPart, lightOf, LINE, page, poly, Rng, smooth, tuft, twinkle, type Pt } from './doorKit';

// The painted day's way on: a stage door. A flat of the set stands in the
// corner, a double door painted in it and a cut-out sun on a stick over
// it, the stage's own sun: sad, eyes shut, a tear on her cheek. When the
// room is done she opens her eyes and smiles, her rays turn, the marquee
// lights up, and the two leaves are flung apart (the sun painted across
// them splits in two); behind, the stage's curtains are drawn back on the
// night of the next room, and a sparrow hops along its branch to look at
// Gorti.

const C = {
  flat: '#efe0c4',
  flat2: '#e6d3b2',
  trim: '#c9a57e',
  trimLight: '#dcbf9b',
  brace: '#b78d6a',
  bag: '#c8b79a',
  rope: '#9b8466',
  leafA: '#f5c9a6',
  leafB: '#f2b8a0',
  paintSun: '#f7da74',
  paintRay: '#f9e7a6',
  sunFace: '#f6ad67',
  ray: '#f5e06c',
  rayTip: '#b9d877',
  cheek: '#f08fa6',
  iris: '#e2779d',
  tear: '#bfe3f5',
  stick: '#a9825f',
  // Inside: the flat's edge, the dark wings, the night of the next room.
  edge: '#d9c3a0',
  wings: '#4a4057',
  floorIn: '#6d6380',
  sky: '#4b4766',
  band: '#8e8ab8',
  bandLine: '#b6b2dc',
  stoneTree: '#77737f',
  stoneTrunk: '#7c5a78',
  pink: '#c99ab8',
  crown: '#a9c79a',
  meadow: '#a9c7a2',
  curtain: '#de9aaf',
  valance: '#c8869f',
  rope2: '#e8c46e',
  bird: '#c99a74',
  birdBelly: '#f2dcc2',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The doorway in the flat: 92 wide, 178 high, round topped. */
const W = 92;
const H = 178;
const RISE = 46;
const OPEN = archPts(W, H, { rise: RISE, n: 30 });
/** The flat: a panel of the set, braced from behind. */
const FL = -96;
const FR = 84;
const FT = -282;

function flat(): string {
  const rng = new Rng(hashSeed('door.sun.flat'));
  const outer: Pt[] = [
    [FL, FT],
    [FR, FT],
    [FR, 2],
    [FL, 2],
  ];
  // Painted wallpaper: soft stripes and little painted stars.
  let paint = '';
  for (let x = FL + 10; x < FR; x += 22) paint += fillP(rrect(x, FT, 9, -FT + 2, 0), C.flat2, 0.8);
  for (let i = 0; i < 9; i++) {
    const x = rng.range(FL + 8, FR - 8);
    const y = rng.range(FT + 10, -20);
    if (Math.abs(x) < W / 2 + 18 && y > -H - 34) continue;
    paint += twinkle(x, y, 2.4, '#f6eed8', 0.5);
  }
  let s = comic(holed(outer, [OPEN]), C.flat, { line: LINE.body, rim: [5, -2.2], glint: [-1, 1], hatch: 2.6, hatchWidth: 0.5, inner: paint });
  // The painted moulding round the doorway, a keystone, a skirting board.
  const mould = archPts(W + 22, H + 11, { rise: RISE + 11, n: 30 });
  s += comic(holed(mould, [OPEN]), C.trim, { line: LINE.limb, rim: [2.4, -1.2], glint: [-0.8, 0.8], over: ink(smooth(archPts(W + 11, H + 5, { rise: RISE + 5, n: 24 }).filter((p) => p[1] < -1), 1, false), 0.8, C.trimLight) });
  s += comic(poly([[-9, -H - 14], [9, -H - 14], [12, -H + 4], [-12, -H + 4]]), C.trimLight, { line: LINE.small, rim: [1.6, -0.8] });
  s += comic(rrect(FL, -14, FR - FL, 14, 0), C.trim, { line: LINE.small, rim: [2, -1] });
  s += bulbs(false, false);
  // Stage weights and a brace at its left foot, a coil of rope.
  s += comic(poly([[FL - 4, -170], [FL + 4, -170], [FL - 44, 2], [FL - 54, 2]]), C.brace, { line: LINE.small, rim: [2, -1] });
  s += comic(smooth([[FL - 66, 2], [FL - 64, -14], [FL - 50, -20], [FL - 36, -14], [FL - 34, 2]]), C.bag, { line: LINE.small, rim: [2.4, -1.1], over: ink(`M${FL - 58} -10q8 -4 16 0`, 0.7, darkOf(C.bag, 0.3)) });
  s += comic(ellipsePath(FR - 14, -6, 14, 5), C.rope, { line: LINE.small, over: ink(`M${FR - 26} -6q12 -4 24 0M${FR - 22} -4q8 -3 16 0`, 0.7, darkOf(C.rope, 0.35)) });
  for (const x of [FL + 10, FR - 34]) s += tuft(x, 2, 7, '#a9c8a0', x);
  return s;
}

/** Half of the round-topped doorway, in a leaf's own box (0..W/2-1 across, 0 at its top): the left half, or the right. */
function halfShape(right: boolean): Pt[] {
  const w = W / 2 - 1;
  const h = H - 1;
  const full = archPts(W - 2, h, { rise: RISE - 1, n: 40 }).map(([x, y]) => [x + w, y + h] as Pt);
  if (right) {
    const half = full.filter((p) => p[0] > w + 0.01).map(([x, y]) => [x - w, y] as Pt);
    return [[0, 0], ...half, [0, h]];
  }
  const half = full.filter((p) => p[0] < w - 0.01);
  return [...half, [w, 0], [w, h]];
}

/** A leaf of the double door: half of a painted sunrise across both. */
function doorLeaf(right: boolean): string {
  const w = W / 2 - 1;
  const h = H - 1;
  // The painting: a sun rising at the seam, rays across, a band of hills.
  const cx = right ? 0 : w;
  let paint = '';
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i / 6) * Math.PI;
    paint += fillP(poly([[cx, h * 0.62], [cx + Math.cos(a - 0.09) * 110, h * 0.62 + Math.sin(a - 0.09) * 110], [cx + Math.cos(a + 0.09) * 110, h * 0.62 + Math.sin(a + 0.09) * 110]]), C.paintRay, 0.9);
  }
  paint += fillP(circleP(cx, h * 0.62, 24), C.paintSun);
  paint += fillP(smooth([[-10, h * 0.66], [w * 0.4, h * 0.6], [w + 10, h * 0.7], [w + 10, h + 4], [-10, h + 4]]), '#bcd6a4');
  paint += ink(`M${f(w * 0.2)} ${f(h * 0.74)}q6 -4 12 0M${f(w * 0.55)} ${f(h * 0.8)}q6 -4 12 0`, 0.8, darkOf('#bcd6a4', 0.3));
  let s = comic(poly(halfShape(right)), right ? C.leafB : C.leafA, { line: LINE.limb, rim: [3.4, -1.6], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, inner: paint });
  // A panel moulding and a little brass knob by the seam.
  s += ink(poly([[6, h * 0.24], [w - 6, h * 0.24], [w - 6, h * 0.5], [6, h * 0.5]]), 0.8, darkOf(right ? C.leafB : C.leafA, 0.3));
  s += comic(circleP(right ? 6 : w - 6, h * 0.56, 3.4), '#f1d48a', { line: LINE.detail, rim: [1, -0.5], glint: [-0.5, 0.5] });
  return s;
}

/** A leaf's back (as seen from behind, so mirrored): bare boards and a brace. */
function doorLeafBack(right: boolean): string {
  const w = W / 2 - 1;
  const h = H - 1;
  let boards = '';
  for (let i = 1; i < 3; i++) boards += ink(`M${f((w * i) / 3)} 4V${h}`, LINE.small, darkOf(C.flat2, 0.3));
  let s = comic(poly(halfShape(!right)), C.flat2, { line: LINE.limb, rim: [3, -1.4], inner: boards });
  s += comic(poly([[3, h * 0.3], [w - 3, h * 0.84], [w - 3, h * 0.84 + 7], [3, h * 0.3 + 7]]), C.brace, { line: LINE.small });
  return s;
}

/** The cut-out sun's rays (turning), drawn round 0,0. */
function rays(): string {
  let s = '';
  const n = 14;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r0 = 30;
    const r1 = i % 2 ? 50 : 58;
    const P = (r: number, da: number): Pt => [Math.cos(a + da) * r, Math.sin(a + da) * r];
    s += comic(poly([P(r0, -0.2), P(r1, 0), P(r0, 0.2)]), C.ray, { line: LINE.small, rim: [1.6, -0.8], over: fillP(poly([P(r1 - 9, -0.05), P(r1, 0), P(r1 - 9, 0.05)]), C.rayTip) });
  }
  return s;
}

/** The sun's face: sad and asleep, or awake and smiling. */
function sunFace(awake: boolean): string {
  let s = comic(circleP(0, 0, 33), C.sunFace, { line: LINE.limb, rim: [3.4, -1.6], glint: [-1, 1], hatch: 2.2, hatchWidth: 0.45 });
  const line = darkOf(C.sunFace, 0.55);
  for (const x of [-12, 12]) s += fillP(ellipsePath(x * 1.5, 9, 6, 3.4), C.cheek, 0.75);
  if (awake) {
    for (const x of [-12, 12]) {
      s += comic(ellipsePath(x, -4, 6.4, 7.4), '#fffaf4', { line: LINE.detail, ink: line });
      s += fillP(circleP(x + 0.8, -3, 4.2), C.iris) + fillP(circleP(x + 0.8, -3, 1.9), '#4a2b36') + fillP(circleP(x + 2, -4.6, 1.1), '#ffffff');
      s += ink(`M${x - 7} -11Q${x} -15 ${x + 7} -11`, 1.1, line);
    }
    s += ink('M-9 13Q0 22 9 13', 1.4, line);
  } else {
    for (const x of [-12, 12]) {
      s += ink(`M${x - 6.5} -3Q${x} 2 ${x + 6.5} -3`, 1.4, line);
      s += ink(`M${x - 4} 0.5l-1.4 3M${x} 1.6v3.2M${x + 4} 0.5l1.4 3`, 0.9, line);
      s += ink(`M${x - 6} -10Q${x} -7 ${x + 6} -11`, 1, line);
    }
    s += ink('M-8 17Q0 11 8 17', 1.4, line);
  }
  return s;
}

/** A tear on her cheek. */
function tear(): string {
  return comic('M0 -5Q3.6 0 3 3.2A3 3 0 0 1 -3 3.2Q-3.6 0 0 -5Z', C.tear, { line: LINE.detail, glint: [-0.5, 0.5], over: fillP(circleP(-0.8, 1.6, 0.8), '#ffffff') });
}

// ---------------------------------------------------------------- inside: the wings, then the night of the next room

function in0(): string {
  // The flat's raw edge: its boards, seen as the eye goes by.
  return page(OPEN, -100, 100, -230, 10, C.edge, darkOf(C.edge, 0.2), { rim: 3, wallOver: ink(smooth(archPts(W + 8, H + 4, { rise: RISE + 4 }).filter((p) => p[1] < -1), 1, false), 0.8, darkOf(C.edge, 0.25)) });
}

function in1(): string {
  // Behind the door, the stage's own curtains: drawn back and tied, the night in between.
  const rng = new Rng(hashSeed('door.sun.curtains'));
  let s = fillP(rrect(-120, -0.5, 240, 20.5, 0), C.floorIn);
  for (const side of [-1, 1]) {
    // One drape: from the top across to the middle, gathered at its tie, falling to the floor.
    const P = (x: number, y: number): Pt => [side * x, y];
    const drape: Pt[] = [P(120, -242), P(-2, -242), P(4, -200), P(16, -150), P(30, -112), P(34, -100), P(38, -86), P(50, -40), P(58, 0), P(120, 0)];
    let folds = '';
    for (let i = 0; i < 5; i++) {
      const x0 = 14 + i * 20 + rng.range(-3, 3);
      folds += ink(`M${f(side * x0)} -238Q${f(side * (x0 + 18 + i * 3))} -150 ${f(side * (36 + i * 2))} -100Q${f(side * (44 + i * 15))} -50 ${f(side * (62 + i * 12))} -2`, 0.9, darkOf(C.curtain, 0.28));
    }
    s += comic(poly(side > 0 ? drape : [...drape].reverse()), C.curtain, { line: LINE.limb, rim: [5, -2.4], glint: [-1, 1], hatch: 2.6, hatchWidth: 0.5, inner: folds });
    // Its tie: a gold rope round the gather, a tassel hanging.
    s += comic(smooth([P(26, -106), P(40, -110), P(48, -100), P(40, -92), P(26, -96)]), C.rope2, { line: LINE.small, rim: [1.6, -0.8], glint: [-0.6, 0.6] });
    s += comic(smooth([P(42, -96), P(46, -80), P(40, -70), P(36, -80)]), C.rope2, { line: LINE.detail, over: ink(`M${side * 38} -76l1 6M${side * 41} -76l0 7M${side * 44} -77l-1 6`, 0.6, darkOf(C.rope2, 0.35)) });
  }
  // The valance: a scalloped pelmet with a fringe of gold.
  const top: Pt[] = [];
  for (let x = -120; x <= 120; x += 4) top.push([x, -214 + (Math.cos(((x + 120) / 40) * Math.PI * 2) * 0.5 + 0.5) * 9]);
  s += comic(poly([[-120, -246], [120, -246], ...top.reverse()]), C.valance, { line: LINE.limb, rim: [3, -1.4], glint: [-1, 1], hatch: 2.6, hatchWidth: 0.5 });
  s += ink(smooth(top.map(([x, y]) => [x, y + 2] as Pt), 1, false), 1.6, C.rope2);
  return s;
}

/**
 * The night of the next room, seen between the curtains: a band of river
 * light, little pines, a stone tree, and the pink tree's branch with room
 * for the sparrow (all to the right of the middle: the eye looks in from the left).
 */
function beyond(): string {
  const rng = new Rng(hashSeed('door.sun.beyond'));
  let s = `<rect x="-170" y="-240" width="340" height="242" fill="${C.sky}"/>`;
  s += glowDisc(50, -120, 110, '#6a6390', 0.6);
  for (let i = 0; i < 16; i++) s += fillP(circleP(rng.range(-160, 160), rng.range(-232, -136), rng.range(0.6, 1.4)), '#efeaff', rng.range(0.4, 0.85));
  s += twinkle(30, -200, 3, '#fff7d6', 0.5) + twinkle(76, -168, 2.2, '#fff7d6', 0.5);
  // Little pines on the far bank.
  for (let i = 0; i < 9; i++) {
    const x = -150 + i * 34 + rng.range(-6, 6);
    const h = rng.range(22, 34);
    s += comic(poly([[x, -118 - h], [x + 9, -118], [x - 9, -118]]), '#5d5878', { line: LINE.detail });
  }
  s += fillP(rrect(-170, -120, 340, 46, 0), C.band);
  for (let i = 0; i < 6; i++) {
    const y = -112 + i * 7;
    let d = `M-170 ${y}`;
    for (let x = -170; x < 170; x += 20) d += `q5 -3 10 0t10 0`;
    s += ink(d, 0.7, C.bandLine);
  }
  // A stone tree on the far bank.
  s += comic(rrect(36, -150, 8, 32, 3), C.stoneTrunk, { line: LINE.detail });
  s += comic(smooth([[16, -146], [20, -178], [42, -190], [66, -180], [68, -150], [40, -140]]), C.stoneTree, { line: LINE.small, rim: [3, -1.4], over: ink('M28 -164q5 4 10 0M44 -174q5 4 10 0', 0.8, darkOf(C.stoneTree, 0.35)) });
  // This bank: a meadow from the water to the threshold.
  s += comic(smooth([[-170, -70], [-60, -78], [60, -72], [170, -80], [170, 92], [-170, 92]]), C.meadow, { line: LINE.small, rim: [3, -1.4] });
  for (let i = 0; i < 9; i++) s += tuft(rng.range(-150, 150), rng.range(-56, 30), rng.range(6, 9), lightOf(C.meadow, 0.1), 60 + i);
  for (let i = 0; i < 4; i++) {
    const x = rng.range(-20, 90);
    const y = rng.range(-50, -10);
    s += ink(`M${f(x)} ${f(y)}v-9`, 0.9, darkOf(C.meadow, 0.3)) + comic(circleP(x, y - 10, 2.6), i % 2 ? '#f3c9da' : '#fbefb4', { line: LINE.detail });
  }
  // The pink tree's trunk (mostly behind the right curtain), its branch reaching in for the sparrow.
  s += comic(smooth([[100, 2], [106, -80], [104, -150], [112, -240], [156, -240], [152, -150], [154, -70], [164, 2]]), C.pink, { line: LINE.small, rim: [3, -1.4], glint: [-1, 1], over: ink('M126 -20Q120 -90 130 -170', 0.9, darkOf(C.pink, 0.3)) });
  s += barkRoot([[110, -98], [84, -106], [54, -104], [20, -112]], 12, 5, C.pink, 5);
  s += comic(smooth([[46, -108], [52, -122], [62, -124], [58, -110]]), C.crown, { line: LINE.detail });
  s += comic(circleP(130, -236, 42), C.crown, { line: LINE.small, rim: [3, -1.4] }) + comic(circleP(74, -232, 30), C.crown, { line: LINE.small, rim: [3, -1.4] });
  return s;
}

/** The marquee's bulbs round the doorway, lit (half of them: odd or even). */
function bulbs(odd: boolean, lit: boolean): string {
  let s = '';
  const ring = archPts(W + 34, H + 17, { rise: RISE + 17, n: 22 }).filter((p) => p[1] < -12);
  ring.forEach(([x, y], i) => {
    if (lit) {
      if (i % 2 === (odd ? 1 : 0)) s += glowDisc(x, y, 9, '#fff1b0', 0.9) + fillP(circleP(x, y, 2.6), '#fffbe8');
    } else s += comic(circleP(x, y, 3.4), '#f4ecd2', { line: LINE.detail, ink: darkOf(C.trim, 0.3), over: fillP(circleP(x - 0.8, y - 0.9, 1), '#ffffff') });
  });
  return s;
}

/** A sparrow (its feet at 0,0), looking left. */
function sparrow(): string {
  let s = comic(smooth([[-10, -8], [-6, -15], [4, -15], [12, -9], [20, -12], [16, -5], [8, 0], [-6, 0]]), C.bird, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8], over: fillP(smooth([[-8, -5], [-2, -9], [6, -5], [2, -1], [-6, -1]]), C.birdBelly) });
  s += comic(circleP(-8, -16, 6.5), C.bird, { line: LINE.small, rim: [1.6, -0.8] });
  s += comic(poly([[-14, -17], [-19, -15.5], [-14, -14]]), '#f1c27a', { line: LINE.detail });
  s += fillP(circleP(-10, -17.5, 1.3), '#3b2a2a') + fillP(circleP(-9.6, -18, 0.45), '#ffffff');
  s += fillP(ellipsePath(-6.5, -13.5, 2, 1.2), '#f2a6b6', 0.8);
  s += comic(smooth([[0, -12], [8, -14], [12, -9], [4, -8]]), darkOf(C.bird, 0.12), { line: LINE.detail, over: ink('M3 -11l6 -1', 0.6, darkOf(C.bird, 0.4)) });
  s += ink('M-3 0v3M2 0v3', 0.8, '#8b6a52');
  return s;
}

/** The stage door. */
export function sunDoor(): DoorArt {
  const SUN_Y = FT - 26;
  const parts = [
    doorPart('door.sun.flat', { x0: FL - 70, y0: FT - 4, x1: FR + 4, y1: 8 }, flat()),
    doorPart('door.sun.rays', { x0: -60, y0: -60, x1: 60, y1: 60 }, rays()),
    doorPart('door.sun.face', { x0: -35, y0: -35, x1: 35, y1: 35 }, sunFace(false)),
    doorPart('door.sun.face.awake', { x0: -35, y0: -35, x1: 35, y1: 35 }, sunFace(true)),
    doorPart('door.sun.tear', { x0: -4, y0: -6, x1: 4, y1: 7 }, tear()),
    leafPart('door.sun.leafL', W / 2 - 1, H - 1, doorLeaf(false)),
    leafPart('door.sun.leafL.back', W / 2 - 1, H - 1, doorLeafBack(false)),
    leafPart('door.sun.leafR', W / 2 - 1, H - 1, doorLeaf(true)),
    leafPart('door.sun.leafR.back', W / 2 - 1, H - 1, doorLeafBack(true)),
    doorPart('door.sun.in0', { x0: -100, y0: -230, x1: 100, y1: 10 }, in0()),
    doorPart('door.sun.in1', { x0: -120, y0: -248, x1: 120, y1: 20 }, in1()),
    doorPart('door.sun.beyond', { x0: -170, y0: -240, x1: 170, y1: 92 }, beyond()),
    doorPart('door.sun.sparrow', { x0: -20, y0: -24, x1: 22, y1: 4 }, sparrow()),
    doorPart('door.sun.bulbs.a', { x0: -76, y0: -260, x1: 76, y1: -2 }, bulbs(false, true)),
    doorPart('door.sun.bulbs.b', { x0: -76, y0: -260, x1: 76, y1: -2 }, bulbs(true, true)),
  ];
  return {
    parts,
    opening: OPEN,
    frame: [{ key: 'door.sun.flat', x: 0, y: 0, dz: 0 }],
    front: [],
    inside: [
      { key: 'door.sun.beyond', x: 0, y: 0, dz: -120, order: 0 },
      { key: 'door.sun.in1', x: 0, y: 0, dz: -36, order: 2 },
      { key: 'door.sun.in0', x: 0, y: 0, dz: -8, order: 3 },
    ],
    backdrop: 0x2e2a3c,
    shutDim: 0.4,
    pieces: [
      // The sparrow hops along its branch to look at Gorti.
      { key: 'door.sun.sparrow', inside: true, x: 92, y: -105, dz: -116, order: 1, sway: { y: 0.8, ms: 1900 }, peek: { x: -40, y: -3, angle: -6 } },
      // The marquee lights: out while it is shut, lit once open, twinkling, brighter as Gorti comes.
      { key: 'door.sun.bulbs.a', x: 0, y: 0, dz: 0.5, additive: true, shut: { alpha: 0 }, open: { alpha: 0.55 }, wake: { alpha: 0.3 }, sway: { alpha: 0.25, ms: 900 } },
      { key: 'door.sun.bulbs.b', x: 0, y: 0, dz: 0.5, additive: true, shut: { alpha: 0 }, open: { alpha: 0.55 }, wake: { alpha: 0.3 }, sway: { alpha: -0.25, ms: 900 } },
      // The cut-out sun on its stick: she rises a little and wakes when the room is done.
      { key: 'door.sun.rays', x: 0, y: SUN_Y, dz: 1.5, shut: {}, open: { y: -8, angle: 30 }, sway: { angle: 4, ms: 3800 }, wake: { angle: 10, sx: 1.08, sy: 1.08 } },
      { key: 'door.sun.face', x: 0, y: SUN_Y, dz: 2, shut: {}, open: { y: -8, alpha: 0 }, sway: { angle: 2, ms: 3800 }, wake: { angle: -3 }, wakeShut: true },
      { key: 'door.sun.face.awake', x: 0, y: SUN_Y, dz: 2, shut: { alpha: 0 }, open: { y: -8 }, sway: { angle: 2, ms: 3800 }, wake: { angle: -3 }, blink: true },
      { key: 'door.sun.tear', x: -17, y: SUN_Y + 13, dz: 2.5, shut: {}, open: { y: 30, alpha: 0 }, lag: 0, sway: { y: 1.5, ms: 1700 } },
    ],
    leaves: [
      // Flung open: the left one folds right back against the flat, the right one stands out.
      { front: 'door.sun.leafL', back: 'door.sun.leafL.back', hinge: 'left', x: -W / 2 + 1, y: -H + 1, dz: 1, shutAngle: 0, restAngle: 150, wideAngle: 162, strips: 10 },
      { front: 'door.sun.leafR', back: 'door.sun.leafR.back', hinge: 'right', x: W / 2 - 1, y: -H + 1, dz: 1, shutAngle: 0, restAngle: 72, wideAngle: 112, strips: 10 },
    ],
    light: { color: 0xffe2a8, radius: 320, intensity: 0.9, y: 80 },
    glow: { color: 0xd8d2ff, pool: 0xffe6c0 },
    sparks: { colors: [0xfff1a0, 0xffd0a0, 0xfff8e0], frame: 'fx.spark', rate: 1.2, size: 0.38 },
    sounds: { wake: ['ray', 0.25, 1.2], peek: ['chirp', 0.35, 1.3], open: [['sunhit', 0.5, 1.2], ['door', 0.4, 1]] },
    openMs: 1500,
  };
}

void crescent;
void leaf;
