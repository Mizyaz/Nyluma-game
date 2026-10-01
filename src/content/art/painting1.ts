import { BOX, PLANE, WIDE_TOP, inWide } from '../rooms/r01Stage';
import type { LayerSpec } from '../../render/2d/painters/backgrounds';
import type { PartArt } from '../../render/2d/rig/rigTypes';
import { mix } from '../../render/2d/palette';
import { lineFor } from '../../render/2d/style';
import { ellipsePath, hashSeed, mixed, nextId, poly, Rng, rrect, smooth, taper, type Pt } from '../../render/2d/svg';
import { applyGrain } from '../../render/2d/TextureFactory';
import { eyeLeaf } from './p1EyeLeaf';
import { crystalTree } from './p1Tree';
import { portrait, sign } from './p1Pictures';

// The first painting ("House of The Stranger") as the 14th Room: a pink box
// papered inside with a torn cream sheet, in a pale world of cracked stone
// under a moon with a closed pink eye and a sad sun. Colours are sampled
// from the painting (src/assets/paintings/p1-house-of-the-stranger.jpg) and
// kept flat; its black outlines become contours in each fill's own darker
// tone (lineFor). Faces have no pupils and nobody smiles; the sun keeps its
// small frown. The words written in the painting stay as painted: "14",
// "?", "STRANGE DAYS", "!!!", "??".
//
// Props (atlas parts, keys 'p1.*') and the room's painted planes (the stone
// world, the sky, the box's back wall) live here; the room data places them
// (data/rooms/r01.ts) and backgrounds.ts hangs the planes in the nursery
// theme.

/** Colours sampled from the painting, lifted a little where they were dark. */
export const P1 = {
  // The world around the box.
  stone: '#d0ccc4',
  stoneSlab: '#c9c5bd',
  world: '#e0dfdf',
  // The box.
  lid: '#f5caf3',
  wall: '#f6e2f4',
  wallSide: '#efd6ee',
  wallFloor: '#f3dcf1',
  paper: '#f1e8d0',
  paperFloor: '#f5eedf',
  paperLit: '#f6e7ca',
  // Sky.
  moon: '#bfd4d9',
  moonLid: '#a6bec5',
  eye: '#f29bbb',
  sun: '#eeba92',
  sunLid: '#dca283',
  ray: '#efd67e',
  starTeal: '#9fd3c6',
  starMint: '#b8dcae',
  starLime: '#dcdf98',
  starPink: '#e2abbf',
  skyStar: '#95d4ca',
  blade: '#c3cbcf',
  // Arms and lamps.
  armBlue: '#8597c7',
  armBlueLight: '#a9b6de',
  armGrey: '#a9b0b3',
  armGreyLight: '#c1c7ca',
  armJoint: '#8f969a',
  toe: '#ab9ca3',
  toePad: '#ddb8c6',
  lamp: '#adb6b5',
  lampDark: '#9ea6a4',
  bulb: '#f2d9cf',
  bulbStripe: '#dcbdb2',
  // The cube house.
  pane: '#cfd6cb',
  paneSide: '#c4ccc1',
  turret: '#eee3d8',
  turretBand: '#baab9f',
  handle: '#d1c6bf',
  glyphGreen: '#9fc493',
  glyphPink: '#eb97ba',
  glyphDark: '#7f8575',
  glyphFigure: '#877f8e',
  glyphPurple: '#a98bd3',
  glyphBlue: '#8fb2d6',
  glyphBlueLight: '#cadcee',
  // Inside the box.
  bark: '#ae93bc',
  crystalLilac: '#dbd1e8',
  leaf: '#a9cea3',
  mist: '#decce5',
  giftBlue: '#8fc7dc',
  giftBlueTop: '#acd8e7',
  giftBlueSide: '#7cb4ca',
  giftPink: '#f2a4ca',
  giftPinkTop: '#f7c0dc',
  giftPinkSide: '#e592bd',
  giftYellow: '#f3dd8a',
  giftLime: '#cfe38f',
  starfolk: '#c6e9e4',
  starfolkFacet: '#abdcd5',
  spark: '#83a4a1',
  flower: '#c9b1da',
  flowerRib: '#e3d5ee',
  flowerFold: '#a78ec0',
  flowerThroat: '#947cab',
  stem: '#a0c094',
  rootling: '#bfa78e',
  rootlingDark: '#a28b74',
  visor: '#eca7bb',
  shade: '#8a8096',
  shadeDark: '#756b82',
  bang: '#ad98b8',
  crystal: '#aae5dc',
  crystalDeep: '#88d0c2',
  marksPaper: '#ecdec2',
  pencil: '#8f7d89',
  circle14: '#e490b4',
  // The bed, the wooden whale.
  bed: '#f0c2e8',
  bedDeep: '#e6b2dc',
  mattress: '#f7efe0',
  pillow: '#fbf6ec',
  blanket: '#ced5f0',
  blanketStripe: '#f2c0dd',
  wood: '#e1c8a3',
  woodDark: '#c9ae89',
  paintBlue: '#9bb8dd',
  // Charms.
  charmGreen: '#8ebc97',
  cord: '#b76a7c',
  banner: '#d7eb9e',
  bannerInk: '#627f53',
  pole: '#a2a6a9',
  branch: '#96bda0',
  claw: '#9096a0',
  pinkTag: '#f2b6d1',
  starburst: '#d9e690',
  leafCharm: '#8aae8f',
  lizard: '#a2ccb2',
  spine: '#7a9a86',
  lizardHead: '#ec918f',
  imp: '#bca389',
  greyBox: '#b6babd',
  dial: '#9fa4a8',
  string: '#958a97',
} as const;

// ================================================================ SVG kit

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const op = (o: number): string => (o !== 1 ? ` opacity="${n2(o)}"` : '');
const circle = (cx: number, cy: number, r: number): string => ellipsePath(cx, cy, r, r);
const open = (pts: readonly Pt[], t = 1): string => smooth(pts, t, false);

interface ShapeOpts {
  /** Markup clipped inside the shape. */
  inner?: string;
  /** Contour colour (default: the fill's own darker tone). */
  line?: string;
  opacity?: number;
}

/** A flat fill with a contour in its own darker colour. */
function shape(d: string, fill: string, w = 1.6, o: ShapeOpts = {}): string {
  let s = `<g${o.opacity !== undefined ? op(o.opacity) : ''}><path d="${d}" fill="${fill}"/>`;
  if (o.inner) {
    const id = nextId('p1c');
    s += `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${o.inner}</g>`;
  }
  if (w > 0) s += `<path d="${d}" fill="none" stroke="${o.line ?? lineFor(fill)}" stroke-width="${n2(w)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  return s + '</g>';
}

/** A coloured line along a path. */
function ln(d: string, color: string, w: number, o = 1): string {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${n2(w)}" stroke-linecap="round" stroke-linejoin="round"${op(o)}/>`;
}

function fill(d: string, color: string, o = 1): string {
  return `<path d="${d}" fill="${color}"${op(o)}/>`;
}

function group(transform: string, body: string): string {
  return `<g transform="${transform}">${body}</g>`;
}

/** A closed eye: a lid line curving down (content, not smiling). */
function closedEye(cx: number, cy: number, r: number, color: string, w = 1.6): string {
  return ln(`M${n2(cx - r)} ${n2(cy)}Q${n2(cx)} ${n2(cy + r * 0.45)} ${n2(cx + r)} ${n2(cy)}`, color, w);
}

/** A small spark of short spikes (the star creatures' hands and feet). */
function sparkD(cx: number, cy: number, r: number, n = 6, rot = 0): string {
  const pts: Pt[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rot + (i * Math.PI) / n;
    const rr = i % 2 ? r * 0.38 : r;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return poly(pts);
}

function starD(cx: number, cy: number, r: number, rot = 0, inner = 0.46): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rot - Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * inner : r;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return poly(pts);
}

/** A pointed leaf from (x, y) along angle `a`. */
function leafD(x: number, y: number, len: number, a: number, wid = 0.34): string {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const at = (u: number, v: number): Pt => [x + u * c - v * s, y + u * s + v * c];
  const w = len * wid;
  const p = [at(0, 0), at(len * 0.35, -w), at(len * 0.8, -w * 0.6), at(len, 0), at(len * 0.8, w * 0.6), at(len * 0.35, w)];
  return `M${n2(p[0]![0])} ${n2(p[0]![1])}C${n2(p[1]![0])} ${n2(p[1]![1])} ${n2(p[2]![0])} ${n2(p[2]![1])} ${n2(p[3]![0])} ${n2(p[3]![1])}C${n2(p[4]![0])} ${n2(p[4]![1])} ${n2(p[5]![0])} ${n2(p[5]![1])} ${n2(p[0]![0])} ${n2(p[0]![1])}Z`;
}

function leafWithVein(x: number, y: number, len: number, a: number, fillC: string, w = 1.4): string {
  const tip: Pt = [x + Math.cos(a) * len * 0.85, y + Math.sin(a) * len * 0.85];
  return shape(leafD(x, y, len, a), fillC, w) + ln(`M${n2(x)} ${n2(y)}L${n2(tip[0])} ${n2(tip[1])}`, lineFor(fillC), 1, 0.7);
}

