import type { DoorArt } from '../../../render/2d/fx/doorway';
import { ellipsePath, rrect } from '../../../render/2d/svg';
import { circleP, comic, darkOf, doorPart, fillP, glowDisc, ink, leafPart, lightOf, LINE, poly, smooth } from './doorKit';

// b01, "Form Kapısı": a door standing on its own in the empty meadow,
// turned across the path, so Gorti walks through it and not past it. It
// opens only for the human form, and its doorman says so: a little carved
// head on the near post, asleep under his bowler hat until Gorti comes,
// then wide awake, monocle on, watching him and slowly shaking his head.
// When Gorti is human he beams, the door swings back flat behind the path,
// the human sign over it lights up, the round window in the leaf shows the
// sunny day it keeps in there, and petals of that day drift out. Change
// back and it swings shut again.
//
// The door stands at the actors' plane: the back post behind Gorti, the
// near post before him, the leaf and the lintel drawn in perspective
// between them (see DoorLeaf).

const C = {
  wood: '#dcb893',
  cap: '#e9cca8',
  leaf: '#a3d2c4',
  panel: '#b7ded1',
  brass: '#efcf7e',
  hinge: '#b59a74',
  sky: '#ffe9ad',
  sun: '#ffc768',
  hill: '#bfe0a2',
  plaque: '#f6efe0',
  figure: '#8d78ab',
  hat: '#9d86b8',
  skin: '#f3d2b4',
  cheek: '#f2a0b0',
  tash: '#a98262',
  white: '#fffaf3',
  pupil: '#4b3550',
  mat: '#d9a0ad',
  pot: '#e2a68a',
  stem: '#8fbf86',
  bud: '#f3b7cc',
  petal: '#f8d3e2',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The posts stand on the diagonal: the back one at (-D, dz -D), the near one at (D, dz +D). */
const D = 28;
const POST_H = 240;
/** The leaf: between the posts' inner faces, hinged on the back post. */
const LEAF_W = 67;
const LEAF_H = 196;
const HINGE = D - 6 / Math.SQRT2;
/** The lintel: from 5 px behind the back post to 5 px past the near one. */
const LINTEL_W = 2 * Math.SQRT2 * D + 10;
const LINTEL_H = 72;
const LINTEL_AT = D + 5 / Math.SQRT2;
/** The doorman's head, on the near post. */
const HEAD_Y = -POST_H - 27;
const HEAD_K = 1.22;

function post(back: boolean): string {
  let s = comic(rrect(-6, -POST_H, 12, POST_H, 1.5), C.wood, { line: LINE.limb, rim: [3.2, -1.2], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, over: ink(`M-1.6 ${-POST_H + 16}V-20`, 0.8, darkOf(C.wood, 0.22)) });
  s += comic(rrect(-8.5, -15, 17, 15, 2), C.cap, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8] });
  s += comic(rrect(-8.5, -POST_H - 7, 17, 9, 2), C.cap, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8] });
  if (back) {
    s += comic(circleP(0, -POST_H - 15, 7.5), C.cap, { line: LINE.small, rim: [2.2, -1], glint: [-0.8, 0.8] });
    // A little lantern hung on a hook, for coming home late.
    s += ink(`M6 -150h7v6`, 1, darkOf(C.hinge, 0.2));
    s += comic(poly([[9, -144], [17, -144], [18.5, -130], [7.5, -130]]), '#f6e7c0', { line: LINE.detail, over: fillP(circleP(13, -137, 2.6), '#ffe7a0') });
    s += comic(rrect(7, -146, 12, 3, 1), C.hinge, { line: LINE.fine });
  }
  return s;
}

