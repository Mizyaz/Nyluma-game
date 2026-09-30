import { glow, limb, type Pt } from '../../render/2d/svg';
import { DETAIL, flat, INK, PASTEL } from '../../render/2d/style';
import type { PartArt, RigDef } from '../../render/2d/rig/rigTypes';
import { almondEye, browPart, eyeSet, mouthSet, paintedMouth } from './face';
import { barkLines, claws, fillOnly, ink, label, maze, part, path, roundPoly, stitches, tr } from './kit';
import { humanoidRig, type HumanoidDims } from './skeleton';

// The inner forms of Chapter IV in the paintings' manner: the cowardly
// torch-bearer wrapped in a patched dormitory blanket, and the mechanical
// key-and-lock form of segmented grey panels, stitches and a pink maze
// (painting 3's robot parts).

const COW = {
  blanket: '#c9b8e4',
  blanketDeep: '#a995cf',
  face: '#f3e2dc',
  faceLine: '#cfa9a8',
  hair: '#4d3f4f',
  pyjama: '#aeb8d2',
  pyjamaLine: '#8290b4',
  foot: '#f1ddd8',
  wood: '#c09469',
  wrap: '#f4ead6',
  flame: '#f7c46b',
  flameCore: '#fff0b8',
  flameEdge: '#ef9a5c',
} as const;

const MECH = {
  plate: '#bdbcc4',
  plateDeep: '#9a99a4',
  joint: '#dddbe2',
  yellow: '#f2d878',
  pink: '#f2adcb',
  maze: '#e27fae',
  blue: '#8fa2c4',
  photo: '#f7eddc',
} as const;

// ---------------------------------------------------------------- coward

function cowardHead(): PartArt {
  return part('coward.head', { x0: -19, y0: -38, x1: 18, y1: 6 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const face: Pt[] = [[2, -2], [-4, -8], [-5, -20], [0, -27], [8, -27], [12, -22], [13, -17], [16, -13], [12.5, -11], [12.5, -7], [9, -3]];
    let s = flat(path(o(face)) + 'Z', COW.face, {
      over: ink(path(o([[13, -17], [15.5, -13], [12.5, -12]])), DETAIL) + ink(path(o([[2, -12], [5, -10]])), DETAIL * 0.8, COW.faceLine),
    });
    // A dark tuft under the hood.
    s += flat(path(o([[-1, -26], [4, -30], [10, -28], [9, -24], [5, -26], [2, -23]])) + 'Z', COW.hair, { stroke: DETAIL });
    // The blanket hood around the back of the head, its front edge stitched.
    const hood: Pt[] = [[-15, 4], [-18, -10], [-16, -25], [-8, -34], [4, -36], [12, -31], [14, -26], [7, -28], [2, -27], [-2, -21], [-2, -9], [2, 1], [-5, 5]];
    s += flat(path(o(hood)) + 'Z', COW.blanket, {
      inner: flat(roundPoly(o([[-16, -18], [-9, -19], [-8, -11], [-15, -10]]), 1.5), PASTEL.mint, { stroke: DETAIL, over: stitches(o([[-15.5, -14.5], [-8.5, -15]]), 2.6, 1.2) }),
      over: stitches(o([[10, -30], [4, -28], [-1, -22], [-1, -10], [2, 0]]), 3.4, 1.5),
    });
    return s;
  });
}

function cowardEyes(): PartArt[] {
  // Big and worried.
  return eyeSet('coward', { x0: -7, y0: -8, x1: 7, y1: 7 }, (v, ox, oy) => almondEye(v, ox, oy, 3.6, 3.3, { outer: -1, iris: '#4b3f5a', look: 0.35, pupil: 0.55, lidFill: COW.face }));
}

function cowardMouth(): PartArt[] {
  const m = 2.6;
  return mouthSet('coward', { x0: -m - 3, y0: -m - 3, x1: m + 3, y1: m + 3 }, (v, ox, oy) => paintedMouth(v, ox, oy, m, { lip: '#e7a3b0', inside: '#5a2a3c', sad: 0.6 }));
}

