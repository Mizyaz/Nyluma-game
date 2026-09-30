import { P, mix, pastelMarkup } from '../../render/2d/palette';
import { Rng, cel, ellipsePath, fillPath, glow, line, mixed, poly, smooth, taper, type Pt } from '../../render/2d/svg';
import type { PartArt } from '../../render/2d/rig/rigTypes';
import { PASTEL } from '../../render/2d/style';

// Creatures, celestial faces and crowd figures. Every part is authored
// directly in its own canvas (0..w × 0..h, logical px) around the pivot the
// animation code rotates it about. All creatures face right (+x).
// Appendages (whale fin, bird wings) sweep back toward the tail from their
// root joint so a flap is an oscillation around the rest pose.

type MPt = [number, number, number?];

const INK = P.ink;
const n2 = (v: number): number => Math.round(v * 100) / 100;
const op = (o: number): string => (o !== 1 ? ` opacity="${n2(o)}"` : '');

/** Smooth open polyline. */
const open = (pts: readonly Pt[], t = 1): string => smooth(pts, t, false);
/** Colored stroke along a smooth open polyline. */
const stroke = (pts: readonly Pt[], color: string, w: number, o = 1): string => line(open(pts), color, w, o);
const dot = (cx: number, cy: number, r: number, fill: string, o = 1): string =>
  `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="${fill}"${op(o)}/>`;
const ell = (cx: number, cy: number, rx: number, ry: number, fill: string, o = 1): string =>
  fillPath(ellipsePath(cx, cy, rx, ry), fill, o);
/** Filled smooth closed shape without contour. */
const blobFill = (pts: readonly Pt[], fill: string, o = 1): string => fillPath(smooth(pts), fill, o);
const shift = (pts: readonly Pt[], dx: number, dy: number): Pt[] => pts.map(([x, y]) => [x + dx, y + dy]);

/** Piecewise-linear lookup in a table of [x, y] sorted by x (either order). */
function lerpTab(tab: readonly Pt[], x: number): number {
  const t = tab[0]![0] <= tab[tab.length - 1]![0] ? tab : [...tab].reverse();
  if (x <= t[0]![0]) return t[0]![1];
  for (let i = 1; i < t.length; i++) {
    const a = t[i - 1]!;
    const b = t[i]!;
    if (x <= b[0]) return a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0] || 1);
  }
  return t[t.length - 1]![1];
}

function part(key: string, w: number, h: number, px: number, py: number, body: string): PartArt {
  // Older hand-picked colours are lifted into the paintings' pastel range;
  // the whales keep theirs (they are restyled on their own).
  const b = key.startsWith('whale') ? body : pastelMarkup(body);
  return { key, w, h, px, py, body: b, scale: Math.max(w, h) > 320 ? 1.5 : 2 };
}

