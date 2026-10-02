import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import type { Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeRing } from './wallArt';
import { at, figure, frameSheet, leafArt, passageWall, r2, stoneCourses } from './wallKit';
import { barkRoot, crystals, glowDisc, tuft } from './doorKit';

// The cave's way on (r02), cut into the cave's own right wall: courses of
// lilac stone like the back wall's, and in them a low mouth in the rock,
// its arch of big stones held in a net of old roots, a sleepy knot-eye
// above it, crystals glowing at its far foot and out of a crack over its
// near shoulder. Until the song the roots stand woven across the mouth;
// when it is sung they draw back into the ground. Beyond, a tunnel of earth
// runs toward the seafoam chamber of r03, root rings standing across it
// like the pages of a tunnel book, and a little root sprout peeks round
// them at Gorti.

const C = {
  stone: '#a79fba',
  stoneLight: '#b7aec8',
  stoneDeep: '#9890ab',
  mortar: '#776d8c',
  root: '#9a7f86',
  rootLight: '#b39aa0',
  moss: '#9cc47a',
  mint: '#9fe6da',
  pink: '#f0b2cf',
  earth: '#5d5470',
  soil: '#9b90b3',
  sea: '#d8f4ec',
};

const HOLE: Hole = { z0: -282, z1: -2, spring: 108, rise: 90 };

/** How deep the arch of stones is beside the far jamb (18 px of wall are left there before the back corner). */
const FAR = 0.56;

function face(): FaceArt {
  const f = { u0: -300, u1: 170, h: 480 };
  const h = HOLE;
  let s = stoneCourses(f, { row: 44, len: [56, 92], fills: [C.stone, C.stoneLight, C.stoneDeep], mortar: C.mortar, seed: 21 });
  // The arch of big stones round the mouth (slimmer beside the far jamb, in the corner).
  const ring = holeRing(h, f, 0, 30);
  const out = holeRing(h, f, 30, 30, FAR);
  for (let i = 0; i < ring.length - 1; i += 2) {
    const a = ring[i]!;
    const b = ring[Math.min(ring.length - 1, i + 2)]!;
    const c = out[Math.min(out.length - 1, i + 2)]!;
    const d = out[i]!;
    const fill = i % 4 ? C.stoneLight : '#c2b9d2';
    s += comic(`M${a.map(r2).join(' ')}L${b.map(r2).join(' ')}L${c.map(r2).join(' ')}L${d.map(r2).join(' ')}Z`, fill, { line: LINE.small, rim: [2.4, -1.6], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5 });
  }
  // Old roots netted over the arch: one down the back corner to the floor, one over the near shoulder, a bough along the top.
  const P = (u: number, v: number): Pt => at(f, u, v);
  const roots: Pt[][] = [
    [P(-258, 318), P(-284, 268), P(-292, 214), P(-291, 160), P(-293, 90), P(-295, 0)],
    [P(60, 330), P(12, 286), P(-22, 244), P(-30, 206), P(-8, 160), P(20, 100)],
    [P(-298, 196), P(-262, 216), P(-200, 234), P(-142, 242), P(-80, 236), P(-30, 216), P(4, 192)],
    [P(-250, 340), P(-216, 290), P(-172, 248)],
  ];
  roots.forEach((r, i) => (s += barkRoot(r, i < 2 ? 13 : 9, 4, i % 2 ? C.root : C.rootLight, 40 + i)));
  for (const [u, v, len] of [[-299, 122, 16], [-70, 250, 26], [-252, 240, 24]] as const) s += barkRoot([P(u, v), P(u + len * 0.5, v - len * 0.4), P(u + len, v - len * 0.5)], 4, 1.5, C.rootLight, u);
  // The knot over the mouth, its eye half asleep.
  {
    const [x, y] = P((h.z0 + h.z1) / 2, h.spring + h.rise + 52);
    s += comic(`M${r2(x - 22)} ${r2(y)}Q${r2(x - 20)} ${r2(y - 18)} ${r2(x)} ${r2(y - 19)}Q${r2(x + 22)} ${r2(y - 18)} ${r2(x + 24)} ${r2(y + 1)}Q${r2(x + 20)} ${r2(y + 17)} ${r2(x)} ${r2(y + 17)}Q${r2(x - 21)} ${r2(y + 16)} ${r2(x - 22)} ${r2(y)}Z`, C.root, { line: LINE.small, rim: [3, -2], glint: [-1.2, 1.2] });
    s += `<path d="M${r2(x - 12)} ${r2(y + 1)}Q${r2(x)} ${r2(y - 9)} ${r2(x + 12)} ${r2(y + 1)}Q${r2(x)} ${r2(y + 7)} ${r2(x - 12)} ${r2(y + 1)}Z" fill="#fff6ee" stroke="${darkOf(C.root, 0.35)}" stroke-width="1"/>`;
    s += `<path d="M${r2(x - 4)} ${r2(y + 1)}a4.6 4.6 0 0 0 9.2 0Z" fill="#5e8f84"/>`;
    s += `<path d="M${r2(x - 13)} ${r2(y)}Q${r2(x)} ${r2(y - 3)} ${r2(x + 13)} ${r2(y)}" fill="none" stroke="${darkOf(C.root, 0.4)}" stroke-width="2" stroke-linecap="round"/>`;
    s += ink(`M${r2(x - 9)} ${r2(y - 7)}l-2 -4M${r2(x)} ${r2(y - 9)}l0 -4M${r2(x + 9)} ${r2(y - 7)}l2 -4`, 0.9, darkOf(C.root, 0.4));
  }
  // Crystals glowing at its far foot and out of a crack over its near shoulder, moss on the stones.
  s += glowDisc(...P(-291, 12), 20, C.mint, 0.55);
  s += crystals(...P(-291, 2), 15, [C.mint, '#c9b8f2', C.mint], 5, 0.7);
  s += ink(`M${P(-58, 236).join(' ')}l6 -5l4 3l7 -6`, 1.2, darkOf(C.mortar, 0.2));
  s += glowDisc(...P(-40, 236), 20, C.pink, 0.5);
  s += crystals(...P(-40, 228), 16, [C.pink, C.mint], 9);
  for (const [u, v] of [[-291, 40], [-280, 230], [-118, 300], [-20, 268]] as const) s += tuft(...P(u, v), 10, C.moss, u);
  return { ...f, body: s };
}