function cowardTorso(): PartArt {
  return part('coward.torso', { x0: -16, y0: -40, x1: 16, y1: 12 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    // The blanket wrapped round the shoulders, a ragged hem.
    const pts: Pt[] = [[-11, 8], [-13, -4], [-13, -18], [-11, -29], [-3, -35], [6, -34], [11, -28], [12, -16], [11, -3], [13, 7], [9, 5], [7, 10], [3, 6], [0, 10], [-3, 6], [-7, 10]];
    const inner =
      flat(roundPoly(o([[-12, -26], [-4, -27], [-3, -18], [-11, -17]]), 1.5), PASTEL.butter, { stroke: DETAIL, over: stitches(o([[-11.5, -21.5], [-3.5, -22.5]]), 2.8, 1.2) }) +
      flat(roundPoly(o([[2, -12], [10, -13], [10, -4], [3, -3]]), 1.5), PASTEL.pink, { stroke: DETAIL }) +
      ink(path(o([[-8, -8], [-3, -6], [1, -9]])), DETAIL, COW.blanketDeep) +
      ink(path(o([[3, -32], [5, -24], [3, -16]])), DETAIL, COW.blanketDeep);
    return flat(`M${pts.map(([x, y]) => `${ox + x} ${oy + y}`).join('L')}Z`, COW.blanket, { inner, over: label(ox - 2, oy - 5, 8, 4.5, PASTEL.cream, 5, -8) });
  });
}

function cowardArm(): PartArt {
  return part('coward.arm', { x0: -7, y0: -5, x1: 7, y1: 21 }, (ox, oy) =>
    flat(limb([ox, oy], [ox, oy + 16], 9, 8, 0.4), COW.blanket, { over: ink(`M${ox - 3} ${oy + 12}q3 2 6 0`, DETAIL, COW.blanketDeep) }),
  { far: true });
}

function cowardFore(): PartArt {
  return part('coward.fore', { x0: -7, y0: -4, x1: 8, y1: 27 }, (ox, oy) => {
    let s = flat(path(tr([[-3, 16], [3, 16], [4.5, 20], [3, 24], [-1, 25], [-3.5, 21]], ox, oy)) + 'Z', COW.face, { stroke: DETAIL * 1.2 });
    s += flat(limb([ox, oy], [ox, oy + 17], 8, 7, 0.2), COW.blanket, { over: ink(`M${ox - 4} ${oy + 14}H${ox + 4}`, DETAIL, COW.blanketDeep) });
    return s;
  }, { far: true });
}

function cowardThigh(): PartArt {
  return part('coward.thigh', { x0: -7, y0: -4, x1: 7, y1: 23 }, (ox, oy) =>
    flat(limb([ox, oy], [ox, oy + 19], 9.5, 8, 0.3), COW.pyjama, { inner: ink(`M${ox - 2} ${oy - 2}V${oy + 22}M${ox + 2} ${oy - 2}V${oy + 22}`, 0.9, COW.pyjamaLine) }),
  { far: true });
}

function cowardShin(): PartArt {
  return part('coward.shin', { x0: -6, y0: -4, x1: 6, y1: 22 }, (ox, oy) =>
    flat(limb([ox, oy], [ox, oy + 19], 8, 7, 0.2), COW.pyjama, { inner: ink(`M${ox - 1.5} ${oy - 2}V${oy + 21}M${ox + 2} ${oy - 2}V${oy + 21}`, 0.9, COW.pyjamaLine) }),
  { far: true });
}

function cowardFoot(): PartArt {
  return part('coward.foot', { x0: -8, y0: -4, x1: 13, y1: 8 }, (ox, oy) =>
    flat(path(tr([[-4, -2], [-6, 2], [-5, 6], [6, 6], [11.5, 5], [10, 1.5], [3, -2]], ox, oy)) + 'Z', COW.foot, { stroke: DETAIL * 1.2, over: ink(`M${ox + 8} ${oy + 5.5}l0.5 -2M${ox + 5.5} ${oy + 5.8}l0.4 -2`, DETAIL * 0.7) }),
  { far: true });
}

