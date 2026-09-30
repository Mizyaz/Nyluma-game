import { ellipsePath, limb, taper, type Pt } from '../svg';
import { DETAIL, flat, INK, PASTEL } from '../style';
import type { PartArt } from '../rigTypes';
import { almondEye, browPart, eyeSet, mouthSet, paintedMouth } from './face';
import { barkLines, claws, ink, leaf, maze, part, path, rootSeg, roundPoly, tr } from './kit';
import { humanoidRig, type HumanoidDims } from './skeleton';

// Gorti as a warrior (painting 4, the left figure): tall, a pale human face
// with blond hair and a sad look, a green leaf tunic with a jagged hem and
// wavy lines, pink root legs with a watch strapped on one, one arm a pink
// root with leaves and claw fingers, the other grey and mechanical with a
// pink maze.

export const WARRIOR = {
  skin: '#f1dade',
  skinLine: '#c99aa8',
  hair: '#f2dc72',
  hairDeep: '#d9bb4a',
  tunic: '#c1d488',
  tunicDeep: '#a7bf6c',
  root: '#f3b5cf',
  rootDeep: '#e493b7',
  leaf: '#9cc47a',
  metal: '#c5c3ca',
  metalDeep: '#a09ea8',
  plate: '#f6e8ef',
  maze: '#e27fae',
  iris: '#7d91a9',
} as const;

const EYE_AT: Pt = [5, -27];

export const WARRIOR_DIMS: HumanoidDims = {
  hip: 62, thigh: 29, shin: 29, torso: 64, shoulderY: 49, shoulderX: 3, upper: 26, hipX: 5, headX: 3, hand: 30,
  eye: EYE_AT,
  brow: { part: 'gorti.warrior.brow', up: 6.2, dx: -5 },
  face: { eye: 'gorti.warrior', mouth: 'gorti.warrior', mouthAt: [11, -11] },
  parts: { armL: 'gorti.warrior.mecharm', foreL: 'gorti.warrior.mechfore' },
  watch: { part: 'gorti.warrior.watch', side: 'L', at: 22 },
  extra: [
    // The tunic's jagged hem hangs over the thighs and sways a little.
    { id: 'skirt', parent: 'torso', x: 0, y: -4, part: 'gorti.warrior.skirt', z: 150, spring: { k: 130, c: 7, lag: 0.35, gain: 0.0025, tip: [0, 26] } },
  ],
};

// ------------------------------------------------------------------ head

function head(): PartArt {
  return part('gorti.warrior.head', { x0: -17, y0: -56, x1: 22, y1: 4 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    // Neck (the collar of the tunic covers its base).
    let s = flat(limb([ox - 1, oy + 4], [ox, oy - 10], 11, 10, 0), WARRIOR.skin, { over: ink(`M${ox + 3} ${oy - 1}q1 -4 -1 -7`, DETAIL * 0.8, WARRIOR.skinLine) });
    // Pointed ear.
    s += flat(path(o([[-7, -27], [-15, -35], [-13, -26], [-10, -20], [-6, -19]])) + 'Z', WARRIOR.skin, { over: ink(path(o([[-12, -31], [-10, -25]])), DETAIL * 0.8, WARRIOR.skinLine) });
    const face: Pt[] = [[6, -2], [-3, -5], [-9, -12], [-11, -22], [-11, -33], [-7, -41], [2, -45], [10, -43], [14, -37], [15, -30], [19, -21], [16, -18], [16, -14], [14, -8], [11, -4]];
    const details =
      // Nose line, tired rings under the eyes, cheek.
      ink(path(o([[14, -29], [17.5, -21], [14.5, -19]])), DETAIL) +
      ink(path(o([[-2.5, -23.5], [0, -22], [3, -23]])), DETAIL * 0.8, WARRIOR.skinLine) +
      ink(path(o([[9, -23.5], [11, -22.5], [13, -23.5]])), DETAIL * 0.8, WARRIOR.skinLine) +
      ink(path(o([[-5, -14], [-2, -10]])), DETAIL * 0.8, WARRIOR.skinLine) +
      // The far brow, drooping (the near one is animated).
      ink(path(o([[9, -32.5], [12, -33.5], [14.5, -32]])), 1.8, WARRIOR.hairDeep);
    s += flat(path(o(face)) + 'Z', WARRIOR.skin, { over: details });
    // Blond hair combed up, with ink strands.
    const hair: Pt[] = [[-12, -30], [-13, -40], [-9, -48], [0, -53], [11, -52], [17, -46], [16, -39], [11, -41], [5, -39], [-1, -41], [-6, -37], [-9, -33]];
    const strands = ink(path(o([[-9, -38], [-4, -46], [4, -50]])), DETAIL) + ink(path(o([[-3, -40], [3, -46], [11, -49]])), DETAIL) + ink(path(o([[5, -41], [11, -45], [15, -44]])), DETAIL) + ink(path(o([[-11, -34], [-9, -42]])), DETAIL);
    s += flat(path(o(hair)) + 'Z', WARRIOR.hair, { over: strands });
    return s;
  });
}

