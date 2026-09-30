import { ellipsePath, limb, Rng, taper, type Pt } from '../svg';
import { DETAIL, flat, INK, PASTEL } from '../style';
import type { PartArt } from '../rigTypes';
import { almondEye, browPart, eyeSet, mouthSet, paintedMouth } from './face';
import { ink, label, leaf, part, path, roundPoly, stitches, tr } from './kit';
import { humanoidRig, type HumanoidDims } from './skeleton';

// Gorti's human form, the Sivaslı amca/dede (painting 2, the large left
// figure): a big pale grey-white patched body with little labels,
// pinkish-mauve limb patches and a few leaves. His head changes with the
// sky: a crescent Moon (one eye, tears) at night, a round Sun face with
// spiky rays by day. The suited form (the office) is the same body in a
// plain grey suit.

export const SIVAS = {
  body: '#dfe7e2',
  bodyLine: '#aebdb6',
  mauve: '#c996aa',
  mauveDeep: '#b27f95',
  sage: '#aacd9c',
  stripe: '#8fd19a',
  hand: '#a9c580',
  leg: '#bf8fa2',
  foot: '#d3e8e4',
  moon: '#a7abe3',
  moonDeep: '#7f84c8',
  tear: '#8fd3ee',
  sun: '#f6b77f',
  ray: '#f3e08e',
  freckle: '#c07f5e',
  suit: '#a3a5ad',
  suitDeep: '#83858f',
  shirt: '#f5f2ea',
  tie: '#5d6178',
  shoe: '#4c4852',
} as const;

const HUMAN_BASE = {
  hip: 43, thigh: 19, shin: 20, torso: 57, shoulderY: 46, shoulderX: 9, upper: 23, hipX: 7, headX: 9, hand: 29,
} as const;

/** Moon head: one eye in the crescent, a brow, a small mouth on the inner curve. */
export const HUMAN_MOON_DIMS: HumanoidDims = {
  ...HUMAN_BASE,
  eye: [-3, -31],
  brow: { part: 'gorti.human.brow', up: 6.5, dx: -0.5 },
  face: { eye: 'gorti.human', mouth: 'gorti.human', mouthAt: [2.5, -14.5] },
};

/** Sun head: a three-quarter face with both eyes. */
export const HUMAN_SUN_DIMS: HumanoidDims = {
  ...HUMAN_BASE,
  parts: { head: 'gorti.sun.head' },
  eye: [7, -30],
  brow: { part: 'gorti.sun.brow', up: 5.8, dx: -5 },
  face: { eye: 'gorti.sun', mouth: 'gorti.sun', mouthAt: [10, -18] },
};

// ------------------------------------------------------------------ heads

function moonHead(): PartArt {
  return part('gorti.human.head', { x0: -22, y0: -68, x1: 16, y1: 4 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    // A thick crescent opening to the front: back curve, a sharp top horn,
    // the face on the inner curve, a round chin.
    const crescent: Pt[] = [[12, -65], [3, -56], [-1, -47], [-1, -39], [3, -34], [4.5, -30], [1.5, -27], [2, -22], [5, -18], [8, -12], [11, -6], [8, -1], [0, 1], [-9, -1], [-16, -8], [-20, -20], [-20, -34], [-16, -47], [-7, -58]];
    const tears =
      flat(`M${ox - 6} ${oy - 25}q-2.4 3.4 0 4.6q2.4 -1.2 0 -4.6Z`, SIVAS.tear, { stroke: DETAIL }) +
      flat(`M${ox - 8.5} ${oy - 18}q-2.6 3.6 0 5q2.6 -1.4 0 -5Z`, SIVAS.tear, { stroke: DETAIL }) +
      flat(`M${ox - 4.5} ${oy - 13}q-2 2.8 0 3.9q2 -1.1 0 -3.9Z`, SIVAS.tear, { stroke: DETAIL });
    const craters = ink(ellipsePath(ox - 13, oy - 42, 2.2, 1.6), DETAIL * 0.8, SIVAS.moonDeep) + ink(ellipsePath(ox - 15, oy - 12, 1.6, 1.2), DETAIL * 0.8, SIVAS.moonDeep) + ink(path(o([[-12, -52], [-7, -55]])), DETAIL * 0.8, SIVAS.moonDeep);
    return flat(path(o(crescent)) + 'Z', SIVAS.moon, { over: craters + tears });
  });
}

