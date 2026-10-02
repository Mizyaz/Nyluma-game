import { smooth, type Pt } from '../../render/2d/svg';
import type { PartArt } from '../../render/2d/rig/rigTypes';

// The Sun and the infant Moon as the first painting draws them, and the
// ancient Moon of the second, in its bold black ink: they look in from the
// corners of the screen, so they keep the painting's heavy contours (the
// rest of the cast has the thin, soft lines).
//
// The Sun: a lumpy apricot face in a ring of fat yellow spikes, two round
// eyes with pink irises under heavy black lids, a small frown. The Moon: a
// pale blue crescent opening to the right, one big pink eye under a heavy
// lid, a short mouth, and little stars with faces in its curve.
//
// Each eye is four parts: the socket (white, in the face), the iris (moves
// with the gaze), the heavy lid (a dark crescent over the eye's top, as
// painted) and the shut eye (the face's colour with the lash line), shown
// for a blink. Each mood adds a few more, all in the same ink (Celestial.ts
// puts them together): a lower lid, a happy squeeze, a brow, a mouth; and
// each page may dress them: a nightcap, a plaster, freckles, a scarf, a
// crown of crystal, flowers, sweat, tears, Zs and notes (sky.json).

const INK = '#2b2228';
const n = (v: number): number => Math.round(v * 100) / 100;

let ids = 0;