// ---------------------------------------------------------------- lettering

interface Stroke {
  pts: Pt[];
  curve?: boolean;
  dot?: boolean;
}

/** Hand-lettered glyphs in a unit box, for the words the painting writes. */
const GLYPH: Record<string, Stroke[]> = {
  S: [{ curve: true, pts: [[0.88, 0.16], [0.55, 0.02], [0.2, 0.1], [0.14, 0.34], [0.5, 0.5], [0.84, 0.64], [0.86, 0.88], [0.5, 1], [0.12, 0.86]] }],
  T: [{ pts: [[0.02, 0.02], [0.98, 0.02]] }, { pts: [[0.5, 0.02], [0.5, 1]] }],
  R: [{ pts: [[0.14, 1], [0.14, 0.02], [0.62, 0.02], [0.86, 0.14], [0.86, 0.36], [0.62, 0.5], [0.14, 0.5]] }, { pts: [[0.48, 0.5], [0.9, 1]] }],
  A: [{ pts: [[0.02, 1], [0.5, 0.02], [0.98, 1]] }, { pts: [[0.24, 0.62], [0.76, 0.62]] }],
  N: [{ pts: [[0.12, 1], [0.12, 0.02], [0.88, 1], [0.88, 0.02]] }],
  G: [{ curve: true, pts: [[0.9, 0.2], [0.6, 0.02], [0.22, 0.12], [0.06, 0.5], [0.22, 0.88], [0.58, 1], [0.9, 0.84]] }, { pts: [[0.9, 0.84], [0.9, 0.56], [0.56, 0.56]] }],
  E: [{ pts: [[0.86, 0.02], [0.14, 0.02], [0.14, 1], [0.86, 1]] }, { pts: [[0.14, 0.5], [0.7, 0.5]] }],
  D: [{ pts: [[0.14, 0.02], [0.14, 1]] }, { curve: true, pts: [[0.14, 0.02], [0.55, 0.04], [0.88, 0.3], [0.9, 0.64], [0.62, 0.96], [0.14, 1]] }],
  Y: [{ pts: [[0.02, 0.02], [0.5, 0.52], [0.98, 0.02]] }, { pts: [[0.5, 0.52], [0.5, 1]] }],
  '?': [{ curve: true, pts: [[0.14, 0.28], [0.34, 0.05], [0.68, 0.04], [0.88, 0.24], [0.74, 0.46], [0.52, 0.58], [0.5, 0.76]] }, { dot: true, pts: [[0.5, 0.95]] }],
  '1': [{ pts: [[0.16, 0.28], [0.58, 0.02], [0.58, 1]] }],
  '4': [{ pts: [[0.74, 1], [0.74, 0.02], [0.04, 0.68], [0.98, 0.68]] }],
};

/**
 * A word as pen strokes: `w` is the stroke width, letters `h` tall and
 * `adv` apart, each a little off its line like a hand's.
 */
function lettering(text: string, x: number, y: number, h: number, adv: number, color: string, w: number, rng: Rng, outline?: { color: string; w: number }): string {
  let lines = '';
  const dots: Pt[] = [];
  let cx = x;
  for (const ch of text) {
    if (ch === ' ') {
      cx += adv * 0.7;
      continue;
    }
    const lw = h * (ch === '1' ? 0.55 : ch === '?' ? 0.62 : 0.72);
    const dy = rng.range(-0.06, 0.06) * h;
    for (const st of GLYPH[ch] ?? []) {
      const pts = st.pts.map(([u, v]): Pt => [cx + u * lw, y + dy + v * h]);
      if (st.dot) dots.push(pts[0]!);
      else lines += st.curve ? open(pts, 0.9) : poly(pts, false);
    }
    cx += adv;
  }
  let s = '';
  const dotsOf = (c: string, r: number): string => dots.map(([dx, dy]) => `<circle cx="${n2(dx)}" cy="${n2(dy)}" r="${n2(r)}" fill="${c}"/>`).join('');
  if (outline) s += ln(lines, outline.color, outline.w) + dotsOf(outline.color, outline.w * 0.62);
  s += ln(lines, color, w) + dotsOf(color, w * 0.62);
  return s;
}

function part(key: string, w: number, h: number, px: number, py: number, body: string, scale = 1): PartArt {
  return { key, w, h, px, py, body, scale };
}

// ================================================================ the cube house

/** The "14" cube house on the lid: nine panes of signs, two horn turrets. */
function cube(): PartArt {
  const rng = new Rng(hashSeed('p1.cube'));
  const X = [30, 118, 242, 330];
  // Row boundaries, bowed a little like the painting's (the middle column
  // stands forward).
  const R = [
    [128, 114, 114, 128],
    [198, 192, 192, 198],
    [272, 270, 270, 272],
    [346, 354, 354, 346],
  ];
  const at = (r: number, c: number): Pt => [X[c]!, R[r]![c]!];
  let s = '';
  // Handles on both sides (behind the body).
  for (const [hx, dir] of [[20, -1], [340, 1]] as const) {
    const d = `M${hx - dir * 4} 214C${hx + dir * 18} 206 ${hx + dir * 24} 246 ${hx - dir * 4} 250`;
    s += ln(d, lineFor(P1.handle), 9) + ln(d, P1.handle, 5.6);
  }
  // Turrets on the top edge, leaning out.
  for (const [tx, lean] of [[74, -9], [286, 9]] as const) {
    const ty = 124;
    let t = shape(`M${tx - 19} ${ty}C${tx - 20} ${ty - 22} ${tx - 17} ${ty - 44} ${tx - 14} ${ty - 58}L${tx + 14} ${ty - 58}C${tx + 17} ${ty - 44} ${tx + 20} ${ty - 22} ${tx + 19} ${ty}Z`, P1.turret, 2.6, {
      inner:
        ln(open([[tx - 8, ty + 2], [tx - 9, ty - 30], [tx - 6, ty - 60]]), P1.turretBand, 4.2) +
        ln(open([[tx + 3, ty + 2], [tx + 3, ty - 30], [tx + 4, ty - 60]]), P1.turretBand, 4.2) +
        ln(open([[tx + 13, ty + 2], [tx + 14, ty - 30], [tx + 11, ty - 60]]), P1.turretBand, 3),
    });
    t += shape(ellipsePath(tx, ty - 58, 16, 5.5), mix(P1.turret, P1.turretBand, 0.35), 2.2);
    t += shape(rrect(tx - 7, ty - 74, 14, 14, 2), mix(P1.turret, P1.turretBand, 0.5), 2);
    s += group(`rotate(${lean} ${tx} ${ty})`, t);
  }
  // Body: nine panes, the side columns a shade darker (the cube's sides).
  const outline = poly([at(0, 0), at(0, 1), at(0, 2), at(0, 3), at(3, 3), at(3, 2), at(3, 1), at(3, 0)]);
  let panes = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const q = poly([at(r, c), at(r, c + 1), at(r + 1, c + 1), at(r + 1, c)]);
      panes += fill(q, c === 1 ? P1.pane : P1.paneSide);
    }
  }
  const gridLine = lineFor(P1.pane);
  let grid = '';
  for (let r = 1; r < 3; r++) grid += ln(poly([at(r, 0), at(r, 1), at(r, 2), at(r, 3)], false), gridLine, 3.2);
  for (let c = 1; c < 3; c++) grid += ln(poly([at(0, c), at(3, c)], false), gridLine, 3.2);
  s += shape(outline, P1.pane, 0, { inner: panes }) + grid + ln(outline, gridLine, 3.6);

  // The signs in the panes.
  const green = P1.glyphGreen;
  // (0,0) a small green creature, a lizard-bird.
  s += shape(smooth([[50, 170], [58, 158], [76, 154], [92, 150], [100, 142], [108, 148], [104, 158], [92, 166], [72, 172]]), green, 1.8);
  s += shape(`M52 168L38 160L44 172Z`, green, 1.6) + ln('M66 170L62 182M84 166L86 178', lineFor(green), 2) + closedEye(101, 148, 2.6, lineFor(green), 1.4);
  s += shape(`M74 156L80 142L86 154Z`, green, 1.4);
  // (0,1) a pink sign like a small house.
  const pinkGlyph = poly([[146, 186], [150, 132], [210, 130], [214, 186]], false) + poly([[146, 186], [138, 190]], false) + poly([[214, 186], [222, 190]], false);
  const pinkInner = poly([[160, 152], [180, 140], [200, 152]], false) + poly([[166, 154], [194, 154], [194, 174], [166, 174], [166, 154]], false) + poly([[180, 154], [180, 174]], false);
  s += ln(pinkGlyph + pinkInner, lineFor(P1.glyphPink), 5.6) + ln(pinkGlyph + pinkInner, P1.glyphPink, 3);
  // (0,2) a purple dot and a dark sign.
  s += shape(circle(262, 162, 8), P1.glyphPurple, 1.6);
  s += ln('M292 138V190M280 148H306M282 162H304M282 176H304M300 190L308 183', P1.glyphDark, 3.4);
  // (1,0) a bent stroke, a flower of dots, a cross.
  s += ln(poly([[44, 256], [64, 236], [100, 260]], false), P1.glyphDark, 4.2);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - 0.4;
    s += `<circle cx="${n2(56 + Math.cos(a) * 7)}" cy="${n2(214 + Math.sin(a) * 7)}" r="3.6" fill="${P1.glyphDark}"/>`;
  }
  s += ln('M84 216H98M91 209V223', P1.glyphDark, 3.2);
  // (1,1) the blue whale.
  const whale = smooth([[136, 238], [148, 222], [176, 214], [206, 216], [226, 228], [222, 242], [196, 250], [160, 250]]);
  s += shape(`M140 236L120 220L118 236L124 250Z`, P1.glyphBlue, 1.8);
  s += shape(whale, P1.glyphBlue, 2, { inner: fill(smooth([[140, 246], [170, 240], [206, 238], [230, 240], [226, 262], [140, 262]]), P1.glyphBlueLight) });
  s += closedEye(208, 228, 3.4, lineFor(P1.glyphBlue), 1.6) + ln(open([[222, 239], [212, 239.4], [204, 240.4]]), lineFor(P1.glyphBlue), 1.4);
  // (1,2) a little standing figure.
  s += shape(circle(286, 212, 8), P1.glyphFigure, 1.4);
  s += ln('M270 226H302M286 220V230M276 250L282 226H290L296 250ZM280 250L276 262M292 250L296 262', P1.glyphFigure, 3.2);
  // (2,0) a green frog.
  s += shape(ellipsePath(74, 318, 26, 17), green, 1.8) + shape(circle(64, 298, 12), green, 1.8) + closedEye(64, 297, 4, lineFor(green), 1.6);
  s += ln('M58 332L50 338M90 332L98 338', lineFor(green), 2.2);
  // (2,1) "14" and (2,2) "?", as painted.
  s += lettering('14', 146, 284, 58, 42, '#e5a6c0', 3, rng, { color: '#8b7583', w: 6.4 });
  s += lettering('?', 268, 282, 60, 30, '#f0aac8', 3.2, rng, { color: '#c97c9f', w: 6.6 });
  return part('p1.cube', 360, 360, 180, 356, s, 0.8);
}

