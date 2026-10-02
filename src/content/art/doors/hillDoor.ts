import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import { Rng, type Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeRing } from './wallArt';
import { archBand, at, figure, frameSheet, hillside, leafArt, passageWall, r2 } from './wallKit';
import { barkRoot, crescent, face as faceOf, glowDisc, tuft, twinkle } from './doorKit';

// b02's way on, at the far end of "Ay Kapısı": the room's right wall is the
// grassy hill's flank, and a door is cut into it, shut by a great wheel
// painted half day and half night like a playing card: the Sun over a green
// hill on its upper half and, upside down below, the Moon over a blue one,
// and a card's corner marks on the planks round it.
// Once Gorti has been through the Moon's gate, the wheel rolls aside along
// its groove into the hill. Through the tunnel: the next room's clearing at
// dusk, its toy blocks and its blue crystal; a mole looks out at Gorti.

const C = {
  earth: ['#b39a7e', '#a68d73', '#987f68', '#8b735e'],
  turf: '#9cbf7f',
  rim: '#c9a46a',
  rimDeep: '#a8844e',
  day: '#bfe0f2',
  night: '#4f5584',
  sun: '#ffd36b',
  moon: '#fff1b8',
  hill: '#a8d08c',
  hillNight: '#7d8fc8',
  tunnel: '#a99a86',
  floor: '#a8c49a',
  dusk: '#dfeef5',
};

const HOLE: Hole = { z0: -282, z1: -2, spring: 96, rise: 104 };

/** How much of the timber frame goes on beside the far jamb (18 px of bank are left there before the back corner). */
const FAR = 0.7;

function face(): FaceArt {
  const f = { u0: -300, u1: 170, h: 560 };
  const h = HOLE;
  const P = (u: number, v: number): Pt => at(f, u, v);
  let s = hillside(f, { earth: C.earth, turf: C.turf, flowers: ['#f7c6d9', '#fff3b0', '#ffffff'], seed: 57 });
  // The wheel's groove: a timber frame round the door, its sill running on into the hill (into the back corner).
  s += archBand(h, f, 0, 14, C.rim, { far: FAR });
  s += comic(`M${r2(P(-300, 0)[0])} ${r2(P(0, 10)[1])}L${r2(P(h.z1 + 14, 0)[0])} ${r2(P(0, 10)[1])}L${r2(P(h.z1 + 14, 0)[0])} ${f.h + 2}L${r2(P(-300, 0)[0])} ${f.h + 2}Z`, C.rimDeep, { line: LINE.small, rim: [1.6, -0.8] });
  // Roots through the bank over the door, grass at its foot.
  s += barkRoot([P(-298, 304), P(-262, 274), P(-226, 254)], 6, 2, '#8a6f5a', 3);
  s += barkRoot([P(-4, 300), P(-36, 266), P(-74, 244)], 5, 2, '#8a6f5a', 7);
  for (const u of [-291, 10, 60, 120]) s += tuft(...P(u, 2), 14, '#8fb07a', u);
  // A little lamp hung on a hook over the door's near shoulder.
  {
    const [x, y] = P(-30, 214);
    s += ink(`M${r2(x)} ${r2(y - 30)}l0 -10l-8 0`, 1.6, '#6a5a4a');
    s += glowDisc(x, y, 26, '#fff3b0', 0.55);
    s += comic(`M${r2(x - 8)} ${r2(y - 22)}L${r2(x + 8)} ${r2(y - 22)}L${r2(x + 10)} ${r2(y + 10)}L${r2(x - 10)} ${r2(y + 10)}Z`, '#fff6d0', { line: LINE.small, rim: [1.6, -0.8], glint: [-0.8, 0.8] });
    s += `<rect x="${r2(x - 10)}" y="${r2(y - 28)}" width="20" height="6" rx="2" fill="#6a5a4a"/>`;
  }
  return { ...f, body: s };
}