function eyes(): PartArt[] {
  // Heavy upper lids: the painting's sad, tired look.
  return eyeSet('gorti.warrior', { x0: -12, y0: -8, x1: 13, y1: 7 }, (v, ox, oy) =>
    almondEye(v, ox - 5.5, oy, 4.2, 2.6, { outer: -1, iris: WARRIOR.iris, lid: 0.34, lidFill: WARRIOR.skin, look: 0.3 }) +
    almondEye(v, ox + 6.5, oy, 3.2, 2.4, { outer: 1, iris: WARRIOR.iris, lid: 0.34, lidFill: WARRIOR.skin, look: 0.45 }),
  );
}

function mouth(): PartArt[] {
  const m = 4.2;
  return mouthSet('gorti.warrior', { x0: -m - 3, y0: -m - 3, x1: m + 3, y1: m + 3 }, (v, ox, oy) => paintedMouth(v, ox, oy, m, { lip: '#e89ab2', inside: '#6b2c43', sad: 1.4 }));
}

// ------------------------------------------------------------------ body

/** Short wavy strokes scattered on the tunic. */
function waves(ox: number, oy: number, at: Pt[]): string {
  return at.map(([x, y]) => ink(`M${ox + x - 3} ${oy + y}q1.5 -1.6 3 0t3 0`, DETAIL)).join('');
}

function torso(): PartArt {
  return part('gorti.warrior.torso', { x0: -21, y0: -70, x1: 22, y1: 6 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const tunic: Pt[] = [[-13, 3], [-15, -10], [-16, -26], [-18, -40], [-18, -48], [-11, -53], [-7, -57], [-6, -67], [9, -67], [10, -57], [15, -53], [20, -48], [19, -36], [15, -22], [13, -8], [13, 3]];
    const over =
      waves(ox, oy, [[-8, -40], [6, -33], [-9, -24], [8, -18], [-2, -10], [11, -45], [-3, -30], [4, -60]]) +
      // Collar seam and the chest emblem: an eye in a leaf.
      ink(path(o([[-6, -57], [2, -55], [10, -57]])), DETAIL) +
      flat(`M${ox - 11} ${oy - 44}Q${ox - 4} ${oy - 50} ${ox + 3} ${oy - 44}Q${ox - 4} ${oy - 39} ${ox - 11} ${oy - 44}Z`, '#f3eed8', {
        stroke: DETAIL,
        inner: `<circle cx="${ox - 3.6}" cy="${oy - 44}" r="2.2" fill="${WARRIOR.iris}"/><circle cx="${ox - 3.6}" cy="${oy - 44}" r="1" fill="${INK}"/>`,
      }) +
      ink(`M${ox - 9} ${oy - 46.5}l-1 -1.6M${ox - 6} ${oy - 47.8}l-0.4 -1.8M${ox - 2.5} ${oy - 48}l0.3 -1.8M${ox + 1} ${oy - 46.8}l1 -1.5`, DETAIL * 0.8);
    return flat(path(o(tunic)) + 'Z', WARRIOR.tunic, { over });
  });
}

