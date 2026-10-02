import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import { Rng, type Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeRing } from './wallArt';
import { archBand, at, bulbs, figure, frameSheet, leafArt, passageWall, r2 } from './wallKit';
import { face as faceOf, glowDisc } from './doorKit';

// The painted day's way on (r08): the stage's right wall is a wing of the
// set, canvas flats painted with the day the room has lost, little suns and
// clouds stencilled over it, the stage's boards at its foot. In it a stage
// door under a marquee of bulbs, the stage's own cut-out sun over it, sad,
// eyes shut. The door is a painted roller cloth (a sunny hill); when the
// room is done it rolls up, and behind it the stage's wings, flats cut out
// as a tree and a border of cardboard clouds, frame the next room's
// clearing, and a sparrow hops out to look at Gorti.

const C = {
  canvas: '#e9d9a8',
  canvasB: '#e2cf98',
  seam: '#c4ad78',
  sun: '#ffd36b',
  cloud: '#f6f1e4',
  board: '#b48f6a',
  boardDeep: '#8f6e52',
  bulb: '#fff3b0',
  sky: '#bfe0f2',
  hill: '#a8d08c',
  flat: '#d8c79e',
  wing: '#cbbd9f',
  day: '#e8f4f8',
};

const HOLE: Hole = { z0: -250, z1: -74, spring: 150, rise: 46 };

/** A little stencilled sun (a disc, rays as ticks). */
function stencilSun(x: number, y: number, r: number, fill: string): string {
  let rays = '';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    rays += `M${r2(x + Math.cos(a) * r * 1.35)} ${r2(y + Math.sin(a) * r * 1.35)}L${r2(x + Math.cos(a) * r * 1.85)} ${r2(y + Math.sin(a) * r * 1.85)}`;
  }
  return ink(rays, 1.3, darkOf(fill, 0.15)) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${fill}" stroke="${lineFor(fill)}" stroke-width="0.7"/>`;
}

function face(): FaceArt {
  const f = { u0: -300, u1: 170, h: 560 };
  const h = HOLE;
  const W = f.u1 - f.u0;
  const P = (u: number, v: number): Pt => at(f, u, v);
  let s = `<rect x="0" y="0" width="${W}" height="${f.h}" fill="${C.canvas}"/>`;
  // The flats, side by side, their seams and battens showing through the canvas.
  for (let x = 0; x < W; x += 118) {
    s += `<rect x="${x}" y="0" width="59" height="${f.h}" fill="${C.canvasB}" opacity="0.5"/>`;
    s += `<path d="M${x} 0L${x} ${f.h}" stroke="${C.seam}" stroke-width="1.6"/>`;
  }
  // The painted day: suns and clouds stencilled in rows.
  const rng = new Rng(12);
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      const x = col * 72 + (row % 2) * 36 + rng.range(-4, 4);
      const y = 40 + row * 64 + rng.range(-3, 3);
      if (row % 2) s += stencilSun(x, y, 7, lightOf(C.sun, 0.25));
      else s += `<path d="M${r2(x - 14)} ${r2(y + 4)}q2 -9 10 -7q4 -8 12 -3q8 -2 8 6q4 3 0 6z" fill="${C.cloud}" stroke="${darkOf(C.cloud, 0.2)}" stroke-width="0.8"/>`;
    }
  }
  // The skirting: the stage's boards turned up against the wall.
  s += comic(`M0 ${f.h - 34}L${W} ${f.h - 34}L${W} ${f.h + 2}L0 ${f.h + 2}Z`, C.board, { line: LINE.small, rim: [2, -1], glint: [-1, 1], over: Array.from({ length: Math.ceil(W / 60) }, (_, i) => `<path d="M${i * 60 + 20} ${f.h - 34}L${i * 60 + 20} ${f.h}" stroke="${C.boardDeep}" stroke-width="1"/>`).join('') });
  // The door's frame, painted gold, a marquee of bulbs round it.
  s += archBand(h, f, 0, 18, '#e8b858');
  s += bulbs(h, f, 9, 18, C.bulb);
  // The stage's cut-out sun over the door: sad, eyes shut, a tear.
  {
    const [x, y] = P((h.z0 + h.z1) / 2, h.spring + h.rise + 70);
    s += glowDisc(x, y, 56, '#fff0b0', 0.45);
    let rays = '';
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6 + 0.13;
      rays += `M${r2(x + Math.cos(a - 0.12) * 26)} ${r2(y + Math.sin(a - 0.12) * 26)}L${r2(x + Math.cos(a) * 40)} ${r2(y + Math.sin(a) * 40)}L${r2(x + Math.cos(a + 0.12) * 26)} ${r2(y + Math.sin(a + 0.12) * 26)}`;
    }
    s += comic(rays + 'Z', '#f6c75a', { line: LINE.small, rim: [1.4, -1] });
    s += comic(`M${r2(x - 27)} ${r2(y)}a27 27 0 1 0 54 0a27 27 0 1 0 -54 0Z`, C.sun, { line: LINE.small, rim: [3.4, -2], glint: [-1.4, 1.4] });
    s += faceOf(x, y, 18, '#9a6a3a', false, { cheeks: '#f5a6a0', mouth: 'none' });
    s += ink(`M${r2(x - 6)} ${r2(y + 9)}Q${r2(x)} ${r2(y + 5)} ${r2(x + 6)} ${r2(y + 9)}`, 1.2, '#9a6a3a');
    s += comic(`M${r2(x + 9)} ${r2(y + 4)}q-2.6 5 0 7q2.6 -2 0 -7Z`, '#bfe6f8', { line: LINE.fine });
    // The stick it hangs on.
    s += ink(`M${r2(x)} ${r2(y - 40)}L${r2(x)} -4`, 2.2, '#8f6e52');
  }
  return { ...f, body: s };
}