/** The wheel: day over night like a playing card (it slides into the hill). */
function wheel(): FaceArt {
  const h = HOLE;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  const cx = W / 2;
  const cy = H - (h.spring + h.rise) / 2 - 4;
  const r = Math.min(W, H) / 2 - 8;
  let body = `<rect x="0" y="0" width="${r2(W)}" height="${r2(H)}" fill="${C.rim}"/>`;
  // Planks behind the wheel (about as wide as ever: more of them), their grain and nails.
  const n = Math.round(W / 28);
  const pw = W / n;
  for (let i = 0; i < n; i++) {
    const x = i * pw;
    if (i > 0) body += `<path d="M${r2(x)} 0L${r2(x)} ${r2(H)}" stroke="${C.rimDeep}" stroke-width="1"/>`;
    body += `<path d="M${r2(x + pw * 0.45)} ${r2(H * 0.08)}Q${r2(x + pw * 0.6)} ${r2(H * 0.5)} ${r2(x + pw * 0.4)} ${r2(H * 0.95)}" fill="none" stroke="${darkOf(C.rim, 0.1)}" stroke-width="0.8"/>`;
    for (const v of [12, 176]) body += `<circle cx="${r2(x + pw / 2)}" cy="${r2(H - v)}" r="1.5" fill="${darkOf(C.rim, 0.35)}"/>`;
  }
  // A playing card's corner marks: a little sun up by the far jamb, a little moon upside down by the near one.
  body += `<circle cx="${r2(pw * 0.9)}" cy="${r2(H - 128)}" r="6.4" fill="${C.sun}" stroke="${lineFor(C.sun)}" stroke-width="0.9"/>` + ink(Array.from({ length: 8 }, (_, k) => { const a = (k * Math.PI) / 4; return `M${r2(pw * 0.9 + Math.cos(a) * 8.4)} ${r2(H - 128 + Math.sin(a) * 8.4)}L${r2(pw * 0.9 + Math.cos(a) * 11)} ${r2(H - 128 + Math.sin(a) * 11)}`; }).join(''), 1.2, darkOf(C.sun, 0.2));
  body += `<g transform="rotate(180 ${r2(W - pw * 0.9)} ${r2(H - 40)})">` + comic(crescent(W - pw * 0.9, H - 40, 8, 1.3, true), C.moon, { line: LINE.fine, rim: [1, -0.6] }) + `</g>`;
  const id = 'hw';
  body += `<clipPath id="${id}"><circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}"/></clipPath><g clip-path="url(#${id})">`;
  body += `<rect x="0" y="0" width="${r2(W)}" height="${r2(cy)}" fill="${C.day}"/>`;
  body += `<rect x="0" y="${r2(cy)}" width="${r2(W)}" height="${r2(H)}" fill="${C.night}"/>`;
  body += `<path d="M0 ${r2(cy)}Q${r2(cx)} ${r2(cy - 30)} ${r2(W)} ${r2(cy)}Z" fill="${C.hill}" stroke="${lineFor(C.hill)}" stroke-width="1"/>`;
  body += `<path d="M0 ${r2(cy)}Q${r2(cx)} ${r2(cy + 30)} ${r2(W)} ${r2(cy)}Z" fill="${C.hillNight}" stroke="${lineFor(C.hillNight)}" stroke-width="1"/>`;
  body += glowDisc(cx + 16, cy - 46, 26, '#fff6c8', 0.7) + `<circle cx="${r2(cx + 16)}" cy="${r2(cy - 46)}" r="13" fill="${C.sun}" stroke="${lineFor(C.sun)}" stroke-width="1"/>` + faceOf(cx + 16, cy - 46, 8, '#9a6a3a', false, { mouth: 'smile' });
  body += comic(crescent(cx - 16, cy + 46, 13, 1.3, true), C.moon, { line: LINE.small, rim: [1.4, -0.8] });
  const rng = new Rng(2);
  for (let i = 0; i < 6; i++) body += twinkle(rng.range(cx - r * 0.7, cx + r * 0.7), rng.range(cy + 20, cy + r * 0.8), 2.6, '#fff7d6', 0.4);
  body += `</g>`;
  body += `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="none" stroke="${C.rimDeep}" stroke-width="5"/>`;
  body += `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r - 5)}" fill="none" stroke="${lightOf(C.rim, 0.4)}" stroke-width="1.4"/>`;
  return leafArt(h, C.rim, body);
}

