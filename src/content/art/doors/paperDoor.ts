import type { DoorArt } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { glow } from '../../../render/2d/svg';
import {
  archPts,
  bit,
  circleP,
  comic,
  crayon,
  darkOf,
  dashed,
  deckle,
  doorPart,
  face,
  fillP,
  holed,
  ink,
  leafPart,
  lightOf,
  LINE,
  lineFor,
  mix,
  poly,
  page,
  resample,
  Rng,
  scallopBand,
  slab,
  smooth,
  smoothTaper,
  softStar,
  starPts,
  thread,
  twinkle,
  type Pt,
} from './doorKit';

// The 14th Room's way on: a pop-up door. The box is a child's paper world,
// so its door is cut out of construction paper and stands on folded tabs
// like a page of a pop-up book: a mint panel with an onion top, a cream
// doily round the opening, a crayon rainbow over it, a dashed "cut here"
// line with its little scissors, washi tape at its feet, and a paper star
// on a spring on top that wakes when Gorti comes. The cut-out piece is the
// door: a flap on its fold, always a little ajar, that swings wide open as
// he comes near. Behind it, a tunnel of paper pages (the cardboard's cut
// edge, a lilac page with paper stars on threads, the soil with roots, a
// ring of crystals) runs down to a glimpse of the next room: the lilac
// stone wall underground and its whale, who swims up to look.

const C = {
  mint: '#bde3cf',
  mintLeaf: '#c6e9d8',
  cream: '#fbf3e3',
  creamBack: '#f7d9e5',
  pink: '#f3b3cd',
  pinkDeep: '#e48fb4',
  butter: '#f5dc84',
  sky: '#a9c8ec',
  card: '#e2cda8',
  cardDeep: '#cdb48c',
  floorIn: '#e6d8c0',
  lilac: '#cdb8e7',
  lilacFloor: '#ddd0e6',
  soil: '#a68fbd',
  soilFloor: '#c9b7c9',
  stone: '#bcaad0',
  bark: '#ae93bc',
  crystal: '#aae5dc',
  crystalPink: '#f2bad6',
  cave: '#8d77a7',
  caveFloor: '#d8c9d6',
  wallFar: '#9a84b4',
  brick: '#ab95c4',
  floorFar: '#ece0cc',
  whale: '#bccaf0',
  whaleBelly: '#e3e8fa',
  leaf: '#a9cea3',
  thread: '#9a8aa8',
} as const;

/** The opening, the panel and the leaf. */
const OPEN_W = 92;
const OPEN_H = 166;
const OPEN = archPts(OPEN_W, OPEN_H);
const PANEL_CLEAN = archPts(152, 232, { rise: 76, peak: 18 });
const PANEL = deckle(PANEL_CLEAN, 0.7, hashSeed('door.paper.panel'));

const f = (n: number): number => Math.round(n * 100) / 100;

/** Little scissors on the cut line. */
function scissors(x: number, y: number, ang: number, color: string): string {
  const s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">`;
  let b = '';
  b += `<path d="M0 0L13 -2.6Q14.6 -2.2 13.4 -1.2L0 1Z" fill="#eef2f4" stroke="${color}" stroke-width="0.8" stroke-linejoin="round"/>`;
  b += `<path d="M0 0L13 2.6Q14.6 2.2 13.4 1.2L0 -1Z" fill="#e3e9ec" stroke="${color}" stroke-width="0.8" stroke-linejoin="round"/>`;
  b += `<ellipse cx="-4.6" cy="-3" rx="3.4" ry="2.4" fill="none" stroke="${C.pinkDeep}" stroke-width="1.5"/>`;
  b += `<ellipse cx="-4.6" cy="3" rx="3.4" ry="2.4" fill="none" stroke="${C.pinkDeep}" stroke-width="1.5"/>`;
  b += `<circle cx="0.6" cy="0" r="0.9" fill="${color}"/>`;
  return s + b + '</g>';
}

