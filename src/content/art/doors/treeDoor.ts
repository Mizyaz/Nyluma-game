import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import { smooth, type Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeRing } from './wallArt';
import { archBand, at, closed, figure, frameSheet, hedge, leafArt, passageWall, r2, trunks } from './wallKit';
import { barkRoot, glowDisc, offsetLine, tuft } from './doorKit';

// The far end of the surface (r04) is a wall of old trees standing trunk to
// trunk, their crowns meeting overhead. The widest of them is two trunks
// grown together at the foot, and in that foot a round green door is cut,
// with a carved frame, a firefly jar on a hook over its near shoulder and a
// root for a doorstep. It opens into the hollow of the tree, its rings
// standing across like the pages of a tunnel book, toward the night of the
// hill beyond (r05); a raccoon who lives in there looks out at Gorti.

const C = {
  bark: '#c9a1bd',
  barkB: '#b98faf',
  barkC: '#d4b0c8',
  gap: '#4a4058',
  crown: '#a9cf8f',
  crownB: '#93bf7f',
  crownDeep: '#5f7a58',
  door: '#8fc4ad',
  doorDeep: '#74ad95',
  wood: '#a8806c',
  woodDeep: '#7d5d50',
  ring: '#d9b99a',
  night: '#d9e4ff',
  butter: '#fff0b0',
};

const HOLE: Hole = { z0: -282, z1: -2, spring: 100, rise: 104 };

/** How much of the carved frame goes on beside the far jamb (18 px of trunk are left there before the back corner). */
const FAR = 0.6;

function face(): FaceArt {
  const f = { u0: -300, u1: 170, h: 480 };
  const h = HOLE;
  // The trunks, the door's the widest.
  const spans: [number, number][] = [[-306, 46], [52, 112], [118, 176]];
  let s = trunks(f, spans, { bark: [C.bark, C.barkC, C.barkB], gap: C.gap, seed: 17 });
  const P = (u: number, v: number): Pt => at(f, u, v);
  // It is two trunks grown together at the foot: they part over the door,
  // the far one's near side catching the light, the near one's far side in shade.
  {
    const left: Pt[] = [P(-186, 380), P(-168, 336), P(-156, 302), P(-148, 278), P(-142, 266)];
    const right: Pt[] = [P(-142, 266), P(-136, 278), P(-128, 302), P(-116, 336), P(-98, 380)];
    s += `<path d="${smooth([...left, ...right], 0.8, false)}Z" fill="${C.gap}"/>`;
    s += ink(smooth(offsetLine(right, -3), 0.8, false), 5, darkOf(C.bark, 0.14));
    s += ink(smooth(offsetLine(left, -2), 0.8, false), 1.6, lightOf(C.bark, 0.35));
    s += ink(smooth([...left, ...right], 0.8, false), LINE.small, lineFor(C.bark));
  }
  // Their crowns meeting overhead (the wall goes on up as leaves).
  s += hedge({ u0: f.u0, u1: f.u1, h: 120 }, { leaf: [C.crown, C.crownB, lightOf(C.crown, 0.15)], deep: C.crownDeep, seed: 4 }).replace(/^<rect[^>]*>/, '');
  // The carved frame round the door, and its keystone.
  s += archBand(h, f, 0, 12, darkOf(C.bark, 0.12), { far: FAR, over: `<path d="${closed(holeRing(h, f, 6, 40, FAR))}" fill="none" stroke="${lightOf(C.bark, 0.3)}" stroke-width="1" stroke-dasharray="3 4"/>` });
  {
    const [x, y] = P((h.z0 + h.z1) / 2, h.spring + h.rise + 14);
    s += comic(`M${r2(x - 9)} ${r2(y + 6)}L${r2(x - 12)} ${r2(y - 12)}L${r2(x + 12)} ${r2(y - 12)}L${r2(x + 9)} ${r2(y + 6)}Z`, C.barkC, { line: LINE.small, rim: [1.6, -1], glint: [-0.8, 0.8] });
    s += `<circle cx="${r2(x)}" cy="${r2(y - 3)}" r="3.4" fill="${C.butter}" stroke="${lineFor(C.butter)}" stroke-width="0.6"/>`;
  }
  // A firefly jar on a hook over the door's near shoulder, glowing.
  {
    const [x, y] = P(-36, 214);
    s += ink(`M${r2(x)} ${r2(y - 34)}l0 -8l-6 0`, 1.6, '#6a5a64');
    s += glowDisc(x, y, 30, C.butter, 0.6);
    s += comic(`M${r2(x - 10)} ${r2(y - 22)}L${r2(x + 10)} ${r2(y - 22)}Q${r2(x + 14)} ${r2(y)} ${r2(x + 10)} ${r2(y + 16)}L${r2(x - 10)} ${r2(y + 16)}Q${r2(x - 14)} ${r2(y)} ${r2(x - 10)} ${r2(y - 22)}Z`, '#e6f4ff', { line: LINE.small, rim: [2, -1], glint: [-1, 1] });
    s += `<rect x="${r2(x - 11)}" y="${r2(y - 28)}" width="22" height="7" rx="2" fill="${C.wood}" stroke="${lineFor(C.wood)}" stroke-width="0.8"/>`;
    for (const [dx, dy] of [[-4, -6], [5, 2], [-2, 9]] as const) s += `<circle cx="${r2(x + dx)}" cy="${r2(y + dy)}" r="2.4" fill="${C.butter}" stroke="#e8c860" stroke-width="0.5"/>`;
  }
  // A root for a doorstep, from the back corner to the door's far foot; moss and tufts at the trees' feet.
  s += barkRoot([P(-306, 30), P(-296, 12), P(-284, 3), P(-270, 1)], 11, 4, C.barkB, 3);
  s += barkRoot([P(h.z1 + 50, 30), P(h.z1 + 20, 10), P(h.z1 - 10, 2)], 10, 4, C.bark, 5);
  for (const u of [-291, 20, 70, 140]) s += tuft(...P(u, 4), 12, '#9cc47a', u);
  return { ...f, body: s };
}

