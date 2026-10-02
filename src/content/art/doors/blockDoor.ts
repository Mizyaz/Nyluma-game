import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import { Rng, type Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeRing } from './wallArt';
import { at, figure, frameSheet, leafArt, passageWall, r2, stoneCourses } from './wallKit';
import { glowDisc, twinkle } from './doorKit';

// b03, "Kırık Oda": the room of toy blocks, and its right wall is built of
// them, course on course of big painted blocks. The way on is a doorway in
// it between two columns of letter blocks (they read KA and PI, "kapı"),
// and until the crystal is broken a barricade of little blocks fills it;
// then the barricade sinks into the floor block by block. Through it: the
// next room, an empty hill at night, and a jester on a spring bobs out at
// Gorti from his box.

const T = {
  blocks: ['#f2c46b', '#f7a8c4', '#8fc4e8', '#a8d890', '#c8b8ea', '#f4a87c'],
  gap: '#6d6280',
  floor: '#55605a',
  wall: '#5a5f78',
  night: '#9aa3d0',
};

const HOLE: Hole = { z0: -240, z1: -74, spring: 140, rise: 38 };

/** A big toy block seen square on: its colour, a bevel, a letter or a dot. */
function block(x: number, y: number, w: number, h: number, fill: string, mark: string): string {
  const d = `M${r2(x + 3)} ${r2(y)}L${r2(x + w - 3)} ${r2(y)}Q${r2(x + w)} ${r2(y)} ${r2(x + w)} ${r2(y + 3)}L${r2(x + w)} ${r2(y + h - 3)}Q${r2(x + w)} ${r2(y + h)} ${r2(x + w - 3)} ${r2(y + h)}L${r2(x + 3)} ${r2(y + h)}Q${r2(x)} ${r2(y + h)} ${r2(x)} ${r2(y + h - 3)}L${r2(x)} ${r2(y + 3)}Q${r2(x)} ${r2(y)} ${r2(x + 3)} ${r2(y)}Z`;
  const inner = `<rect x="${r2(x + 6)}" y="${r2(y + 6)}" width="${r2(w - 12)}" height="${r2(h - 12)}" rx="3" fill="none" stroke="${lightOf(fill, 0.45)}" stroke-width="2"/>`;
  return comic(d, fill, { line: LINE.small, rim: [3, -1.6], glint: [-1.2, 1.2], hatch: 2.4, hatchWidth: 0.5, over: inner + mark });
}

function letter(x: number, y: number, ch: string, fill: string): string {
  return `<text x="${r2(x)}" y="${r2(y)}" font-family="Georgia, serif" font-weight="700" font-size="26" text-anchor="middle" fill="${darkOf(fill, 0.35)}" stroke="#fffaf2" stroke-width="0.8">${ch}</text>`;
}

function face(): FaceArt {
  const f = { u0: -300, u1: 170, h: 560 };
  const h = HOLE;
  const P = (u: number, v: number): Pt => at(f, u, v);
  let s = stoneCourses(f, { row: 46, len: [46, 92], fills: T.blocks.map((c) => lightOf(c, 0.12)), mortar: T.gap, seed: 33, gap: 4, round: 4 });
  // Dots and stars painted on the blocks here and there.
  const rng = new Rng(19);
  for (let i = 0; i < 26; i++) {
    const x = rng.range(10, f.u1 - f.u0 - 10);
    const y = rng.range(10, f.h - 40);
    s += rng.chance(0.5) ? `<circle cx="${r2(x)}" cy="${r2(y)}" r="4" fill="#fffaf2" opacity="0.75"/>` : twinkle(x, y, 5, '#fffaf2', 0.4);
  }
  // The two columns of letter blocks, and the beam across.
  const col = (z: number, letters: string[]): void => {
    letters.forEach((ch, i) => {
      const [x, y] = P(z, 46 * (i + 1));
      const fill = T.blocks[(i + (z > -100 ? 2 : 0)) % T.blocks.length]!;
      s += block(x, y, 40, 46, fill, ch ? letter(x + 20, y + 32, ch, fill) : `<circle cx="${r2(x + 20)}" cy="${r2(y + 23)}" r="6" fill="#fffaf2"/>`);
    });
  };
  col(h.z0 - 40, ['', 'A', 'K', '']);
  col(h.z1, ['', 'I', 'P', '']);
  {
    const [x, y] = P(h.z0 - 40, h.spring + h.rise + 44);
    const [x1] = P(h.z1 + 40, 0);
    s += block(x, y, x1 - x, 40, '#f4a87c', [0.25, 0.5, 0.75].map((k) => `<circle cx="${r2(x + (x1 - x) * k)}" cy="${r2(y + 20)}" r="5" fill="#fffaf2"/>`).join(''));
  }
  return { ...f, body: s };
}

/** The barricade of little blocks (only the blocks: the hill shows where they are not). */
function barricade(): FaceArt {
  const h = HOLE;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  const rng = new Rng(7);
  let body = '';
  let y = H;
  let row = 0;
  while (y > H - 150) {
    const bh = rng.range(24, 30);
    let x = (row % 2) * -14;
    while (x < W) {
      const bw = rng.range(26, 36);
      const fill = rng.pick(T.blocks);
      body += block(x + rng.range(-1.5, 1.5), y - bh, bw, bh, fill, rng.chance(0.4) ? `<circle cx="${r2(x + bw / 2)}" cy="${r2(y - bh / 2)}" r="3.4" fill="#fffaf2"/>` : '');
      x += bw + 1;
    }
    y -= bh + 1;
    row++;
  }
  // A few on top, tumbled.
  for (const [x, ang, c] of [[30, -12, '#f7a8c4'], [96, 8, '#8fc4e8'], [140, -4, '#f2c46b']] as const) body += `<g transform="rotate(${ang} ${x + 14} ${r2(y - 12)})">${block(x, y - 26, 28, 26, c, '')}</g>`;
  return leafArt(h, T.blocks[0]!, body, { bare: true });
}

