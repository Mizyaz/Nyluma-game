import { ellipsePath, smooth, taper, type Pt } from '../../render/2d/svg';
import { darkOf, LINE, lightOf } from '../../render/2d/style';
import type { PartArt } from '../../render/2d/rig/rigTypes';
import { eyeSet, mouthSet, withoutSmile, type EyeShape, type MouthShape } from './face';
import { barkLines, claws, comic, comicLimb, fillOnly, fold, ink, part, path, roundPoly, tr } from './kit';
import { humanoidRig, type HumanoidDims } from './skeleton';

// Gorti as painting 1 ("House of the Stranger") shows him, the big figure
// on the right, drawn by hand after it: a box of cracked bark for a head,
// round a pale lilac screen; a broad, muscled sage-green body with plates of
// bark on its chest and belly; bark forearms set with green thorns and
// ending in wooden claws; knotted bark legs on root-clawed feet.
//
// His face is the pattern on the screen: violet blocks in a pink maze. The
// blocks of the top row are his eyes, the one at the bottom his mouth, and
// his feelings change their shapes (he never smiles: the author never draws
// him smiling). The glass and its pattern glow; the bezel is drawn over the
// marks, so they never show past the glass as they move.
//
// Measures: the head is about a quarter of his height, as painted. Points in
// the head's frame were measured off the painting with a grid and scaled
// into it (the neck joint at 0,0).

export const CHILD = {
  body: '#a7bf8c',
  bodyDeep: '#8aa573',
  bark: '#9a7b5a',
  barkDark: '#7a5e43',
  box: '#a98b63',
  bezel: '#d4c5e7',
  recess: '#4a3550',
  pink: '#f27aa8',
  block: '#c79edc',
  blockDeep: '#b48ad0',
  thorn: '#86b46f',
  ink: '#2d2329',
} as const;

/** Where the eyes (the top row of blocks) and the mouth (the bottom block's foot) sit in the head's frame. */
const EYE: Pt = [3.5, -18.65];
const MOUTH: Pt = [4.75, -4];

export const CHILD_DIMS: HumanoidDims = {
  hip: 56, thigh: 26, shin: 26, torso: 44, shoulderY: 38, shoulderX: 8, upper: 21, hipX: 7, headX: 2, hand: 25,
  // Broad: the far shoulder stands out past his back, as the painting's front view shows both.
  farShoulder: -2.25,
  belly: [19, -16],
  foot: { sole: 6, heel: -6, ball: 10 },
  eye: EYE,
  face: { eye: 'gorti.child', mouth: 'gorti.child', mouthAt: MOUTH, blink: 'shut', glow: true, screen: 'gorti.child.screen', bezel: 'gorti.child.bezel' },
};

const INK = CHILD.ink;

// ------------------------------------------------------------------ head

/** The bark box, clockwise from its bottom-left corner. */
const BOX: Pt[] = [
  [-14.9, 0], [-16.6, -2.8], [-17.7, -7.9], [-17.9, -14.3], [-17.9, -20.7], [-17.2, -25.8], [-15.9, -29.1], [-14.1, -31.6],
  [-11.8, -33.4], [-8.2, -34.2], [-4.7, -34.2], [-3.1, -33.2], [-1.6, -34.5], [2.5, -35], [7.1, -35], [10.1, -34.2], [11.2, -33.2],
  [12.7, -33.7], [16.8, -33.7], [20.3, -32.7], [22.6, -30.6], [23.9, -27.1], [24.4, -22], [24.4, -15.6], [23.9, -9.2], [22.6, -4.6],
  [20.6, -1.6], [17.8, 0.2], [7.6, 0.8], [-5.2, 0.8], [-11.5, 0.8],
];
/** The cracks between the bark's pieces. */
const BOX_CRACKS: Pt[][] = [
  [[-3.1, -33.2], [-2.6, -30.1], [-1.8, -27.6], [-2.1, -25.2]],
  [[11.2, -33.2], [11.4, -30.1], [12.4, -27.6], [11.9, -25]],
  [[-17.9, -17.4], [-15.4, -16.9], [-13.2, -17.9]],
  [[24.4, -13], [21.9, -12.3], [20.2, -13.3]],
  [[-9.7, -33.9], [-9, -31], [-10.3, -28.9]],
  [[18.6, -33.3], [18, -31], [19.2, -28.2]],
];
/** The bezel's outer edge and the glass inside it (corner radii with each). */
const BEZEL: Pt[] = [[-12.6, -24.5], [19.6, -24], [19.8, -5.4], [17.3, -2.3], [-7.7, -1.6], [-12.6, -8.7]];
const BEZEL_R = [2.5, 2.5, 2.5, 3, 3, 2.5];
const GLASS: Pt[] = [[-10.2, -22.1], [17.2, -21.6], [17.3, -6.2], [15.3, -4.3], [-6.4, -4], [-10.2, -8.3]];

