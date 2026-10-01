import { ellipsePath, glow, type Pt } from '../../render/2d/svg';
import { darkOf, DETAIL, INK, LINE, lightOf, PASTEL, SHADE } from '../../render/2d/style';
import type { PartArt, RigDef } from '../../render/2d/rig/rigTypes';
import { almondEye, browPart, eyeSet, mouthSet, paintedMouth } from './face';
import { barkLines, cflat, claws, comic, comicLimb, fillOnly, fold, hatchLines, label, maze, part, path, roundPoly, stitches, tr } from './kit';
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

/** Folds and seams of the blanket, in its own dark tone. */
const BLANKET_FOLD = darkOf(COW.blanket, 0.4);

function cowardHead(): PartArt {
  return part('coward.head', { x0: -19, y0: -38, x1: 18, y1: 6 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    const crease = darkOf(COW.faceLine, 0.25);
    const face: Pt[] = [[2, -2], [-4, -8], [-5, -20], [0, -27], [8, -27], [12, -22], [13, -17], [16, -13], [12.5, -11], [12.5, -7], [9, -3]];
    // The hood throws its shadow across the side of the face (the hood is
    // drawn over it, so only a band along its edge shows).
    const hoodShadow = path(o([[15, -26.5], [8, -25.2], [3.8, -23.6], [1.4, -19], [1.4, -9], [4.6, 0.6], [0, 4], [-6, -8], [-6, -24], [3, -32], [15, -30]])) + 'Z';
    let s = comic(path(o(face)) + 'Z', COW.face, {
      line: LINE.limb,
      tone: SHADE.warm,
      rim: [2.4, -1.6],
      shade: hoodShadow,
      glint: [-0.7, 0.8],
      inner: `<ellipse cx="${ox + 5.6}" cy="${oy - 10.4}" rx="2.9" ry="1.8" fill="${lightOf(PASTEL.pink, 0.4)}"/>`,
      over:
        fold(path(o([[13, -17], [15.5, -13], [12.5, -12]])), crease) +
        // Sleepless: bags under the eyes, a crease of worry at the mouth.
        fold(`M${P(4.4, -14.2)}q3.2 1.9 6.8 0.3`, crease, LINE.fine) +
        fold(`M${P(5.6, -12.4)}q2 0.9 4 0.3`, crease, LINE.fine * 0.8) +
        fold(`M${P(6, -3.4)}q2.6 0.9 4.6 -0.5`, crease, LINE.fine),
    });
    // A dark tuft under the hood.
    s += comic(path(o([[-1, -26], [4, -30], [10, -28], [9, -24], [5, -26], [2, -23]])) + 'Z', COW.hair, {
      line: LINE.detail,
      light: path(o([[1.2, -26.4], [4.4, -28.8], [8.4, -27.6], [4.6, -27.6]])) + 'Z',
      lightFill: lightOf(COW.hair, 0.3),
    });
    // The blanket hood around the back of the head: its front edge turned
    // back and stitched, the cloth bunching where it gathers at the neck.
    const hood: Pt[] = [[-15, 4], [-18, -10], [-16, -25], [-8, -34], [4, -36], [12, -31], [14, -26], [7, -28], [2, -27], [-2, -21], [-2, -9], [2, 1], [-5, 5]];
    const patch = comic(roundPoly(o([[-16, -18], [-9, -19], [-8, -11], [-15, -10]]), 1.5), PASTEL.mint, {
      line: LINE.fine * 1.5,
      glint: [-0.5, 0.5],
      over: stitches(o([[-15.5, -14.5], [-8.5, -15]]), 2.6, 1.2, darkOf(PASTEL.mint, 0.55), LINE.fine),
    });
    s += comic(path(o(hood)) + 'Z', COW.blanket, {
      line: LINE.body,
      tone: SHADE.deep,
      rim: [4.4, -2.6],
      hatch: 2.4,
      glint: [-1, 1.1],
      inner: patch,
      over:
        fold(path(o([[13.4, -28.2], [7, -30.2], [1, -29], [-3.8, -21.6], [-3.8, -9], [0.2, 1.8]])), BLANKET_FOLD) +
        stitches(o([[10.4, -30.4], [6, -31], [0.4, -29.8], [-5.2, -22], [-5.4, -10], [-2, 1]]), 3.2, 1.3, BLANKET_FOLD, LINE.fine) +
        fold(`M${P(-11, -28)}q2.4 6 1.2 12.5`, BLANKET_FOLD) +
        fold(`M${P(-6, -34)}q-1.4 3.6 0.4 7`, BLANKET_FOLD, LINE.fine) +
        fold(`M${P(-15.5, -4)}q4.4 -2.4 8 0.8M${P(-12, 1)}q2.4 -1.2 4.4 0.6`, BLANKET_FOLD, LINE.fine * 1.2),
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
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    // The blanket wrapped round the shoulders, a ragged hem.
    const pts: Pt[] = [[-11, 8], [-13, -4], [-13, -18], [-11, -29], [-3, -35], [6, -34], [11, -28], [12, -16], [11, -3], [13, 7], [9, 5], [7, 10], [3, 6], [0, 10], [-3, 6], [-7, 10]];
    // A woven border along the hem, then the patches sewn on.
    const inner =
      `<path d="M${P(-16, -1.5)}L${P(16, 0.5)}L${P(16, 3.4)}L${P(-16, 1.4)}Z" fill="${lightOf(COW.blanket, 0.45)}"/>` +
      fold(`M${P(-16, 3.9)}L${P(16, 5.9)}`, COW.blanketDeep, LINE.detail) +
      comic(roundPoly(o([[-12, -26], [-4, -27], [-3, -18], [-11, -17]]), 1.5), PASTEL.butter, {
        line: LINE.fine * 1.5,
        glint: [-0.5, 0.5],
        over: stitches(o([[-11.5, -21.5], [-3.5, -22.5]]), 2.8, 1.2, darkOf(PASTEL.butter, 0.55), LINE.fine),
      }) +
      comic(roundPoly(o([[2, -12], [10, -13], [10, -4], [3, -3]]), 1.5), PASTEL.pink, {
        line: LINE.fine * 1.5,
        glint: [-0.5, 0.5],
        over: stitches(o([[2.8, -11.2], [9.2, -12], [9.2, -4.6], [3.6, -3.8], [2.8, -11.2]]), 2.4, 0.8, darkOf(PASTEL.pink, 0.5), LINE.fine * 0.9),
      });
    // It hangs in folds from the shoulders, pulled in where the arms hug it.
    const over =
      fold(path(o([[3, -32], [5, -24], [3, -16]])), BLANKET_FOLD) +
      fold(path(o([[-8, -8], [-3, -6], [1, -9]])), BLANKET_FOLD) +
      fold(path(o([[-6.5, -31], [-8.6, -22], [-8, -12]])), BLANKET_FOLD, LINE.fine * 1.2) +
      fold(path(o([[8.4, -15], [9.6, -8], [8.6, 0]])), BLANKET_FOLD, LINE.fine * 1.2) +
      fold(`M${P(-3, 6)}l0.4 -4.4M${P(3, 6)}l-0.6 -4M${P(9, 5)}l-1 -3.6M${P(-7.4, 9)}l0.8 -4`, BLANKET_FOLD, LINE.fine) +
      label(ox - 2, oy - 5, 8, 4.5, PASTEL.cream, 5, -8);
    return comic(`M${pts.map(([x, y]) => P(x, y)).join('L')}Z`, COW.blanket, {
      line: LINE.body,
      tone: SHADE.deep,
      rim: [6, -2.4],
      hatch: 2.5,
      glint: [-1.3, 1.4],
      // The ragged hem in the shadow of the body.
      shade: `M${P(-16, 6.5)}L${P(16, 8.5)}L${P(16, 13)}L${P(-16, 13)}Z`,
      inner,
      over,
    });
  });
}

function cowardArm(): PartArt {
  return part('coward.arm', { x0: -7, y0: -5, x1: 7, y1: 21 }, (ox, oy) =>
    comicLimb([ox, oy], [ox, oy + 16], 9, 8, COW.blanket, {
      tone: SHADE.deep,
      over: fold(`M${ox - 3} ${oy + 12}q3 2 6 0`, BLANKET_FOLD) + fold(`M${ox - 3.4} ${oy + 5}q2 1.4 4.6 0.6`, BLANKET_FOLD, LINE.fine),
    }),
  { far: true });
}

function cowardFore(): PartArt {
  return part('coward.fore', { x0: -7, y0: -4, x1: 8, y1: 27 }, (ox, oy) => {
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    // The hand gripping the torch, then the sleeve over its wrist.
    let s = comic(path(tr([[-3, 16], [3, 16], [4.5, 20], [3, 24], [-1, 25], [-3.5, 21]], ox, oy)) + 'Z', COW.face, {
      line: LINE.small,
      tone: SHADE.warm,
      rim: [1.8, -0.6],
      glint: [-0.5, 0.5],
      over: fold(`M${P(-2.6, 21.4)}q2.4 0.8 5 -0.4M${P(-1.6, 23.5)}q1.6 0.4 3.2 -0.4`, darkOf(COW.faceLine, 0.25), LINE.fine),
    });
    s += comicLimb([ox, oy], [ox, oy + 17], 8, 7, COW.blanket, {
      tone: SHADE.deep,
      over: fold(`M${ox - 4} ${oy + 14}H${ox + 4}`, BLANKET_FOLD) + fold(`M${P(-2.6, 6)}q2 1.2 4.2 0.4`, BLANKET_FOLD, LINE.fine),
    });
    return s;
  }, { far: true });
}

/** The striped pyjama leg. */
function pyjamaLeg(ox: number, oy: number, len: number, wa: number, wb: number, crease: string): string {
  return comicLimb([ox, oy], [ox, oy + len], wa, wb, COW.pyjama, {
    bulge: 0.25,
    inner: fold(`M${ox - 2} ${oy - 2}V${oy + len + 3}M${ox + 2} ${oy - 2}V${oy + len + 3}`, COW.pyjamaLine, 0.95),
    over: fold(crease, darkOf(COW.pyjama, 0.42), LINE.fine),
  });
}

function cowardThigh(): PartArt {
  return part('coward.thigh', { x0: -7, y0: -4, x1: 7, y1: 23 }, (ox, oy) => pyjamaLeg(ox, oy, 19, 9.5, 8, `M${ox - 3.4} ${oy + 15.4}q2.6 1.6 5.8 0.4M${ox - 2.6} ${oy + 3}q1.4 0.8 2.8 0.4`), { far: true });
}

function cowardShin(): PartArt {
  // The pyjama bunches above the ankle.
  return part('coward.shin', { x0: -6, y0: -4, x1: 6, y1: 22 }, (ox, oy) => pyjamaLeg(ox, oy, 19, 8, 7, `M${ox - 3.2} ${oy + 15}q3 -1.4 6.2 0M${ox - 2.8} ${oy + 17.6}q2.6 1 5.4 -0.2`), { far: true });
}

function cowardFoot(): PartArt {
  return part('coward.foot', { x0: -8, y0: -4, x1: 13, y1: 8 }, (ox, oy) =>
    comic(path(tr([[-4, -2], [-6, 2], [-5, 6], [6, 6], [11.5, 5], [10, 1.5], [3, -2]], ox, oy)) + 'Z', COW.foot, {
      line: LINE.small,
      tone: SHADE.warm,
      rim: [1.2, -1.8],
      glint: [-0.6, 0.6],
      over: fold(`M${ox + 8} ${oy + 5.5}l0.5 -2M${ox + 5.5} ${oy + 5.8}l0.4 -2M${ox - 3} ${oy + 0.6}q1.4 1.4 3.2 0.8`, darkOf(COW.faceLine, 0.25), LINE.fine),
    }),
  { far: true });
}

function torch(): PartArt {
  // An oversized torch; pivot at the grip (held around its middle).
  return part('coward.torch', { x0: -9, y0: -58, x1: 9, y1: 26 }, (ox, oy) => {
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    let s = comicLimb([ox, oy + 24], [ox + 1, oy - 40], 6, 7, COW.wood, {
      bulge: 0.3,
      line: LINE.small,
      over: barkLines([ox, oy + 20], [ox + 1, oy - 36], 5, 61, { n: 2, knots: 1, color: darkOf(COW.wood, 0.5) }),
    });
    // The rag wound round its head, scorched at the top by the flame.
    s += comic(roundPoly([[ox - 7, oy - 53], [ox + 8, oy - 53], [ox + 8, oy - 38], [ox - 7, oy - 38]], 3), COW.wrap, {
      line: LINE.small,
      tone: '#e2c6a4',
      rim: [2.6, -1.2],
      glint: [-0.8, 0.8],
      shade: `M${P(-8, -55)}L${P(9, -55)}L${P(9, -50.4)}Q${P(4.5, -48.6)} ${P(0.5, -50.4)}T${P(-8, -50.2)}Z`,
      over: fold(`M${ox - 7} ${oy - 48}l15 2M${ox - 7} ${oy - 43}l15 2`, darkOf(COW.wrap, 0.4)) + fold(`M${P(-3, -38.6)}l1.6 -3.4M${P(4, -38.4)}l1 -2.6`, darkOf(COW.wrap, 0.4), LINE.fine),
    });
    return s;
  });
}

function flame(): PartArt {
  return part('coward.flame', { x0: -13, y0: -32, x1: 13, y1: 5 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const edge = darkOf(COW.flameEdge, 0.32);
    let s = glow(ox, oy - 10, 15, PASTEL.butter, 0.5);
    // The fire: lit from within (no shadow), a hot core, an orange foot, embers.
    s += comic(path(o([[-9, 0], [-10, -9], [-5, -17], [-3, -27], [2, -18], [6, -25], [9, -12], [9, -2], [3, 2]])) + 'Z', COW.flame, {
      line: LINE.small,
      ink: edge,
      inner: fillOnly(path(o([[-10, 2], [-8, -6], [-2, -4], [4, -7], [10, -3], [10, 4]])) + 'Z', COW.flameEdge, 0.85) + `<path d="${path(o([[-4, -1], [-5, -8], [-1, -14], [3, -9], [4, -2]]))}Z" fill="${COW.flameCore}"/>`,
      top: `<circle cx="${ox - 7.5}" cy="${oy - 21}" r="1.1" fill="${COW.flameCore}" stroke="${edge}" stroke-width="${LINE.fine}"/><circle cx="${ox + 9.5}" cy="${oy - 28}" r="0.8" fill="${COW.flameCore}" stroke="${edge}" stroke-width="${LINE.fine * 0.9}"/>`,
    });
    return s;
  });
}

// ---------------------------------------------------------------- mech

/** Seams and scratches on the grey panels. */
const SEAM = darkOf(MECH.plate, 0.5);

/** A rivet or a round joint: a shaded disc with a glint. */
function rivet(x: number, y: number, r: number, fill: string = MECH.joint): string {
  return comic(ellipsePath(x, y, r, r), fill, { line: r > 2 ? LINE.fine * 1.6 : LINE.fine * 1.2, rim: r > 2 ? [r * 0.38, -r * 0.26] : undefined, glint: [-r * 0.2, r * 0.2] });
}

function mechHead(): PartArt {
  return part('mech.head', { x0: -16, y0: -44, x1: 18, y1: 5 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    // An antenna with a pink bead: something alive left in the machine.
    let s = comicLimb([ox - 5, oy - 28], [ox - 8, oy - 37], 2.2, 1.5, MECH.plateDeep, { line: LINE.fine * 1.3, bulge: 0 });
    s += comic(ellipsePath(ox - 8.5, oy - 39, 2.3, 2.3), MECH.pink, { line: LINE.fine * 1.5, rim: [0.9, -0.7], glint: [-0.5, 0.5] });
    const box = roundPoly(o([[-12, -26], [-5, -30], [10, -29], [15, -22], [16, -8], [12, -1], [-9, 0], [-13, -8]]), 4);
    // The side plane in shade (hatched), riveted to the face plate.
    const inner =
      `<path d="M${P(-20, -34)}L${P(-5, -34)}L${P(-5, 4)}L${P(-20, 4)}Z" fill="${MECH.plateDeep}"/>` +
      hatchLines({ x0: ox - 20, y0: oy - 34, x1: ox - 5, y1: oy + 4 }, 2.4, darkOf(MECH.plateDeep, 0.2)) +
      rivet(ox - 9, oy - 22, 1.3) +
      rivet(ox - 9, oy - 6, 1.3);
    s += comic(box, MECH.plate, {
      line: LINE.body,
      rim: [2.4, -2.4],
      glint: [-1, 1.2],
      inner,
      over:
        fold(`M${P(-5, -30)}L${P(-5, 0)}`, SEAM) +
        fold(`M${P(-5, -15)}L${P(16, -15)}`, SEAM) +
        stitches(o([[-3, -26], [4, -27.5]]), 2.6, 1.2, SEAM, LINE.fine) +
        // Dents and scratches in the paint.
        fold(`M${P(-11, -15)}q1.6 2.2 0 4.6M${P(1, -3)}l2.6 -0.8M${P(14.4, -12)}l-1.6 1.2`, SEAM, LINE.fine),
    });
    // The eye is a brass key (bow ring, shaft, bits); the mouth a keyhole in its plate.
    const kx = ox + 8;
    const ky = oy - 20;
    const brass = darkOf(MECH.yellow, 0.62);
    s += comic(`M${kx + 0.6} ${ky - 0.9}L${kx + 7.6} ${ky - 0.9}L${kx + 7.6} ${ky + 3.2}L${kx + 6.3} ${ky + 3.2}L${kx + 6.3} ${ky + 0.9}L${kx + 5.7} ${ky + 0.9}L${kx + 5.7} ${ky + 2.6}L${kx + 4.4} ${ky + 2.6}L${kx + 4.4} ${ky + 0.9}L${kx + 0.6} ${ky + 0.9}Z`, MECH.yellow, { line: LINE.fine * 1.3, ink: brass });
    s += comic(ellipsePath(kx - 2, ky, 3.3, 3.3), MECH.yellow, { line: LINE.fine * 1.6, ink: brass, rim: [1.1, -0.8], glint: [-0.6, 0.6], top: `<circle cx="${kx - 2}" cy="${ky}" r="1.2" fill="${INK}"/>` });
    s += comic(roundPoly(o([[5.3, -13.6], [13, -13.6], [13, -3.6], [5.3, -3.6]]), 2), MECH.joint, { line: LINE.fine * 1.4, rim: [1, -0.8], glint: [-0.5, 0.5] });
    s += `<path d="M${ox + 6.9} ${oy - 9.6}a2.3 2.3 0 1 1 4.4 0l1.1 4.7h-6.6z" fill="${INK}"/>`;
    return s;
  });
}

function mechTorso(): PartArt {
  return part('mech.torso', { x0: -16, y0: -42, x1: 17, y1: 8 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    const shell = roundPoly(o([[-10, 5], [-12, -10], [-12, -30], [-6, -38], [7, -38], [13, -31], [13, -10], [10, 5]]), 4);
    // Crayon-like columns in the belly, the maze plate and a lodged photo
    // (a memory) on the chest: all under the body's shading.
    let inner = '';
    [-8, -3, 2, 7].forEach((x, i) => {
      inner += comic(`M${ox + x} ${oy + 2}L${ox + x} ${oy - 10}L${ox + x + 1.6} ${oy - 12.5}L${ox + x + 2.6} ${oy - 10}L${ox + x + 3.6} ${oy - 12.5}L${ox + x + 4.8} ${oy - 10}L${ox + x + 4.8} ${oy + 2}Z`, i % 2 ? MECH.pink : MECH.yellow, {
        line: LINE.fine * 1.4,
        glint: [-0.6, 0.4],
        over: fold(`M${ox + x + 1.4} ${oy - 7}L${ox + x + 1.4} ${oy + 1}`, lightOf(i % 2 ? MECH.pink : MECH.yellow, 0.6), LINE.fine),
      });
    });
    inner +=
      comic(roundPoly(o([[-9, -34], [3, -34], [3, -19], [-9, -19]]), 2), '#f6e8ef', { line: LINE.fine * 1.6, rim: [1.4, -0.9], inner: maze(ox - 8, oy - 33, 10, 13, MECH.maze, 3, 1.1) }) +
      comic(roundPoly(o([[5, -33], [11, -33], [11, -25], [5, -25]]), 1), MECH.photo, {
        line: LINE.fine * 1.4,
        glint: [-0.4, 0.4],
        inner: `<circle cx="${ox + 8}" cy="${oy - 30}" r="1.6" fill="${PASTEL.lilac}"/><path d="M${P(5, -25)}Q${P(8, -29)} ${P(11, -25)}Z" fill="${PASTEL.mint}"/>`,
      }) +
      comic(roundPoly(o([[6.2, -34.6], [9.8, -34], [9.5, -32.3], [5.9, -32.9]]), 0.4), lightOf(PASTEL.butter, 0.3), { line: LINE.fine });
    const over =
      fold(`M${P(-12, -15)}L${P(13, -15)}`, SEAM) +
      stitches(o([[6, -22], [11, -21]]), 2.4, 1.2, SEAM, LINE.fine) +
      rivet(ox - 10.2, oy - 17.4, 1.2) +
      rivet(ox + 11.2, oy - 17.4, 1.2) +
      fold(`M${P(-11, -26)}l1.8 1M${P(12, -6)}l-1.4 1.6`, SEAM, LINE.fine);
    return comic(shell, MECH.plate, { line: LINE.body, rim: [5.2, -2.4], hatch: 2.4, glint: [-1.2, 1.3], inner, over });
  });
}

function mechArm(): PartArt {
  return part('mech.arm', { x0: -7, y0: -7, x1: 7, y1: 25 }, (ox, oy) =>
    cflat(roundPoly([[ox - 4, oy], [ox + 4, oy], [ox + 3.6, oy + 21], [ox - 3.6, oy + 21]], 2), MECH.plate, { over: stitches([[ox, oy + 5], [ox, oy + 17]], 3.2, 1.6, SEAM, LINE.fine) }) +
    comic(roundPoly([[ox - 6, oy - 5], [ox + 6, oy - 5], [ox + 5.5, oy + 5], [ox - 5.5, oy + 5]], 2.5), MECH.blue, { line: LINE.small, rim: [2.4, -1.1], glint: [-0.7, 0.7], top: rivet(ox, oy, 1.2) }),
  { far: true });
}

function mechFore(): PartArt {
  return part('mech.fore', { x0: -8, y0: -5, x1: 8, y1: 33 }, (ox, oy) => {
    let s = claws([ox, oy + 22], Math.PI / 2, 0.8, [7, 8, 7], 2.8, MECH.plateDeep, 71, 0.2);
    s += cflat(roundPoly([[ox - 3.6, oy], [ox + 3.6, oy], [ox + 3.2, oy + 22], [ox - 3.2, oy + 22]], 2), MECH.plate, {
      inner: `<path d="M${ox - 5} ${oy + 18.4}L${ox + 5} ${oy + 18.4}L${ox + 5} ${oy + 23}L${ox - 5} ${oy + 23}Z" fill="${MECH.yellow}"/>`,
      over: fold(`M${ox - 3} ${oy + 8}L${ox + 3} ${oy + 8}M${ox - 3} ${oy + 13.5}L${ox + 3} ${oy + 13.5}M${ox - 4} ${oy + 18.4}L${ox + 4} ${oy + 18.4}`, SEAM),
    });
    s += rivet(ox, oy, 3.2);
    return s;
  }, { far: true });
}

function mechThigh(): PartArt {
  return part('mech.thigh', { x0: -7, y0: -6, x1: 7, y1: 25 }, (ox, oy) =>
    cflat(roundPoly([[ox - 5, oy - 1], [ox + 5, oy - 1], [ox + 4.4, oy + 21], [ox - 4.4, oy + 21]], 2.5), MECH.plate, {
      inner: comic(roundPoly([[ox - 4, oy + 9], [ox + 4, oy + 9], [ox + 4, oy + 15], [ox - 4, oy + 15]], 1), MECH.pink, { line: LINE.fine * 1.4, glint: [-0.5, 0.5] }),
      over: stitches([[ox + 1, oy + 2], [ox + 1, oy + 8]], 2.6, 1.3, SEAM, LINE.fine),
    }) + rivet(ox, oy, 3.4),
  { far: true });
}

function mechShin(): PartArt {
  return part('mech.shin', { x0: -6, y0: -6, x1: 6, y1: 25 }, (ox, oy) =>
    cflat(roundPoly([[ox - 4.2, oy - 1], [ox + 4.2, oy - 1], [ox + 3.6, oy + 21], [ox - 3.6, oy + 21]], 2), MECH.plate, { over: stitches([[ox, oy + 4], [ox, oy + 17]], 3, 1.5, SEAM, LINE.fine) }) +
    rivet(ox, oy, 3.2),
  { far: true });
}

function mechFoot(): PartArt {
  return part('mech.foot', { x0: -8, y0: -4, x1: 14, y1: 8 }, (ox, oy) =>
    comic(roundPoly(tr([[-6, -2], [4, -2], [13, 2], [13, 6], [-7, 6]], ox, oy), [2, 2, 2, 1.5, 1.5]), MECH.plateDeep, {
      line: LINE.small,
      rim: [1.6, -1.4],
      glint: [-0.7, 0.7],
      inner: `<path d="M${ox - 8} ${oy + 3.5}L${ox + 14} ${oy + 3.5}L${ox + 14} ${oy + 7}L${ox - 8} ${oy + 7}Z" fill="${MECH.yellow}"/>`,
      over: fold(`M${ox - 7} ${oy + 3.5}L${ox + 13} ${oy + 3.5}`, darkOf(MECH.plateDeep, 0.5), LINE.fine * 1.3) + fold(`M${ox + 3} ${oy + 4.6}l-1.4 2.2M${ox + 7} ${oy + 4.6}l-1.4 2.2M${ox - 1} ${oy + 4.6}l-1.4 2.2`, darkOf(MECH.yellow, 0.4), LINE.fine),
    }),
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