/** The woven roots across the mouth (cut to the roots: the tunnel shows between them). */
function lattice(): FaceArt {
  const h = HOLE;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  let body = '';
  const y = (v: number): number => H - v;
  // Stems up from the floor (about 30 px apart: more of them across the wider mouth), and boughs across, woven over and under.
  const n = Math.round((W - 28) / 30) + 1;
  for (let i = 0; i < n; i++) {
    const x = 14 + (i * (W - 28)) / (n - 1);
    const lean = (i % 2 ? 1 : -1) * 8;
    body += barkRoot([[x, y(-4)], [x + lean * 0.5, y(H * 0.4)], [x - lean * 0.4, y(H * 0.75)], [x + lean * 0.2, y(H + 6)]], 9, 5, i % 2 ? C.root : C.rootLight, 60 + i, { grooves: 1 });
  }
  for (let j = 0; j < 4; j++) {
    const v = 30 + j * 42;
    body += barkRoot([[-6, y(v + 6)], [W * 0.3, y(v - 6)], [W * 0.62, y(v + 8)], [W + 6, y(v - 4)]], 7, 6, j % 2 ? C.rootLight : C.root, 80 + j, { grooves: 1 });
  }
  // Leaves sprouting from it, and a sleepy bud.
  for (const [x, v] of [[40, 70], [120, 150], [96, 40], [196, 112], [236, 48]] as const) body += comic(`M${x} ${r2(y(v))}q8 -10 16 -4q-6 8 -16 4Z`, C.moss, { line: LINE.fine });
  // Only the roots: the leaf is cut to them, the tunnel shows between.
  return leafArt(h, C.root, body, { bare: true });
}

function far(): FaceArt {
  const L = 230;
  const H = 230;
  let s = '';
  // Layers of soil, a vein of crystal, roots coming through.
  const bands: [number, string][] = [[0, '#a99fbd'], [60, '#9b90b3'], [120, '#a99fbd'], [175, '#8f84a8']];
  for (const [y0, c] of bands) s += `<path d="M0 ${y0}Q${L * 0.3} ${y0 + 8} ${L * 0.6} ${y0 - 4}T${L} ${y0 + 4}L${L} ${H}L0 ${H}Z" fill="${c}" stroke="${lineFor(c)}" stroke-width="0.8"/>`;
  for (const [x, len] of [[24, 120], [80, 70], [140, 150], [196, 90]] as const) s += barkRoot([[x, -4], [x + 10, len * 0.4], [x - 6, len * 0.8], [x + 4, len]], 6, 1.6, C.rootLight, x, { grooves: 1 });
  s += glowDisc(70, 168, 40, C.mint, 0.45) + crystals(70, 196, 26, [C.mint, '#c9b8f2'], 3);
  s += glowDisc(170, 120, 30, C.sea, 0.5) + crystals(170, 140, 18, [C.mint, C.sea], 7);
  return passageWall(L, H, C.soil, s);
}