/** The leaf's face: panels, a round window with the day in it, the human-shaped keyhole. */
function leafFront(): string {
  const w = LEAF_W;
  const h = LEAF_H;
  let inner = '';
  for (const [y0, y1] of [
    [64, 114],
    [122, 184],
  ] as const) {
    for (const [x0, x1] of [
      [8, w / 2 - 3],
      [w / 2 + 3, w - 8],
    ] as const) {
      inner += comic(rrect(x0, y0, x1 - x0, y1 - y0, 2.5), C.panel, { line: LINE.detail, ink: darkOf(C.leaf, 0.3), rim: [-1.6, 1.4], glint: [1, -1] });
    }
  }
  // The window: a porthole with the sunny day in it.
  let day = fillP(rrect(w / 2 - 14, 22, 28, 30, 0), C.sky);
  day += glowDisc(w / 2 + 5, 34, 9, '#fff3c4', 0.9) + fillP(circleP(w / 2 + 5, 34, 4.6), C.sun);
  day += fillP(smooth([[w / 2 - 16, 46], [w / 2 - 4, 41], [w / 2 + 8, 44], [w / 2 + 16, 41], [w / 2 + 16, 54], [w / 2 - 16, 54]]), C.hill);
  day += fillP(ellipsePath(w / 2 - 6, 30, 5, 2), '#ffffff', 0.8);
  inner += comic(circleP(w / 2, 38, 15), C.brass, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8] });
  inner += comic(circleP(w / 2, 38, 11.5), C.sky, { line: LINE.detail, inner: day, over: ink(`M${f(w / 2 + 4)} 29.5l3 -2.5`, 1.1, '#ffffff', 0.9) });
  // Hinges on the back post's side, the knob and the keyhole by the free edge.
  for (const y of [24, 170]) inner += comic(rrect(-1, y, 12, 6, 1.5), C.hinge, { line: LINE.fine });
  const kx = w - 9;
  let s = comic(rrect(0, 0, w, h, 3), C.leaf, { line: LINE.limb, rim: [4, -1.8], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, inner });
  s += comic(circleP(kx, 104, 3.8), C.brass, { line: LINE.detail, rim: [1.2, -0.6], glint: [-0.6, 0.6] });
  s += comic(ellipsePath(kx, 122, 4.6, 8.4), C.brass, { line: LINE.detail, rim: [1.2, -0.5], glint: [-0.5, 0.5] });
  // The keyhole is a little person.
  s += fillP(circleP(kx, 117.6, 1.5), C.pupil) + fillP(`M${f(kx - 1.6)} 119.6h3.2l0.9 4.4h-1.4l-0.4 3.4h-1.4l-0.4 -3.4h-1.4Z`, C.pupil);
  return s;
}

/** The leaf's back (seen from behind: the hinge on its right). */
function leafBack(): string {
  const w = LEAF_W;
  const h = LEAF_H;
  let inner = '';
  for (const x of [w / 3, (2 * w) / 3]) inner += ink(`M${f(x)} 6V${h - 6}`, 0.8, darkOf(C.leaf, 0.25));
  inner += comic(poly([[6, 40], [w - 6, 150], [w - 6, 158], [6, 48]]), lightOf(C.leaf, 0.1), { line: LINE.fine });
  inner += comic(circleP(w / 2, 38, 11.5), '#f6e6b0', { line: LINE.detail });
  return comic(rrect(0, 0, w, h, 3), darkOf(C.leaf, 0.06), { line: LINE.limb, rim: [3, -1.4], inner });
}

/** The lintel, seen along the diagonal: a beam over the door, a little pediment, the human sign. */
function lintel(): string {
  const w = LINTEL_W;
  const top = 30;
  let s = comic(poly([[3, top + 1], [w / 2, 6], [w - 3, top + 1]]), C.cap, {
    line: LINE.small,
    rim: [2.4, -1.2],
    glint: [-0.8, 0.8],
    over: ink(`M${f(12)} ${top - 2}L${f(w / 2)} 12L${f(w - 12)} ${top - 2}`, 0.8, darkOf(C.cap, 0.25)),
  });
  // A carved fan in the pediment.
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + ((i + 0.5) / 7) * Math.PI;
    s += ink(`M${f(w / 2)} ${top - 1}L${f(w / 2 + Math.cos(a) * 14)} ${f(top - 1 + Math.sin(a) * 12)}`, 0.7, darkOf(C.cap, 0.3));
  }
  s += comic(rrect(0, top, w, LINTEL_H - top, 2), C.wood, { line: LINE.limb, rim: [3.4, -1.4], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, over: ink(`M4 ${top + 6}H${f(w - 4)}`, 0.8, darkOf(C.wood, 0.2)) });
  // The sign: an enamel oval with a little person on it.
  const cx = w / 2;
  const cy = top + (LINTEL_H - top) / 2;
  s += comic(ellipsePath(cx, cy, 15, 10.5), C.plaque, { line: LINE.small, ink: darkOf(C.brass, 0.35), rim: [1.6, -0.8], glint: [-0.6, 0.6] });
  s += figure(cx, cy, 1, C.figure);
  return s;
}