function moonEye(): PartArt[] {
  return eyeSet('gorti.human', { x0: -8, y0: -8, x1: 8, y1: 7 }, (v, ox, oy) => almondEye(v, ox, oy, 5.2, 3.6, { outer: -1, iris: '#3f6f63', lid: 0.1, lidFill: SIVAS.moon, look: 0.3, pupil: 0.5, blank: true }));
}

function moonMouth(): PartArt[] {
  const m = 3;
  return mouthSet('gorti.human', { x0: -m - 3, y0: -m - 3, x1: m + 3, y1: m + 3 }, (v, ox, oy) => paintedMouth(v, ox, oy, m, { lip: SIVAS.mauve, inside: '#4a2a4f', sad: 0.5 }));
}

function sunHead(): PartArt {
  return part('gorti.sun.head', { x0: -27, y0: -64, x1: 34, y1: 6 }, (ox, oy) => {
    const cx = ox + 4;
    const cy = oy - 28;
    const r = 20;
    const rng = new Rng(88);
    let rays = '';
    const n = 15;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.1;
      const L = r + 8 + rng.range(-1.5, 2.5);
      const w = 0.2;
      const p = (ang: number, rad: number): string => `${cx + Math.cos(ang) * rad} ${cy + Math.sin(ang) * rad}`;
      rays += flat(`M${p(a - w, r - 2)}L${p(a, L)}L${p(a + w, r - 2)}Z`, SIVAS.ray, { stroke: DETAIL });
    }
    let dots = '';
    for (let i = 0; i < 10; i++) {
      const a = rng.range(0, Math.PI * 2);
      const d = rng.range(r * 0.45, r * 0.85);
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d;
      // Keep the freckles off the eyes and the mouth.
      if (y > cy - 7 && y < cy + 14 && x > cx - 6) continue;
      dots += `<circle cx="${x}" cy="${y}" r="0.9" fill="${SIVAS.freckle}"/>`;
    }
    const face =
      dots +
      ink(`M${cx + 7} ${cy - 1}l2.6 5.2l-2.8 1`, DETAIL) +
      ink(`M${cx - 13} ${cy + 5}q2 1.5 4 0`, DETAIL * 0.8, SIVAS.freckle) +
      ink(`M${cx - 6} ${cy - 8}q2 -1.4 5 -1.1`, 1.6, '#c7743f');
    // A short neck under the disc.
    let s = flat(limb([ox, oy + 4], [ox + 1, oy - 10], 10, 10, 0), SIVAS.body, {});
    s += rays;
    s += flat(ellipsePath(cx, cy, r, r), SIVAS.sun, { over: face });
    return s;
  });
}

function sunEyes(): PartArt[] {
  return eyeSet('gorti.sun', { x0: -12, y0: -8, x1: 13, y1: 7 }, (v, ox, oy) =>
    almondEye(v, ox - 5, oy, 3.9, 2.7, { outer: -1, iris: '#e0667f', lid: 0.18, lidFill: SIVAS.sun, look: 0.3, blank: true }) +
    almondEye(v, ox + 6.5, oy, 3.2, 2.5, { outer: 1, iris: '#e0667f', lid: 0.18, lidFill: SIVAS.sun, look: 0.45, blank: true }),
  );
}

function sunMouth(): PartArt[] {
  const m = 4.4;
  return mouthSet('gorti.sun', { x0: -m - 3, y0: -m - 3, x1: m + 3, y1: m + 3 }, (v, ox, oy) => paintedMouth(v, ox, oy, m, { lip: '#e98a7a', inside: '#6b2c34', sad: 0.3 }));
}

// ------------------------------------------------------------------ body