/** A strip of washi tape, torn at both ends. */
function washi(cx: number, cy: number, w: number, h: number, ang: number, fill: string, seed: number): string {
  const rng = new Rng(seed);
  const pts: Pt[] = [];
  const zig = (x: number, up: boolean): void => {
    const n = 5;
    for (let i = 0; i <= n; i++) {
      const y = up ? h / 2 - (i * h) / n : -h / 2 + (i * h) / n;
      pts.push([x + rng.range(-1.2, 1.2), y]);
    }
  };
  pts.push([-w / 2, -h / 2], [w / 2, -h / 2]);
  zig(w / 2, false);
  pts.push([-w / 2, h / 2]);
  zig(-w / 2, true);
  const d = poly(pts);
  let dots = '';
  for (let x = -w / 2 + 3; x < w / 2 - 1; x += 5) for (const y of [-h / 4, h / 4]) dots += `<circle cx="${f(x + (y > 0 ? 2.5 : 0))}" cy="${f(y)}" r="0.9" fill="#fff8fb"/>`;
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(ang)})" opacity="0.93">${comic(d, fill, { line: LINE.fine, inner: dots, glint: [-0.6, 0.6] })}</g>`;
}

/** A tiny crayon whale (doodles on the tag and the flap's back). */
function doodleWhale(x: number, y: number, s: number, color: string, seed: number): string {
  const p = (pts: Pt[]): Pt[] => pts.map(([a, b]) => [x + a * s, y + b * s]);
  let o = crayon(p([[-10, 0], [-6, -5], [2, -6], [9, -3], [11, 1], [6, 4], [-4, 4], [-10, 0]]), color, 1.1 * Math.max(0.6, s), seed);
  o += crayon(p([[-10, 0], [-14, -4], [-15, 1], [-14, 4], [-10, 0]]), color, 1.1 * Math.max(0.6, s), seed + 1);
  o += `<circle cx="${f(x + 6 * s)}" cy="${f(y - 1.4 * s)}" r="${f(0.9 * s)}" fill="${color}"/>`;
  o += crayon(p([[1, -6], [0, -10], [-2, -12]]), color, 0.9 * Math.max(0.6, s), seed + 2);
  o += crayon(p([[1, -6], [3, -10], [5, -12]]), color, 0.9 * Math.max(0.6, s), seed + 3);
  return o;
}