/** The jagged leaf hem of the tunic (over the thighs). */
function skirt(): PartArt {
  return part('gorti.warrior.skirt', { x0: -21, y0: -8, x1: 21, y1: 30 }, (ox, oy) => {
    const pts: Pt[] = [[-14, -6], [14, -6], [16, 6], [19, 17], [13, 13], [11, 25], [6, 15], [2, 28], [-2, 16], [-7, 26], [-10, 14], [-15, 22], [-15, 11], [-18, 14], [-15, 3]];
    const d = `M${pts.map(([x, y]) => `${ox + x} ${oy + y}`).join('L')}Z`;
    return flat(d, WARRIOR.tunic, {
      over:
        waves(ox, oy, [[-6, 3], [7, 6], [0, 12], [-9, 12]]) +
        ink(`M${ox + 2} ${oy + 16}l0.5 8M${ox - 7} ${oy + 15}l-0.3 7M${ox + 11} ${oy + 14}l0 7`, DETAIL * 0.8, '#7f9a4c'),
    });
  });
}

/** The pink root arm: a leafy cuff, bark lines, leaves sprouting. */
function rootArm(): PartArt {
  return part('gorti.warrior.arm', { x0: -10, y0: -9, x1: 10, y1: 30 }, (ox, oy) => {
    let s = rootSeg([ox, oy], [ox, oy + 26], 11.5, 9.5, WARRIOR.root, 41, { lines: 3 });
    // Grey shoulder cap and the spiky green cuff (as in the painting).
    s += flat(`M${ox - 7} ${oy + 4}Q${ox - 8} ${oy - 7} ${ox} ${oy - 7}Q${ox + 8} ${oy - 7} ${ox + 7} ${oy + 4}Z`, WARRIOR.metal, { stroke: DETAIL * 1.2 });
    s += flat(`M${ox - 7} ${oy + 3}L${ox - 9} ${oy + 11}L${ox - 4.5} ${oy + 7}L${ox - 2} ${oy + 13}L${ox + 1} ${oy + 7}L${ox + 4} ${oy + 12}L${ox + 5.5} ${oy + 6.5}L${ox + 9} ${oy + 10}L${ox + 7} ${oy + 3}Z`, WARRIOR.leaf, { stroke: DETAIL * 1.1 });
    return s;
  }, { far: true });
}

function rootFore(): PartArt {
  return part('gorti.warrior.fore', { x0: -16, y0: -6, x1: 16, y1: 44 }, (ox, oy) => {
    let s = leaf([ox - 3.5, oy + 9], Math.PI * 0.85, 9, WARRIOR.leaf);
    s += leaf([ox + 3.8, oy + 15], -Math.PI * 0.12, 8, WARRIOR.leaf);
    s += claws([ox, oy + 24], Math.PI / 2, 1.05, [13, 16, 17, 13], 4.8, WARRIOR.root, 43, 0.28);
    s += rootSeg([ox, oy], [ox, oy + 25], 9.5, 10.5, WARRIOR.root, 42, { lines: 3, bulge: 0.2 });
    return s;
  }, { far: true });
}

/** The grey mechanical arm, in segments. */
function mechArm(): PartArt {
  return part('gorti.warrior.mecharm', { x0: -10, y0: -9, x1: 10, y1: 30 }, (ox, oy) => {
    let s = flat(roundPoly([[ox - 5.5, oy + 10], [ox + 5.5, oy + 10], [ox + 4.8, oy + 27], [ox - 4.8, oy + 27]], 2.5), WARRIOR.metal, { stroke: DETAIL * 1.2, over: ink(`M${ox - 4} ${oy + 18}H${ox + 4}`, DETAIL * 0.9) });
    s += flat(roundPoly([[ox - 8, oy - 6], [ox + 8, oy - 6], [ox + 7, oy + 12], [ox - 7, oy + 12]], 4), WARRIOR.metal, {
      stroke: DETAIL * 1.3,
      over: ink(`M${ox - 7} ${oy + 3}H${ox + 7}`, DETAIL) + `<circle cx="${ox + 3.5}" cy="${oy - 1}" r="1.3" fill="${WARRIOR.metalDeep}" stroke="${INK}" stroke-width="0.8"/>`,
    });
    return s;
  }, { far: true });
}