// ================================================================ the arms

/**
 * One of the two blue-grey arms that reach down from above onto the lid:
 * a striped blue upper arm, a grey collar with a spike, a grey forearm and
 * a two-toed foot. Drawn for the left arm (the right one is flipped).
 */
function arm(): PartArt {
  let s = '';
  const upper: Pt[] = [[226, -14], [214, 70], [196, 150], [170, 226]];
  s += shape(taper(upper, 64, 56), P1.armBlue, 2.6, {
    inner:
      ln(open(upper.map(([x, y]): Pt => [x - 20, y + 4])), P1.armBlueLight, 20) +
      ln(open(upper.map(([x, y]): Pt => [x - 8, y + 2])), lineFor(P1.armBlue), 1.4, 0.8) +
      ln(open(upper.map(([x, y]): Pt => [x + 14, y + 2])), mix(P1.armBlue, '#6f81b8', 0.6), 12),
  });
  const lower: Pt[] = [[164, 246], [148, 312], [122, 382], [92, 438]];
  s += shape(taper(lower, 56, 44), P1.armGrey, 2.6, {
    inner: ln(open(lower.map(([x, y]): Pt => [x - 12, y])), P1.armGreyLight, 14) + ln(open(lower.map(([x, y]): Pt => [x + 8, y + 2])), lineFor(P1.armGrey), 1.3, 0.7),
  });
  // The collar at the elbow, with its spike and a dark ring under it.
  s += shape(ellipsePath(162, 252, 34, 11), P1.armJoint, 2.2);
  s += shape(poly([[130, 222], [104, 188], [146, 212]]), P1.armGreyLight, 2);
  s += shape(poly([[128, 236], [134, 214], [200, 222], [198, 246]]), P1.armGreyLight, 2.4, { inner: ln('M136 232L194 238', lineFor(P1.armGreyLight), 1.2, 0.7) });
  // Wrist band and the foot's two toes, resting on the lid.
  s += shape(poly([[66, 424], [74, 404], [118, 420], [112, 442]]), P1.armJoint, 2.2);
  s += shape(ellipsePath(62, 452, 24, 12), P1.toe, 2.2, { inner: fill(ellipsePath(46, 456, 12, 9), P1.toePad) });
  s += shape(ellipsePath(106, 454, 20, 11), P1.toe, 2.2, { inner: fill(ellipsePath(120, 458, 10, 8), P1.toePad) });
  return part('p1.arm', 270, 470, 84, 464, s, 0.8);
}

// ================================================================ the lamps

/**
 * A grey stage lamp with a striped peach bulb, drawn pointing right (into
 * the box from its left end). Its card is centred on the bulb's mouth.
 */
function lamp(): PartArt {
  let s = '';
  s += shape(poly([[0, 26], [82, 12], [98, 62], [2, 64]]), P1.lamp, 2.4);
  s += shape(poly([[2, 64], [98, 62], [90, 112], [0, 104]]), P1.lampDark, 2.4);
  const bulb = 'M92 10C150 12 184 48 174 78C164 106 128 118 90 114Z';
  s += shape(bulb, P1.bulb, 2.6, {
    inner:
      ln('M96 30C130 32 160 50 172 72', P1.bulbStripe, 2.6) +
      ln('M96 58C126 60 150 72 164 94', P1.bulbStripe, 2.6) +
      ln('M96 86C118 90 132 98 142 110', P1.bulbStripe, 2.6),
  });
  s += ln('M92 12L90 112', lineFor(P1.lamp), 3);
  return part('p1.lamp', 180, 124, 90, 62, s);
}

// ================================================================ inside the box

/** The wrapped gift: a blue box under pink paper, a yellow ribbon and bow. */
function gift(): PartArt {
  let s = '';
  s += shape(poly([[22, 66], [136, 66], [136, 108], [22, 108]]), P1.giftBlue, 2, { inner: fill(poly([[74, 60], [86, 60], [86, 112], [74, 112]]), P1.giftYellow) });
  s += shape(poly([[136, 66], [150, 56], [150, 98], [136, 108]]), P1.giftBlueSide, 2);
  // The pink paper over its top half, like a lid.
  s += shape(poly([[18, 44], [140, 44], [140, 68], [18, 68]]), P1.giftPink, 2, { inner: fill(poly([[74, 40], [86, 40], [86, 70], [74, 70]]), P1.giftYellow) });
  s += shape(poly([[140, 44], [154, 32], [154, 56], [140, 68]]), P1.giftPinkSide, 2);
  s += shape(poly([[18, 44], [32, 32], [154, 32], [140, 44]]), P1.giftPinkTop, 2, { inner: fill(poly([[74, 44], [88, 32], [100, 32], [86, 44]]), P1.giftYellow) });
  // The bow.
  s += shape(smooth([[90, 36], [74, 28], [68, 14], [80, 10], [92, 30]]), P1.giftYellow, 1.8);
  s += shape(smooth([[94, 36], [106, 14], [120, 12], [120, 26], [98, 36]]), P1.giftYellow, 1.8);
  s += shape(circle(93, 34, 5.4), P1.giftLime, 1.6);
  s += ln('M90 38Q84 46 80 50M96 38Q102 46 108 48', lineFor(P1.giftYellow), 2.2);
  return part('p1.gift', 160, 112, 80, 112, s);
}

/**
 * The teal crystal star creature, reaching out to its left (toward the bed,
 * where Gorti sleeps), with spark hands and feet.
 */
function starfolk(): PartArt {
  let s = '';
  s += shape(smooth([[26, 116], [36, 108], [58, 106], [82, 108], [90, 116], [58, 119]]), P1.mist, 1.4);
  const pts: [number, number, number?][] = [
    [58, 8, 1], [68, 40], [100, 50, 1], [74, 66], [80, 110, 1], [58, 84], [34, 110, 1], [40, 66], [4, 36, 1], [46, 40],
  ];
  const body = mixed(pts);
  const c: Pt = [57, 58];
  let facets = '';
  for (const [x, y, sharp] of pts) if (sharp) facets += ln(`M${c[0]} ${c[1]}L${x} ${y}`, P1.starfolkFacet, 3.2);
  s += shape(body, P1.starfolk, 2.2, { inner: facets });
  for (const [x, y, r] of [[4, 36, 9], [100, 50, 8], [34, 110, 6.5], [80, 110, 6.5]] as const) s += shape(sparkD(x, y, r, 6, 0.3), P1.spark, 1.2);
  s += closedEye(50, 48, 3.4, lineFor(P1.starfolk), 1.7) + closedEye(64, 48, 3.4, lineFor(P1.starfolk), 1.7);
  s += ln('M54 60H60', lineFor(P1.starfolk), 1.6);
  return part('p1.starfolk', 108, 120, 57, 118, s);
}

