import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeOutline } from './wallArt';
import { archBand, archLine, archTopLine, at, closed, doily, figure, frameSheet, leafArt, passageWall, patch, pinnedStar, r2, tape } from './wallKit';
import { dashed, twinkle } from './doorKit';

// The 14th Room's way on, cut into the paper room's right wall like a page
// of a pop-up book: an onion-topped opening with a mint paper frame, a
// cream doily round it, a crayon rainbow over it, a dashed "cut here" line
// and its little scissors, washi tape at its feet, paper stars pinned
// about. The cut-out piece is the door: a mint flap on its fold (the near
// jamb) that swings into the passage. Beyond it the passage runs down into
// the lilac underground of the next room (r02): pages of cardboard and
// lilac paper stand across it like a tunnel book, and the little paper
// whale of the deep swims up to look.

const C = {
  mint: '#bde3cf',
  mintDeep: '#93c9b1',
  cream: '#fbf3e3',
  pink: '#f3b3cd',
  butter: '#f5dc84',
  sky: '#a9c8ec',
  lilac: '#c3a3dc',
  card: '#e2cda8',
  stone: '#a690cc',
  stoneDeep: '#8a74b4',
  earth: '#5e4a78',
  whale: '#9fb4e6',
};

const HOLE: Hole = { z0: -250, z1: -70, spring: 150, rise: 50, peak: 16 };

/** The wall round the opening (the rest of the wall is the room's own paper). */
function face(): FaceArt {
  const f = { u0: -300, u1: 10, h: 360 };
  const h = HOLE;
  const P = (u: number, v: number): string => at(f, u, v).map(r2).join(' ');
  let s = '';
  // The doily, then the mint frame on it.
  s += doily(h, f, 14, 20, 15, C.cream);
  s += archBand(h, f, 0, 16, C.mint, { over: dashed(archLine(h, f, 8), darkOf(C.mint, 0.3), 0.9, '4 3') });
  // The rainbow over it, in crayon.
  const bands: [number, string][] = [[46, C.pink], [53, C.butter], [60, C.sky]];
  for (const [by, c] of bands) s += `<path d="${archTopLine(h, f, by, 60)}" fill="none" stroke="${c}" stroke-width="6.4" stroke-linecap="round" opacity="0.92"/><path d="${archTopLine(h, f, by - 2.6, 60)}" fill="none" stroke="${lightOf(c, 0.5)}" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>`;
  s += `<path d="${archTopLine(h, f, 64, 60)}" fill="none" stroke="${lineFor(C.sky)}" stroke-width="${LINE.fine}" stroke-linecap="round"/>`;
  s += `<path d="${archTopLine(h, f, 42, 60)}" fill="none" stroke="${lineFor(C.pink)}" stroke-width="${LINE.fine}" stroke-linecap="round"/>`;
  // Clouds at the rainbow's feet.
  for (const [u, v] of [[h.z0 - 52, 86], [h.z1 + 50, 86]] as const) {
    const [x, y] = at(f, u, v);
    s += patch(`M${r2(x - 16)} ${r2(y + 6)}Q${r2(x - 18)} ${r2(y - 6)} ${r2(x - 6)} ${r2(y - 6)}Q${r2(x - 2)} ${r2(y - 15)} ${r2(x + 8)} ${r2(y - 9)}Q${r2(x + 18)} ${r2(y - 8)} ${r2(x + 16)} ${r2(y + 6)}Z`, '#f7f4fb');
  }
  // Washi tape holding the frame's feet, and a scrap of tape on the rainbow.
  s += tape(...at(f, h.z0 - 10, 12), 30, 10, -24, '#f3c4d8', '#fff2f7');
  s += tape(...at(f, h.z1 + 10, 14), 30, 10, 20, '#c8e4f4', '#f2fbff');
  // The little scissors that cut it out, beside the near jamb.
  {
    const [x, y] = at(f, h.z1 + 34, 70);
    s += `<g transform="translate(${r2(x)} ${r2(y)}) rotate(-62)">` +
      comic('M0 -2L26 -3.4L26 -1.2Z', '#d9dde6', { line: LINE.fine, glint: [0, 0.6] }) +
      comic('M0 2L26 3.4L26 1.2Z', '#d9dde6', { line: LINE.fine }) +
      comic(`M-4 -3.2a5 5 0 1 1 -8 -6a5 5 0 1 1 8 6Z`, C.pink, { line: LINE.fine, rim: [0.8, -0.6] }) +
      comic(`M-4 3.2a5 5 0 1 0 -8 6a5 5 0 1 0 8 -6Z`, C.pink, { line: LINE.fine, rim: [0.8, -0.6] }) +
      `<circle cx="0" cy="0" r="1.6" fill="${C.butter}" stroke="${lineFor(C.butter)}" stroke-width="0.5"/></g>`;
    s += dashed(`M${P(h.z1 + 24, 52)}Q${P(h.z1 + 18, 30)} ${P(h.z1 + 26, 8)}`, darkOf(C.mint, 0.25), 0.8, '3 3');
  }
  // Paper stars pinned about it, and a few doodled twinkles.
  s += pinnedStar(...at(f, h.z0 - 38, 196), 8, C.butter, 0.2);
  s += pinnedStar(...at(f, h.z1 + 28, 226), 7, C.pink, -0.3);
  s += pinnedStar(...at(f, (h.z0 + h.z1) / 2 + 30, 300), 6, C.sky, 0.5);
  s += twinkle(...at(f, h.z0 - 24, 250), 4.4, '#fff4c4');
  s += twinkle(...at(f, h.z1 + 44, 160), 3.6, '#fff4c4');
  return { ...f, body: s };
}