function far(): FaceArt {
  const L = 240;
  const H = 230;
  let s = `<rect x="0" y="0" width="${L}" height="${H}" fill="#4f5584"/>`;
  const rng = new Rng(9);
  for (let i = 0; i < 16; i++) s += twinkle(rng.range(8, L - 8), rng.range(8, H * 0.55), rng.range(2, 4), '#fff7d6', 0.4);
  s += glowDisc(180, 50, 30, '#e6e8ff', 0.6) + `<circle cx="180" cy="50" r="12" fill="#fff1b8" stroke="${lineFor('#fff1b8')}" stroke-width="1"/>`;
  s += `<path d="M0 ${H - 70}Q${L * 0.45} ${H - 120} ${L} ${H - 76}L${L} ${H}L0 ${H}Z" fill="#6f7f6c" stroke="${lineFor('#6f7f6c')}" stroke-width="1"/>`;
  return passageWall(L, H, T.wall, s);
}

/** An arch of blocks across the way (a tunnel book's page). */
function blockArch(inset: number, fill: string, seed: number): FaceArt {
  const h = HOLE;
  const f = { u0: h.z0 - 2, h: 240 };
  const inner: Hole = { z0: h.z0 + inset, z1: h.z1 - inset, spring: h.spring - inset * 0.6, rise: Math.max(4, h.rise - inset * 0.3) };
  const ring = holeRing(inner, f, 0, 20);
  let studs = '';
  const rng = new Rng(seed);
  ring.forEach((p, i) => {
    if (i % 2 || i === 0 || i === ring.length - 1) return;
    studs += `<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="5" fill="${rng.pick(T.blocks)}" stroke="${lineFor(fill)}" stroke-width="0.8"/>`;
  });
  return frameSheet(h, 240, inset, fill, { over: studs });
}

function jester(): FaceArt {
  const body =
    // The box he springs from, and his spring.
    comic('M-18 0L-18 -24L18 -24L18 0Z', '#8fc4e8', { line: LINE.small, rim: [2.4, -1.4], glint: [-1, 1], over: `<circle cx="0" cy="-12" r="5" fill="#fffaf2"/>` }) +
    ink('M0 -24q-8 -4 0 -8q8 -4 0 -8q-8 -4 0 -8q8 -4 0 -8', 2, '#9a9aa8') +
    comic('M-12 -56Q-14 -78 0 -80Q14 -78 12 -56Q8 -50 0 -50Q-8 -50 -12 -56Z', '#fbe6d4', { line: LINE.small, rim: [2, -1.2], glint: [-1, 1] }) +
    comic('M-14 -74Q-26 -96 -30 -84Q-20 -80 -10 -76Z', '#f7a8c4', { line: LINE.small }) +
    comic('M14 -74Q26 -96 30 -84Q20 -80 10 -76Z', '#a8d890', { line: LINE.small }) +
    `<circle cx="-30" cy="-86" r="3.4" fill="#f2c46b" stroke="${lineFor('#f2c46b')}" stroke-width="0.6"/><circle cx="30" cy="-86" r="3.4" fill="#f2c46b" stroke="${lineFor('#f2c46b')}" stroke-width="0.6"/>` +
    `<circle cx="-5" cy="-66" r="2" fill="#2a2430"/><circle cx="5" cy="-66" r="2" fill="#2a2430"/>` +
    ink('M-5 -58Q0 -54 5 -58', 1.1, '#9a5a5a') +
    `<circle cx="-9" cy="-60" r="2.4" fill="#f5a6a0" opacity="0.7"/><circle cx="9" cy="-60" r="2.4" fill="#f5a6a0" opacity="0.7"/>` +
    comic('M-12 -50L-6 -44L0 -50L6 -44L12 -50L10 -40L-10 -40Z', '#f2c46b', { line: LINE.fine });
  return figure(70, 100, body);
}

export function blockDoor(): WallDoorArt {
  return {
    wall: { color: lightOf(T.blocks[2]!, 0.12), edge: '#fffaf2' },
    hole: HOLE,
    face: face(),
    leaf: { kind: 'sink', color: T.blocks[0]!, back: T.blocks[1]!, art: barricade(), shut: 0, open: 1 },
    passage: {
      length: 240,
      reveal: 14,
      floor: T.floor,
      wall: T.wall,
      end: T.night,
      art: far(),
      frames: [
        { x: 24, art: blockArch(10, '#f2c46b', 4) },
        { x: 58, art: blockArch(22, '#8fc4e8', 6) },
      ],
    },
    peek: { art: jester(), z: -158, hidden: 150, shown: 30 },
    light: { color: '#fff0c0', radius: 320, intensity: 0.85, y: 90 },
    glow: '#ffe9c8',
    sounds: { wake: ['click', 0.2, 1.4], peek: ['giggle', 0.32, 1.2], open: [['clunk', 0.45, 1.2], ['crystal', 0.25, 1.6]], shut: ['clunk', 0.35, 1] },
    openMs: 1500,
    life: { kind: 'confetti', colors: ['#f2c46b', '#f7a8c4', '#8fc4e8', '#a8d890'], rate: 1.3 },
    flat: { wall: lightOf(T.blocks[2]!, 0.12), hole: T.floor, frame: '#f4a87c' },
  };
}