/** A jagged-edged patch (the painting's torn, zig-zag patches). */
function jagged(cx: number, cy: number, rx: number, ry: number, seed: number, teeth = 11): string {
  const rng = new Rng(seed);
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const k = i % 2 === 0 ? 1 : 0.72 + rng.range(-0.06, 0.06);
    pts.push(`${cx + Math.cos(a) * rx * k} ${cy + Math.sin(a) * ry * k}`);
  }
  return `M${pts.join('L')}Z`;
}

const HUMAN_BODY: Pt[] = [[-17, 7], [-25, -5], [-31, -22], [-32, -40], [-26, -54], [-12, -62], [6, -61], [17, -53], [22, -38], [23, -20], [20, -4], [13, 7]];

function torso(): PartArt {
  return part('gorti.human.torso', { x0: -35, y0: -66, x1: 27, y1: 11 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const inner =
      flat(jagged(ox - 18, oy - 1, 13, 9, 3, 13), SIVAS.mauve, { stroke: DETAIL }) +
      flat(jagged(ox + 9, oy - 53, 9, 7, 4, 9), SIVAS.mauve, { stroke: DETAIL }) +
      flat(roundPoly(o([[6, -22], [16, -23], [17, -13], [7, -12]]), 2), SIVAS.sage, { stroke: DETAIL, over: stitches(o([[6.5, -17.5], [16.5, -18]]), 3, 1.4) });
    const over =
      // Seams, the little labels on the back, a sprig of leaves.
      stitches(o([[16, -47], [19, -33], [19, -26]]), 4, 1.8) +
      ink(path(o([[-25, -16], [-18, -12], [-12, -14]])), DETAIL, SIVAS.bodyLine) +
      ink(path(o([[-8, -58], [-4, -52]])), DETAIL, SIVAS.bodyLine) +
      label(ox - 31, oy - 47, 13, 7, '#f2a7b5', 11, -14) +
      label(ox - 29, oy - 38.5, 12, 6.5, PASTEL.butter, 12, -6) +
      label(ox - 28, oy - 29.5, 12, 7, PASTEL.mint, 13, 5) +
      ink(path(o([[-2, -26], [0, -36], [-1, -46]])), DETAIL) +
      leaf(tr([[-1, -44]], ox, oy)[0]!, -2.3, 10, PASTEL.leaf) +
      leaf(tr([[0, -36]], ox, oy)[0]!, -0.5, 9, PASTEL.leaf) +
      leaf(tr([[-0.5, -29]], ox, oy)[0]!, -2.7, 8, PASTEL.leaf);
    return flat(path(o(HUMAN_BODY)) + 'Z', SIVAS.body, { inner, over });
  });
}

function upperArm(): PartArt {
  return part('gorti.human.arm', { x0: -9, y0: -6, x1: 9, y1: 28 }, (ox, oy) =>
    flat(limb([ox, oy], [ox, oy + 23], 14, 11, 0.7), SIVAS.body, {
      inner: flat(jagged(ox + 1, oy + 6, 6.5, 5.5, 21, 8), SIVAS.mauve, { stroke: DETAIL }),
      over: ink(`M${ox - 4} ${oy + 16}q4 2 8 0`, DETAIL, SIVAS.bodyLine),
    }),
  { far: true });
}

/** Forearm with green stripes and a green hand. */
function forearm(suit = false): PartArt {
  return part(suit ? 'gorti.suit.fore' : 'gorti.human.fore', { x0: -9, y0: -5, x1: 10, y1: 33 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    let s = '';
    // The hand: a green mitten with a thumb and a pointing finger.
    s += flat(path(o([[-4, 18], [4, 18], [6.5, 23], [6, 29.5], [3.8, 30], [2.5, 26], [0, 29.5], [-3.5, 28], [-5, 23]])) + 'Z', SIVAS.hand, { stroke: DETAIL * 1.2, over: ink(`M${ox + 2.5} ${oy + 26}l-1 -3M${ox - 1} ${oy + 27.5}l-0.3 -3`, DETAIL * 0.8) });
    s += flat(taper(o([[4, 21], [7, 23], [8.5, 26]]), 3.4, 2.2), SIVAS.hand, { stroke: DETAIL });
    if (suit) {
      s += flat(limb([ox, oy], [ox, oy + 18], 10.5, 9.5, 0.3), SIVAS.suit, { over: ink(`M${ox - 3} ${oy + 8}q2 2 5 0`, DETAIL, SIVAS.suitDeep) });
      s += flat(roundPoly(o([[-5, 15], [5, 15], [5, 20], [-5, 20]]), 1.2), SIVAS.shirt, { stroke: DETAIL });
    } else {
      const stripes = [9, 13, 17].map((y) => flat(`M${ox - 6} ${oy + y}H${ox + 6}V${oy + y + 2.2}H${ox - 6}Z`, SIVAS.stripe, { stroke: 0.9 })).join('');
      s += flat(limb([ox, oy], [ox, oy + 19], 10, 9, 0.3), SIVAS.body, { inner: stripes });
    }
    return s;
  }, { far: true });
}