/** The panel: mint construction paper with its doily, rainbow, cut line, doodles and tape. */
function panel(): string {
  const rng = new Rng(hashSeed('door.paper.doodles'));
  const doilyOuter = archPts(OPEN_W + 22, OPEN_H + 11, { rise: (OPEN_W + 22) / 2 });
  const band = scallopBand(OPEN, doilyOuter, 7.2, 2.6);
  // Holes punched along the doily.
  let holes = '';
  const mid = archPts(OPEN_W + 12, OPEN_H + 6, { rise: (OPEN_W + 12) / 2 });
  const along = resample(mid, 7.2, false);
  along.forEach((p, i) => {
    if (i % 2 === 0 && p[1] < -3) holes += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="1.15" fill="${C.mint}" stroke="${lineFor(C.cream)}" stroke-width="0.45"/>`;
  });
  // A crayon rainbow over the doorway.
  let rainbow = '';
  [
    [C.pink, 0],
    [C.butter, 4.2],
    [C.sky, 8.4],
  ].forEach(([col, k], i) => {
    const r = 72 - (k as number);
    const arc = archPts(r * 2 - 10, OPEN_H + 33 - (k as number) * 0.8, { rise: r - 5 }).slice(1, -1);
    rainbow += `<path d="${smooth(arc, 1, false)}" fill="none" stroke="${col}" stroke-width="3.6" stroke-linecap="round" opacity="${i === 1 ? 0.95 : 0.85}"/>`;
  });
  // Clouds at the rainbow's feet.
  let clouds = '';
  for (const sx of [-1, 1]) {
    const cx = sx * 58;
    const cy = -OPEN_H + 52;
    const d = smooth([
      [cx - 9, cy + 3],
      [cx - 8, cy - 3],
      [cx - 3, cy - 6],
      [cx + 2, cy - 7],
      [cx + 7, cy - 3],
      [cx + 10, cy + 2],
      [cx + 3, cy + 5],
      [cx - 4, cy + 5],
    ]);
    clouds += comic(d, '#fffaf3', { line: LINE.detail, rim: [1.2, -0.6] });
  }
  // The dashed cut line round the panel, with its scissors.
  const cut = archPts(132, 220, { rise: 66, peak: 15 }).slice(0, -1);
  let doodles = dashed(smooth(cut, 1, false), darkOf(C.mint, 0.3), 0.9, '3.6 2.8');
  doodles += scissors(62, -146, -96, darkOf(C.mint, 0.5));
  // Stars and dots in crayon.
  for (const [x, y, r, col] of [
    [-63, -106, 4.6, C.butter],
    [63, -122, 3.8, C.pink],
    [-61, -52, 3.4, C.sky],
    [62, -60, 4.4, C.butter],
    [-30, -224, 3.6, C.pink],
    [31, -218, 3.2, C.sky],
  ] as const) {
    const st = starPts(x, y, r, 0.46, rng.range(-0.4, 0.4));
    doodles += `<path d="${poly(st)}" fill="${col}" stroke="${darkOf(col, 0.45)}" stroke-width="0.7" stroke-linejoin="round"/>`;
  }
  for (let i = 0; i < 14; i++) {
    const x = rng.pick([-1, 1]) * rng.range(58, 70);
    const y = rng.range(-150, -14);
    doodles += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rng.range(0.7, 1.3))}" fill="${rng.pick([C.pinkDeep, '#8fb6d6', '#e7c45a'])}" opacity="0.85"/>`;
  }
  // A crayon swirl and a heart up in the onion.
  doodles += crayon([[0, -232], [3, -229], [0, -226], [-4, -229], [0, -234], [6, -230], [3, -222]], C.pinkDeep, 1, 5);
  doodles += crayon([[-6, -208], [-10, -212], [-6, -216], [-3, -213], [0, -216], [4, -212], [0, -207], [-3, -203], [-6, -208]], '#e58aa9', 1, 6);

  const sheet = holed(PANEL, [OPEN]);
  let s = slab(sheet, C.mint, { rim: 5.5, inner: rainbow + clouds + doodles });
  // The doily round the opening (over the panel, shaded on its own).
  s += comic(band, C.cream, { line: LINE.small, rim: [2, -1], glint: [-0.7, 0.7], over: holes });
  // Washi tape holding its feet down.
  s += washi(-72, -7, 34, 9.5, -16, C.pink, 3);
  s += washi(73, -9, 30, 9.5, 13, '#a9d7e8', 4);
  return s;
}

/** A little paper doormat before the threshold (drawn lying on the floor, foreshortened). */
function doormat(): string {
  const rng = new Rng(hashSeed('door.paper.mat'));
  const back = -6;
  const front = 8;
  const d = smooth(
    [
      [-46, back],
      [0, back - 0.6],
      [46, back],
      [54, (back + front) / 2],
      [56, front],
      [0, front + 0.8],
      [-56, front],
      [-54, (back + front) / 2],
    ],
    0.5,
  );
  let over = '';
  // A cream border and a row of crayon stars.
  over += `<path d="${smooth([[-40, back + 2.6], [0, back + 2], [40, back + 2.6], [47, front - 2.6], [0, front - 1.8], [-47, front - 2.6]], 0.5)}" fill="none" stroke="#fbeef2" stroke-width="1.3" stroke-dasharray="3 2"/>`;
  for (const x of [-26, 0, 26]) {
    const st = starPts(x, (back + front) / 2 + 0.6, 3.4, 0.46, rng.range(-0.3, 0.3)).map(([a, b]) => [a, (b - ((back + front) / 2 + 0.6)) * 0.42 + (back + front) / 2 + 0.6] as Pt);
    over += `<path d="${poly(st)}" fill="${C.butter}" stroke="${darkOf(C.butter, 0.45)}" stroke-width="0.55"/>`;
  }
  let s = comic(d, C.pink, { line: LINE.small, rim: [2.5, -1.2], glint: [-0.8, 0.8], over });
  // Fringes at both ends.
  for (let i = 0; i <= 11; i++) {
    const x = -50 + (i * 100) / 11;
    s += ink(`M${f(x)} ${f(front + 0.4)}l${f(rng.range(-0.6, 0.6))} 3`, 0.8, darkOf(C.pink, 0.25));
  }
  return s;
}

/** The star on its spring (sleeping), and its waking face. */
function star(awake: boolean): string {
  const cy = -40;
  let s = '';
  if (!awake) {
    // The paper spring: a zigzag strip folded back and forth.
    const zz: Pt[] = [];
    for (let i = 0; i <= 6; i++) zz.push([i % 2 === 0 ? -4.5 : 4.5, -i * 3.8]);
    s += `<path d="${poly(zz, false)}" fill="none" stroke="${darkOf(C.pink, 0.3)}" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>`;
    s += `<path d="${poly(zz, false)}" fill="none" stroke="${C.pink}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`;
    const d = softStar(0, cy, 17, 0.5, 0.06);
    s += comic(d, C.butter, { line: LINE.small, rim: [3, -1.4], glint: [-1, 1], hatch: 2.2, hatchWidth: 0.5 });
    s += face(0, cy + 1, 9.5, darkOf(C.butter, 0.65), false, { cheeks: '#f5a9a0' });
  } else {
    // Over the sleeping face: open eyes, a happy mouth (faded in as it wakes).
    s += fillP(ellipsePath(0, cy + 2, 8.6, 6.4), C.butter);
    s += face(0, cy + 1, 9.5, darkOf(C.butter, 0.7), true, { cheeks: '#f5a9a0' });
  }
  return s;
}

/** The tag hanging from a pin (the pin at 0,0). */
function tag(): string {
  let s = '';
  s += thread([0, 0], [-1, 13], C.thread, 0.7);
  const d = poly([
    [-9, 13],
    [-1, 10],
    [8, 13],
    [9, 29],
    [-9, 29],
  ]);
  s += `<g transform="rotate(-6 0 13)">${bit(d, '#f7c3d6', 18, { over: doodleWhale(0, 22, 0.45, '#6d8fc6', 11) })}<circle cx="-1" cy="13.6" r="1.4" fill="#fdf6f1" stroke="${darkOf('#f7c3d6', 0.5)}" stroke-width="0.5"/></g>`;
  s += `<circle cx="0" cy="0" r="2.2" fill="${C.pinkDeep}" stroke="${darkOf(C.pinkDeep, 0.5)}" stroke-width="0.6"/><circle cx="-0.6" cy="-0.7" r="0.6" fill="#fff"/>`;
  return s;
}

/** The flap's face (its fold on the right): mint, a sewn button for a knob, a crayon heart. */
function leafFront(): string {
  const shape = poly(OPEN.map(([x, y]) => [x + OPEN_W / 2, y + OPEN_H] as Pt));
  let over = '';
  // The fold: a crease near the hinge.
  over += ink(`M${OPEN_W - 5} ${OPEN_H - 2}L${OPEN_W - 5} ${OPEN_W / 2 - 4}`, LINE.fine, darkOf(C.mintLeaf, 0.32));
  // A crayon heart and stars.
  over += crayon([[44, 64], [40, 59], [44, 55], [47, 58], [50, 55], [54, 59], [50, 64], [47, 68], [44, 64]], '#e58aa9', 1.1, 21);
  for (const [x, y, r] of [[30, 32, 3.4], [62, 40, 2.8], [66, 120, 3]] as const) over += `<path d="${poly(starPts(x, y, r, 0.46, 0.2))}" fill="${C.butter}" stroke="${darkOf(C.butter, 0.45)}" stroke-width="0.6"/>`;
  // Grain of the paper.
  over += dashed(`M8 ${OPEN_H - 8}L${OPEN_W - 12} ${OPEN_H - 8}`, darkOf(C.mintLeaf, 0.18), 0.6, '1.6 2.4');
  let s = slab(shape, C.mintLeaf, { rim: 3.5, over });
  // The knob: a pink button sewn on with a cross of thread.
  const bx = 15;
  const by = 98;
  s += comic(circleP(bx, by, 6.6), C.pink, { line: LINE.small, rim: [1.6, -0.8], glint: [-0.8, 0.8] });
  for (const [dx, dy] of [[-1.8, -1.8], [1.8, -1.8], [-1.8, 1.8], [1.8, 1.8]] as const) s += `<circle cx="${f(bx + dx)}" cy="${f(by + dy)}" r="0.85" fill="${darkOf(C.pink, 0.5)}"/>`;
  s += ink(`M${bx - 1.8} ${by - 1.8}L${bx + 1.8} ${by + 1.8}M${bx + 1.8} ${by - 1.8}L${bx - 1.8} ${by + 1.8}`, 0.7, '#fdf3f6');
  return s;
}

/** The flap's back (seen once it swings past the edge; its fold on the left): plain paper, a crayon whale, a glue stain. */
function leafBack(): string {
  const shape = poly(OPEN.map(([x, y]) => [x + OPEN_W / 2, y + OPEN_H] as Pt));
  let over = '';
  over += fillP(smooth([[30, 132], [42, 126], [58, 130], [62, 140], [50, 146], [34, 143]]), '#f4e6b4', 0.55);
  over += doodleWhale(46, 92, 1.55, '#6f93cc', 31);
  // Waves under the whale.
  over += crayon([[18, 112], [24, 108], [30, 112], [36, 108], [42, 112], [48, 108], [54, 112], [60, 108], [66, 112], [72, 108]], '#8fb6d6', 1.1, 32);
  for (const [x, y, r, c] of [[24, 46, 4, C.butter], [64, 34, 3.2, C.pink], [70, 66, 2.6, C.butter]] as const) over += `<path d="${poly(starPts(x, y, r, 0.46, 0.3))}" fill="${c}" stroke="${darkOf(c, 0.45)}" stroke-width="0.6"/>`;
  over += ink(`M5 ${OPEN_H - 2}L5 ${OPEN_W / 2 - 4}`, LINE.fine, darkOf(C.creamBack, 0.3));
  return slab(shape, C.creamBack, { rim: 3.5, over });
}

// ---------------------------------------------------------------- the tunnel of pages

function inEdge(): string {
  // The cardboard's thickness: its corrugated core between two skins.
  let over = '';
  for (let k = 1; k <= 3; k++) {
    const a = archPts(OPEN_W + k * 7, OPEN_H + k * 3.5).slice(1, -1);
    over += ink(smooth(a, 1, false), 0.8, darkOf(C.card, 0.25));
  }
  return page(OPEN, -90, 90, -186, 10, C.card, C.floorIn, { wallOver: over, rim: 3, floorOver: ink('M-90 3H90', 0.7, darkOf(C.floorIn, 0.2)) });
}

const HOLE1 = archPts(88, 162, { rise: 44 });
function in1(): string {
  const rng = new Rng(hashSeed('door.paper.in1'));
  // A lilac page with a scalloped edge and stars punched out of it.
  const stars = [starPts(-58, -128, 6.5, 0.45, 0.2), starPts(59, -72, 5.5, 0.45, -0.1), starPts(-61, -40, 4.5, 0.45, 0.4)];
  let over = '';
  for (let i = 0; i < 18; i++) over += `<circle cx="${f(rng.range(-100, 100))}" cy="${f(rng.range(-190, -4))}" r="${f(rng.range(0.6, 1.2))}" fill="#f7f0ff" opacity="0.8"/>`;
  const scal = scallopBand(HOLE1, archPts(98, 167, { rise: 49 }), 7.5, 2.3);
  let s = page(HOLE1, -110, 110, -196, 20, C.lilac, C.lilacFloor, { wallOver: over, holes: stars, rim: 3.5 });
  s += comic(scal, lightOf(C.lilac, 0.35), { line: LINE.small, rim: [1.6, -0.8] });
  return s;
}

const HOLE2 = archPts(86, 158, { rise: 43 });
function in2(): string {
  const rng = new Rng(hashSeed('door.paper.in2'));
  // The soil: lumpy earth with pebbles in it, roots creeping round the hole.
  const lumpy = deckle(HOLE2, 1.4, 7, 5).filter((p) => p[1] <= 0.01);
  let over = '';
  for (let i = 0; i < 26; i++) {
    const a = rng.range(-0.15, Math.PI + 0.15);
    const r = rng.range(56, 112);
    const x = Math.cos(a) * r;
    const y = -116 - Math.sin(a) * r * 0.62 + rng.range(-8, 8);
    if (Math.abs(x) < 50 && y > -160) continue;
    const w = rng.range(5, 10);
    over += bit(ellipsePath(x, y, w, w * 0.64), C.stone, w * 2);
  }
  for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) {
    const x = sx * rng.range(54, 112);
    const y = rng.range(-110, -10);
    const w = rng.range(5, 9);
    over += bit(ellipsePath(x, y, w, w * 0.64), C.stone, w * 2);
  }
  let s = page(lumpy, -130, 130, -200, 30, C.soil, C.soilFloor, { wallOver: over, rim: 4.5 });
  // Roots creeping round the hole's rim from either side, curling up at their tips.
  for (const side of [-1, 1]) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = Math.PI / 2 + side * (1.25 - (i / 8) * 1.05);
      pts.push([Math.cos(t) * (43 + 7) + side * 0.5 * Math.sin(i * 1.6), -115 - Math.sin(t) * (43 + 8) + Math.sin(i * 1.3 + side) * 1.4]);
    }
    const tip = pts[pts.length - 1]!;
    pts.push([tip[0] - side * 4, tip[1] - 4], [tip[0] - side * 2, tip[1] - 8]);
    s += comic(smoothTaper(pts, 5.2, 1.4), C.bark, { line: LINE.detail, rim: [1, -0.5] });
  }
  return s;
}