/** The roller cloth: a sunny hill painted on canvas (it rolls up from its foot). */
function cloth(): FaceArt {
  const h = HOLE;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  let body = `<rect x="0" y="0" width="${r2(W)}" height="${r2(H)}" fill="${C.sky}"/>`;
  body += glowDisc(W * 0.66, H * 0.3, 60, '#fff6c8', 0.7);
  body += `<circle cx="${r2(W * 0.66)}" cy="${r2(H * 0.3)}" r="22" fill="${C.sun}" stroke="${lineFor(C.sun)}" stroke-width="1"/>`;
  body += faceOf(W * 0.66, H * 0.3, 14, '#9a6a3a', false, { cheeks: '#f5a6a0', mouth: 'smile' });
  body += `<path d="M0 ${r2(H * 0.62)}Q${r2(W * 0.3)} ${r2(H * 0.5)} ${r2(W * 0.55)} ${r2(H * 0.62)}T${r2(W)} ${r2(H * 0.58)}L${r2(W)} ${r2(H)}L0 ${r2(H)}Z" fill="${C.hill}" stroke="${lineFor(C.hill)}" stroke-width="1"/>`;
  body += `<path d="M0 ${r2(H * 0.78)}Q${r2(W * 0.4)} ${r2(H * 0.68)} ${r2(W)} ${r2(H * 0.8)}L${r2(W)} ${r2(H)}L0 ${r2(H)}Z" fill="${darkOf(C.hill, 0.08)}"/>`;
  for (const [x, y] of [[30, 30], [70, 50], [120, 24]] as const) body += `<path d="M${x - 14} ${y + 4}q2 -9 10 -7q4 -8 12 -3q8 -2 8 6q4 3 0 6z" fill="${C.cloud}" stroke="${darkOf(C.cloud, 0.2)}" stroke-width="0.8"/>`;
  // The canvas's hem and its pull ring at the foot.
  body += `<rect x="0" y="${r2(H - 8)}" width="${r2(W)}" height="8" fill="${C.board}"/>`;
  body += `<circle cx="${r2(W / 2)}" cy="${r2(H - 14)}" r="5" fill="none" stroke="#c9a04a" stroke-width="2"/>`;
  return leafArt(h, C.sky, body);
}

/** The next room's clearing, at the end of the wings. */
function far(): FaceArt {
  const L = 240;
  const H = 230;
  let s = `<rect x="0" y="0" width="${L}" height="${H}" fill="#a9c9d6"/>`;
  s += glowDisc(L * 0.5, H * 0.3, 80, '#ffffff', 0.5);
  s += `<path d="M0 ${H - 70}Q${L * 0.35} ${H - 96} ${L * 0.7} ${H - 74}T${L} ${H - 80}L${L} ${H}L0 ${H}Z" fill="#bddaac" stroke="${lineFor('#bddaac')}" stroke-width="1"/>`;
  for (const [x, y, r] of [[60, 120, 14], [150, 108, 18], [200, 130, 12]] as const) s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#9cc48a" stroke="${lineFor('#9cc48a')}" stroke-width="1"/><path d="M${x} ${y + r}L${x} ${y + r + 16}" stroke="#8a6f5a" stroke-width="3"/>`;
  return passageWall(L, H, C.wing, s);
}