function thigh(suit = false): PartArt {
  return part(suit ? 'gorti.suit.thigh' : 'gorti.human.thigh', { x0: -9, y0: -5, x1: 9, y1: 24 }, (ox, oy) =>
    suit
      ? flat(limb([ox, oy], [ox, oy + 19], 15, 12, 0.7), SIVAS.suit, { over: ink(`M${ox + 2} ${oy + 5}q-3 6 1 11`, DETAIL, SIVAS.suitDeep) })
      : flat(limb([ox, oy], [ox, oy + 19], 16, 12.5, 0.8), SIVAS.leg, { inner: flat(jagged(ox - 2, oy + 8, 5.5, 5, 31, 8), SIVAS.sage, { stroke: DETAIL }), over: stitches([[ox + 4, oy + 2], [ox + 5, oy + 14]], 3.4, 1.6) }),
  { far: true });
}

function shin(suit = false): PartArt {
  return part(suit ? 'gorti.suit.shin' : 'gorti.human.shin', { x0: -9, y0: -4, x1: 9, y1: 24 }, (ox, oy) => {
    if (suit) return flat(limb([ox, oy], [ox, oy + 20], 12, 11, 0.3), SIVAS.suit, { over: ink(`M${ox - 5} ${oy + 17}H${ox + 5}`, DETAIL, SIVAS.suitDeep) });
    // A jagged cuff over the shin, like the painting's flowered hems.
    const cuff = `M${ox - 7} ${oy + 3}L${ox - 5} ${oy + 10}L${ox - 3} ${oy + 5}L${ox - 1} ${oy + 11}L${ox + 1.5} ${oy + 5}L${ox + 3.5} ${oy + 10.5}L${ox + 5.5} ${oy + 4.5}L${ox + 7.5} ${oy + 9}L${ox + 7} ${oy - 1}L${ox - 7} ${oy - 1}Z`;
    return flat(limb([ox, oy], [ox, oy + 20], 12, 10.5, 0.3), SIVAS.leg, { over: ink(`M${ox - 3} ${oy + 14}l3 1.5`, DETAIL * 0.8) }) + flat(cuff, SIVAS.mauveDeep, { stroke: DETAIL });
  }, { far: true });
}

/** Pale claw-foot (pivot at the ankle, sole at +6). */
function foot(): PartArt {
  return part('gorti.human.foot', { x0: -9, y0: -5, x1: 17, y1: 8 }, (ox, oy) =>
    flat(`M${ox - 7} ${oy - 2}Q${ox - 1} ${oy - 5} ${ox + 5} ${oy - 1}L${ox + 16} ${oy + 3}L${ox + 11} ${oy + 3.5}L${ox + 13} ${oy + 6}L${ox + 7} ${oy + 5}L${ox + 6} ${oy + 6.5}L${ox - 7} ${oy + 6.5}Z`, SIVAS.foot, { stroke: DETAIL * 1.3, over: ink(`M${ox - 2} ${oy + 1}q2 1 4 0`, DETAIL * 0.8, SIVAS.bodyLine) }),
  { far: true });
}

