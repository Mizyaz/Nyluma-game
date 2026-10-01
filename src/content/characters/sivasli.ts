import { ellipsePath, Rng, smooth, taper, type Pt } from '../../render/2d/svg';
import { darkOf, DETAIL, LINE, lightOf, lineFor, PASTEL, SHADE } from '../../render/2d/style';
import type { PartArt } from '../../render/2d/rig/rigTypes';
import { almondEye, browPart, bushyBrow, eyeSet, mouthSet, paintedMouth } from './face';
import { comic, comicLimb, fold, ink, label, leaf, part, path, roundPoly, stitches, tr } from './kit';
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
  skin: '#f0c2a2',
  blush: '#eb9d90',
  nose: '#f2b196',
  earIn: '#dd9884',
  grey: '#a29ba9',
  greyLight: '#dcd8e0',
  greyDark: '#6f6879',
  iris: '#6d4d3d',
  suit: '#a3a5ad',
  suitDeep: '#83858f',
  shirt: '#f5f2ea',
  tie: '#5d6178',
  shoe: '#4c4852',
} as const;

const HUMAN_BASE = {
  hip: 43, thigh: 19, shin: 20, torso: 57, shoulderY: 46, shoulderX: 9, upper: 23, hipX: 7, headX: 9, hand: 29,
  belly: [22.5, -24] as [number, number],
  foot: { sole: 6.5, heel: -6.5, ball: 9 },
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

/**
 * The plain head: the Sivaslı kel amca himself, bald and shiny, with a
 * bushy moustache, kind eyes, big ears and a grey fringe round the back.
 */
export const HUMAN_BALD_DIMS: HumanoidDims = {
  ...HUMAN_BASE,
  parts: { head: 'gorti.bald.head' },
  eye: [10, -30.5],
  brow: { part: 'gorti.bald.brow', up: 6.4, dx: -5.4 },
  browFar: { part: 'gorti.bald.browF', up: 5.9, dx: 6.6 },
  face: { eye: 'gorti.bald', mouth: 'gorti.bald', mouthAt: [15.4, -7.2] },
  // A few loose hairs on the crown that bob about.
  hair: [{ part: 'gorti.bald.wisp', id: 'wisp', at: [-1, -55.2], tip: [1, -8], z: 61, k: 110, c: 3.6 }],
  extra: [
    // The moustache over the mouth, a little springy.
    { id: 'stache', parent: 'head', x: 15.4, y: -13.6, part: 'gorti.bald.stache', z: 65, spring: { k: 230, c: 9, lag: 0.3, gain: 0.0016, tip: [0, 5] } },
  ],
};

// ------------------------------------------------------------------ heads

function moonHead(): PartArt {
  return part('gorti.human.head', { x0: -22, y0: -68, x1: 16, y1: 4 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    // A thick crescent opening to the front: back curve, a sharp top horn,
    // the face on the inner curve, a round chin.
    const crescent: Pt[] = [[12, -65], [3, -56], [-1, -47], [-1, -39], [3, -34], [4.5, -30], [1.5, -27], [2, -22], [5, -18], [8, -12], [11, -6], [8, -1], [0, 1], [-9, -1], [-16, -8], [-20, -20], [-20, -34], [-16, -47], [-7, -58]];
    // Tears: shiny drops with a gleam.
    const tear = (x: number, y: number, k: number): string =>
      comic(`M${P(x, y)}q${-2.4 * k} ${3.4 * k} 0 ${4.6 * k}q${2.4 * k} ${-1.2 * k} 0 ${-4.6 * k}Z`, SIVAS.tear, {
        line: LINE.detail,
        rim: [0.9 * k, -0.6 * k],
        light: ellipsePath(ox + x - 0.6 * k, oy + y + 2.9 * k, 0.55 * k, 0.8 * k),
        lightFill: '#f4fcff',
      });
    // Craters: a dent with its lower lip lit and its inside in shade.
    const crater = (x: number, y: number, rx: number, ry: number): string =>
      `<path d="${ellipsePath(ox + x, oy + y, rx, ry)}" fill="${darkOf(SIVAS.moon, 0.14)}"/>` +
      ink(`M${P(x - rx, y)}A${rx} ${ry} 0 0 0 ${P(x + rx, y)}`, LINE.fine * 1.2, lightOf(SIVAS.moon, 0.5)) +
      ink(`M${P(x - rx, y)}A${rx} ${ry} 0 0 1 ${P(x + rx, y)}`, LINE.fine * 1.3, darkOf(SIVAS.moon, 0.45));
    const craters = crater(-13, -42, 2.6, 1.9) + crater(-15, -12, 1.9, 1.4) + crater(-9.5, -27, 1.5, 1.1) + crater(-4, -53, 1.4, 1);
    return comic(path(o(crescent)) + 'Z', SIVAS.moon, {
      line: LINE.body,
      rim: [3.4, -1.8],
      hatch: 2.4,
      glint: [-1, 1.3],
      light: `M${P(9.6, -62)}Q${P(3.6, -56)} ${P(1.2, -48)}Q${P(3.4, -55.6)} ${P(9.6, -62)}Z`,
      over: craters + fold(path(o([[-12, -52], [-7, -55]])), darkOf(SIVAS.moon, 0.35), LINE.fine),
      top: tear(-6, -25, 1) + tear(-8.5, -18, 1.08) + tear(-4.5, -13, 0.85),
    });
  });
}

function moonEye(): PartArt[] {
  return eyeSet('gorti.human', { x0: -8, y0: -8, x1: 8, y1: 7 }, (v, ox, oy) => almondEye(v, ox, oy, 5.2, 3.6, { outer: -1, iris: '#3f6f63', lid: 0.1, lidFill: SIVAS.moon, look: 0.3, pupil: 0.5, blank: true }));
}

function moonMouth(): PartArt[] {
  const m = 3;
  // The laugh opens wider than the small everyday mouth.
  return mouthSet('gorti.human', { x0: -m * 1.8 - 3, y0: -m - 3, x1: m * 1.8 + 3, y1: m * 2.3 + 3 }, (v, ox, oy) => paintedMouth(v, ox, oy, v === 'laugh' ? m * 1.35 : m, { lip: SIVAS.mauve, inside: '#4a2a4f', sad: 0.5 }));
}

function sunHead(): PartArt {
  return part('gorti.sun.head', { x0: -27, y0: -64, x1: 34, y1: 6 }, (ox, oy) => {
    const cx = ox + 4;
    const cy = oy - 28;
    const r = 20;
    const rng = new Rng(88);
    // Spiky rays, each folded along its middle: the half turned from the
    // light a shade deeper.
    let rays = '';
    const n = 15;
    const rayLine = lineFor(SIVAS.ray);
    const rayDeep = darkOf(SIVAS.ray, 0.16);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.1;
      const L = r + 8 + rng.range(-1.5, 2.5);
      const w = 0.2;
      const p = (ang: number, rad: number): string => `${cx + Math.cos(ang) * rad} ${cy + Math.sin(ang) * rad}`;
      rays += `<path d="M${p(a - w, r - 2)}L${p(a, L)}L${p(a + w, r - 2)}Z" fill="${SIVAS.ray}"/>`;
      rays += `<path d="M${p(a, r - 2)}L${p(a, L)}L${p(a + w, r - 2)}Z" fill="${rayDeep}"/>`;
      rays += `<path d="M${p(a - w, r - 2)}L${p(a, L)}L${p(a + w, r - 2)}" fill="none" stroke="${rayLine}" stroke-width="${LINE.small}" stroke-linejoin="round"/>`;
    }
    let dots = '';
    for (let i = 0; i < 10; i++) {
      const a = rng.range(0, Math.PI * 2);
      const d = rng.range(r * 0.45, r * 0.85);
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d;
      // Keep the freckles off the eyes and the mouth.
      if (y > cy - 7 && y < cy + 14 && x > cx - 6) continue;
      dots += `<circle cx="${x}" cy="${y}" r="0.95" fill="${SIVAS.freckle}"/>`;
    }
    const face =
      dots +
      ink(`M${cx + 7} ${cy - 1}l2.6 5.2l-2.8 1`, LINE.detail, lineFor(SIVAS.sun)) +
      fold(`M${cx - 13} ${cy + 5}q2 1.5 4 0`, SIVAS.freckle, LINE.fine) +
      ink(`M${cx - 6} ${cy - 8}q2 -1.4 5 -1.1`, 1.6, '#c7743f');
    // A short neck under the disc, in its shadow.
    let s = comicLimb([ox, oy + 4], [ox + 1, oy - 10], 10, 10, SIVAS.body, { bulge: 0, line: LINE.small, shade: `M${ox - 8} ${oy - 12}H${ox + 8}V${oy - 5}Q${ox} ${oy - 2} ${ox - 8} ${oy - 5}Z` });
    s += rays;
    s += comic(ellipsePath(cx, cy, r, r), SIVAS.sun, {
      line: LINE.body,
      tone: SHADE.warm,
      rim: [4.2, -2.6],
      hatch: 2.4,
      hatchColor: SHADE.hatchWarm,
      glint: [-1.2, 1.5],
      light: `M${cx - 2} ${cy - 17.2}Q${cx + 8} ${cy - 16.4} ${cx + 13.6} ${cy - 9.6}Q${cx + 7} ${cy - 13.6} ${cx - 2} ${cy - 17.2}Z`,
      lightFill: '#fff3dc',
      over: face,
    });
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


// ------------------------------------------------------------ bald head

/** Skull and face in one outline (three-quarter, facing right). */
const SKULL: Pt[] = [
  [-12, -8.5], [-17.2, -16.5], [-20, -27.5], [-19.6, -39], [-15.2, -48.2], [-7.4, -54.2], [2.6, -56.4], [12, -53.4], [18.2, -46.4],
  [21.4, -38.4], [22.6, -32.6], [21.2, -28.2], [21.6, -22.6], [21.4, -15.8], [21, -8.6], [19.6, -2.6], [14.4, 1.8], [6.6, 2], [-0.6, -0.8], [-7, -4.6],
];

function baldHead(): PartArt {
  return part('gorti.bald.head', { x0: -25, y0: -62, x1: 29, y1: 10 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    const skinLine = lineFor(SIVAS.skin);
    const crease = darkOf(SIVAS.skin, 0.42);
    // The neck: short and thick, in the jaw's shadow.
    let s = comicLimb([ox - 1, oy + 7], [ox + 1.5, oy - 12], 17, 16, SIVAS.skin, {
      line: LINE.limb,
      tone: SHADE.warm,
      hatchColor: SHADE.hatchWarm,
      bulge: 0.2,
      shade: `M${P(-12, -12)}L${P(14, -12)}L${P(14, -2)}Q${P(4, 1.5)} ${P(-12, -3)}Z`,
      over: fold(`M${P(3, 1)}q2.5 -3 1.5 -7`, crease, LINE.fine),
    });
    // Skull and face, lit from the front and above: the back of the head
    // and the underside of the jaw in shadow, the eye sockets under the
    // brow, a shine on the crown.
    const shade =
      // Eye sockets under the brow ridge.
      `M${P(-1, -34)}Q${P(10, -37.5)} ${P(22.5, -33.5)}L${P(21.5, -29)}Q${P(12, -32.5)} ${P(0, -30.5)}Z` +
      // Under the jaw.
      `M${P(-8, -4)}Q${P(5, 0.6)} ${P(20, -3.4)}L${P(22, 5)}L${P(-8, 5)}Z`;
    // The shine of the bald crown: a long gleam, a second one, a sparkle.
    const star = (x: number, y: number, r: number): string =>
      `M${P(x, y - r)}Q${P(x + r * 0.16, y - r * 0.16)} ${P(x + r, y)}Q${P(x + r * 0.16, y + r * 0.16)} ${P(x, y + r)}Q${P(x - r * 0.16, y + r * 0.16)} ${P(x - r, y)}Q${P(x - r * 0.16, y - r * 0.16)} ${P(x, y - r)}Z`;
    const shine =
      `M${P(-14.4, -43.6)}Q${P(-10.6, -52.6)} ${P(1.2, -55)}Q${P(-6.6, -50.8)} ${P(-11.2, -42.8)}Q${P(-12.8, -42.6)} ${P(-14.4, -43.6)}Z` +
      `M${P(4.4, -53.8)}Q${P(9.2, -53.8)} ${P(12, -50.4)}Q${P(8.2, -51.6)} ${P(4.4, -53.8)}Z` +
      star(-4.2, -47.6, 2.6);
    const wrinkles =
      fold(`M${P(4, -41.2)}Q${P(10.5, -43)} ${P(17.4, -41.4)}`, crease, LINE.fine * 1.1) +
      fold(`M${P(3, -44.8)}Q${P(9.5, -46.6)} ${P(16, -45)}`, crease, LINE.fine * 1.1) +
      fold(`M${P(6, -48.2)}Q${P(9.5, -49.2)} ${P(13.4, -48.2)}`, crease, LINE.fine) +
      // Crow's feet at the near eye, bags under both.
      fold(`M${P(-0.6, -31.2)}l-2.8 -1.6M${P(-0.8, -29.6)}l-3.1 0.1M${P(-0.4, -28)}l-2.6 1.4`, crease, LINE.fine) +
      fold(`M${P(1.8, -26.6)}Q${P(5, -24.8)} ${P(8.4, -26.4)}`, crease, LINE.fine) +
      fold(`M${P(14.2, -26.9)}Q${P(16.4, -25.8)} ${P(18.6, -27)}`, crease, LINE.fine) +
      // The smile line round the moustache.
      fold(`M${P(12.6, -19.6)}Q${P(9.2, -16)} ${P(10.2, -8.6)}`, crease, LINE.detail * 0.9) +
      // Chin.
      fold(`M${P(13.2, -0.6)}Q${P(16, 0.4)} ${P(18.6, -1.4)}`, crease, LINE.fine);
    const blush = `<path d="${ellipsePath(ox + 3.2, oy - 20.6, 5.6, 3.7)}" fill="${SIVAS.blush}"/>` + fold(`M${P(0.2, -19.2)}l1.3 -2.2M${P(2.6, -18.6)}l1.3 -2.2M${P(5, -18.9)}l1.2 -2`, darkOf(SIVAS.blush, 0.3), LINE.fine * 0.9);
    s += comic(smooth(o(SKULL)), SIVAS.skin, {
      line: LINE.body,
      tone: SHADE.warm,
      rim: [4.2, -2.2],
      hatch: 2.4,
      hatchColor: SHADE.hatchWarm,
      shade,
      glint: [-1.1, 1.4],
      light: shine,
      lightFill: '#fffaf2',
      over: wrinkles + blush,
    });
    // The grey fringe round the back of the head, above and behind the ear.
    const fringe: Pt[] = [
      [-5.4, -38.6], [-9.6, -41.4], [-14.6, -41], [-18.8, -38.4], [-21.6, -35.2], [-20.4, -32.6], [-22.6, -29.2], [-21, -26.4], [-22.4, -22.6],
      [-20, -19.8], [-20.6, -16], [-17.4, -13.6], [-17.6, -10.6], [-14, -9.8], [-12.8, -13.6], [-14.2, -19], [-14, -26], [-12.6, -32.2], [-9.4, -35.8], [-5.6, -36.4],
    ];
    let strands = '';
    for (let i = 0; i < 7; i++) {
      const y = -37 + i * 3.8;
      strands += `M${P(-17.2 + (i % 2) * 1.2, y)}q-2 1.4 -2.6 3.6`;
    }
    s += comic(smooth(o(fringe)), SIVAS.grey, {
      line: LINE.small,
      rim: [1.8, -1.2],
      glint: [-0.8, 0.9],
      lightFill: SIVAS.greyLight,
      over: fold(strands.replace(/M/g, 'M'), SIVAS.greyDark, LINE.fine),
    });
    // A little sideburn in front of the ear.
    s += comic(smooth(o([[-3.4, -37.6], [-1.4, -36.4], [-0.6, -31.6], [-2.4, -29.4], [-4, -32.4]])), SIVAS.grey, { line: LINE.small * 0.85, lightFill: SIVAS.greyLight, glint: [-0.5, 0.6] });
    // The big ear.
    const ear: Pt[] = [[-3.4, -32.6], [-7, -36.2], [-12.2, -36.4], [-15.4, -32.4], [-15.6, -25.6], [-13.4, -19.2], [-9.6, -15.2], [-5.6, -15.6], [-4.4, -20.6], [-3, -26.2]];
    const earIn =
      `<path d="${smooth(o([[-5.8, -30.4], [-9.4, -33.2], [-12.6, -31.2], [-12.8, -25.6], [-10.8, -20.4], [-7.8, -18.4], [-7.2, -22.6], [-9.4, -25], [-8.6, -28.4]]))}" fill="${SIVAS.earIn}"/>` +
      fold(`M${P(-10.8, -30.2)}Q${P(-8.2, -29.6)} ${P(-8.4, -26.4)}`, darkOf(SIVAS.earIn, 0.35), LINE.fine);
    s += comic(smooth(o(ear)), SIVAS.skin, { line: LINE.small, tone: SHADE.warm, rim: [1.8, -1.4], glint: [0.8, 0.9], over: earIn });
    // The nose: big and round; its bridge melts into the face.
    const nose: Pt[] = [[12.2, -32], [14.6, -28.4], [18.2, -25.6], [22.8, -24.4], [26, -21.4], [25.6, -17.6], [22.4, -16], [18.8, -16.8], [15.4, -16.2], [12.6, -17.8], [13, -21.4], [11.6, -26]];
    const nd = smooth(o(nose));
    s += comic(nd, SIVAS.nose, {
      line: 0,
      tone: SHADE.warm,
      shade: `M${P(12, -18.4)}Q${P(18, -14.6)} ${P(26.4, -18.8)}L${P(27, -14)}L${P(11, -14)}Z`,
      light: `M${P(21.2, -23.2)}Q${P(23.8, -23.4)} ${P(24.6, -21.2)}Q${P(22.6, -22)} ${P(21.2, -23.2)}Z`,
      lightFill: '#fff4ea',
    });
    s += ink(`M${P(14.8, -28.6)}Q${P(18.6, -25.2)} ${P(23, -24.4)}Q${P(26.6, -22.4)} ${P(25.8, -18.2)}Q${P(24.4, -15.8)} ${P(21.4, -16.4)}`, LINE.small, skinLine);
    // Nose wing and nostril.
    s += ink(`M${P(16.6, -21.4)}Q${P(13.2, -20.8)} ${P(14.4, -17.6)}Q${P(16.6, -16.2)} ${P(18.6, -17.4)}`, LINE.detail, skinLine);
    s += `<path d="M${P(19.4, -18.4)}q1.6 -0.8 2.8 0.2q-1.4 0.6 -2.8 -0.2Z" fill="${darkOf(SIVAS.nose, 0.55)}"/>`;
    return s;
  });
}

/** Kind eyes, both in one part: warm brown, a catch-light, a relaxed lid. */
function baldEyes(): PartArt[] {
  return eyeSet('gorti.bald', { x0: -12, y0: -8, x1: 13, y1: 7 }, (v, ox, oy) =>
    almondEye(v, ox - 5, oy, 4.1, 2.8, { outer: -1, iris: SIVAS.iris, lid: 0.2, lidFill: SIVAS.skin, look: 0.34, pupil: 0.5, glint: true, line: LINE.detail * 1.1 }) +
    almondEye(v, ox + 6.4, oy - 0.3, 3.1, 2.5, { outer: 1, iris: SIVAS.iris, lid: 0.2, lidFill: SIVAS.skin, look: 0.5, pupil: 0.5, glint: true, line: LINE.detail }),
  );
}

function baldMouth(): PartArt[] {
  const m = 4.2;
  return mouthSet('gorti.bald', { x0: -m * 1.5 - 3, y0: -m - 3, x1: m * 1.5 + 3, y1: m * 1.8 + 3 }, (v, ox, oy) => paintedMouth(v, ox, oy, m, { lip: '#e98d86', inside: '#6a2b37', sad: 0.25, line: LINE.detail * 1.15 }));
}

/** The bushy salt-and-pepper moustache (pivot under the nose). */
function baldStache(): PartArt {
  return part('gorti.bald.stache', { x0: -16, y0: -6, x1: 14, y1: 10 }, (ox, oy) => {
    const pts: Pt[] = [
      [-0.8, -2.2], [-4.8, -2.8], [-9.2, -1.8], [-12.8, 0.6], [-14.6, 3.8], [-13.6, 6.8], [-11.6, 4.6], [-9, 3.4], [-6.6, 4.8], [-4, 3.4], [-1.4, 4.6],
      [1.2, 3.3], [3.8, 4.4], [6.2, 3.1], [8.8, 4.8], [10.6, 2.8], [10.2, 0.2], [7.2, -1.8], [3.2, -2.6],
    ];
    const d = smooth(tr(pts, ox, oy), 0.8);
    let hairs = '';
    const rng = new Rng(404);
    for (let i = 0; i < 11; i++) {
      const x = -11 + i * 2;
      const side = x < -0.5 ? -1 : 1;
      hairs += `M${ox + x + rng.range(-0.4, 0.4)} ${oy - 1 + rng.range(-0.5, 0.5)}q${side * 1.2} 2 ${side * 0.6} ${3.6 + rng.range(-0.5, 0.7)}`;
    }
    return comic(d, SIVAS.grey, {
      line: LINE.small,
      rim: [1.2, -2],
      hatch: 1.9,
      glint: [0.4, 1.6],
      lightFill: SIVAS.greyLight,
      over: fold(hairs, SIVAS.greyDark, LINE.fine) + fold(`M${ox - 0.4} ${oy - 2}q0.2 2.6 -0.4 5.4`, SIVAS.greyDark, LINE.fine * 1.2),
    });
  });
}

/** Three loose grey hairs on the crown (pivot at their roots). */
function baldWisp(): PartArt {
  return part('gorti.bald.wisp', { x0: -6, y0: -12, x1: 7, y1: 2 }, (ox, oy) =>
    ink(`M${ox - 1.6} ${oy + 0.6}q-2.4 -3.6 -0.4 -6.2q1.6 -1.8 -0.2 -3.8`, LINE.fine * 1.25, SIVAS.greyDark) +
    ink(`M${ox + 0.4} ${oy + 0.4}q0.8 -4.2 3.4 -5.6q1.8 -1 1.2 -3`, LINE.fine * 1.25, SIVAS.greyDark) +
    ink(`M${ox + 1.8} ${oy + 0.6}q2.6 -1.6 4 -1`, LINE.fine * 1.1, SIVAS.greyDark),
  );
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
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    const crease = darkOf(SIVAS.body, 0.3);
    // Patches and the little labels on the back sit under the shading.
    const inner =
      comic(jagged(ox - 18, oy - 1, 13, 9, 3, 13), SIVAS.mauve, { line: LINE.detail, glint: [-0.6, 0.8] }) +
      comic(jagged(ox + 9, oy - 53, 9, 7, 4, 9), SIVAS.mauve, { line: LINE.detail, glint: [-0.6, 0.8] }) +
      comic(roundPoly(o([[6, -22], [16, -23], [17, -13], [7, -12]]), 2), SIVAS.sage, { line: LINE.detail, glint: [-0.6, 0.7], over: stitches(o([[6.5, -17.5], [16.5, -18]]), 3, 1.4, darkOf(SIVAS.sage, 0.5)) }) +
      label(ox - 31, oy - 47, 13, 7, '#f2a7b5', 11, -14) +
      label(ox - 29, oy - 38.5, 12, 6.5, PASTEL.butter, 12, -6) +
      label(ox - 28, oy - 29.5, 12, 7, PASTEL.mint, 13, 5);
    // Cloth folds: under the chest, the belly's roll, the back.
    const folds =
      fold(`M${P(9, -33)}q5 1.5 9.5 -0.6`, crease, LINE.detail) +
      fold(`M${P(12, -7)}q4.6 -1.2 7.6 -5.4`, crease, LINE.detail) +
      fold(`M${P(14.5, -3.2)}q2.4 -0.6 3.4 -2.4`, crease, LINE.fine) +
      fold(`M${P(-25, -16)}q7 4 13 2`, crease, LINE.detail) +
      fold(`M${P(-8, -58)}q2.6 3 4 6`, crease, LINE.detail) +
      fold(`M${P(-22, -50)}q3 -1 6 0.4`, crease, LINE.fine);
    // The sprig of leaves on the chest.
    const sprig =
      ink(path(o([[-2, -26], [0, -36], [-1, -46]])), LINE.detail, darkOf(PASTEL.leaf, 0.5)) +
      leaf(tr([[-1, -44]], ox, oy)[0]!, -2.3, 10, PASTEL.leaf) +
      leaf(tr([[0, -36]], ox, oy)[0]!, -0.5, 9, PASTEL.leaf) +
      leaf(tr([[-0.5, -29]], ox, oy)[0]!, -2.7, 8, PASTEL.leaf);
    return comic(path(o(HUMAN_BODY)) + 'Z', SIVAS.body, {
      line: LINE.body,
      inner,
      // Round and heavy: the back and the underside of the belly in shade.
      rim: [7.5, -3.4],
      hatch: 2.6,
      shade: `M${P(-20, 2)}Q${P(0, 8)} ${P(18, 1)}L${P(20, 12)}L${P(-20, 12)}Z`,
      glint: [-1.6, 1.8],
      light: `M${P(15.5, -50)}Q${P(21, -42)} ${P(21.4, -30)}Q${P(18.4, -40)} ${P(15.5, -50)}Z`,
      over: folds + stitches(o([[16, -47], [19, -33], [19, -26]]), 4, 1.8, darkOf(SIVAS.body, 0.55)) + sprig,
    });
  });
}

function upperArm(): PartArt {
  return part('gorti.human.arm', { x0: -9, y0: -6, x1: 9, y1: 28 }, (ox, oy) =>
    comicLimb([ox, oy], [ox, oy + 23], 14, 11, SIVAS.body, {
      bulge: 0.7,
      inner: comic(jagged(ox + 1, oy + 6, 6.5, 5.5, 21, 8), SIVAS.mauve, { line: LINE.detail }),
      over: fold(`M${ox - 4} ${oy + 16}q4 2 8 0`, darkOf(SIVAS.body, 0.3)) + fold(`M${ox + 1} ${oy + 20}q2.4 0.6 4 -0.6`, darkOf(SIVAS.body, 0.3), LINE.fine),
    }),
  { far: true });
}

/** Forearm with green stripes and a green hand. */
function forearm(suit = false): PartArt {
  return part(suit ? 'gorti.suit.fore' : 'gorti.human.fore', { x0: -9, y0: -5, x1: 10, y1: 33 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const handLine = darkOf(SIVAS.hand, 0.5);
    let s = '';
    // The hand: a green mitten with a thumb and a pointing finger.
    s += comic(path(o([[-4, 18], [4, 18], [6.5, 23], [6, 29.5], [3.8, 30], [2.5, 26], [0, 29.5], [-3.5, 28], [-5, 23]])) + 'Z', SIVAS.hand, {
      line: LINE.small,
      rim: [2, -0.8],
      glint: [-0.6, 0.6],
      over: fold(`M${ox + 2.5} ${oy + 26}l-1 -3M${ox - 1} ${oy + 27.5}l-0.3 -3`, handLine, LINE.fine * 1.2),
    });
    s += comic(taper(o([[4, 21], [7, 23], [8.5, 26]]), 3.4, 2.2), SIVAS.hand, { line: LINE.detail * 1.1, rim: [0.8, -0.5] });
    if (suit) {
      s += comicLimb([ox, oy], [ox, oy + 18], 10.5, 9.5, SIVAS.suit, { bulge: 0.3, over: fold(`M${ox - 3} ${oy + 8}q2 2 5 0M${ox - 2.6} ${oy + 11.6}q1.6 1.2 3.6 0.2`, darkOf(SIVAS.suit, 0.3), LINE.fine * 1.2) });
      s += comic(roundPoly(o([[-5, 15], [5, 15], [5, 20], [-5, 20]]), 1.2), SIVAS.shirt, { line: LINE.detail, rim: [1.2, -0.6] });
    } else {
      const stripes = [9, 13, 17].map((y) => `<path d="M${ox - 6} ${oy + y}H${ox + 6}V${oy + y + 2.2}H${ox - 6}Z" fill="${SIVAS.stripe}"/>` + ink(`M${ox - 6} ${oy + y}H${ox + 6}M${ox - 6} ${oy + y + 2.2}H${ox + 6}`, LINE.fine, darkOf(SIVAS.stripe, 0.4))).join('');
      s += comicLimb([ox, oy], [ox, oy + 19], 10, 9, SIVAS.body, { bulge: 0.3, inner: stripes, over: fold(`M${ox - 3.4} ${oy + 4}q2.4 1.4 5.2 0`, darkOf(SIVAS.body, 0.3), LINE.fine * 1.2) });
    }
    return s;
  }, { far: true });
}

function thigh(suit = false): PartArt {
  return part(suit ? 'gorti.suit.thigh' : 'gorti.human.thigh', { x0: -9, y0: -5, x1: 9, y1: 24 }, (ox, oy) =>
    suit
      ? comicLimb([ox, oy], [ox, oy + 19], 15, 12, SIVAS.suit, { bulge: 0.7, over: fold(`M${ox + 2} ${oy + 5}q-3 6 1 11M${ox - 3} ${oy + 15}q3 2 6 0.6`, darkOf(SIVAS.suit, 0.32)) })
      : comicLimb([ox, oy], [ox, oy + 19], 16, 12.5, SIVAS.leg, {
          bulge: 0.8,
          inner: comic(jagged(ox - 2, oy + 8, 5.5, 5, 31, 8), SIVAS.sage, { line: LINE.detail }),
          over: stitches([[ox + 4, oy + 2], [ox + 5, oy + 14]], 3.4, 1.6, darkOf(SIVAS.leg, 0.55)) + fold(`M${ox - 4} ${oy + 17}q3.6 1.6 7.4 -0.2`, darkOf(SIVAS.leg, 0.35), LINE.fine * 1.2),
        }),
  { far: true });
}

function shin(suit = false): PartArt {
  return part(suit ? 'gorti.suit.shin' : 'gorti.human.shin', { x0: -9, y0: -4, x1: 9, y1: 24 }, (ox, oy) => {
    if (suit) return comicLimb([ox, oy], [ox, oy + 20], 12, 11, SIVAS.suit, { bulge: 0.3, over: fold(`M${ox - 5} ${oy + 17}H${ox + 5}M${ox - 3} ${oy + 4}q2.4 1.6 5 0.4`, darkOf(SIVAS.suit, 0.32)) });
    // A jagged cuff over the shin, like the painting's flowered hems.
    const cuff = `M${ox - 7} ${oy + 3}L${ox - 5} ${oy + 10}L${ox - 3} ${oy + 5}L${ox - 1} ${oy + 11}L${ox + 1.5} ${oy + 5}L${ox + 3.5} ${oy + 10.5}L${ox + 5.5} ${oy + 4.5}L${ox + 7.5} ${oy + 9}L${ox + 7} ${oy - 1}L${ox - 7} ${oy - 1}Z`;
    return (
      comicLimb([ox, oy], [ox, oy + 20], 12, 10.5, SIVAS.leg, { bulge: 0.3, over: fold(`M${ox - 3} ${oy + 14}l3 1.5`, darkOf(SIVAS.leg, 0.4), LINE.fine * 1.2) }) +
      comic(cuff, SIVAS.mauveDeep, { line: LINE.detail * 1.2, rim: [2.2, -0.6], glint: [-0.5, 0.6] })
    );
  }, { far: true });
}

/** Pale claw-foot (pivot at the ankle, sole at +6). */
function foot(): PartArt {
  return part('gorti.human.foot', { x0: -9, y0: -5, x1: 17, y1: 8 }, (ox, oy) =>
    comic(`M${ox - 7} ${oy - 2}Q${ox - 1} ${oy - 5} ${ox + 5} ${oy - 1}L${ox + 16} ${oy + 3}L${ox + 11} ${oy + 3.5}L${ox + 13} ${oy + 6}L${ox + 7} ${oy + 5}L${ox + 6} ${oy + 6.5}L${ox - 7} ${oy + 6.5}Z`, SIVAS.foot, {
      line: LINE.small,
      rim: [0.6, -2],
      glint: [-0.4, 0.9],
      over: fold(`M${ox - 2} ${oy + 1}q2 1 4 0M${ox + 8.6} ${oy + 3.2}l-1.6 1.4`, darkOf(SIVAS.foot, 0.35), LINE.fine * 1.2),
    }),
  { far: true });
}

function shoe(): PartArt {
  return part('gorti.suit.foot', { x0: -9, y0: -5, x1: 17, y1: 8 }, (ox, oy) =>
    comic(roundPoly(tr([[-6, -3], [4, -3], [8, 0], [15, 2], [15.5, 6.5], [-7, 6.5]], ox, oy), [2, 2, 3, 3, 1.5, 1.5]), SIVAS.shoe, {
      line: LINE.small,
      ink: '#2f2a35',
      rim: [0.6, -1.6],
      tone: SHADE.deep,
      // A polished toe cap.
      light: `M${ox + 7} ${oy + 0.6}Q${ox + 12} ${oy + 1.4} ${ox + 14} ${oy + 3}Q${ox + 11} ${oy + 2.4} ${ox + 7} ${oy + 0.6}Z`,
      lightFill: '#9a93a3',
      over: fold(`M${ox - 6} ${oy + 4.8}H${ox + 15}`, '#8a8494', LINE.fine * 1.2) + fold(`M${ox + 1} ${oy - 2.6}q1.4 1.6 3.4 1.8`, '#8a8494', LINE.fine),
    }),
  { far: true });
}

// ------------------------------------------------------------------ suit

function suitTorso(): PartArt {
  return part('gorti.suit.torso', { x0: -35, y0: -66, x1: 27, y1: 11 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    const deep = darkOf(SIVAS.suit, 0.32);
    const shirt =
      comic(`M${ox + 1} ${oy - 61}L${ox + 16} ${oy - 56}L${ox + 10} ${oy - 38}Z`, SIVAS.shirt, { line: LINE.detail * 1.1, rim: [1.4, -0.4] }) +
      comic(`M${ox + 7} ${oy - 57}L${ox + 11} ${oy - 56}L${ox + 11.5} ${oy - 44}L${ox + 9.5} ${oy - 39}L${ox + 7.5} ${oy - 44}Z`, SIVAS.tie, { line: LINE.detail, glint: [-0.5, 0.4] });
    const lapels =
      comic(`M${ox + 1} ${oy - 61}L${ox + 10} ${oy - 38}L${ox + 3} ${oy - 45}L${ox - 1} ${oy - 58}Z`, SIVAS.suitDeep, { line: LINE.detail * 1.1, glint: [-0.4, 0.4] }) +
      comic(`M${ox + 16} ${oy - 56}L${ox + 10} ${oy - 38}L${ox + 17} ${oy - 46}L${ox + 19} ${oy - 53}Z`, SIVAS.suitDeep, { line: LINE.detail * 1.1, glint: [-0.4, 0.4] });
    // The worn coat's creases: pulled across the belly, bunched at the back.
    const folds =
      fold(`M${P(-24, -32)}q7 3 13 1`, deep) +
      fold(`M${P(-24, -12)}q7 2 13 0`, deep) +
      fold(`M${P(-27, -22)}q4 1 7 0`, deep, LINE.fine) +
      fold(`M${P(2, -30)}q5 4 11 3`, deep, LINE.fine * 1.2) +
      fold(`M${P(4, -18)}q5 3 10 2`, deep, LINE.fine * 1.2) +
      fold(`M${P(-6, 2)}q4 -3 3 -8`, deep, LINE.fine * 1.2);
    const over =
      shirt +
      lapels +
      folds +
      ink(path(o([[10, -38], [13, -22], [15, -8], [15, 6]])), LINE.detail * 1.2, darkOf(SIVAS.suit, 0.6)) + // front edge
      `<circle cx="${ox + 12.5}" cy="${oy - 26}" r="1.3" fill="${SIVAS.tie}"/><circle cx="${ox + 14}" cy="${oy - 14}" r="1.3" fill="${SIVAS.tie}"/>` +
      // A name tag: the one label left.
      label(ox + 15, oy - 36, 8, 5, PASTEL.cream, 17, 8);
    return comic(path(o(HUMAN_BODY)) + 'Z', SIVAS.suit, {
      line: LINE.body,
      rim: [7.5, -3.4],
      hatch: 2.6,
      tone: SHADE.deep,
      glint: [-1.4, 1.6],
      over,
    });
  });
}

function suitArm(): PartArt {
  return part('gorti.suit.arm', { x0: -9, y0: -6, x1: 9, y1: 28 }, (ox, oy) =>
    comicLimb([ox, oy], [ox, oy + 23], 14, 11, SIVAS.suit, { bulge: 0.7, over: fold(`M${ox - 4} ${oy + 14}q4 2 8 0M${ox - 3} ${oy + 19}q3 1.4 6 0.2`, darkOf(SIVAS.suit, 0.32)) }),
  { far: true });
}

export function sivasliParts(): PartArt[] {
  return [
    moonHead(), ...moonEye(), ...moonMouth(), browPart('gorti.human.brow', SIVAS.moonDeep, 11, 3.4, { stroke: DETAIL }),
    sunHead(), ...sunEyes(), ...sunMouth(), browPart('gorti.sun.brow', '#c7743f', 9, 2.8, { stroke: DETAIL }),
    baldHead(), ...baldEyes(), ...baldMouth(), baldStache(), baldWisp(),
    bushyBrow('gorti.bald.brow', SIVAS.grey, 11.5, 3.9, { inner: 1, line: LINE.detail * 1.2, hair: SIVAS.greyDark }),
    bushyBrow('gorti.bald.browF', SIVAS.grey, 7.8, 3.1, { inner: -1, line: LINE.detail * 1.1, hair: SIVAS.greyDark }),
    torso(), upperArm(), forearm(), thigh(), shin(), foot(),
    suitTorso(), suitArm(), forearm(true), thigh(true), shin(true), shoe(),
  ];
}

export const RIG_GORTI_HUMAN = humanoidRig('gorti.human', 'gorti.human', HUMAN_MOON_DIMS);
export const RIG_GORTI_HUMAN_SUN = humanoidRig('gorti.human.sun', 'gorti.human', HUMAN_SUN_DIMS);
/** The kel amca: the same body and skeleton, the plain bald head (swap heads with RigView.setRig). */
export const RIG_GORTI_HUMAN_BALD = humanoidRig('gorti.human.bald', 'gorti.human', HUMAN_BALD_DIMS);
export const RIG_GORTI_SUIT = humanoidRig('gorti.suit', 'gorti.suit', { ...HUMAN_MOON_DIMS, parts: { head: 'gorti.human.head' } });