/** A filled shape in bold ink, with things drawn inside it (clipped to it). */
function inked(d: string, fill: string, w: number, inside = ''): string {
  let s = `<path d="${d}" fill="${fill}"/>`;
  if (inside) {
    const id = `sky${ids++}`;
    s += `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inside}</g>`;
  }
  return s + `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
}

const pen = (d: string, color: string, w: number, o = 1): string =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${o !== 1 ? ` opacity="${o}"` : ''}/>`;
const disc = (cx: number, cy: number, r: number, fill: string, o = 1): string =>
  `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="${fill}"${o !== 1 ? ` opacity="${o}"` : ''}/>`;
const oval = (cx: number, cy: number, rx: number, ry: number): string =>
  `M${n(cx - rx)} ${n(cy)}A${n(rx)} ${n(ry)} 0 1 0 ${n(cx + rx)} ${n(cy)}A${n(rx)} ${n(ry)} 0 1 0 ${n(cx - rx)} ${n(cy)}Z`;
const ovalFill = (cx: number, cy: number, rx: number, ry: number, fill: string, o = 1): string =>
  `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}"${o !== 1 ? ` opacity="${o}"` : ''}/>`;

function radial(cx: number, cy: number, count: number, r: (a: number) => number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const rr = r(a);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

function skyPart(key: string, w: number, h: number, px: number, py: number, body: string): PartArt {
  return { key, w, h, px, py, body, scale: 2 };
}

// ------------------------------------------------------------------ the Sun

const SUN = {
  face: '#f6b582',
  rim: '#e48c5c',
  cheek: '#f48d9c',
  ray: '#f3e46a',
  rayLight: '#faf3a6',
  rayLime: '#d8e46c',
  white: '#fffaf2',
  iris: '#ee6fae',
  irisDeep: '#c8418a',
  mouth: '#4a3438',
};

/** Where the Sun's eyes sit in its face (part px; the face's middle is 160, 160). */
const SUN_EYES: Pt[] = [
  [114, 142],
  [206, 142],
];
const SUN_SOCKET = 30;

function sunFace(): string {
  return smooth(radial(160, 160, 72, (a) => 112 + 6 * Math.sin(3 * a + 0.7) + 3.5 * Math.sin(5 * a + 2.1) + 2 * Math.sin(9 * a + 0.3)));
}

function sunDisk(): PartArt {
  const d = sunFace();
  let inside = '';
  // Pencil shading along the inside of the edge, and hatching low on the right.
  inside += pen(d, SUN.rim, 26, 0.42);
  for (let i = 0; i < 10; i++) {
    const x = 192 + i * 7;
    inside += pen(`M${x} ${226 - i * 3}L${x - 20} ${266 - i * 3}`, SUN.rim, 2.2, 0.4);
  }
  // Rosy cheeks under the eyes.
  inside += ovalFill(98, 190, 19, 11, SUN.cheek, 0.55) + ovalFill(222, 190, 19, 11, SUN.cheek, 0.55);
  let s = inked(d, SUN.face, 5, inside);
  // The sockets: white, in bold ink (the irises and lids go over them).
  for (const [x, y] of SUN_EYES) s += inked(oval(x, y, SUN_SOCKET, SUN_SOCKET), SUN.white, 4.5);
  return skyPart('sun.disk', 320, 320, 160, 160, s);
}

function sunEye(): PartArt {
  // A pink iris, low in the eye as in the painting, with a glint.
  let s = disc(24, 27, 17, SUN.iris);
  s += pen(oval(24, 27, 15.5, 15.5), SUN.irisDeep, 3, 0.85);
  s += disc(24, 30, 7, SUN.irisDeep, 0.55);
  s += disc(18.5, 21, 4, '#ffffff', 0.95) + disc(30, 33, 1.8, '#ffffff', 0.8);
  return skyPart('sun.eye', 48, 48, 24, 24, s);
}

/** The eye's outline: a circle or an oval (rx, ry) about (cx, cy), as points from angle a0 to a1. */
function arcPts(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, count = 20): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= count; i++) {
    const a = a0 + ((a1 - a0) * i) / count;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
}

/**
 * The heavy lid: the top of the eye filled dark down to a line that sags a
 * little in the middle (`cover`: how much of the eye's height it hides).
 */
function heavyLid(key: string, rx: number, ry: number, cover: number): PartArt {
  const w = Math.ceil(rx * 2 + 8);
  const h = Math.ceil(ry * 2 + 8);
  const cx = w / 2;
  const cy = h / 2;
  // Where the lid's edge meets the eye's outline, either side.
  const y = cy - ry + 2 * ry * cover;
  const half = Math.asin(Math.min(1, Math.max(-1, (y - cy) / ry)));
  const top = arcPts(cx, cy, rx - 0.5, ry - 0.5, Math.PI - half, 2 * Math.PI + half);
  const [x0, y0] = top[0]!;
  const [x1, y1] = top[top.length - 1]!;
  let d = `M${n(x0)} ${n(y0)}`;
  for (const [x, yy] of top.slice(1)) d += `L${n(x)} ${n(yy)}`;
  d += `Q${n(cx)} ${n(Math.max(y0, y1) + ry * 0.22)} ${n(x0)} ${n(y0)}Z`;
  let s = `<path d="${d}" fill="#33252e"/>`;
  // A soft sheen along it, and the lid's crease above.
  s += pen(`M${n(cx - rx * 0.45)} ${n(cy - ry * 0.62)}Q${n(cx)} ${n(cy - ry * 0.8)} ${n(cx + rx * 0.45)} ${n(cy - ry * 0.62)}`, '#6b5560', 2.2, 0.8);
  s += pen(`M${n(x1)} ${n(y1)}Q${n(cx)} ${n(Math.max(y0, y1) + ry * 0.22)} ${n(x0)} ${n(y0)}`, INK, 4);
  return skyPart(key, w, h, cx, cy, s);
}

/** The eye shut: the face's colour over it, with the lash line curving down. */
function shutEye(key: string, rx: number, ry: number, fill: string): PartArt {
  const w = Math.ceil(rx * 2 + 12);
  const h = Math.ceil(ry * 2 + 12);
  const cx = w / 2;
  const cy = h / 2;
  let s = inked(oval(cx, cy, rx, ry), fill, 4.5);
  s += pen(`M${n(cx - rx * 0.85)} ${n(cy - ry * 0.05)}Q${n(cx)} ${n(cy + ry * 0.55)} ${n(cx + rx * 0.85)} ${n(cy - ry * 0.05)}`, INK, 5);
  for (const t of [-0.5, 0, 0.5]) {
    const x = cx + t * rx * 0.75;
    const yy = cy + ry * 0.26 * (1 - t * t * 1.6);
    s += pen(`M${n(x)} ${n(yy)}L${n(x + t * 4)} ${n(yy + ry * 0.3)}`, INK, 3);
  }
  return skyPart(key, w, h, cx, cy, s);
}

function sunLid(): PartArt {
  return heavyLid('sun.lid', SUN_SOCKET, SUN_SOCKET, 0.36);
}

function sunShut(): PartArt {
  return shutEye('sun.shut', SUN_SOCKET + 1, SUN_SOCKET + 1, SUN.face);
}

function sunMouth(): PartArt {
  // The small tired frown.
  let s = pen(`M10 28Q19 11 32 11Q45 11 54 28`, INK, 5.5);
  s += pen(`M8 27L12 31M56 27L52 31`, INK, 3.5);
  return skyPart('sun.mouth', 64, 36, 32, 18, s);
}

function sunMouthOpen(): PartArt {
  // Open for a cough or a laugh: dark, with a few teeth and a pink tongue.
  const d = smooth([[6, 22], [16, 9], [32, 6], [48, 9], [58, 22], [50, 37], [32, 43], [14, 37]]);
  let inside = '';
  for (const x of [17, 27, 37]) inside += `<path d="M${x} 6L${x + 9} 6L${x + 7.5} 15L${x + 1.5} 15Z" fill="#fbf5e6" stroke="${INK}" stroke-width="2"/>`;
  inside += ovalFill(32, 36, 11, 6, '#f59cb4');
  const s = inked(d, SUN.mouth, 4.5, inside);
  return skyPart('sun.mouth.open', 64, 48, 32, 22, s);
}

/** A fat spike, its base at the bottom (it tucks under the face's edge). */
function sunRay(): PartArt {
  const d = `M3 70Q15 40 27 6Q30 1 33 6Q45 40 57 70Z`;
  const s = inked(d, SUN.ray, 4.5, pen(`M30 18L30 58`, SUN.rayLight, 6, 0.8));
  return skyPart('sun.ray', 60, 74, 30, 70, s);
}

function sunRayBroken(): PartArt {
  // Bent and cracked, in the greener yellow: the Sun is unwell.
  const d = `M3 70Q13 46 18 32Q20 22 28 14Q34 6 36 12Q40 40 57 70Z`;
  const s = inked(d, SUN.rayLime, 4.5, pen(`M22 44L29 37L24 30`, INK, 2.5));
  return skyPart('sun.ray.broken', 60, 74, 30, 70, s);
}

// ------------------------------------------------------------------ the infant Moon

const MOON = {
  fill: '#c3e2ec',
  rim: '#94c3d4',
  white: '#fffaf2',
  iris: '#f07db2',
  irisDeep: '#d0508f',
  blush: '#f5b3cc',
};

/** Its eye (part px; the moon's middle is 130, 130). */
const MOON_EYE: Pt = [62, 118];
const MOON_SOCKET: Pt = [30, 25];

/** Crescent: disc (cx, cy, r) less a disc moved by (dx, dy)·r of radius k·r. */
function crescent(cx: number, cy: number, r: number, dx: number, dy: number, k: number): string {
  const ox = cx + r * dx;
  const oy = cy + r * dy;
  const r2 = r * k;
  const dd = Math.hypot(ox - cx, oy - cy);
  const tc = Math.atan2(oy - cy, ox - cx);
  const al = Math.acos((r * r + dd * dd - r2 * r2) / (2 * r * dd));
  const be = Math.acos((r2 * r2 + dd * dd - r * r) / (2 * r2 * dd));
  const pts: Pt[] = [];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const a = tc + al + (i / N) * (2 * Math.PI - 2 * al);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  for (let i = 1; i < N; i++) {
    const a = tc + Math.PI + be - (i / N) * 2 * be;
    pts.push([ox + Math.cos(a) * r2, oy + Math.sin(a) * r2]);
  }
  let d = `M${n(pts[0]![0])} ${n(pts[0]![1])}`;
  for (let i = 1; i < pts.length; i++) d += `L${n(pts[i]![0])} ${n(pts[i]![1])}`;
  return d + 'Z';
}

/** A little five-pointed star with a face. */
function star(cx: number, cy: number, r: number, fill: string, rot: number): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rot - Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.48 : r;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  let d = `M${n(pts[0]![0])} ${n(pts[0]![1])}`;
  for (let i = 1; i < pts.length; i++) d += `L${n(pts[i]![0])} ${n(pts[i]![1])}`;
  let s = inked(d + 'Z', fill, 3);
  const e = r * 0.2;
  s += disc(cx - e, cy - e * 0.2, r * 0.09, INK) + disc(cx + e, cy - e * 0.2, r * 0.09, INK);
  s += pen(`M${n(cx - e * 0.8)} ${n(cy + e * 0.9)}Q${n(cx)} ${n(cy + e * 1.6)} ${n(cx + e * 0.8)} ${n(cy + e * 0.9)}`, INK, Math.max(1.4, r * 0.09));
  return s;
}