function mechFore(): PartArt {
  return part('gorti.warrior.mechfore', { x0: -12, y0: -6, x1: 12, y1: 40 }, (ox, oy) => {
    let s = flat(roundPoly([[ox - 4.8, oy - 2], [ox + 4.8, oy - 2], [ox + 4.2, oy + 21], [ox - 4.2, oy + 21]], 2), WARRIOR.metal, {
      stroke: DETAIL * 1.2,
      over: ink(`M${ox - 4} ${oy + 7}H${ox + 4}M${ox - 4} ${oy + 13}H${ox + 4}`, DETAIL * 0.9),
    });
    s += `<circle cx="${ox}" cy="${oy}" r="3.4" fill="${WARRIOR.metalDeep}" stroke="${INK}" stroke-width="${DETAIL}"/>`;
    // Little grey claw fingers beyond the maze plate.
    s += claws([ox, oy + 30], Math.PI / 2, 0.9, [7, 8.5, 7], 2.8, WARRIOR.metal, 45, 0.3);
    // The pale plate with the pink maze.
    s += flat(ellipsePath(ox, oy + 26, 8.5, 6), WARRIOR.plate, { stroke: DETAIL * 1.2, inner: maze(ox - 7, oy + 21, 14, 10, WARRIOR.maze, 7, 1.1) });
    return s;
  }, { far: true });
}

function thigh(): PartArt {
  return part('gorti.warrior.thigh', { x0: -9, y0: -5, x1: 9, y1: 33 }, (ox, oy) => rootSeg([ox, oy], [ox, oy + 29], 14, 11, WARRIOR.root, 51, { bulge: 0.6 }), { far: true });
}

function shin(): PartArt {
  return part('gorti.warrior.shin', { x0: -9, y0: -4, x1: 9, y1: 32 }, (ox, oy) =>
    rootSeg([ox, oy], [ox, oy + 29], 11, 8.6, WARRIOR.root, 52) + leaf([ox + 4, oy + 8], -0.5, 8, WARRIOR.leaf),
  { far: true });
}

/** Pink root claws with green tips (pivot at the ankle, sole at +6). */
function foot(): PartArt {
  return part('gorti.warrior.foot', { x0: -12, y0: -5, x1: 20, y1: 9 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const toe = (pts: Pt[], w: number): string => {
      const q = o(pts);
      return flat(taper(q, w, 0.7), WARRIOR.root, { stroke: DETAIL * 1.2, inner: `<path d="${taper(q.slice(-2), w * 0.45, 0.5)}" fill="${WARRIOR.leaf}"/>` });
    };
    let s = toe([[-2, 3], [-7, 5], [-11, 6.3]], 3.6);
    s += toe([[1, 3.5], [7, 5.5], [12, 6.4]], 4.2);
    s += toe([[2, 1.5], [10, 2.8], [18, 6]], 4.8);
    s += flat(ellipsePath(ox, oy + 2.4, 5.8, 4.2), WARRIOR.root, { over: barkLines([ox - 3, oy + 1], [ox + 3, oy + 3], 4, 53, { n: 1, knots: 0 }) });
    return s;
  }, { far: true });
}

function watch(): PartArt {
  return part('gorti.warrior.watch', { x0: -8, y0: -6, x1: 8, y1: 6 }, (ox, oy) =>
    flat(`M${ox - 6.8} ${oy - 2.6}H${ox + 6.8}V${oy + 2.6}H${ox - 6.8}Z`, '#5f4f45', { stroke: DETAIL }) +
    flat(ellipsePath(ox + 1, oy, 4.3, 4.3), PASTEL.cream, { stroke: DETAIL * 1.2, over: ink(`M${ox + 1} ${oy}v-2.8M${ox + 1} ${oy}l2 1`, 0.9) + `<circle cx="${ox + 1}" cy="${oy}" r="3.2" fill="none" stroke="${PASTEL.sand}" stroke-width="0.8"/>` }),
  );
}

export function warriorParts(): PartArt[] {
  return [
    head(), ...eyes(), ...mouth(), browPart('gorti.warrior.brow', WARRIOR.hairDeep, 9, 2.6, { sad: 1.6, stroke: DETAIL * 0.9 }),
    torso(), skirt(), rootArm(), rootFore(), mechArm(), mechFore(), thigh(), shin(), foot(), watch(),
  ];
}

export const RIG_GORTI_WARRIOR = humanoidRig('gorti.root.warrior', 'gorti.warrior', WARRIOR_DIMS);

