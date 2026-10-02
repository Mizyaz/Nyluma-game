import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import type { Pt } from '../../../render/2d/svg';
import { comic, ink } from '../../characters/kit';
import type { FaceArt, WallDoorArt } from './wallArt';
import { holeOutline } from './wallArt';
import { archBand, archLine, at, blob, closed, doily, figure, frameSheet, leafArt, passageWall, patch, pinnedStar, r2, tape } from './wallKit';
import { dashed, starPts, twinkle } from './doorKit';

// The 14th Room's way on, cut into the paper room's right wall like a page
// of a pop-up book: a wide onion-topped opening from the back corner almost
// to the room's end, a mint paper frame with a dashed "cut here" line on
// it and the little scissors still at work on its near shoulder, a cream
// doily round it, a crayon rainbow over it from a cloud at the back corner
// to one over the near shoulder, washi tape, paper stars pinned about. The
// cut-out piece is the door: a mint flap on its fold (the near jamb) that
// swings into the passage. Beyond it the passage runs down into the lilac
// underground of the next room (r02): pages of cardboard and lilac paper
// stand across it like a tunnel book, and the little paper whale of the
// deep swims up to look.

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

const HOLE: Hole = { z0: -282, z1: -2, spring: 132, rise: 66, peak: 20 };

/** How much of what rings the opening goes on beside its far jamb (18 px of wall are left there before the back corner). */
const FAR = 0.42;

/** The rainbow's arc: its middle, its inner (pink) edge's half width and height, and where its feet stand (as angles round the middle). */
const BOW = { u: -150, v: 196, a: 128, b: 72, from: 0.955 * Math.PI, to: 0.13 * Math.PI };

/** The rainbow's arc `d` px out from its inner edge, from the cloud at the back corner over the opening to the one over its near shoulder. */
function bow(f: Pick<FaceArt, 'u0' | 'h'>, d: number): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = BOW.from + ((BOW.to - BOW.from) * i) / 40;
    pts.push(at(f, BOW.u + (BOW.a + d) * Math.cos(t), BOW.v + (BOW.b + d) * Math.sin(t)));
  }
  return 'M' + pts.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L');
}

/** A little paper cloud pinned flat, `k` its size. */
function cloud(f: Pick<FaceArt, 'u0' | 'h'>, u: number, v: number, k = 1): string {
  const [x, y] = at(f, u, v);
  const X = (dx: number): number => r2(x + dx * k);
  const Y = (dy: number): number => r2(y + dy * k);
  return patch(`M${X(-16)} ${Y(6)}Q${X(-18)} ${Y(-6)} ${X(-6)} ${Y(-6)}Q${X(-2)} ${Y(-15)} ${X(8)} ${Y(-9)}Q${X(18)} ${Y(-8)} ${X(16)} ${Y(6)}Z`, '#f7f4fb');
}

/** The little scissors, at (x, y) turned by `rot` degrees: blades along +x, finger loops behind. */
function scissors(x: number, y: number, rot: number): string {
  return (
    `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})">` +
    comic('M0 -2L26 -3.4L26 -1.2Z', '#d9dde6', { line: LINE.fine, glint: [0, 0.6] }) +
    comic('M0 2L26 3.4L26 1.2Z', '#d9dde6', { line: LINE.fine }) +
    comic(`M-4 -3.2a5 5 0 1 1 -8 -6a5 5 0 1 1 8 6Z`, C.pink, { line: LINE.fine, rim: [0.8, -0.6] }) +
    comic(`M-4 3.2a5 5 0 1 0 -8 6a5 5 0 1 0 8 -6Z`, C.pink, { line: LINE.fine, rim: [0.8, -0.6] }) +
    `<circle cx="0" cy="0" r="1.6" fill="${C.butter}" stroke="${lineFor(C.butter)}" stroke-width="0.5"/></g>`
  );
}

/** A five-petalled paper flower pinned flat. */
function flower(x: number, y: number, r: number, fill: string): string {
  return patch(blob(starPts(x, y, r, 0.55, 0.3)), fill, { rim: [r * 0.16, -r * 0.12] }) + `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 0.32)}" fill="${C.butter}" stroke="${lineFor(C.butter)}" stroke-width="0.6"/>`;
}

/** The wall round the opening (the rest of the wall is the room's own paper). */
function face(): FaceArt {
  const f = { u0: -300, u1: 44, h: 360 };
  const h = HOLE;
  let s = '';
  // The doily, then the mint frame on it (both narrow beside the far jamb, in the corner).
  s += doily(h, f, 14, 20, 15, C.cream, FAR);
  s += archBand(h, f, 0, 16, C.mint, { far: FAR, over: dashed(archLine(h, f, 8, 48, FAR), darkOf(C.mint, 0.3), 0.9, '4 3') });
  // The rainbow over it, in crayon.
  const bands: [number, string][] = [[0, C.pink], [7, C.butter], [14, C.sky]];
  for (const [d, c] of bands) s += `<path d="${bow(f, d)}" fill="none" stroke="${c}" stroke-width="6.4" stroke-linecap="round" opacity="0.92"/><path d="${bow(f, d - 2.6)}" fill="none" stroke="${lightOf(c, 0.5)}" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>`;
  s += `<path d="${bow(f, 18)}" fill="none" stroke="${lineFor(C.sky)}" stroke-width="${LINE.fine}" stroke-linecap="round"/>`;
  s += `<path d="${bow(f, -4)}" fill="none" stroke="${lineFor(C.pink)}" stroke-width="${LINE.fine}" stroke-linecap="round"/>`;
  // Clouds at the rainbow's feet: a small one in the back corner, one over the near shoulder.
  s += cloud(f, -284, 202, 0.9);
  s += cloud(f, -26, 224);
  // Washi tape holding the frame's far foot and its near shoulder.
  s += tape(...at(f, -291, 18), 24, 9, -72, '#f3c4d8', '#fff2f7');
  s += tape(...at(f, -18, 202), 20, 8, 34, '#c8e4f4', '#f2fbff');
  // The little scissors that cut it out, still at work along the "cut here" line on the near shoulder.
  s += scissors(...at(f, -62, 199.6), 17);
  // Paper stars pinned about it, and a few doodled twinkles.
  s += pinnedStar(...at(f, -268, 262), 8, C.butter, 0.2);
  s += pinnedStar(...at(f, -36, 270), 7, C.pink, -0.3);
  s += pinnedStar(...at(f, -120, 306), 6, C.sky, 0.5);
  s += twinkle(...at(f, -291, 238), 3.6, '#fff4c4');
  s += twinkle(...at(f, -206, 300), 4.4, '#fff4c4');
  s += twinkle(...at(f, -64, 304), 3.6, '#fff4c4');
  return { ...f, body: s };
}

