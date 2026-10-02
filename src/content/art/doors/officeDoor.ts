import type { DoorArt, DoorPiece } from '../../../render/2d/fx/doorway';
import { ellipsePath, rrect } from '../../../render/2d/svg';
import { circleP, comic, darkOf, doorPart, fillP, glowDisc, ink, leafPart, lightOf, LINE, poly, smooth, type Pt } from './doorKit';

// r12, "Boş Masa": the office door between the waiting room and the room
// with the long table. It stands across the corridor on its own, so Gorti
// walks through it. It is a door of the Committee and works like one: a
// ticket machine stands beside it, and over it hangs the queue board,
// "SIRA", showing 13. As Gorti comes, a light comes on behind the frosted
// glass, the board's little lamp blinks, and the machine prints him a
// ticket: 14. When the way opens the board flips to 14 with a ding (his
// number has come), the door swings all the way round behind its post, a
// warm lamp light falls through, and the draft blows papers out over the
// floor toward him, as if the paperwork came to meet him.
//
// Like b01's door it stands at the actors' plane, turned across the path:
// the back post behind Gorti, the near post before him, the leaf and the
// transom in perspective between them.

const C = {
  casing: '#b8ab9c',
  casingCap: '#cbbfb1',
  leaf: '#d3c7b3',
  panel: '#dfd5c3',
  glass: '#dbe6e2',
  glassHi: '#eef4f1',
  gold: '#e3be6a',
  brass: '#e6c67c',
  hinge: '#a99a86',
  kick: '#c2b6a5',
  notice: '#fbf6ea',
  noticeLine: '#a39a8a',
  stamp: '#d9737d',
  tape: '#efe3b4',
  board: '#6b6680',
  boardFace: '#3f3b52',
  boardLabel: '#f6efe0',
  led: '#ffc08e',
  ledHot: '#ffe0bf',
  dot: '#ff8f8f',
  machine: '#e7a7a4',
  machineCap: '#f0bdb9',
  pole: '#a8a2b4',
  button: '#a6d8c3',
  plate: '#fbf3e3',
  ticket: '#fffaf0',
  inkDark: '#5a5262',
  paper: '#fbf5e8',
  paperShade: '#e9e0cc',
  mat: '#9fa7b8',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The posts stand on the diagonal: the back one at (-D, dz -D), the near one at (D, dz +D). */
const D = 28;
const POST_H = 266;
/** The leaf: between the posts' inner faces, hinged on the back post. */
const LEAF_W = 67;
const LEAF_H = 214;
const HINGE = D - 6 / Math.SQRT2;
/** The transom over the leaf, under a cornice: from 5 px behind the back post to 5 px past the near one. */
const LINTEL_W = 2 * Math.SQRT2 * D + 10;
const LINTEL_TOP = -POST_H - 16;
const LINTEL_H = -LINTEL_TOP - LEAF_H;
const LINTEL_AT = D + 5 / Math.SQRT2;
/** The queue board, standing on the cornice. */
const BOARD_W = 70;
const BOARD_H = 44;
const BOARD_Y = LINTEL_TOP - 6;
/** The ticket machine by the back post. */
const MACHINE_X = -116;
const MACHINE_DZ = -D - 12;
const SLOT_Y = -89;

// ---------------------------------------------------------------- lettering

/** Strokes of the few letters the door needs, in a box 0.6 wide and 1 high (y down). */
const GLYPHS: Record<string, string> = {
  '1': 'M0.12 0.22L0.34 0V1M0.12 1H0.54',
  '3': 'M0.06 0.1Q0.3 -0.06 0.5 0.1Q0.62 0.3 0.28 0.46Q0.64 0.56 0.54 0.82Q0.38 1.06 0.04 0.9',
  '4': 'M0.44 1V0L0.02 0.7H0.6',
  O: 'M0.3 0Q0.6 0 0.6 0.5Q0.6 1 0.3 1Q0 1 0 0.5Q0 0 0.3 0Z',
  D: 'M0.04 0V1H0.24Q0.6 1 0.6 0.5Q0.6 0 0.24 0Z',
  A: 'M0 1L0.3 0L0.6 1M0.11 0.64H0.49',
  S: 'M0.56 0.12Q0.36 -0.05 0.12 0.08Q-0.02 0.26 0.22 0.42L0.42 0.58Q0.62 0.76 0.48 0.92Q0.26 1.06 0.02 0.88',
  I: 'M0.3 0V1M0.12 0H0.48M0.12 1H0.48',
  R: 'M0.04 1V0H0.34Q0.58 0 0.58 0.26Q0.58 0.5 0.34 0.5H0.04M0.3 0.5L0.6 1',
};

/** A word in stroke letters, `h` high, its middle at (cx, cy). */
function word(text: string, cx: number, cy: number, h: number): string {
  const adv = h * 0.82;
  const x0 = cx - (adv * text.length - h * 0.22) / 2;
  let d = '';
  [...text].forEach((ch, i) => {
    const g = GLYPHS[ch];
    if (!g) return;
    const ox = x0 + i * adv;
    const oy = cy - h / 2;
    d += g.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x: string, y: string) => `${f(ox + Number(x) * h)} ${f(oy + Number(y) * h)}`).replace(/([VH])(-?\d*\.?\d+)/g, (_, c: string, v: string) => `${c}${f(c === 'V' ? oy + Number(v) * h : ox + Number(v) * h)}`);
  });
  return d;
}

