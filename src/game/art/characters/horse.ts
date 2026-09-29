import { P } from '../palette';
import { cel, glow, line, smooth, taper, type Pt } from '../svg';
import type { PartArt, RigDef } from '../rigTypes';

// The purple horse: soil, liquid and branching anatomy. Long angular face,
// luminous inner fissures, root-like mane and tail, broad hooves.

const tr = (pts: readonly Pt[], ox: number, oy: number): Pt[] => pts.map(([x, y]) => [x + ox, y + oy]);

function part(key: string, box: { x0: number; y0: number; x1: number; y1: number }, draw: (ox: number, oy: number) => string, extra: Partial<PartArt> = {}): PartArt {
  const m = 6;
  const ox = -box.x0 + m;
  const oy = -box.y0 + m;
  return { key, w: Math.ceil(box.x1 - box.x0 + m * 2), h: Math.ceil(box.y1 - box.y0 + m * 2), px: ox, py: oy, body: draw(ox, oy), scale: 1.5, ...extra };
}

const H = { fill: P.horse, shade: P.horseDark, light: P.horseLight };
const SOIL = '#3b2a3f';
const fissure = (d: string, w = 1.6): string => line(d, P.vein, w, 0.9) + line(d, '#ffffff', w * 0.35, 0.5);

function body(): PartArt {
  return part('horse.body', { x0: -108, y0: -18, x1: 100, y1: 80 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const pts: Pt[] = [
      [-104, 14], [-98, -4], [-80, -14], [-58, -12], [-30, -4], [10, 0], [44, -6], [66, -16], [86, -8], [100, 10],
      [102, 30], [92, 50], [74, 64], [44, 64], [16, 68], [-16, 68], [-44, 62], [-66, 66], [-90, 56], [-104, 36],
    ];
    const soil =
      `<path d="${smooth(o([[-40, 52], [-18, 46], [8, 52], [2, 66], [-30, 66]]))}" fill="${SOIL}" opacity="0.55"/>` +
      `<path d="${smooth(o([[46, 10], [62, 4], [74, 16], [60, 26]]))}" fill="${SOIL}" opacity="0.4"/>`;
    const fis =
      fissure(smooth(o([[-80, 12], [-56, 20], [-30, 14], [-6, 26], [22, 18], [50, 30], [78, 22]]), 1, false)) +
      fissure(smooth(o([[-30, 14], [-36, 34], [-24, 48]]), 1, false), 1.2) +
      fissure(smooth(o([[50, 30], [58, 44], [52, 58]]), 1, false), 1.2);
    const muscle =
      line(smooth(o([[-72, 4], [-60, 30], [-70, 52]]), 1, false), P.horseDark, 2) +
      line(smooth(o([[64, 0], [74, 30], [64, 54]]), 1, false), P.horseDark, 2);
    return cel(smooth(o(pts)), { ...H, sx: 6, sy: 6, hx: 2.5, hy: 2.5, stroke: 4, inner: soil, over: muscle + fis });
  });
}

function neck(): PartArt {
  return part('horse.neck', { x0: -24, y0: -86, x1: 64, y1: 22 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const pts: Pt[] = [[-20, 18], [-18, -10], [0, -44], [22, -72], [42, -82], [60, -70], [52, -48], [36, -20], [26, 8], [14, 22]];
    let s = cel(smooth(o(pts)), { ...H, sx: 5, sy: 3, hx: 2, hy: 2, stroke: 4, over: fissure(smooth(o([[-4, 10], [8, -20], [28, -50], [44, -70]]), 1, false), 1.3) });
    // Root-like mane along the crest.
    const mane = (a: Pt[], w0: number): string => cel(taper(o(a), w0, 1.5), { fill: P.bark, shade: P.barkDark, light: P.barkLight, sx: 1.5, sy: 1.5, stroke: 2.4, over: line(smooth(o(a), 1, false), P.violet, 1, 0.6) });
    s += mane([[40, -80], [22, -84], [4, -76], [-6, -66]], 7);
    s += mane([[28, -66], [10, -66], [-4, -52], [-14, -44]], 7);
    s += mane([[14, -44], [-2, -40], [-16, -26], [-24, -16]], 6);
    s += mane([[2, -20], [-12, -12], [-26, 2]], 5);
    return s;
  });
}