/** Closed contour with a radius function around a centre (faces, disks). */
function radial(cx: number, cy: number, n: number, r: (a: number, i: number) => number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r(a, i);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

// ================================================================== whale

const WHALE = { fill: '#4f6d8f', shade: '#3b5470', light: '#7f9dbe', groove: '#c7ccde' };

function whaleBody(): PartArt {
  const outline: Pt[] = [
    [417, 80], [413, 68], [399, 59], [377, 52], [352, 47], [332, 42], [303, 36], [264, 32], [222, 33], [182, 37],
    [143, 44], [110, 52], [80, 59], [52, 65], [32, 68], [20, 70], [15, 74], [20, 78], [34, 81], [58, 87], [94, 97],
    [140, 109], [190, 117], [240, 120], [290, 118], [330, 112], [364, 103], [392, 94], [410, 87],
  ];
  // Upper edge of the throat pleats (mouth line, then along the flank) and
  // the belly contour they follow.
  const top: Pt[] = [[418, 83], [380, 89], [340, 89], [300, 95], [260, 102], [220, 108], [190, 111]];
  const belly: Pt[] = [[418, 83], [400, 91], [380, 98], [360, 104], [340, 109], [320, 113.5], [300, 116.5], [280, 118], [260, 119.5], [240, 120], [220, 119.5], [190, 117.5]];
  let grooves = '';
  const fr = [0.14, 0.3, 0.46, 0.62, 0.78, 0.92];
  fr.forEach((f, i) => {
    const pts: Pt[] = [];
    const x0 = 409 - i * 3;
    const x1 = 200 + i * 9;
    for (let x = x0; x >= x1; x -= 16) pts.push([x, lerpTab(top, x) + f * (lerpTab(belly, x) - lerpTab(top, x))]);
    grooves += stroke(pts, WHALE.groove, i === 0 ? 1.9 : 1.6, 0.78);
  });
  // Mottled flank: pale and dark flecks (seeded, deterministic).
  const rng = new Rng(4210);
  let mottle = '';
  for (let i = 0; i < 56; i++) {
    const x = rng.range(46, 330);
    const yTop = lerpTab([[40, 66], [120, 48], [200, 38], [280, 36], [330, 44]], x) + 7;
    const yBot = lerpTab([[40, 80], [120, 95], [200, 104], [280, 100], [330, 90]], x);
    const y = rng.range(yTop, yBot);
    const r = rng.range(1.2, 3.4);
    const pale = rng.chance(0.62);
    mottle += fillPath(ellipsePath(x, y, r * rng.range(1.1, 1.9), r), pale ? '#6f8bab' : '#3f5a79', pale ? 0.6 : 0.5);
  }
  const shadeD = `${open([[8, 75], [60, 85], [120, 99], [190, 108], [260, 111], [320, 105], [372, 95], [424, 84]])}L424 160L8 160Z`;
  const eye =
    stroke([[333, 66], [340, 63.5], [350, 63.5], [356, 66.5]], WHALE.shade, 2.2) + // heavy lid fold
    ell(345, 70, 7.5, 5.5, '#445f80') + // socket
    ell(345.5, 70.5, 4.3, 3.3, INK) +
    dot(346.8, 69.4, 1.2, '#c7ccde') +
    stroke([[337, 75], [345, 77.5], [353, 76]], WHALE.shade, 1.6, 0.9);
  const details =
    mottle +
    stroke([[300, 41], [330, 46], [362, 52], [396, 63]], WHALE.light, 2, 0.55) + // rostrum ridge
    stroke([[314, 44], [323, 40], [333, 41.5]], WHALE.shade, 2.4) + // splash guard
    stroke([[316, 46.5], [324, 43.5], [331, 44.5]], WHALE.light, 1.3, 0.8) +
    stroke([[70, 73], [130, 77.5], [190, 81], [236, 83]], WHALE.shade, 1.4, 0.35) + // flank crease
    grooves +
    stroke([[417, 81], [398, 85.5], [376, 87.5], [356, 86.5], [341, 83.5], [334, 80]], INK, 2.6) + // mouth line
    stroke([[334, 80], [331, 76.5]], INK, 2) +
    eye;
  // Small falcate dorsal fin far back (drawn first: the body hides its base).
  const dorsal = cel(mixed([[128, 52], [117, 45], [106, 40], [99, 38, 1], [103, 45], [101, 56]]), {
    fill: WHALE.fill, shade: WHALE.shade, light: WHALE.light, sx: 2, sy: 1, hx: 1, hy: 1.5, stroke: 3,
  });
  const body = cel(smooth(outline, 0.95), {
    fill: WHALE.fill, shade: WHALE.shade, light: WHALE.light, sx: 3, sy: 5, hx: 2, hy: 6, stroke: 4, shadeD, over: details,
  });
  return part('whale.body', 420, 150, 210, 75, dorsal + body);
}

function whaleFin(): PartArt {
  // Root at the pivot (108,12); the long flipper sweeps down and back.
  const pts: Pt[] = [
    [113, 5], [99, 8], [78, 15], [55, 25], [34, 37], [18, 47], [9, 54], [17, 55.5], [35, 50], [58, 42], [81, 33],
    [100, 25], [113, 19], [118, 12],
  ];
  return part(
    'whale.fin', 120, 60, 108, 12,
    cel(smooth(pts, 0.9), {
      fill: WHALE.fill, shade: WHALE.shade, light: WHALE.light, sx: 1, sy: 4.5, hx: 0, hy: 3, stroke: 3,
      over:
        stroke([[106, 13], [82, 21], [56, 32], [30, 44]], WHALE.shade, 1.5, 0.8) +
        stroke([[16, 52.5], [34, 48], [56, 40.5]], WHALE.groove, 1.5, 0.65) + // pale leading edge
        stroke([[70, 22], [66, 24.5]], WHALE.light, 1.4, 0.8) +
        stroke([[48, 31], [44, 33.5]], WHALE.light, 1.4, 0.8),
    }),
  );
}

function whaleFluke(): PartArt {
  const pts: MPt[] = [
    [109, 58.5], [96, 56], [80, 50], [62, 38], [44, 24], [26, 12], [10, 6, 1], [16, 17], [22, 31], [30, 45], [38, 55],
    [45, 60.5, 1], [38, 66], [30, 76], [22, 90], [16, 104], [10, 114, 1], [26, 108], [44, 96], [62, 82], [80, 70],
    [96, 64.5], [109, 62.5],
  ];
  const shadeD = poly([[0, 62], [60, 66], [112, 63.5], [112, 122], [0, 122]]);
  const over =
    stroke([[98, 59], [70, 46], [44, 30], [22, 13]], WHALE.light, 1.6, 0.8) +
    stroke([[96, 61], [70, 60.5], [50, 60.5]], WHALE.shade, 1.6, 0.9) +
    stroke([[34, 30], [40, 34]], WHALE.groove, 1.4, 0.7) + // scar ticks (each whale's fluke is marked)
    stroke([[27, 40], [31, 44]], WHALE.groove, 1.3, 0.6) +
    stroke([[30, 88], [36, 84]], WHALE.groove, 1.3, 0.45);
  return part(
    'whale.fluke', 110, 120, 100, 60,
    cel(mixed(pts), { fill: WHALE.fill, shade: WHALE.shade, light: WHALE.light, sx: 2, sy: 3, hx: 2, hy: 3, stroke: 3.2, shadeD, over }),
  );
}

// ================================================================== sparrow

const SP = { fill: P.sparrow, shade: P.sparrowDark, light: P.sparrowLight, throat: '#e8dcca', bib: '#33251f', edge: '#f2c69c' };

interface WingStyle {
  covert: string;
  covertShade: string;
  covertLight: string;
  feather: string;
  featherShade: string;
  edge: string;
  bar?: string;
  stroke: number;
  featherStroke: number;
}

/**
 * Extended wing sweeping back (−x, drooping by `droop` rad) from the shoulder
 * at (ox, oy): a fan of `n` primaries (leading feather longest) under a
 * rounded covert shield. L = length, W = depth of the wing.
 */
function featherWing(ox: number, oy: number, L: number, W: number, n: number, droop: number, st: WingStyle): string {
  const ax = -Math.cos(droop);
  const ay = Math.sin(droop);
  const nx = Math.sin(droop);
  const ny = Math.cos(droop);
  const at = (pts: readonly Pt[]): Pt[] => pts.map(([u, v]) => [ox + ax * u * L + nx * v * W, oy + ay * u * L + ny * v * W]);
  const feathers: { path: Pt[]; len: number; vt: number }[] = [];
  for (let i = 0; i < n; i++) {
    const k = n > 1 ? i / (n - 1) : 0;
    const len = 1 - 0.36 * k;
    const vb = -0.2 + 0.3 * k;
    const vt = -0.1 + 0.72 * k;
    feathers.push({ path: [[0.24, vb], [0.24 + (len - 0.24) * 0.55, (vb + vt) / 2 + 0.03], [len, vt]], len, vt });
  }
  // Web: the closed wing surface behind the feathers so no gaps open between them.
  const web: Pt[] = [[0.02, -0.3], [0.5, -0.36], [0.9, -0.22]];
  for (const f of feathers) web.push([f.len - 0.06, f.vt + 0.02]);
  web.push([0.36, 0.6], [0.14, 0.42], [0, 0.2]);
  let s = cel(smooth(at(web), 0.8), { fill: st.featherShade, sx: 0, sy: 0, stroke: st.stroke });
  for (const f of feathers) {
    s += cel(taper(at(f.path), W * 0.46, W * 0.3), {
      fill: st.feather, shade: st.featherShade, sx: 0, sy: W * 0.09, stroke: st.featherStroke,
    });
    s += stroke(at(f.path.slice(1).map(([u, v]): Pt => [u, v - 0.12])), st.edge, Math.max(0.7, W * 0.06), 0.85);
  }
  const shield: Pt[] = [
    [-0.02, -0.3], [0.12, -0.42], [0.3, -0.44], [0.48, -0.34], [0.58, -0.16], [0.54, 0.02], [0.42, 0.14], [0.26, 0.26],
    [0.1, 0.3], [-0.03, 0.14],
  ];
  s += cel(smooth(at(shield)), {
    fill: st.covert, shade: st.covertShade, light: st.covertLight, sx: 0.3, sy: W * 0.1, hx: 0.6, hy: W * 0.06, stroke: st.stroke,
    over:
      stroke(at([[0.2, -0.12], [0.3, 0.04]]), st.covertShade, Math.max(0.7, W * 0.06)) +
      stroke(at([[0.34, -0.18], [0.44, -0.02]]), st.covertShade, Math.max(0.7, W * 0.06)),
  });
  if (st.bar) s += stroke(at([[0.06, 0.24], [0.24, 0.2], [0.42, 0.08], [0.53, -0.06]]), st.bar, Math.max(1, W * 0.1));
  s += stroke(at([[0.03, -0.31], [0.2, -0.39], [0.4, -0.35]]), st.covertLight, Math.max(0.8, W * 0.07), 0.9);
  return s;
}

function sparrowBody(): PartArt {
  const legs =
    stroke([[29, 34], [28, 40.5]], '#5a4535', 1.8) +
    stroke([[25.5, 41.5], [28, 40.5], [31, 41.8]], '#5a4535', 1.4) +
    stroke([[34, 34], [34.5, 40.5]], '#5a4535', 1.8) +
    stroke([[32, 41.8], [34.5, 40.5], [37.5, 41.8]], '#5a4535', 1.4);
  const tail = cel(mixed([[19, 20.5], [11, 17.5], [2.5, 16.5, 1], [5, 20.5], [2, 23.5, 1], [6.5, 26], [19, 28.5]]), {
    fill: SP.shade, shade: '#4a3423', light: SP.fill, sx: 1, sy: 1.5, hx: 1, hy: 1, stroke: 2.2,
    over: stroke([[17, 22.5], [9, 20.5], [4, 20.5]], SP.edge, 1, 0.8) + stroke([[17, 25.5], [8, 24.5]], '#4a3423', 1),
  });
  const outline: Pt[] = [
    [14, 25], [17, 18], [24, 13.5], [32, 11.5], [38, 8.5], [42, 4.5], [48, 3], [52.5, 5], [55, 9], [54.8, 13],
    [52.5, 18], [50.5, 24], [46.5, 30], [40, 34.5], [31, 36], [23, 34.5], [17, 31],
  ];
  const face =
    blobFill([[40, 7], [44, 3.6], [49, 2.8], [53, 5], [52, 7.4], [47, 6.4], [42, 8.8]], '#6c6264') + // grey crown
    blobFill([[43, 9.8], [49, 10.2], [53.5, 12.5], [55.5, 15], [52.5, 19.5], [48, 22.5], [44.5, 17.5]], SP.throat) + // pale cheek & throat
    blobFill([[51, 14.5], [54.2, 14.2], [53.5, 19], [50.5, 24.5], [47.2, 22.5], [48.3, 18]], SP.bib) + // dark bib
    blobFill([[37, 9.5], [42, 8.6], [47, 9.2], [44.5, 11], [39, 11.8]], '#7a4a2c') + // chestnut stripe
    blobFill([[45, 24], [49, 25.5], [45, 32], [37, 35.5], [30, 36], [33, 31], [40, 28]], '#c7ae8c') + // buff belly
    stroke([[21, 18.5], [27, 15.5]], '#4a3322', 1.3) +
    stroke([[25, 21.5], [31, 18]], '#4a3322', 1.3) +
    stroke([[33, 15], [37, 13]], '#4a3322', 1.2) +
    dot(49.8, 8.7, 1.7, INK) +
    dot(50.4, 8.1, 0.55, '#f4ead8');
  const body = cel(smooth(outline), {
    fill: SP.fill, shade: SP.shade, light: SP.light, sx: 2.4, sy: 2.6, hx: 1.2, hy: 1.2, stroke: 2.4, over: face,
  });
  const beak = cel(mixed([[54, 8.4], [59.4, 11, 1], [54, 13.6]]), { fill: '#4a3a30', shade: '#2e2420', light: '#7a6552', sx: 0, sy: 1.2, hx: 0.6, hy: 0.6, stroke: 1.6 });
  return part('sparrow.body', 60, 46, 30, 34, legs + tail + body + beak);
}

function sparrowWing(): PartArt {
  // Shoulder at the pivot (38,8); the extended wing sweeps back to the tip.
  const body = featherWing(38, 8, 33, 15, 5, 0.2, {
    covert: '#7d5536', covertShade: SP.shade, covertLight: SP.light, feather: '#5e4230', featherShade: '#45301f',
    edge: SP.edge, bar: SP.throat, stroke: 2, featherStroke: 1.05,
  });
  return part('sparrow.wing', 46, 28, 38, 8, body);
}

// ================================================================== birds

interface BirdCol { fill: string; shade: string; light: string }

function birdA(): PartArt {
  const c: BirdCol = { fill: P.ivory, shade: P.ivoryDark, light: '#f7f0e4' };
  const tail = cel(mixed([[11.4, 13.6], [5.4, 13.8], [1.6, 15.2, 1], [4.2, 17], [2.4, 19.6, 1], [6.8, 19.2], [12, 17.4]]), {
    fill: P.ivoryDark, shade: '#9f8f7a', light: c.fill, sx: 0.6, sy: 1, hx: 0.8, hy: 0.8, stroke: 1.6,
    over: stroke([[10, 16.2], [4, 16.9]], P.violetDark, 0.9, 0.8),
  });
  const outline: Pt[] = [
    [8, 15], [10.5, 10.4], [15, 7.6], [20.5, 6.4], [23.5, 3.2], [28, 1.9], [32, 3.4], [34, 7.2], [33.2, 11.2],
    [30.4, 14.8], [28.2, 19], [23.4, 22.4], [16.4, 23.3], [10.8, 21],
  ];
  const cap = blobFill([[22.2, 5.4], [25, 2.2], [29.5, 1.4], [33, 3.6], [34.4, 6.4], [30.6, 5.2], [26.2, 5.6], [23.6, 7.2]], P.violet);
  const capShade = blobFill([[27, 5.3], [31, 4.9], [34.4, 6.4], [33.6, 7.4], [30.2, 6.6]], P.violetDark);
  const over =
    cap + capShade +
    stroke([[24.2, 3.6], [28.5, 2.6]], P.vein, 1, 0.9) +
    blobFill([[25, 16], [29.5, 14], [29, 18.5], [24, 21.6], [18, 22.6], [21, 19]], '#f6efe3') + // pale breast
    dot(29.3, 7.6, 1.35, INK) +
    dot(29.7, 7.2, 0.45, '#ffffff');
  const body = cel(smooth(outline), { ...c, sx: 1.8, sy: 2, hx: 1, hy: 1, stroke: 2, over });
  const beak = cel(mixed([[33.2, 6.3], [36.2, 8.6, 1], [33.2, 10.6]]), { fill: P.crystalOrange, shade: P.crystalOrangeDark, sx: 0, sy: 1, stroke: 1.4 });
  return part('bird.a', 36, 26, 18, 14, tail + body + beak);
}

function birdAWing(): PartArt {
  const body = featherWing(24, 6, 18.5, 9, 4, 0.22, {
    covert: P.ivory, covertShade: P.ivoryDark, covertLight: '#f7f0e4', feather: mix(P.ivoryDark, P.violet, 0.28),
    featherShade: mix(P.ivoryDark, P.violetDark, 0.45), edge: '#f7f0e4', stroke: 1.6, featherStroke: 0.9,
  });
  return part('bird.a.wing', 30, 18, 24, 6, body);
}

function birdB(): PartArt {
  const c: BirdCol = { fill: P.crystalBlue, shade: P.crystalBlueDark, light: P.crystalBlueLight };
  const streamer = (pts: Pt[]): string =>
    cel(taper(pts, 4.2, 0.9), { fill: P.crystalBlueDark, shade: '#2a4a78', sx: 0.6, sy: 0.8, stroke: 1.6 });
  const tail = streamer([[14, 11], [8, 7.8], [1.8, 4.6]]) + streamer([[14, 13.4], [8, 16.4], [2.4, 20.2]]);
  const outline: Pt[] = [
    [10.5, 12.2], [14.5, 9.2], [20.5, 7.8], [26.5, 6.6], [30.5, 4.6], [34.4, 4.4], [37.4, 6.6], [38.2, 9.6], [36.4, 12],
    [32.4, 14], [26.4, 15.9], [18.6, 16.2], [12.6, 14.8],
  ];
  const over =
    blobFill([[13, 14.2], [20, 13.6], [28, 12.6], [33.6, 12.2], [31.4, 14.4], [25.6, 16.6], [17.6, 16.8]], P.ivory) + // pale belly
    blobFill([[34.4, 9.8], [38.6, 9.8], [36.4, 12.6], [33, 12.8]], P.crystalOrange) + // rust throat
    stroke([[18, 9.4], [27, 8]], P.crystalBlueLight, 1, 0.9) +
    dot(35, 7.6, 1.15, INK) +
    dot(35.4, 7.2, 0.4, '#ffffff');
  const body = cel(smooth(outline), { ...c, sx: 1.4, sy: 1.8, hx: 1, hy: 1, stroke: 2, over });
  const beak = cel(mixed([[37.6, 7.9], [40, 9.2, 1], [37.6, 10.3]]), { fill: '#2b2840', shade: INK, sx: 0, sy: 0.6, stroke: 1.2 });
  return part('bird.b', 40, 24, 20, 13, tail + body + beak);
}

function birdBWing(): PartArt {
  // Long scythe wing of a swallow; shoulder at (28,5).
  const body = featherWing(28, 5, 25, 7.4, 4, 0.14, {
    covert: P.crystalBlue, covertShade: P.crystalBlueDark, covertLight: P.crystalBlueLight, feather: '#3f6aa6',
    featherShade: '#2e5285', edge: P.crystalBlueLight, stroke: 1.6, featherStroke: 0.9,
  });
  return part('bird.b.wing', 34, 16, 28, 5, body);
}

function birdC(): PartArt {
  const c: BirdCol = { fill: P.crystalOrange, shade: P.crystalOrangeDark, light: P.crystalOrangeLight };
  const shard = (bx: number, by: number, hh: number, lean: number, wd: number): string => {
    const tip: Pt = [bx + lean * hh, by - hh];
    const l: Pt = [bx - wd, by];
    const r: Pt = [bx + wd, by];
    const mid: Pt = [bx + lean * hh * 0.3 + wd * 0.15, by - hh * 0.3];
    return (
      fillPath(poly([l, tip, r]), P.crystalTeal) +
      fillPath(poly([tip, r, mid]), P.crystalTealDark) +
      fillPath(poly([l, tip, [l[0] + wd * 0.55, by]]), P.crystalTealLight) +
      line(poly([l, tip, r], false), INK, 1)
    );
  };
  // Crystal crest growing out of the crown (drawn over the head; the base is open).
  const crest =
    glow(22.6, 5, 6.5, P.crystalTealLight, 0.35) +
    shard(19.2, 8.4, 6.6, -0.45, 2.3) + shard(26.2, 8.2, 6, 0.42, 2.1) + shard(22.7, 7.6, 7, 0.03, 2.6);
  const outline: Pt[] = [
    [6.6, 19.6], [6.4, 14.8], [8.9, 11.8], [12.6, 10.8], [15.6, 9.2], [17.4, 6.8], [21, 5.4], [25.4, 5.6], [28.4, 8],
    [29.6, 11.2], [28.3, 14.2], [27.4, 17], [26.2, 20.4], [22.6, 24], [16.8, 25.8], [11.2, 24.8], [8, 22.8],
  ];
  const over =
    blobFill([[26.6, 16.4], [26.8, 20.4], [22.8, 23.8], [16.8, 25.4], [18.6, 21.6], [23.2, 19]], P.crystalOrangeLight) + // fluffy breast
    stroke([[8.9, 12.4], [7.6, 11.2]], P.crystalOrangeDark, 1) + // down tufts
    stroke([[11.8, 11.4], [11.2, 9.8]], P.crystalOrangeDark, 1) +
    stroke([[21, 24], [21.8, 25.8]], P.crystalOrangeDark, 1) +
    ell(24.9, 10.6, 2.1, 2.3, INK) +
    dot(25.5, 9.8, 0.75, '#ffffff') +
    stroke([[22.2, 8], [24.2, 7.3]], P.crystalOrangeDark, 0.9, 0.9);
  const body = cel(smooth(outline), { ...c, sx: 1.8, sy: 2, hx: 1, hy: 1, stroke: 2, over });
  const beak =
    cel(mixed([[28.6, 10.4], [32.6, 11.9, 1], [28.4, 13]]), { fill: '#e8c16a', shade: '#b8913e', sx: 0, sy: 0.8, stroke: 1.2 }) +
    cel(mixed([[28.6, 12.8], [31.4, 13.3, 1], [28.2, 14.5]]), { fill: '#d9a653', shade: '#b8913e', sx: 0, sy: 0.6, stroke: 1.1 });
  const feet = stroke([[13.6, 25.4], [13, 26.9]], '#c77f4a', 1.2) + stroke([[18.4, 25.6], [18.8, 26.9]], '#c77f4a', 1.2);
  return part('bird.c', 34, 28, 17, 15, feet + body + crest + beak);
}

function birdCWing(): PartArt {
  const pts: MPt[] = [
    [21.4, 3.2], [15, 3], [9, 4.8], [4.8, 7.6], [2.6, 11, 1], [5.8, 11.2], [7, 13.6, 1], [9.8, 12], [12, 13.8, 1],
    [14.6, 11.8], [18.4, 9.8], [21.8, 6.6],
  ];
  const over =
    stroke([[13, 7.4], [7, 13.6]], P.crystalOrangeDark, 0.9) +
    stroke([[16, 8], [12, 13.8]], P.crystalOrangeDark, 0.9) +
    stroke([[18.6, 5], [11, 5.2]], P.crystalOrangeLight, 1, 0.95) +
    dot(6, 9.4, 1.1, P.crystalTeal, 0.95);
  return part(
    'bird.c.wing', 24, 16, 19, 5,
    cel(mixed(pts), { fill: '#cc8752', shade: P.crystalOrangeDark, light: P.crystalOrangeLight, sx: 0.5, sy: 1.4, hx: 0.8, hy: 0.8, stroke: 1.7, over }),
  );
}

// ================================================================== fish

interface FishCol { fill: string; shade: string; light: string; belly: string; fin: string; finShade: string; finLight: string }

const FISH_A: FishCol = { fill: '#8fa6bf', shade: '#62799a', light: '#cfdceb', belly: '#b9c8d9', fin: '#7f97b3', finShade: '#5d7592', finLight: '#b9c9dc' };
const FISH_B: FishCol = { fill: P.crystalTeal, shade: P.crystalTealDark, light: P.crystalTealLight, belly: '#bfe9e1', fin: '#3fa394', finShade: '#2c7a6f', finLight: P.crystalTealLight };
const FISH_C: FishCol = { fill: P.crystalOrange, shade: P.crystalOrangeDark, light: P.crystalOrangeLight, belly: '#f2cfa6', fin: P.violet, finShade: P.violetDark, finLight: '#b98ae6' };

const fin = (pts: MPt[], c: FishCol, sw = 1.5, over = ''): string =>
  cel(mixed(pts), { fill: c.fin, shade: c.finShade, light: c.finLight, sx: 0.5, sy: 1, hx: 0.6, hy: 0.6, stroke: sw, over });

/** Fan of fin rays from a root point to points along the fin edge. */
const rays = (root: Pt, ends: readonly Pt[], color: string, w = 0.8, o = 0.85): string =>
  ends.map((e) => line(`M${n2(root[0])} ${n2(root[1])}L${n2(e[0])} ${n2(e[1])}`, color, w, o)).join('');

/** Rows of small scale arcs, convex toward the tail. */
function scales(x0: number, x1: number, y0: number, y1: number, dx: number, dy: number, r: number, color: string, o: number): string {
  let d = '';
  let row = 0;
  for (let y = y0; y <= y1; y += dy, row++) {
    for (let x = x0 + (row % 2) * (dx / 2); x <= x1; x += dx) d += `M${n2(x)} ${n2(y - r)}q${n2(-r * 1.1)} ${n2(r)} 0 ${n2(r * 2)}`;
  }
  return line(d, color, 0.8, o);
}

function fishA(): PartArt {
  const c = FISH_A;
  const dorsal = fin([[15, 8], [19, 2.6, 1], [26, 1.6], [32, 3.4], [35, 6.2]], c, 1.5, rays([25, 8], [[19, 3], [23, 2], [27, 2], [31, 3.6]], c.finShade));
  const anal = fin([[12, 16.4], [14, 21, 1], [18, 18.6]], c, 1.3) + fin([[22, 18.6], [24.5, 22.6, 1], [28.5, 19]], c, 1.3);
  const outline: Pt[] = [
    [3.8, 12], [8, 9.8], [14, 7.2], [20, 5.2], [28, 4.2], [35, 5], [41, 7], [45, 9.4], [46.6, 12], [45, 14.6], [40, 17.2],
    [33, 19.2], [25, 19.8], [17, 18.2], [11, 16.2], [6.4, 14.4],
  ];
  const over =
    blobFill([[8, 14], [16, 15], [26, 15.6], [36, 15.2], [44, 13.8], [40, 17.6], [30, 20.6], [18, 19.4]], c.belly) +
    scales(12, 33, 8, 16, 4, 2.8, 1.3, c.shade, 0.55) +
    stroke([[8, 11.4], [18, 10.4], [30, 10], [35, 10.4]], c.light, 0.9, 0.8) + // lateral line
    stroke([[35.6, 5.8], [33.8, 10.5], [35.4, 16.2]], c.shade, 1.3) + // gill cover
    ell(39.4, 9.6, 2.3, 2.3, '#e6edf4') +
    dot(39.8, 9.7, 1.35, INK) +
    dot(39.2, 9, 0.45, '#ffffff') +
    stroke([[45.4, 12.4], [46.8, 12.6]], INK, 0.9);
  const body = cel(smooth(outline), { fill: c.fill, shade: c.shade, light: c.light, sx: 1, sy: 2.2, hx: 1, hy: 1, stroke: 2, over });
  const pect = cel(mixed([[33.6, 13.6], [28.4, 14.2], [26.4, 15.8, 1], [28.6, 16.8], [33, 15.4]]), {
    fill: c.finLight, shade: c.fin, sx: 0, sy: 0.9, stroke: 1, ink: c.finShade, over: rays([33, 14.4], [[27.4, 15], [27.8, 16.4]], c.finShade, 0.6, 0.8),
  });
  const barbel = stroke([[45, 13.6], [46.2, 15.6], [44.6, 17.4]], INK, 0.9);
  return part('fish.a', 48, 24, 26, 12, dorsal + anal + body + pect + barbel);
}

function fishATail(): PartArt {
  const c = FISH_A;
  const pts: MPt[] = [[19.5, 9], [13, 7.6], [8, 4.6], [2.5, 2, 1], [4.2, 6.6], [7.4, 11, 1], [4.2, 15.4], [2.5, 20, 1], [8, 17.4], [13, 14.4], [19.5, 13]];
  const over = rays([17, 11], [[4, 3], [6, 6.5], [8, 9.5], [8, 12.5], [6, 15.5], [4, 19]], c.finShade, 0.8, 0.9) + stroke([[16, 9.6], [10, 7], [4.4, 3.4]], c.finLight, 0.9, 0.9);
  return part('fish.a.tail', 20, 22, 18, 11, cel(mixed(pts), { fill: c.fin, shade: c.finShade, light: c.finLight, sx: 0.4, sy: 1.4, hx: 0.6, hy: 0.8, stroke: 1.6, over }));
}

function fishB(): PartArt {
  const c = FISH_B;
  const dorsal = fin([[20, 6.4], [24, 2.6, 1], [30, 3.4], [32, 6]], c, 1.3);
  const anal = fin([[16, 13.4], [19, 17, 1], [23, 14]], c, 1.2);
  const outline: Pt[] = [
    [3, 10], [8, 8.4], [15, 6.8], [24, 5.8], [32, 5.8], [38, 6.8], [42, 8.5], [43.6, 10], [42, 11.6], [37, 13.3],
    [30, 14.4], [22, 14.4], [14, 13.4], [8, 12], [4, 10.8],
  ];
  const over =
    blobFill([[8, 11.4], [16, 11.4], [26, 11.6], [36, 11.4], [42, 10.8], [37, 13.6], [28, 15], [16, 14.2]], c.belly) +
    stroke([[6, 10], [16, 9.6], [28, 9.4], [36, 9.4]], '#2f6f67', 1.3, 0.9) + // dark lateral stripe
    stroke([[10, 8.2], [22, 7], [32, 7]], c.light, 0.9, 0.9) +
    stroke([[34.4, 6.6], [33.2, 9.6], [34.2, 12.6]], c.shade, 1.1) +
    ell(38.2, 8.8, 1.9, 1.9, '#e9f7f4') +
    dot(38.5, 8.9, 1.1, INK) +
    dot(38, 8.3, 0.4, '#ffffff');
  const body = cel(smooth(outline), { fill: c.fill, shade: c.shade, light: c.light, sx: 0.8, sy: 1.8, hx: 0.8, hy: 0.8, stroke: 1.9, over });
  const pect = cel(mixed([[32.6, 11.4], [28.4, 11.8], [26.6, 13.2, 1], [28.6, 13.8], [32.2, 12.8]]), { fill: c.finLight, shade: c.fin, sx: 0, sy: 0.7, stroke: 0.9, ink: c.finShade });
  return part('fish.b', 44, 20, 24, 10, dorsal + anal + body + pect);
}

function fishBTail(): PartArt {
  const c = FISH_B;
  const pts: MPt[] = [[17.4, 8], [12, 6.4], [7, 3.6], [2, 1.6, 1], [4.8, 6], [8, 9, 1], [4.8, 12], [2, 16.4, 1], [7, 14.4], [12, 11.6], [17.4, 10]];
  const over = rays([15.5, 9], [[3.5, 2.6], [6, 6], [6, 12], [3.5, 15.4]], c.finShade, 0.8, 0.9) + stroke([[14, 7.6], [8, 5], [3.6, 2.6]], c.finLight, 0.9, 0.9);
  return part('fish.b.tail', 18, 18, 16, 9, cel(mixed(pts), { fill: c.fin, shade: c.finShade, light: c.finLight, sx: 0.4, sy: 1.2, hx: 0.6, hy: 0.6, stroke: 1.5, over }));
}

function fishC(): PartArt {
  const c = FISH_C;
  const dorsal = fin([[11, 8.4], [14.4, 2.6, 1], [21.6, 1.6], [28, 3.4], [30.6, 6.6]], c, 1.4, rays([21, 8], [[15, 3], [19, 2], [23, 2.2], [27, 3.6]], c.finShade));
  const anal = fin([[13, 20.6], [15, 26, 1], [21, 25.6], [24, 22.4]], c, 1.3, rays([18, 21], [[15.6, 25], [19, 25.4]], c.finShade));
  const outline: Pt[] = [
    [4, 14], [7.6, 10.8], [12.6, 7.4], [19, 5.2], [26, 5], [32, 7], [36.2, 10.2], [38.2, 13.6], [37.2, 17.2], [33.4, 20.6],
    [27.4, 23.2], [20, 23.6], [13, 21.6], [8, 18.2], [4.8, 15.6],
  ];
  const over =
    blobFill([[10, 17], [18, 18.4], [28, 18.2], [36, 16.4], [33.6, 20.8], [26, 24], [16, 23.6]], c.belly) +
    scales(13, 29, 9, 17, 4.2, 3, 1.4, c.shade, 0.5) +
    stroke([[32.2, 7.8], [30.2, 13], [32, 18.6]], c.shade, 1.3) +
    ell(32.4, 11.2, 2.6, 2.6, '#fbe9d3') +
    dot(32.8, 11.3, 1.55, INK) +
    dot(32.1, 10.5, 0.5, '#ffffff') +
    stroke([[37.6, 14.2], [36, 15]], INK, 0.9);
  const body = cel(smooth(outline), { fill: c.fill, shade: c.shade, light: c.light, sx: 1.2, sy: 2.4, hx: 1, hy: 1, stroke: 2, over });
  const pect = cel(mixed([[28.4, 14.6], [22.8, 15.4], [20.6, 17.4, 1], [23.2, 18.4], [27.8, 16.8]]), {
    fill: c.finLight, shade: c.fin, sx: 0, sy: 0.9, stroke: 1, ink: c.finShade, over: rays([27.8, 15.6], [[21.8, 16.4], [22.4, 17.8]], c.finShade, 0.6, 0.8),
  });
  return part('fish.c', 40, 28, 22, 14, dorsal + anal + body + pect);
}

function fishCTail(): PartArt {
  const c = FISH_C;
  const pts: MPt[] = [[17.4, 9.6], [12, 7.2], [6.4, 3.4], [2, 2.6, 1], [1.2, 7.6], [3, 11], [1.2, 14.4], [2, 19.4, 1], [6.4, 18.6], [12, 14.8], [17.4, 12.4]];
  const over = rays([15.5, 11], [[3, 3.6], [2.4, 7.6], [3.4, 11], [2.4, 14.4], [3, 18.4]], c.finShade, 0.8, 0.9) + stroke([[14, 9], [8, 5.6], [3.4, 3.6]], c.finLight, 0.9, 0.9);
  return part('fish.c.tail', 18, 22, 16, 11, cel(mixed(pts), { fill: c.fin, shade: c.finShade, light: c.finLight, sx: 0.4, sy: 1.4, hx: 0.6, hy: 0.6, stroke: 1.5, over }));
}

// ================================================================== raccoons

const RC = {
  fill: P.raccoon, shade: P.raccoonDark, light: P.raccoonLight, mask: '#2c2a35', white: '#e9e6ee', paw: '#3a3844',
  ring: '#3d3a47', tail: '#a4a1ab', chest: '#99969f',
};

/** Bands crossing a polyline at fractions of its length (tail rings). */
function crossBands(pts: readonly Pt[], ts: readonly number[], half: number, color: string, w: number, o = 1): string {
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
    segs.push(l);
    total += l;
  }
  let d = '';
  for (const t of ts) {
    let s = t * total;
    let i = 0;
    while (i < segs.length - 1 && s > segs[i]!) {
      s -= segs[i]!;
      i++;
    }
    const a = pts[i]!;
    const b = pts[i + 1]!;
    const l = segs[i] || 1;
    const ux = (b[0] - a[0]) / l;
    const uy = (b[1] - a[1]) / l;
    const x = a[0] + ux * s;
    const y = a[1] + uy * s;
    d += `M${n2(x - uy * half)} ${n2(y + ux * half)}L${n2(x + uy * half)} ${n2(y - ux * half)}`;
  }
  return line(d, color, w, o);
}