/** Gold leaf lettering on glass: a dark edge, the gold over it. */
function gilt(text: string, cx: number, cy: number, h: number): string {
  const d = word(text, cx, cy, h);
  return ink(d, h * 0.2, darkOf(C.gold, 0.35)) + ink(d, h * 0.12, C.gold);
}

// ---------------------------------------------------------------- the frame

function post(back: boolean): string {
  const w = 14;
  let s = comic(rrect(-w / 2, -POST_H, w, POST_H, 1.5), C.casing, {
    line: LINE.limb,
    rim: [3.4, -1.3],
    glint: [-1, 1],
    hatch: 2.4,
    hatchWidth: 0.5,
    // A moulding: two grooves running up the casing.
    over: ink(`M-2.6 ${-POST_H + 10}V-22M2.4 ${-POST_H + 10}V-22`, 0.8, darkOf(C.casing, 0.2)),
  });
  // The plinth block at its foot and the rosette block at its top.
  s += comic(rrect(-9, -24, 18, 24, 2), C.casingCap, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8], over: ink('M-5 -18h10', 0.7, darkOf(C.casingCap, 0.25)) });
  s += comic(rrect(-9.5, -POST_H - 4, 19, 20, 2), C.casingCap, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8] });
  s += comic(circleP(0, -POST_H + 6, 5.2), lightOf(C.casingCap, 0.1), { line: LINE.detail, over: comic(circleP(0, -POST_H + 6, 2), C.casing, { line: LINE.fine }) });
  if (back) {
    // A coat hook, an umbrella hung on it.
    s += ink('M6 -168h5q3 0 3 3v2', 1.4, darkOf(C.hinge, 0.15));
    s += comic(smooth([[14, -163], [8, -150], [9, -112], [14, -108], [19, -112], [20, -150]], 0.7), '#b9a9cf', { line: LINE.detail, rim: [1.4, -0.6], glint: [-0.5, 0.5], over: ink('M14 -160V-112', 0.6, darkOf('#b9a9cf', 0.25)) });
    s += ink('M14 -108v6q0 3 -3 3', 1.2, darkOf(C.hinge, 0.2));
  }
  return s;
}