/** A little person (the sign's), about 16 px high, centred at cx, cy. */
function figure(cx: number, cy: number, k: number, color: string): string {
  const P = (x: number, y: number): string => `${f(cx + x * k)} ${f(cy + y * k)}`;
  return (
    fillP(circleP(cx, cy - 5.6 * k, 2.4 * k), color) +
    fillP(`M${P(-3.6, -2.4)}Q${P(0, -3.6)} ${P(3.6, -2.4)}L${P(4.4, 2.6)}L${P(2.2, 2.6)}L${P(2.2, 7.6)}L${P(0.6, 7.6)}L${P(0, 3.6)}L${P(-0.6, 7.6)}L${P(-2.2, 7.6)}L${P(-2.2, 2.6)}L${P(-4.4, 2.6)}Z`, color)
  );
}

/** The sign's light (drawn additive once the door is open). */
function signGlow(): string {
  return glowDisc(0, 0, 24, '#f9d48e', 0.8);
}

// ---------------------------------------------------------------- the doorman

/** His head under a bowler hat, a curly moustache; eyes and mouth are pieces. */
function head(): string {
  let s = comic(ellipsePath(-13.5, 2, 3.4, 4.6), C.skin, { line: LINE.detail }) + comic(ellipsePath(13.5, 2, 3.4, 4.6), C.skin, { line: LINE.detail });
  s += comic(ellipsePath(0, 0, 13.5, 15.5), C.skin, { line: LINE.small, rim: [2.6, -1.2], glint: [-0.8, 0.8], tone: '#e7c4c6' });
  s += comic(ellipsePath(0, 4, 2.6, 3.4), darkOf(C.skin, 0.06), { line: LINE.detail });
  // The moustache, curled at both ends.
  s += comic('M0 7.6C-3 6.2 -7 6.4 -9.4 8.6C-11 10 -12.8 9.2 -12.4 7.4C-13.6 9.6 -11 12.6 -7.6 11.2C-4.6 10.2 -2 9.6 0 9.8C2 9.6 4.6 10.2 7.6 11.2C11 12.6 13.6 9.6 12.4 7.4C12.8 9.2 11 10 9.4 8.6C7 6.4 3 6.2 0 7.6Z', C.tash, { line: LINE.detail });
  // The bowler hat.
  s += comic('M-16 -9.5Q0 -14 16 -9.5Q17 -7 14 -7.4Q0 -10.6 -14 -7.4Q-17 -7 -16 -9.5Z', C.hat, { line: LINE.small, rim: [1.4, -0.6] });
  s += comic('M-10.5 -10Q-11.4 -26 0 -26.4Q11.4 -26 10.5 -10Q0 -12.6 -10.5 -10Z', C.hat, { line: LINE.small, rim: [2.6, -1.1], glint: [-0.8, 0.8], over: fillP('M-10.4 -13.6Q0 -16 10.4 -13.6L10.5 -10.4Q0 -12.8 -10.5 -10.4Z', darkOf(C.hat, 0.25)) });
  return s;
}

/** Asleep: eyes shut, a little round snore, a "z". */
function asleep(): string {
  const line = darkOf(C.skin, 0.55);
  let s = '';
  for (const x of [-5.4, 5.4]) s += ink(`M${x - 3.2} -2Q${x} 1 ${x + 3.2} -2`, 1.1, line);
  s += fillP(ellipsePath(0, 13.6, 1.6, 1.8), darkOf(C.skin, 0.45));
  s += ink('M15 -16h4l-4 4.4h4M20 -23h3l-3 3.4h3', 0.9, darkOf(C.hat, 0.1));
  return s;
}

/** Awake and stern: eyes wide, one brow up, a monocle, a frown under the moustache. */
function stern(): string {
  const line = darkOf(C.skin, 0.55);
  let s = '';
  for (const x of [-5.4, 5.4]) s += comic(ellipsePath(x, -1.6, 3.6, 4.2), C.white, { line: LINE.detail, ink: line });
  s += ink('M-9 -8.6Q-5.4 -10.2 -2 -8.2', 1.1, line) + ink('M2 -9.6Q5.4 -13.6 9.4 -11', 1.1, line);
  s += ink('M-3.4 14.4Q0 12.4 3.4 14.4', 1, line);
  // The monocle on his right eye (the viewer's left), on a little chain.
  s += `<circle cx="-5.4" cy="-1.6" r="5" fill="none" stroke="${C.brass}" stroke-width="1.3"/>` + ink('M-9.6 1.4Q-12 8 -10 13', 0.6, darkOf(C.brass, 0.2));
  return s;
}

function pupils(): string {
  return fillP(circleP(-5.4, -1.2, 1.7), C.pupil) + fillP(circleP(5.4, -1.2, 1.7), C.pupil) + fillP(circleP(-4.8, -2, 0.55), '#ffffff') + fillP(circleP(6, -2, 0.55), '#ffffff');
}