function shoe(): PartArt {
  return part('gorti.suit.foot', { x0: -9, y0: -5, x1: 17, y1: 8 }, (ox, oy) =>
    flat(roundPoly(tr([[-6, -3], [4, -3], [8, 0], [15, 2], [15.5, 6.5], [-7, 6.5]], ox, oy), [2, 2, 3, 3, 1.5, 1.5]), SIVAS.shoe, { stroke: DETAIL * 1.3, over: ink(`M${ox - 6} ${oy + 4.8}H${ox + 15}`, DETAIL * 0.8, '#8a8494') }),
  { far: true });
}

// ------------------------------------------------------------------ suit

function suitTorso(): PartArt {
  return part('gorti.suit.torso', { x0: -35, y0: -66, x1: 27, y1: 11 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const shirt =
      flat(`M${ox + 1} ${oy - 61}L${ox + 16} ${oy - 56}L${ox + 10} ${oy - 38}Z`, SIVAS.shirt, { stroke: DETAIL * 1.1 }) +
      flat(`M${ox + 7} ${oy - 57}L${ox + 11} ${oy - 56}L${ox + 11.5} ${oy - 44}L${ox + 9.5} ${oy - 39}L${ox + 7.5} ${oy - 44}Z`, SIVAS.tie, { stroke: DETAIL });
    const over =
      shirt +
      flat(`M${ox + 1} ${oy - 61}L${ox + 10} ${oy - 38}L${ox + 3} ${oy - 45}L${ox - 1} ${oy - 58}Z`, SIVAS.suitDeep, { stroke: DETAIL * 1.1 }) + // lapels
      flat(`M${ox + 16} ${oy - 56}L${ox + 10} ${oy - 38}L${ox + 17} ${oy - 46}L${ox + 19} ${oy - 53}Z`, SIVAS.suitDeep, { stroke: DETAIL * 1.1 }) +
      ink(path(o([[10, -38], [13, -22], [15, -8], [15, 6]])), DETAIL * 1.2) + // front edge
      `<circle cx="${ox + 12.5}" cy="${oy - 26}" r="1.3" fill="${INK}"/><circle cx="${ox + 14}" cy="${oy - 14}" r="1.3" fill="${INK}"/>` +
      ink(path(o([[-24, -32], [-17, -29], [-11, -31]])), DETAIL, SIVAS.suitDeep) +
      ink(path(o([[-24, -12], [-17, -10], [-11, -12]])), DETAIL, SIVAS.suitDeep) +
      // A name tag: the one label left.
      label(ox + 15, oy - 36, 8, 5, PASTEL.cream, 17, 8);
    return flat(path(o(HUMAN_BODY)) + 'Z', SIVAS.suit, { over });
  });
}

function suitArm(): PartArt {
  return part('gorti.suit.arm', { x0: -9, y0: -6, x1: 9, y1: 28 }, (ox, oy) =>
    flat(limb([ox, oy], [ox, oy + 23], 14, 11, 0.7), SIVAS.suit, { over: ink(`M${ox - 4} ${oy + 14}q4 2 8 0`, DETAIL, SIVAS.suitDeep) }),
  { far: true });
}

export function sivasliParts(): PartArt[] {
  return [
    moonHead(), ...moonEye(), ...moonMouth(), browPart('gorti.human.brow', SIVAS.moonDeep, 11, 3.4, { stroke: DETAIL }),
    sunHead(), ...sunEyes(), ...sunMouth(), browPart('gorti.sun.brow', '#c7743f', 9, 2.8, { stroke: DETAIL }),
    torso(), upperArm(), forearm(), thigh(), shin(), foot(),
    suitTorso(), suitArm(), forearm(true), thigh(true), shin(true), shoe(),
  ];
}

export const RIG_GORTI_HUMAN = humanoidRig('gorti.human', 'gorti.human', HUMAN_MOON_DIMS);
export const RIG_GORTI_HUMAN_SUN = humanoidRig('gorti.human.sun', 'gorti.human', HUMAN_SUN_DIMS);
export const RIG_GORTI_SUIT = humanoidRig('gorti.suit', 'gorti.suit', { ...HUMAN_MOON_DIMS, parts: { head: 'gorti.human.head' } });