/** The round green door: planks, iron bands, a round window cut through, a knob. */
function leaf(): FaceArt {
  const h = HOLE;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  let body = '';
  // Planks about as wide as ever (more of them across the wider door), each with its grain.
  const n = 10;
  const pw = W / n;
  for (let i = 0; i < n; i++) {
    const x = i * pw;
    const c = i % 2 ? C.door : lightOf(C.door, 0.08);
    body += `<rect x="${r2(x)}" y="0" width="${r2(pw)}" height="${r2(H)}" fill="${c}"/>`;
    body += `<path d="M${r2(x + 0.5)} 0L${r2(x + 0.5)} ${r2(H)}" stroke="${darkOf(C.door, 0.3)}" stroke-width="1"/>`;
    body += `<path d="M${r2(x + pw / 2)} ${r2(H * 0.15)}Q${r2(x + pw / 2 + 3)} ${r2(H * 0.5)} ${r2(x + pw / 2 - 1)} ${r2(H * 0.9)}" fill="none" stroke="${darkOf(C.door, 0.12)}" stroke-width="0.8"/>`;
    if (i % 3 === 1) body += `<ellipse cx="${r2(x + pw * 0.4)}" cy="${r2(H * (0.3 + (i % 2) * 0.32))}" rx="2.4" ry="4.2" fill="${darkOf(C.door, 0.18)}" opacity="0.8"/>`;
  }
  // Iron bands across, a rivet on every other plank.
  for (const v of [40, 130]) {
    body += `<rect x="-2" y="${r2(H - v - 5)}" width="${r2(W + 4)}" height="10" fill="#8a8a9a" stroke="#5f5f70" stroke-width="0.8"/>`;
    for (let i = 0; i <= n / 2; i++) body += `<circle cx="${r2(Math.min(W - 10, Math.max(10, i * pw * 2)))}" cy="${r2(H - v)}" r="1.8" fill="#c8c8d6"/>`;
  }
  // The shade on the hinge side, the knob on the free side.
  body += `<rect x="${r2(W * 0.84)}" y="0" width="${r2(W * 0.16)}" height="${r2(H)}" fill="${C.doorDeep}" opacity="0.35"/>`;
  body += comic(`M${r2(26)} ${r2(H - 84)}a6.5 6.5 0 1 0 0.01 0Z`, '#f5dc84', { line: LINE.small, rim: [1.4, -1], glint: [-1, 1] });
  const art = leafArt(h, C.door, body);
  const win = { x: W / 2, y: H - 162, r: 18 };
  const cut = `<mask id="tdw" maskUnits="userSpaceOnUse" x="-10" y="-10" width="${r2(W + 20)}" height="${r2(H + 20)}"><rect x="-10" y="-10" width="${r2(W + 20)}" height="${r2(H + 20)}" fill="#fff"/><circle cx="${r2(win.x)}" cy="${r2(win.y)}" r="${r2(win.r)}" fill="#000"/></mask>`;
  return {
    ...art,
    body:
      `${cut}<g mask="url(#tdw)">${art.body}</g>` +
      `<circle cx="${r2(win.x)}" cy="${r2(win.y)}" r="${r2(win.r + 1.5)}" fill="none" stroke="${C.wood}" stroke-width="3"/>` +
      ink(`M${r2(win.x - win.r)} ${r2(win.y)}L${r2(win.x + win.r)} ${r2(win.y)}M${r2(win.x)} ${r2(win.y - win.r)}L${r2(win.x)} ${r2(win.y + win.r)}`, 2.4, C.wood),
  };
}