/** Beaming: happy shut eyes, rosy cheeks, a wide smile. */
function happy(): string {
  const line = darkOf(C.skin, 0.55);
  let s = '';
  for (const x of [-5.4, 5.4]) s += ink(`M${x - 3.4} -0.6Q${x} -5 ${x + 3.4} -0.6`, 1.2, line);
  for (const x of [-9, 9]) s += fillP(ellipsePath(x, 4.6, 2.8, 1.6), C.cheek, 0.8);
  s += comic('M-5 12.6Q0 18.6 5 12.6Q0 14.2 -5 12.6Z', '#e98a9c', { line: LINE.detail, ink: line });
  s += ink('M-9 -8Q-5.4 -10 -2 -8.4M2 -8.4Q5.4 -10 9 -8', 1, line);
  return s;
}

// ---------------------------------------------------------------- around it

/** A woven mat before the door. */
function mat(): string {
  let s = comic('M-26 -3L22 -3L26 3L-22 3Z', C.mat, { line: LINE.small, rim: [1.6, -0.6], over: ink('M-18 0h36', 0.7, lightOf(C.mat, 0.3)) });
  for (let x = -24; x <= 24; x += 4) s += ink(`M${x} 3.4l-0.6 2.2`, 0.6, darkOf(C.mat, 0.25));
  return s;
}

/** A flowerpot by the back post: a bud while the door is shut, a flower once it opens. */
function pot(): string {
  let s = comic(poly([[-9, -15], [9, -15], [7, 0], [-7, 0]]), C.pot, { line: LINE.small, rim: [2, -1], glint: [-0.6, 0.6] });
  s += comic(rrect(-10.5, -18, 21, 4.6, 1.5), lightOf(C.pot, 0.08), { line: LINE.detail });
  s += ink('M0 -18Q-1.4 -30 0.6 -40', 1.2, darkOf(C.stem, 0.25));
  s += comic('M0 -26Q-8 -30 -10 -24Q-4 -21 0 -26Z', C.stem, { line: LINE.detail });
  return s;
}

function bud(): string {
  return comic('M0 -48Q4.4 -44 3.4 -40Q0 -37.6 -3.4 -40Q-4.4 -44 0 -48Z', C.bud, { line: LINE.detail, rim: [1, -0.5] });
}

function bloom(): string {
  let s = '';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    s += comic(ellipsePath(Math.cos(a) * 4.6, -42 + Math.sin(a) * 4.6, 3.4, 2.4), C.petal, { line: LINE.fine });
  }
  return s + comic(circleP(0, -42, 2.4), '#f6d47a', { line: LINE.fine });
}

/** Light in the doorway once it is open (drawn additive). */
function doorLight(): string {
  return glowDisc(0, 0, 70, '#f7c98a', 0.7) + glowDisc(0, 0, 30, '#ffe2a8', 0.45);
}