/** The purple morning glory, lying tilted at the flower's end of the box. */
function flower(): PartArt {
  let s = '';
  s += shape(taper([[70, 110], [62, 94], [58, 80]], 6, 4), P1.stem, 1.5);
  s += leafWithVein(72, 102, 30, -0.35, P1.stem, 1.5);
  const cx = 64;
  const cy = 52;
  const ridge: Pt[] = [];
  const outline: Pt[] = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5 + 0.2;
    const r = 46;
    ridge.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.86]);
    outline.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.86]);
    const b = a + Math.PI / 5;
    outline.push([cx + Math.cos(b) * r * 0.9, cy + Math.sin(b) * r * 0.9 * 0.86]);
  }
  const throat: Pt = [cx - 4, cy - 3];
  let ribs = '';
  for (const [x, y] of ridge) ribs += ln(`M${n2(throat[0])} ${n2(throat[1])}L${n2(x)} ${n2(y)}`, P1.flowerRib, 8) + ln(`M${n2(throat[0])} ${n2(throat[1])}L${n2(x)} ${n2(y)}`, P1.flowerFold, 1.5);
  s += group('rotate(-14 64 52)', shape(smooth(outline, 0.9), P1.flower, 2.2, { inner: ribs }) + shape(ellipsePath(throat[0], throat[1], 12, 9), P1.flowerThroat, 1.8, { inner: fill(ellipsePath(throat[0] - 2, throat[1] - 1, 5, 3.5), mix(P1.flowerThroat, '#ffffff', 0.25)) }));
  return part('p1.flower', 140, 112, 70, 112, s);
}

/** The little root creature by the box's left wall. */
function rootling(): PartArt {
  let s = '';
  for (const r of [
    [[48, 84], [40, 100], [28, 118]], [[58, 86], [64, 102], [74, 118]], [[52, 88], [50, 104], [46, 118]],
  ] as Pt[][]) {
    s += shape(taper(r, 9, 4), P1.rootlingDark, 1.6);
  }
  s += shape(taper([[40, 58], [26, 42], [16, 22]], 9, 5), P1.rootling, 1.6) + ln('M16 22L8 14M16 22L14 10M16 22L22 12', lineFor(P1.rootling), 1.8);
  s += shape(taper([[70, 58], [86, 48], [98, 34]], 9, 5), P1.rootling, 1.6) + ln('M98 34L106 28M98 34L104 22M98 34L94 24', lineFor(P1.rootling), 1.8);
  s += shape(smooth([[38, 86], [34, 66], [42, 50], [56, 46], [70, 52], [74, 70], [70, 88], [56, 94]]), P1.rootling, 2, {
    inner: ln('M46 60Q50 70 46 82M62 58Q66 68 64 84', P1.rootlingDark, 1.6),
  });
  s += shape(poly([[40, 22], [36, 2], [52, 14]]), P1.rootling, 1.6) + shape(poly([[60, 14], [74, 0], [72, 22]]), P1.rootling, 1.6);
  s += shape(smooth([[38, 40], [36, 24], [46, 14], [64, 14], [74, 24], [72, 40], [56, 48]]), P1.rootling, 2);
  s += shape(rrect(40, 22, 34, 11, 5), P1.visor, 1.6);
  s += leafWithVein(66, 16, 16, -0.9, P1.leaf, 1.2) + leafWithVein(30, 44, 14, 3.6, P1.leaf, 1.2);
  return part('p1.rootling', 110, 120, 55, 120, s);
}

/** The small dark creature, startled, one hand curled up at the "!!!". */
function shade(): PartArt {
  let s = '';
  s += shape(taper([[38, 70], [28, 82], [18, 90]], 9, 4), P1.shadeDark, 1.6) + shape(taper([[54, 72], [62, 82], [72, 90]], 9, 4), P1.shadeDark, 1.6);
  s += shape(taper([[36, 60], [24, 66], [16, 76]], 8, 4), P1.shadeDark, 1.6);
  s += shape(smooth([[30, 74], [28, 56], [38, 44], [54, 44], [62, 56], [60, 72], [46, 78]]), P1.shade, 2, { inner: ln('M38 58Q44 64 40 72', P1.shadeDark, 1.6) });
  s += shape(taper([[56, 52], [68, 40], [76, 24]], 10, 6), P1.shade, 1.8);
  s += ln(open([[76, 26], [80, 14], [88, 10], [92, 18], [86, 24]]), lineFor(P1.shade), 7) + ln(open([[76, 26], [80, 14], [88, 10], [92, 18], [86, 24]]), P1.shadeDark, 4);
  s += shape(rrect(24, 16, 38, 30, 7), P1.shade, 2);
  s += shape(rrect(28, 26, 30, 8, 3), P1.shadeDark, 1.4);
  s += ln('M44 16L42 6', lineFor(P1.shade), 2.2) + `<circle cx="42" cy="5" r="2.6" fill="${P1.shadeDark}"/>`;
  return part('p1.shade', 96, 92, 46, 92, s);
}

/** "!!!" as painted over the startled creature. */
function bang(): PartArt {
  let s = '';
  for (const [x, a] of [[14, -18], [32, -2], [50, 14]] as const) {
    s += group(`rotate(${a} ${x} 40)`, shape(poly([[x - 4.5, 4], [x + 4.5, 4], [x + 2, 34], [x - 2, 34]]), P1.bang, 1.8) + shape(circle(x, 44, 4), P1.bang, 1.6));
  }
  return part('p1.bang', 64, 56, 32, 56, s);
}

// ---------------------------------------------------------------- on the back wall

// The two pictures (the portrait and the sign) are in p1Pictures.ts.

/** Fourteen notches on a scrap of paper; a name beside the fourteenth. */
function marks(): PartArt {
  const rng = new Rng(hashSeed('p1.marks'));
  const edge: Pt[] = [];
  const x0 = 10;
  const y0 = 12;
  const x1 = 210;
  const y1 = 124;
  for (let x = x0; x < x1; x += rng.range(9, 15)) edge.push([x, y0 + rng.range(-3, 3)]);
  for (let y = y0; y < y1; y += rng.range(9, 15)) edge.push([x1 + rng.range(-3, 3), y]);
  for (let x = x1; x > x0; x -= rng.range(9, 15)) edge.push([x, y1 + rng.range(-3, 3)]);
  for (let y = y1; y > y0; y -= rng.range(9, 15)) edge.push([x0 + rng.range(-3, 3), y]);
  let s = shape(poly(edge), P1.marksPaper, 1.5);
  let notches = '';
  for (let i = 0; i < 14; i++) {
    const row = i < 7 ? 0 : 1;
    const x = 26 + (i % 7) * 16 + rng.range(-1.5, 1.5);
    const y = 38 + row * 44 + rng.range(-2, 2);
    notches += `M${n2(x)} ${n2(y)}L${n2(x - 2 - rng.range(0, 2))} ${n2(y + 22)}`;
  }
  s += ln(notches, P1.pencil, 2.6);
  const ring: Pt[] = [];
  for (let i = 0; i <= 16; i++) {
    const a = -0.6 + (i / 16) * Math.PI * 2.15;
    ring.push([121 + Math.cos(a) * 12.5 * (1 + rng.range(-0.06, 0.06)), 93 + Math.sin(a) * 15 * (1 + rng.range(-0.06, 0.06))]);
  }
  s += ln(open(ring), P1.circle14, 2.2);
  const font = `font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="13" fill="${P1.pencil}"`;
  s += `<text x="142" y="90" ${font}>Gorti</text><text x="140" y="107" ${font}>Evaskinan</text>`;
  return part('p1.marks', 220, 134, 110, 67, s);
}

// ---------------------------------------------------------------- the bed and the whale

