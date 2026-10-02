import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import { Rng, type Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { archBand, at, closed, hedge, ivy, leafArt, planks, r2, stoneCourses, voussoirs } from './wallKit';
import { crescent, crystals, face as faceOf, glowDisc, shard, tuft, twinkle } from './doorKit';

// The crystal gates, each in a wall standing across the room (so Gorti
// walks through them, not past them).
//
// r05: the field ends in a rock face (the stone that hung over the old
// gate is its top), and through it runs a low arch of big stones. While
// the gate is shut, bars of crystal stand across the arch, humming as Gorti
// comes; the two memory stones resting on their plates open it, and their
// sign, two pebbles side by side, glows in the keystone. Open, the bars
// sink into the sill.
//
// b02, "Ay Kapısı": a tall fence of old boards with a round-topped gate,
// crystals grown all round its arch. The gate is shut by a shutter painted
// with the night, the Moon asleep low on it; when the Moon is up, the
// shutter rises into the lintel and the painted Moon rises with it.

const R = {
  rock: ['#a9a1bd', '#b3abc6', '#9f97b5', '#bab2cc'],
  mortar: '#5f5878',
  arch: ['#c2b9d2', '#b7aec8', '#cbc3da'],
  moss: '#8fb47a',
  ivy: '#7fa87a',
  teal: '#a6dcd5',
  lilac: '#c8b8ea',
  blue: '#b5d2f2',
  pale: '#e3f3f4',
  pink: '#f0b2cf',
};

/** A crystal bar standing from the floor up to `top` (SVG y), `w` wide, its point on top. */
function bar(x: number, foot: number, top: number, w: number, fill: string): string {
  const d = closed([[x - w / 2, foot + 4], [x - w / 2, top + w * 0.7], [x, top], [x + w / 2, top + w * 0.7], [x + w / 2, foot + 4]]);
  const facet = `M${r2(x - w * 0.12)} ${r2(foot)}L${r2(x - w * 0.12)} ${r2(top + w * 0.6)}L${r2(x)} ${r2(top + 2)}`;
  return comic(d, fill, {
    line: LINE.small,
    rim: [Math.max(1.6, w * 0.28), -0.6],
    glint: [-1, 1],
    over: ink(facet, 1, lightOf(fill, 0.6)) + `<path d="M${r2(x + w * 0.22)} ${r2(top + w)}L${r2(x + w * 0.22)} ${r2(foot - 6)}" stroke="#ffffff" stroke-width="1.4" opacity="0.55"/>`,
  });
}

const STONES: Hole = { z0: -170, z1: 30, spring: 168, rise: 78 };

function stoneFace(): FaceArt {
  const f = { u0: -300, u1: 110, h: 560 };
  const h = STONES;
  const P = (u: number, v: number): Pt => at(f, u, v);
  let s = stoneCourses(f, { row: 56, len: [64, 136], fills: R.rock, mortar: R.mortar, seed: 52, gap: 4, round: 16 });
  // Moss along the top of the rock and over the arch, ivy hanging down it.
  s += hedge({ u0: f.u0, u1: f.u1, h: 70 }, { leaf: [R.moss, darkOf(R.moss, 0.08), lightOf(R.moss, 0.12)], deep: darkOf(R.moss, 0.3), seed: 9 }).replace(/^<rect[^>]*>/, '');
  for (const [u, v, len] of [[-270, 500, 150], [-220, 520, 90], [60, 510, 170], [95, 490, 110], [h.z0 - 30, 330, 120]] as const) s += ivy(...P(u, v), len, R.ivy, u + v);
  // The arch of big pale stones, its keystone with the two stones' sign.
  s += voussoirs(h, f, 36, R.arch, 28);
  {
    const [x, y] = P((h.z0 + h.z1) / 2, h.spring + h.rise + 20);
    s += comic(`M${r2(x - 20)} ${r2(y + 22)}L${r2(x - 25)} ${r2(y - 26)}L${r2(x + 25)} ${r2(y - 26)}L${r2(x + 20)} ${r2(y + 22)}Z`, '#d3cbe0', { line: LINE.small, rim: [2.6, -1.6], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5 });
    s += glowDisc(x, y - 2, 26, R.teal, 0.5);
    s += comic(`M${r2(x - 15)} ${r2(y - 2)}a6.5 6 0 1 0 13 0a6.5 6 0 1 0 -13 0Z`, R.teal, { line: LINE.fine, rim: [1.4, -1], glint: [-0.8, 0.8] });
    s += comic(`M${r2(x + 2)} ${r2(y - 2)}a6.5 6 0 1 0 13 0a6.5 6 0 1 0 -13 0Z`, R.pink, { line: LINE.fine, rim: [1.4, -1], glint: [-0.8, 0.8] });
    s += twinkle(x + 18, y - 18, 4, '#fff7d6', 0.5);
  }
  // Crystals grown from the cracks, and at the jambs' feet.
  s += crystals(...P(h.z0 - 22, 0), 30, [R.teal, R.lilac, R.blue], 4);
  s += crystals(...P(h.z1 + 22, 0), 26, [R.lilac, R.teal], 8);
  s += crystals(...P(-250, 300), 16, [R.blue, R.pale], 11, 1.4);
  s += crystals(...P(70, 220), 14, [R.teal, R.pale], 13, 1.4);
  for (const u of [-286, -230, -120, 70, 100]) s += tuft(...P(u, 2), 12, R.moss, u);
  return { ...f, body: s };
}

/** The bars across the arch (the leaf is cut to them: the field beyond shows between). */
function stoneBars(): FaceArt {
  const h = STONES;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  const fills = [R.teal, R.lilac, R.blue, R.pale, R.teal, R.lilac];
  let body = '';
  // Two rods of crystal across, behind the bars.
  for (const v of [70, 158]) body += comic(`M-4 ${r2(H - v - 3.5)}L${r2(W + 4)} ${r2(H - v - 3)}L${r2(W + 4)} ${r2(H - v + 3.5)}L-4 ${r2(H - v + 3)}Z`, R.pale, { line: LINE.fine, rim: [1.2, -0.6] });
  for (let i = 0; i < 6; i++) {
    const x = 20 + (i * (W - 40)) / 5;
    const u = (x / W) * 2 - 1;
    const top = H - (h.spring + h.rise * Math.sqrt(Math.max(0, 1 - u * u))) + 12 + (i % 2) * 10;
    body += bar(x, H, top, 15, fills[i]!);
  }
  body += glowDisc(W * 0.5, H * 0.45, 60, '#e6fbff', 0.35);
  return leafArt(h, R.pale, body, { bare: true });
}

export function stoneGate(): WallDoorArt {
  return {
    wall: { color: R.rock[0], edge: '#e4def0', half: 16, end: 100 },
    hole: STONES,
    face: stoneFace(),
    leaf: { kind: 'sink', color: R.pale, back: R.teal, art: stoneBars(), shut: 0, open: 1 },
    light: { color: '#bfe6f0', radius: 300, intensity: 0.8, y: 120 },
    glow: '#bfe6f0',
    sounds: { wake: ['crystal', 0.18, 1.5], open: [['shard', 0.4, 1.3], ['noteHigh', 0.3, 1.05]], shut: ['crystal', 0.3, 0.9] },
    openMs: 1500,
    flat: { wall: R.rock[0], frame: R.arch[0] },
  };
}

const MOON: Hole = { z0: -176, z1: 24, spring: 140, rise: 100 };
const M = {
  wood: ['#c9b49a', '#bfa98f', '#d3bfa5', '#c4ad92'],
  gap: '#6d5d58',
  night: '#4f5584',
  nightDeep: '#3d416b',
  moon: '#fff1b8',
};

function moonFace(): FaceArt {
  const f = { u0: -300, u1: 110, h: 560 };
  const h = MOON;
  const P = (u: number, v: number): Pt => at(f, u, v);
  let s = planks(f, { fills: M.wood, gap: M.gap, width: 30, top: 640, seed: 14 });
  // Two rails across the boards, and stars cut from tin nailed on them.
  for (const v of [70, 420]) s += comic(`M-4 ${r2(f.h - v - 9)}L${r2(f.u1 - f.u0 + 4)} ${r2(f.h - v - 11)}L${r2(f.u1 - f.u0 + 4)} ${r2(f.h - v + 8)}L-4 ${r2(f.h - v + 10)}Z`, '#b39c82', { line: LINE.small, rim: [2.4, -1], glint: [-1, 1] });
  for (const [u, v, r] of [[-262, 330, 9], [-232, 470, 6], [70, 360, 8], [40, 480, 6], [-60, 500, 7]] as const) {
    const [x, y] = P(u, v);
    s += comic(closed(Array.from({ length: 10 }, (_, i) => {
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const rr = i % 2 ? r * 0.45 : r;
      return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as Pt;
    })), '#d8dcef', { line: LINE.fine, rim: [1.2, -0.8], glint: [-0.6, 0.6] });
    s += `<circle cx="${r2(x)}" cy="${r2(y)}" r="1" fill="#6a6f88"/>`;
  }
  // The gate's frame of pale moonstone, crystals grown all round it.
  s += archBand(h, f, 0, 16, '#d9d6ea');
  const ring = (by: number): Pt[] => {
    const g: Hole = { z0: h.z0 - by, z1: h.z1 + by, spring: h.spring + by * 0.6, rise: h.rise + by * 0.4 };
    const pts: Pt[] = [];
    for (let i = 0; i <= 16; i++) {
      const z = g.z0 + ((g.z1 - g.z0) * i) / 16;
      const u = ((z - (g.z0 + g.z1) / 2) / ((g.z1 - g.z0) / 2));
      pts.push(P(z, g.spring + g.rise * Math.sqrt(Math.max(0, 1 - u * u))));
    }
    return pts;
  };
  const cx = P((h.z0 + h.z1) / 2, 0)[0];
  const cy = P(0, h.spring)[1];
  const rng = new Rng(5);
  for (const [x, y] of ring(16)) {
    const ang = Math.atan2(y - cy, x - cx);
    s += shard(x, y, rng.range(14, 24), rng.range(6, 9), ang + rng.range(-0.2, 0.2), rng.pick([R.teal, R.lilac, R.blue]));
  }
  for (const v of [0, 50, 100]) {
    s += shard(...P(h.z0 - 18, v + 10), 20, 7, Math.PI + 0.3, R.lilac);
    s += shard(...P(h.z1 + 18, v + 10), 20, 7, -0.3, R.teal);
  }
  for (const u of [-290, -240, -200, 50, 90]) s += tuft(...P(u, 2), 13, '#9cbf7f', u);
  return { ...f, body: s };
}

/** The shutter: the night, the Moon asleep low on it (it rises as the shutter does). */
function moonShutter(): FaceArt {
  const h = MOON;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  let body = `<rect x="0" y="0" width="${r2(W)}" height="${r2(H)}" fill="${M.night}"/>`;
  body += `<rect x="0" y="0" width="${r2(W)}" height="${r2(H * 0.4)}" fill="${M.nightDeep}" opacity="0.5"/>`;
  for (let i = 1; i < 6; i++) body += `<path d="M${r2((i * W) / 6)} 0L${r2((i * W) / 6)} ${r2(H)}" stroke="${darkOf(M.night, 0.25)}" stroke-width="1"/>`;
  const rng = new Rng(3);
  for (let i = 0; i < 14; i++) body += twinkle(rng.range(10, W - 10), rng.range(10, H * 0.7), rng.range(2.4, 5), '#fff7d6', 0.5);
  // The Moon, low, asleep in her crescent.
  const mx = W * 0.5;
  const my = H - 70;
  body += glowDisc(mx, my, 56, '#e6e8ff', 0.45);
  body += comic(crescent(mx - 6, my, 30, 1.3), M.moon, { line: LINE.small, rim: [3, -1.6], glint: [-1.2, 1.2] });
  body += faceOf(mx - 22, my + 2, 12, '#8a7a4a', false, { cheeks: '#f5b6c0', mouth: 'smile' });
  // Clouds along the foot.
  for (const [x, r] of [[20, 22], [60, 18], [110, 24], [160, 20], [196, 18]] as const) body += `<circle cx="${x}" cy="${r2(H - 6)}" r="${r}" fill="#c9cbe8" stroke="${lineFor('#c9cbe8')}" stroke-width="1"/>`;
  return leafArt(h, M.night, body);
}

export function moonDoor(): WallDoorArt {
  return {
    wall: { color: M.wood[0], edge: '#efe4d4', half: 12, end: 100 },
    hole: MOON,
    face: moonFace(),
    leaf: { kind: 'lift', color: M.night, back: M.nightDeep, art: moonShutter(), shut: 0, open: 1 },
    light: { color: '#e6e8ff', radius: 320, intensity: 0.85, y: 130 },
    glow: '#dfe3ff',
    sounds: { wake: ['crystal', 0.18, 1.6], open: [['whoosh', 0.35, 0.8], ['noteHigh', 0.3, 1.05]], shut: ['clunk', 0.3, 0.9] },
    openMs: 1700,
    life: { kind: 'stars', colors: ['#fff1b8', '#ffe28a', '#fff8e0'], rate: 1 },
    flat: { wall: M.wood[0], frame: '#d9d6ea' },
  };
}