function head(): PartArt {
  return part('gorti.child.head', { x0: -19, y0: -36, x1: 26, y1: 2 }, (ox, oy) => {
    const o = (pts: readonly Pt[]): Pt[] => tr(pts, ox, oy);
    const grain = darkOf(CHILD.box, 0.42);
    let over = '';
    for (const c of BOX_CRACKS) over += ink(path(o(c)), LINE.detail * 1.15, INK);
    // The grain of each piece, along its length.
    over += fold(path(o([[-14.5, -29], [-12, -30.6], [-9.4, -31.2]])), grain);
    over += fold(path(o([[0.5, -32.4], [4, -33], [8, -32.6]])), grain);
    over += fold(path(o([[14, -31.6], [16.6, -31.9]])), grain);
    over += fold(path(o([[-16.2, -12], [-15.6, -7.5], [-14.6, -4]])), grain);
    over += fold(path(o([[22.6, -20], [22.9, -16.5]])), grain);
    over += fold(path(o([[22.2, -8.5], [21.4, -5.2]])), grain);
    // The hollow the bezel sits in (the glass and the bezel cover it).
    const hollow = fillOnly(roundPoly(o(BEZEL), BEZEL_R), CHILD.recess);
    return comic(smooth(o(BOX), 0.45), CHILD.box, { line: LINE.body, ink: INK, rim: [2.4, -1.4], hatch: 2.4, glint: [-1, 1.2], over: over + hollow });
  });
}

/** A block of the screen's pattern: violet, inked, a pale edge along its top. */
function block(d: string, fill: string = CHILD.block): string {
  return comic(d, fill, { line: LINE.detail, ink: INK, glint: [-0.5, 0.7], lightFill: lightOf(fill, 0.5) });
}

/**
 * The glass: pink, with the blocks that do not move (the one between the
 * eyes, the two beside the mouth). As painted, the blocks run out to the
 * glass's edges (under the bezel), so the pink between them reads as the
 * figure: a maze-like cross.
 */
function screen(): PartArt {
  return part('gorti.child.screen', { x0: -12, y0: -24, x1: 19, y1: -2 }, (ox, oy) => {
    const o = (pts: readonly Pt[]): Pt[] => tr(pts, ox, oy);
    let s = fillOnly(roundPoly(o(GLASS), 1.5), CHILD.pink);
    // A deeper pink down the channels' far edges.
    s += ink(path(o([[-2.7, -21.5], [-2.7, -15.6]])) + path(o([[9.6, -21.5], [9.6, -15.6]])), 0.9, darkOf(CHILD.pink, 0.22), 0.5);
    s += block(roundPoly(o([[0.2, -23], [6.6, -23], [6.6, -13.8], [0.2, -13.8]]), 1.1));
    s += block(roundPoly(o([[-11.2, -10.6], [-4.9, -10.6], [-4.9, -3], [-11.2, -3]]), 1));
    s += block(roundPoly(o([[11, -10.6], [18.2, -10.6], [18.2, -3], [11, -3]]), 1));
    return s;
  });
}

/** The bezel, drawn over the pattern, with a faint glare across the glass. */
function bezel(): PartArt {
  return part('gorti.child.bezel', { x0: -13.5, y0: -25.5, x1: 21, y1: -0.5 }, (ox, oy) => {
    const o = (pts: readonly Pt[]): Pt[] => tr(pts, ox, oy);
    // The glass reversed: a hole in the ring.
    const ring = roundPoly(o(BEZEL), BEZEL_R) + roundPoly(o([...GLASS].reverse()), 1.5);
    let s = comic(ring, CHILD.bezel, { line: LINE.small, ink: INK, rim: [1.2, -1.2], glint: [-0.6, 0.7] });
    s += fillOnly(`M${ox - 9.6} ${oy - 15}L${ox - 2.4} ${oy - 21.3}L${ox + 0.6} ${oy - 21.3}L${ox - 9.6} ${oy - 12.4}Z`, '#ffffff', 0.13);
    return s;
  });
}

