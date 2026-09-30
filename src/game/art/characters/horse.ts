import { ellipsePath, Rng, smooth, taper, type Pt } from '../svg';
import { DETAIL, flat, INK, OUTLINE } from '../style';
import type { PartArt, RigDef } from '../rigTypes';
import { ink, scribble, stitches } from './kit';

// The purple horse, "Insanity's Horse" of painting 2: a long lilac body with
// sage-green patches, stitched details, a small yellow tag, a long
// dinosaur-like head with a yellow-green goggle eye, yellow hooves under
// jagged yellow cuffs. The joints and attach points are unchanged, so the
// horse poses (horsePoses) drive it as before.

const tr = (pts: readonly Pt[], ox: number, oy: number): Pt[] => pts.map(([x, y]) => [x + ox, y + oy]);

function part(key: string, box: { x0: number; y0: number; x1: number; y1: number }, draw: (ox: number, oy: number) => string, extra: Partial<PartArt> = {}): PartArt {
  const m = 6;
  const ox = -box.x0 + m;
  const oy = -box.y0 + m;
  return { key, w: Math.ceil(box.x1 - box.x0 + m * 2), h: Math.ceil(box.y1 - box.y0 + m * 2), px: ox, py: oy, body: draw(ox, oy), scale: 1.5, ...extra };
}

export const HORSE = {
  body: '#c4a7df',
  bodyLine: '#9a7fc0',
  patch: '#aacf8f',
  patchDeep: '#8fbf74',
  dash: '#7fb86a',
  tag: '#f3e08e',
  tagRim: '#e7a3c6',
  goggle: '#d6e271',
  hoof: '#f1d76a',
  cuff: '#f3e08e',
  eye: '#3b2d45',
} as const;

/** The horse's heavier contour (it is drawn at 1.5x). */
const LINE = OUTLINE * 1.25;

/** A sage-green blob patch with a contour (camouflage-like, as painted). */
function patch(cx: number, cy: number, rx: number, ry: number, seed: number, color: string = HORSE.patch): string {
  const rng = new Rng(seed);
  const pts: Pt[] = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + rng.range(-0.28, 0.22);
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return flat(smooth(pts), color, { stroke: DETAIL * 1.3 });
}

/** Stitch dashes along a line (the painted dashes along the spine). */
function dashes(pts: readonly Pt[], every: number, len: number, color: string = HORSE.dash): string {
  let s = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / L;
    const uy = (b[1] - a[1]) / L;
    for (let d = every / 2; d < L; d += every) {
      const x = a[0] + ux * d;
      const y = a[1] + uy * d;
      s += `<path d="M${x - ux * len / 2} ${y - uy * len / 2}L${x + ux * len / 2} ${y + uy * len / 2}" stroke="${INK}" stroke-width="${len * 0.55 + 1.6}" stroke-linecap="round"/>`;
      s += `<path d="M${x - ux * len / 2} ${y - uy * len / 2}L${x + ux * len / 2} ${y + uy * len / 2}" stroke="${color}" stroke-width="${len * 0.55}" stroke-linecap="round"/>`;
    }
  }
  return s;
}

function body(): PartArt {
  return part('horse.body', { x0: -108, y0: -18, x1: 100, y1: 80 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const pts: Pt[] = [
      [-104, 14], [-98, -4], [-80, -14], [-58, -12], [-30, -4], [10, 0], [44, -6], [66, -16], [86, -8], [100, 10],
      [102, 30], [92, 50], [74, 64], [44, 64], [16, 68], [-16, 68], [-44, 62], [-66, 66], [-90, 56], [-104, 36],
    ];
    const inner =
      patch(ox - 78, oy + 36, 18, 13, 1) +
      patch(ox - 30, oy + 54, 22, 10, 2) +
      patch(ox + 36, oy + 44, 16, 11, 3) +
      patch(ox + 76, oy + 18, 12, 16, 4, HORSE.patchDeep) +
      patch(ox - 50, oy + 4, 10, 6, 5);
    // The small yellow tag with its pink rim and a scribbled name.
    const tx = ox - 6;
    const ty = oy + 14;
    const rim: string[] = [];
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const k = i % 2 ? 1 : 0.86;
      rim.push(`${tx + Math.cos(a) * 21 * k} ${ty + Math.sin(a) * 12 * k}`);
    }
    const tag =
      flat(`M${rim.join('L')}Z`, HORSE.tagRim, { stroke: DETAIL * 1.2 }) +
      flat(`M${tx - 15} ${ty - 7}H${tx + 15}V${ty + 7}H${tx - 15}Z`, HORSE.tag, { stroke: DETAIL * 1.3 }) +
      scribble(tx - 12, ty - 4.5, 24, 3.5, 17, '#6a4a8a', 1.4) +
      scribble(tx - 9, ty + 1.5, 18, 3.5, 18, '#6a4a8a', 1.4);
    const over =
      dashes(o([[-86, -6], [-60, -4], [-30, 4], [10, 8], [44, 2], [70, -6]]), 11, 5) +
      stitches(o([[-60, 30], [-50, 44], [-54, 56]]), 5, 2.4, INK, 1.4) +
      ink(smooth(o([[60, 6], [70, 30], [62, 52]]), 1, false), 1.6, HORSE.bodyLine) +
      tag;
    return flat(smooth(o(pts)), HORSE.body, { stroke: LINE, inner, over });
  });
}