function moonBaby(): PartArt {
  // A fat crescent opening to the right, as in the first painting.
  const d = crescent(130, 130, 112, 0.6, -0.1, 0.8);
  let inside = pen(d, MOON.rim, 24, 0.45);
  inside += ovalFill(54, 166, 15, 9, MOON.blush, 0.7);
  for (const [x0, y0, x1, y1] of [
    [30, 92, 34, 108],
    [36, 200, 50, 212],
    [86, 226, 102, 232],
  ] as const) {
    inside += pen(`M${x0} ${y0}L${x1} ${y1}`, MOON.rim, 2.4, 0.8);
  }
  let s = inked(d, MOON.fill, 5, inside);
  s += inked(oval(MOON_EYE[0], MOON_EYE[1], MOON_SOCKET[0], MOON_SOCKET[1]), MOON.white, 4.5);
  // Stars caught in its curve.
  s += star(184, 112, 15, '#f3e27a', 0.2) + star(222, 168, 11, '#9fe0b0', -0.3) + star(176, 196, 10, '#f6a9c8', 0.35) + star(228, 82, 8, '#8fd6d2', 0.1);
  return skyPart('moon.baby', 260, 260, 130, 130, s);
}

function moonBabyEye(): PartArt {
  let s = ovalFill(26, 25, 19, 15.5, MOON.iris);
  s += pen(oval(26, 25, 17.5, 14), MOON.irisDeep, 3, 0.85);
  s += ovalFill(26, 27.5, 7.5, 6.5, MOON.irisDeep, 0.5);
  s += disc(19.5, 19.5, 4.2, '#ffffff', 0.95) + disc(33, 31, 1.9, '#ffffff', 0.8);
  return skyPart('moon.baby.eye', 52, 46, 26, 23, s);
}

function moonBabyLid(): PartArt {
  return heavyLid('moon.baby.lid', MOON_SOCKET[0], MOON_SOCKET[1], 0.4);
}

function moonBabyShut(): PartArt {
  return shutEye('moon.baby.shut', MOON_SOCKET[0] + 1, MOON_SOCKET[1] + 1, MOON.fill);
}

function moonBabyMouth(): PartArt {
  const s = pen(`M6 12Q18 16 32 11`, INK, 4.5) + pen(`M4 9L7 12`, INK, 3);
  return skyPart('moon.baby.mouth', 40, 22, 20, 11, s);
}

// ------------------------------------------------------------------ the ancient Moon

