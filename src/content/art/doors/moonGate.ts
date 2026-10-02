import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import { Rng, type Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeRing } from './wallArt';
import { at, closed, figure, frameSheet, hillside, passageWall, r2, voussoirs } from './wallKit';
import { crescent, face as faceOf, glowDisc, tuft, twinkle } from './doorKit';

// The hill's way on (r05): at the meadow's end the hill rises, and the
// room's right wall is its flank, a bank of earth under the turf. Into it
// a moon gate is cut, a round-topped opening ringed with old pale stones,
// the Moon herself carved as its keystone, dozing; moonflowers grow in the
// turf over it. Through the ring a path runs under the night toward the
// next wood (r06), between ferns cut from paper, and a moth flutters out
// to look at Gorti. Paper stars hang on threads before the bank.

const C = {
  earth: ['#9a8a7e', '#8d7d73', '#7f7068', '#74655f'],
  turf: '#8fb47a',
  stone: ['#d6d0e2', '#c9c2d8', '#dcd6e8'],
  moon: '#fff1b8',
  night: '#3f4f4a',
  fern: '#6f8f6a',
  path: '#5d6e58',
  wood: '#4e6358',
  glade: '#a9c7c0',
};

const HOLE: Hole = { z0: -282, z1: -2, spring: 76, rise: 110 };

/** How deep the ring of stones is beside the far jamb (18 px of bank are left there before the back corner). */
const FAR = 0.5;

function face(): FaceArt {
  const f = { u0: -300, u1: 170, h: 560 };
  const h = HOLE;
  const P = (u: number, v: number): Pt => at(f, u, v);
  let s = hillside(f, { earth: C.earth, turf: C.turf, flowers: ['#f2ecff', '#fff3b0', '#f7c6d9'], seed: 31 });
  // The ring of old stones round the gate (slimmer beside the far jamb, in the corner).
  s += voussoirs(h, f, 30, C.stone, 32, FAR);
  // The Moon as its keystone, dozing.
  {
    const [x, y] = P((h.z0 + h.z1) / 2, h.spring + h.rise + 26);
    s += glowDisc(x, y, 40, '#fff6d0', 0.45);
    s += comic(`M${r2(x - 24)} ${r2(y + 22)}L${r2(x - 28)} ${r2(y - 24)}L${r2(x + 28)} ${r2(y - 24)}L${r2(x + 24)} ${r2(y + 22)}Z`, '#e4def0', { line: LINE.small, rim: [2.6, -1.6], glint: [-1, 1] });
    s += comic(crescent(x + 2, y - 1, 17, 1.28, true), C.moon, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8] });
    s += faceOf(x + 12, y + 1, 8, '#8a7a4a', false, { cheeks: '#f5b6c0', mouth: 'smile' });
  }
  // Moonflowers in the turf over the gate: white trumpets on twining stems.
  const rng = new Rng(8);
  for (let i = 0; i < 9; i++) {
    const u = h.z0 + 8 + i * 33 + rng.range(-6, 6);
    const v = 330 + rng.range(-20, 40);
    const [x, y] = P(u, v);
    s += ink(`M${r2(x)} ${r2(y)}q${r2(rng.range(-8, 8))} ${r2(14)} ${r2(rng.range(-4, 4))} ${r2(28)}`, 1.2, darkOf(C.turf, 0.35));
    s += comic(`M${r2(x)} ${r2(y)}l-7 -9q7 -5 14 0Z`, '#f6f2ff', { line: LINE.fine, rim: [1, -0.6], glint: [-0.6, 0.6] });
    s += `<circle cx="${r2(x)}" cy="${r2(y - 7)}" r="1.8" fill="#fff3b0"/>`;
  }
  // Roots and stones in the bank by the gate, grass at its foot.
  for (const u of [-291, 6, 60, 120, 150]) s += tuft(...P(u, 2), 14, '#86ab72', u);
  s += twinkle(...P(-30, 240), 4, '#fff7d6', 0.5) + twinkle(...P(-290, 252), 3, '#fff7d6', 0.5) + twinkle(...P(-214, 268), 3.4, '#fff7d6', 0.5);
  return { ...f, body: s };
}