/** The leaf's face: frosted glass with "ODA 14" in gold, a notice taped under it, panels, a lever handle. */
function leafFront(): string {
  const w = LEAF_W;
  const h = LEAF_H;
  let inner = '';
  // The glass, in its bead.
  let frost = `<linearGradient id="ofglass" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.glassHi}"/><stop offset="1" stop-color="${C.glass}"/></linearGradient>`;
  frost += `<rect x="9" y="16" width="${w - 18}" height="84" fill="url(#ofglass)"/>`;
  for (let i = 0; i < 9; i++) frost += ink(`M${f(9 + i * 7)} 100L${f(9 + i * 7 + 18)} 16`, 0.7, '#ffffff', 0.35);
  inner += comic(rrect(9, 16, w - 18, 84, 2), C.glass, { line: LINE.small, ink: darkOf(C.leaf, 0.32), inner: frost, rim: [-1.4, 1.2] });
  inner += gilt('ODA', w / 2, 40, 13) + gilt('14', w / 2, 70, 22);
  // The notice taped under the glass, its stamp in red.
  let notice = comic(rrect(17, 108, 30, 36, 1), C.notice, { line: LINE.detail, rim: [1.4, -0.6] });
  for (const [y, l] of [[115, 22], [120, 18], [125, 22], [130, 12]] as const) notice += ink(`M21 ${y}h${l}`, 0.8, C.noticeLine);
  notice += `<circle cx="39" cy="136" r="5" fill="none" stroke="${C.stamp}" stroke-width="1.4"/>` + ink('M35.6 136h6.8', 1.2, C.stamp);
  notice += fillP(rrect(26, 105.5, 12, 5, 1), C.tape, 0.9);
  inner += `<g transform="rotate(-4 32 126)">${notice}</g>`;
  // Two panels below, a kick plate at the foot.
  for (const x0 of [8, w / 2 + 2.5]) inner += comic(rrect(x0, 152, w / 2 - 10.5, 40, 2), C.panel, { line: LINE.detail, ink: darkOf(C.leaf, 0.28), rim: [-1.4, 1.2], glint: [1, -1] });
  inner += comic(rrect(4, h - 18, w - 8, 13, 1.5), C.kick, { line: LINE.detail, rim: [1.4, -0.6], glint: [-0.6, 0.6], over: fillP(circleP(8, h - 11.5, 1), darkOf(C.kick, 0.3)) + fillP(circleP(w - 8, h - 11.5, 1), darkOf(C.kick, 0.3)) });
  // Hinges on the back post's side.
  for (const y of [26, h - 34]) inner += comic(rrect(-1, y, 7, 14, 1.5), C.hinge, { line: LINE.fine });
  let s = comic(rrect(0, 0, w, h, 2.5), C.leaf, { line: LINE.limb, rim: [4, -1.8], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, inner });
  // The lever handle by the free edge, and the keyhole under it.
  const kx = w - 9;
  s += comic(circleP(kx, 118, 4.2), C.brass, { line: LINE.detail, rim: [1.2, -0.6], glint: [-0.6, 0.6] });
  s += comic(rrect(kx - 15, 115.6, 16, 4.8, 2.4), C.brass, { line: LINE.detail, rim: [1, -0.5], glint: [-0.5, 0.5] });
  s += comic(ellipsePath(kx, 131, 3.2, 4.6), C.brass, { line: LINE.fine });
  s += fillP(`M${f(kx)} 128.6a1.3 1.3 0 1 1 0.01 0Zm-0.9 1.4h1.8l0.6 3.4h-3Z`, C.inkDark);
  return s;
}

/** The leaf's back (seen from behind: the hinge on its right): plain panels, the glass from behind. */
function leafBack(): string {
  const w = LEAF_W;
  const h = LEAF_H;
  let inner = comic(rrect(9, 16, w - 18, 84, 2), C.glass, { line: LINE.small, ink: darkOf(C.leaf, 0.32) });
  for (const x0 of [8, w / 2 + 2.5]) inner += comic(rrect(x0, 112, w / 2 - 10.5, 80, 2), C.panel, { line: LINE.detail, ink: darkOf(C.leaf, 0.28), rim: [-1.2, 1] });
  return comic(rrect(0, 0, w, h, 2.5), darkOf(C.leaf, 0.05), { line: LINE.limb, rim: [3, -1.4], inner });
}

/** The transom: a cornice over a fanlight of frosted glass. */
function lintel(): string {
  const w = LINTEL_W;
  const h = LINTEL_H;
  const cornice = 16;
  let s = comic(rrect(0, cornice, w, h - cornice, 1.5), C.casing, { line: LINE.limb, rim: [3, -1.3], glint: [-1, 1] });
  // The fanlight: a half wheel of glass panes.
  const cx = w / 2;
  const cy = h - 3;
  const r = Math.min(w / 2 - 7, h - cornice - 8);
  let fan = fillP(`M${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 0 1 ${f(cx + r)} ${f(cy)}Z`, C.glass);
  for (let i = 1; i < 5; i++) {
    const a = Math.PI + (i / 5) * Math.PI;
    fan += ink(`M${f(cx)} ${f(cy)}L${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`, 1.2, darkOf(C.casing, 0.15));
  }
  s += comic(`M${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 0 1 ${f(cx + r)} ${f(cy)}Z`, C.glass, { line: LINE.small, ink: darkOf(C.casing, 0.3), inner: fan });
  s += comic(circleP(cx, cy, 5), C.casingCap, { line: LINE.detail });
  // The cornice: a moulded shelf.
  s += comic(rrect(-3, 4, w + 6, cornice - 2, 2), C.casingCap, { line: LINE.small, rim: [2.2, -1], glint: [-0.8, 0.8], over: ink(`M0 ${cornice - 2}H${f(w)}`, 0.8, darkOf(C.casingCap, 0.22)) });
  return s;
}