function neck(): PartArt {
  return part('horse.neck', { x0: -24, y0: -86, x1: 64, y1: 22 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const pts: Pt[] = [[-20, 18], [-18, -10], [0, -44], [22, -72], [42, -82], [60, -70], [52, -48], [36, -20], [26, 8], [14, 22]];
    return flat(smooth(o(pts)), HORSE.body, {
      stroke: LINE,
      inner: patch(ox + 18, oy - 20, 10, 16, 11) + patch(ox + 46, oy - 64, 7, 6, 12, HORSE.patchDeep),
      over: dashes(o([[-12, -8], [4, -40], [24, -66], [42, -78]]), 12, 5),
    });
  });
}

function head(): PartArt {
  return part('horse.head', { x0: -18, y0: -34, x1: 86, y1: 56 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const pts: Pt[] = [[-14, -6], [-2, -18], [18, -16], [42, -4], [64, 14], [80, 30], [81, 42], [70, 50], [54, 47], [40, 38], [22, 30], [4, 26], [-10, 14]];
    // Zigzag stitched mouth, a nostril, and the yellow-green goggle eye.
    const zig: string[] = [];
    for (let i = 0; i <= 10; i++) zig.push(`${ox + 40 + i * 3.4} ${oy + 37.5 + (i % 2 ? 2.4 : -0.6) + i * 0.8}`);
    const face =
      ink(`M${zig.join('L')}`, DETAIL * 1.3) +
      `<path d="${smooth(o([[68, 32], [74, 30], [76, 36], [70, 38]]))}" fill="${INK}"/>` +
      flat(ellipsePath(ox + 17, oy - 5, 11, 8), HORSE.goggle, { stroke: DETAIL * 1.5, inner: ink(`M${ox + 8} ${oy - 1}l18 -8`, 1, '#aab84a') }) +
      flat(ellipsePath(ox + 18, oy - 5, 5, 4.4), '#fbf6ee', { stroke: DETAIL * 1.2, inner: `<circle cx="${ox + 19.5}" cy="${oy - 5}" r="2.6" fill="${HORSE.eye}"/>` }) +
      ink(`M${ox + 29} ${oy - 1}q10 4 16 12`, DETAIL * 1.2, '#aab84a') +
      patch(ox + 40, oy + 20, 7, 5, 21) +
      ink(smooth(o([[4, 24], [18, 14], [30, 20]]), 1, false), 1.6, HORSE.bodyLine);
    let s = flat(smooth(o([[-6, -14], [-2, -30], [6, -16]])), HORSE.body, { stroke: DETAIL * 1.5 }); // ear
    s += flat(smooth(o(pts)), HORSE.body, { stroke: LINE, over: face });
    return s;
  });
}

function tail(): PartArt {
  return part('horse.tail', { x0: -70, y0: -12, x1: 10, y1: 96 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const strand = (a: Pt[], w: number): string => {
      const q = o(a);
      return flat(taper(q, w, 1.6), HORSE.body, { stroke: DETAIL * 1.5, inner: `<path d="${taper(q.slice(-2), w * 0.5, 1.4)}" fill="${HORSE.patch}"/>` });
    };
    let s = strand([[0, 0], [-20, 14], [-34, 40], [-46, 70], [-60, 90]], 12);
    s += strand([[-6, 4], [-20, 30], [-24, 58], [-34, 84]], 9);
    s += strand([[-2, 2], [-30, 12], [-50, 30], [-64, 44]], 8);
    return s;
  });
}