/** The door that opens only for the human form. */
export function formDoor(): DoorArt {
  const parts = [
    doorPart('door.form.post', { x0: -10, y0: -POST_H - 24, x1: 20, y1: 2 }, post(true)),
    doorPart('door.form.post.near', { x0: -10, y0: -POST_H - 9, x1: 10, y1: 2 }, post(false)),
    leafPart('door.form.leaf', LEAF_W, LEAF_H, leafFront()),
    leafPart('door.form.leaf.back', LEAF_W, LEAF_H, leafBack()),
    leafPart('door.form.lintel', LINTEL_W, LINTEL_H, lintel()),
    leafPart('door.form.lintel.back', LINTEL_W, LINTEL_H, lintel()),
    doorPart('door.form.sign', { x0: -28, y0: -28, x1: 28, y1: 28 }, signGlow()),
    doorPart('door.form.head', { x0: -19, y0: -28, x1: 19, y1: 18 }, head()),
    doorPart('door.form.asleep', { x0: -10, y0: -26, x1: 25, y1: 17 }, asleep()),
    doorPart('door.form.stern', { x0: -12, y0: -15, x1: 11, y1: 16 }, stern()),
    doorPart('door.form.pupils', { x0: -8, y0: -4, x1: 8, y1: 2 }, pupils()),
    doorPart('door.form.happy', { x0: -12, y0: -11, x1: 12, y1: 19 }, happy()),
    doorPart('door.form.mat', { x0: -28, y0: -5, x1: 28, y1: 7 }, mat()),
    doorPart('door.form.pot', { x0: -12, y0: -42, x1: 12, y1: 2 }, pot()),
    doorPart('door.form.bud', { x0: -5, y0: -50, x1: 5, y1: -36 }, bud()),
    doorPart('door.form.bloom', { x0: -10, y0: -52, x1: 10, y1: -32 }, bloom()),
    doorPart('door.form.light', { x0: -72, y0: -72, x1: 72, y1: 72 }, doorLight()),
  ];
  const near = D + 0.5;
  return {
    parts,
    opening: [],
    frame: [
      { key: 'door.form.post', x: -D, y: 0, dz: -D },
      { key: 'door.form.mat', x: -58, y: 2, dz: -4 },
      { key: 'door.form.pot', x: -50, y: 0, dz: -D - 8 },
    ],
    inside: [],
    front: [{ key: 'door.form.post.near', x: D, y: 0, dz: D }],
    pieces: [
      // Light in the doorway, and the sign over it, once it opens.
      { key: 'door.form.light', x: 4, y: -96, dz: -12, additive: true, shut: { alpha: 0, sx: 0.6, sy: 0.6 }, open: { alpha: 0.2 }, wake: { alpha: 0.12, sx: 1.1, sy: 1.08 }, sway: { alpha: 0.04, ms: 2600 } },
      { key: 'door.form.sign', x: 0, y: -219, dz: 0.5, additive: true, shut: { alpha: 0, sx: 0.5, sy: 0.5 }, open: { alpha: 0.45 }, lag: 0.2, sway: { alpha: 0.08, ms: 1800 } },
      // The flower by the post wakes with the door.
      { key: 'door.form.bud', x: -50, y: 0, dz: -D - 7.5, shut: {}, open: { alpha: 0, sy: 0.4 }, lag: 0.3 },
      { key: 'door.form.bloom', x: -50, y: 0, dz: -D - 7.5, shut: { alpha: 0, sx: 0.3, sy: 0.3 }, open: {}, lag: 0.4, wake: { angle: 8 }, sway: { angle: 4, ms: 2300 } },
      // The doorman: asleep, then awake and watching (shaking his head) while it is shut; beaming once it opens.
      { key: 'door.form.head', x: D, y: HEAD_Y, scale: HEAD_K, dz: near, shut: {}, open: {}, wakeShut: 'only', sway: { angle: 6, ms: 1500, byWake: true } },
      { key: 'door.form.asleep', x: D, y: HEAD_Y, scale: HEAD_K, dz: near + 0.2, shut: {}, open: { alpha: 0 }, wake: { alpha: -1 }, wakeShut: true, sway: { y: 0.6, ms: 2400 } },
      { key: 'door.form.stern', x: D, y: HEAD_Y, scale: HEAD_K, dz: near + 0.2, shut: { alpha: 0 }, open: { alpha: 0 }, wake: { alpha: 1 }, wakeShut: 'only', sway: { angle: 6, ms: 1500, byWake: true } },
      { key: 'door.form.pupils', x: D, y: HEAD_Y, scale: HEAD_K, dz: near + 0.4, shut: { alpha: 0 }, open: { alpha: 0 }, wake: { alpha: 1 }, wakeShut: 'only', look: { x: 2.2, y: 0.5 }, blink: true, sway: { angle: 6, ms: 1500, byWake: true } },
      { key: 'door.form.happy', x: D, y: HEAD_Y, scale: HEAD_K, dz: near + 0.2, shut: { alpha: 0 }, open: {}, lag: 0.1, wake: { sy: 1.05 } },
    ],
    leaves: [
      { front: 'door.form.leaf', back: 'door.form.leaf.back', hinge: 'left', x: -HINGE, y: -LEAF_H, dz: -HINGE, shutAngle: 45, restAngle: -4, wideAngle: -12, strips: 14 },
      { front: 'door.form.lintel', back: 'door.form.lintel.back', hinge: 'left', x: -LINTEL_AT, y: -POST_H - 30, dz: -LINTEL_AT, shutAngle: 45, restAngle: 45, wideAngle: 45, strips: 10, still: true },
    ],
    light: { color: 0xffe2a0, radius: 320, intensity: 0.85, y: 110 },
    glow: { color: 0xffe6b0, pool: 0xffe6c0 },
    sparks: { colors: [0xffe3a0, 0xf8c8d8, 0xfff4c8], frame: 'fx.petal', rate: 1.3, size: 0.42 },
    sounds: { wake: ['click', 0.25, 0.7], open: [['door', 0.45, 1.05], ['songOk', 0.3, 1.25]] },
    openMs: 1300,
  };
}