const OLD = {
  fill: '#b3b3e0',
  rim: '#8d8cc7',
  white: '#f3f5f0',
  iris: '#9fd6a3',
  irisDeep: '#5f9f70',
  tear: '#a3dbee',
  tearDeep: '#7cc0dc',
  mouth: '#3a3446',
};

/** Its eye (part px; the moon's middle is 150, 150): an almond, wider than it is tall. */
const OLD_EYE: Pt = [62, 124];
const OLD_SOCKET: Pt = [30, 17];

/** An almond: two arcs meeting in sharp corners left and right. */
function almond(cx: number, cy: number, rx: number, ry: number): string {
  return `M${n(cx - rx)} ${n(cy)}Q${n(cx)} ${n(cy - ry * 2)} ${n(cx + rx)} ${n(cy)}Q${n(cx)} ${n(cy + ry * 2)} ${n(cx - rx)} ${n(cy)}Z`;
}

/** A drop hanging from its tip at (x, y), `s` long, in bold ink with a glint. */
function drop(x: number, y: number, s: number, fill: string, w: number): string {
  const d =
    `M${n(x)} ${n(y)}C${n(x + s * 0.2)} ${n(y + s * 0.42)} ${n(x + s * 0.48)} ${n(y + s * 0.68)} ${n(x + s * 0.46)} ${n(y + s * 0.98)}` +
    `C${n(x + s * 0.44)} ${n(y + s * 1.3)} ${n(x - s * 0.44)} ${n(y + s * 1.3)} ${n(x - s * 0.46)} ${n(y + s * 0.98)}` +
    `C${n(x - s * 0.48)} ${n(y + s * 0.68)} ${n(x - s * 0.2)} ${n(y + s * 0.42)} ${n(x)} ${n(y)}Z`;
  return inked(d, fill, w, ovalFill(x - s * 0.17, y + s * 0.88, s * 0.1, s * 0.17, '#ffffff', 0.85));
}

function moonOld(): PartArt {
  // A thinner crescent with sharp horns, opening to the right, as in the second painting.
  const d = crescent(150, 150, 132, 0.5, -0.12, 0.84);
  let inside = pen(d, OLD.rim, 26, 0.42);
  // Age: hatching along its back, and the creases of an old face.
  for (let i = 0; i < 9; i++) {
    const y = 188 + i * 9;
    inside += pen(`M${14 + i * 4} ${y}L${36 + i * 6} ${y + 16}`, OLD.rim, 2.2, 0.55);
  }
  for (const [x0, y0, x1, y1] of [
    [32, 150, 35, 172],
    [50, 222, 64, 236],
    [44, 94, 56, 80],
    [96, 264, 114, 268],
  ] as const) {
    inside += pen(`M${x0} ${y0}L${x1} ${y1}`, OLD.rim, 2.8, 0.9);
  }
  // Crow's feet beside the eye.
  inside += pen(`M22 118L12 112M22 126L11 127M23 134L14 141`, OLD.rim, 2.4, 0.9);
  let s = inked(d, OLD.fill, 5, inside);
  s += inked(almond(OLD_EYE[0], OLD_EYE[1], OLD_SOCKET[0], OLD_SOCKET[1]), OLD.white, 4.5);
  // The tears: a cascade of drops from the eye down the cheek.
  const drops: [number, number, number][] = [
    [64, 148, 11], [50, 164, 12], [77, 167, 11], [62, 186, 13], [45, 199, 10], [80, 200, 12],
    [58, 220, 13], [78, 235, 11], [63, 253, 11], [84, 268, 9],
  ];
  drops.forEach(([x, y, r], i) => {
    s += drop(x, y, r * 1.15, i % 3 === 0 ? OLD.tearDeep : OLD.tear, 2.6);
  });
  return skyPart('moon.old', 300, 300, 150, 150, s);
}

function moonOldEye(): PartArt {
  // A green iris with a big dark pupil, tired.
  let s = disc(24, 21, 12, OLD.iris);
  s += pen(oval(24, 21, 10.5, 10.5), OLD.irisDeep, 2.6, 0.9);
  s += disc(24, 22, 5.6, INK);
  s += disc(19.5, 16.5, 3, '#ffffff', 0.95) + disc(28.5, 25.5, 1.4, '#ffffff', 0.8);
  return skyPart('moon.old.eye', 48, 42, 24, 21, s);
}

function moonOldMouth(): PartArt {
  // A long tired line, a little crooked, with the lip's shadow under it.
  let s = pen(`M6 16Q14 10 24 11Q34 12 42 17`, INK, 5);
  s += pen(`M4 19L8 15`, INK, 3.2);
  s += pen(`M16 21Q24 23 31 21`, OLD.rim, 2.6, 0.9);
  return skyPart('moon.old.mouth', 48, 28, 24, 14, s);
}

function moonOldLaugh(): PartArt {
  // The old laugh: wide open, three teeth left, the tongue deep in.
  const d = smooth([[4, 10], [22, 6], [42, 10], [38, 25], [24, 33], [9, 26]]);
  let inside = '';
  for (const x of [11, 19, 28]) inside += `<path d="M${x} 6L${x + 7} 6L${x + 6} 13L${x + 1} 13Z" fill="#fbf5e6" stroke="${INK}" stroke-width="1.8"/>`;
  inside += ovalFill(24, 29, 9, 5, '#f59cb4');
  return skyPart('moon.old.mouth.laugh', 48, 38, 24, 16, inked(d, OLD.mouth, 4, inside));
}