const HOLE3 = archPts(84, 152, { rise: 42 });
function in3(): string {
  const rng = new Rng(hashSeed('door.paper.in3'));
  // A cave ring set with crystals pointing into the opening.
  let s = page(HOLE3, -150, 150, -200, 40, C.cave, C.caveFloor, { rim: 4 });
  const ring = resample(HOLE3, 13, false);
  ring.forEach((p, i) => {
    if (p[1] > -10) return;
    const cx = p[0];
    const cy = p[1];
    // Pointing inward, toward the hole's middle.
    const ang = Math.atan2(-84 - cy, -cx) + rng.range(-0.25, 0.25);
    const len = rng.range(10, 17);
    const w = rng.range(3.6, 5.8);
    const tip: Pt = [cx + Math.cos(ang) * len, cy + Math.sin(ang) * len];
    const nx = -Math.sin(ang) * w;
    const ny = Math.cos(ang) * w;
    const back: Pt = [cx - Math.cos(ang) * 5, cy - Math.sin(ang) * 5];
    const d = poly([
      [back[0] + nx, back[1] + ny],
      [cx + nx * 0.9 + Math.cos(ang) * len * 0.6, cy + ny * 0.9 + Math.sin(ang) * len * 0.6],
      tip,
      [cx - nx * 0.9 + Math.cos(ang) * len * 0.6, cy - ny * 0.9 + Math.sin(ang) * len * 0.6],
      [back[0] - nx, back[1] - ny],
    ]);
    const col = i % 3 === 1 ? C.crystalPink : C.crystal;
    s += comic(d, col, { line: LINE.detail, rim: [1.2, -0.6], glint: [-0.6, 0.6], over: ink(`M${f(back[0])} ${f(back[1])}L${f(tip[0])} ${f(tip[1])}`, 0.6, lightOf(col, 0.5)) });
  });
  return s;
}