function head(): PartArt {
  return part('horse.head', { x0: -18, y0: -34, x1: 86, y1: 56 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const pts: Pt[] = [[-14, -6], [-2, -18], [18, -16], [42, -4], [64, 14], [80, 30], [81, 42], [70, 50], [54, 47], [40, 38], [22, 30], [4, 26], [-10, 14]];
    const face =
      fissure(smooth(o([[4, -8], [22, 0], [40, 12], [56, 24]]), 1, false), 1.4) +
      `<path d="${smooth(o([[68, 34], [75, 31], [77, 38], [70, 41]]))}" fill="${P.ink}"/>` + // nostril
      line(smooth(o([[56, 26], [62, 30], [66, 30]]), 1, false), P.horseDark, 1.6) +
      `<path d="${smooth(o([[12, -8], [20, -10], [24, -4], [16, -2]]))}" fill="${P.vein}" stroke="${P.ink}" stroke-width="1.8"/>` + // luminous eye
      glow(18 + ox, -6 + oy, 9, P.vein, 0.5) +
      line(smooth(o([[52, 46], [62, 48], [70, 50]]), 1, false), P.horseDark, 1.4) + line(smooth(o([[4, 24], [18, 14], [30, 20]]), 1, false), P.horseDark, 1.8);
    let s = cel(smooth(o([[-6, -14], [-2, -30], [6, -16]])), { ...H, sx: 1, sy: 1, stroke: 2.4 }); // ear
    s += cel(smooth(o(pts)), { ...H, sx: 4, sy: 4, hx: 2, hy: 2, stroke: 3.6, over: face });
    return s;
  });
}

function tail(): PartArt {
  return part('horse.tail', { x0: -70, y0: -12, x1: 10, y1: 96 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const strand = (a: Pt[], w: number): string =>
      cel(taper(o(a), w, 1.4), { fill: P.bark, shade: P.barkDark, light: P.barkLight, sx: 1.5, sy: 1.5, stroke: 2.4, over: line(smooth(o(a), 1, false), P.violet, 1, 0.6) });
    let s = strand([[0, 0], [-20, 14], [-34, 40], [-46, 70], [-60, 90]], 11);
    s += strand([[-6, 4], [-20, 30], [-24, 58], [-34, 84]], 8);
    s += strand([[-2, 2], [-30, 12], [-50, 30], [-64, 44]], 7);
    return s;
  });
}

function legUpper(key: string, len: number, wTop: number): PartArt {
  return part(key, { x0: -18, y0: -10, x1: 18, y1: len + 8 }, (ox, oy) =>
    cel(taper(tr([[0, -6], [2, len * 0.3], [1, len * 0.7], [0, len]], ox, oy), wTop, wTop * 0.42), {
      ...H, sx: 3, sy: 0, hx: 1.5, hy: 0, stroke: 3.4,
      over: fissure(`M${ox + 3} ${oy + 4}q-4 ${len * 0.4} 0 ${len * 0.8}`, 1.1) + line(`M${ox - wTop * 0.3} ${oy + len * 0.2}q${wTop * 0.25} ${len * 0.25} 0 ${len * 0.5}`, P.horseDark, 1.6),
    }),
    { far: true },
  );
}

function legLower(key: string, len: number): PartArt {
  return part(key, { x0: -16, y0: -6, x1: 20, y1: len + 12 }, (ox, oy) => {
    let s = cel(taper(tr([[0, 0], [0, len * 0.55], [1, len - 10]], ox, oy), 10, 7.5), { ...H, sx: 2.5, sy: 0, hx: 1, hy: 0, stroke: 3.2 });
    // Fetlock joint
    s += cel(smooth(tr([[-6, len - 16], [6, len - 17], [8, len - 9], [-5, len - 7]], ox, oy)), { ...H, sx: 1.5, sy: 1.5, stroke: 2.8 });
    // Broad hoof of packed soil with rootlets.
    s += line(`M${ox - 6} ${oy + len + 7}l-4 4M${ox + 8} ${oy + len + 7}l4 4`, P.barkDark, 1.6);
    s += cel(smooth(tr([[-10, len - 8], [9, len - 9], [15, len + 2], [14, len + 8], [-11, len + 8], [-12, len]], ox, oy)), {
      fill: SOIL, shade: '#2a1d2d', light: '#54405a', sx: 1.5, sy: 2, hx: 1, hy: 1, stroke: 3,
    });
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