// ------------------------------------------------------------------ eyes for every mood

/** An eye's outline: an oval (the Sun's, the infant Moon's) or an almond (the ancient Moon's). */
type EyeShape = 'oval' | 'almond';

function eyeOutline(shape: EyeShape, cx: number, cy: number, rx: number, ry: number): string {
  return shape === 'oval' ? oval(cx, cy, rx, ry) : almond(cx, cy, rx, ry);
}

/**
 * A heavy lid for any eye: the top of its outline filled dark down to a line
 * that sags a little in the middle (`cover`: how much of the eye it hides).
 */
function lid(key: string, shape: EyeShape, rx: number, ry: number, cover: number): PartArt {
  const w = Math.ceil(rx * 2 + 8);
  const h = Math.ceil(ry * 2 + 8);
  const cx = w / 2;
  const cy = h / 2;
  const y = cy - ry + 2 * ry * cover;
  let top: Pt[];
  if (shape === 'oval') {
    const half = Math.asin(Math.min(1, Math.max(-1, (y - cy) / ry)));
    top = arcPts(cx, cy, rx - 0.5, ry - 0.5, Math.PI - half, 2 * Math.PI + half);
  } else {
    // The almond's top is a parabola: y = cy − ry·(1 − (x − cx)² / rx²).
    const u = (rx - 0.6) * Math.sqrt(Math.max(0, 1 - (cy - y) / ry));
    top = [];
    for (let i = 0; i <= 20; i++) {
      const x = cx - u + (2 * u * i) / 20;
      top.push([x, cy - (ry - 0.5) * (1 - ((x - cx) / rx) ** 2)]);
    }
  }
  const [x0, y0] = top[0]!;
  const [x1, y1] = top[top.length - 1]!;
  let d = `M${n(x0)} ${n(y0)}`;
  for (const [x, yy] of top.slice(1)) d += `L${n(x)} ${n(yy)}`;
  d += `Q${n(cx)} ${n(Math.max(y0, y1) + ry * 0.22)} ${n(x0)} ${n(y0)}Z`;
  let s = `<path d="${d}" fill="#33252e"/>`;
  s += pen(`M${n(cx - rx * 0.42)} ${n(cy - ry * 0.6)}Q${n(cx)} ${n(cy - ry * 0.78)} ${n(cx + rx * 0.42)} ${n(cy - ry * 0.6)}`, '#6b5560', 2.2, 0.8);
  s += pen(`M${n(x1)} ${n(y1)}Q${n(cx)} ${n(Math.max(y0, y1) + ry * 0.22)} ${n(x0)} ${n(y0)}`, INK, 4);
  return skyPart(key, w, h, cx, cy, s);
}

/**
 * An eye closed: the face's colour over it in the eye's outline, with the
 * lash line curving down (asleep, a blink) or up (a happy squeeze).
 */
function closedEye(key: string, shape: EyeShape, rx: number, ry: number, fill: string, happy: boolean): PartArt {
  const w = Math.ceil(rx * 2 + 14);
  const h = Math.ceil(ry * 2 + 14);
  const cx = w / 2;
  const cy = h / 2;
  let s = inked(eyeOutline(shape, cx, cy, rx, ry), fill, 4.5);
  if (happy) {
    const k = Math.min(1, ry / rx + 0.35);
    s += pen(`M${n(cx - rx * 0.78)} ${n(cy + ry * 0.32)}Q${n(cx)} ${n(cy - ry * 0.95 * k - 4)} ${n(cx + rx * 0.78)} ${n(cy + ry * 0.32)}`, INK, 6);
    // The squeeze: little creases at the outer corner.
    s += pen(`M${n(cx + rx * 0.86)} ${n(cy - ry * 0.05)}L${n(cx + rx * 1.02)} ${n(cy - ry * 0.25)}M${n(cx + rx * 0.9)} ${n(cy + ry * 0.3)}L${n(cx + rx * 1.06)} ${n(cy + ry * 0.36)}`, INK, 2.6);
  } else {
    s += pen(`M${n(cx - rx * 0.85)} ${n(cy - ry * 0.05)}Q${n(cx)} ${n(cy + ry * 0.55)} ${n(cx + rx * 0.85)} ${n(cy - ry * 0.05)}`, INK, 5);
    for (const t of [-0.5, 0, 0.5]) {
      const x = cx + t * rx * 0.75;
      const yy = cy + ry * 0.26 * (1 - t * t * 1.6);
      s += pen(`M${n(x)} ${n(yy)}L${n(x + t * 4)} ${n(yy + Math.max(5, ry * 0.3))}`, INK, 3);
    }
  }
  return skyPart(key, w, h, cx, cy, s);
}