/** The far end of the path: the next wood under the night. */
function far(): FaceArt {
  const L = 240;
  const H = 230;
  let s = `<rect x="0" y="0" width="${L}" height="${H}" fill="${C.wood}"/>`;
  s += glowDisc(L * 0.6, H * 0.35, 90, C.glade, 0.55);
  // Trunks of the next wood, a pink one among the stone-grey.
  for (const [x, w, c] of [[30, 22, '#8f8aa0'], [96, 30, '#c9a1bd'], [170, 20, '#8f8aa0'], [214, 26, '#7d7890']] as const) s += comic(`M${x - w / 2} ${H}L${x - w * 0.4} 0L${x + w * 0.4} 0L${x + w / 2} ${H}Z`, c, { line: LINE.small, rim: [w * 0.18, -1], glint: [-1, 1] });
  s += `<path d="M0 ${H - 40}Q${L * 0.3} ${H - 58} ${L * 0.6} ${H - 44}T${L} ${H - 50}L${L} ${H}L0 ${H}Z" fill="#5f7a5c" stroke="${lineFor('#5f7a5c')}" stroke-width="1"/>`;
  const rng = new Rng(4);
  for (let i = 0; i < 10; i++) s += `<circle cx="${r2(rng.range(10, L - 10))}" cy="${r2(rng.range(40, H - 30))}" r="2" fill="#fff3a6" opacity="0.9"/>`;
  return passageWall(L, H, C.wood, s);
}

/** Ferns cut from paper standing across the path (a tunnel book's page). */
function ferns(inset: number, fill: string, seed: number): FaceArt {
  const h = HOLE;
  const f = { u0: h.z0 - 2, h: 240 };
  const inner: Hole = { z0: h.z0 + inset, z1: h.z1 - inset, spring: h.spring - inset * 0.6, rise: Math.max(4, h.rise - inset * 0.3) };
  const ring = holeRing(inner, f, 0, 28);
  let fronds = '';
  const rng = new Rng(seed);
  ring.forEach((p, i) => {
    if (i % 2 || i === 0 || i === ring.length - 1) return;
    const len = rng.range(10, 18);
    const ang = Math.atan2(p[1] - (f.h - inner.spring), p[0] - ((inner.z0 + inner.z1) / 2 - f.u0)) + Math.PI;
    const tip: Pt = [p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len];
    fronds += comic(closed([[p[0] - 3, p[1]], tip, [p[0] + 3, p[1]]]), lightOf(fill, 0.1), { line: LINE.fine });
  });
  return frameSheet(h, 240, inset, fill, { over: fronds });
}

function moth(): FaceArt {
  const w = '#efe9ff';
  const body =
    `<g transform="translate(0 -30)">` +
    comic('M0 0Q-22 -22 -30 -6Q-26 10 -4 6Z', w, { line: LINE.small, rim: [2, -1.4], glint: [-1, 1], over: `<circle cx="-16" cy="-4" r="4" fill="#c8b8ea"/>` }) +
    comic('M0 0Q22 -22 30 -6Q26 10 4 6Z', w, { line: LINE.small, rim: [2, -1.4], glint: [-1, 1], over: `<circle cx="16" cy="-4" r="4" fill="#c8b8ea"/>` }) +
    comic('M-4 8Q-18 22 -10 26Q-2 20 -1 10Z', lightOf(w, 0.2), { line: LINE.fine }) +
    comic('M4 8Q18 22 10 26Q2 20 1 10Z', lightOf(w, 0.2), { line: LINE.fine }) +
    comic('M-4 -8Q0 -12 4 -8L3 16Q0 20 -3 16Z', '#b9a8d8', { line: LINE.small, rim: [1.4, -0.8] }) +
    ink('M-2 -10Q-8 -22 -14 -22M2 -10Q8 -22 14 -22', 1, '#7a6a9a') +
    `<circle cx="-2" cy="-6" r="1.4" fill="#2a2430"/><circle cx="2" cy="-6" r="1.4" fill="#2a2430"/>` +
    `</g>`;
  return figure(64, 62, body);
}

export function moonGate(): WallDoorArt {
  return {
    wall: { color: C.turf, edge: '#efe6da' },
    hole: HOLE,
    face: face(),
    leaf: null,
    passage: {
      length: 240,
      reveal: 14,
      floor: C.path,
      wall: C.wood,
      end: C.glade,
      art: far(),
      frames: [
        { x: 24, art: ferns(10, C.fern, 2) },
        { x: 58, art: ferns(22, darkOf(C.fern, 0.12), 5) },
      ],
    },
    peek: { art: moth(), z: -142, hidden: 170, shown: 26 },
    light: { color: '#e6e2ff', radius: 320, intensity: 0.8, y: 100 },
    glow: '#e2ddff',
    sounds: { wake: ['noteHigh', 0.18, 1.5], peek: ['flutter', 0.3, 1.1] },
    life: { kind: 'stars', colors: ['#fff1b8', '#ffe28a', '#fff8e0'], rate: 1 },
    flat: { wall: C.earth[0], hole: C.path, frame: C.stone[0] },
  };
}
