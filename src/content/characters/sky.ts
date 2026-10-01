import { smooth, type Pt } from '../../render/2d/svg';
import type { PartArt } from '../../render/2d/rig/rigTypes';

// The Sun and the infant Moon as the first painting draws them, in its bold
// black ink: they sit small in the corners of the screen, so they keep the
// painting's heavy contours (the rest of the cast has the thin, soft lines).
//
// The Sun: a lumpy apricot face in a ring of fat yellow spikes, two round
// eyes with pink irises under heavy black lids, a small frown. The Moon: a
// pale blue crescent opening to the right, one big pink eye under a heavy
// lid, a short mouth, and little stars with faces in its curve.
//
// Each eye is four parts: the socket (white, in the face), the iris (moves
// with the gaze), the heavy lid (a dark crescent over the eye's top, as
// painted) and the shut eye (the face's colour with the lash line), shown
// for a blink.

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

/** A part placed in a face: its pivot at (x, y), turned by `rot` and stretched along its length by `len`. */
function placed(p: PartArt, x: number, y: number, rot = 0, len = 1): string {
  const deg = n((rot * 180) / Math.PI);
  return `<g transform="translate(${n(x)} ${n(y)})${rot ? ` rotate(${deg})` : ''}${len !== 1 ? ` scale(1 ${n(len)})` : ''} translate(${n(-p.px)} ${n(-p.py)})">${p.body}</g>`;
}

/**
 * A whole face as one picture (SVG markup), for screens drawn outside the
 * game (the loading screen): the Sun with its spikes, or the infant Moon.
 * `shut` draws only its shut eyes, in the same frame, to lay over the face
 * for a blink.
 */
export function skyFaceSvg(kind: 'sun' | 'moon', part: 'face' | 'shut' = 'face'): string {
  if (kind === 'moon') {
    const body =
      part === 'shut'
        ? placed(moonBabyShut(), MOON_EYE[0], MOON_EYE[1])
        : placed(moonBaby(), 130, 130) + placed(moonBabyEye(), MOON_EYE[0], MOON_EYE[1]) + placed(moonBabyLid(), MOON_EYE[0], MOON_EYE[1]) + placed(moonBabyMouth(), 96, 176);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260" aria-hidden="true">${body}</svg>`;
  }
  if (part === 'shut') return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-22 -22 364 364" aria-hidden="true">${SUN_EYES.map(([x, y]) => placed(sunShut(), x, y)).join('')}</svg>`;
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

/** The Sun and the infant Moon. */
export function skyParts(): PartArt[] {
  return [
    sunDisk(), sunEye(), sunLid(), sunShut(), sunMouth(), sunMouthOpen(), sunRay(), sunRayBroken(),
    moonBaby(), moonBabyEye(), moonBabyLid(), moonBabyShut(), moonBabyMouth(),
  ];
}