/** A brow: one bold brush stroke, thick in the middle (it turns and lifts with the mood). */
function brow(): PartArt {
  const s = `<path d="M4 15Q25 1 48 9Q51 12 47 14Q26 8 7 19Q2 19 4 15Z" fill="${INK}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  return skyPart('sky.brow', 52, 22, 26, 11, s);
}

// ------------------------------------------------------------------ mouths for every mood

function mouthSmile(): PartArt {
  const s = pen(`M8 12Q32 34 56 12`, INK, 5.5) + pen(`M5 15L10 9M59 15L54 9`, INK, 3.4);
  return skyPart('sky.mouth.smile', 64, 36, 32, 16, s);
}

function mouthGrin(): PartArt {
  const d = `M8 12Q36 21 64 12Q61 46 36 48Q11 46 8 12Z`;
  const inside = `<path d="M10 12Q36 22 62 12L60 21Q36 29 12 21Z" fill="#fbf5e6"/>` + pen(`M10 21Q36 29 62 21`, INK, 2) + ovalFill(38, 41, 13, 7, '#f59cb4');
  return skyPart('sky.mouth.grin', 72, 54, 36, 22, inked(d, SUN.mouth, 4.5, inside));
}

function mouthO(): PartArt {
  return skyPart('sky.mouth.o', 40, 46, 20, 23, inked(oval(20, 23, 12, 15), SUN.mouth, 4.5, ovalFill(21, 32, 7, 5, '#f59cb4')));
}

function mouthWobble(): PartArt {
  return skyPart('sky.mouth.wobble', 66, 30, 33, 15, pen(`M6 19Q13 9 20 15Q27 22 34 15Q41 8 48 15Q55 22 60 13`, INK, 5));
}

function mouthPout(): PartArt {
  const s = pen(`M9 24Q27 8 45 22`, INK, 5.5) + pen(`M45 22L49 28`, INK, 3.4) + pen(`M19 29Q27 32 35 29`, INK, 2.6, 0.75);
  return skyPart('sky.mouth.pout', 54, 36, 27, 18, s);
}

function mouthSmirk(): PartArt {
  const s = pen(`M8 19Q24 26 40 20Q48 16 54 7`, INK, 5.5) + pen(`M52 4L58 9`, INK, 3.2);
  return skyPart('sky.mouth.smirk', 62, 36, 31, 18, s);
}

// ------------------------------------------------------------------ small things on a face

/** Rosy cheeks, the comic way: a soft blush and three quick strokes. */
function blush(): PartArt {
  let s = ovalFill(22, 13, 19, 10, '#f48d9c', 0.55);
  s += pen(`M12 18L17 9M19 19L24 10M26 18L31 9`, '#e0607c', 2.2, 0.85);
  return skyPart('sky.blush', 44, 26, 22, 13, s);
}

function freckles(): PartArt {
  let s = '';
  for (const [x, y, r] of [[7, 13, 2.6], [15, 7, 2.2], [16, 17, 2.9], [25, 11, 2.4], [31, 18, 2.1], [34, 7, 1.9]] as const) s += disc(x, y, r, '#c4643f', 0.85);
  return skyPart('sky.freckles', 40, 24, 20, 12, s);
}

/** A rounded strip (x, y its top left), as a path. */
function strip(x: number, y: number, w: number, h: number, r: number): string {
  return `M${n(x + r)} ${n(y)}H${n(x + w - r)}A${r} ${r} 0 0 1 ${n(x + w)} ${n(y + r)}V${n(y + h - r)}A${r} ${r} 0 0 1 ${n(x + w - r)} ${n(y + h)}H${n(x + r)}A${r} ${r} 0 0 1 ${n(x)} ${n(y + h - r)}V${n(y + r)}A${r} ${r} 0 0 1 ${n(x + r)} ${n(y)}Z`;
}

/** Two sticking plasters crossed. */
function bandage(): PartArt {
  const one = (deg: number): string => {
    const d = strip(8, 25, 52, 16, 7);
    let inside = pen(d, '#d9ad7d', 7, 0.45);
    inside += `<path d="${strip(25, 27, 18, 12, 3)}" fill="#f9e9d2"/>`;
    for (const x of [14, 19, 49, 54]) for (const y of [30, 36]) inside += disc(x, y, 1.1, '#c79a6a');
    return `<g transform="rotate(${deg} 34 33)">${inked(d, '#f0cfa5', 3.6, inside)}</g>`;
  };
  return skyPart('sky.bandage', 68, 66, 34, 33, one(-38) + one(38));
}

/** A nightcap flopping over to one side (its pompom is its own part, so it can swing). */
function nightcap(): PartArt {
  const cone = `M16 92C12 58 38 22 76 15C97 12 116 22 124 42C113 35 101 35 93 43C86 53 86 72 87 92Z`;
  let stripes = '';
  for (let i = -6; i < 14; i++) {
    const x = i * 16;
    stripes += `<path d="M${x} 110L${x + 52} -10L${x + 60} -10L${x + 8} 110Z" fill="#9aa6de" opacity="0.85"/>`;
  }
  let s = inked(cone, '#cbbcf0', 4.5, stripes + pen(cone, '#7d73b8', 10, 0.35));
  const band = `M8 90Q6 103 18 107Q32 113 52 111Q74 113 88 106Q98 101 94 89Q74 82 51 82Q27 82 8 90Z`;
  s += inked(band, '#fbf6ee', 4.5, pen(band, '#d8cfe6', 9, 0.55) + pen(`M20 100Q24 96 28 100M40 104Q44 100 48 104M62 103Q66 99 70 103M80 99Q84 95 88 99`, '#cfc4e2', 2.2));
  return skyPart('sky.nightcap', 132, 120, 51, 98, s);
}

function pompom(): PartArt {
  const d = smooth(radial(18, 18, 20, (a) => 12.5 + 2.2 * Math.sin(10 * a)));
  const s = inked(d, '#fff8f0', 3.4, pen(d, '#d9cfea', 7, 0.6) + disc(14, 13, 3, '#ffffff', 0.9));
  return skyPart('sky.nightcap.pom', 36, 36, 18, 18, s);
}

/** A knitted scarf wrapped under the face, and its end that flutters. */
function scarf(): PartArt {
  const d = `M6 16Q86 46 166 16L170 38Q86 70 2 38Z`;
  let inside = '';
  for (let i = 0; i < 13; i++) inside += `<path d="M${6 + i * 14} 0L${14 + i * 14} 0L${12 + i * 14} 80L${4 + i * 14} 80Z" fill="${i % 2 ? '#f6d98a' : '#ee9888'}"/>`;
  for (let i = 0; i < 24; i++) {
    const x = 10 + i * 6.6;
    const y = 30 + Math.sin((x / 172) * Math.PI) * 14;
    inside += pen(`M${n(x - 2)} ${n(y - 2)}L${n(x)} ${n(y + 1)}L${n(x + 2)} ${n(y - 2)}`, '#a8574f', 1.4, 0.55);
  }
  inside += pen(d, '#b85f58', 9, 0.3);
  let s = inked(d, '#ee9888', 4.2, inside);
  s += inked(oval(128, 40, 13, 11), '#ee9888', 4, pen(oval(128, 40, 13, 11), '#b85f58', 7, 0.3));
  return skyPart('sky.scarf', 172, 72, 86, 30, s);
}

function scarfTail(): PartArt {
  const d = `M9 4Q4 40 10 80L37 86Q41 46 38 4Z`;
  let inside = '';
  for (let i = 0; i < 8; i++) inside += `<path d="M0 ${i * 12}L48 ${i * 12 - 4}L48 ${i * 12 + 2}L0 ${i * 12 + 6}Z" fill="${i % 2 ? '#f6d98a' : '#ee9888'}"/>`;
  inside += pen(d, '#b85f58', 8, 0.3);
  let s = inked(d, '#ee9888', 4, inside);
  for (const x of [13, 18, 23, 28, 33]) s += pen(`M${x} ${80 + (x - 10) * 0.2}L${x - 1} ${92 + (x % 2)}`, INK, 2.4);
  return skyPart('sky.scarf.tail', 46, 98, 24, 6, s);
}

/** A crown of crystal: a gold band, five standing crystals in the game's pastels. */
function crown(): PartArt {
  const band = `M12 58Q64 72 116 58L114 78Q64 92 14 78Z`;
  let s = '';
  const tips: [number, number, string][] = [
    [22, 24, '#a9e4cf'], [43, 38, '#cdb8f2'], [64, 52, '#a8dcec'], [85, 38, '#cdb8f2'], [106, 24, '#a9e4cf'],
  ];
  for (const [x, h, fill] of tips) {
    const top = 64 - h;
    const d = `M${x - 8} 66L${x - 8} ${n(64 - h * 0.62)}L${x} ${top}L${x + 8} ${n(64 - h * 0.62)}L${x + 8} 66Z`;
    const inside = `<path d="M${x} ${top}L${x + 8} ${n(64 - h * 0.62)}L${x + 8} 66L${x} 66Z" fill="#ffffff" opacity="0.28"/>` + pen(`M${x - 3.5} ${n(64 - h * 0.5)}L${x - 3.5} 60`, '#ffffff', 2, 0.8);
    s += inked(d, fill, 3.4, inside);
  }
  s += inked(band, '#f3cf6e', 4, pen(band, '#c9973c', 8, 0.35) + pen(`M18 66Q64 79 110 66`, '#fff3c4', 2.2, 0.8));
  for (const [x, c] of [[34, '#f3a0c0'], [64, '#a8dcec'], [94, '#f3a0c0']] as const) s += disc(x, 75, 4, c) + pen(oval(x, 75, 4, 4), INK, 2);
  return skyPart('sky.crown', 128, 92, 64, 78, s);
}

function flower(): PartArt {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const deg = i * 72;
    s += `<ellipse cx="18" cy="9.5" rx="6.6" ry="8.6" transform="rotate(${deg} 18 18)" fill="#f9c2d6" stroke="${INK}" stroke-width="2.4"/>`;
  }
  s += `<circle cx="18" cy="18" r="5.6" fill="#f6d66e" stroke="${INK}" stroke-width="2.4"/>` + disc(16.4, 16.2, 1.6, '#ffffff', 0.9);
  return skyPart('sky.flower', 36, 36, 18, 18, s);
}

/** A drop of sweat, a tear: bold ink drops hanging from their tips. */
function sweatDrop(): PartArt {
  return skyPart('sky.sweat', 28, 38, 14, 3, drop(14, 3, 26, '#c4e9f5', 3));
}

function tearDrop(): PartArt {
  return skyPart('sky.tear', 22, 30, 11, 3, drop(11, 3, 20, '#a9dcef', 2.6));
}

/** A "Z" floating up from a sleeper. */
function zee(): PartArt {
  const d = `M6 5H29V12L15 27H29V33H5V26L19 11H6Z`;
  return skyPart('sky.z', 34, 38, 17, 19, inked(d, '#dcd0fa', 3, pen(`M9 8H25`, '#ffffff', 2, 0.7)));
}

/** A note floating up from a song. */
function note(): PartArt {
  let s = `<ellipse cx="12" cy="36" rx="8.5" ry="6.2" transform="rotate(-22 12 36)" fill="#f6d66e" stroke="${INK}" stroke-width="3"/>`;
  s += pen(`M19.5 34V7`, INK, 3.6);
  s += `<path d="M19.5 6Q31 10 31 22Q27 15 19.5 15Z" fill="${INK}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
  s += disc(9.5, 34, 1.8, '#ffffff', 0.9);
  return skyPart('sky.note', 36, 46, 18, 24, s);
}