/** Gorti's bed, in the box's pink and lilac (mattress top at y 38, x 17–233). */
function bed(): PartArt {
  let s = fill(rrect(14, 80, 222, 27, 2), mix(P1.bedDeep, P1.wall, 0.4), 0.8);
  const post = (x: number, y: number, w: number, h: number, bx: number, by: number, r: number): string =>
    shape(rrect(x, y, w, h, 3), P1.bed, 1.6) + shape(rrect(x - 1.5, y - 1, w + 3, 6, 2), P1.bedDeep, 1.4) + shape(circle(bx, by, r), P1.bed, 1.6);
  s += shape('M12 66V17Q13 5 27 6Q45 8 50 27V66Z', P1.bed, 1.6, {
    inner: fill(`M24 12A7 7 0 1 0 31 23A5.6 5.6 0 1 1 24 12Z`, P1.moon) + fill(starD(41, 25, 3.4), P1.starTeal) + ln('M16 34Q18 50 16 64', P1.bedDeep, 1.3),
  });
  let tick = '';
  for (let x = 22; x < 234; x += 7) tick += ln(`M${x} 38V64`, mix(P1.mattress, P1.pencil, 0.18), 1.2);
  s += shape(rrect(16, 38, 218, 25, 7), P1.mattress, 1.6, { inner: tick });
  s += shape(rrect(10, 60, 230, 22, 4), P1.bedDeep, 1.6, { inner: fill('M22 71a3 3 0 1 0 0.01 0M228 71a3 3 0 1 0 0.01 0', lineFor(P1.bedDeep), 0.6) });
  s += shape(smooth([[22, 41], [19, 32], [25, 24], [41, 21], [59, 22], [70, 27], [73, 35], [67, 41], [45, 43]]), P1.pillow, 1.6, {
    inner: ln(open([[33, 27], [40, 31], [49, 30]]), mix(P1.pillow, P1.pencil, 0.3), 1.3),
  });
  const blanket = mixed([
    [74, 38, 1], [237, 38, 1], [239, 52], [237, 77, 1], [222, 79.5], [206, 76], [190, 79.5], [174, 76], [158, 79.5],
    [142, 76], [126, 79.5], [110, 76], [94, 79.5], [78, 77, 1], [73, 58],
  ]);
  let stripes = '';
  for (const x of [102, 136, 170, 204]) stripes += fill(rrect(x, 30, 11, 60, 0), P1.blanketStripe) + fill(rrect(x + 15, 30, 2.5, 60, 0), P1.blanketStripe, 0.85);
  stripes += fill(rrect(72, 36, 17, 46, 0), mix(P1.blanket, '#ffffff', 0.45)) + fill(rrect(76, 36, 4, 46, 0), P1.blanketStripe, 0.9);
  s += shape(blanket, P1.blanket, 1.6, { inner: stripes + ln('M89 38.5V78', lineFor(P1.blanket), 1.4) });
  s += post(4, 12, 12, 96, 10, 7, 6) + post(234, 29, 12, 79, 240, 24, 5);
  return part('p1.bed', 250, 110, 125, 110, s);
}

/**
 * The wooden whale: a carved pull toy, its blue paint worn through on the
 * back where countless small fingers held it.
 */
function whaleToy(): PartArt {
  const rng = new Rng(hashSeed('p1.whale'));
  let s = '';
  for (const [x, y] of [[28, 56], [44, 58], [68, 58], [84, 56]] as const) s += shape(circle(x, y, 6), P1.woodDark, 1.4, { inner: fill(circle(x, y, 1.8), lineFor(P1.woodDark)) });
  s += shape(smooth([[18, 40], [10, 32], [4, 24], [2, 16], [8, 18], [12, 24], [13, 14], [18, 11], [19, 20], [22, 34]]), P1.wood, 1.6);
  const body = mixed([
    [16, 42], [24, 34], [38, 26], [54, 19], [68, 16], [84, 16], [92, 20, 1], [94, 30], [93, 42, 1], [86, 48], [64, 52], [42, 51], [28, 48],
  ]);
  let paint = fill(smooth([[14, 40], [26, 30], [44, 20], [66, 14], [96, 14], [98, 30], [80, 30], [56, 32], [34, 38]]), P1.paintBlue);
  for (let i = 0; i < 12; i++) {
    const x = rng.range(34, 88);
    const y = rng.range(18, 30);
    paint += fill(`M${n2(x - 2.4)} ${n2(y)}a2.4 1.7 ${n2(rng.range(-30, 30))} 1 0 4.8 0a2.4 1.7 0 1 0 -4.8 0Z`, mix(P1.wood, P1.paintBlue, 0.2));
  }
  paint += ln(open([[26, 44], [50, 45], [76, 43], [90, 40]]), P1.woodDark, 1.1) + ln(open([[36, 38], [58, 40], [80, 38]]), P1.woodDark, 1, 0.8);
  s += shape(body, P1.wood, 1.8, { inner: paint });
  s += closedEye(76, 30, 3.4, lineFor(P1.wood), 1.5) + ln(open([[93, 39], [84, 39.4], [78, 40.4]]), lineFor(P1.wood), 1.3);
  s += ln('M86 16L85 9', lineFor(P1.wood), 1.6) + shape(circle(83, 6, 3), P1.paintBlue, 1.1) + shape(circle(89, 5, 2.6), P1.paintBlue, 1.1);
  return part('p1.whale', 104, 64, 52, 64, s);
}

// ---------------------------------------------------------------- the root door

/**
 * The roots of the 14th Room's door, parted like curtains and tied back
 * with crystal clasps, in the tree's purple bark. They grow down from the
 * lid, through the torn paper.
 */
function rootDoor(): PartArt {
  const rng = new Rng(hashSeed('p1.rootdoor'));
  const root = (pts: Pt[], w0: number, w1: number, vein = false): string =>
    shape(taper(pts, w0, w1), P1.bark, 1.8, { inner: vein ? ln(open(pts), mix(P1.bark, '#ffffff', 0.4), 1.2, 0.8) : '' });
  let s = '';
  // Roots coming down from the lid's edge onto the lintel, gripping it.
  for (const [x, ph] of [[52, 0.4], [110, 1.6], [168, 2.8]] as const) {
    const top: Pt = [x + Math.sin(ph) * 4, 22];
    s += root([top, [x + Math.sin(ph + 0.6) * 6, 32], [x + Math.sin(ph + 1) * 5, 46]], 10, 12);
    for (const [dx, dy] of [[-13, -4], [0, -8], [12, -5]] as const) s += shape(taper([top, [top[0] + dx * 0.6, top[1] + dy * 0.6], [top[0] + dx, top[1] + dy]], 5, 2), P1.bark, 1.3);
  }
  for (const side of [-1, 1] as const) {
    const cx = 110 + side * 82;
    for (let k = 0; k < 4; k++) {
      const top: Pt = [110 + side * (30 + k * 13), 44];
      const mid: Pt = [cx + side * (k - 1.5) * 3, 150];
      const low: Pt = [cx + side * (-14 + k * 11), 206];
      const foot: Pt = [cx + side * (-26 + k * 17) + rng.range(-3, 3), 300];
      const bulge: Pt = [(top[0] + mid[0]) / 2 - side * (10 - k * 2), 96];
      s += root([top, bulge, mid, low, foot], 13 - k, 10 - k * 0.5, k === 1);
    }
    const clx = cx + side;
    s += shape(ellipsePath(clx, 150, 15, 9), P1.crystal, 1.8, { inner: ln(ellipsePath(clx, 150, 10, 5), P1.crystalDeep, 1.2) });
    s += shape(`M${clx - 5} 141L${clx} 130L${clx + 5} 141Z`, P1.crystal, 1.4);
    for (const [lx, ly, a] of [[cx - side * 14, 104, -0.6], [cx + side * 12, 236, 0.5]] as const) s += leafWithVein(lx, ly, 14, side > 0 ? -Math.PI + a : a, P1.leaf, 1.3);
  }
  // The lintel: three roots braided across, their ends curling down into the curtains.
  for (let k = 0; k < 3; k++) {
    const pts: Pt[] = [[18 + k * 4, 70 - k * 6]];
    for (let i = 0; i <= 6; i++) pts.push([30 + i * 26.7, 42 + k * 8 + Math.sin(i * 1.25 + k * 2.1) * 6]);
    pts.push([202 - k * 4, 70 - k * 6]);
    s += root(pts, 13 - k * 2, 13 - k * 2, k === 1);
  }
  for (const [x, len, withLeaf] of [[64, 26, false], [80, 40, true], [96, 22, false], [112, 34, false], [128, 46, true], [144, 24, false], [158, 30, false]] as const) {
    const pts: Pt[] = [[x, 44], [x + rng.range(-4, 4), 44 + len * 0.55], [x + rng.range(-6, 6), 44 + len]];
    s += shape(taper(pts, 5, 1.4), P1.bark, 1.4);
    if (withLeaf) s += leafWithVein(pts[2]![0], pts[2]![1], 12, Math.PI / 2, P1.leaf, 1.1);
  }
  return part('p1.rootdoor', 220, 300, 110, 300, s);
}

// ---------------------------------------------------------------- the charms below the box

/** A string from the hanging point down to (x, y). */
function string(x0: number, y1: number, color: string = P1.string, w = 2.4): string {
  return ln(`M${x0} 0L${x0} ${y1}`, color, w);
}