/** Inside the tree: the far wall of the hollow, its grain, knots, a little shelf and a peg with a scarf. */
function far(): FaceArt {
  const L = 310;
  const H = 230;
  let s = '';
  for (let i = 0; i < 13; i++) {
    const x = 10 + i * 24;
    s += `<path d="M${x} ${H}Q${x + 6} ${H * 0.5} ${x - 2} 0" fill="none" stroke="${darkOf(C.wood, 0.18)}" stroke-width="1.2"/>`;
  }
  for (const [x, y, k] of [[120, 90, 1], [252, 150, 0.7]] as const) s += `<ellipse cx="${x}" cy="${y}" rx="${10 * k}" ry="${16 * k}" fill="${C.woodDeep}"/><ellipse cx="${x + k}" cy="${y - 2 * k}" rx="${4 * k}" ry="${8 * k}" fill="${lightOf(C.wood, 0.2)}"/>`;
  // A shelf with acorn cups and a tiny lamp.
  s += comic(`M30 ${H - 120}L110 ${H - 120}L110 ${H - 112}L30 ${H - 112}Z`, C.ring, { line: LINE.small, rim: [1, -1] });
  for (const x of [44, 62, 80]) s += comic(`M${x - 6} ${H - 128}a6 6 0 0 0 12 0Z`, '#b98a60', { line: LINE.fine }) + `<path d="M${x - 6} ${H - 128}L${x + 6} ${H - 128}" stroke="#7a5a40" stroke-width="2"/>`;
  s += glowDisc(98, H - 132, 18, C.butter, 0.7);
  // A peg further in, a striped scarf hung on it.
  s += comic(`M206 ${H - 150}l10 -3l1 6l-10 3Z`, C.ring, { line: LINE.fine });
  s += comic(`M204 ${H - 146}Q212 ${H - 150} 220 ${H - 146}L222 ${H - 90}L212 ${H - 92}L210 ${H - 136}L206 ${H - 96}L198 ${H - 98}Z`, '#e6a6b8', {
    line: LINE.fine,
    rim: [1.6, -0.8],
    over: [0, 1, 2, 3].map((k) => `<path d="M196 ${H - 132 + k * 11}L224 ${H - 136 + k * 11}" stroke="#fff0f4" stroke-width="3" opacity="0.8"/>`).join(''),
  });
  return passageWall(L, H, C.wood, s);
}