/** Ringed raccoon tail along `pts` (base first). */
function raccoonTail(pts: Pt[], w0: number, w1: number): string {
  const tip = pts[pts.length - 1]!;
  const prev = pts[pts.length - 2]!;
  const l = Math.hypot(tip[0] - prev[0], tip[1] - prev[1]) || 1;
  const cap: Pt = [tip[0] + ((tip[0] - prev[0]) / l) * w1 * 0.25, tip[1] + ((tip[1] - prev[1]) / l) * w1 * 0.25];
  return cel(taper(pts, w0, w1), {
    fill: RC.tail, shade: RC.shade, light: '#c4c1ca', sx: 1.2, sy: 1.8, hx: 0.8, hy: 0.8, stroke: 2.4,
    over: crossBands(pts, [0.2, 0.42, 0.63, 0.82], w0, RC.ring, w0 * 0.3) + ell(cap[0], cap[1], w1 * 0.75, w1 * 0.75, RC.ring),
  });
}

interface RaccoonHead {
  outline: Pt[];
  earFar: Pt[];
  earNear: Pt[];
  mask: Pt[];
  brow: Pt[];
  muzzle: Pt[];
  cheek: Pt[];
  stripe: Pt[];
  eye: Pt;
  nose: Pt;
  mouth: Pt[];
}