/** A sparkle for a touch. */
function sparkle(): PartArt {
  const d = `M16 2Q18 14 30 16Q18 18 16 30Q14 18 2 16Q14 14 16 2Z`;
  return skyPart('sky.sparkle', 32, 32, 16, 16, inked(d, '#fff2a8', 2.4));
}

/** A part placed in a face: its pivot at (x, y), turned by `rot` and stretched along its length by `len`. */
function placed(p: PartArt, x: number, y: number, rot = 0, len = 1): string {
  const deg = n((rot * 180) / Math.PI);
  return `<g transform="translate(${n(x)} ${n(y)})${rot ? ` rotate(${deg})` : ''}${len !== 1 ? ` scale(1 ${n(len)})` : ''} translate(${n(-p.px)} ${n(-p.py)})">${p.body}</g>`;
}

/**
 * A whole face as one picture (SVG markup), for screens drawn outside the
 * game (the loading screen): the Sun with its spikes, or the infant Moon.
 */
export function skyFaceSvg(kind: 'sun' | 'moon'): string {
  if (kind === 'moon') {
    const body = placed(moonBaby(), 130, 130) + placed(moonBabyEye(), MOON_EYE[0], MOON_EYE[1]) + placed(moonBabyLid(), MOON_EYE[0], MOON_EYE[1]) + placed(moonBabyMouth(), 96, 176);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260" aria-hidden="true">${body}</svg>`;
  }
  let body = '';
  const ray = sunRay();
  const bent = sunRayBroken();
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    body += placed(i % 4 === 1 ? bent : ray, 160 + Math.cos(a) * 104, 160 + Math.sin(a) * 104, a + Math.PI / 2, i % 2 ? 0.74 : 1);
  }
  body += placed(sunDisk(), 160, 160);
  for (const [x, y] of SUN_EYES) body += placed(sunEye(), x, y) + placed(sunLid(), x, y);
  body += placed(sunMouth(), 160, 214);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22 -22 364 364" aria-hidden="true">${body}</svg>`;
}