// ------------------------------------------------------------------ face

/**
 * The near eye block in each shape (local to the eyes' joint; the far one is
 * its mirror image). It runs out under the bezel at the top and the side:
 * sad, its top droops away from the glass's edge; shut, it sinks to a bar.
 */
function eyeBlock(v: EyeShape): Pt[] {
  if (v === 'sad') return [[-14.7, -1.4], [-6.5, -4.35], [-6.5, 2.65], [-14.7, 2.65]];
  if (v === 'shut') return [[-14.7, 1], [-6.5, 1], [-6.5, 2.65], [-14.7, 2.65]];
  return [[-14.7, -4.35], [-6.5, -4.35], [-6.5, 2.65], [-14.7, 2.65]];
}

function eyes(): PartArt[] {
  return withoutSmile(eyeSet('gorti.child', { x0: -16, y0: -5, x1: 16, y1: 4 }, (v, ox, oy) => {
    const near = eyeBlock(v);
    const far = near.map(([x, y]): Pt => [-x, y]).reverse();
    const r = v === 'shut' ? 0.7 : 1.1;
    return block(roundPoly(tr(near, ox, oy), r)) + block(roundPoly(tr(far, ox, oy), r));
  }));
}

/** The mouth block in each shape (its foot's middle at 0,0, running out under the bezel). Never a smile. */
function mouthBlocks(v: MouthShape): Pt[][] {
  switch (v) {
    case 'open':
      return [[[-3.55, -7.9], [3.55, -8.6], [3.55, 1], [-3.55, 1]]];
    case 'grit':
      return [[[-3.55, 1], [-3.55, -4.6], [-2.37, -6], [-1.18, -4.6], [0, -6], [1.18, -4.6], [2.37, -6], [3.55, -4.6], [3.55, 1]]];
    case 'frown':
      return [[[-3.55, 1], [-3.55, -4.9], [-2.2, -6.1], [2.2, -6.1], [3.55, -4.9], [3.55, 1], [1.5, 1], [1.5, -2.6], [-1.5, -2.6], [-1.5, 1]]];
    case 'laugh':
      return [
        [[-3.55, -8.6], [3.55, -8.6], [3.55, -6.6], [-3.55, -6.6]],
        [[-3.55, -5.6], [3.55, -5.6], [3.55, -3.6], [-3.55, -3.6]],
        [[-3.55, -2.6], [3.55, -2.6], [3.55, 1], [-3.55, 1]],
      ];
    default:
      return [[[-3.55, -5.4], [3.55, -6.1], [3.55, 1], [-3.55, 1]]];
  }
}

function mouth(): PartArt[] {
  return mouthSet('gorti.child', { x0: -5, y0: -9.5, x1: 5, y1: 2 }, (v, ox, oy) =>
    mouthBlocks(v).map((pts) => block(roundPoly(tr(pts, ox, oy), v === 'grit' ? 0.4 : 1), CHILD.blockDeep)).join(''),
  );
}

// ------------------------------------------------------------------ body

const TORSO: Pt[] = [
  [-13, 5], [-14.5, -4], [-15.5, -13], [-17.5, -22], [-20, -30], [-20.5, -36], [-17, -41], [-10, -44.5], [-3, -46.5], [6, -46.5],
  [13, -44.5], [19.5, -41], [24, -35], [24.5, -27], [22, -18], [19, -9], [16, 5],
];
/** The plates of bark over his chest and belly, ragged along the top. */
const PLATES: Pt[] = [
  [-8, 7], [-10, -3], [-9, -11], [-10.5, -19], [-7.5, -26], [-4.5, -30], [-2, -27], [0.5, -32], [3.5, -28.5], [6.5, -33], [9, -28],
  [12, -31], [14.5, -26], [18, -22], [18, -14], [19, -6], [16, 7],
];
const PLATE_CRACKS: Pt[][] = [
  [[3.5, -28.5], [2.5, -22], [1, -16]],
  [[-9.8, -15], [-4, -16.5], [1, -16], [6.5, -17], [11.5, -15.5], [18.2, -17]],
  [[6.5, -17], [7.5, -10], [6, -3], [7, 7]],
  [[-9.6, -6], [-2.5, -7.5], [6.5, -7], [12.5, -8], [18.7, -7]],
  [[-2.5, -7.5], [-3.5, -1], [-2.5, 7]],
];