function raccoonHead(h: RaccoonHead): string {
  const ear = (pts: Pt[], far: boolean): string => {
    const cx = (pts[0]![0] + pts[1]![0] + pts[2]![0]) / 3;
    const cy = (pts[0]![1] + pts[1]![1] + pts[2]![1]) / 3;
    const inner = pts.map(([x, y]): Pt => [cx + (x - cx) * 0.55, cy + (y - cy) * 0.55 + 0.8]);
    return cel(smooth(pts, 0.6), {
      fill: far ? '#c9c6cf' : '#dddae3', shade: '#a9a6b0', sx: 0.6, sy: 0.8, stroke: 2.2,
      over: blobFill(inner, far ? '#3a3844' : '#4a4754'),
    });
  };
  const [ex, ey] = h.eye;
  const face =
    blobFill(h.cheek, '#d3d0d9') +
    blobFill(h.mask, RC.mask) +
    blobFill(h.brow, RC.white) +
    blobFill(h.muzzle, RC.white) +
    stroke(h.stripe, '#4a4754', 2) +
    ell(ex, ey, 2.4, 2.4, '#6e6b78') +
    ell(ex, ey, 1.9, 1.9, '#15131f') +
    dot(ex + 0.7, ey - 0.8, 0.75, '#e6e9f3') +
    ell(h.nose[0], h.nose[1], 2.3, 1.8, INK) +
    dot(h.nose[0] - 0.6, h.nose[1] - 0.6, 0.55, '#8d8a98') +
    stroke(h.mouth, INK, 1.1) +
    dot(h.nose[0] - 6.2, h.nose[1] + 1.6, 0.5, '#8a8794') +
    dot(h.nose[0] - 5, h.nose[1] + 3, 0.5, '#8a8794') +
    dot(h.nose[0] - 7.4, h.nose[1] + 3.2, 0.5, '#8a8794');
  return (
    ear(h.earFar, true) +
    ear(h.earNear, false) +
    cel(smooth(h.outline), { fill: RC.fill, shade: RC.shade, light: RC.light, sx: 2.2, sy: 2.2, hx: 1.1, hy: 1.1, stroke: 2.6, over: face })
  );
}

function raccoonSit(): PartArt {
  let s = raccoonTail([[25, 75.5], [15.5, 79.2], [7.5, 78], [3.8, 71.5], [5, 63.5]], 12.5, 8);
  const body: Pt[] = [
    [20, 81], [15.5, 73], [15, 63], [18.5, 53], [25, 45], [32, 39], [40, 36.5], [47, 39], [51, 45.5], [52.5, 53],
    [50.5, 61], [50.5, 68.5], [53, 76], [51, 81.8], [40, 82.4], [28, 82.4],
  ];
  s += cel(smooth(body), {
    fill: RC.fill, shade: RC.shade, light: RC.light, sx: 3, sy: 2, hx: 1.4, hy: 1.2, stroke: 2.8,
    over:
      blobFill([[46.5, 43.5], [51, 48], [52.4, 56], [50.4, 64], [47.2, 58.5], [45.4, 50.5]], RC.chest) +
      stroke([[22.5, 53], [25.5, 49.5]], RC.shade, 1.2) +
      stroke([[19.5, 60], [22, 56.5]], RC.shade, 1.2) +
      stroke([[29, 44.5], [32, 42]], RC.light, 1.1, 0.9),
  });
  // Near haunch and hind foot.
  s += blobFill([[26, 70], [29, 62.6], [36, 59.6], [43, 61], [47.6, 66.4], [47.8, 73], [43.6, 78.4], [33, 80], [27, 77.4]], '#8a8792');
  s += blobFill([[38, 76.6], [44.6, 72.6], [47.8, 73], [46.6, 77.6], [42, 80.2]], RC.shade);
  s += stroke([[27.4, 69], [30.4, 62.6], [37, 59.8], [43.4, 61.2], [47.4, 65.8]], INK, 2);
  s += stroke([[31, 63.4], [36.6, 61.4]], RC.light, 1.2, 0.9);
  s += cel(smooth([[42.4, 77.2], [50, 76.4], [57.6, 77.8], [61.4, 80.2], [59.4, 82.4], [44, 82.6]], 0.8), {
    fill: RC.paw, shade: '#27252f', light: '#57545f', sx: 0.6, sy: 1.2, hx: 0.8, hy: 0.8, stroke: 2.2,
    over: stroke([[56.4, 79.2], [57.2, 82.4]], '#1f1d27', 0.9) + stroke([[53, 79.4], [53.6, 82.4]], '#1f1d27', 0.9),
  });
  // Far forearm/paw behind, near forearm/paw in front: held up to the chest.
  s += cel(taper([[46, 43.4], [52.8, 45.8], [57.6, 45.4]], 6.4, 5), { fill: RC.shade, shade: '#4a4754', sx: 0.6, sy: 1, stroke: 2.2 });
  s += cel(ellipsePath(59.4, 45.2, 3.3, 2.9), { fill: RC.paw, shade: '#27252f', sx: 0.6, sy: 0.8, stroke: 1.8 });
  s += raccoonHead({
    outline: [[33, 26], [33.5, 17.5], [37.5, 11], [44.5, 7.6], [51.5, 9.2], [56, 14], [61, 18.5], [65.5, 22.5], [65, 27], [59, 30], [51, 33], [42.5, 34], [36.5, 31.5]],
    earFar: [[33.6, 14.2], [34.6, 4.4], [41, 9.6]],
    earNear: [[42, 9.2], [46.6, 1.8], [50.6, 8.6]],
    mask: [[39.5, 18.5], [45.5, 15.8], [53, 15.3], [58.5, 18.6], [56.6, 22.8], [50.5, 24.2], [44.6, 27.2], [39, 25.2]],
    brow: [[42.6, 13.8], [49.5, 11.6], [56.6, 14.4], [56, 16.2], [49.6, 14.6], [44, 16]],
    muzzle: [[54.8, 21.6], [60, 20.2], [64.6, 23], [64.4, 27.4], [58.6, 29.6], [53.2, 28], [52, 24.6]],
    cheek: [[39.6, 26.4], [45, 27.2], [49.6, 29.6], [44.4, 32.8], [38.8, 30.6]],
    stripe: [[49.6, 9.6], [52.6, 13.4], [56.2, 17.8]],
    eye: [53.2, 19.4],
    nose: [64.8, 23.6],
    mouth: [[63.8, 27], [61.2, 28.2], [58.8, 27.8]],
  });
  s += cel(taper([[41.6, 44], [48.4, 49.4], [54.2, 50.8]], 8, 6), {
    fill: RC.fill, shade: RC.shade, light: RC.light, sx: 1, sy: 1.8, hx: 0.8, hy: 0.8, stroke: 2.4,
  });
  s += cel(smooth([[53.4, 48.6], [57, 47.6], [59.8, 49.6], [59.4, 52.8], [55.6, 53.8], [53, 52]]), {
    fill: RC.paw, shade: '#27252f', light: '#57545f', sx: 0.6, sy: 1, hx: 0.6, hy: 0.6, stroke: 1.9,
    over: stroke([[57.2, 49.2], [58.6, 52.6]], '#1f1d27', 0.8) + stroke([[55.4, 49.4], [56.2, 53.2]], '#1f1d27', 0.8),
  });
  return part('raccoon.sit', 74, 84, 37, 84, s);
}