function torch(): PartArt {
  // An oversized torch; pivot at the grip (held around its middle).
  return part('coward.torch', { x0: -9, y0: -58, x1: 9, y1: 26 }, (ox, oy) => {
    let s = flat(limb([ox, oy + 24], [ox + 1, oy - 40], 6, 7, 0.3), COW.wood, { over: barkLines([ox, oy + 20], [ox + 1, oy - 36], 5, 61, { n: 2, knots: 1 }) });
    s += flat(roundPoly([[ox - 7, oy - 53], [ox + 8, oy - 53], [ox + 8, oy - 38], [ox - 7, oy - 38]], 3), COW.wrap, {
      stroke: DETAIL * 1.3,
      over: ink(`M${ox - 7} ${oy - 48}l15 2M${ox - 7} ${oy - 43}l15 2`, DETAIL),
    });
    return s;
  });
}

function flame(): PartArt {
  return part('coward.flame', { x0: -13, y0: -32, x1: 13, y1: 5 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    let s = glow(ox, oy - 10, 15, PASTEL.butter, 0.5);
    s += flat(path(o([[-9, 0], [-10, -9], [-5, -17], [-3, -27], [2, -18], [6, -25], [9, -12], [9, -2], [3, 2]])) + 'Z', COW.flame, { stroke: DETAIL * 1.3, inner: fillOnly(path(o([[-10, 2], [-8, -6], [-2, -4], [4, -7], [10, -3], [10, 4]])) + 'Z', COW.flameEdge, 0.8) });
    s += `<path d="${path(o([[-4, -1], [-5, -8], [-1, -14], [3, -9], [4, -2]]))}Z" fill="${COW.flameCore}"/>`;
    return s;
  });
}

// ---------------------------------------------------------------- mech

function mechHead(): PartArt {
  return part('mech.head', { x0: -16, y0: -44, x1: 18, y1: 5 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    // An antenna with a pink bead: something alive left in the machine.
    let s = ink(`M${ox - 5} ${oy - 29}L${ox - 8} ${oy - 38}`, 1.8) + `<circle cx="${ox - 8.5}" cy="${oy - 39}" r="2.2" fill="${MECH.pink}" stroke="${INK}" stroke-width="${DETAIL}"/>`;
    const box = roundPoly(o([[-12, -26], [-5, -30], [10, -29], [15, -22], [16, -8], [12, -1], [-9, 0], [-13, -8]]), 4);
    const inner =
      fillOnly(`M${ox - 20} ${oy - 34}H${ox - 5}V${oy + 4}H${ox - 20}Z`, MECH.plateDeep) +
      ink(`M${ox - 5} ${oy - 30}V${oy}`, DETAIL) +
      ink(`M${ox - 5} ${oy - 15}H${ox + 16}`, DETAIL) +
      `<circle cx="${ox - 9}" cy="${oy - 22}" r="1.2" fill="${MECH.joint}" stroke="${INK}" stroke-width="0.8"/><circle cx="${ox - 9}" cy="${oy - 6}" r="1.2" fill="${MECH.joint}" stroke="${INK}" stroke-width="0.8"/>` +
      stitches(o([[-3, -26], [4, -27.5]]), 2.6, 1.2);
    s += flat(box, MECH.plate, { inner });
    // The eye is a key (bow ring, shaft, bits); the mouth a keyhole.
    const kx = ox + 8;
    const ky = oy - 20;
    s += `<circle cx="${kx - 2}" cy="${ky}" r="3.2" fill="${MECH.yellow}" stroke="${INK}" stroke-width="${DETAIL * 1.2}"/><circle cx="${kx - 2}" cy="${ky}" r="1.2" fill="${INK}"/>`;
    s += ink(`M${kx + 1.2} ${ky}L${kx + 7} ${ky}M${kx + 5} ${ky}l0 2.4M${kx + 7} ${ky}l0 3`, 1.8);
    s += `<path d="M${ox + 6.8} ${oy - 10}a2.4 2.4 0 1 1 4.4 0l1.2 5.2h-6.8z" fill="${INK}"/>`;
    return s;
  });
}