/** A flat of the wings cut out as a tree and a bush (round its opening). */
function treeFlat(inset: number): FaceArt {
  const h = HOLE;
  const f = { u0: h.z0 - 2, h: 260 };
  const inner: Hole = { z0: h.z0 + inset, z1: h.z1 - inset, spring: h.spring - inset * 0.6, rise: Math.max(4, h.rise - inset * 0.3) };
  const ring = holeRing(inner, f, 0, 30);
  let leaves = '';
  ring.forEach((p, i) => {
    if (i % 3 || i === 0 || i === ring.length - 1) return;
    leaves += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="9" fill="#9cc48a" stroke="${lineFor('#9cc48a')}" stroke-width="0.8"/>`;
  });
  return frameSheet(h, 260, inset, '#8fb87d', { over: leaves });
}

/** A border of cardboard clouds across the wings (only its scalloped foot hangs into the opening). */
function cloudBorder(inset: number): FaceArt {
  const h = HOLE;
  const f = { u0: h.z0 - 2, h: 260 };
  const inner: Hole = { z0: h.z0 + inset, z1: h.z1 - inset, spring: h.spring - inset * 0.6, rise: Math.max(4, h.rise - inset * 0.3) };
  const ring = holeRing(inner, f, 0, 30);
  let puffs = '';
  ring.forEach((p, i) => {
    if (i % 2 || f.h - p[1] < inner.spring - 10) return;
    puffs += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="12" fill="${C.cloud}" stroke="${lineFor(C.cloud)}" stroke-width="0.8"/>`;
  });
  return frameSheet(h, 260, inset, '#e9e4d8', { over: puffs });
}

function sparrow(): FaceArt {
  const b = '#c9926a';
  const body =
    `<g transform="translate(0 -20)">` +
    ink('M-14 20L-14 24M-6 20L-6 24', 1.4, '#8a5a3a') +
    comic('M-26 4Q-30 -12 -12 -16Q4 -18 10 -6Q16 6 4 14Q-14 20 -26 4Z', b, { line: LINE.small, rim: [2.2, -1.2], glint: [-1, 1], over: `<path d="M-20 4Q-8 12 4 6" fill="none" stroke="#f3dcc0" stroke-width="5" stroke-linecap="round"/>` }) +
    comic('M-12 -16Q-6 -28 6 -24Q14 -18 10 -6Q0 -10 -12 -16Z', '#a87454', { line: LINE.small, rim: [1.4, -1] }) +
    comic('M10 -12L20 -10L10 -6Z', '#f4c46a', { line: LINE.fine }) +
    comic('M-26 2L-40 -6L-36 6Z', '#8f6448', { line: LINE.fine }) +
    `<circle cx="3" cy="-14" r="2.2" fill="#2a2430"/><circle cx="3.6" cy="-14.8" r="0.7" fill="#fff"/>` +
    `</g>`;
  return figure(80, 48, body);
}

export function sunDoor(): WallDoorArt {
  return {
    wall: { color: C.canvas, edge: '#f6ecd2' },
    hole: HOLE,
    face: face(),
    leaf: { kind: 'roll', color: C.sky, back: '#e8d8b8', art: cloth(), shut: 0, open: 1 },
    passage: {
      length: 240,
      reveal: 14,
      floor: C.board,
      wall: C.wing,
      end: C.day,
      art: far(),
      frames: [
        { x: 24, art: treeFlat(10) },
        { x: 58, art: cloudBorder(18) },
      ],
    },
    peek: { art: sparrow(), z: -160, hidden: 150, shown: 30 },
    light: { color: '#ffe6a8', radius: 340, intensity: 0.95, y: 110 },
    glow: '#fff0c0',
    sounds: { wake: ['ray', 0.25, 1.2], peek: ['chirp', 0.35, 1.3], open: [['sunhit', 0.5, 1.2], ['paper', 0.4, 0.9]], shut: ['paper', 0.35, 0.8] },
    openMs: 1500,
    life: { kind: 'confetti', colors: ['#ffd36b', '#f7a8c4', '#a8d8f0', '#c8e6a0'], rate: 1.4 },
    flat: { wall: C.canvas, hole: C.board, frame: '#e8b858' },
  };
}