function legUpper(key: string, len: number, wTop: number): PartArt {
  return part(key, { x0: -18, y0: -10, x1: 18, y1: len + 8 }, (ox, oy) =>
    flat(taper(tr([[0, -6], [2, len * 0.3], [1, len * 0.7], [0, len]], ox, oy), wTop, wTop * 0.42), HORSE.body, {
      stroke: LINE,
      inner: patch(ox - 2, oy + len * 0.35, wTop * 0.3, len * 0.16, len),
      over: ink(`M${ox - wTop * 0.3} ${oy + len * 0.62}q${wTop * 0.25} ${len * 0.18} 0 ${len * 0.3}`, 1.5, HORSE.bodyLine),
    }),
  { far: true });
}

function legLower(key: string, len: number): PartArt {
  return part(key, { x0: -16, y0: -6, x1: 20, y1: len + 12 }, (ox, oy) => {
    let s = flat(taper(tr([[0, 0], [0, len * 0.55], [1, len - 10]], ox, oy), 10, 7.5), HORSE.body, { stroke: LINE * 0.9 });
    // Yellow hoof under a jagged yellow cuff.
    s += flat(`M${ox - 10} ${oy + len - 8}L${ox + 9} ${oy + len - 9}L${ox + 15} ${oy + len + 2}L${ox + 14} ${oy + len + 8}L${ox - 11} ${oy + len + 8}L${ox - 12} ${oy + len}Z`, HORSE.hoof, { stroke: LINE * 0.9 });
    const cy = oy + len - 12;
    s += flat(`M${ox - 8} ${cy - 5}L${ox + 8} ${cy - 6}L${ox + 9} ${cy + 4}L${ox + 6} ${cy + 1}L${ox + 3.5} ${cy + 6}L${ox + 1} ${cy + 1.5}L${ox - 2} ${cy + 6.5}L${ox - 4.5} ${cy + 1.5}L${ox - 7} ${cy + 5.5}L${ox - 9} ${cy + 1}Z`, HORSE.cuff, { stroke: DETAIL * 1.4 });
    return s;
  }, { far: true });
}

export function horseParts(): PartArt[] {
  return [
    body(), neck(), head(), tail(),
    legUpper('horse.fu', 44, 30), legLower('horse.fl', 40),
    legUpper('horse.hu', 48, 36), legLower('horse.hl', 42),
  ];
}

export const RIG_HORSE: RigDef = {
  id: 'horse',
  joints: [
    { id: 'root', parent: null, x: 0, y: 0, z: 0 },
    { id: 'body', parent: 'root', x: 0, y: -118, part: 'horse.body', z: 50 },
    { id: 'tail', parent: 'body', x: -98, y: 6, part: 'horse.tail', z: 45 },
    { id: 'neck', parent: 'body', x: 78, y: 8, part: 'horse.neck', z: 52 },
    { id: 'head', parent: 'neck', x: 46, y: -70, part: 'horse.head', z: 53 },
    { id: 'fuR', parent: 'body', x: 62, y: 40, part: 'horse.fu', side: 'R', z: 60 },
    { id: 'flR', parent: 'fuR', x: 0, y: 44, part: 'horse.fl', side: 'R', z: 61 },
    { id: 'huR', parent: 'body', x: -60, y: 34, part: 'horse.hu', side: 'R', z: 60 },
    { id: 'hlR', parent: 'huR', x: 0, y: 48, part: 'horse.hl', side: 'R', z: 61 },
    { id: 'fuL', parent: 'body', x: 56, y: 40, part: 'horse.fu', side: 'L', z: 60 },
    { id: 'flL', parent: 'fuL', x: 0, y: 44, part: 'horse.fl', side: 'L', z: 61 },
    { id: 'huL', parent: 'body', x: -54, y: 34, part: 'horse.hu', side: 'L', z: 60 },
    { id: 'hlL', parent: 'huL', x: 0, y: 48, part: 'horse.hl', side: 'L', z: 61 },
  ],
  attach: {
    saddle: { joint: 'body', x: 6, y: -6 },
    muzzle: { joint: 'head', x: 74, y: 42 },
    hoofFR: { joint: 'flR', x: 0, y: 44 },
    hoofFL: { joint: 'flL', x: 0, y: 44 },
    hoofHR: { joint: 'hlR', x: 0, y: 46 },
    hoofHL: { joint: 'hlL', x: 0, y: 46 },
  },
  animations: ['emerge', 'idle', 'gallop', 'jump', 'land', 'rear', 'kneel', 'dissolve'],
};