function raccoonSniff(): PartArt {
  const leg = (pts: Pt[], w0: number, w1: number, far: boolean): string =>
    cel(taper(pts, w0, w1), {
      fill: far ? RC.shade : RC.fill, shade: far ? '#4a4754' : RC.shade, light: far ? undefined : RC.light,
      sx: 1.4, sy: 0.4, hx: 0.8, hy: 0, stroke: 2.4,
      over: fillPath(`M0 ${n2(pts[pts.length - 1]![1] - 5)}H96V62H0Z`, RC.paw),
    });
  const foot = (x: number, far: boolean): string =>
    cel(ellipsePath(x, 57.9, 4.6, 2.4), { fill: far ? '#2f2d38' : RC.paw, shade: '#1f1d27', sx: 0.4, sy: 0.8, stroke: 2 });
  let s = '';
  s += leg([[33.4, 41], [34.2, 49], [35, 56.2]], 7.8, 6, true) + foot(38, true);
  s += leg([[53.8, 41], [54.8, 49], [55.8, 56.2]], 7.6, 5.6, true) + foot(58.8, true);
  s += raccoonTail([[17, 26], [10, 22], [4.8, 23.8], [4.2, 30.4]], 11.5, 7.4);
  s += cel(smooth([[12, 31], [16, 22.4], [26, 17.2], [38, 17.4], [50, 21.6], [60, 27], [66.4, 33.4], [65.4, 41], [57, 45.6], [45, 46.6], [33, 45.8], [21, 44.6], [14, 39.6]]), {
    fill: RC.fill, shade: RC.shade, light: RC.light, sx: 2, sy: 3.2, hx: 1.4, hy: 1.4, stroke: 2.8,
    over:
      blobFill([[26, 42.6], [38, 42], [50, 41.6], [61, 39.6], [58, 46], [44, 47.6], [30, 46.6]], RC.chest) +
      stroke([[27, 20.4], [31, 19]], RC.light, 1.1, 0.9) +
      stroke([[40, 21.4], [44, 22]], RC.shade, 1.1) +
      stroke([[48, 26.4], [52, 28.2]], RC.shade, 1.1),
  });
  // Near haunch (shaded mass + fold line), hind and fore legs.
  s += blobFill([[18, 34.6], [21.6, 27.6], [29.6, 26], [36.4, 30.6], [37, 38.4], [33, 44.4], [24, 44.6], [19.4, 40.6]], '#8a8792');
  s += blobFill([[29, 43], [35.6, 37.6], [37, 38.4], [34.4, 44], [30, 45]], RC.shade);
  s += stroke([[18.6, 33.4], [22, 27.8], [29.6, 26.2], [35.6, 29.8]], INK, 2);
  s += leg([[29.4, 41.6], [29, 49], [30, 56.2]], 8.4, 6.4, false) + foot(33, false);
  s += leg([[59.6, 39.6], [60.8, 48.4], [61.8, 56.2]], 8.4, 6, false) + foot(64.8, false);
  s += raccoonHead({
    outline: [[61, 34], [61.6, 26], [65.6, 20], [71.6, 17], [78, 16], [84, 14.6], [89, 13.2], [92.8, 15], [91.6, 18.8], [86.6, 22.6], [81, 28.4], [73, 33.6], [66, 35.6]],
    earFar: [[63, 21.2], [63.2, 12.8], [69, 17]],
    earNear: [[67.2, 17.8], [70.4, 10], [75, 16.2]],
    mask: [[66.8, 23.6], [72.4, 19.8], [79.6, 18.2], [84.2, 19.4], [83, 23.4], [77.2, 25.2], [71.6, 29], [66.4, 28]],
    brow: [[69.4, 18.6], [75.4, 15.8], [81.8, 15.8], [80.6, 17.6], [75, 17.6], [70.6, 20.2]],
    muzzle: [[82.6, 19.4], [87.4, 16.4], [92.2, 15.8], [91, 19], [86.2, 23], [81.6, 24.6], [80.8, 22]],
    cheek: [[66.6, 29], [71, 29.8], [74.6, 31.6], [70.4, 34.4], [65.4, 33.4]],
    stripe: [[76.4, 15.8], [80.6, 17.4], [84.4, 19.4]],
    eye: [79.4, 20.8],
    nose: [92.4, 14.8],
    mouth: [[90.6, 18.4], [88, 20.8], [85.6, 21.6]],
  });
  // Sniffing: short breath arcs in front of the raised nose.
  s += stroke([[94.2, 9.6], [95.2, 7.8]], '#c7ccde', 0.9, 0.8) + stroke([[94.8, 12.4], [95.6, 11.6]], '#c7ccde', 0.9, 0.6);
  return part('raccoon.sniff', 96, 62, 48, 62, s);
}

function raccoonShadow(): PartArt {
  const C = '#1f2340';
  let s = '';
  s += fillPath(taper([[51, 56.5], [60, 55], [65.6, 48.6], [65.4, 40]], 11.6, 7), C);
  s += line('M56.4 50.6L57.2 60.4M62.6 48L68 52.8M61.8 42.4L68.8 41.8', '#272c4d', 2.6, 0.9);
  s += fillPath(smooth([[12.6, 59.5], [13, 47], [17, 38], [24, 32.4], [34, 30.6], [44, 32], [51, 37.6], [55.4, 46], [56.6, 59.5]]), C);
  s += fillPath(smooth([[21.6, 14], [22.6, 7], [25.6, 4.6], [29.4, 6], [31.2, 10.4]], 0.9), C) + fillPath(smooth([[36.6, 10], [38.6, 4.6], [42.4, 3.6], [45, 6.4], [45.8, 11.6]], 0.9), C);
  s += fillPath(poly([[22.6, 20], [17.4, 25.4], [23.4, 25.2], [19.8, 29.6], [27, 27.4]]), C);
  s += fillPath(smooth([[21, 23], [22, 15.5], [27, 10.6], [34, 9], [41, 9.6], [46, 12.6], [50.6, 16], [55, 19.4], [55.6, 21.8], [52.4, 23.8], [46, 27.2], [38, 29.6], [29, 29]]), C);
  for (const [x, y] of [[34.6, 17.8], [44.2, 17]] as Pt[]) {
    s += glow(x, y, 5.5, '#9fb0ff', 0.28);
    s += fillPath(ellipsePath(x, y, 2.1, 1.35), '#cfd8ff', 0.72);
    s += dot(x + 0.5, y - 0.3, 0.55, '#ffffff', 0.8);
  }
  return part('raccoon.shadow', 70, 60, 35, 60, s);
}

// ================================================================== moon & sun
//
// Drawn as in the paintings: the Moon is a crescent with a single eye (the
// ancient one cries a cascade of tears), the Sun a round apricot face with
// a ring of spiky rays and a sad, tired face. Flat fills, thin ink.