// ---------------------------------------------------------------- the queue board and the ticket machine

/** The board: a box on two little brackets, "SIRA" over its window (the number is a piece). */
function board(): string {
  const w = BOARD_W;
  const h = BOARD_H;
  let s = '';
  for (const x of [-w / 2 + 12, w / 2 - 12]) s += comic(rrect(x - 2, -6, 4, 7, 1), C.pole, { line: LINE.fine });
  const label = ink(word('SIRA', 0, -h + 10, 7), 1.4, C.boardLabel);
  const face = comic(rrect(-w / 2 + 7, -h + 16, w - 14, h - 22, 2), C.boardFace, { line: LINE.detail, ink: darkOf(C.board, 0.4), rim: [-1.2, 1] });
  s += comic(rrect(-w / 2, -h - 1, w, h - 4, 4), C.board, { line: LINE.small, rim: [2.6, -1.2], glint: [-0.8, 0.8], over: label + face });
  return s;
}

/** A number in glowing segments-ish strokes. */
function digits(n: string): string {
  const d = word(n, 0, 0, 15);
  return glowDisc(0, 0, 20, C.led, 0.35) + ink(d, 3.4, C.led) + ink(d, 1.4, C.ledHot);
}

function dot(): string {
  return glowDisc(0, 0, 5, C.dot, 0.9) + fillP(circleP(0, 0, 1.8), '#ffe0e0');
}

/** The ticket machine: a coral box on a pole, its button, its slot. */
function machine(): string {
  let s = comic(ellipsePath(0, -2, 17, 4.5), darkOf(C.pole, 0.08), { line: LINE.small, rim: [1.6, -0.6] });
  s += comic(rrect(-3.5, -90, 7, 88, 2), C.pole, { line: LINE.small, rim: [1.6, -0.7], glint: [-0.5, 0.5] });
  const head = rrect(-20, -140, 40, 54, 7);
  let over = comic(rrect(-14, -134, 28, 14, 2), C.plate, { line: LINE.detail, over: ink(word('SIRA', 0, -127, 6.4), 1.1, darkOf(C.machine, 0.45)) });
  over += comic(circleP(0, -106, 6.4), C.button, { line: LINE.detail, rim: [1.6, -0.8], glint: [-0.6, 0.6] });
  // The slot along its bottom edge, where the tickets come out.
  over += comic(rrect(-12, SLOT_Y - 2.4, 24, 3.6, 1.8), C.inkDark, { line: LINE.fine });
  s += comic(head, C.machine, { line: LINE.small, rim: [3, -1.3], glint: [-0.9, 0.9], hatch: 2.4, hatchWidth: 0.45, over });
  s += comic(rrect(-21.5, -144, 43, 8, 3), C.machineCap, { line: LINE.detail, rim: [1.2, -0.5] });
  return s;
}

/** His ticket: number 14 (it slides out of the slot). */
function ticket(): string {
  let s = comic(poly([[-8, 0], [8, 0], [8, 22], [5, 24], [2, 22], [-1, 24], [-4, 22], [-8, 24]]), C.ticket, { line: LINE.detail, rim: [1.2, -0.5] });
  s += ink(word('14', 0, 10, 8), 1.4, C.inkDark);
  s += ink('M-5 18.4h10', 0.6, C.noticeLine);
  return s;
}

// ---------------------------------------------------------------- what the draft brings

