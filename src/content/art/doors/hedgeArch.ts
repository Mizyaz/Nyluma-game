import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import { Rng, type Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeRing } from './wallArt';
import { at, closed, figure, frameSheet, hedge, leafArt, passageWall, r2 } from './wallKit';
import { glowDisc } from './doorKit';

// b01's way on, at the far end of "Form Kapısı": the garden's right wall is
// a clipped hedge, and since this garden is all about forms, the hedge is
// clipped into one over the arch: a topiary bunny, two clipped balls on the
// arch's shoulders, roses climbing up from the far jamb's foot and over it.
// A little picket gate shuts the arch until Gorti has been through the
// form door; then it swings open. Through the arch a path runs between
// hedges, under arches of hedge, toward the next room's sunny hill, and a
// rabbit hops out to look at Gorti.

const C = {
  leaf: ['#7c9a7a', '#6d8a6c', '#8aa688', '#76946f'],
  deep: '#3e5248',
  picket: '#f4efe4',
  path: '#c9b8a0',
  hedge: '#6f8f6a',
  day: '#f6efd0',
  rose: '#f7a8c4',
};

const HOLE: Hole = { z0: -282, z1: -2, spring: 104, rise: 96 };

function face(): FaceArt {
  const f = { u0: -300, u1: 170, h: 560 };
  const h = HOLE;
  const P = (u: number, v: number): Pt => at(f, u, v);
  let s = hedge(f, { leaf: C.leaf, deep: C.deep, flowers: [C.rose, '#fff3b0', '#ffd0e0'], seed: 41 });
  // The arch clipped deep into the hedge: a shaded rim round the opening.
  s += `<path d="${closed(holeRing(h, f, 6, 40))}" fill="none" stroke="${darkOf(C.deep, 0.1)}" stroke-width="12" opacity="0.55"/>`;
  // The topiary bunny over the arch, clipped from the hedge, ears up.
  {
    const [x, y] = P((h.z0 + h.z1) / 2, h.spring + h.rise + 70);
    const leafy = (d: string, fill: string): string => comic(d, fill, { line: LINE.small, rim: [4, -2], glint: [-1.4, 1.4], hatch: 2.6, hatchWidth: 0.5, over: Array.from({ length: 14 }, (_, i) => `<path d="M${r2(x - 40 + (i % 5) * 20)} ${r2(y - 50 + Math.floor(i / 5) * 26)}q4 -5 8 0" fill="none" stroke="${darkOf(fill, 0.18)}" stroke-width="1.2"/>`).join('') });
    s += leafy(`M${r2(x - 44)} ${r2(y + 30)}Q${r2(x - 50)} ${r2(y - 20)} ${r2(x - 6)} ${r2(y - 22)}Q${r2(x + 40)} ${r2(y - 22)} ${r2(x + 42)} ${r2(y + 30)}Z`, '#86a884');
    s += leafy(`M${r2(x + 8)} ${r2(y - 14)}a24 22 0 1 0 0.01 0Z`, '#8fb08c');
    s += leafy(`M${r2(x + 6)} ${r2(y - 40)}Q${r2(x - 4)} ${r2(y - 88)} ${r2(x + 6)} ${r2(y - 92)}Q${r2(x + 16)} ${r2(y - 86)} ${r2(x + 14)} ${r2(y - 40)}Z`, '#8fb08c');
    s += leafy(`M${r2(x + 20)} ${r2(y - 38)}Q${r2(x + 26)} ${r2(y - 86)} ${r2(x + 36)} ${r2(y - 86)}Q${r2(x + 42)} ${r2(y - 78)} ${r2(x + 28)} ${r2(y - 36)}Z`, '#86a884');
    s += `<circle cx="${r2(x + 22)}" cy="${r2(y - 22)}" r="2.6" fill="${C.deep}"/>`;
    s += `<circle cx="${r2(x - 44)}" cy="${r2(y + 10)}" r="9" fill="#9cba98" stroke="${lineFor('#9cba98')}" stroke-width="1"/>`;
  }
  // Two balls clipped on the arch's shoulders, each on its little plinth of hedge.
  for (const [u, v, r] of [[-262, 222, 15], [-30, 224, 14]] as const) {
    const [x, y] = P(u, v);
    s += comic(`M${r2(x - r * 0.7)} ${r2(y + r * 1.25)}L${r2(x + r * 0.7)} ${r2(y + r * 1.25)}L${r2(x + r * 0.5)} ${r2(y + r * 0.7)}L${r2(x - r * 0.5)} ${r2(y + r * 0.7)}Z`, '#76946f', { line: LINE.fine, rim: [1.4, -0.8] });
    s += comic(`M${r2(x - r)} ${r2(y)}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0Z`, '#8fb08c', {
      line: LINE.small,
      rim: [r * 0.24, -r * 0.12],
      glint: [-1, 1],
      hatch: 2.6,
      hatchWidth: 0.5,
      over: [[-0.55, -0.2, 1], [-0.1, -0.6, -1], [0.3, -0.15, 1], [-0.3, 0.35, -1], [0.45, 0.4, 1]].map(([dx, dy, k]) => `<path d="M${r2(x + dx! * r)} ${r2(y + dy! * r)}l${r2(k! * 2.4)} -3.6" fill="none" stroke="${darkOf('#8fb08c', 0.2)}" stroke-width="1.1" stroke-linecap="round"/>`).join(''),
    });
  }
  // Roses climbing up from the far jamb's foot and on over the arch, about one every 30 px.
  const rng = new Rng(6);
  const climb = holeRing(h, f, 13, 90, 0.7);
  let acc = 30;
  for (let i = 1; i < climb.length; i++) {
    const [ax, ay] = climb[i - 1]!;
    const [bx, by] = climb[i]!;
    acc += Math.hypot(bx - ax, by - ay);
    if (acc < 30 || f.h - by < 16) continue;
    acc = rng.range(-4, 4);
    const x = bx + (i < 4 ? 0 : rng.range(-3, 3));
    const y = by + rng.range(-3, 3);
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      s += `<circle cx="${r2(x + Math.cos(a) * 3.6)}" cy="${r2(y + Math.sin(a) * 3.6)}" r="3.4" fill="${C.rose}" stroke="${lineFor(C.rose)}" stroke-width="0.6"/>`;
    }
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="2.4" fill="${darkOf(C.rose, 0.15)}"/>`;
  }
  return { ...f, body: s };
}

/** The picket gate (only its pickets and rails: the path shows between them). */
function gate(): FaceArt {
  const h = HOLE;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  let body = '';
  for (const v of [26, 84]) body += comic(`M-2 ${r2(H - v - 5)}L${r2(W + 2)} ${r2(H - v - 5)}L${r2(W + 2)} ${r2(H - v + 5)}L-2 ${r2(H - v + 5)}Z`, C.picket, { line: LINE.small, rim: [1.6, -0.8], glint: [-0.6, 0.6] });
  // Pickets as far apart as ever: more of them across the wider arch.
  const n = Math.round((W - 16) / 19.5) + 1;
  for (let i = 0; i < n; i++) {
    const x = 8 + (i * (W - 16)) / (n - 1);
    const top = H - 110 - (i % 2) * 8;
    body += comic(closed([[x - 6, H + 2], [x - 6, top + 7], [x, top], [x + 6, top + 7], [x + 6, H + 2]]), C.picket, { line: LINE.small, rim: [2, -0.6], glint: [-0.8, 0.8] });
  }
  return leafArt(h, C.picket, body, { bare: true });
}

/** The far end of the path: the next room's hill under the sun. */
function far(): FaceArt {
  const L = 310;
  const H = 230;
  let s = `<rect x="0" y="0" width="${L}" height="${H}" fill="#cfe3ea"/>`;
  s += glowDisc(230, 60, 50, '#fff6c8', 0.8) + `<circle cx="230" cy="60" r="16" fill="#ffd36b" stroke="${lineFor('#ffd36b')}" stroke-width="1"/>`;
  s += `<path d="M0 ${H - 60}Q${L * 0.4} ${H - 120} ${L} ${H - 70}L${L} ${H}L0 ${H}Z" fill="#b8d49a" stroke="${lineFor('#b8d49a')}" stroke-width="1"/>`;
  for (const [x, y, k] of [[96, 96, 1], [176, 104, 0.8]] as const) s += `<path d="M${x} ${H - y}l${6 * k} ${-22 * k}l${6 * k} ${22 * k}z" fill="#a6dcd5" stroke="${lineFor('#a6dcd5')}" stroke-width="0.8"/>`;
  return passageWall(L, H, C.hedge, s);
}

/** An arch of hedge across the path. */
function hedgeFrame(inset: number, seed: number): FaceArt {
  const h = HOLE;
  const over = hedge({ u0: h.z0 - 2, u1: h.z1 + 2, h: 250 }, { leaf: C.leaf.map((c) => lightOf(c, 0.04 * seed)), deep: C.deep, flowers: [C.rose], seed });
  return frameSheet(h, 250, inset, C.hedge, { over });
}

function rabbit(): FaceArt {
  const fur = '#f2ece4';
  const body =
    `<g transform="translate(0 -30)">` +
    comic('M-16 30Q-22 4 0 0Q20 4 16 30Z', fur, { line: LINE.small, rim: [2, -1.4], glint: [-1, 1] }) +
    comic('M-14 -4Q-16 -24 0 -24Q16 -24 14 -4Q10 6 0 6Q-10 6 -14 -4Z', fur, { line: LINE.small, rim: [2, -1.4], glint: [-1, 1] }) +
    comic('M-8 -20Q-14 -50 -6 -54Q2 -50 -2 -22Z', fur, { line: LINE.small, rim: [1.4, -1], over: `<path d="M-7 -24Q-10 -44 -6 -48" stroke="#f5b6c8" stroke-width="3" fill="none" stroke-linecap="round"/>` }) +
    comic('M2 -22Q4 -50 12 -52Q18 -46 6 -20Z', fur, { line: LINE.small, rim: [1.4, -1], over: `<path d="M5 -24Q7 -42 11 -46" stroke="#f5b6c8" stroke-width="3" fill="none" stroke-linecap="round"/>` }) +
    `<circle cx="-5" cy="-12" r="2.4" fill="#2a2430"/><circle cx="6" cy="-12" r="2.4" fill="#2a2430"/><circle cx="-4.4" cy="-12.8" r="0.8" fill="#fff"/><circle cx="6.6" cy="-12.8" r="0.8" fill="#fff"/>` +
    `<ellipse cx="0.5" cy="-6" rx="2.2" ry="1.6" fill="#f08aa6"/>` +
    ink('M0.5 -4.4L0.5 -2M-3 -1Q0.5 1 4 -1', 0.9, '#9a7a7a') +
    `<circle cx="-11" cy="-6" r="2.4" fill="#f5b6c8" opacity="0.6"/><circle cx="12" cy="-6" r="2.4" fill="#f5b6c8" opacity="0.6"/>` +
    `</g>`;
  return figure(48, 86, body);
}

export function hedgeArch(): WallDoorArt {
  return {
    wall: { color: C.leaf[1], edge: '#e8eadf' },
    hole: HOLE,
    face: face(),
    leaf: { kind: 'swing', hinge: 'near', color: C.picket, back: darkOf(C.picket, 0.1), art: gate(), shut: 0, open: 84, wide: 89 },
    passage: {
      length: 310,
      reveal: 18,
      floor: C.path,
      wall: C.hedge,
      end: C.day,
      art: far(),
      frames: [
        { x: 24, art: hedgeFrame(10, 2) },
        { x: 58, art: hedgeFrame(22, 3) },
      ],
    },
    peek: { art: rabbit(), z: -142, hidden: 170, shown: 24 },
    light: { color: '#fff3c8', radius: 320, intensity: 0.85, y: 100 },
    glow: '#fff3d0',
    sounds: { wake: ['chirp', 0.22, 1.5], peek: ['chirp', 0.3, 1.9], open: [['door', 0.35, 1.45], ['bloom', 0.35, 1.1]], shut: ['door', 0.3, 1.2] },
    openMs: 1100,
    life: { kind: 'petals', colors: [C.rose, '#ffd0e0', '#fff3b0'], rate: 1.2 },
    flat: { wall: C.leaf[1], hole: C.path, frame: C.hedge },
  };
}