function mechTorso(): PartArt {
  return part('mech.torso', { x0: -16, y0: -42, x1: 17, y1: 8 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const shell = roundPoly(o([[-10, 5], [-12, -10], [-12, -30], [-6, -38], [7, -38], [13, -31], [13, -10], [10, 5]]), 4);
    let cols = '';
    [-8, -3, 2, 7].forEach((x, i) => {
      cols += flat(`M${ox + x} ${oy + 2}V${oy - 10}L${ox + x + 1.6} ${oy - 12.5}L${ox + x + 2.6} ${oy - 10}L${ox + x + 3.6} ${oy - 12.5}L${ox + x + 4.8} ${oy - 10}V${oy + 2}Z`, i % 2 ? MECH.pink : MECH.yellow, { stroke: DETAIL });
    });
    const over =
      ink(`M${ox - 12} ${oy - 15}H${ox + 13}`, DETAIL) +
      flat(roundPoly(o([[-9, -34], [3, -34], [3, -19], [-9, -19]]), 2), '#f6e8ef', { stroke: DETAIL * 1.1, inner: maze(ox - 8, oy - 33, 10, 13, MECH.maze, 3, 1.1) }) +
      // A lodged memory: a little photo.
      flat(roundPoly(o([[5, -33], [11, -33], [11, -25], [5, -25]]), 1), MECH.photo, { stroke: DETAIL, inner: `<circle cx="${ox + 8}" cy="${oy - 30}" r="1.6" fill="${PASTEL.lilac}"/>` }) +
      stitches(o([[6, -22], [11, -21]]), 2.4, 1.2) +
      cols;
    return flat(shell, MECH.plate, { over });
  });
}

function mechArm(): PartArt {
  return part('mech.arm', { x0: -7, y0: -7, x1: 7, y1: 25 }, (ox, oy) =>
    flat(roundPoly([[ox - 4, oy], [ox + 4, oy], [ox + 3.6, oy + 21], [ox - 3.6, oy + 21]], 2), MECH.plate, { stroke: DETAIL * 1.2, over: stitches([[ox, oy + 5], [ox, oy + 17]], 3.2, 1.6) }) +
    flat(roundPoly([[ox - 6, oy - 5], [ox + 6, oy - 5], [ox + 5.5, oy + 5], [ox - 5.5, oy + 5]], 2.5), MECH.blue, { stroke: DETAIL * 1.2 }),
  { far: true });
}

function mechFore(): PartArt {
  return part('mech.fore', { x0: -8, y0: -5, x1: 8, y1: 33 }, (ox, oy) => {
    let s = claws([ox, oy + 22], Math.PI / 2, 0.8, [7, 8, 7], 2.8, MECH.plateDeep, 71, 0.2);
    s += flat(roundPoly([[ox - 3.6, oy], [ox + 3.6, oy], [ox + 3.2, oy + 22], [ox - 3.2, oy + 22]], 2), MECH.plate, { stroke: DETAIL * 1.2, over: ink(`M${ox - 3} ${oy + 8}H${ox + 3}M${ox - 3} ${oy + 15}H${ox + 3}`, DETAIL * 0.9) });
    s += `<circle cx="${ox}" cy="${oy}" r="3.2" fill="${MECH.joint}" stroke="${INK}" stroke-width="${DETAIL * 1.1}"/>`;
    return s;
  }, { far: true });
}

function mechThigh(): PartArt {
  return part('mech.thigh', { x0: -7, y0: -6, x1: 7, y1: 25 }, (ox, oy) =>
    flat(roundPoly([[ox - 5, oy - 1], [ox + 5, oy - 1], [ox + 4.4, oy + 21], [ox - 4.4, oy + 21]], 2.5), MECH.plate, {
      stroke: DETAIL * 1.2,
      over: flat(roundPoly([[ox - 4, oy + 9], [ox + 4, oy + 9], [ox + 4, oy + 15], [ox - 4, oy + 15]], 1), MECH.pink, { stroke: DETAIL }) + stitches([[ox + 1, oy + 2], [ox + 1, oy + 8]], 2.6, 1.3),
    }) + `<circle cx="${ox}" cy="${oy}" r="3.4" fill="${MECH.joint}" stroke="${INK}" stroke-width="${DETAIL * 1.1}"/>`,
  { far: true });
}