/** The glimpse of the next room: the lilac stone cave underground, warm with light, its floor and crystals. */
function far(): string {
  const rng = new Rng(hashSeed('door.paper.beyond'));
  let s = `<rect x="-160" y="-210" width="320" height="212" fill="${C.wallFar}"/>`;
  // The light down there.
  s += glow(0, -78, 120, '#fff4fb', 1);
  s += glow(0, -60, 70, '#fffaf0', 1);
  // Big soft stones in the walls, toward the sides.
  for (let i = 0; i < 18; i++) {
    const side = i % 2 ? 1 : -1;
    const x = side * rng.range(46, 150);
    const y = rng.range(-205, -14);
    const w = rng.range(14, 24);
    s += comic(rrect(x - w, y - w * 0.32, w * 2, w * 0.64, w * 0.3), C.brick, { line: LINE.detail, rim: [2, -1], glint: [-0.8, 0.8] });
  }
  // Its floor, and crystals growing along it.
  s += fillP(rrect(-160, -1, 320, 72, 0), C.floorFar);
  s += ink('M-160 0H160', LINE.small, darkOf(C.floorFar, 0.3));
  for (const [x, col, k] of [[-44, C.crystal, 1], [-31, C.crystal, 0.65], [-55, C.crystal, 0.55], [42, '#f4c49a', 0.9], [54, '#f4c49a', 0.55], [100, C.crystalPink, 0.8], [-98, C.crystal, 0.7]] as const) {
    const h = 30 * k;
    const d = poly([
      [x - 7 * k, 1],
      [x - 8 * k, -h * 0.55],
      [x - 1, -h],
      [x + 7 * k, -h * 0.6],
      [x + 7 * k, 1],
    ]);
    s += comic(d, col, { line: LINE.detail, rim: [2, -1], glint: [-0.8, 0.8], over: ink(`M${f(x - 1)} ${f(-h)}L${f(x)} 0`, 0.6, lightOf(col, 0.4)) });
  }
  for (let i = 0; i < 8; i++) {
    const x = rng.range(-120, 120);
    const y = rng.range(6, 50);
    s += bit(ellipsePath(x, y, rng.range(2.5, 5), rng.range(1.6, 3)), '#d9cbd8', 8);
  }
  // Roots running along under its roof.
  for (const [x0, x1, y] of [[-160, -20, -204], [14, 160, -200]] as const) {
    const pts: Pt[] = [];
    for (let i = 0; i <= 8; i++) pts.push([x0 + ((x1 - x0) * i) / 8, y + Math.sin(i * 1.4 + x0) * 3]);
    s += comic(smoothTaper(x0 < 0 ? pts : pts.reverse(), 7, 2), C.bark, { line: LINE.detail, rim: [1.4, -0.7] });
  }
  return s;
}