/** The flap: mint construction paper, a cream scalloped border, a round window cut through it, a butter knob. */
function leaf(): FaceArt {
  const h = HOLE;
  const lf = { u0: h.z0, h: h.spring + h.rise + (h.peak ?? 0) + 0.5 };
  const W = h.z1 - h.z0;
  const inner = holeOutline({ ...h, z0: h.z0 + 14, z1: h.z1 - 14, spring: h.spring - 6, rise: h.rise - 8, peak: (h.peak ?? 0) * 0.8 }, lf, 40).map(([x, y]) => [x, y - 8] as [number, number]);
  const win = { x: W / 2, y: lf.h - 150, r: 18 };
  let body = '';
  // Crayon shading low on the far side, a glint high on the near side.
  body += `<path d="M${r2(W)} ${r2(lf.h)}L${r2(W)} ${r2(lf.h * 0.25)}Q${r2(W * 0.7)} ${r2(lf.h * 0.5)} ${r2(W * 0.78)} ${r2(lf.h)}Z" fill="${darkOf(C.mint, 0.12)}" opacity="0.6"/>`;
  body += `<path d="${closed(inner)}" fill="none" stroke="${C.cream}" stroke-width="5" stroke-dasharray="7 3" stroke-linecap="round"/>`;
  body += `<path d="${closed(inner)}" fill="none" stroke="${darkOf(C.mint, 0.22)}" stroke-width="0.8"/>`;
  // Hearts, stars and paper flowers stuck on it.
  body += patch(`M${r2(W / 2)} ${r2(lf.h - 70)}c-7 -9 -20 -2 -11 9l11 10l11 -10c9 -11 -4 -18 -11 -9Z`, C.pink);
  body += patch(`M${r2(W / 2 + 70)} ${r2(lf.h - 40)}c-4 -5 -12 -1 -6.6 5.4l6.6 6l6.6 -6c5.4 -6.4 -2.6 -10.4 -6.6 -5.4Z`, C.lilac);
  body += pinnedStar(W / 2 - 52, lf.h - 108, 7, C.butter, 0.1);
  body += pinnedStar(W / 2 + 50, lf.h - 120, 6, C.sky, -0.2);
  body += flower(W / 2 - 86, lf.h - 52, 8, C.pink);
  body += flower(W / 2 + 92, lf.h - 92, 6.5, C.sky);
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
  const L = 310;
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
  for (const [x, len] of [[30, 90], [96, 60], [150, 110], [210, 70], [276, 96]] as const) {
    s += `<path d="M${x} 0Q${x + 8} ${len * 0.5} ${x - 4} ${len}" fill="none" stroke="#8a6f86" stroke-width="5" stroke-linecap="round"/>`;
    s += `<path d="M${x} 0Q${x + 8} ${len * 0.5} ${x - 4} ${len}" fill="none" stroke="#b39aae" stroke-width="1.6" stroke-linecap="round" transform="translate(1 -1)"/>`;
  }
  // Crystals glowing in the stone.
  for (const [x, y, c] of [[44, 168, '#9fe6da'], [120, 196, '#f3b3cd'], [188, 150, '#9fe6da'], [70, 96, '#f5dc84'], [252, 184, '#f5dc84'], [236, 104, '#f3b3cd']] as const) {
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
      length: 310,
      reveal: 12,
      floor: C.earth,
      wall: C.stone,
      end: '#f3d9ff',
      art: far(),
      frames: [
        { x: 22, art: frameSheet(h, 260, 9, C.card, { over: `<path d="M0 ${r2(260 - 40)}L400 ${r2(260 - 40)}" stroke="${darkOf(C.card, 0.15)}" stroke-width="1" stroke-dasharray="2 5"/>` }) },
        { x: 52, art: frameSheet(h, 260, 20, C.lilac, { over: ([[70, 76], [142, 51], [214, 77]] as const).map(([x, y], i) => pinnedStar(x, y, 6, [C.butter, C.pink, C.sky][i]!, i * 0.3)).join('') }) },
      ],
    },
    peek: { art: whale(), z: -142, hidden: 190, shown: 24 },
    light: { color: '#e2c8ff', radius: 330, intensity: 0.9, y: 90 },
    glow: '#d9c2ff',
    sounds: { wake: ['paper', 0.55, 1.15], peek: ['bloom', 0.35, 1.3], open: [['paper', 0.5, 1.0]], shut: ['paper', 0.45, 0.9] },
    openMs: 1100,
    life: { kind: 'stars', colors: [C.butter, C.pink, C.sky], rate: 1 },
    flat: { hole: '#8d77b8', frame: C.mintDeep },
  };
}