/** The Sun, the infant Moon and the ancient Moon, with what each mood and look adds to them. */
export function skyParts(): PartArt[] {
  return [
    sunDisk(), sunEye(), sunLid(), sunShut(), sunMouth(), sunMouthOpen(), sunRay(), sunRayBroken(),
    moonBaby(), moonBabyEye(), moonBabyLid(), moonBabyShut(), moonBabyMouth(),
    moonOld(), moonOldEye(), moonOldMouth(), moonOldLaugh(),
    lid('moon.old.lid', 'almond', OLD_SOCKET[0], OLD_SOCKET[1], 0.42),
    closedEye('moon.old.shut', 'almond', OLD_SOCKET[0] + 1, OLD_SOCKET[1] + 1, OLD.fill, false),
    // Each eye half shut (sleepy, proud) and squeezed happy.
    heavyLid('sun.lid.low', SUN_SOCKET, SUN_SOCKET, 0.64),
    heavyLid('moon.baby.lid.low', MOON_SOCKET[0], MOON_SOCKET[1], 0.64),
    lid('moon.old.lid.low', 'almond', OLD_SOCKET[0], OLD_SOCKET[1], 0.68),
    closedEye('sun.happy', 'oval', SUN_SOCKET + 1, SUN_SOCKET + 1, SUN.face, true),
    closedEye('moon.baby.happy', 'oval', MOON_SOCKET[0] + 1, MOON_SOCKET[1] + 1, MOON.fill, true),
    closedEye('moon.old.happy', 'almond', OLD_SOCKET[0] + 1, OLD_SOCKET[1] + 1, OLD.fill, true),
    brow(), mouthSmile(), mouthGrin(), mouthO(), mouthWobble(), mouthPout(), mouthSmirk(),
    blush(), freckles(), bandage(), nightcap(), pompom(), scarf(), scarfTail(), crown(), flower(),
    sweatDrop(), tearDrop(), zee(), note(), sparkle(),
  ];
}