/** The whale of the next room, swimming up to look (it faces left, toward Gorti). */
function whale(): string {
  let s = '';
  const body = smooth([
    [30, 2],
    [24, -7],
    [8, -12],
    [-10, -11],
    [-24, -6],
    [-30, 1],
    [-22, 7],
    [-4, 10],
    [14, 9],
    [26, 6],
  ]);
  const tail = smooth([
    [27, 2],
    [36, -6],
    [44, -9],
    [40, -1],
    [44, 7],
    [35, 5],
  ]);
  s += comic(tail, C.whale, { line: LINE.small, rim: [1.4, -0.7] });
  s += comic(body, C.whale, {
    line: LINE.small,
    rim: [2.4, -1.2],
    glint: [-0.9, 0.9],
    inner: fillP(smooth([[20, 6], [0, 9], [-20, 5], [-10, 2], [10, 3]]), C.whaleBelly),
    over: ink('M6 6Q-4 8 -14 5M4 8Q-6 10 -16 7', 0.6, darkOf(C.whale, 0.3)),
  });
  s += comic(smooth([[-2, 4], [-8, 9], [-6, 14], [0, 10]]), C.whale, { line: LINE.detail });
  s += `<circle cx="-18" cy="-3" r="1.7" fill="${darkOf(C.whale, 0.7)}"/><circle cx="-17.5" cy="-3.7" r="0.6" fill="#fff"/>`;
  s += `<ellipse cx="-21" cy="1.5" rx="2.2" ry="1.2" fill="#f2b3cc" opacity="0.8"/>`;
  s += ink('M-26 3.5Q-23.5 5.2 -21 4', 0.7, darkOf(C.whale, 0.6));
  // A little spout of glitter.
  s += twinkle(-8, -20, 3, '#fff6d8', 0.5) + twinkle(-3, -26, 2, '#e9f6ff', 0.5);
  return s;
}