function charms(): PartArt[] {
  const rng = new Rng(hashSeed('p1.charms'));
  const k = 0.6;
  const out: PartArt[] = [];
  // A green tag on a dark red cord.
  {
    let s = ln('M42 0Q38 14 42 30', P1.cord, 4.6) + ln('M44 0Q48 14 42 30', mix(P1.cord, '#ffffff', 0.2), 2.8);
    s += shape(poly([[16, 28], [28, 22], [36, 32], [48, 32], [56, 22], [68, 28], [66, 70], [72, 112], [12, 112], [18, 70]]), P1.charmGreen, 3.1, {
      inner: fill(ellipsePath(32, 60, 8, 6), mix(P1.charmGreen, P1.spine, 0.4)) + fill(ellipsePath(52, 78, 7, 9), mix(P1.charmGreen, P1.spine, 0.4)) + ln('M18 92H70', lineFor(P1.charmGreen), 1.4, 0.7),
    });
    out.push(part('p1.charm.tag', 84, 116, 42, 0, s, k));
  }
  // "STRANGE DAYS" on a lime banner hung from a pole.
  {
    let s = ln('M40 0L24 74', P1.pole, 6.4) + ln('M40 0L24 74', lineFor(P1.pole), 1.4, 0.6);
    const band = 'M34 16C80 30 140 52 204 76L186 96L200 120C140 100 80 76 28 58Z';
    s += shape(band, P1.banner, 3.4);
    const text = lettering('STRANGE', 0, 0, 20, 17, P1.bannerInk, 3, rng);
    s += group('translate(50 28) rotate(21)', text);
    s += group('translate(46 58) rotate(21)', lettering('DAYS', 0, 0, 16, 14, P1.bannerInk, 2.8, rng));
    out.push(part('p1.charm.banner', 214, 128, 40, 0, s, k));
  }
  // A green branch bent like an arm, with a claw.
  {
    const limbPts: Pt[] = [[30, 0], [30, 34], [50, 52], [118, 54]];
    let s = shape(taper(limbPts, 26, 20), P1.branch, 3.1, { inner: ln(open(limbPts.map(([x, y]): Pt => [x - 5, y - 5])), mix(P1.branch, '#ffffff', 0.3), 6) });
    for (const [dy, bend] of [[-10, -8], [0, 0], [10, 8]] as const) s += shape(taper([[114, 54 + dy * 0.4], [140, 52 + dy], [158, 50 + dy + bend]], 8, 3), P1.claw, 2.2);
    out.push(part('p1.charm.branch', 172, 92, 30, 0, s, k));
  }
  // A pink tag with a figure.
  {
    let s = ln('M46 0C36 10 38 22 46 26C54 22 56 10 46 0Z', P1.pinkTag, 3.4) + ln('M46 0C36 10 38 22 46 26C54 22 56 10 46 0Z', lineFor(P1.pinkTag), 1, 0.7);
    const tag = group('rotate(18 46 66)', shape(rrect(18, 30, 56, 70, 4), P1.pinkTag, 3.1, { inner: ln(rrect(24, 36, 44, 58, 3), lineFor(P1.pinkTag), 1.2, 0.6) }) + shape(sparkD(46, 64, 19, 8, 0.2), P1.starburst, 2.2));
    s += tag;
    out.push(part('p1.charm.pinktag', 92, 112, 46, 0, s, k));
  }
  // A green leaf, spiky like a star.
  {
    let s = string(52, 36, lineFor(P1.leafCharm), 3);
    for (const a of [1.1, 1.9, 2.7, 0.3, -0.5]) s += leafWithVein(52, 40, 46, a, P1.leafCharm, 2.5);
    out.push(part('p1.charm.leaf', 104, 112, 52, 0, s, k));
  }
  // A green spiky lizard with a red head.
  {
    const spine: Pt[] = [[150, 4], [136, 26], [104, 44], [70, 56], [40, 70]];
    let s = '';
    for (let i = 0; i < 6; i++) {
      const t = 0.15 + i * 0.14;
      const idx = Math.min(spine.length - 2, Math.floor(t * (spine.length - 1)));
      const f = t * (spine.length - 1) - idx;
      const a = spine[idx]!;
      const b = spine[idx + 1]!;
      const x = a[0] + (b[0] - a[0]) * f;
      const y = a[1] + (b[1] - a[1]) * f;
      s += shape(poly([[x - 8, y - 6], [x - 2, y - 24 + i], [x + 6, y - 6]]), P1.spine, 2);
    }
    s += shape(taper(spine, 16, 30), P1.lizard, 3.1, { inner: ln(open(spine.map(([x, y]): Pt => [x + 4, y + 9])), mix(P1.lizard, '#ffffff', 0.35), 6) });
    s += shape(smooth([[44, 60], [24, 72], [10, 86], [22, 92], [44, 84], [54, 72]]), P1.lizardHead, 2.8);
    s += closedEye(42, 70, 3, lineFor(P1.lizardHead), 2) + ln('M14 86L40 80', lineFor(P1.lizardHead), 2);
    s += shape(taper([[92, 50], [96, 66], [90, 76]], 7, 4), P1.lizard, 2) + shape(taper([[124, 34], [132, 50], [128, 60]], 7, 4), P1.lizard, 2);
    out.push(part('p1.charm.lizard', 170, 100, 150, 0, s, k));
  }
  // A little brown figure hanging by its hands, "??" under it.
  {
    let s = string(46, 14);
    s += shape(taper([[40, 12], [38, 26], [36, 40]], 6, 5), P1.imp, 2) + shape(taper([[52, 12], [54, 26], [56, 40]], 6, 5), P1.imp, 2);
    s += shape(smooth([[36, 40], [34, 54], [40, 66], [52, 66], [58, 54], [56, 40], [46, 36]]), P1.imp, 2.5);
    s += shape(taper([[40, 64], [36, 76], [34, 86]], 7, 5), P1.imp, 2) + shape(taper([[52, 64], [58, 76], [60, 84]], 7, 5), P1.imp, 2);
    s += shape(circle(46, 30, 10), P1.imp, 2.5) + shape(poly([[38, 24], [34, 14], [42, 20]]), P1.imp, 1.7) + shape(poly([[52, 20], [60, 14], [56, 24]]), P1.imp, 1.7);
    s += closedEye(42, 30, 2.4, lineFor(P1.imp), 1.7) + closedEye(50, 30, 2.4, lineFor(P1.imp), 1.7);
    s += lettering('??', 26, 92, 30, 22, '#8d818e', 3.2, rng);
    out.push(part('p1.charm.imp', 92, 128, 46, 0, s, k));
  }
  // A small grey box.
  {
    let s = string(36, 22);
    s += shape(poly([[16, 30], [52, 30], [52, 70], [16, 70]]), P1.greyBox, 3.1);
    s += shape(poly([[16, 30], [26, 22], [62, 22], [52, 30]]), mix(P1.greyBox, '#ffffff', 0.3), 2.8);
    s += shape(poly([[52, 30], [62, 22], [62, 62], [52, 70]]), mix(P1.greyBox, P1.dial, 0.6), 2.8);
    s += shape(circle(34, 50, 9), P1.dial, 2.2) + ln('M34 50L40 45', lineFor(P1.dial), 2.2);
    out.push(part('p1.charm.box', 72, 80, 36, 0, s, k));
  }
  return out;
}

// ================================================================ parts

/** Every prop of the first painting's room. */
export function painting1Parts(): PartArt[] {
  return [
    cube(), arm(), lamp(), crystalTree(), gift(), starfolk(), flower(), rootling(), shade(), bang(),
    portrait(), sign(), eyeLeaf(), marks(), bed(), whaleToy(), rootDoor(), ...charms(),
  ];
}

// ================================================================ painted planes

type Ctx = CanvasRenderingContext2D;

/** Fills and outlines an SVG path on a canvas. */
function paint(ctx: Ctx, d: string, fillC: string | null, w = 0, line?: string, alpha = 1): void {
  const p = new Path2D(d);
  ctx.globalAlpha = alpha;
  if (fillC) {
    ctx.fillStyle = fillC;
    ctx.fill(p);
  }
  if (w > 0) {
    ctx.strokeStyle = line ?? lineFor(fillC ?? P1.stone);
    ctx.lineWidth = w;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke(p);
  }
  ctx.globalAlpha = 1;
}

function stroke(ctx: Ctx, d: string, color: string, w: number, alpha = 1): void {
  paint(ctx, d, null, w, color, alpha);
}

/** Points along a polyline, `step` apart, pushed sideways by `jitter()`. */
function roughen(pts: readonly Pt[], step: number, jitter: (i: number) => number): Pt[] {
  const out: Pt[] = [];
  let k = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / len;
    const ny = (b[0] - a[0]) / len;
    const n = Math.max(1, Math.round(len / step));
    for (let j = 0; j < n; j++) {
      const t = j / n;
      const off = jitter(k++);
      out.push([a[0] + (b[0] - a[0]) * t + nx * off, a[1] + (b[1] - a[1]) * t + ny * off]);
    }
  }
  out.push(pts[pts.length - 1]!);
  return out;
}