function mechShin(): PartArt {
  return part('mech.shin', { x0: -6, y0: -6, x1: 6, y1: 25 }, (ox, oy) =>
    flat(roundPoly([[ox - 4.2, oy - 1], [ox + 4.2, oy - 1], [ox + 3.6, oy + 21], [ox - 3.6, oy + 21]], 2), MECH.plate, { stroke: DETAIL * 1.2, over: stitches([[ox, oy + 4], [ox, oy + 17]], 3, 1.5) }) +
    `<circle cx="${ox}" cy="${oy}" r="3.2" fill="${MECH.joint}" stroke="${INK}" stroke-width="${DETAIL * 1.1}"/>`,
  { far: true });
}

function mechFoot(): PartArt {
  return part('mech.foot', { x0: -8, y0: -4, x1: 14, y1: 8 }, (ox, oy) =>
    flat(roundPoly(tr([[-6, -2], [4, -2], [13, 2], [13, 6], [-7, 6]], ox, oy), [2, 2, 2, 1.5, 1.5]), MECH.plateDeep, { stroke: DETAIL * 1.2, over: fillOnly(`M${ox - 8} ${oy + 3.5}H${ox + 14}V${oy + 7}H${ox - 8}Z`, MECH.yellow) + ink(`M${ox - 7} ${oy + 3.5}H${ox + 13}`, DETAIL) }),
  { far: true });
}

export function formParts(): PartArt[] {
  return [
    cowardHead(), cowardTorso(), cowardArm(), cowardFore(), cowardThigh(), cowardShin(), cowardFoot(), torch(), flame(),
    browPart('coward.brow', COW.hair, 9, 2.8, { sad: 1, stroke: DETAIL }),
    ...cowardEyes(),
    ...cowardMouth(),
    mechHead(), mechTorso(), mechArm(), mechFore(), mechThigh(), mechShin(), mechFoot(),
    browPart('mech.brow', '#5b5d6b', 10, 3, { stroke: DETAIL }),
  ];
}

const COWARD_DIMS: HumanoidDims = {
  hip: 42, thigh: 19, shin: 19, torso: 34, shoulderY: 30, shoulderX: 2, upper: 16, hipX: 3, headX: 1, hand: 22, eye: [7.4, -18.5],
  belly: [12, -14],
  foot: { sole: 6, heel: -5.5, ball: 8 },
  brow: { part: 'coward.brow', up: 5.2, dx: 0 },
  face: { eye: 'coward', mouth: 'coward', mouthAt: [10.5, -7.5] },
};
const MECH_DIMS: HumanoidDims = {
  hip: 46, thigh: 21, shin: 21, torso: 38, shoulderY: 33, shoulderX: 2, upper: 21, hipX: 4, headX: 1, hand: 28, eye: [7, -20],
  belly: [13, -16],
  foot: { sole: 6, heel: -6.5, ball: 9 },
  brow: { part: 'mech.brow', up: 6, dx: -1.5 },
};

export const RIG_COWARD: RigDef = (() => {
  const r = humanoidRig('coward', 'coward', COWARD_DIMS, false);
  r.joints.push({ id: 'torch', parent: 'foreR', x: 0, y: 22, part: 'coward.torch', z: 72 });
  // The flame trails the torch's moves.
  r.joints.push({ id: 'flame', parent: 'torch', x: 1, y: -50, part: 'coward.flame', z: 73, spring: { k: 120, c: 6, lag: 0.5, gain: 0.004, tip: [0, -26] } });
  r.attach.flame = { joint: 'torch', x: 1, y: -58 };
  return r;
})();

export const RIG_MECH: RigDef = humanoidRig('mech', 'mech', MECH_DIMS, false);