function torso(): PartArt {
  return part('gorti.child.torso', { x0: -22, y0: -48, x1: 26, y1: 8 }, (ox, oy) => {
    const o = (pts: readonly Pt[]): Pt[] => tr(pts, ox, oy);
    const deep = CHILD.bodyDeep;
    let plates = '';
    for (const c of PLATE_CRACKS) plates += ink(path(o(c)), LINE.detail * 1.1, INK);
    const grain = darkOf(CHILD.bark, 0.45);
    plates += fold(path(o([[-6, -23], [-4, -20]])), grain) + fold(path(o([[10.5, -26], [13, -21.5]])), grain);
    plates += fold(path(o([[-6.5, -11], [-5.5, -9]])), grain) + fold(path(o([[11.5, -13], [14, -10.5]])), grain);
    plates += fold(path(o([[1.5, -4], [2.5, 2]])), grain) + fold(path(o([[11.5, -3], [12.5, 3]])), grain);
    const bark = comic(smooth(o(PLATES), 0.35), CHILD.bark, { line: LINE.small, ink: INK, rim: [2.6, -1.4], hatch: 2.3, glint: [-0.8, 1], over: plates });
    const over =
      // The shoulders, the slopes up to the head, the side under the far arm.
      fold(path(o([[18, -42], [22.4, -38], [24, -31]])), deep, LINE.detail) +
      fold(path(o([[-16.5, -40.5], [-19.4, -35.5], [-20, -29.5]])), deep, LINE.detail) +
      fold(path(o([[-8, -43.5], [-2, -42]])), deep) +
      fold(path(o([[10, -42.5], [15, -43.8]])), deep) +
      fold(path(o([[-17.5, -26], [-15.8, -17]])), deep);
    return comic(smooth(o(TORSO), 0.6), CHILD.body, { line: LINE.body, ink: INK, rim: [5, -2.4], hatch: 2.4, glint: [-1.2, 1.3], over: over + bark });
  });
}

function upperArm(): PartArt {
  return part('gorti.child.arm', { x0: -10, y0: -8, x1: 10, y1: 24 }, (ox, oy) =>
    comicLimb([ox, oy - 1], [ox, oy + 21], 15, 11, CHILD.body, {
      bulge: 0.8,
      line: LINE.limb,
      ink: INK,
      over: fold(`M${ox - 4} ${oy + 13}q4 2.4 8 -0.2`, CHILD.bodyDeep) + fold(`M${ox + 4.4} ${oy + 1.6}q1.8 3.8 0.9 7.4`, CHILD.bodyDeep, LINE.fine),
    }) +
    // The shoulder's round muscle over the top of the arm, inked along its top only.
    comic(ellipsePath(ox + 0.4, oy + 0.8, 7.9, 6.6), CHILD.body, { line: 0, rim: [2, -0.6], glint: [-0.6, 0.8] }) +
    ink(`M${ox - 7.4} ${oy + 3}A7.9 6.6 0 0 1 ${ox + 8.2} ${oy + 2.6}`, LINE.limb, INK),
  { far: true });
}

/** A green thorn growing out of the bark, hooked toward the hand. */
function thorn(pts: readonly Pt[], w: number): string {
  return comic(taper(pts, w, 0.4), CHILD.thorn, { line: LINE.small, ink: INK, glint: [-0.3, 0.4], lightFill: lightOf(CHILD.thorn, 0.5) });
}

function forearm(): PartArt {
  return part('gorti.child.fore', { x0: -13, y0: -5, x1: 10, y1: 30 }, (ox, oy) => {
    const at = (x: number, y: number): Pt => [ox + x, oy + y];
    let s = '';
    // The thorns go behind the arm's edge.
    s += thorn([at(-4.4, 2.6), at(-8.6, 4.6), at(-10.8, 8.8)], 3.8);
    s += thorn([at(-4.4, 7.6), at(-8.2, 9.8), at(-9.8, 13.8)], 3.4);
    s += thorn([at(-3.8, 12), at(-7, 14.4), at(-8, 17.8)], 2.8);
    s += claws(at(0, 16.4), Math.PI / 2, 1.15, [9, 11, 11, 9], 3.8, CHILD.barkDark, 21, 0.3);
    s += comicLimb(at(0, -1), at(0, 17), 12, 9.6, CHILD.bark, {
      bulge: 0.45,
      line: LINE.limb,
      ink: INK,
      over: barkLines(at(0, -1), at(0, 17), 11, 22, { n: 3, color: darkOf(CHILD.bark, 0.5) }) + ink(`M${ox - 4.8} ${oy + 15.4}q4.8 1.8 9.6 0`, LINE.detail, INK),
    });
    return s;
  }, { far: true });
}