/** Crescent: disc (cx,cy,r) minus a disc shifted by (dx,dy)·r of radius k·r. */
function crescentPath(cx: number, cy: number, r: number, dx: number, dy: number, k: number): string {
  const ox = cx + r * dx;
  const oy = cy + r * dy;
  const r2 = r * k;
  const d = Math.hypot(ox - cx, oy - cy);
  const tc = Math.atan2(oy - cy, ox - cx);
  const al = Math.acos((r * r + d * d - r2 * r2) / (2 * r * d));
  const be = Math.acos((r2 * r2 + d * d - r * r) / (2 * r2 * d));
  const pts: Pt[] = [];
  const N = 40;
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

/** A tear drop pointing up, tip at (x, y). */
function tear(x: number, y: number, s: number, fill: string): string {
  const d = `M${n2(x)} ${n2(y)}C${n2(x + s * 0.2)} ${n2(y + s * 0.5)} ${n2(x + s * 0.55)} ${n2(y + s * 0.8)} ${n2(x + s * 0.5)} ${n2(y + s * 1.15)}C${n2(x + s * 0.45)} ${n2(y + s * 1.5)} ${n2(x - s * 0.45)} ${n2(y + s * 1.5)} ${n2(x - s * 0.5)} ${n2(y + s * 1.15)}C${n2(x - s * 0.55)} ${n2(y + s * 0.8)} ${n2(x - s * 0.2)} ${n2(y + s * 0.5)} ${n2(x)} ${n2(y)}Z`;
  return cel(d, { fill, stroke: 1.5 });
}

/** Small five-point star with a thin contour. */
function starShape(cx: number, cy: number, r: number, fill: string, rot = 0): string {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rot - Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return cel(poly(pts), { fill, stroke: 1.4 });
}

const MOON_BABY = { fill: '#c6dbe6', mark: '#9fb9c8', eye: '#f39ac0', eyeDeep: '#e27aa8', blush: '#f4c1d6' };

function moonBaby(): PartArt {
  // Fat crescent opening to the upper right, like the Moon of the first painting.
  const d = crescentPath(130, 130, 112, 0.55, -0.1, 0.86);
  let over = '';
  // Soft cheek, a few pencil marks, and little stars caught in the curve.
  over += ell(58, 160, 14, 8, MOON_BABY.blush, 0.9);
  over += stroke([[40, 196], [52, 204], [66, 206]], MOON_BABY.mark, 1.4);
  over += stroke([[34, 110], [36, 126]], MOON_BABY.mark, 1.3) + stroke([[98, 222], [112, 226]], MOON_BABY.mark, 1.3);
  let s = cel(d, { fill: MOON_BABY.fill, over });
  s += starShape(196, 150, 11, PASTEL.butter, 0.2) + starShape(226, 196, 8, PASTEL.mint, -0.3) + starShape(176, 206, 7, PASTEL.pink, 0.4);
  return part('moon.baby', 260, 260, 130, 130, s);
}

function moonBabyEye(): PartArt {
  // A big pink eye with a heavy black upper lid (sleepy, like the first painting).
  const oval = ellipsePath(28, 22, 23, 16);
  const inner = fillPath(`M3 22Q6 4 28 5Q50 4 53 22Q40 13 28 13Q15 13 3 22Z`, INK) + ell(20, 25, 3, 2.2, '#ffffff', 0.9);
  let s = cel(oval, { fill: MOON_BABY.eye, inner, stroke: 1.8 });
  s += stroke([[10, 33], [28, 38], [46, 33]], MOON_BABY.eyeDeep, 1.2, 0.8);
  return part('moon.baby.eye', 56, 44, 28, 22, s);
}

function moonBabyLid(): PartArt {
  const d = `M3 22Q6 4 28 4Q50 4 53 22Q40 30 28 30Q16 30 3 22Z`;
  let s = cel(d, { fill: MOON_BABY.fill, stroke: 1.8 });
  s += stroke([[6, 24], [28, 31], [50, 24]], INK, 1.8);
  for (const x of [14, 22, 30, 38, 44]) s += stroke([[x, 29], [x - 1, 34]], INK, 1.2);
  return part('moon.baby.lid', 56, 44, 28, 22, s);
}

function moonBabyMouth(): PartArt {
  let s = stroke([[6, 10], [16, 13], [26, 11]], INK, 1.8);
  s += stroke([[3, 8], [6, 10]], INK, 1.2);
  return part('moon.baby.mouth', 32, 20, 16, 10, s);
}

const MOON_OLD = { fill: '#b3b3e0', mark: '#8f8fc6', iris: '#9fd6a3', tear: '#9ed7ea', tearDeep: '#7cc0dc' };

function moonOld(): PartArt {
  // A thinner crescent with sharp horns, as in the second painting.
  const d = crescentPath(150, 150, 132, 0.5, -0.12, 0.84);
  let over = '';
  for (const [x, y, x2, y2] of [[34, 150, 36, 170], [50, 220, 62, 232], [48, 92, 58, 80], [96, 262, 112, 266]] as const) {
    over += stroke([[x, y], [x2, y2]], MOON_OLD.mark, 1.4);
  }
  let s = cel(d, { fill: MOON_OLD.fill, over });
  // The tears: a cascade of drops from the eye down the cheek.
  const drops: [number, number, number][] = [
    [64, 146, 10], [52, 162, 11], [76, 166, 10], [62, 184, 12], [46, 196, 9], [80, 198, 11],
    [58, 218, 12], [78, 232, 10], [64, 250, 10], [82, 266, 8],
  ];
  drops.forEach(([x, y, r], i) => {
    s += tear(x, y, r, i % 3 === 0 ? MOON_OLD.tearDeep : MOON_OLD.tear);
  });
  return part('moon.old', 300, 300, 150, 150, s);
}

function moonOldEye(): PartArt {
  // A tired eye: pale almond, green iris, a heavy black lid over its top.
  const almond = `M4 22Q18 6 32 6Q48 6 60 22Q46 36 32 36Q16 36 4 22Z`;
  const inner = ell(34, 24, 8.5, 9, MOON_OLD.iris) + ell(35, 25, 4, 4.4, INK) + fillPath(`M2 22Q16 2 32 3Q50 3 62 22Q48 14 32 14Q16 14 2 22Z`, INK) + dot(31, 21, 1.6, '#ffffff', 0.9);
  let s = cel(almond, { fill: '#eef3f0', inner, stroke: 1.8 });
  s += stroke([[10, 34], [32, 40], [54, 34]], MOON_OLD.mark, 1.2);
  return part('moon.old.eye', 64, 44, 32, 22, s);
}

function moonOldLid(): PartArt {
  const d = `M3 22Q16 4 32 4Q48 4 61 22Q46 30 32 30Q18 30 3 22Z`;
  let s = cel(d, { fill: MOON_OLD.fill, stroke: 1.8 });
  s += stroke([[6, 24], [32, 32], [58, 24]], INK, 2);
  for (const x of [16, 26, 36, 46]) s += stroke([[x, 30], [x - 1.5, 36]], INK, 1.2);
  return part('moon.old.lid', 64, 44, 32, 22, s);
}

function moonOldMouth(): PartArt {
  let s = stroke([[6, 16], [18, 11], [32, 12], [42, 16]], INK, 1.8);
  s += stroke([[14, 20], [26, 19]], MOON_OLD.mark, 1.2);
  return part('moon.old.mouth', 48, 28, 24, 14, s);
}

function moonOldLaugh(): PartArt {
  const outer = smooth([[4, 10], [22, 7], [42, 10], [38, 24], [24, 32], [10, 26]]);
  let teeth = '';
  for (const x of [12, 20, 28]) teeth += cel(`M${x} 8L${x + 7} 8L${x + 6} 14L${x + 1} 14Z`, { fill: '#fbf5e6', stroke: 1.1 });
  const inner = teeth + ell(24, 27, 8, 5, PASTEL.pinkDeep);
  const s = cel(outer, { fill: '#3a3446', inner, stroke: 1.8 });
  return part('moon.old.mouth.laugh', 48, 36, 24, 16, s);
}

const SUN_ART = {
  face: '#f3be86', mark: '#d9955f', ring: '#ef8f86', ringDeep: '#e0716c', ray: '#f4e08c', rayLime: '#dbe68a', cheek: '#f4a3a0',
};

function sunDisk(): PartArt {
  const rng = new Rng(9160);
  const outline = radial(160, 160, 60, (a) => 138 + 2.2 * Math.sin(a * 5 + 0.6) + rng.range(-0.8, 0.8));
  let over = '';
  // Little '^' pencil marks all over the face, like the Sun of the fourth painting.
  for (let i = 0; i < 46; i++) {
    const a = rng.range(0, Math.PI * 2);
    const r = rng.range(20, 124);
    const x = 160 + Math.cos(a) * r;
    const y = 160 + Math.sin(a) * r;
    // Keep the eyes, nose and mouth clear.
    if (Math.abs(y - 140) < 26 && Math.abs(Math.abs(x - 160) - 46) < 34) continue;
    if (Math.abs(x - 160) < 22 && y > 136 && y < 230) continue;
    const w = rng.range(3.5, 5.5);
    over += stroke([[x - w, y + w * 0.8], [x, y - w * 0.3], [x + w, y + w * 0.8]], SUN_ART.mark, 1.5);
  }
  // Pink rings round the eyes (the sockets), sad brows, a small nose.
  for (const [ex, sgn] of [[114, -1], [206, 1]] as const) {
    over += cel(ellipsePath(ex, 142, 30, 23), { fill: SUN_ART.ring, stroke: 1.8 });
    over += stroke([[ex + sgn * 30, 104], [ex + sgn * 10, 108], [ex - sgn * 18, 100]], INK, 2.2);
  }
  over += stroke([[156, 162], [150, 186], [162, 188]], INK, 1.8);
  over += ell(92, 196, 16, 9, SUN_ART.cheek, 0.8) + ell(228, 196, 16, 9, SUN_ART.cheek, 0.8);
  const s = cel(smooth(outline), { fill: SUN_ART.face, over, stroke: 2.2 });
  return part('sun.disk', 320, 320, 160, 160, s);
}

function sunEye(): PartArt {
  // Sad eye: pale almond under a heavy lid, pupil looking down.
  const almond = `M4 18Q16 4 28 4Q42 4 52 18Q40 30 28 30Q14 30 4 18Z`;
  const inner = ell(28, 20, 8, 8.4, '#8a6a9c') + ell(28, 21, 3.8, 4, INK) + fillPath(`M2 18Q14 0 28 1Q44 1 54 18Q42 11 28 11Q14 11 2 18Z`, SUN_ART.ringDeep) + dot(25.5, 18, 1.4, '#ffffff', 0.9);
  let s = cel(almond, { fill: '#fbf1e4', inner, stroke: 1.8 });
  s += stroke([[3, 17], [16, 9], [28, 9], [42, 9], [53, 17]], INK, 2);
  return part('sun.eye', 56, 36, 28, 18, s);
}

function sunLid(): PartArt {
  const d = `M3 18Q14 2 28 2Q42 2 53 18Q40 26 28 26Q16 26 3 18Z`;
  let s = cel(d, { fill: SUN_ART.ring, stroke: 1.8 });
  s += stroke([[6, 20], [28, 27], [50, 20]], INK, 2);
  for (const x of [14, 22, 30, 38, 44]) s += stroke([[x, 25.5], [x - 1, 31]], INK, 1.2);
  return part('sun.lid', 56, 36, 28, 18, s);
}

function sunMouth(): PartArt {
  // A small sad mouth, turned down (the first painting's Sun).
  let s = stroke([[8, 20], [16, 11], [28, 8], [40, 11], [48, 20]], INK, 2);
  s += stroke([[22, 23], [34, 23]], SUN_ART.mark, 1.3);
  return part('sun.mouth', 56, 30, 28, 15, s);
}

function sunMouthOpen(): PartArt {
  // The grim, toothy mouth of the fourth painting (coughs and shouts).
  const outer = smooth([[4, 20], [14, 8], [28, 5], [42, 8], [52, 20], [44, 34], [28, 40], [12, 34]]);
  let teeth = '';
  for (const x of [13, 22, 31]) teeth += cel(`M${x} 6L${x + 8} 6L${x + 6.5} 14L${x + 1.5} 14Z`, { fill: '#fbf5e6', stroke: 1.1 });
  teeth += cel(`M18 38L22 30L26 38Z`, { fill: '#fbf5e6', stroke: 1 }) + cel(`M30 38L34 30L38 38Z`, { fill: '#fbf5e6', stroke: 1 });
  const inner = teeth + ell(28, 30, 9, 5, '#9ed0b8');
  const s = cel(outer, { fill: '#4a3438', inner, stroke: 2 });
  return part('sun.mouth.open', 56, 44, 28, 20, s);
}

/** A spiky ray: a flat butter triangle with a thin contour, base at the bottom. */
function sunRay(): PartArt {
  const d = mixed([[4, 74, 1], [18, 30], [22, 3, 1], [26, 30], [40, 74, 1]]);
  const s = cel(d, { fill: SUN_ART.ray, stroke: 2, over: stroke([[22, 16], [22, 50]], SUN_ART.mark, 1.1, 0.6) });
  return part('sun.ray', 44, 76, 22, 74, s);
}

function sunRayBroken(): PartArt {
  // A bent, cracked spike in the greener yellow: the Sun is unwell.
  const d = mixed([[4, 74, 1], [16, 44], [14, 30, 1], [26, 22], [30, 6, 1], [30, 34], [40, 74, 1]]);
  let s = cel(d, { fill: SUN_ART.rayLime, stroke: 2 });
  s += stroke([[18, 52], [24, 46], [20, 40]], INK, 1.3);
  return part('sun.ray.broken', 44, 76, 22, 74, s);
}

// ================================================================== committee attendees

const AT = {
  fill: '#3d3b45', light: '#4a4854', shade: '#2e2c35', rim: '#6d6a7c', dark: '#26242c', collar: '#6a6878',
  chair: '#2a2830', chairLight: '#3b3843', skin: '#4a4854', skinShade: '#3a3842',
};

const suit = (d: string, over = '', rim = AT.rim): string =>
  cel(d, { fill: AT.fill, shade: AT.shade, light: rim, sx: 2.6, sy: 1.6, hx: 1.6, hy: 1.2, stroke: 2.6, over });

/** Bowed, featureless head with a darker hair cap; `nose` is the profile tip. */
function quietHead(outline: Pt[], hair: Pt[], ear: Pt): string {
  return cel(smooth(outline), {
    fill: AT.skin, shade: AT.skinShade, light: '#6a6878', sx: 2.4, sy: 1.8, hx: 1.4, hy: 1.2, stroke: 2.6,
    over: blobFill(hair, AT.dark) + stroke([[ear[0], ear[1] - 3], [ear[0] + 2.2, ear[1]], [ear[0], ear[1] + 3]], AT.skinShade, 1.4),
  });
}

function attendeeSit(): PartArt {
  const chair = { fill: AT.chair, shade: '#1f1d25', light: AT.chairLight, sx: 1.6, sy: 1, hx: 1, hy: 1, stroke: 2.4 };
  let s = '';
  s += cel(poly([[21, 103], [26, 103], [25.4, 148.4], [20.4, 148.4]]), chair);
  s += cel(poly([[58, 103], [63, 103], [64, 148.4], [59, 148.4]]), chair);
  s += line('M25 130L60 130', AT.chair, 2.6);
  s += cel(mixed([[17.6, 49, 1], [26.4, 47.4, 1], [29.4, 98, 1], [21, 99.4, 1]]), { ...chair, over: stroke([[21, 56], [24.4, 94]], AT.chairLight, 1.2, 0.8) });
  s += cel(mixed([[19, 95.6, 1], [67, 95.6, 1], [67, 103, 1], [19, 103, 1]]), chair);
  // Far leg, slightly offset and darker.
  s += cel(taper([[42, 90], [58, 90.6], [75, 91.4]], 16, 14), { fill: AT.shade, shade: AT.dark, sx: 1.4, sy: 1.2, stroke: 2.4 });
  s += cel(taper([[74.6, 93], [75.6, 118], [76.4, 140]], 12.4, 10.4), { fill: AT.shade, shade: AT.dark, sx: 1.4, sy: 0.6, stroke: 2.4 });
  s += cel(smooth([[69, 140.6], [78, 139.4], [87.6, 142], [92.4, 145.4], [91.4, 148.6], [70, 148.6]], 0.8), { fill: '#1f1d25', shade: '#17151c', sx: 0.6, sy: 1, stroke: 2.2 });
  // Torso (jacket) leaning slightly forward over the table.
  s += suit(smooth([[28, 94.4], [26.2, 80], [27, 66], [31, 55], [38, 47.6], [46, 46], [52, 49], [56, 57], [57, 68], [54, 80], [50.4, 90], [46, 96.4], [36, 97.4]]),
    blobFill([[47.6, 46], [52, 47.4], [53.8, 52], [50, 50.4]], AT.collar) +
      stroke([[51.8, 50], [54, 62], [53.4, 70]], AT.dark, 2.4) +
      stroke([[47, 49], [52, 58], [53, 66]], AT.shade, 1.3) +
      stroke([[33.6, 78], [41, 77.4]], AT.shade, 1.2));
  // Near leg.
  s += suit(taper([[34, 91.6], [52, 92.6], [70, 93.6]], 19, 16.4), stroke([[44, 86.4], [66, 87.6]], AT.rim, 1, 0.6));
  s += suit(taper([[69.6, 95], [70.6, 119], [71.4, 141]], 14, 11.6), stroke([[69.2, 104], [70, 130]], AT.shade, 1.1));
  s += cel(smooth([[63.6, 140.8], [73.6, 139.4], [83.6, 142], [89.4, 145.6], [88.4, 148.8], [65.6, 148.8]], 0.8), {
    fill: AT.dark, shade: '#17151c', light: '#45434e', sx: 0.6, sy: 1, hx: 1, hy: 1, stroke: 2.2,
  });
  // Neck and bowed head (tilted forward about the base of the neck).
  s += '<g transform="rotate(17 46 49)">';
  s += cel(taper([[44, 51], [48.4, 42]], 8.6, 7.6), { fill: AT.skinShade, shade: AT.dark, sx: 1, sy: 0, stroke: 2.2 });
  s += quietHead(
    [[41.6, 32], [42.8, 24], [48, 19], [55, 17.6], [61, 20.6], [64.4, 26.6], [64.6, 31], [66.6, 35.4], [64.2, 37.2], [62.6, 41], [58.4, 44.4], [52.6, 45.4], [47, 43], [43, 38]],
    [[40, 34], [42, 22], [49.6, 16], [58, 16.6], [62.6, 21.4], [56, 22.6], [50, 25.4], [47, 31], [45.6, 38]],
    [49.4, 31.4],
  );
  s += '</g>';
  // Near arm resting forward, hand on the knee.
  s += suit(taper([[42, 53.6], [45, 66], [49, 78]], 12.4, 10.6));
  s += suit(taper([[48.6, 78], [58, 82.6], [66.4, 85.6]], 10.6, 9.2));
  s += blobFill([[64.2, 81.6], [67.2, 81.4], [68.4, 89.4], [65.2, 89.8]], AT.collar);
  s += cel(smooth([[66.6, 81.8], [72, 82.4], [75.4, 86.4], [72.4, 89.8], [66.6, 89.4]]), {
    fill: AT.skin, shade: AT.skinShade, light: '#6a6878', sx: 1, sy: 1, hx: 0.8, hy: 0.8, stroke: 2,
  });
  return part('attendee.sit', 96, 150, 48, 150, s);
}

function attendeeStand(): PartArt {
  let s = '';
  // Far leg and shoe (behind), then the jacket, near leg, head and arm.
  s += cel(taper([[31.6, 108], [30.8, 148], [30, 184]], 15, 12.4), { fill: AT.shade, shade: AT.dark, sx: 1.4, sy: 0.4, stroke: 2.4 });
  s += cel(smooth([[23.4, 183.4], [33, 182.2], [42, 186], [44.4, 190.6], [42.6, 194.2], [23.6, 194.2]], 0.8), { fill: '#1f1d25', shade: '#17151c', sx: 0.6, sy: 1, stroke: 2.2 });
  s += suit(taper([[38.4, 108], [39.2, 148], [40.2, 184]], 16.4, 12.8), stroke([[39.4, 116], [40.4, 180]], AT.shade, 1.1) + stroke([[34, 118], [34.4, 170]], AT.rim, 1, 0.5));
  s += cel(smooth([[31.6, 183], [42, 182.2], [52, 186], [55.2, 190.4], [53.8, 194.4], [32.6, 194.4]], 0.8), {
    fill: AT.dark, shade: '#17151c', light: '#45434e', sx: 0.6, sy: 1, hx: 1, hy: 1, stroke: 2.2,
  });
  s += suit(smooth([[23, 52], [26, 44], [33, 40], [42, 40.6], [48, 45], [51, 56], [51.4, 72], [49.4, 88], [48.4, 104], [45.4, 112.4], [36, 113.4], [26, 112.4], [24, 100], [22.6, 84], [22, 68]]),
    blobFill([[41.6, 40], [46, 42], [47.6, 47], [44, 45.2]], AT.collar) +
      stroke([[46, 45], [49, 60], [48.6, 74]], AT.dark, 2.4) +
      stroke([[41, 42], [47, 54], [49, 70]], AT.shade, 1.3) +
      dot(49, 79, 1.1, AT.dark) + dot(48.6, 91, 1.1, AT.dark) +
      stroke([[36, 92], [45, 92]], AT.shade, 1.2) +
      stroke([[25, 104], [47.4, 104.6]], AT.shade, 1, 0.8));
  s += '<g transform="rotate(8 37 41)">';
  s += cel(taper([[36.4, 42], [37.2, 34]], 9.4, 9), { fill: AT.skinShade, shade: AT.dark, sx: 1, sy: 0, stroke: 2.2 });
  s += quietHead(
    [[26, 20], [27, 11], [33, 6], [41, 5.4], [47, 9], [49.6, 14.6], [50, 19], [52.4, 23.2], [50.4, 25], [50, 29], [47, 33.6], [41, 35.4], [34, 34], [29, 29]],
    [[24.8, 22], [26, 9.6], [33, 4.4], [42, 4], [48, 8.6], [42.4, 9.4], [36, 11.6], [32, 17], [30.4, 25]],
    [34.4, 20.4],
  );
  s += '</g>';
  s += suit(taper([[33, 50], [34, 70], [35, 88]], 12.6, 11));
  s += suit(taper([[35, 88], [36.8, 104], [38.4, 117]], 11, 9.6));
  s += blobFill([[33.4, 114.4], [38.4, 114], [39, 118.6], [33.8, 119]], AT.collar);
  s += cel(smooth([[34.6, 117.4], [40.6, 116.6], [42.6, 122], [40.6, 128], [36.2, 128.4], [34, 123]]), {
    fill: AT.skin, shade: AT.skinShade, light: '#6a6878', sx: 1, sy: 1, hx: 0.8, hy: 0.8, stroke: 2,
  });
  return part('attendee.stand', 70, 196, 35, 196, s);
}

// ================================================================== inner-dormitory crowd forms

const FORM = { fill: '#2b2229', rim: '#5a3d78', ink: '#1d171c', glint: P.violet };

function formFigure(body: Pt[], extra: string[]): string {
  const rim = { fill: FORM.fill, light: FORM.rim, sx: 0, sy: 0, hx: 1.8, hy: 1.4, stroke: 2, ink: FORM.ink };
  let s = '';
  for (const e of extra) s += cel(e, rim);
  s += cel(smooth(body, 0.9), { ...rim, over: stroke([[body[0]![0] + 8, 96], [body[0]![0] + 9, 124]], '#231b21', 2.4, 0.8) });
  return s;
}

/** Frayed wisps trailing from the figure's lower edge (it is only half there). */
function wisps(xs: readonly number[], y: number, seed: number): string {
  const rng = new Rng(seed);
  let s = '';
  for (const x of xs) {
    const len = rng.range(4, 8);
    s += fillPath(taper([[x, y - 3], [x + rng.range(-2, 2), y + len * 0.5], [x + rng.range(-3, 3), y + len]], 3.6, 0.8), FORM.fill, 0.75);
  }
  return s;
}

function formShadow(): PartArt {
  const body: Pt[] = [
    [13, 126], [12.4, 110], [11, 94], [9.4, 78], [10, 62], [13, 50], [18.6, 41], [26, 35.4], [32, 33.6], [34, 27],
    [37.4, 20.4], [43.4, 17.4], [50, 18.6], [53.6, 23.8], [54, 30.6], [51.6, 36], [47.4, 39.8], [48, 46], [49, 54],
    [50, 64], [48.6, 76], [46.6, 88], [47.4, 102], [48.8, 116], [49.4, 126], [44, 127.4], [39, 124], [34, 127.6], [31, 116],
    [28, 127.6], [22, 124.4], [17, 127.6],
  ];
  const arm = taper([[38, 44], [41.6, 62], [44.6, 80], [46, 90]], 9.4, 6.4);
  let s = formFigure(body, [arm]);
  s += wisps([15, 21, 27, 35, 41, 47], 126, 51);
  s += stroke([[36, 24], [41, 19], [48, 18.4]], P.vein, 1, 0.35);
  return part('form.shadow', 62, 132, 31, 132, s);
}

function formPoint(): PartArt {
  const body: Pt[] = [
    [22, 126], [21.4, 110], [20, 94], [18.8, 78], [20, 62], [24, 50], [30, 42], [37, 37.4], [40, 33.4], [39.6, 25.4],
    [42.4, 17.4], [48.4, 13.6], [55.4, 14.6], [59.4, 19.8], [60, 26.8], [57.6, 32.6], [53.4, 36.6], [54.6, 44], [55.6, 54],
    [56.4, 66], [55, 78], [53, 90], [53.6, 104], [55, 116], [55.6, 126], [50.4, 127.4], [45.6, 124], [41, 127.6], [38, 116],
    [35, 127.6], [29.6, 124.4], [25, 127.6],
  ];
  const arm = taper([[46, 46.4], [60, 44.6], [74, 42.4], [84, 41]], 11.4, 7.2);
  const hand = smooth([[80.4, 37.6], [86.6, 37.4], [89.4, 39.6], [86.4, 42.8], [81, 44.6]]);
  const finger = taper([[86, 39.8], [91.6, 39.2], [94, 39]], 3.4, 2.2);
  let s = formFigure(body, [finger, hand, arm]);
  s += wisps([24, 30, 36, 44, 50, 55], 126, 77);
  s += stroke([[42, 19], [47, 14.6], [54, 14.4]], P.vein, 1, 0.35);
  s += stroke([[60, 42], [74, 39.6], [85, 38]], P.vein, 1, 0.3);
  return part('form.point', 96, 132, 40, 132, s);
}

// ================================================================== Gorti giant pieces

const GB = { fill: P.gortiBark, shade: P.gortiBarkDark, light: P.gortiBarkLight };

/** Violet vein with a lavender luminous core. */
function vein(pts: Pt[], w: number): string {
  return stroke(pts, P.violetDark, w + 1.6, 0.9) + stroke(pts, P.violet, w) + stroke(shift(pts, -0.6, 0), P.vein, Math.max(0.9, w * 0.35), 0.95);
}

function giantFinger(): PartArt {
  const outline: Pt[] = [
    [14, 426], [12, 380], [15.4, 340], [12.6, 306], [9.6, 290], [14, 272], [18, 240], [19.4, 200], [17, 172], [14.6, 158],
    [19, 142], [23, 110], [25, 80], [27.6, 50], [33.4, 26], [44, 13], [55, 9.6], [66, 12], [76.6, 24], [82.6, 48], [85, 80],
    [87, 110], [91, 142], [95.4, 158], [93, 172], [91, 200], [92, 240], [96, 272], [100.4, 290], [97.4, 306], [95, 340],
    [98, 380], [96, 426],
  ];
  const rootlet = (pts: Pt[], w0: number): string => cel(taper(pts, w0, 1.4), { ...GB, sx: 1.6, sy: 0.8, hx: 0.8, hy: 0.6, stroke: 2.6 });
  let s = '';
  s += rootlet([[18, 250], [9, 243], [4, 231]], 7);
  s += rootlet([[92, 212], [101, 201], [104.6, 188]], 7);
  s += rootlet([[15, 392], [7, 398], [3, 408]], 8);
  s += rootlet([[88, 118], [96, 112], [99.6, 102]], 5.6);
  let over = '';
  // Bark plates.
  const plates: Pt[][] = [
    [[30, 418], [33, 380], [28.6, 350], [34, 320]], [[74, 416], [69.6, 372], [75, 334]], [[33, 380], [52, 386], [69.6, 372]],
    [[26, 250], [30, 222], [27, 196]], [[80, 256], [76, 226], [82, 196]], [[30, 222], [48, 230], [76, 226]],
    [[34, 128], [36, 96], [33, 70]], [[74, 128], [71, 98], [76, 70]], [[36, 96], [54, 102], [71, 98]], [[40, 64], [56, 60], [72, 66]],
  ];
  for (const p of plates) over += stroke(p, GB.shade, 2.2);
  // Knuckle ridges (wrinkle arcs) with lit lips.
  for (const [y, w] of [[290, 1], [158, 0.9]] as Pt[]) {
    for (let k = -1; k <= 1; k++) {
      const yy = y + k * 11;
      const pts: Pt[] = [[20, yy - 3], [36, yy + 3], [55, yy + 1], [74, yy + 4], [90, yy - 2]].map(([x, py]): Pt => [55 + (x - 55) * w, py]);
      over += stroke(pts, GB.shade, k === 0 ? 3 : 2.2) + stroke(shift(pts, 0, -2.6), GB.light, 1.4, 0.8);
    }
  }
  over += barkCracks(new Rng(4101), [16, 60, 94, 400], 14, '#5e5670', GB.light, 1.9);
  over += knot(34, 214, 4.6, 3.4, GB.shade, GB.light) + knot(76, 360, 4, 3, GB.shade, GB.light);
  // Nail-like bark plate near the tip.
  over += cel(smooth([[60, 24], [70, 22], [77.6, 32], [79.6, 52], [72, 58], [62, 50]]), {
    fill: GB.light, shade: GB.fill, light: '#c3bccd', sx: 2, sy: 1.6, hx: 1, hy: 1, stroke: 2.4,
  });
  // Veins with glowing junctions.
  over += vein([[48, 424], [46, 372], [52, 330], [48, 300], [54, 262], [50, 222], [56, 180], [52, 140], [57, 100], [54, 62], [56, 36]], 3.2);
  over += vein([[52, 330], [66, 314], [74, 296]], 2) + vein([[50, 222], [36, 204], [30, 184]], 2) + vein([[57, 100], [68, 86], [72, 70]], 1.8);
  over += vein([[46, 372], [32, 360], [24, 342]], 2);
  for (const [x, y] of [[52, 330], [50, 222], [57, 100]] as Pt[]) over += glow(x, y, 11, P.vein, 0.4) + dot(x, y, 2.2, '#f1e3ff', 0.9);
  s += cel(smooth(outline, 0.95), { ...GB, sx: 14, sy: 3, hx: 5, hy: 2, stroke: 4, over });
  return part('giant.finger', 110, 420, 55, 410, s);
}

/** Seeded network of jagged bark cracks (mostly running along the root), with a lit lip. */
function barkCracks(rng: Rng, box: [number, number, number, number], count: number, color: string, lit: string, w: number): string {
  const [x0, y0, x1, y1] = box;
  let s = '';
  for (let i = 0; i < count; i++) {
    let x = rng.range(x0, x1);
    let y = rng.range(y0, y1);
    let a = Math.PI / 2 + rng.range(-0.35, 0.35);
    const pts: Pt[] = [[x, y]];
    const segs = rng.int(3, 5);
    for (let k = 0; k < segs; k++) {
      const len = rng.range(10, 20);
      a = Math.max(Math.PI / 2 - 0.7, Math.min(Math.PI / 2 + 0.7, a + rng.range(-0.45, 0.45)));
      x += Math.cos(a) * len;
      y += Math.sin(a) * len;
      pts.push([x, y]);
    }
    s += line(poly(pts, false), color, w) + line(poly(shift(pts, 1.3, -0.4), false), lit, w * 0.4, 0.55);
    if (rng.chance(0.55)) {
      const b = pts[rng.int(1, pts.length - 2)]!;
      const ba = a + (rng.chance(0.5) ? 1 : -1) * rng.range(0.7, 1.2);
      const bl = rng.range(7, 13);
      s += line(poly([b, [b[0] + Math.cos(ba) * bl, b[1] + Math.sin(ba) * bl]], false), color, w * 0.7);
    }
  }
  return s;
}

/** A bark knot: ringed boss with a dark heart. */
function knot(x: number, y: number, rx: number, ry: number, shade: string, lit: string): string {
  return (
    ell(x, y, rx * 1.45, ry * 1.4, shade, 0.55) +
    line(ellipsePath(x, y, rx * 1.45, ry * 1.4), shade, 1.6) +
    ell(x, y, rx, ry, lit) +
    ell(x + rx * 0.15, y + ry * 0.2, rx * 0.55, ry * 0.5, '#4a4258') +
    line(ellipsePath(x, y, rx, ry), '#4a4258', 1.4)
  );
}

function giantLegs(): PartArt {
  // Crop fade at the top: many thin opacity steps (no gradient).
  const fadeId = 'giantLegsFade';
  let mask = `<mask id="${fadeId}" maskUnits="userSpaceOnUse" x="-10" y="-30" width="400" height="620"><rect x="-10" y="160" width="400" height="420" fill="#fff"/>`;
  const steps = 40;
  for (let i = 0; i < steps; i++) mask += `<rect x="-10" y="${i * 4}" width="400" height="4.3" fill="#fff" opacity="${n2(((i + 0.5) / steps) ** 1.3)}"/>`;
  mask += `</mask>`;
  interface LegShape {
    left: Pt[];
    right: Pt[];
    toes: [Pt[], number, number][];
    rootlets: [Pt[], number][];
    box: [number, number, number, number];
    seed: number;
    knots: [number, number, number, number][];
    knee: number;
    kneeX: [number, number];
    veins: [Pt[], number][];
    nodes: Pt[];
  }
  const leg = (L: LegShape, back: boolean): string => {
    const c = back
      ? { fill: mix(GB.fill, GB.shade, 0.55), shade: '#554d66', light: GB.fill }
      : { fill: GB.fill, shade: GB.shade, light: GB.light };
    const deep = back ? '#463f55' : '#564d68';
    let s = '';
    // Side rootlets and gripping root toes (their bases tuck under the leg).
    for (const [pts, w0] of L.rootlets) s += cel(taper(pts, w0, 1.6), { ...c, sx: 1.4, sy: 1, hx: 0.8, hy: 0.6, stroke: 2.6 });
    for (const [pts, w0, w1] of L.toes) {
      s += cel(taper(pts, w0, w1), {
        ...c, sx: 1.2, sy: 3, hx: 1, hy: 1.2, stroke: 3,
        over: stroke(shift(pts.slice(1), 0, -w0 * 0.12), c.light, 1.3, 0.7) + stroke(shift(pts.slice(1, 3), 2, w0 * 0.1), deep, 1.6, 0.8),
      });
    }
    const rng = new Rng(L.seed);
    let over = barkCracks(rng, L.box, 26, deep, c.light, 2.2);
    for (const [x, y, rx, ry] of L.knots) over += knot(x, y, rx, ry, c.shade, c.light);
    for (let k = 0; k < 3; k++) {
      const y = L.knee - 12 + k * 12;
      const [x0, x1] = L.kneeX;
      const w = [[x0, y], [x0 + (x1 - x0) * 0.3, y + 5], [x0 + (x1 - x0) * 0.65, y + 3], [x1, y - 2]] as Pt[];
      over += stroke(w, deep, k === 1 ? 3 : 2.2) + stroke(shift(w, 1, -2.8), c.light, 1.4, 0.7);
    }
    for (const [v, w] of L.veins) over += vein(v, back ? w * 0.85 : w);
    for (const [x, y] of L.nodes) over += glow(x, y, back ? 10 : 12, P.vein, back ? 0.25 : 0.38) + dot(x, y, back ? 2 : 2.4, '#f1e3ff', back ? 0.7 : 0.9);
    s += cel(smooth([...L.left, ...L.right], 0.9), { ...c, sx: 13, sy: 4, hx: 4, hy: 2, stroke: 4, over });
    return s;
  };
  const back: LegShape = {
    left: [[70, -30], [75, 40], [80, 96], [76, 112], [82, 128], [88, 180], [84, 226], [88, 262], [93, 300], [96, 352], [90, 372], [98, 392], [102, 420], [104, 446], [102, 478], [97, 506], [90, 530], [84, 548], [80, 562]],
    right: [[100, 564], [140, 564], [156, 552], [166, 528], [166, 500], [163, 470], [167, 420], [172, 384], [178, 372], [174, 356], [180, 300], [190, 262], [186, 226], [181, 186], [186, 160], [191, 146], [186, 120], [191, 50], [195, -30]],
    toes: [
      [[[146, 526], [172, 528], [194, 536], [210, 548], [218, 563]], 26, 7],
      [[[148, 542], [172, 546], [192, 554], [202, 564]], 18, 5],
      [[[104, 544], [88, 550], [72, 556], [60, 564]], 17, 4],
    ],
    rootlets: [[[[180, 368], [192, 360], [199, 346]], 7], [[[80, 118], [70, 110], [64, 98]], 7]],
    box: [70, -10, 190, 520],
    seed: 5601,
    knots: [[112, 196, 6, 4.2], [150, 418, 5, 3.6]],
    knee: 262,
    kneeX: [92, 186],
    veins: [
      [[[132, -20], [128, 60], [136, 140], [130, 210], [138, 280], [132, 350], [138, 420], [134, 470], [148, 518], [178, 532], [204, 544]], 3.2],
      [[[136, 140], [154, 160], [164, 186]], 2], [[[138, 280], [118, 300], [108, 330]], 2], [[[138, 420], [154, 440], [158, 466]], 1.8],
    ],
    nodes: [[136, 140], [138, 280]],
  };
  const front: LegShape = {
    left: [[178, -30], [182, 40], [188, 110], [194, 180], [190, 206], [196, 222], [194, 236], [197, 262], [202, 300], [206, 350], [210, 400], [212, 440], [210, 478], [205, 506], [198, 530], [192, 548], [188, 562]],
    right: [[208, 564], [250, 564], [266, 552], [276, 528], [276, 500], [272, 470], [276, 420], [282, 360], [289, 300], [298, 264], [294, 228], [289, 188], [293, 120], [296, 92], [304, 80], [298, 66], [300, 50], [304, -30]],
    toes: [
      [[[258, 524], [284, 526], [308, 534], [326, 546], [336, 563]], 28, 7],
      [[[258, 540], [284, 545], [306, 553], [318, 564]], 19, 5],
      [[[214, 544], [198, 550], [182, 556], [170, 564]], 17, 4],
      [[[236, 548], [236, 556], [232, 564]], 12, 4],
    ],
    rootlets: [[[[300, 76], [312, 68], [318, 54]], 7], [[[192, 214], [180, 208], [174, 196]], 6.5]],
    box: [178, -10, 298, 520],
    seed: 5602,
    knots: [[268, 150, 6.5, 4.4], [222, 330, 5.4, 3.8], [258, 470, 4.6, 3.2]],
    knee: 264,
    kneeX: [200, 294],
    veins: [
      [[[240, -20], [236, 60], [244, 140], [238, 210], [246, 280], [240, 350], [246, 420], [242, 470], [258, 514], [290, 528], [318, 540]], 3.4],
      [[[244, 140], [262, 160], [272, 186]], 2], [[[246, 280], [226, 300], [216, 330]], 2], [[[246, 420], [262, 440], [266, 466]], 1.8],
      [[[236, 60], [218, 80], [208, 104]], 1.8],
    ],
    nodes: [[244, 140], [246, 280], [246, 420]],
  };
  // Small wristwatch strapped on the left (back) ankle.
  let watch = cel(smooth([[99, 466], [130, 471.4], [163, 466.4], [164.4, 480], [130, 485.4], [100.6, 480]], 0.7), {
    fill: '#4a3528', shade: '#33241b', light: '#6a4d3a', sx: 0, sy: 2.4, hx: 0, hy: 1.4, stroke: 2.4,
    over: stroke([[112, 474.6], [118, 475.6]], '#6a4d3a', 1.2) + stroke([[146, 475.6], [152, 474.6]], '#6a4d3a', 1.2),
  });
  watch += `<rect x="141.4" y="474.4" width="2.4" height="4" fill="#b9a36a" stroke="${INK}" stroke-width="1"/>`;
  watch += `<circle cx="131" cy="477.6" r="10.4" fill="${P.ivory}" stroke="${INK}" stroke-width="2.4"/>`;
  watch += `<circle cx="131" cy="477.6" r="8.2" fill="none" stroke="#b9a36a" stroke-width="1.4"/>`;
  watch += line('M131 477.6l0-5.6M131 477.6l4 2', INK, 1.3);
  watch += line('M131 470.6l0 1.4M131 483.2l0 1.4M124 477.6l1.4 0M136.6 477.6l1.4 0', '#6b5a4a', 0.9);
  watch += fillPath(ellipsePath(127.6, 473.6, 2.4, 1.4), '#ffffff', 0.7);
  const body = leg(back, true) + watch + leg(front, false);
  return part('giant.legs', 380, 560, 190, 560, `${mask}<g mask="url(#${fadeId})">${body}</g>`);
}

function giantDrip(): PartArt {
  const d = 'M11 2.2C11.6 8 13.4 12.6 16.2 17.8C19.4 23.8 19.2 32.4 11 34.6C2.8 32.4 2.6 23.8 5.8 17.8C8.6 12.6 10.4 8 11 2.2Z';
  let s = glow(11, 26, 10.5, P.vein, 0.35);
  s += cel(d, { fill: P.violet, shade: P.violetDark, light: P.vein, sx: 1.8, sy: 2.2, hx: 1, hy: 1, stroke: 2 });
  s += fillPath(ellipsePath(8.2, 24.4, 1.7, 3.4), '#f1e3ff', 0.9) + dot(9.6, 13.6, 0.8, '#f1e3ff', 0.8);
  return part('giant.drip', 22, 40, 11, 6, s);
}

// ================================================================== export

/** Every creature, celestial face and crowd figure part. */
export function creatureParts(): PartArt[] {
  return [
    whaleBody(), whaleFin(), whaleFluke(),
    sparrowBody(), sparrowWing(),
    raccoonSit(), raccoonSniff(), raccoonShadow(),
    birdA(), birdAWing(), birdB(), birdBWing(), birdC(), birdCWing(),
    fishA(), fishATail(), fishB(), fishBTail(), fishC(), fishCTail(),
    moonBaby(), moonBabyEye(), moonBabyLid(), moonBabyMouth(),
    moonOld(), moonOldEye(), moonOldLid(), moonOldMouth(), moonOldLaugh(),
    sunDisk(), sunEye(), sunLid(), sunMouth(), sunMouthOpen(), sunRay(), sunRayBroken(),
    attendeeSit(), attendeeStand(),
    formShadow(), formPoint(),
    giantFinger(), giantLegs(), giantDrip(),
  ];
}