/** A ring of the tree's wood across the hollow: its growth rings round the cut. */
function ring(inset: number, seed: number): FaceArt {
  const h = HOLE;
  const f = { u0: h.z0 - 2, h: 250 };
  const inner: Hole = { z0: h.z0 + inset, z1: h.z1 - inset, spring: h.spring - inset * 0.6, rise: Math.max(4, h.rise - inset * 0.3) };
  let rings = '';
  for (let k = 1; k <= 4; k++) rings += `<path d="${closed(holeRing(inner, f, k * 5 + (seed % 3), 40))}" fill="none" stroke="${darkOf(C.ring, 0.12 + k * 0.03)}" stroke-width="0.9"/>`;
  return frameSheet(h, 250, inset, C.ring, { over: rings });
}

function raccoon(): FaceArt {
  const fur = '#b4aab8';
  const body =
    `<g transform="translate(0 -34)">` +
    comic('M-18 34Q-22 6 0 2Q22 6 18 34Z', fur, { line: LINE.small, rim: [2, -1.4], glint: [-1, 1] }) +
    comic('M-20 -2Q-24 -24 0 -26Q24 -24 20 -2Q14 10 0 10Q-14 10 -20 -2Z', fur, { line: LINE.small, rim: [2, -1.4], glint: [-1, 1] }) +
    comic('M-16 -18L-20 -34L-6 -24Z', fur, { line: LINE.fine }) +
    comic('M16 -18L20 -34L6 -24Z', fur, { line: LINE.fine }) +
    `<path d="M-18 -10Q-10 -18 0 -12Q10 -18 18 -10Q12 -2 0 -6Q-12 -2 -18 -10Z" fill="#4a4258"/>` +
    `<circle cx="-8" cy="-11" r="3" fill="#fff"/><circle cx="8" cy="-11" r="3" fill="#fff"/><circle cx="-7.4" cy="-11" r="1.6" fill="#2a2430"/><circle cx="8.6" cy="-11" r="1.6" fill="#2a2430"/>` +
    `<ellipse cx="0" cy="0" rx="3.4" ry="2.4" fill="#3a3040"/>` +
    `<path d="M-4 4Q0 7 4 4" fill="none" stroke="#3a3040" stroke-width="1" stroke-linecap="round"/>` +
    `<path d="M-16 30Q-8 26 -6 34M16 30Q8 26 6 34" fill="none" stroke="${lineFor(fur)}" stroke-width="1"/>` +
    `</g>`;
  return figure(56, 70, body);
}

export function treeDoor(): WallDoorArt {
  const h = HOLE;
  return {
    wall: { color: C.bark, edge: '#f2e3d6' },
    hole: h,
    face: face(),
    leaf: { kind: 'swing', hinge: 'near', color: C.door, back: C.doorDeep, art: leaf(), shut: 0, open: 84, wide: 89 },
    passage: {
      length: 310,
      reveal: 18,
      floor: '#6b4f45',
      wall: C.wood,
      end: C.night,
      art: far(),
      frames: [
        { x: 22, art: ring(10, 1) },
        { x: 52, art: ring(22, 2) },
      ],
    },
    peek: { art: raccoon(), z: -142, hidden: 170, shown: 22 },
    light: { color: '#fff0b0', radius: 320, intensity: 0.85, y: 70 },
    glow: '#ffe9b8',
    sounds: { wake: ['door', 0.22, 1.25], peek: ['chirp', 0.3, 0.75], open: [['door', 0.4, 1.0]], shut: ['door', 0.35, 0.8] },
    openMs: 1200,
    life: { kind: 'fireflies', colors: ['#fff3a6', '#e8ff9e', '#fff8d0'], rate: 1.2 },
    flat: { hole: '#6b4f45', frame: darkOf(C.bark, 0.12) },
  };
}