/** The flap: mint construction paper, a cream scalloped border, a round window cut through it, a butter knob. */
function leaf(): FaceArt {
  const h = HOLE;
  const lf = { u0: h.z0, h: h.spring + h.rise + (h.peak ?? 0) + 0.5 };
  const W = h.z1 - h.z0;
  const inner = holeOutline({ ...h, z0: h.z0 + 14, z1: h.z1 - 14, spring: h.spring - 6, rise: h.rise - 8, peak: (h.peak ?? 0) * 0.8 }, lf, 40).map(([x, y]) => [x, y - 8] as [number, number]);
  const win = { x: W / 2, y: lf.h - 150, r: 17 };
  let body = '';
  // Crayon shading low on the far side, a glint high on the near side.
  body += `<path d="M${r2(W)} ${r2(lf.h)}L${r2(W)} ${r2(lf.h * 0.25)}Q${r2(W * 0.7)} ${r2(lf.h * 0.5)} ${r2(W * 0.78)} ${r2(lf.h)}Z" fill="${darkOf(C.mint, 0.12)}" opacity="0.6"/>`;
  body += `<path d="${closed(inner)}" fill="none" stroke="${C.cream}" stroke-width="5" stroke-dasharray="7 3" stroke-linecap="round"/>`;
  body += `<path d="${closed(inner)}" fill="none" stroke="${darkOf(C.mint, 0.22)}" stroke-width="0.8"/>`;
  // Hearts and a paper flower stuck on it.
  body += patch(`M${r2(W / 2)} ${r2(lf.h - 70)}c-7 -9 -20 -2 -11 9l11 10l11 -10c9 -11 -4 -18 -11 -9Z`, C.pink);
  body += pinnedStar(W / 2 - 34, lf.h - 108, 7, C.butter, 0.1);
  body += pinnedStar(W / 2 + 36, lf.h - 120, 6, C.sky, -0.2);
  // The round window's sill ring (the window itself is cut through: see the mask below).
  body += `<circle cx="${r2(win.x)}" cy="${r2(win.y)}" r="${r2(win.r + 5)}" fill="${C.cream}" stroke="${lineFor(C.cream)}" stroke-width="${LINE.fine}"/>`;
  // The knob near the free edge.
  body += comic(`M${r2(26)} ${r2(lf.h - 84)}a6 6 0 1 0 0.01 0Z`, C.butter, { line: LINE.small, rim: [1.4, -1], glint: [-1, 1] });
  const art = leafArt(h, C.mint, body);
  // Cut the window out of it (it shows the passage through it).
  const cut = `<mask id="lfw" maskUnits="userSpaceOnUse" x="-10" y="-10" width="${r2(W + 20)}" height="${r2(lf.h + 20)}"><rect x="-10" y="-10" width="${r2(W + 20)}" height="${r2(lf.h + 20)}" fill="#fff"/><circle cx="${r2(win.x)}" cy="${r2(win.y)}" r="${r2(win.r)}" fill="#000"/></mask>`;
  return {
    ...art,
    body: `${cut}<g mask="url(#lfw)">${art.body}</g><circle cx="${r2(win.x)}" cy="${r2(win.y)}" r="${r2(win.r)}" fill="none" stroke="${lineFor(C.cream)}" stroke-width="${LINE.small}"/>`,
  };
}