/** A sheet lying on the floor, seen from above it: squashed, a corner curling. */
function sheet(seed: number, stamped: boolean): string {
  const k = seed % 2 ? 1 : -1;
  const pts: Pt[] = [[-18, -1.5], [16, -3.4], [19, 3.6], [-15, 5]];
  let s = comic(poly(pts), C.paper, { line: LINE.detail, rim: [1, -0.4], tone: C.paperShade });
  for (let i = 0; i < 3; i++) s += ink(`M${-12 + i} ${f(-0.6 + i * 1.6)}l${16 - i * 3} ${f(-0.7)}`, 0.6, C.noticeLine);
  if (stamped) s += `<ellipse cx="${7 * k}" cy="1.6" rx="4" ry="1.5" fill="none" stroke="${C.stamp}" stroke-width="0.9"/>`;
  // The curl.
  s += comic(smooth([[16, -3.4], [19, 3.6], [15, 1.6]], 0.6), C.paperShade, { line: LINE.fine });
  return s;
}

function mat(): string {
  let s = comic('M-28 -3L24 -3L28 3.4L-24 3.4Z', C.mat, { line: LINE.small, rim: [1.6, -0.6] });
  for (let x = -22; x <= 22; x += 5) s += ink(`M${x} -2l1.6 4.6`, 0.6, lightOf(C.mat, 0.25));
  return s;
}

function doorLight(): string {
  return glowDisc(0, 0, 74, '#f7d39a', 0.7) + glowDisc(0, 0, 32, '#ffe6bd', 0.45);
}

function glassLight(): string {
  return glowDisc(0, 0, 34, '#fff0cf', 0.75);
}

function pool(): string {
  return `<g transform="scale(1 0.14)">${glowDisc(0, 0, 120, '#ffe8c4', 0.8)}</g>`;
}