function far(): FaceArt {
  const L = 230;
  const H = 230;
  let s = `<rect x="0" y="0" width="${L}" height="${H}" fill="#c8d6e8"/>`;
  s += `<rect x="0" y="0" width="${L}" height="${H * 0.45}" fill="#e8c8d8" opacity="0.6"/>`;
  s += `<path d="M0 ${H - 60}Q${L * 0.5} ${H - 84} ${L} ${H - 64}L${L} ${H}L0 ${H}Z" fill="#bddaac" stroke="${lineFor('#bddaac')}" stroke-width="1"/>`;
  // Toy blocks and the blue crystal of the next room.
  for (const [x, y, c] of [[40, H - 76, '#f2c46b'], [62, H - 76, '#f7a8c4'], [51, H - 98, '#8fc4e8']] as const) s += comic(`M${x - 10} ${y}L${x + 10} ${y}L${x + 10} ${y + 20}L${x - 10} ${y + 20}Z`, c, { line: LINE.fine, rim: [1.4, -0.8] });
  s += glowDisc(160, H - 90, 30, '#b5d2f2', 0.6) + comic(`M150 ${H - 66}L156 ${H - 110}L164 ${H - 116}L172 ${H - 70}Z`, '#b5d2f2', { line: LINE.fine, rim: [1.6, -0.8], glint: [-0.6, 0.6] });
  return passageWall(L, H, C.tunnel, s);
}

/** A ring of the hill's earth across the tunnel, roots and grass on its cut edge. */
function earthRing(inset: number, fill: string, seed: number): FaceArt {
  const h = HOLE;
  const f = { u0: h.z0 - 2, h: 240 };
  const inner: Hole = { z0: h.z0 + inset, z1: h.z1 - inset, spring: h.spring - inset * 0.6, rise: Math.max(4, h.rise - inset * 0.3) };
  // As many roots and blades as the arch is long (about one every 11 px).
  const ring = holeRing(inner, f, 0, Math.round((inner.z1 - inner.z0) / 5.5));
  let fringe = '';
  const rng = new Rng(seed);
  ring.forEach((p, i) => {
    if (i % 2 || i === 0 || i === ring.length - 1) return;
    fringe += ink(`M${r2(p[0])} ${r2(p[1])}q${r2(rng.range(-3, 3))} ${r2(rng.range(4, 9))} ${r2(rng.range(-2, 2))} ${r2(rng.range(8, 14))}`, 1.4, darkOf(fill, 0.3));
  });
  return frameSheet(h, 240, inset, fill, { over: fringe });
}

function mole(): FaceArt {
  const fur = '#8a7a8e';
  const body =
    `<g transform="translate(0 -26)">` +
    comic('M-20 26Q-24 -6 0 -8Q24 -6 20 26Z', fur, { line: LINE.small, rim: [2.4, -1.4], glint: [-1, 1] }) +
    comic('M-6 -4Q0 -14 6 -4Q4 4 0 4Q-4 4 -6 -4Z', '#f2a6b6', { line: LINE.fine }) +
    `<path d="M-12 -2Q-9 -6 -6 -2M6 -2Q9 -6 12 -2" fill="none" stroke="#2a2430" stroke-width="1.4" stroke-linecap="round"/>` +
    comic('M-26 16Q-30 8 -22 6Q-16 10 -18 18Z', '#f2c8d0', { line: LINE.fine }) +
    comic('M26 16Q30 8 22 6Q16 10 18 18Z', '#f2c8d0', { line: LINE.fine }) +
    ink('M-8 2L-16 0M-8 4L-16 6M8 2L16 0M8 4L16 6', 0.7, '#5a4a5e') +
    `</g>`;
  return figure(64, 44, body);
}

export function hillDoor(): WallDoorArt {
  return {
    wall: { color: C.turf, edge: '#efe6da' },
    hole: HOLE,
    face: face(),
    leaf: { kind: 'slide', hinge: 'far', color: C.rim, back: C.rimDeep, art: wheel(), shut: 0, open: 1 },
    passage: {
      length: 230,
      reveal: 16,
      floor: C.floor,
      wall: C.tunnel,
      end: C.dusk,
      art: far(),
      frames: [
        { x: 24, art: earthRing(10, '#a08a72', 3) },
        { x: 56, art: earthRing(22, '#8fb07a', 5) },
      ],
    },
    peek: { art: mole(), z: -142, hidden: 170, shown: 22 },
    light: { color: '#fff0c8', radius: 320, intensity: 0.85, y: 90 },
    glow: '#fff0d0',
    sounds: { wake: ['chirp', 0.18, 1.5], peek: ['chirp', 0.28, 1.2], open: [['rumble', 0.35, 1.4], ['noteLow', 0.3, 1.1]], shut: ['rumble', 0.3, 1.2] },
    openMs: 1800,
    life: { kind: 'leaves', colors: ['#a8c890', '#c8d890', '#e0c070'], rate: 1 },
    flat: { wall: C.earth[0], hole: C.floor, frame: C.rim },
  };
}