/** The passage's far wall: the lilac stone of the underground, roots coming through, crystals in it. */
function far(): FaceArt {
  const L = 240;
  const H = 240;
  let s = '';
  // Courses of soft stones.
  const rows = [18, 52, 88, 126, 166, 206];
  rows.forEach((y, i) => {
    let x = -((i * 23) % 40);
    while (x < L) {
      const w = 34 + ((x * 7 + i * 13) % 22);
      const top = H - y - 30;
      s += `<path d="M${r2(x + 2)} ${r2(top + 3)}Q${r2(x + w / 2)} ${r2(top - 2)} ${r2(x + w - 2)} ${r2(top + 3)}L${r2(x + w - 1)} ${r2(top + 30)}L${r2(x + 1)} ${r2(top + 31)}Z" fill="${i % 2 ? C.stone : lightOf(C.stone, 0.12)}" stroke="${lineFor(C.stone)}" stroke-width="0.8"/>`;
      s += `<path d="M${r2(x + 5)} ${r2(top + 27)}L${r2(x + w - 4)} ${r2(top + 27)}" stroke="${C.stoneDeep}" stroke-width="2" opacity="0.5"/>`;
      x += w;
    }
  });
  // Roots hanging through from above.
  for (const [x, len] of [[30, 90], [96, 60], [150, 110], [210, 70]] as const) {
    s += `<path d="M${x} 0Q${x + 8} ${len * 0.5} ${x - 4} ${len}" fill="none" stroke="#8a6f86" stroke-width="5" stroke-linecap="round"/>`;
    s += `<path d="M${x} 0Q${x + 8} ${len * 0.5} ${x - 4} ${len}" fill="none" stroke="#b39aae" stroke-width="1.6" stroke-linecap="round" transform="translate(1 -1)"/>`;
  }
  // Crystals glowing in the stone.
  for (const [x, y, c] of [[44, 168, '#9fe6da'], [120, 196, '#f3b3cd'], [188, 150, '#9fe6da'], [70, 96, '#f5dc84']] as const) {
    s += `<path d="M${x} ${y}l6 -16l6 16l-6 6Z" fill="${c}" stroke="${lineFor(c)}" stroke-width="0.8"/><path d="M${x + 6} ${y - 16}l0 22" stroke="${lightOf(c, 0.6)}" stroke-width="0.8"/>`;
  }
  return passageWall(L, H, C.stone, s);
}

/** The little paper whale of the deep, swimming up to look. */
function whale(): FaceArt {
  const b = C.whale;
  const body =
    `<g transform="translate(0 -62)">` +
    `<path d="M-30 4Q-32 -20 -6 -22Q22 -22 28 -4Q30 10 14 14L-20 14Q-30 12 -30 4Z" fill="#fffaf2" stroke="#fffaf2" stroke-width="3"/>` +
    comic('M-30 4Q-32 -20 -6 -22Q22 -22 28 -4Q30 10 14 14L-20 14Q-30 12 -30 4Z', b, { line: LINE.small, rim: [2.4, -1.6], glint: [-1.4, 1.2] }) +
    comic('M-30 2Q-42 -8 -44 0Q-40 2 -42 10Q-36 8 -30 6Z', b, { line: LINE.fine }) +
    `<path d="M-6 8Q8 12 22 4" fill="none" stroke="${lightOf(b, 0.5)}" stroke-width="2"/>` +
    `<circle cx="14" cy="-6" r="2.4" fill="#3a3550"/><circle cx="14.8" cy="-6.8" r="0.8" fill="#fff"/>` +
    `<path d="M18 2Q21 4 24 1" fill="none" stroke="${lineFor(b)}" stroke-width="0.9" stroke-linecap="round"/>` +
    `<circle cx="20" cy="-1" r="2.6" fill="${C.pink}" opacity="0.6"/>` +
    // Its spout.
    ink('M4 -22Q2 -32 -4 -36M4 -22Q6 -32 12 -36M4 -22L4 -34', 1.2, lightOf(C.sky, 0.2)) +
    `</g>`;
  return figure(92, 96, body);
}

export function paperDoor(): WallDoorArt {
  const h = HOLE;
  return {
    wall: { edge: '#efe3cf' },
    hole: h,
    face: face(),
    leaf: { kind: 'swing', hinge: 'near', color: C.mint, back: '#f7d9e5', art: leaf(), shut: 0, open: 84, wide: 89 },
    passage: {
      length: 240,
      reveal: 12,
      floor: C.earth,
      wall: C.stone,
      end: '#f3d9ff',
      art: far(),
      frames: [
        { x: 22, art: frameSheet(h, 260, 9, C.card, { over: `<path d="M0 ${r2(260 - 40)}L400 ${r2(260 - 40)}" stroke="${darkOf(C.card, 0.15)}" stroke-width="1" stroke-dasharray="2 5"/>` }) },
        { x: 52, art: frameSheet(h, 260, 20, C.lilac, { over: [0.25, 0.5, 0.75].map((u, i) => pinnedStar(20 + u * 140, 70 + i * 22, 6, [C.butter, C.pink, C.sky][i]!)).join('') }) },
      ],
    },
    peek: { art: whale(), z: -150, hidden: 150, shown: 24 },
    light: { color: '#e2c8ff', radius: 330, intensity: 0.9, y: 90 },
    glow: '#d9c2ff',
    sounds: { wake: ['paper', 0.55, 1.15], peek: ['bloom', 0.35, 1.3], open: [['paper', 0.5, 1.0]], shut: ['paper', 0.45, 0.9] },
    openMs: 1100,
    life: { kind: 'stars', colors: [C.butter, C.pink, C.sky], rate: 1 },
    flat: { hole: '#8d77b8', frame: C.mintDeep },
  };
}