/** A paper star on a thread (the thread's top at 0,0). */
function hangingStar(len: number, col: string, r: number, withFace: boolean): string {
  let s = thread([0, 0], [0, len], C.thread, 0.55);
  s += comic(softStar(0, len + r * 0.8, r, 0.5, 0.1), col, { line: LINE.detail, rim: [1.2, -0.6], glint: [-0.5, 0.5] });
  if (withFace) s += face(0, len + r * 0.9, r * 0.55, darkOf(col, 0.6), false);
  return s;
}

/** The 14th Room's pop-up door. */
export function paperDoor(): DoorArt {
  const parts = [
    doorPart('door.paper.panel', { x0: -84, y0: -256, x1: 84, y1: 10 }, panel()),
    doorPart('door.paper.mat', { x0: -60, y0: -10, x1: 60, y1: 14 }, doormat()),
    doorPart('door.paper.star', { x0: -20, y0: -60, x1: 20, y1: 2 }, star(false)),
    doorPart('door.paper.star.awake', { x0: -12, y0: -48, x1: 12, y1: -30 }, star(true)),
    doorPart('door.paper.tag', { x0: -12, y0: -4, x1: 12, y1: 32 }, tag()),
    leafPart('door.paper.leaf', OPEN_W, OPEN_H, leafFront()),
    leafPart('door.paper.leaf.back', OPEN_W, OPEN_H, leafBack()),
    doorPart('door.paper.in0', { x0: -90, y0: -186, x1: 90, y1: 10 }, inEdge()),
    doorPart('door.paper.in1', { x0: -110, y0: -196, x1: 110, y1: 20 }, in1()),
    doorPart('door.paper.in2', { x0: -130, y0: -200, x1: 130, y1: 30 }, in2()),
    doorPart('door.paper.in3', { x0: -150, y0: -200, x1: 150, y1: 40 }, in3()),
    doorPart('door.paper.beyond', { x0: -160, y0: -212, x1: 160, y1: 71 }, far()),
    doorPart('door.paper.whale', { x0: -32, y0: -30, x1: 46, y1: 16 }, whale()),
    doorPart('door.paper.hstar1', { x0: -10, y0: -2, x1: 10, y1: 42 }, hangingStar(26, C.butter, 8, true)),
    doorPart('door.paper.hstar2', { x0: -8, y0: -2, x1: 8, y1: 30 }, hangingStar(16, C.pink, 6, false)),
  ];
  return {
    parts,
    opening: OPEN,
    frame: [{ key: 'door.paper.panel', x: 0, y: 0, dz: 0 }],
    front: [{ key: 'door.paper.mat', x: 0, y: 0, dz: 18 }],
    inside: [
      { key: 'door.paper.beyond', x: 0, y: 0, dz: -130, order: 0 },
      { key: 'door.paper.in3', x: 0, y: 0, dz: -84, order: 2 },
      { key: 'door.paper.in2', x: 0, y: 0, dz: -52, order: 3 },
      { key: 'door.paper.in1', x: 0, y: 0, dz: -26, order: 5 },
      { key: 'door.paper.in0', x: 0, y: 0, dz: -8, order: 7 },
    ],
    backdrop: 0x5c4a78,
    pieces: [
      // The whale swims up from behind the crystals to look at Gorti.
      { key: 'door.paper.whale', inside: true, x: 74, y: -70, dz: -120, order: 1, sway: { y: 2.5, angle: 2.5, ms: 3400 }, peek: { x: -66, y: -6, angle: 4 } },
      // Paper stars on threads, inside the first page.
      { key: 'door.paper.hstar1', inside: true, x: -20, y: -152, dz: -22, order: 6, sway: { angle: 6, ms: 2900 }, wake: { angle: -10 } },
      { key: 'door.paper.hstar2', inside: true, x: 24, y: -150, dz: -23, order: 6, sway: { angle: -7, ms: 2300 }, wake: { angle: 12 } },
      // The star on its spring on top: it wakes, and bobs.
      { key: 'door.paper.star', x: 0, y: -246, dz: 1, sway: { angle: 3.5, ms: 2600 }, wake: { y: -5 }, wakeShut: true },
      { key: 'door.paper.star.awake', x: 0, y: -246, dz: 1, sway: { angle: 3.5, ms: 2600 }, shut: { alpha: 0 }, open: { alpha: 0 }, wake: { y: -5, alpha: 1 }, wakeShut: true },
      // The tag on its pin.
      { key: 'door.paper.tag', x: -57, y: -152, dz: 3, sway: { angle: 5, ms: 3100 }, wake: { angle: 8 } },
    ],
    leaves: [{ front: 'door.paper.leaf', back: 'door.paper.leaf.back', hinge: 'right', x: OPEN_W / 2, y: -OPEN_H, dz: 2, shutAngle: 0, restAngle: 24, wideAngle: 112 }],
    light: { color: 0xe2c8ff, radius: 330, intensity: 0.9, y: 80 },
    glow: { color: 0xd9c2ff, pool: 0xf0c8e8 },
    sparks: { colors: [0xf5dc84, 0xf3b3cd, 0xa9c8ec, 0xbde3cf], frame: 'fx.spark', rate: 1.4, size: 0.42 },
    sounds: { wake: ['paper', 0.55, 1.15], peek: ['bloom', 0.35, 1.3] },
  };
}

void mix;