function rootRing(inset: number, fill: string, seed: number): FaceArt {
  const h = HOLE;
  const sheet = frameSheet(h, 250, inset, fill);
  // Little roots fringing its cut edge.
  const f = { u0: h.z0 - 2, h: 250 };
  const inner: Hole = { z0: h.z0 + inset, z1: h.z1 - inset, spring: h.spring - inset * 0.6, rise: Math.max(4, h.rise - inset * 0.3) };
  // As many little roots as the arch is long (about one every 20 px).
  const ring = holeRing(inner, f, 0, Math.round((inner.z1 - inner.z0) / 6.5));
  let fringe = '';
  ring.forEach((p, i) => {
    if (i % 3 || i === 0 || i === ring.length - 1) return;
    const len = 8 + ((i * 7 + seed) % 9);
    fringe += ink(`M${r2(p[0])} ${r2(p[1])}q${r2(len * 0.3)} ${r2(len * 0.5)} ${r2(-len * 0.1)} ${r2(len)}`, 1.6, darkOf(fill, 0.3));
  });
  return { ...sheet, body: sheet.body + fringe };
}

function sprout(): FaceArt {
  const b = '#c9b38f';
  const body =
    `<path d="M-15 0Q-18 -26 0 -30Q18 -26 15 0Z" fill="#fffaf2" stroke="#fffaf2" stroke-width="3"/>` +
    comic('M-15 0Q-18 -26 0 -30Q18 -26 15 0Z', b, { line: LINE.small, rim: [2, -1.4], glint: [-1, 1] }) +
    comic('M0 -30Q-4 -44 -16 -46Q-12 -34 0 -30Z', C.moss, { line: LINE.fine, rim: [1, -0.6] }) +
    comic('M0 -30Q6 -48 20 -48Q16 -34 0 -30Z', lightOf(C.moss, 0.2), { line: LINE.fine, rim: [1, -0.6] }) +
    `<circle cx="-5" cy="-16" r="3.4" fill="#3a3550"/><circle cx="6" cy="-16" r="3.4" fill="#3a3550"/>` +
    `<circle cx="-4" cy="-17.4" r="1.1" fill="#fff"/><circle cx="7" cy="-17.4" r="1.1" fill="#fff"/>` +
    `<path d="M-3 -8Q1 -5 5 -8" fill="none" stroke="${lineFor(b)}" stroke-width="1" stroke-linecap="round"/>` +
    `<circle cx="-10" cy="-10" r="2.4" fill="${C.pink}" opacity="0.6"/><circle cx="11" cy="-10" r="2.4" fill="${C.pink}" opacity="0.6"/>`;
  return figure(44, 52, body);
}

export function rootDoor(): WallDoorArt {
  const h = HOLE;
  return {
    wall: { color: C.stone, edge: '#d9d0e6' },
    hole: h,
    face: face(),
    leaf: { kind: 'sink', color: C.root, back: C.root, art: lattice(), shut: 0, open: 1 },
    passage: {
      length: 230,
      reveal: 16,
      floor: C.earth,
      wall: C.soil,
      end: C.sea,
      art: far(),
      frames: [
        { x: 24, art: rootRing(10, '#8f84a8', 3) },
        { x: 56, art: rootRing(22, '#7d7296', 5) },
      ],
    },
    peek: { art: sprout(), z: -142, hidden: 160, shown: 22 },
    light: { color: '#a8f0e0', radius: 340, intensity: 1, y: 90 },
    glow: '#9fe6da',
    sounds: { wake: ['root', 0.3, 1.25], open: [['rootGrow', 0.9, 1]], peek: ['drip', 0.35, 0.8], shut: ['root', 0.4, 0.9] },
    openMs: 1700,
    life: { kind: 'fireflies', colors: [C.mint, '#d8fff6', '#c9b8f2'], rate: 1.2 },
    flat: { hole: '#6f6688', frame: C.stoneLight },
  };
}