/** An area of the wide shot (world px) a plane is painted over. */
interface Area {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * A plane with scroll factor `s`, painted in the coordinates of the wide
 * shot: its canvas covers `area` there, wherever the parallax puts it.
 */
function plane(s: number, res: number, depth: number, area: Area, seed: string, draw: (ctx: Ctx, rng: Rng) => void): LayerSpec {
  const o = inWide(s, area.x0, area.y0);
  const w = area.x1 - area.x0;
  const h = area.y1 - area.y0;
  return {
    scroll: s,
    res,
    depth,
    area: { x: o.x, y: o.y, w, h },
    draw: (ctx) => {
      ctx.save();
      ctx.translate(-area.x0, -area.y0);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      draw(ctx, new Rng(hashSeed(seed)));
      applyGrain(ctx, area.x0 - 2, area.y0 - 2, w + 4, h + 4);
      ctx.restore();
    },
  };
}

// ---------------------------------------------------------------- the stone world

/**
 * The pale world of cracked stone around the box: a border of grey slabs
 * parted by cracks, the paler ground inside its ragged edge.
 */
function paintStoneWorld(ctx: Ctx, rng: Rng, area: Area): void {
  ctx.fillStyle = P1.stone;
  ctx.fillRect(area.x0, area.y0, area.x1 - area.x0, area.y1 - area.y0);
  const crack = lineFor(P1.stone);
  // The border as thick on screen as the painting's (its bottom a little thicker).
  const top = WIDE_TOP + 64;
  const bottom = WIDE_TOP + 1237.5 - 96;
  const left = 60;
  const right = 2140;
  // The ragged edge of the inner world: long wobbles and a few bites.
  const bites = new Set<number>();
  const corners: Pt[] = [[left, top], [right, top], [right, bottom], [left, bottom], [left, top]];
  const edge = roughen(corners, 34, (i) => {
    if (rng.chance(0.08)) bites.add(i);
    return (bites.has(i) ? -1 : 1) * rng.range(4, 15) * (i % 2 ? 1 : 0.6);
  });
  const inner = smooth(edge, 0.7);
  paint(ctx, inner, P1.world, 4.6, crack);
  // Slabs in the border: cracks from the edge out to the frame.
  const out = 400;
  const spokes = (from: Pt, dir: Pt): void => {
    const pts: Pt[] = [from];
    let [x, y] = from;
    for (let k = 1; k <= 4; k++) {
      x += dir[0] * (out / 4) + rng.range(-16, 16) * Math.abs(dir[1]);
      y += dir[1] * (out / 4) + rng.range(-16, 16) * Math.abs(dir[0]);
      pts.push([x, y]);
    }
    stroke(ctx, poly(pts, false), crack, 4.2);
  };
  for (let x = left + rng.range(40, 120); x < right - 40; x += rng.range(130, 230)) {
    spokes([x, top + rng.range(-6, 6)], [0, -1]);
    spokes([x + rng.range(-40, 40), bottom + rng.range(-6, 6)], [0, 1]);
  }
  for (let y = top + rng.range(60, 140); y < bottom - 40; y += rng.range(140, 240)) {
    spokes([left + rng.range(-6, 6), y], [-1, 0]);
    spokes([right + rng.range(-6, 6), y + rng.range(-40, 40)], [1, 0]);
  }
  // Big slabs along the bottom, as in the painting.
  const slabTop: Pt[] = [];
  for (let x = area.x0; x <= area.x1; x += 60) slabTop.push([x, bottom + 46 + rng.range(-8, 8)]);
  stroke(ctx, open(slabTop, 0.8), crack, 4.2);
  // A few cracks run a little way into the pale ground.
  for (const [x, y, len, dir] of [
    [300, top, 90, 1], [760, top, 60, 1], [1420, top, 70, 1], [1980, top, 110, 1], [left, 520, 80, 0], [right, 640, 70, 0], [520, bottom, 70, -1], [1700, bottom, 60, -1],
  ] as const) {
    const pts: Pt[] = [[x, y]];
    let cx = x;
    let cy = y;
    for (let k = 0; k < 3; k++) {
      if (dir === 0) {
        cx += (x < 1000 ? 1 : -1) * len / 3;
        cy += rng.range(-18, 18);
      } else {
        cx += rng.range(-16, 16);
        cy += (dir * len) / 3;
      }
      pts.push([cx, cy]);
    }
    stroke(ctx, poly(pts, false), crack, 3.4, 0.9);
  }
}

// ---------------------------------------------------------------- the sky

/** A crescent: the disc (cx, cy, r) less a disc shifted by (dx, dy)·r of radius k·r. */
function crescent(cx: number, cy: number, r: number, dx: number, dy: number, k: number): string {
  const ox = cx + r * dx;
  const oy = cy + r * dy;
  const r2 = r * k;
  const d = Math.hypot(ox - cx, oy - cy);
  const tc = Math.atan2(oy - cy, ox - cx);
  const al = Math.acos((r * r + d * d - r2 * r2) / (2 * r * d));
  const be = Math.acos((r2 * r2 + d * d - r * r) / (2 * r2 * d));
  const pts: Pt[] = [];
  const N = 28;
  for (let i = 0; i <= N; i++) {
    const a = tc + al + (i / N) * (2 * Math.PI - 2 * al);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  for (let i = 1; i < N; i++) {
    const a = tc + Math.PI + be - (i / N) * 2 * be;
    pts.push([ox + Math.cos(a) * r2, oy + Math.sin(a) * r2]);
  }
  return poly(pts);
}

/** An eye under a heavy lid: pink below, the lid's colour above its edge. */
function lidEye(ctx: Ctx, cx: number, cy: number, r: number, lid: string, lidDown: number): void {
  const eye = ellipsePath(cx, cy, r, r);
  paint(ctx, eye, P1.eye);
  ctx.save();
  ctx.clip(new Path2D(eye));
  const edge = cy - r + 2 * r * lidDown;
  paint(ctx, `M${cx - r - 2} ${cy - r - 2}H${cx + r + 2}V${edge - r * 0.18}Q${cx} ${edge + r * 0.32} ${cx - r - 2} ${edge - r * 0.18}Z`, lid);
  ctx.restore();
  stroke(ctx, `M${cx - r * 0.98} ${edge - r * 0.2}Q${cx} ${edge + r * 0.3} ${cx + r * 0.98} ${edge - r * 0.2}`, lineFor(lid), 4.2);
  paint(ctx, eye, null, 3.4, lineFor(P1.eye));
}

/**
 * The sky of the painting: the pale blue crescent moon with a closed pink
 * eye and teal stars at the top left; the orange sun with its sad face and
 * downcast pink eyes at the top right, and the star creature under it.
 */
function paintSky(ctx: Ctx): void {
  // Placed as in the painting: y by the share of its height (the wide shot
  // is 1237.5 px tall), sizes at the same scale.
  const Y = (f: number): number => WIDE_TOP + f * 1237.5;
  // The moon.
  const my = Y(0.134);
  const moon = crescent(257, my, 96, 0.5, -0.36, 0.8);
  paint(ctx, moon, P1.moon, 5);
  lidEye(ctx, 219, my - 36, 32, P1.moonLid, 0.44);
  stroke(ctx, `M195 ${my + 26}L251 ${my + 26}`, lineFor(P1.moon), 4.4);
  // Four stars beside it.
  for (const [x, f, r, c, rot] of [
    [452, 0.134, 18, P1.starTeal, 0.1], [543, 0.125, 19, P1.starMint, -0.15], [482, 0.17, 17, P1.starLime, 0.25], [386, 0.198, 16, P1.starPink, -0.2],
  ] as const) {
    paint(ctx, starD(x, Y(f), r, rot), c, 3.8);
  }
  // The sun: a peach face in a ring of yellow spikes.
  const sx = 1870;
  const sy = Y(0.14);
  const R = 62;
  const rays: Pt[] = [];
  const n = 20;
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 + 0.05;
    const rr = i % 2 ? R + 3 : R + 25 + (i % 4 === 0 ? 5 : 0);
    rays.push([sx + Math.cos(a) * rr, sy + Math.sin(a) * rr]);
  }
  paint(ctx, poly(rays), P1.ray, 4);
  paint(ctx, ellipsePath(sx, sy, R, R * 0.96), P1.sun, 4.6);
  lidEye(ctx, sx - 21, sy - 9, 17, P1.sunLid, 0.56);
  lidEye(ctx, sx + 24, sy - 7, 17, P1.sunLid, 0.56);
  stroke(ctx, `M${sx - 14} ${sy + 36}Q${sx + 1} ${sy + 22} ${sx + 16} ${sy + 36}`, lineFor(P1.sun), 4.6);
  // Its star creature: four grey blades round a small teal body.
  const cx = 1960;
  const cy = Y(0.27);
  for (const [a, len] of [[-2.35, 78], [-0.8, 80], [2.05, 74], [1.05, 72]] as const) {
    const tip: Pt = [cx + Math.cos(a) * len, cy + Math.sin(a) * len];
    const side = (k: number): Pt => [cx + Math.cos(a) * len * 0.3 + Math.cos(a + Math.PI / 2) * k, cy + Math.sin(a) * len * 0.3 + Math.sin(a + Math.PI / 2) * k];
    paint(ctx, poly([[cx, cy], side(11), tip, side(-11)]), P1.blade, 3.8);
  }
  paint(ctx, smooth([[cx - 22, cy + 2], [cx - 18, cy - 14], [cx - 6, cy - 22], [cx + 8, cy - 22], [cx + 20, cy - 12], [cx + 22, cy + 6], [cx + 12, cy + 20], [cx - 12, cy + 20]]), P1.skyStar, 4);
  paint(ctx, poly([[cx - 6, cy - 21], [cx, cy - 34], [cx + 6, cy - 21]]), P1.skyStar, 3.4);
  for (const ex of [-8, 8]) stroke(ctx, `M${cx + ex - 5} ${cy - 4}Q${cx + ex} ${cy + 1} ${cx + ex + 5} ${cy - 4}`, mix(P1.eye, '#8a6a80', 0.35), 2.6);
  stroke(ctx, `M${cx - 4} ${cy + 9}H${cx + 4}`, lineFor(P1.skyStar), 2.4);
}

// ---------------------------------------------------------------- the box

/**
 * The box itself, as its back wall: the pink lid seen from above, the lilac
 * walls, the torn cream sheet pasted inside and spilling over the edges, and
 * the lines of the box showing through the paper. Below the floor, the
 * bottom of the box's front, where the charms hang.
 */
function paintBox(ctx: Ctx, rng: Rng): void {
  const B = BOX;
  const L = -60;
  const Rr = 2260;
  // The front of the box below its floor.
  paint(ctx, `M${L} 640H${Rr}V${B.bottom}H${L}Z`, P1.wall);
  stroke(ctx, `M${L} ${B.bottom}H${Rr}`, lineFor(P1.wall), 3.4);
  // Inside: back wall, side walls and floor.
  paint(ctx, `M${B.wallLeft} ${B.lidFront}H${B.wallRight}V${B.wallFoot}H${B.wallLeft}Z`, P1.wall);
  paint(ctx, `M${L} ${B.lidFront}H${B.wallLeft}V${B.wallFoot}L0 ${B.floor}L${L} ${B.floor + 6}Z`, P1.wallSide);
  paint(ctx, `M${B.wallRight} ${B.lidFront}H${Rr}V${B.floor + 6}L2200 ${B.floor}L${B.wallRight} ${B.wallFoot}Z`, P1.wallSide);
  paint(ctx, `M${B.wallLeft} ${B.wallFoot}H${B.wallRight}L2200 ${B.floor}L${Rr} ${B.floor + 6}V700H${L}V${B.floor + 6}L0 ${B.floor}Z`, P1.wallFloor);
  // The lid.
  const lid = `M${B.lidBackLeft} ${B.lidBack}H${B.lidBackRight}L2200 ${B.lidFront}H0Z`;
  paint(ctx, lid, P1.lid, 3.6);
  // The torn sheet: big lobes spill over the lid, a tongue over the right
  // wall; its edge wobbles like torn paper, with a few small bites.
  const outline: Pt[] = [
    [40, 470], [58, 420], [110, 402], [170, 396], [236, 352], [300, 318], [380, 322], [430, 360], [500, 372], [560, 330], [640, 282], [740, 262],
    [840, 276], [900, 312], [940, 356], [990, 372], [1040, 338], [1110, 300], [1200, 290], [1280, 312], [1330, 350], [1390, 366], [1450, 326],
    [1520, 292], [1600, 300], [1660, 336], [1710, 372], [1770, 392], [1850, 402], [1940, 418], [1972, 446], [1936, 470], [1850, 466], [1814, 520],
    [1826, 600], [1840, 720], [30, 720], [44, 650], [66, 590], [44, 520],
  ];
  const edge = roughen(outline, 16, () => (rng.chance(0.07) ? -rng.range(5, 9) : rng.range(-2.4, 2.4)));
  const sheet = smooth(edge, 0.8);
  paint(ctx, sheet, P1.paper);
  ctx.save();
  ctx.clip(new Path2D(sheet));
  // Where it lies on the floor, and where it spills onto the lid, it catches more light.
  paint(ctx, `M${B.wallLeft} ${B.wallFoot}H${B.wallRight}L2200 ${B.floor}V720H0V${B.floor}Z`, P1.paperFloor);
  paint(ctx, lid, P1.paperLit);
  // A few creases.
  for (const [x0, y0, x1, y1] of [[700, 280, 800, 380], [1150, 300, 1210, 390], [1500, 300, 1560, 390], [300, 430, 420, 560], [960, 450, 1080, 580], [1560, 440, 1680, 590]] as const) {
    stroke(ctx, `M${x0} ${y0}Q${(x0 + x1) / 2 + 14} ${(y0 + y1) / 2} ${x1} ${y1}`, lineFor(P1.paper), 1.4, 0.35);
  }
  ctx.restore();
  paint(ctx, sheet, null, 3, lineFor(P1.paper));
  // The box's edges show through the paper.
  const edges = mix(lineFor(P1.wall), lineFor(P1.paper), 0.5);
  stroke(ctx, `M${B.wallLeft} ${B.lidFront}V${B.wallFoot}L-40 ${B.floor + 14}M${B.wallRight} ${B.lidFront}V${B.wallFoot}L2240 ${B.floor + 14}M${B.wallLeft} ${B.wallFoot}H${B.wallRight}`, edges, 2.8, 0.85);
  // The lid's front edge over everything.
  stroke(ctx, `M-40 ${B.lidFront}H2240`, lineFor(P1.lid), 3.4);
}

/**
 * The out-of-focus strip at the lens (RoomRuntime's foreground): scraps of
 * the torn paper and a few pastel crystals lying in front of the box,
 * blurred, in the painting's colours.
 */
export function paintBoxForeground(ctx: Ctx, w: number, h: number, rng: Rng): void {
  ctx.save();
  ctx.filter = 'blur(1.8px)';
  ctx.lineJoin = 'round';
  let x = rng.range(-40, 160);
  while (x < w) {
    // A crumpled scrap of the sheet.
    const sw = rng.range(90, 170);
    const sh = rng.range(24, 50);
    const scrap: Pt[] = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      scrap.push([x - sw / 2 + t * sw, h + 6 - Math.sin(t * Math.PI) * sh * rng.range(0.7, 1.15)]);
    }
    scrap.push([x + sw / 2, h + 10], [x - sw / 2, h + 10]);
    const tone = rng.pick([P1.paper, P1.paperLit, P1.wall, P1.lid]);
    paint(ctx, poly(scrap), tone, 2.2, lineFor(tone), 0.9);
    // Now and then a crystal beside it.
    if (rng.chance(0.55)) {
      const cx = x + rng.range(-sw * 0.6, sw * 0.6);
      const ch = rng.range(40, 92);
      const cw = ch * rng.range(0.24, 0.32);
      const lean = rng.range(-0.28, 0.28);
      const fillC = rng.pick([P1.starTeal, P1.crystal, P1.starPink, P1.crystalLilac]);
      paint(ctx, poly([[cx - cw / 2, h + 6], [cx - cw / 2 + lean * ch * 0.7, h - ch * 0.75], [cx + lean * ch, h - ch], [cx + cw / 2 + lean * ch * 0.7, h - ch * 0.75], [cx + cw / 2, h + 6]]), fillC, 2.2, lineFor(fillC), 0.9);
    }
    x += rng.range(260, 560);
  }
  ctx.restore();
  applyGrain(ctx, -2, -2, w + 4, h + 4);
}