/** A knot in the bark: a ring with a dark heart. */
function knot(x: number, y: number, r: number): string {
  return ink(ellipsePath(x, y, r, r * 0.7), LINE.fine * 1.2, darkOf(CHILD.bark, 0.6)) + fillOnly(ellipsePath(x, y, r * 0.45, r * 0.32), darkOf(CHILD.bark, 0.5));
}

function thigh(): PartArt {
  return part('gorti.child.thigh', { x0: -11, y0: -7, x1: 11, y1: 29 }, (ox, oy) =>
    comicLimb([ox, oy - 2], [ox, oy + 26], 17, 12.5, CHILD.bark, {
      bulge: 1,
      line: LINE.limb,
      ink: INK,
      over: barkLines([ox, oy - 2], [ox, oy + 26], 15, 31, { n: 3, knots: 0, color: darkOf(CHILD.bark, 0.5) }) + knot(ox + 3, oy + 9, 2) + fold(path([[ox - 5.6, oy + 18], [ox - 3.4, oy + 21], [ox - 5, oy + 24]]), darkOf(CHILD.bark, 0.5)),
    }),
  { far: true });
}

function shin(): PartArt {
  return part('gorti.child.shin', { x0: -10, y0: -7, x1: 10, y1: 28 }, (ox, oy) =>
    comicLimb([ox, oy - 1], [ox, oy + 26], 13, 9.5, CHILD.bark, {
      bulge: 0.55,
      line: LINE.limb,
      ink: INK,
      over: barkLines([ox, oy + 3], [ox, oy + 25], 11.5, 32, { n: 2, knots: 0, color: darkOf(CHILD.bark, 0.5) }) + knot(ox - 1.8, oy + 15, 1.6),
    }) +
    // The knee: a knot of the wood, swelling the line of the leg.
    comic(ellipsePath(ox + 1.4, oy + 0.6, 7, 5.6), CHILD.bark, { line: 0, rim: [1.8, -0.8], glint: [-0.6, 0.8], over: fold(`M${ox - 1.6} ${oy - 1}q3 -2 6 0.4`, darkOf(CHILD.bark, 0.5)) }) +
    ink(`M${ox - 4.6} ${oy - 2.6}Q${ox + 1.4} ${oy - 7.4} ${ox + 8} ${oy - 0.6}Q${ox + 8.8} ${oy + 3.6} ${ox + 6} ${oy + 5.4}`, LINE.limb, INK),
  { far: true });
}

/** Root-claw toes spread on the ground (pivot at the ankle, sole at +6). */
function foot(): PartArt {
  return part('gorti.child.foot', { x0: -13, y0: -6, x1: 21, y1: 8 }, (ox, oy) => {
    const o = (pts: readonly Pt[]): Pt[] => tr(pts, ox, oy);
    const toe = (pts: Pt[], w: number): string =>
      comic(taper(o(pts), w, 0.6), CHILD.barkDark, { line: LINE.small, ink: INK, rim: [0, -w * 0.3], glint: [0, w * 0.2] });
    let s = toe([[-1, 3.2], [-6.4, 5.2], [-11.4, 6.3]], 4.4);
    s += toe([[1, 3.6], [8.4, 5.2], [15.4, 6.3]], 4.8);
    s += toe([[2, 2.2], [10.4, 3.2], [19.6, 6]], 5.2);
    s += comic(ellipsePath(ox, oy + 2, 7.2, 5), CHILD.bark, {
      line: LINE.small,
      ink: INK,
      rim: [1.6, -1.2],
      glint: [-0.6, 0.7],
      over: fold(`M${ox - 2.4} ${oy + 0.6}q2.4 2.2 4.8 0`, darkOf(CHILD.bark, 0.5), LINE.fine * 1.3),
    });
    return s;
  }, { far: true });
}

export function childParts(): PartArt[] {
  return [head(), screen(), bezel(), ...eyes(), ...mouth(), torso(), upperArm(), forearm(), thigh(), shin(), foot()];
}

export const RIG_GORTI_CHILD = humanoidRig('gorti.root.child', 'gorti.child', CHILD_DIMS);