/** The Committee's door in r12. */
export function officeDoor(): DoorArt {
  const parts = [
    doorPart('door.office.post', { x0: -10, y0: -POST_H - 6, x1: 22, y1: 2 }, post(true)),
    doorPart('door.office.post.near', { x0: -10, y0: -POST_H - 6, x1: 10, y1: 2 }, post(false)),
    leafPart('door.office.leaf', LEAF_W, LEAF_H, leafFront()),
    leafPart('door.office.leaf.back', LEAF_W, LEAF_H, leafBack()),
    leafPart('door.office.lintel', LINTEL_W, LINTEL_H, lintel()),
    leafPart('door.office.lintel.back', LINTEL_W, LINTEL_H, lintel()),
    doorPart('door.office.board', { x0: -BOARD_W / 2 - 2, y0: -BOARD_H - 3, x1: BOARD_W / 2 + 2, y1: 2 }, board()),
    doorPart('door.office.n13', { x0: -22, y0: -22, x1: 22, y1: 22 }, digits('13')),
    doorPart('door.office.n14', { x0: -22, y0: -22, x1: 22, y1: 22 }, digits('14')),
    doorPart('door.office.dot', { x0: -6, y0: -6, x1: 6, y1: 6 }, dot()),
    doorPart('door.office.machine', { x0: -24, y0: -147, x1: 24, y1: 4 }, machine()),
    doorPart('door.office.ticket', { x0: -10, y0: -2, x1: 10, y1: 26 }, ticket()),
    doorPart('door.office.sheet0', { x0: -21, y0: -6, x1: 22, y1: 7 }, sheet(0, true)),
    doorPart('door.office.sheet1', { x0: -21, y0: -6, x1: 22, y1: 7 }, sheet(1, false)),
    doorPart('door.office.mat', { x0: -30, y0: -5, x1: 30, y1: 6 }, mat()),
    doorPart('door.office.light', { x0: -76, y0: -76, x1: 76, y1: 76 }, doorLight()),
    doorPart('door.office.glass', { x0: -36, y0: -36, x1: 36, y1: 36 }, glassLight()),
    doorPart('door.office.pool', { x0: -122, y0: -18, x1: 122, y1: 18 }, pool()),
  ];
  // The board's window: where the number shows.
  const nx = 0;
  const ny = BOARD_Y - 17;
  // Sheets blown out under the door as it opens, each at its own depth, sliding toward Gorti.
  const sheets: DoorPiece[] = [
    { key: 'door.office.sheet0', x: 20, y: 2, dz: 6, shut: { alpha: 0, x: 14 }, open: { x: -70, angle: -9 }, lag: 0.25, sway: { x: 1.6, y: -0.6, ms: 1900, byWake: true } },
    { key: 'door.office.sheet1', x: 26, y: 2, dz: 14, shut: { alpha: 0, x: 10 }, open: { x: -44, angle: 7 }, lag: 0.4, sway: { x: -1.4, y: -0.5, ms: 2300, byWake: true } },
    { key: 'door.office.sheet1', x: 16, y: 1, dz: -6, flipX: true, shut: { alpha: 0, x: 18 }, open: { x: -104, angle: 4 }, lag: 0.15, sway: { x: 1.2, ms: 2700, byWake: true } },
  ];
  return {
    parts,
    opening: [],
    frame: [
      { key: 'door.office.post', x: -D, y: 0, dz: -D },
      { key: 'door.office.machine', x: MACHINE_X, y: 0, dz: MACHINE_DZ },
      { key: 'door.office.mat', x: -60, y: 2, dz: -4 },
      { key: 'door.office.board', x: 0, y: BOARD_Y, dz: 0 },
    ],
    inside: [],
    front: [{ key: 'door.office.post.near', x: D, y: 0, dz: D }],
    pieces: [
      // The lamp light of the room with the table, once it opens; while it is shut, a light comes on behind the glass as he comes.
      { key: 'door.office.light', x: 6, y: -110, dz: -12, additive: true, shut: { alpha: 0, sx: 0.6, sy: 0.6 }, open: { alpha: 0.34 }, wake: { alpha: 0.12, sx: 1.08, sy: 1.06 }, sway: { alpha: 0.03, ms: 3100 } },
      { key: 'door.office.pool', x: 0, y: 2, dz: 4, additive: true, shut: { alpha: 0 }, open: { alpha: 0.3 }, wake: { alpha: 0.12 } },
      { key: 'door.office.glass', x: 0, y: -LEAF_H + 58, dz: -1, additive: true, shut: { alpha: 0 }, open: { alpha: 0 }, wake: { alpha: 0.42 }, wakeShut: 'only', sway: { alpha: 0.05, ms: 900, byWake: true } },
      // The board: 13 flips over to 14.
      { key: 'door.office.n13', x: nx, y: ny, dz: 1.5, shut: {}, open: { alpha: -1, sy: 0.15 }, lag: 0.1 },
      { key: 'door.office.n14', x: nx, y: ny, dz: 1.5, shut: { alpha: 0, sy: 0.15 }, open: {}, lag: 0.55, wake: { sx: 1.06, sy: 1.06 } },
      { key: 'door.office.dot', x: BOARD_W / 2 - 7, y: BOARD_Y - BOARD_H + 6, dz: 1.5, additive: true, shut: { alpha: 0.3 }, open: { alpha: 0.5 }, sway: { alpha: 0.45, ms: 700, byWake: true } },
      // His ticket comes out of the machine as he comes near (from behind it, out of its slot), and stays out once his number is called.
      { key: 'door.office.ticket', x: MACHINE_X, y: SLOT_Y - 12, dz: MACHINE_DZ, shut: {}, open: { y: 12 }, wake: { y: 12 }, wakeShut: 'only', sway: { angle: 2.5, ms: 2100, byWake: true } },
      ...sheets,
    ],
    leaves: [
      // It swings all the way round, behind the back post, and leaves the doorway clear.
      { front: 'door.office.leaf', back: 'door.office.leaf.back', hinge: 'left', x: -HINGE, y: -LEAF_H, dz: -HINGE, shutAngle: 45, restAngle: -132, wideAngle: -140, strips: 14 },
      { front: 'door.office.lintel', back: 'door.office.lintel.back', hinge: 'left', x: -LINTEL_AT, y: LINTEL_TOP, dz: -LINTEL_AT, shutAngle: 45, restAngle: 45, wideAngle: 45, strips: 10, still: true },
    ],
    light: { color: 0xffe2b0, radius: 330, intensity: 0.8, y: 120 },
    glow: { color: 0xffe6c0, pool: 0xffead0 },
    sparks: { colors: [0xfff4dc, 0xf3e6cc, 0xffe2b8], frame: 'fx.dot', rate: 0.7, size: 0.3 },
    // (The room's script plays the door itself as it opens it.)
    sounds: { wake: ['click', 0.3, 1.5], open: [['noteHigh', 0.3, 1.0], ['paper', 0.35, 1.0]] },
    openMs: 1300,
  };
}