/**
 * A thin border of the painting's cracked stone round the screen (`w` × `h`,
 * `t` thick): grey slabs parted by cracks, a ragged inner edge.
 */
export function paintScreenFrame(ctx: Ctx, w: number, h: number, t: number, rng: Rng): void {
  const inner = roughen([[t, t], [w - t, t], [w - t, h - t], [t, h - t], [t, t]], 26, () => rng.range(-t * 0.22, t * 0.22));
  const edge = smooth(inner, 0.6);
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.fillStyle = P1.stone;
  ctx.fill(new Path2D(`M-4 -4H${w + 4}V${h + 4}H-4Z${edge}`), 'evenodd');
  const crack = lineFor(P1.stone);
  // Cracks across the band part it into slabs.
  const across = (x0: number, y0: number, x1: number, y1: number): void => {
    const mx = (x0 + x1) / 2 + rng.range(-3, 3);
    const my = (y0 + y1) / 2 + rng.range(-3, 3);
    stroke(ctx, `M${x0} ${y0}L${mx} ${my}L${x1} ${y1}`, crack, 1.8);
  };
  for (let x = rng.range(40, 120); x < w - 30; x += rng.range(90, 170)) {
    across(x, t - 1, x + rng.range(-6, 6), -2);
    across(x + rng.range(-30, 30), h - t + 1, x + rng.range(-6, 6), h + 2);
  }
  for (let y = rng.range(50, 120); y < h - 30; y += rng.range(90, 160)) {
    across(t - 1, y, -2, y + rng.range(-6, 6));
    across(w - t + 1, y + rng.range(-30, 30), w + 2, y + rng.range(-6, 6));
  }
  paint(ctx, edge, null, 2.4, crack);
  ctx.restore();
  applyGrain(ctx, -2, -2, w + 4, h + 4);
}

/** The painted planes of the room, far to near (the nursery theme's layers). */
export function painting1Layers(): LayerSpec[] {
  const stoneArea: Area = { x0: -60, y0: WIDE_TOP - 24, x1: 2260, y1: 1130 };
  return [
    plane(PLANE.stone, 0.5, -900, stoneArea, 'p1:stone', (ctx, rng) => paintStoneWorld(ctx, rng, stoneArea)),
    plane(PLANE.sky, 0.6, -890, { x0: 120, y0: WIDE_TOP - 10, x1: 2110, y1: 300 }, 'p1:sky', (ctx) => paintSky(ctx)),
    plane(PLANE.wall, 1, -150, { x0: -60, y0: BOX.lidBack - 16, x1: 2260, y1: BOX.bottom + 12 }, 'p1:box', (ctx, rng) => paintBox(ctx, rng)),
  ];
}
