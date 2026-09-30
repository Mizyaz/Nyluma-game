import { P, mix, pastelMarkup } from './palette';
import { Rng, cel, crystalCluster, ellipsePath, fillPath, glow, limb, line, mixed, nextId, poly, rrect, smooth, svgDoc, taper, type Pt } from './svg';

// Hand-authored illustrations for the memory journal (320×200 vignettes), the
// memory-station puzzle cards (200×150 pictorial fragments on paper) and the
// dialogue/document portraits (160×160). Everything is built from the shared
// cel-shading toolkit: flat fills, hard shadow shapes, ink contours. Output is
// deterministic (seeded Rng only) and cached as data URLs.

type Draw = () => string;
type MPt = [number, number, number?];

// ------------------------------------------------------------------ helpers

const INK = P.ink;
const n2 = (v: number): number => Math.round(v * 100) / 100;
const op = (o: number): string => (o !== 1 ? ` opacity="${n2(o)}"` : '');

/** Smooth open polyline. */
const open = (pts: readonly Pt[], t = 1): string => smooth(pts, t, false);

/** Colored stroke along a smooth open polyline. */
const stroke = (pts: readonly Pt[], color: string, w: number, o = 1): string => line(open(pts), color, w, o);

const rect = (x: number, y: number, w: number, h: number, fill: string, o = 1): string =>
  `<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}" fill="${fill}"${op(o)}/>`;

const dot = (cx: number, cy: number, r: number, fill: string, o = 1): string =>
  `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="${fill}"${op(o)}/>`;

const ring = (cx: number, cy: number, rx: number, ry: number, color: string, w: number, o = 1): string =>
  line(ellipsePath(cx, cy, rx, ry), color, w, o);

/** Flip, scale, rotate (radians) and translate a local point list. */
function xf(pts: readonly Pt[], ox: number, oy: number, s = 1, rot = 0, flip = false): Pt[] {
  const c = Math.cos(rot);
  const sn = Math.sin(rot);
  return pts.map(([x, y]) => {
    const X = (flip ? -x : x) * s;
    const Y = y * s;
    return [ox + X * c - Y * sn, oy + X * sn + Y * c];
  });
}

function xfm(pts: readonly MPt[], ox: number, oy: number, s = 1, rot = 0, flip = false): MPt[] {
  const moved = xf(
    pts.map((p) => [p[0], p[1]] as Pt),
    ox,
    oy,
    s,
    rot,
    flip,
  );
  return moved.map((p, i) => [p[0], p[1], pts[i]![2]]);
}

/** Flat horizontal band from a gently wavy top edge down to `bottom`. */
function band(y: number, color: string, rng: Rng, w: number, bottom: number, amp = 2, seg = 6, o = 1): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= seg; i++) pts.push([-8 + ((w + 16) * i) / seg, y + rng.range(-amp, amp)]);
  return fillPath(`${open(pts)}L${w + 8} ${bottom}L-8 ${bottom}Z`, color, o);
}

/** Markup clipped to a path. */
function clipTo(d: string, body: string): string {
  const id = nextId('mc');
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${body}</g>`;
}

/** Region under a smooth skyline (hills, banks, snow). */
function skyline(pts: readonly Pt[], bottom: number, color: string, o = 1): string {
  const a = pts[0]!;
  const b = pts[pts.length - 1]!;
  return fillPath(`${open(pts)}L${b[0]} ${bottom}L${a[0]} ${bottom}Z`, color, o);
}

/** Scattered dots (stars, snow, dust, plankton). */
function specks(
  rng: Rng,
  count: number,
  box: [number, number, number, number],
  color: string,
  r: [number, number],
  o: [number, number],
): string {
  let s = '';
  for (let i = 0; i < count; i++) {
    s += dot(rng.range(box[0], box[2]), rng.range(box[1], box[3]), rng.range(r[0], r[1]), color, rng.range(o[0], o[1]));
  }
  return s;
}

/** Rope: ink casing with a fibre-coloured core. */
function rope(pts: readonly Pt[], core = '#b9a27a', w = 1.8): string {
  const d = open(pts);
  return line(d, INK, w + 1.6) + line(d, core, w);
}

const CB = { fill: P.crystalBlue, shade: P.crystalBlueDark, light: P.crystalBlueLight };
const CT = { fill: P.crystalTeal, shade: P.crystalTealDark, light: P.crystalTealLight };
const CO = { fill: P.crystalOrange, shade: P.crystalOrangeDark, light: P.crystalOrangeLight };

// Fish silhouette facing +x, one unit long, centred on the origin.
const FISH: MPt[] = [
  [0.5, 0.02], [0.42, -0.1], [0.24, -0.19], [0.02, -0.21], [-0.2, -0.14], [-0.33, -0.05],
  [-0.52, -0.21, 1], [-0.45, 0, 1], [-0.52, 0.21, 1],
  [-0.33, 0.05], [-0.2, 0.13], [0.02, 0.18], [0.24, 0.16], [0.42, 0.09],
];

function fishPath(cx: number, cy: number, len: number, rot = 0, flip = false): string {
  return mixed(xfm(FISH, cx, cy, len, rot, flip));
}

/** A point on a fish of length `len` (local unit coords) placed like fishPath. */
function fishPt(u: number, v: number, cx: number, cy: number, len: number, rot = 0, flip = false): Pt {
  return xf([[u, v]], cx, cy, len, rot, flip)[0]!;
}

// ============================================================ vignettes 320×200

function artWell(): string {
  const rng = new Rng(1101);
  const W = 320;
  let s = rect(0, 0, W, 200, '#2a2640');
  // Dawn in flat bands.
  s += band(30, '#312b49', rng, W, 200);
  s += band(52, '#403655', rng, W, 200);
  s += band(70, '#584764', rng, W, 200);
  s += band(85, '#7a5c6b', rng, W, 200, 1.5);
  s += band(97, '#9d7269', rng, W, 200, 1);
  s += glow(58, 22, 8, '#e6e9f3', 0.5) + dot(58, 22, 1.3, '#e6e9f3');
  s += specks(rng, 14, [0, 0, W, 40], '#e6e9f3', [0.4, 0.9], [0.2, 0.55]);
  s += glow(268, 106, 48, '#f0c79a', 0.32);
  s += dot(268, 107, 10, '#e7c49b');
  s += fillPath(smooth([[186, 60], [214, 55], [252, 56], [278, 60], [250, 63], [210, 63]]), '#4b3f5b');
  s += fillPath(smooth([[16, 81], [46, 77], [84, 78], [102, 82], [70, 85], [34, 85]]), '#69526a');
  s += fillPath(smooth([[222, 90], [252, 86], [292, 87], [304, 91], [262, 94]]), '#8f6c6c');
  // Far hill with a sleeping village.
  s += skyline([[-8, 108], [30, 101], [70, 104], [110, 99], [160, 106], [200, 103], [240, 106], [280, 100], [328, 104]], 200, '#3a3150');
  const house = (x: number, y: number, w: number, h: number): string =>
    fillPath(poly([[x, y + h], [x, y], [x - 1.5, y], [x - 1.5, y - 2], [x + w + 1.5, y - 2], [x + w + 1.5, y], [x + w, y], [x + w, y + h]]), '#2c2640');
  s += house(20, 95, 20, 12) + house(44, 98, 13, 9) + house(62, 92, 22, 14) + rect(66, 88, 3, 5, '#2c2640');
  s += rect(71, 96, 3, 3, '#e0b060', 0.85) + rect(28, 99, 2.5, 2.5, '#e0b060', 0.6);
  s += fillPath(smooth([[96, 106], [93, 90], [95.5, 72], [98, 90], [100, 106]]), '#2a2440');
  s += fillPath(smooth([[296, 104], [293, 90], [296, 76], [299, 90], [301, 104]]), '#2d2640');
  s += fillPath(smooth([[305, 104], [303, 94], [306, 84], [308, 94], [310, 104]]), '#2d2640');
  // Ground, cut open below the surface.
  const top: Pt[] = [[-8, 118], [40, 117], [90, 119], [140, 118], [200, 118], [250, 117], [328, 119]];
  s += skyline(top, 200, '#3d3650');
  s += band(123, '#28243a', rng, W, 200, 1.5, 8);
  s += band(150, '#2d2843', rng, W, 164, 2.5, 5);
  s += band(176, '#231f34', rng, W, 200, 2.5, 5);
  // Roots and pebbles in the section.
  const rootC = { fill: '#3b3350', shade: '#2e2842', sx: 0.8, sy: 0, stroke: 1.2 };
  s += cel(taper([[36, 121], [42, 140], [36, 160], [41, 182]], 3.2, 0.8), rootC);
  s += cel(taper([[244, 121], [252, 136], [262, 148], [266, 160]], 3, 0.8), rootC);
  s += cel(taper([[284, 121], [279, 142], [284, 158]], 2.4, 0.7), rootC);
  for (const [x, y, rx, ry] of [[70, 140, 5, 3], [92, 168, 4, 2.6], [22, 190, 6, 3], [210, 150, 4.5, 3], [236, 182, 5, 3], [300, 140, 4, 2.5], [296, 188, 5.5, 3]] as const) {
    s += cel(ellipsePath(x, y, rx, ry), { fill: '#3e3852', shade: '#2e2942', sx: 1, sy: 1, stroke: 1.2 });
  }
  s += crystalCluster(62, 190, 9, rng, CT, 2, 1.2);
  s += crystalCluster(274, 172, 8, rng, CB, 2, 1.2);
  s += crystalCluster(214, 194, 7, rng, CO, 2, 1.2);
  // The shaft.
  s += rect(128, 118, 44, 82, '#14111e');
  s += rect(128, 132, 44, 32, P.crystalBlue, 0.14);
  s += rect(128, 150, 44, 14, P.crystalBlue, 0.14);
  s += rect(128, 162, 44, 38, '#4a82cc');
  s += rect(128, 162, 44, 2.4, P.crystalBlueLight);
  s += stroke([[131, 170], [140, 169], [148, 171]], P.crystalBlueLight, 1, 0.7);
  s += stroke([[156, 175], [166, 174]], P.crystalBlueLight, 1, 0.6);
  // Light-fish frozen in a crystal block.
  const fx = 150;
  const fy = 185;
  s += glow(150, 178, 44, '#8fc0ff', 0.45);
  s += glow(fx, fy, 22, '#eef8ff', 0.8);
  s += fillPath(fishPath(fx, fy, 30, -0.14), '#f4fbff');
  s += line(fishPath(fx, fy, 30, -0.14), P.crystalBlueDark, 1.3);
  const eye = fishPt(0.3, -0.04, fx, fy, 30, -0.14);
  s += dot(eye[0], eye[1], 1.2, P.crystalBlueDark);
  const block = poly([[129, 200], [130, 180], [137, 170], [152, 166], [166, 171], [171, 183], [171, 200]]);
  s += fillPath(block, '#cfe6ff', 0.22) + line(block, '#e6f3ff', 1.2, 0.8);
  s += line('M137 170L141 200M152 166L148 186L159 200M166 171L160 187', '#e6f3ff', 0.9, 0.55);
  s += crystalCluster(131, 201, 13, rng, CT, 2, 1.4);
  s += crystalCluster(170, 201, 17, rng, CB, 2, 1.4);
  // Stone lining.
  for (let row = 0; row < 10; row++) {
    const y = 118 + row * 9;
    const jog = row % 2 ? 1.5 : -1;
    for (const x of [118 + jog, 172 - jog]) {
      s += cel(rrect(x, y + 0.5, 10.5, 8, 2.5), { fill: '#524c66', shade: '#3c374f', sx: 1.2, sy: 1.2, stroke: 1.3 });
    }
  }
  s += glow(150, 176, 60, '#8fc0ff', 0.22);
  // Bucket rising through the shaft.
  s += rope([[144, 118], [144, 125]]);
  s += line('M136.5 133Q144 121 151.5 133', INK, 1.4);
  s += cel(poly([[135, 132], [153, 132], [151, 148], [137, 148]]), {
    fill: '#7a5a44', shade: '#5c4232', light: '#98765c', sx: 2, sy: 0, hx: 1, hy: 0, stroke: 1.8,
    over: rect(130, 135, 30, 2.2, P.metal) + rect(130, 143, 30, 2.2, P.metal),
  });
  s += fillPath(ellipsePath(144, 132.4, 8, 1.6), P.crystalBlueLight);
  s += glow(144, 132, 12, '#bfe0ff', 0.45);
  s += fillPath(smooth([[139.5, 150], [140.5, 153], [139.5, 154.5], [138.5, 153]]), P.crystalBlueLight);
  s += fillPath(smooth([[149.5, 154], [150.5, 157], [149.5, 158.5], [148.5, 157]]), P.crystalBlueLight);
  s += line(open(top), INK, 2.2);
  // Frame, roof and pulley.
  const wood = { fill: '#7a5a44', shade: '#5c4232', light: '#98765c', sx: 2, sy: 0, hx: 1, hy: 0, stroke: 2 };
  s += cel(rrect(104, 50, 6.5, 69, 1.5), wood) + cel(rrect(190, 50, 6.5, 69, 1.5), wood);
  s += cel(rrect(100, 50, 101, 6.5, 1.5), { ...wood, sx: 0, sy: 2, hx: 0, hy: 1 });
  s += cel(poly([[92, 52], [150, 27], [209, 52], [202, 54], [150, 33], [99, 54]]), {
    fill: '#5b4234', shade: '#44322a', light: '#7a5a44', sx: 0, sy: 2, hx: 0, hy: 1.2, stroke: 2,
  });
  s += line('M112 44L114 47M126 38L128 41M140 32L142 35M160 32L158 35M174 38L172 41M188 44L186 47', '#3a2a22', 1.2);
  s += line('M150 56V60', INK, 1.6);
  s += cel(ellipsePath(150, 63, 6.5, 6.5), {
    fill: '#8a6a50', shade: '#5c4232', sx: 1.5, sy: 1.5, stroke: 1.8,
    over: ring(150, 63, 3.2, 3.2, '#5c4232', 1) + dot(150, 63, 1.4, INK),
  });
  // Stone rim of the well.
  s += cel('M112 96V118Q150 127 188 118V96A38 8 0 0 1 112 96Z', {
    fill: '#6a6478', shade: '#4f4a5d', light: '#857f93', sx: 5, sy: 0, hx: 2, hy: 0, stroke: 2.2,
    over:
      line('M112 107Q150 116 188 107', '#443f52', 1.3) +
      line('M124 99.5V110M146 104V112.5M168 102.5V111.5M134 110.5V121M158 111V121.5M180 109V119', '#443f52', 1.3),
  });
  s += cel(ellipsePath(150, 96, 38, 8), { fill: '#79738a', shade: '#5f596f', sx: 0, sy: -1.5, stroke: 2.2 });
  s += fillPath(ellipsePath(150, 96.3, 30, 5.2), '#100e19') + line(ellipsePath(150, 96.3, 30, 5.2), INK, 1.4);
  s += line('M126 98.5Q150 103.5 174 98.5', P.crystalBlue, 1.2, 0.7);
  s += rope([[144, 69], [144, 101]]);
  // Clay jug and ground clutter.
  s += cel(smooth([[85, 118], [81, 111], [83, 104], [88, 101], [89, 97], [95, 97], [96, 101], [101, 104], [103, 111], [99, 118]]), {
    fill: '#8a5a44', shade: '#6a4434', light: '#a8735a', sx: 2.5, sy: 0, hx: 1.2, hy: 0, stroke: 1.8,
    over: line('M83.5 108Q92 111 101 108', '#6a4434', 1),
  });
  s += line('M100 103Q107 104 104 111', INK, 1.8);
  for (const [x, y, rx, ry] of [[196, 118, 4.5, 2.4], [109, 118, 3.5, 2], [248, 118, 3.2, 1.8]] as const) {
    s += cel(ellipsePath(x, y, rx, ry), { fill: '#5d566c', shade: '#443f52', sx: 1, sy: 1, stroke: 1.4 });
  }
  const tuft = (x: number, h: number): string =>
    cel(`M${x - 4} 118.5Q${x - 3} ${118 - h * 0.6} ${x - 5} ${118 - h}Q${x - 1} ${118 - h * 0.5} ${x} 118.5Q${x + 1} ${118 - h * 0.7} ${x + 3} ${118 - h * 0.9}Q${x + 3} ${118 - h * 0.4} ${x + 4} 118.5Z`, {
      fill: '#4f6a5e', shade: '#3a5048', sx: 1, sy: 0, stroke: 1.2,
    });
  s += tuft(14, 7) + tuft(58, 6) + tuft(122, 5) + tuft(262, 7) + tuft(304, 6);
  // The woman at the rope, leaning back, a silhouette against the dawn.
  const sil = { fill: '#241f33', light: '#a86f60', hx: -1.6, hy: 0.6, stroke: 1.9 };
  s += rope([[156, 64], [182, 70.5], [206, 77]]);
  s += rope([[208, 79.5], [205, 97], [199, 116]]);
  s += ring(190, 118, 8, 2.2, INK, 2.8) + ring(190, 118, 8, 2.2, '#b9a27a', 1.2);
  s += cel(taper([[231, 70], [220, 79], [208, 76]], 5.4, 4), { fill: '#1b1727', stroke: 1.9 });
  s += cel(smooth([[213, 89], [228, 88], [234, 98], [239, 108], [242, 118], [229, 119.5], [212, 119.5], [197, 118.5], [202, 108], [207.5, 98]]), sil);
  s += line('M215 93Q211 106 206 118M226 93Q229 105 232 118', '#3a3148', 1);
  s += cel(smooth([[213, 91], [214.5, 81], [219.5, 72.5], [225.5, 67], [233.5, 67.5], [236.5, 77], [231, 90.5]]), sil);
  s += cel(rrect(212.5, 86.5, 19.5, 4.2, 1.5), { fill: '#3a2f45', stroke: 1.4 });
  // Face profile first, then the headscarf over crown and nape.
  s += cel(smooth([[227, 48.5], [223.6, 51.5], [223, 54.4], [220.2, 57.4], [222.3, 58.4], [221.8, 60.4], [223.4, 62.8], [227.4, 64.6], [232, 63], [234, 55]]), sil);
  s += cel(smooth([[224.8, 51.2], [228.2, 46.4], [235, 45], [240.8, 48.6], [243, 55.5], [243.4, 62.5], [246.2, 71.5], [240.2, 69.5], [235.4, 65.2], [231, 59.8], [228.6, 54.6]]), sil);
  s += cel(taper([[227, 70.5], [217, 80], [208.5, 78]], 6.4, 4.6), sil);
  s += cel(ellipsePath(207, 78.2, 3.3, 2.9), sil);
  s += cel(smooth([[196.5, 119.5], [198.5, 115.5], [205, 115.5], [207, 119.5]]), sil);
  return s;
}

function artToyWhale(): string {
  const rng = new Rng(1202);
  let s = rect(0, 0, 320, 200, '#2c2742');
  // Faint wallpaper lozenges.
  for (let y = 8; y < 150; y += 18) {
    for (let x = (y / 18) % 2 ? 150 : 141; x < 320; x += 18) s += fillPath(poly([[x, y - 3], [x + 2.5, y], [x, y + 3], [x - 2.5, y]]), '#332e4b');
  }
  // Window onto a faraway sea.
  s += cel(rrect(24, 14, 104, 94, 3), { fill: '#4a4060', shade: '#3a3250', light: '#5d5378', sx: 2, sy: 2, hx: 1, hy: 1, stroke: 2.4 });
  s += rect(31, 21, 90, 80, '#1c2340');
  s += specks(rng, 14, [32, 22, 120, 60], '#e6e9f3', [0.4, 0.9], [0.3, 0.8]);
  s += glow(100, 37, 20, '#c7ccde', 0.35);
  s += `<path d="M101 29A8 8 0 1 0 101 45A10 10 0 0 1 101 29Z" fill="${P.moon}"/>`;
  s += rect(31, 72, 90, 29, '#233050');
  s += rect(31, 71.4, 90, 1.4, '#4a5a80');
  s += line('M90 76h14M86 81h20M92 86h10M88 91h17M94 96h8', P.crystalBlueLight, 1, 0.45);
  // A whale's tail far out at sea, as if the toy had a twin.
  s += fillPath(mixed([[53.5, 73], [54, 67.5], [48.5, 64.5], [42, 61.5, 1], [49, 61.8], [55.5, 63.6, 1], [62, 61.8], [69, 61.5, 1], [62.5, 64.5], [57, 67.5], [57.5, 73]]), '#11172b');
  s += line('M44 61.8Q49 61 55.5 63M55.5 63Q62 61 67.5 61.6', P.crystalBlueLight, 0.8, 0.55);
  s += line('M46 73.6Q55.5 71.4 65 73.6', '#9cc0ee', 0.8, 0.6);
  s += dot(47, 70.5, 0.7, '#dfe6f3', 0.6) + dot(64, 69.5, 0.6, '#dfe6f3', 0.5) + dot(60, 66.5, 0.5, '#dfe6f3', 0.5);
  s += rect(74, 21, 4, 80, '#4a4060') + rect(31, 58, 90, 4, '#4a4060');
  s += line('M74 21V101M78 21V101M31 58H121M31 62H121', INK, 1.1, 0.8);
  s += line('M31 21H121V101H31Z', INK, 1.6);
  s += cel(rrect(18, 102, 116, 8, 2), { fill: '#5d5670', shade: '#443e57', light: '#746c8a', sx: 0, sy: 2, hx: 0, hy: 1, stroke: 2 });
  // Curtains tied back.
  const curtain = { fill: '#5a4868', shade: '#44365a', light: '#6f5c82', sx: 3, sy: 0, hx: 1.5, hy: 0, stroke: 2 };
  s += cel(smooth([[12, 8], [36, 8], [34, 40], [27, 66], [30, 90], [34, 120], [12, 120]]), {
    ...curtain,
    over: line('M18 12Q20 60 16 118M26 12Q27 40 22 66M24 72Q26 96 26 118', '#44365a', 1.2),
  });
  s += cel(smooth([[116, 8], [140, 8], [140, 120], [118, 120], [122, 90], [125, 66], [118, 40]]), {
    ...curtain,
    over: line('M134 12Q132 60 136 118M126 12Q125 40 130 66M128 72Q126 96 126 118', '#44365a', 1.2),
  });
  s += cel(rrect(22, 64, 12, 5, 2), { fill: '#944958', shade: '#6e3542', sx: 0, sy: 1.5, stroke: 1.5 });
  s += cel(rrect(118, 64, 12, 5, 2), { fill: '#944958', shade: '#6e3542', sx: 0, sy: 1.5, stroke: 1.5 });
  // Paper-fish mobile hanging from the ceiling.
  s += line('M150 0V14M150 14Q176 8 202 14M150 14Q138 18 132 16', INK, 1.1);
  const paperFish = (x: number, y: number, len: number, rot: number, flip: boolean): string =>
    line(`M${x} 14V${y - len * 0.2}`, '#8f86a6', 0.8) +
    cel(fishPath(x, y, len, rot, flip), { fill: '#c9bfa8', shade: '#a39a86', sx: 1.4, sy: 1.4, stroke: 1.4 });
  s += paperFish(202, 44, 20, 0.1, false) + paperFish(172, 30, 16, -0.08, true) + paperFish(133, 38, 14, 0.12, true);
  // A child's drawing pinned to the wall.
  s += cel(poly([[228, 18], [262, 15], [264, 44], [230, 47]]), { fill: '#c9bfa8', shade: '#a99f88', sx: 1.5, sy: 1.5, stroke: 1.6 });
  s += line('M233 38Q238 35 243 38T253 38T261 36', P.crystalBlue, 1.4);
  s += line('M239 31Q243 24 251 25Q257 26 256.5 30Q249 33.5 239 31ZM256.5 29.5L260 25.5M256.5 29.5L260.5 32', INK, 1);
  s += dot(245, 17.5, 1.6, '#944958');
  // Moonbeam.
  s += fillPath(poly([[34, 101], [121, 101], [292, 178], [182, 200], [100, 200]]), '#b8c8ee', 0.08);
  // Bed: headboard, mattress, pillow.
  s += cel(smooth([[268, 200], [268, 78], [276, 66], [292, 62], [308, 66], [316, 78], [316, 200]]), {
    fill: '#6e5140', shade: '#533c30', light: '#87654f', sx: 3, sy: 0, hx: 1.5, hy: 1, stroke: 2.4,
    over: ring(292, 86, 9, 9, '#533c30', 2) + ring(292, 86, 4, 4, '#533c30', 1.4) + line('M276 110V196M308 110V196', '#533c30', 1.4),
  });
  const pillow: MPt[] = [
    [148, 106, 1], [168, 111], [210, 109], [252, 110], [284, 103, 1], [281, 126], [286, 153, 1], [250, 147], [210, 150], [168, 148], [144, 155, 1], [150, 130],
  ];
  s += cel(mixed(pillow), {
    fill: '#bcb5cb', shade: '#918aa7', light: '#d8d3e4', sx: 4, sy: 4, hx: 1.5, hy: 1.5, stroke: 2.4,
    over: line('M159 119Q169 128 163 142M273 115Q267 128 273 143', '#a39cb8', 1.2),
  });
  // The carved whale resting in the pillow's dent.
  const wx = 212;
  const wy = 124;
  s += fillPath(ellipsePath(wx + 2, wy + 15, 42, 5), '#918aa7');
  const body: MPt[] = [
    [-44, 3], [-42, -8], [-33, -17], [-18, -21], [0, -19], [14, -13], [22, -10],
    [27, -15], [28.5, -21], [21, -26.5], [13, -31.5, 1], [23.5, -31], [30, -27.5, 1], [36.5, -31], [47, -32, 1], [40, -26], [35.5, -20],
    [37, -11], [33, -2], [22, 5], [6, 11], [-14, 13], [-31, 11], [-40, 8],
  ];
  const woodOver =
    line(open(xf([[-43, 3.5], [-35, 5.5], [-25, 4.5]], wx, wy)), '#5a3f2c', 1.3) +
    line(open(xf([[-31, -13], [-27, -4], [-28, 7]], wx, wy)), '#bf9166', 1) +
    line(open(xf([[-9, -19], [-5, -5], [-7, 12]], wx, wy)), '#8a6245', 1) +
    line(open(xf([[11, -14], [13, -3], [10, 9]], wx, wy)), '#8a6245', 1) +
    line(open(xf([[26, -12], [29, -3], [26, 3]], wx, wy)), '#8a6245', 0.9) +
    line(open(xf([[20, -27], [30, -26], [40, -27]], wx, wy)), '#8a6245', 0.8) +
    line(open(xf([[-20, -12], [-2, -11], [16, -7]], wx, wy)), '#c7996c', 0.9, 0.8) +
    line(open(xf([[-10, 3], [8, 4], [22, 0]], wx, wy)), '#8a6245', 0.9, 0.8);
  s += cel(mixed(xfm(body, wx, wy)), {
    fill: '#a57650', shade: '#76523a', light: '#cfa074', sx: 3, sy: 3.5, hx: 1.5, hy: 1.5, stroke: 2.4, over: woodOver,
  });
  s += cel(smooth(xf([[-14, 6], [-5, 7], [2, 16], [-4, 18.5], [-12, 13]], wx, wy)), {
    fill: '#96694a', shade: '#6d4b35', sx: 1.5, sy: 1.5, stroke: 1.8,
  });
  const e = xf([[-30, -4]], wx, wy)[0]!;
  s += dot(e[0], e[1], 2.3, '#5a3f2c') + dot(e[0], e[1], 1.3, INK) + dot(e[0] - 0.5, e[1] - 0.6, 0.45, '#e8dcca');
  s += line(open(xf([[-8, -19.5], [-6, -22], [-4, -19.5]], wx, wy)), INK, 1.2);
  // Quilt over the foot of the bed.
  const quiltTop: Pt[] = [[34, 176], [42, 153], [80, 147], [130, 151], [180, 148], [230, 152], [276, 148], [330, 152]];
  let patches = '';
  const pc = ['#5a4a6c', '#6c5a4e', '#4a5a78', '#5e5068'];
  for (let y = 142; y < 204; y += 22) {
    for (let x = 30; x < 330; x += 26) patches += rect(x, y, 26, 22, pc[(x / 26 + y / 22) % pc.length | 0]!);
  }
  patches += line('M30 186H330', '#e8dcca', 0.8, 0.25);
  for (let x = 56; x < 330; x += 26) patches += line(`M${x} 142V204`, '#e8dcca', 0.8, 0.25);
  s += cel(`${open(quiltTop)}L330 204L34 204Z`, { fill: '#5a4a6c', shade: '#3e3350', sx: 0, sy: -4, stroke: 2.4, inner: patches });
  const fold = quiltTop.slice(1).map(([x, y]): Pt => [x, y + 11]).reverse();
  s += cel(`${open(quiltTop.slice(1))}${fold.map(([x, y]) => `L${x} ${y}`).join('')}Z`, { fill: '#c9c2d6', shade: '#a39cb6', sx: 0, sy: -2.5, stroke: 2.2 });
  s += specks(rng, 6, [150, 60, 260, 100], '#e6e9f3', [0.5, 0.9], [0.15, 0.35]);
  return s;
}

/** Point and unit direction at fraction t of a polyline's length. */
function along(pts: readonly Pt[], t: number): { p: Pt; d: Pt } {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
    lens.push(l);
    total += l;
  }
  let rest = t * total;
  for (let i = 0; i < lens.length; i++) {
    const l = lens[i]! || 1;
    const a = pts[i]!;
    const b = pts[i + 1]!;
    if (rest <= l || i === lens.length - 1) {
      const k = Math.min(1, rest / l);
      return { p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k], d: [(b[0] - a[0]) / l, (b[1] - a[1]) / l] };
    }
    rest -= l;
  }
  return { p: pts[0]!, d: [1, 0] };
}

function artRaccoon(): string {
  const rng = new Rng(1303);
  const W = 320;
  let s = rect(0, 0, W, 200, '#1f1c30');
  const trunk = (x: number, w: number, c: string, lean: number): string =>
    fillPath(taper([[x + lean, -8], [x + lean * 0.5, 60], [x, 124]], w * 0.75, w), c);
  for (const [x, w, l] of [[18, 9, 2], [60, 13, -3], [104, 7, 2], [150, 15, 3], [214, 9, -2], [248, 17, 2], [300, 11, -3]] as const) {
    s += trunk(x, w, '#28243a', l);
  }
  for (const [x, w, l] of [[34, 22, -3], [284, 26, 3]] as const) s += trunk(x, w, '#232034', l);
  s += skyline([[-8, 118], [50, 113], [120, 117], [190, 112], [260, 116], [328, 112]], 200, '#2a2538');
  for (let i = 0; i < 30; i++) {
    const x = rng.range(140, 320);
    const h = rng.range(9, 26);
    const lean = rng.range(-6, 6);
    s += fillPath(taper([[x, 119], [x + lean * 0.4, 119 - h * 0.6], [x + lean, 119 - h]], 2.2, 0.4), i % 2 ? '#2e3a44' : '#34414a');
  }
  // The stream, running blue from the stone downstream.
  const streamTop: Pt[] = [[-8, 125], [60, 123], [140, 127], [220, 123], [328, 126]];
  s += skyline(streamTop, 200, '#2a4e7e');
  s += band(150, '#2f5a90', rng, W, 200, 3);
  s += line(open(streamTop), '#171526', 1.6);
  s += glow(236, 166, 64, P.crystalBlue, 0.3);
  for (let i = 0; i < 22; i++) {
    const y = rng.range(131, 197);
    const x = rng.range(150, 318);
    const len = rng.range(12, 38);
    const near = Math.abs(y - 166) < 14;
    s += stroke([[x, y], [x + len * 0.5, y - 1.3], [x + len, y]], near ? P.crystalBlueLight : P.crystalBlue, rng.range(1, 2), near ? rng.range(0.6, 0.95) : rng.range(0.35, 0.7));
  }
  s += stroke([[196, 163], [224, 165], [256, 162], [290, 166], [322, 164]], P.crystalBlueLight, 2.2, 0.8);
  s += stroke([[194, 170], [230, 173], [268, 170], [322, 174]], '#bfe0ff', 1.4, 0.6);
  // Near bank.
  s += cel(smooth([[-10, 141], [40, 137], [90, 141], [130, 148], [156, 158], [168, 174], [166, 212], [-10, 212]]), {
    fill: '#3a3346', shade: '#2d2839', light: '#4a4258', sx: 0, sy: -4, hx: 0, hy: 2, stroke: 2.2,
  });
  for (const [x, y, rx, ry] of [[150, 170, 6, 4], [157, 186, 5, 3.5], [30, 172, 7, 4], [96, 186, 6, 3.4], [140, 196, 7, 4]] as const) {
    s += cel(ellipsePath(x, y, rx, ry), { fill: '#524c63', shade: '#3e394f', light: '#6a6480', sx: 1.5, sy: 1.5, hx: 1, hy: 1, stroke: 1.6 });
  }
  const fern = (x: number, y: number, h: number, dir: number): string => {
    let f = '';
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + dir * (0.25 + k * 0.28);
      const tipX = x + Math.cos(a) * h;
      const tipY = y + Math.sin(a) * h;
      f += cel(taper([[x, y], [(x + tipX) / 2 + dir * 3, (y + tipY) / 2 - 3], [tipX, tipY]], 3.2, 0.8), {
        fill: '#3d5a52', shade: '#2d4540', sx: 1, sy: 0, stroke: 1.3,
      });
    }
    return f;
  };
  s += fern(14, 196, 30, 1) + fern(112, 200, 22, -1);
  // Raccoon: ringed tail first.
  const tail: Pt[] = [[100, 142], [80, 150], [58, 152], [40, 146], [30, 134], [29, 123]];
  let rings = '';
  for (const t of [0.16, 0.33, 0.5, 0.67, 0.83]) {
    const { p, d } = along(tail, t);
    rings += line(`M${n2(p[0] - d[1] * 16)} ${n2(p[1] + d[0] * 16)}L${n2(p[0] + d[1] * 16)} ${n2(p[1] - d[0] * 16)}`, '#35323e', 5.5);
  }
  const tip = along(tail, 1).p;
  rings += dot(tip[0], tip[1] - 4, 8, '#35323e');
  s += cel(taper(tail, 16, 11), { fill: '#8d8a95', shade: '#63606c', light: '#b3b0ba', sx: 0, sy: 3, hx: 0, hy: 1.5, stroke: 2.2, inner: rings });
  const fur = { fill: P.raccoon, shade: P.raccoonDark, light: P.raccoonLight };
  s += cel(taper([[160, 120], [171, 138], [184, 155]], 9, 6), { fill: '#6a6773', shade: '#55525e', sx: 2, sy: 0, stroke: 2 });
  s += cel(smooth([[100, 151], [90, 139], [92, 123], [104, 108], [122, 99], [142, 96], [158, 100], [168, 112], [170, 128], [164, 142], [150, 150], [126, 154]]), {
    ...fur, sx: 4, sy: 4, hx: 2, hy: 2, stroke: 2.4,
    over:
      line('M104 127Q112 139 124 146', P.raccoonDark, 1.4) +
      line('M112 106l3 -3M124 101l3 -3M136 99l3 -3M148 99l3 -2.5', P.raccoonDark, 1.2) +
      line('M116 118q6 4 10 2M134 112q5 4 9 2', P.raccoonDark, 1, 0.8),
  });
  s += cel(smooth([[98, 147], [93, 134], [100, 120], [114, 114], [127, 120], [131, 135], [124, 148], [108, 152]]), {
    ...fur, sx: 3, sy: 3, hx: 1.5, hy: 1.5, stroke: 1.8, over: line('M104 124l-3 -3M112 118l-2 -3.5', P.raccoonDark, 1.1),
  });
  s += cel(smooth([[114, 153], [121, 148.5], [133, 149.5], [137, 154.5], [118, 156]]), { fill: '#46434e', shade: '#35323d', sx: 1, sy: 1, stroke: 1.6 });
  // Crystal stone between the paws, with the glow it throws.
  s += glow(188, 159, 40, '#8ff0de', 0.6);
  s += cel(smooth([[182, 162], [180, 157], [183, 151.5], [188, 152.5], [190, 158], [187, 163]]), { fill: '#bfe0ff', shade: '#8fb6dc', sx: 1.2, sy: 1.2, stroke: 1.6 });
  s += cel(poly([[184, 160], [187, 151], [194, 149], [199, 155], [196, 163], [189, 165]]), {
    fill: P.crystalTeal, shade: P.crystalTealDark, light: P.crystalTealLight, sx: 2, sy: 2, hx: 1.5, hy: 1.5, stroke: 1.8,
    over: line('M187 151L191 157L199 155M191 157L189 165', '#e8fffb', 1, 0.8),
  });
  s += line('M192 143v-5M203 148l4 -3M205 157h5M180 146l-3 -4', '#dffcf6', 1.2, 0.85);
  s += cel(taper([[150, 118], [157, 134], [165, 147], [177, 157]], 13, 8), { ...fur, sx: 2.5, sy: 0, hx: 1, hy: 0, stroke: 2.1 });
  s += glow(180, 159, 13, '#cfe6ff', 0.6);
  s += cel(smooth([[172, 156], [178, 153], [185, 155], [188, 159], [186, 163], [181, 164], [175, 162]]), {
    fill: '#c9dcf2', shade: '#98b3d4', sx: 1, sy: 1, stroke: 1.8,
    over: line('M183 156.5l3 2M184.5 160l3 1', '#7f9dc4', 0.9),
  });
  s += fillPath(ellipsePath(186, 164.5, 21, 3.6), P.crystalBlue, 0.55);
  s += ring(186, 164.5, 21, 3.6, P.crystalBlueLight, 1.2, 0.8) + ring(186, 165.5, 31, 5.5, P.crystalBlueLight, 1, 0.45);
  // Head: ears, skull, mask, muzzle.
  const ear = { ...fur, light: '#e2dfe8', hx: 1.2, hy: 1.2, sx: 1, sy: 1, stroke: 2, over: '' };
  s += cel(smooth([[159, 92], [158, 79], [164.5, 74], [171, 85]]), { ...ear, over: fillPath(smooth([[161, 88], [161.5, 80], [165, 78], [167.5, 85]]), '#46434e') });
  s += cel(smooth([[172, 85], [175, 73], [182, 73], [185, 87]]), { ...ear, over: fillPath(smooth([[175.5, 84], [177, 76.5], [181, 76.5], [182.5, 85]]), '#46434e') });
  s += cel(smooth([[158, 96], [161, 86], [172, 81], [184, 84], [193, 93], [201, 104], [205.5, 112], [200.5, 117], [190, 116.5], [178, 113], [166, 108]]), {
    ...fur, sx: 2.5, sy: 3, hx: 1.5, hy: 1.5, stroke: 2.4,
    over:
      fillPath(smooth([[166, 93.5], [174.5, 88.5], [186, 91], [193.5, 98], [186, 95.8], [176, 93.6]]), '#dedbe4') +
      fillPath(smooth([[168, 97], [176, 93], [186, 95.6], [194, 102.5], [197.5, 108.5], [192, 110.5], [184, 105.5], [175, 104], [168.5, 102.5]]), '#2a2732') +
      fillPath(smooth([[185.5, 107.5], [194, 104.5], [201.5, 109.5], [205, 114], [197, 117.5], [188, 114]]), '#dedbe4') +
      line('M166 110q5 3 11 3.5', P.raccoonDark, 1.2),
  });
  s += fillPath(ellipsePath(203.8, 113.6, 2.5, 1.9), INK);
  s += dot(186.2, 100.2, 1.8, '#0e0c16') + dot(186.9, 99.5, 0.65, '#bfe0ff');
  s += line('M199 116.5q-3 2.2 -7 1.5', INK, 1.1);
  s += specks(rng, 5, [60, 40, 300, 110], '#e6f7b0', [0.8, 1.2], [0.5, 0.9]);
  return s;
}

function artTea(): string {
  const rng = new Rng(1404);
  let s = rect(0, 0, 320, 200, '#33283a');
  // Window onto the snowy night street.
  s += cel(rrect(8, 4, 304, 134, 3), { fill: '#4e3a36', shade: '#3a2a28', light: '#664c45', sx: 2, sy: 2, hx: 1, hy: 1, stroke: 2.4 });
  let outside = rect(0, 0, 320, 140, '#161b30');
  outside += specks(rng, 10, [16, 12, 304, 40], '#e6e9f3', [0.4, 0.8], [0.2, 0.5]);
  outside += fillPath(poly([[16, 132], [16, 74], [44, 74], [44, 64], [84, 64], [84, 78], [118, 78], [118, 58], [160, 58], [160, 70], [196, 70], [196, 54], [232, 54], [232, 72], [270, 72], [270, 62], [304, 62], [304, 132]]), '#303a5a');
  for (const [x0, x1, y] of [[16, 44, 74], [44, 84, 64], [84, 118, 78], [118, 160, 58], [160, 196, 70], [196, 232, 54], [232, 270, 72], [270, 304, 62]] as const) {
    outside += fillPath(smooth([[x0 - 1, y + 0.8], [x0 + 2, y - 1.8], [(x0 + x1) / 2, y - 2.4], [x1 - 2, y - 1.8], [x1 + 1, y + 0.8], [(x0 + x1) / 2, y + 1.4]]), '#a9b3ca');
  }
  for (const [x, y] of [[26, 84], [58, 76], [96, 88], [132, 70], [144, 84], [206, 66], [220, 82], [284, 74]] as const) {
    outside += rect(x, y, 5, 6, '#e0b060', rng.range(0.35, 0.7));
  }
  outside += skyline([[10, 114], [80, 110], [160, 113], [240, 109], [310, 112]], 140, '#8f9ab3');
  outside += fillPath(taper([[250, 132], [250, 80], [252, 48]], 3, 2.4), '#141a2c');
  outside += line('M252 48q8 -4 12 2', '#141a2c', 2.4);
  outside += glow(263, 54, 26, '#f0d38e', 0.45) + dot(263, 54, 3, '#f7e4b0');
  outside += specks(rng, 70, [16, 12, 304, 132], '#f0f3fa', [0.5, 1.7], [0.45, 0.95]);
  // Condensation over the lower glass, and a face surfacing in it.
  outside += band(80, '#cdd6e6', rng, 320, 140, 6, 12, 0.16);
  outside += band(100, '#cdd6e6', rng, 320, 140, 4, 10, 0.14);
  for (const [x, y0, y1] of [[30, 80, 118], [96, 76, 104], [148, 84, 124], [196, 90, 116], [290, 80, 108]] as const) {
    outside += line(`M${x} ${y0}V${y1}`, '#dfe6f2', 1, 0.3) + dot(x, y1 + 1, 1.2, '#dfe6f2', 0.4);
  }
  const ghost = '#eef2fa';
  outside += line(smooth([[70, 63], [81, 67], [86, 78], [85, 90], [80, 100], [70, 104.5], [60, 100], [55, 90], [54, 78], [59, 67]]), ghost, 1.3, 0.4);
  outside += stroke([[61, 79], [64.5, 77.6], [67.5, 78.4]], ghost, 1.3, 0.45) + stroke([[73, 78.4], [76, 77.6], [79.5, 79]], ghost, 1.3, 0.45);
  outside += stroke([[61.5, 83.5], [64.5, 85], [67.5, 83.8]], ghost, 1.2, 0.5) + stroke([[73, 83.8], [76, 85], [79, 83.5]], ghost, 1.2, 0.5);
  outside += stroke([[70.5, 84], [69.5, 92], [72.5, 93]], ghost, 1.1, 0.4) + stroke([[65.5, 97.5], [70.5, 96.8], [75.5, 97.5]], ghost, 1.2, 0.45);
  outside += stroke([[54.5, 82], [51.8, 85], [54.5, 90]], ghost, 1.1, 0.35) + stroke([[85.5, 82], [88.2, 85], [85.5, 90]], ghost, 1.1, 0.35);
  s += cel(rrect(16, 12, 288, 118, 1), { fill: '#1a2036', stroke: 1.6, inner: outside });
  s += cel(rrect(107, 12, 7, 118, 0), { fill: '#4e3a36', shade: '#3a2a28', sx: 2, sy: 0, stroke: 1.6 });
  s += cel(rrect(207, 12, 7, 118, 0), { fill: '#4e3a36', shade: '#3a2a28', sx: 2, sy: 0, stroke: 1.6 });
  s += cel(rrect(2, 132, 316, 10, 2), { fill: '#6e5140', shade: '#533c30', light: '#87654f', sx: 0, sy: 2.5, hx: 0, hy: 1, stroke: 2.2 });
  // The man, head bowed over his glass (behind the table).
  const skin = { fill: P.skin, shade: P.skinDark, light: P.skinLight };
  s += cel(smooth([[208, 204], [208, 150], [216, 126], [232, 112], [252, 107], [282, 109], [306, 119], [326, 134], [326, 204]]), {
    fill: '#5a4538', shade: '#43332a', light: '#6e5646', sx: 4, sy: 0, hx: 2, hy: 1.5, stroke: 2.4,
    over: fillPath(poly([[238, 108], [264, 108], [252, 134]]), P.shirt) + line('M238 108L252 134L264 108', '#43332a', 1.4) + line('M226 124q-6 14 -6 30M296 124q6 12 8 26', '#43332a', 1.3),
  });
  s += cel(smooth([[241, 99], [259, 98], [262, 112], [244, 114]]), { ...skin, sx: 2, sy: 0, stroke: 2 });
  s += cel(smooth([[234, 109], [243, 104], [252, 111], [262, 104], [269, 110], [258, 118], [246, 117]]), { fill: P.shirt, shade: P.shirtDark, sx: 1, sy: 1.5, stroke: 1.8 });
  s += cel(smooth([[250, 56], [262, 59], [270, 68], [272, 80], [268, 92], [260, 99], [249, 103], [239, 103.5], [233, 99.5], [231, 95.5], [227.8, 92.8], [224, 89.2], [226.6, 85.2], [228, 80], [229, 74.5], [231, 67], [239, 59.5]]), {
    ...skin, sx: 4, sy: 1.5, hx: 2, hy: 2, stroke: 2.4,
    over:
      line('M227.6 75.8Q232 74 237 75.4', '#8d8790', 2.2) +
      line('M229.2 80.6Q232.6 82.2 236.4 81', INK, 1.5) +
      line('M230.5 83.6q2.4 1 4.6 0.2', P.skinDark, 1) +
      line('M237.5 87Q235 92 235.5 97', P.skinDark, 1.1) +
      line('M231 97.4q2.4 0.9 4.6 0.4', '#7c5046', 1.3) +
      line('M241 68q2.2 5 0.6 11', P.violet, 1.1, 0.55),
  });
  s += cel(smooth([[257, 71], [266, 69], [271.5, 78], [270.5, 90], [264, 97.5], [258, 94], [262, 86], [261, 78]]), { fill: '#9a969e', shade: '#77737e', sx: 1.5, sy: 1.5, stroke: 1.8 });
  s += cel(smooth([[252, 78.5], [257, 77.5], [259.6, 83], [257, 90], [253, 89]]), { ...skin, sx: 1.2, sy: 1.2, stroke: 1.8, over: line('M254.5 81q2 2.5 0.5 5.5', P.skinDark, 1) });
  // Table top.
  s += cel(rrect(-4, 148, 328, 60, 2), {
    fill: '#5d4333', shade: '#4a3428', light: '#7a5a44', sx: 0, sy: -3, hx: 0, hy: 2.5, stroke: 2.2,
    over: line('M10 164Q80 160 150 166T300 163M20 182Q110 178 190 184T318 180M4 196Q90 192 170 197', '#4a3428', 1.2),
  });
  // Sleeve and forearm resting on the table.
  s += cel(limb([228, 122], [212, 153], 22, 18, 0.5), { fill: P.shirt, shade: P.shirtDark, light: '#d3ceba', sx: 3, sy: 0, hx: 1.5, hy: 0, stroke: 2.2 });
  // Saucer, tulip glass, sugar and spoon.
  s += cel(ellipsePath(128, 164, 27, 6.8), {
    fill: P.ivory, shade: P.ivoryDark, sx: 0, sy: 2.5, stroke: 2,
    over: ring(128, 163.4, 23.5, 5.4, '#b3873a', 0.9) + ring(128, 162.8, 15, 3.4, P.ivoryDark, 1.1),
  });
  const cube = (x: number, y: number): string =>
    cel(poly([[x, y], [x + 5, y - 1.5], [x + 9, y + 0.5], [x + 9, y + 5.5], [x + 4, y + 7], [x, y + 5]]), { fill: '#f4efe6', shade: '#cfc6b6', sx: 1.5, sy: 0, stroke: 1.1 });
  s += cube(145, 157) + cube(150.5, 153.5);
  const glass: Pt[] = [
    [115, 110], [116.5, 117], [119.5, 125], [121.5, 131], [119.5, 138], [118, 146], [119, 154], [122, 159.5],
    [134, 159.5], [137, 154], [138, 146], [136.5, 138], [134.5, 131], [136.5, 125], [139.5, 117], [141, 110],
  ];
  const gd = smooth(glass, 0.9);
  s += fillPath(gd, '#e8e2d6', 0.3);
  s += line('M131 128L134.6 116', '#c7ccde', 1.6, 0.35);
  s += clipTo('M100 115.2H160V170H100Z', cel(gd, { fill: '#a8452c', shade: '#7c2d1d', light: '#d4744a', sx: 3.5, sy: 0, hx: 2, hy: 0, stroke: 0 }));
  s += fillPath(ellipsePath(128, 115.2, 11.6, 1.8), '#c8653d');
  s += line('M134.6 116L147 98.5', INK, 3.6) + line('M134.6 116L147 98.5', '#c7ccde', 1.8);
  s += line(gd, INK, 1.8);
  s += ring(128, 110, 13, 2.2, INK, 1.4);
  s += line('M118.6 118Q121 126 123.2 131M121.2 140Q120 148 122 155', '#fbf6ec', 1.2, 0.85);
  for (const [x, dx] of [[123, -3], [129, 2], [134, -2]] as const) {
    s += stroke([[x, 106], [x + dx, 98], [x - dx, 89], [x + dx * 0.5, 80]], '#eef2fa', 1.4, 0.35);
  }
  // Forearm and hand pinching the spoon.
  s += cel(limb([212, 152], [192, 136], 17, 15, 0.3), { fill: P.shirt, shade: P.shirtDark, sx: 2, sy: 2, stroke: 2.2 });
  s += cel(limb([194, 138], [165, 113], 13, 11.5, 0.4), { ...skin, sx: 2, sy: 2.5, hx: 1, hy: 1, stroke: 2.2, over: line('M186 128q-6 -5 -12 -8', P.violet, 0.9, 0.35) });
  s += cel(limb([193, 137.2], [186.5, 131.6], 15.5, 15, 0), { fill: P.shirt, shade: P.shirtDark, sx: 1.5, sy: 1.5, stroke: 1.8 });
  s += cel(smooth([[170, 105], [162, 100], [154, 97.5], [147.5, 97], [145, 99.5], [148.5, 102.5], [153.5, 104], [151, 107.5], [156, 111.5], [163, 117], [171, 117.5]]), {
    ...skin, sx: 2, sy: 2, hx: 1, hy: 1, stroke: 2,
    over: line('M156 104q3 1 5 4M158 100.5q3 1 5 3.5', P.skinDark, 1),
  });
  s += cel(smooth([[151, 97.2], [146.5, 95.2], [143.5, 96.5], [145.5, 99], [150, 99.8]]), { ...skin, sx: 1, sy: 1, stroke: 1.6 });
  return s;
}

// Whale, facing +x, ~280 units long at scale 1 (snout at +130).
const WHALE: Pt[] = [
  [130, 3], [126, -6], [112, -14], [92, -20], [70, -24], [40, -26], [8, -24], [-30, -18], [-62, -12], [-90, -7], [-112, -4], [-122, -3],
  [-122, 4], [-110, 6], [-86, 10], [-50, 17], [-10, 23], [30, 26], [62, 25], [90, 20], [110, 13], [124, 8],
];
const WHALE_FLUKE: MPt[] = [[-114, -2.5], [-130, -10], [-149, -19, 1], [-141, -6], [-137, 0, 1], [-141, 6], [-149, 18, 1], [-130, 9], [-114, 3.5]];
const WHALE_DORSAL: MPt[] = [[-50, -14], [-62, -15.5], [-72, -22, 1], [-70, -11]];
const WHALE_PEC: MPt[] = [[72, 12], [58, 24], [38, 40], [16, 54], [2, 62, 1], [11, 50], [30, 35], [48, 23], [60, 17]];
const WHALE_PEC_FAR: MPt[] = [[80, 16], [70, 30], [56, 45, 1], [62, 31], [72, 21]];
const WHALE_BLUE = { fill: '#56789f', shade: '#3d5a7d', light: '#80a0c3' };

function whale(cx: number, cy: number, sc: number, rot: number, old: boolean, rng: Rng): string {
  const T = (pts: readonly Pt[]): Pt[] => xf(pts, cx, cy, sc, rot);
  const TM = (pts: readonly MPt[]): MPt[] => xfm(pts, cx, cy, sc, rot);
  const at = (x: number, y: number): Pt => T([[x, y]])[0]!;
  const sw = 1.3 + 1.2 * sc;
  let s = '';
  s += cel(mixed(TM(WHALE_PEC_FAR)), { fill: '#3a5578', shade: '#2e4565', sx: 1, sy: 1, stroke: sw });
  s += cel(mixed(TM(WHALE_FLUKE)), { ...WHALE_BLUE, sx: 0, sy: 2.5 * sc, hx: 0, hy: 1.5 * sc, stroke: sw });
  s += cel(mixed(TM(WHALE_DORSAL)), { ...WHALE_BLUE, sx: 1.5 * sc, sy: 1, stroke: sw });
  // Throat grooves, mottling and (for the old one) scars live inside the body.
  const gTop: Pt[] = [[127, 5.5], [106, 8.5], [78, 11.5], [48, 15.5], [18, 19], [-12, 22]];
  const gBot: Pt[] = [[125, 8.5], [110, 13], [90, 20], [62, 25], [30, 26], [-10, 23]];
  let over = fillPath(smooth(T([...gTop, [-14, 30], [40, 34], [100, 26], [132, 12]])), '#c3d0df');
  for (const f of [0.22, 0.44, 0.66, 0.86]) {
    const pts = gTop.map((p, i): Pt => [p[0] + (gBot[i]![0] - p[0]) * f, p[1] + (gBot[i]![1] - p[1]) * f]);
    over += line(open(T(pts)), '#8ea3bb', 0.5 + 0.7 * sc);
  }
  for (let i = 0; i < 18; i++) {
    const p = at(rng.range(-110, 100), rng.range(-22, 4));
    over += fillPath(ellipsePath(p[0], p[1], rng.range(1.5, 3.8) * sc, rng.range(1, 2.2) * sc), '#86a4c6', 0.55);
  }
  if (old) {
    over += line(open(T([[40, -14], [58, -8], [72, -9]])), '#cfdae6', 0.9, 0.7);
    over += line(open(T([[-20, -12], [0, -6]])), '#cfdae6', 0.9, 0.6);
    over += line(open(T([[10, 0], [28, 6], [44, 5]])), '#cfdae6', 0.8, 0.5);
  }
  s += cel(smooth(T(WHALE)), { ...WHALE_BLUE, sx: 0, sy: 5 * sc, hx: 0, hy: 2 * sc, stroke: sw + 0.3, over });
  s += line(open(T([[129.5, 3.5], [116, 4.5], [100, 2.8], [89, -0.5]])), INK, 0.8 + 0.9 * sc);
  const e = at(85, 1.5);
  s += fillPath(ellipsePath(e[0], e[1], 3.2 * sc, 2.4 * sc), '#c3d0df') + dot(e[0] + 0.3 * sc, e[1], 1.7 * sc + 0.3, '#0f1322');
  s += line(open(T([[80, -2.5], [85, -4.2], [90, -2.5]])), INK, 0.6 + 0.6 * sc);
  s += line(open(T([[74, -22], [79, -24.5], [84, -22.5]])), INK, 0.6 + 0.7 * sc);
  if (old) {
    for (const [x, y, r] of [[116, 9, 1.6], [112, 11, 1.2], [119, 11, 1.1], [104, 12, 1.3], [66, 17, 1.2], [70, 18.5, 0.9]] as const) {
      const p = at(x, y);
      s += `<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${n2(r * sc)}" fill="#d5ccb8" stroke="${INK}" stroke-width="0.5"/>`;
    }
  }
  s += cel(mixed(TM(WHALE_PEC)), {
    ...WHALE_BLUE, light: '#c3d0df', sx: 1.5 * sc, sy: -2 * sc, hx: -1.5 * sc, hy: 2 * sc, stroke: sw,
  });
  return s;
}

function arcs(cx: number, cy: number, radii: readonly number[], a0: number, a1: number, color: string, w: number, o0: number): string {
  let s = '';
  radii.forEach((r, i) => {
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    s += line(`M${n2(x0)} ${n2(y0)}A${r} ${r} 0 0 1 ${n2(x1)} ${n2(y1)}`, color, w, Math.max(0.12, o0 - i * (o0 / (radii.length + 0.5))));
  });
  return s;
}

function artWhales(): string {
  const rng = new Rng(1505);
  const W = 320;
  let s = rect(0, 0, W, 200, '#26395e');
  s += band(56, '#213152', rng, W, 200, 3);
  s += band(104, '#1c2a47', rng, W, 200, 3);
  s += band(152, '#17223a', rng, W, 200, 3);
  s += fillPath(poly([[234, 24], [252, 24], [306, 200], [196, 200]]), '#b9d4f2', 0.06);
  s += fillPath(poly([[239, 24], [247, 24], [270, 200], [226, 200]]), '#b9d4f2', 0.07);
  s += fillPath(poly([[86, 24], [98, 24], [126, 200], [52, 200]]), '#b9d4f2', 0.035);
  s += specks(rng, 60, [0, 28, W, 200], '#9cc0ee', [0.4, 1.1], [0.12, 0.45]);
  // Ice ceiling with an open lead where the light comes in.
  const ice = { fill: '#8ea6c6', shade: '#6e86a8', light: '#bccde3', sx: 0, sy: 3.5, hx: 0, hy: -2, stroke: 2.2 };
  const iceLines = line('M20 6L34 16L30 22M70 4L64 14L76 22M120 10L134 18M160 4L150 16L158 24M200 8L214 20M280 6L292 16', '#5f7699', 1, 0.8) +
    line('M8 10H60M96 14H150M176 10H226M262 12H310', '#d8e4f2', 1.2, 0.6);
  s += cel(poly([[-8, -8], [236, -8], [236, 12], [232, 21], [222, 27], [206, 21], [182, 26], [152, 20], [122, 27], [96, 22], [70, 28], [44, 21], [20, 25], [-8, 22]]), { ...ice, over: iceLines });
  s += cel(poly([[252, -8], [328, -8], [328, 22], [302, 26], [282, 20], [264, 27], [255, 21], [251, 11]]), { ...ice, over: iceLines });
  s += fillPath(poly([[237, 0], [250, 0], [249, 22], [238, 22]]), '#dfeaf6', 0.35);
  // Old whale and calf.
  s += whale(150, 96, 0.9, -0.07, true, rng);
  s += whale(236, 160, 0.42, -0.13, false, rng);
  // Sound: deep rings from the old whale, a small answer from the calf.
  s += arcs(270, 86, [16, 27, 38, 50, 63], -1.0, 1.0, P.crystalBlueLight, 1.6, 0.9);
  s += arcs(290, 150, [8, 14, 20], -0.9, 0.9, P.crystalBlueLight, 1.1, 0.6);
  s += arcs(270, 86, [80, 96], -1.9, -1.2, P.crystalBlueLight, 1.2, 0.35);
  return s;
}

function artIce(): string {
  const rng = new Rng(1606);
  const W = 320;
  let s = rect(0, 0, W, 200, '#1b2037');
  s += band(26, '#212742', rng, W, 200, 2);
  s += band(46, '#29304e', rng, W, 200, 2);
  s += band(62, '#333b5a', rng, W, 200, 1.5);
  s += specks(rng, 40, [0, 0, W, 60], '#e6e9f3', [0.4, 1], [0.25, 0.8]);
  // Far bank: snow, pines and birches.
  const pine = (x: number, y: number, h: number): string => {
    const pts: Pt[] = [[x, y - h]];
    for (let i = 1; i <= 4; i++) {
      const t = i / 4;
      pts.push([x + h * 0.22 * t, y - h + h * t * 0.85], [x + h * 0.09 * t, y - h + h * t * 0.85 - 2]);
    }
    pts.push([x + 1.5, y], [x - 1.5, y]);
    for (let i = 4; i >= 1; i--) {
      const t = i / 4;
      pts.push([x - h * 0.09 * t, y - h + h * t * 0.85 - 2], [x - h * 0.22 * t, y - h + h * t * 0.85]);
    }
    return fillPath(poly(pts), '#1a1f33');
  };
  for (const [x, h] of [[12, 30], [30, 22], [52, 36], [128, 26], [146, 34], [168, 22], [262, 30], [284, 40], [306, 26]] as const) s += pine(x, 80, h);
  for (const [x, h] of [[80, 38], [96, 30], [196, 42], [214, 32], [236, 36]] as const) {
    s += fillPath(taper([[x, 80], [x + 1, 80 - h]], 3, 1.4), '#c9cfdc');
    s += line(`M${x - 1} ${80 - h * 0.3}h2.4M${x - 1} ${80 - h * 0.55}h2M${x} ${80 - h * 0.75}h1.6`, '#1a1f33', 1.2);
    s += line(`M${x + 0.5} ${80 - h * 0.62}l6 -7M${x + 0.5} ${80 - h * 0.45}l-6 -6`, '#8d95aa', 0.8);
  }
  s += skyline([[-8, 82], [40, 78], [100, 81], [160, 77], [220, 80], [280, 76], [328, 79]], 200, '#9aa5bd');
  // Frozen river: surface receding to the bank, then the cut edge of the ice.
  s += skyline([[-8, 87], [80, 85], [160, 88], [240, 86], [328, 88]], 200, '#aebad0');
  s += line('M16 92H66M104 95H164M256 93H306M40 102H96M150 105H190', '#dde5f0', 1.2, 0.8);
  s += rect(0, 111, W, 89, '#1a2744');
  s += band(152, '#15213b', rng, W, 200, 3);
  s += band(180, '#111a30', rng, W, 200, 3);
  for (let x = -6; x < 330; x += rng.range(14, 26)) {
    s += fillPath(ellipsePath(x, 201, rng.range(8, 14), rng.range(4, 8)), '#0d1427');
  }
  s += specks(rng, 30, [0, 130, W, 196], '#9cc0ee', [0.4, 1], [0.1, 0.35]);
  // The fish, glowing violet under the child's face.
  const fx = 246;
  const fy = 164;
  const fl = 46;
  const fr = -1.45;
  s += glow(fx, fy - 6, 54, P.violet, 0.45);
  const fp = (u: number, v: number): Pt => fishPt(u, v, fx, fy, fl, fr);
  const fin = (pts: Pt[]): string =>
    cel(smooth(pts.map(([u, v]) => fp(u, v))), { fill: '#7c4cc0', shade: '#5a3494', sx: 1, sy: 1, stroke: 1.4, opacity: 0.95 });
  s += fin([[0.1, -0.18], [-0.02, -0.34], [-0.18, -0.28], [-0.22, -0.13]]);
  s += fin([[-0.12, 0.13], [-0.2, 0.27], [-0.3, 0.12]]);
  let scales = '';
  for (let u = -0.3; u <= 0.26; u += 0.065) {
    for (let v = -0.15; v <= 0.15; v += 0.055) {
      const vv = v + (Math.round(u / 0.065) & 1) * 0.0275;
      const a = fp(u + 0.02, vv - 0.03);
      const b = fp(u - 0.012, vv);
      const c = fp(u + 0.02, vv + 0.03);
      const bright = rng.chance(0.3);
      scales += line(`M${n2(a[0])} ${n2(a[1])}Q${n2(b[0])} ${n2(b[1])} ${n2(c[0])} ${n2(c[1])}`, bright ? P.vein : '#b184ee', bright ? 1.1 : 0.9, bright ? 0.95 : 0.8);
    }
  }
  s += cel(fishPath(fx, fy, fl, fr), { fill: '#4a3478', shade: '#35245a', light: '#7a55b8', sx: 2, sy: 0, hx: -1.5, hy: 0, stroke: 1.8, over: scales });
  s += fin([[0.16, 0.03], [0.06, 0.2], [0.0, 0.09]]);
  const eye = fp(0.31, -0.05);
  s += dot(eye[0], eye[1], 3.3, '#f4e8ff') + ring(eye[0], eye[1], 3.3, 3.3, INK, 1) + dot(eye[0] + 0.4, eye[1] - 1.1, 1.6, INK) + dot(eye[0] + 0.9, eye[1] - 1.7, 0.5, '#fff');
  const mouth = fp(0.49, 0.03);
  s += line(`M${n2(mouth[0] - 2.4)} ${n2(mouth[1] + 1)}q2 1 3.6 -0.6`, INK, 1.1);
  // Ice slab section with bubbles and cracks, lit from below by the fish.
  s += cel('M-8 111H328V128Q240 130 160 127.5T-8 128Z', {
    fill: '#6f8db6', shade: '#57739a', light: '#9db6d6', sx: 0, sy: 2.5, hx: 0, hy: 1.5, stroke: 2.2,
    over: glow(246, 124, 32, P.vein, 0.6) +
      line('M246 111L238 119L241 128M246 111L257 121M206 111L214 120L210 128M160 115L172 123', '#dfe8f5', 1, 0.6) +
      specks(rng, 26, [0, 114, W, 126], '#e8f0fa', [0.6, 1.4], [0.35, 0.8]),
  });
  s += line('M-8 111H328', INK, 2.2);
  // The child lying face down on the ice, drawn in a local frame (ice at y 104).
  const coat = { fill: '#8e4a52', shade: '#6a343b', light: '#b0666c' };
  const felt = { fill: '#6a6478', shade: '#4f4a5d', light: '#857f93' };
  const pants = { fill: '#4a5170', shade: '#3a4058', sx: 1.5, sy: 0, stroke: 2 };
  let kid = fillPath(ellipsePath(178, 104.5, 60, 2.4), '#57739a', 0.8);
  kid += cel(limb([134, 99], [129, 78], 9, 8, 0.3), { ...pants, fill: '#3e4460', shade: '#30354c' });
  kid += cel(smooth([[124, 82], [123, 72], [128, 66], [135, 67], [135, 76], [134, 82]]), { ...felt, sx: 1.5, sy: 1, stroke: 2 });
  kid += cel(taper([[158, 99], [145, 100], [133, 99.5]], 12, 10), { ...pants, sx: 0, sy: 2 });
  kid += cel(limb([133, 99.5], [122, 80], 10, 9, 0.3), pants);
  kid += cel(smooth([[116, 84], [114, 73], [118, 66.5], [126, 67], [128, 76], [127, 84]]), { ...felt, sx: 1.5, sy: 1, hx: 1, hy: 1, stroke: 2, over: line('M114.5 72.5Q121 70 127.5 73', '#4f4a5d', 1.2) });
  kid += cel(smooth([[150, 104.5], [148, 95], [155, 87], [176, 84.5], [198, 85], [210, 90], [211.5, 99], [205, 104.8], [176, 105.6]]), {
    ...coat, sx: 0, sy: 3.5, hx: 1, hy: 1.5, stroke: 2.2,
    over: line('M161 88Q163 96 160 104M184 85.5v19', '#6a343b', 1.2) + line('M150 97.5Q152 91 156 88', P.ivory, 2.4),
  });
  kid += cel(limb([204, 96], [236, 102.5], 8, 7, 0.2), { fill: '#6a343b', shade: '#55282e', sx: 0, sy: 1.5, stroke: 1.8 });
  kid += cel(smooth([[209, 101], [211.5, 92], [218.5, 86], [227.5, 86.5], [232.5, 91.5], [234, 96.5], [236.4, 100.6], [233.6, 101.6], [232.8, 103.6], [227, 104.6], [216, 104.4]]), {
    fill: P.skin, shade: P.skinDark, light: P.skinLight, sx: 0, sy: 2, hx: 1, hy: 1, stroke: 2,
    over: dot(225.5, 99.5, 2.8, '#e0928a', 0.6) + line('M227.2 95.2Q229.2 97.6 231.2 97.6', INK, 1.2) + line('M226.6 92.6q2.4 0.4 4.4 2', '#8a6a58', 1),
  });
  kid += cel(smooth([[216.5, 94], [220, 93], [221.4, 97.4], [219, 100.4], [216, 99]]), { fill: P.skin, shade: P.skinDark, sx: 1, sy: 1, stroke: 1.5 });
  kid += cel(smooth([[206.5, 99], [205, 88], [211, 80.5], [221, 78.5], [229.5, 82], [233.4, 89.4], [225, 90.4], [216, 93.6], [211.5, 99.5]]), {
    fill: '#56658e', shade: '#435079', light: '#6d7da6', sx: 1, sy: 2, hx: 1, hy: 1, stroke: 2,
    over: line('M207.5 94.5Q219 86.5 233 88.6', P.ivory, 3) + line('M213 82.5l2 5M219 80.5l1.2 5.6M225 81l0.2 5.4', '#435079', 1),
  });
  kid += cel(ellipsePath(208.5, 79.5, 5.2, 5), { fill: P.ivory, shade: P.ivoryDark, sx: 1, sy: 1, stroke: 1.8 });
  kid += cel(limb([199, 93], [213, 103], 9, 8, 0.2), { ...coat, sx: 0, sy: 2, stroke: 2 });
  kid += cel(limb([212.5, 103], [233, 101.5], 8, 7, 0.2), { ...coat, sx: 0, sy: 2, stroke: 2 });
  kid += cel(smooth([[232, 104], [232.6, 98], [237.6, 96], [242.4, 98.6], [241.8, 104]]), { fill: '#c9a24e', shade: '#a8843a', light: '#e0c070', sx: 1, sy: 1, hx: 0.8, hy: 0.8, stroke: 1.8 });
  s += `<g transform="translate(180 111) scale(1.3) translate(-180 -104)">${kid}</g>`;
  return s;
}

function artNest(): string {
  const rng = new Rng(1707);
  const W = 320;
  let s = rect(0, 0, W, 200, '#29253f');
  s += band(58, '#302b48', rng, W, 200);
  s += band(106, '#3b3351', rng, W, 200);
  s += band(142, '#4a3c5a', rng, W, 200);
  s += band(170, '#61475f', rng, W, 200);
  s += glow(292, 208, 74, '#f0c79a', 0.3);
  s += specks(rng, 18, [0, 0, W, 70], '#e6e9f3', [0.4, 0.9], [0.2, 0.6]);
  // Dark leaf masses framing the scene.
  const leaf = (x: number, y: number, len: number, rot: number, c: string): string =>
    fillPath(smooth(xf([[0, 0], [len * 0.5, -len * 0.22], [len, 0], [len * 0.5, len * 0.22]], x, y, 1, rot)), c);
  for (let i = 0; i < 16; i++) s += leaf(rng.range(-10, 60), rng.range(-6, 50), rng.range(16, 26), rng.range(-0.6, 1.2), '#26243a');
  for (let i = 0; i < 14; i++) s += leaf(rng.range(270, 330), rng.range(10, 70), rng.range(16, 26), rng.range(1.8, 3.6), '#26243a');
  // Branches.
  const bark = { fill: P.bark, shade: P.barkDark, light: P.barkLight, sx: 0, sy: 3, hx: 0, hy: 1.5, stroke: 2.4 };
  s += cel(taper([[150, 146], [176, 118], [206, 88], [232, 60], [252, 34]], 12, 4), { ...bark, sx: 2.5, sy: 0, hx: 1, hy: 0 });
  s += cel(taper([[214, 80], [228, 66], [244, 58]], 4, 2), { ...bark, stroke: 1.8 });
  s += cel(taper([[-12, 170], [60, 160], [130, 148], [200, 140], [262, 134], [332, 130]], 21, 12), {
    ...bark, over: line('M20 164q20 -4 40 -5M100 152q16 -2 30 -4M230 138q14 -2 26 -2', P.barkDark, 1.2) + ring(92, 156, 3.4, 2.2, P.barkDark, 1.2),
  });
  s += cel(taper([[92, 153], [80, 136], [74, 120]], 6, 2.4), { ...bark, sx: 1.5, sy: 0, stroke: 1.8 });
  const gl = { fill: P.leaf, shade: P.leafDark, light: P.leafLight, sx: 1.5, sy: 1.5, hx: 1, hy: 1, stroke: 1.6 };
  const greenLeaf = (x: number, y: number, len: number, rot: number): string => {
    const pts = xf([[0, 0], [len * 0.45, -len * 0.26], [len, 0], [len * 0.45, len * 0.26]], x, y, 1, rot);
    const mid = xf([[1, 0], [len * 0.85, 0]], x, y, 1, rot);
    return cel(smooth(pts), { ...gl, over: line(`M${n2(mid[0]![0])} ${n2(mid[0]![1])}L${n2(mid[1]![0])} ${n2(mid[1]![1])}`, P.leafDark, 1) });
  };
  s += greenLeaf(74, 120, 20, -1.9) + greenLeaf(76, 126, 18, -0.6) + greenLeaf(244, 58, 22, -0.4) + greenLeaf(236, 62, 18, -2.4);
  s += greenLeaf(252, 36, 20, -1.2) + greenLeaf(290, 131, 22, 0.5) + greenLeaf(40, 164, 18, 2.2);
  // Nest in the fork: twigs with an old watch strap woven through.
  let twigs = '';
  for (let i = 0; i < 46; i++) {
    const x = rng.range(152, 244);
    const y = rng.range(106, 140);
    const len = rng.range(10, 22);
    const a = rng.range(-0.5, 0.5);
    twigs += line(`M${n2(x)} ${n2(y)}q${n2(len * 0.5 * Math.cos(a))} ${n2(-3 + len * 0.5 * Math.sin(a))} ${n2(len * Math.cos(a))} ${n2(len * Math.sin(a))}`, rng.pick(['#8f7458', '#4a3a30', '#a68a6a']), rng.range(0.9, 1.6));
  }
  s += cel(smooth([[155, 114], [160, 107], [200, 104], [240, 107], [246, 114], [239, 131], [200, 141], [163, 133]]), {
    fill: '#6e5a48', shade: '#4f4034', light: '#8a7058', sx: 0, sy: 4, hx: 0, hy: 1.5, stroke: 2.4, inner: twigs,
  });
  s += fillPath(ellipsePath(200, 109, 37, 5), '#2e2430');
  // Chicks asking for breakfast.
  const chick = (x: number, y: number): string =>
    cel(ellipsePath(x, y, 6.5, 6), { fill: '#8a7a6c', shade: '#6a5c50', light: '#a69686', sx: 1.5, sy: 1.5, hx: 1, hy: 1, stroke: 1.6, over: line(`M${x - 3.6} ${y - 0.5}q1.3 1 2.6 0`, INK, 0.9) }) +
    fillPath(poly([[x - 3, y - 4.5], [x - 3.2, y - 11.5], [x + 3.6, y - 11.2], [x + 3, y - 4.5]]), '#c4505a') +
    cel(poly([[x - 4.2, y - 4], [x - 4.4, y - 12.8], [x - 1.2, y - 4.6]]), { fill: '#e8c060', stroke: 1.1 }) +
    cel(poly([[x + 1.4, y - 4.6], [x + 4.8, y - 12], [x + 4.4, y - 4]]), { fill: '#e8c060', stroke: 1.1 });
  s += chick(186, 104) + chick(201, 102.5);
  // The strap: a leather band around the nest and a buckle.
  const strap = smooth([[157, 116.5], [178, 123], [206, 126.5], [232, 123], [245, 116.5], [244, 124], [232, 130.5], [206, 134], [178, 130.5], [160, 124]]);
  s += cel(strap, {
    fill: '#6e4a33', shade: '#51362a', light: '#8c6446', sx: 0, sy: 2, hx: 0, hy: 1, stroke: 1.8,
    over: line('M166 123Q190 130 206 130.5T242 121.5', '#d9c9a8', 0.9, 0.8).replace('/>', ' stroke-dasharray="2.4 2.2"/>') +
      dot(214, 129.6, 1.1, '#2e2430') + dot(222, 128.6, 1.1, '#2e2430') + dot(230, 127, 1.1, '#2e2430'),
  });
  s += line(rrect(172, 119.5, 9, 13, 1.5), INK, 3.6) + line(rrect(172, 119.5, 9, 13, 1.5), '#c9c1ae', 1.8) + line('M176.5 121L176.5 131', '#c9c1ae', 1.4);
  // The watch face hanging on the other half of the strap.
  s += cel(taper([[214, 133], [213, 146], [215, 158]], 7, 6), { fill: '#6e4a33', shade: '#51362a', light: '#8c6446', sx: 1.5, sy: 0, stroke: 1.8 });
  s += cel(rrect(209.5, 156, 11, 5, 1.2), { fill: '#b9a36a', shade: '#8f7d4c', sx: 0, sy: 1.5, stroke: 1.5 });
  s += cel(rrect(226, 170, 4.5, 4.2, 1), { fill: '#b9a36a', shade: '#8f7d4c', sx: 0, sy: 1, stroke: 1.3 });
  s += cel(ellipsePath(215, 172, 13, 13), { fill: '#b9a36a', shade: '#8f7d4c', light: '#dcc98f', sx: 2, sy: 2, hx: 1, hy: 1, stroke: 2 });
  let dial = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r0 = i % 3 ? 8.4 : 7.4;
    dial += line(`M${n2(215 + Math.sin(a) * r0)} ${n2(172 - Math.cos(a) * r0)}L${n2(215 + Math.sin(a) * 9.6)} ${n2(172 - Math.cos(a) * 9.6)}`, INK, i % 3 ? 0.8 : 1.3);
  }
  const hand = (deg: number, len: number, w: number): string => {
    const a = (deg * Math.PI) / 180;
    return line(`M215 172L${n2(215 + Math.sin(a) * len)} ${n2(172 - Math.cos(a) * len)}`, INK, w);
  };
  s += cel(ellipsePath(215, 172, 10.2, 10.2), { fill: P.ivory, shade: P.ivoryDark, sx: 1.5, sy: 1.5, stroke: 1.4, over: dial });
  s += hand(179, 5.2, 1.8) + hand(354, 8, 1.2) + dot(215, 172, 1.2, INK);
  s += line('M208 166L214 171L211 178', '#fbf6ec', 0.8, 0.7);
  s += cel(taper([[215, 185], [216, 191], [214, 197]], 6, 5), { fill: '#6e4a33', shade: '#51362a', sx: 1.5, sy: 0, stroke: 1.6 });
  // Sparrow perched on the rim, facing the chicks.
  const sp = { fill: P.sparrow, shade: P.sparrowDark, light: P.sparrowLight };
  s += line('M236 103L234 111M242 103L242 111', '#8a6a58', 1.6) + line('M231 111.2h6M239.5 111.2h5.5', '#8a6a58', 1.4);
  s += cel(taper([[256, 95], [270, 88.5], [283, 82]], 9, 6.5), { fill: P.sparrowDark, shade: '#4a3424', sx: 0, sy: 1.5, stroke: 1.8, over: line('M262 92l16 -8', '#4a3424', 1) });
  s += cel(smooth([[221, 92], [226, 84], [238, 80], [252, 84], [262, 91], [268, 96], [262, 100], [248, 104], [232, 104.5], [224, 99]]), {
    ...sp, sx: 2, sy: 3, hx: 1, hy: 1.5, stroke: 2.2,
    over: fillPath(smooth([[220, 92], [229, 95], [244, 101], [250, 106], [232, 106], [223, 100]]), '#dccdb0'),
  });
  s += cel(smooth([[232, 87.5], [246, 84.5], [262, 91.5], [255, 100], [239, 98.5]]), {
    fill: P.sparrow, shade: P.sparrowDark, light: P.sparrowLight, sx: 1.5, sy: 2, hx: 1, hy: 1, stroke: 1.8,
    over: line('M240 89l4 6M246 88l4 6.5M252 89.5l3.5 6M236.5 93.5q9 1 17 5', '#3a2a20', 1.2) + line('M236 91.5q10 -1 20 4', '#e3d6bd', 1.2),
  });
  s += cel(smooth([[216.5, 82], [218.5, 74], [226, 70.5], [234, 73], [237.5, 81], [232.5, 90], [222, 91]]), {
    ...sp, sx: 1.5, sy: 2, hx: 1, hy: 1, stroke: 2.2,
    over: fillPath(smooth([[217, 84], [224, 83], [230, 86], [232, 91], [222, 92]]), '#e3d6bd') + dot(229, 87, 1.8, '#3a2a20', 0.9) + line('M219.5 80.5q4 -1.5 8 0', '#3a2a20', 1.2),
  });
  s += cel(poly([[217, 79.8], [209.5, 82.6], [217, 85.4]]), { fill: '#3a2f2c', shade: '#241c1a', sx: 0, sy: 1, stroke: 1.4 });
  s += dot(221.5, 79.6, 1.6, INK) + dot(222, 79.1, 0.5, '#fff');
  return s;
}

function artDoor(): string {
  const rng = new Rng(1808);
  const W = 320;
  let s = rect(0, 0, W, 200, '#625e55');
  s += rect(0, 0, W, 8, '#57534b') + line('M0 8H320', '#4a463f', 1.5);
  s += specks(rng, 30, [0, 10, W, 130], '#57534b', [0.5, 1.2], [0.3, 0.6]);
  s += rect(0, 132, W, 40, '#56524a') + line('M0 132H320', '#3f3b35', 2) + line('M0 136H320', '#6e695f', 1);
  s += rect(0, 172, W, 28, '#4a463f');
  for (const x of [-60, 0, 60, 120, 180, 240, 300, 360]) s += line(`M${160 + (x - 160) * 0.62} 172L${x} 200`, '#3f3b35', 1.1);
  s += line('M0 182H320M0 192H320', '#3f3b35', 1);
  s += line('M0 172H320', INK, 2);
  // Tall window with blinds; noon light on the floor.
  s += cel(rrect(12, 16, 62, 104, 2), { fill: '#4a463f', shade: '#3a3731', light: '#5e5950', sx: 2, sy: 2, hx: 1, hy: 1, stroke: 2.2 });
  s += rect(19, 23, 48, 90, '#bcc4c8');
  s += fillPath(poly([[19, 113], [19, 92], [27, 92], [27, 84], [38, 84], [38, 96], [47, 96], [47, 80], [58, 80], [58, 90], [67, 90], [67, 113]]), '#969ea4');
  for (let y = 25; y < 60; y += 5) s += rect(19, y, 48, 3, '#8e8b82');
  s += line('M31 23V60M55 23V60', '#6e6a62', 0.8);
  s += line('M43 23V113M19 68H67', '#4a463f', 3);
  s += line('M19 23H67V113H19Z', INK, 1.4);
  s += fillPath(poly([[16, 172], [72, 172], [132, 200], [36, 200]]), '#f3ead6', 0.16);
  s += fillPath(poly([[19, 113], [67, 113], [76, 132], [22, 132]]), '#f3ead6', 0.08);
  s += cel(rrect(16, 140, 54, 26, 2), {
    fill: '#7a766c', shade: '#5f5b53', light: '#918c80', sx: 2, sy: 2, hx: 1, hy: 1, stroke: 2,
    over: line('M24 142V164M31 142V164M38 142V164M45 142V164M52 142V164M59 142V164M66 142V164', '#5f5b53', 1.4),
  });
  // Something in the plaster remembers: faint violet veins round the frame.
  s += stroke([[172, 40], [160, 30], [150, 26], [138, 16]], P.violet, 1.1, 0.4) + stroke([[160, 30], [158, 18], [162, 10]], P.violet, 0.9, 0.35);
  s += stroke([[252, 150], [264, 158], [276, 156], [290, 166]], P.violet, 1.1, 0.4) + stroke([[264, 158], [268, 170]], P.violet, 0.9, 0.35);
  // The office door, closed.
  s += cel(rrect(172, 36, 80, 137, 2), { fill: '#4a3c34', shade: '#382d27', light: '#5e4c42', sx: 3, sy: 0, hx: 1.5, hy: 1, stroke: 2.4 });
  s += cel(rrect(180, 44, 64, 129, 1.5), {
    fill: '#6e5140', shade: '#533c30', light: '#87654f', sx: 4, sy: 0, hx: 1.5, hy: 1.5, stroke: 2.2,
    over: line(rrect(190, 112, 44, 50, 1.5), '#533c30', 1.6) + line(rrect(192.5, 114.5, 39, 45, 1), '#87654f', 1),
  });
  s += cel(rrect(190, 54, 44, 44, 1.5), {
    fill: '#b8b3a3', shade: '#9a9585', light: '#d2cdbd', sx: 2, sy: 2, hx: 1.5, hy: 1.5, stroke: 1.8,
    over: line('M198 60L206 90M210 58L222 94M226 62L230 76', '#d8d3c3', 1.4, 0.7),
  });
  s += cel(rrect(201, 102, 22, 6.5, 1), { fill: '#b3873a', shade: '#8f6a2c', light: '#d9ae54', sx: 1, sy: 1, hx: 0.6, hy: 0.6, stroke: 1.3 });
  s += cel(ellipsePath(235, 124, 3.4, 3.4), { fill: '#b3873a', shade: '#8f6a2c', sx: 1, sy: 1, stroke: 1.4 });
  s += cel(rrect(223, 122.4, 13, 3.2, 1.5), { fill: '#d9ae54', shade: '#b3873a', sx: 0, sy: 1, stroke: 1.3 });
  s += fillPath('M234.2 130a1.4 1.4 0 1 1 1.6 0l0.6 3.4h-2.8Z', INK);
  // Wall clock: just past one.
  s += cel(ellipsePath(286, 58, 19, 19), { fill: '#3e3a34', shade: '#2e2b27', light: '#57524a', sx: 1.5, sy: 1.5, hx: 1, hy: 1, stroke: 2.2 });
  let dial = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r0 = i % 3 ? 12.8 : 11.2;
    dial += line(`M${n2(286 + Math.sin(a) * r0)} ${n2(58 - Math.cos(a) * r0)}L${n2(286 + Math.sin(a) * 14.4)} ${n2(58 - Math.cos(a) * 14.4)}`, INK, i % 3 ? 1 : 1.8);
  }
  s += cel(ellipsePath(286, 58, 15.6, 15.6), { fill: P.ivory, shade: P.ivoryDark, sx: 1.5, sy: 1.5, stroke: 1.6, over: dial });
  const hand = (deg: number, len: number, w: number, c: string): string => {
    const a = (deg * Math.PI) / 180;
    return line(`M${n2(286 - Math.sin(a) * 2)} ${n2(58 + Math.cos(a) * 2)}L${n2(286 + Math.sin(a) * len)} ${n2(58 - Math.cos(a) * len)}`, c, w);
  };
  s += hand(35, 8, 2.6, INK) + hand(60, 12.5, 1.6, INK) + hand(212, 12.5, 0.8, P.stamp) + dot(286, 58, 1.5, INK);
  s += line('M286 39V33', INK, 1.6) + dot(286, 32, 1.8, '#3e3a34');
  // The clerk in his coat, waiting with his briefcase.
  s += fillPath(ellipsePath(148, 172.5, 26, 3.2), '#2e2b26', 0.55);
  const cloth = { fill: '#363644', shade: '#272733', sx: 1.5, sy: 0, stroke: 2 };
  s += cel(rrect(137, 148, 9, 22, 2), cloth) + cel(rrect(148, 148, 9, 22, 2), cloth);
  s += cel(smooth([[134, 172], [134.5, 167], [141, 166], [148, 168.5], [149, 172.5]]), { fill: P.shoe, shade: '#221b1a', light: '#5a4a45', sx: 0, sy: 1, hx: 0, hy: 1, stroke: 1.8 });
  s += cel(smooth([[145, 172], [145.5, 167], [152, 166], [160, 168.5], [161, 172.5]]), { fill: P.shoe, shade: '#221b1a', light: '#5a4a45', sx: 0, sy: 1, hx: 0, hy: 1, stroke: 1.8 });
  const coat = { fill: '#5c524c', shade: '#453d38', light: '#766a62' };
  s += cel(smooth([[132, 80], [140, 74], [153, 74], [160, 80], [163, 100], [165, 126], [167, 152], [150, 155], [130, 153], [128, 126], [127, 100]]), {
    ...coat, sx: -4, sy: 0, hx: 2, hy: 1, stroke: 2.4,
    over: line('M161 84Q160 118 164 152', '#453d38', 1.4) + dot(160.5, 96, 1.2, INK) + dot(161.5, 112, 1.2, INK) + dot(162.5, 128, 1.2, INK) +
      line('M131 110q-1 20 0 40M146 132l10 -1', '#453d38', 1.2),
  });
  s += cel(smooth([[140, 72], [150, 70], [158, 75], [156, 82], [148, 80], [141, 80]]), { ...coat, sx: 1, sy: 1.5, stroke: 1.8 });
  s += cel(smooth([[140, 59], [143, 51.5], [151, 49.5], [158, 53.5], [160, 59], [162.6, 62.6], [160, 64.2], [160.8, 67.4], [157.4, 71.6], [150, 73], [144, 70], [140.5, 65]]), {
    fill: P.skin, shade: P.skinDark, light: P.skinLight, sx: -2.5, sy: 1, hx: 1, hy: 1, stroke: 2.2,
    over: line('M154.5 58.6q2.4 -0.8 4 0', '#6e6a72', 1.4) + line('M155 61.2q1.6 0.8 3 0.2', INK, 1.2) + line('M158 68.2q1.2 0.3 2.4 -0.2', '#7c5046', 1.1),
  });
  s += cel(smooth([[138.6, 61], [140.5, 52.5], [148, 48.4], [156, 50], [158.4, 54.2], [151, 54.6], [147, 58.6], [146, 65], [142.4, 67.4]]), { fill: '#8d8a90', shade: '#6e6a72', sx: -1, sy: 1, stroke: 1.8 });
  s += cel(smooth([[146.5, 59.5], [150, 59], [151, 63.5], [148.5, 66.5], [146, 65]]), { fill: P.skin, shade: P.skinDark, sx: 1, sy: 1, stroke: 1.5 });
  s += cel(limb([147, 82], [150, 128], 12, 10, 0.5), { ...coat, sx: -2, sy: 0, hx: 1.5, hy: 0, stroke: 2.2 });
  s += cel(smooth([[146, 127], [153, 126.5], [154.5, 132], [150, 135], [146.5, 133]]), { fill: P.skin, shade: P.skinDark, sx: 1, sy: 1, stroke: 1.8 });
  s += line('M144.5 138Q146 130 150 130.5Q155 131 156 138', INK, 3.4) + line('M144.5 138Q146 130 150 130.5Q155 131 156 138', '#5a3e2e', 1.6);
  s += cel(rrect(131, 137, 38, 26, 3), {
    fill: '#5a3e2e', shade: '#402b20', light: '#7a5640', sx: 2.5, sy: 2.5, hx: 1.2, hy: 1.2, stroke: 2.2,
    over: line('M131 145H169', '#402b20', 1.4) + rect(147, 143, 6, 5, '#b3873a') + line('M147 143h6v5h-6Z', INK, 1),
  });
  return s;
}

// ============================================================ fragments 200×150
// Pictograms on paper: bold ink, paper tones and one accent colour per station.

const ACC1 = mix(P.stamp, P.crystalOrange, 0.35); // being late: alarm red
const ACC2 = P.fire; // a childhood light
const ACC3 = P.crystalBlue; // tears
const darker = (c: string, t = 0.3): string => mix(c, INK, t);
const paler = (c: string, t = 0.35): string => mix(c, '#ffffff', t);
const IV = '#ece2cf';
const paperFill = { fill: IV, shade: P.paperDark, light: '#f7f0e2', sx: 3, sy: 3, hx: 2, hy: 2, stroke: 4 };

function paper(seed: number): string {
  const rng = new Rng(seed);
  let s = rect(0, 0, 200, 150, P.paper);
  s += specks(rng, 70, [3, 3, 197, 147], P.paperDark, [0.3, 0.9], [0.2, 0.55]);
  s += specks(rng, 16, [3, 3, 197, 147], '#efe6d4', [0.6, 1.4], [0.4, 0.8]);
  s += line(rrect(6.5, 6.5, 187, 137, 7), P.paperDark, 2);
  return s;
}

const accentFill = (c: string): { fill: string; shade: string; light: string } => ({ fill: c, shade: darker(c, 0.28), light: paler(c, 0.3) });

function fragAlarm(): string {
  let s = paper(2101);
  const A = ACC1;
  s += fillPath(ellipsePath(100, 132, 46, 5.5), P.paperDark);
  let c = line('M78 110L68 127M122 110L132 127', INK, 6) + dot(67, 128, 4.4, INK) + dot(133, 128, 4.4, INK);
  c += line('M100 42V28', INK, 4.5) + dot(100, 25, 5, INK);
  c += line('M82 44Q100 22 118 44', INK, 4.5);
  const bell = (x: number, y: number, deg: number): string =>
    `<g transform="translate(${x} ${y}) rotate(${deg})">` +
    cel('M-18 4A18 16 0 0 1 18 4Z', { ...accentFill(A), sx: 3, sy: 0, hx: -2, hy: 2, stroke: 4.2 }) +
    dot(0, -13, 3.6, INK) + `</g>`;
  c += bell(67, 44, -34) + bell(133, 44, 34);
  c += cel(ellipsePath(100, 82, 40, 40), { ...accentFill(A), sx: 5, sy: 5, hx: 3, hy: 3, stroke: 5 });
  let dial = '';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r0 = i % 3 ? 23.5 : 21;
    dial += line(`M${n2(100 + Math.sin(a) * r0)} ${n2(82 - Math.cos(a) * r0)}L${n2(100 + Math.sin(a) * 27)} ${n2(82 - Math.cos(a) * 27)}`, INK, i % 3 ? 2 : 3.2);
  }
  c += cel(ellipsePath(100, 82, 30, 30), { ...paperFill, stroke: 3.5, over: dial });
  const hand = (deg: number, len: number, w: number): string => {
    const a = (deg * Math.PI) / 180;
    return line(`M100 82L${n2(100 + Math.sin(a) * len)} ${n2(82 - Math.cos(a) * len)}`, INK, w);
  };
  c += hand(266, 14, 5) + hand(-12, 21, 3.6) + dot(100, 82, 3.6, A) + ring(100, 82, 3.6, 3.6, INK, 1.8);
  s += `<g transform="rotate(-8 100 82)">${c}</g>`;
  s += arcs(62, 42, [27, 36], 3.4, 4.3, INK, 3.6, 1);
  s += arcs(138, 34, [27, 36], -1.25, -0.3, INK, 3.6, 1);
  s += line('M30 70l-9 -3M28 84h-10M32 97l-8 5M170 64l9 -4M173 78h10M168 92l8 5', A, 4);
  return s;
}

// Office shoe, facing +x, heel at the origin, sole on y = 0.
const SHOE: MPt[] = [[0, -13], [-2.5, -5], [0.5, 0, 1], [30, 0], [37.5, -3.5], [35, -10], [26, -13], [14, -18], [5, -19.5]];

function fragShoes(): string {
  let s = paper(2102);
  const A = ACC1;
  s += line('M16 40H48M22 56H58M14 72H42', A, 5);
  s += line('M12 128H70M84 128H188', INK, 3.5);
  const puff = (x: number, y: number, r: number): string =>
    cel(smooth([[x - r, y + r * 0.4], [x - r * 0.8, y - r * 0.5], [x - r * 0.1, y - r], [x + r * 0.7, y - r * 0.6], [x + r, y + r * 0.3], [x, y + r * 0.6]]), { ...paperFill, stroke: 2.8 });
  s += puff(28, 120, 8) + puff(16, 111, 5.5) + puff(44, 124, 5);
  const cloth = { fill: '#8f8574', shade: '#6d6455', light: '#a69d8b', sx: 3.5, sy: 0, hx: 2, hy: 0, stroke: 4.5 };
  const sock = { ...accentFill(A), sx: 2, sy: 0, stroke: 4 };
  const shoe = { fill: P.shoe, shade: '#221b1a', light: '#7a6a60', sx: 0, sy: 4, hx: 2, hy: 2, stroke: 4.5 };
  const welt = (ox: number, oy: number, rot: number): string =>
    line(open(xf([[4, -4], [20, -4.5], [34, -6]], ox, oy, 1.7, rot)), '#7a6a60', 2.4) + line(open(xf([[12, -15], [18, -12.5], [22, -14]], ox, oy, 1.7, rot)), '#7a6a60', 2);
  // Back foot pushing off the ground, heel up.
  s += cel(limb([61, 58], [56, 82], 18, 17, 0), sock);
  s += cel(mixed(xfm(SHOE, 30, 98, 1.7, 0.55)), { ...shoe, over: welt(30, 98, 0.55) });
  s += cel(taper([[92, -12], [77, 26], [63, 60]], 34, 31), { ...cloth, over: line('M84 0Q76 28 68 50', '#6d6455', 2.2) });
  // Front foot swinging forward, toe up.
  s += cel(limb([115, 62], [111, 88], 18, 17, 0), sock);
  s += cel(mixed(xfm(SHOE, 111, 118, 1.7, -0.3)), { ...shoe, over: welt(111, 118, -0.3) });
  s += cel(taper([[106, -12], [114, 28], [115, 64]], 34, 31), { ...cloth, over: line('M112 0Q118 30 118 54', '#6d6455', 2.2) });
  s += line('M176 76l10 -5M180 90l12 -1', INK, 3.2);
  return s;
}

function fragCloseDoor(): string {
  let s = paper(2103);
  const A = ACC1;
  s += fillPath(poly([[121, 129], [132, 129], [182, 146], [142, 146]]), A, 0.4);
  s += line('M16 129H184', INK, 3.5);
  s += cel(rrect(56, 12, 88, 121, 3), { fill: P.paperDark, shade: darker(P.paperDark, 0.18), light: '#cabda4', sx: 3, sy: 0, hx: 2, hy: 2, stroke: 4.5 });
  s += rect(64, 20, 72, 110, A);
  s += fillPath(poly([[64, 20], [136, 20], [136, 30], [64, 30]]), darker(A, 0.2));
  s += cel(poly([[64, 20], [122, 25], [122, 125], [64, 130]]), {
    ...paperFill, sx: 4, sy: 0, hx: 2.5, hy: 2,
    over: line(poly([[72, 34], [114, 36.5], [114, 72], [72, 72]]), P.paperDark, 3) + line(poly([[72, 82], [114, 82], [114, 114], [72, 118]]), P.paperDark, 3) +
      rect(80, 42, 26, 8, P.paperDark) + line('M80 42h26v8h-26Z', INK, 2),
  });
  s += cel(ellipsePath(112, 80, 4.5, 4.5), { ...accentFill(A), sx: 1, sy: 1, stroke: 2.8 });
  s += line('M64 20V130', INK, 4.5);
  s += line('M148 44Q158 70 148 98', INK, 3.5) + line('M160 36Q174 70 160 106', INK, 3.5);
  s += line('M128 16l4 -8M138 18l8 -6M142 26l9 -1', INK, 3.2);
  s += line('M100 138Q124 142 132 132', INK, 3) + fillPath(poly([[134, 128], [134, 136], [127, 133]]), INK);
  return s;
}

function fragCandle(): string {
  let s = paper(2201);
  const A = ACC2;
  s += glow(96, 38, 48, A, 0.6);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    s += line(`M${n2(96 + Math.cos(a) * 25)} ${n2(38 + Math.sin(a) * 25)}L${n2(96 + Math.cos(a) * 33)} ${n2(38 + Math.sin(a) * 33)}`, darker(A, 0.15), 3);
  }
  // Candle in its dish.
  s += cel(rrect(88, 50, 16, 48, 3), {
    ...paperFill, sx: 4, sy: 0, hx: 2, hy: 0,
    over: fillPath('M88 50H104V56Q101 62 99 56Q97 64 94 56Q92 60 88 58Z', '#f8f2e6') + line('M88 57Q92 61 94 56.5Q97 64 99 56.5Q101 62 104 56', P.paperDark, 2),
  });
  s += line('M96 50V43', INK, 2.8);
  s += cel(smooth([[96, 14], [103, 30], [101.5, 41], [96, 45], [90.5, 41], [89, 30]]), {
    ...accentFill(A), sx: 2, sy: 0, hx: -1.5, hy: 1, stroke: 3.6, over: fillPath(smooth([[96, 28], [99, 36], [96, 42], [93, 36]]), P.fireLight),
  });
  // The old hand, palm up, offering it from the left.
  s += cel(smooth([[-8, 100], [22, 100], [42, 104], [62, 106], [84, 107], [102, 106], [114, 103], [122, 97], [128, 95], [131, 99], [127, 107], [118, 115], [100, 120], [76, 123], [50, 124], [24, 126], [-8, 128]]), {
    ...paperFill, sx: 0, sy: 4, hx: 1.5, hy: 2,
    over: line('M30 104q5 8 0 17M38 104q5 8 0 18M114 107q6 -2 9 -7M108 111q7 -2 12 -8M101 114q8 -2 13 -8', P.paperDark, 2.2) +
      dot(52, 113, 2.4, P.paperDark) + dot(62, 117, 1.8, P.paperDark) + dot(46, 119, 1.5, P.paperDark),
  });
  s += cel(ellipsePath(96, 100, 30, 7.5), { ...paperFill, sx: 0, sy: 3, stroke: 4 });
  s += cel(smooth([[60, 107], [64, 98], [70, 92], [76, 91], [78, 95], [72, 101], [68, 108]]), { ...paperFill, sx: 2, sy: 2, stroke: 3.6, over: line('M69 99l4 2', P.paperDark, 1.8) });
  s += cel(smooth([[-8, 94], [16, 93], [20, 112], [16, 132], [-8, 134]]), {
    fill: P.paperDark, shade: darker(P.paperDark, 0.2), sx: 3, sy: 0, stroke: 4, over: line('M3 96L1 132M11 95L9 133', darker(P.paperDark, 0.25), 2),
  });
  // A child's small open hand reaching for the light.
  const kidHand: MPt[] = [
    [-7, 22], [-8.5, 8], [-15, 1], [-19, -5], [-15.5, -7, 1], [-9.5, -2], [-9, -9], [-10.5, -19], [-6.5, -21], [-4.5, -11, 1], [-3.5, -22],
    [0.5, -23], [1, -11, 1], [3, -21], [7, -20], [5.8, -9, 1], [8.8, -15], [12, -13.5], [9.5, -2], [8, 8], [7.5, 22],
  ];
  s += cel(smooth([[210, 150], [196, 136], [176, 124], [168, 118], [176, 108], [186, 114], [204, 124], [210, 128]]), {
    fill: P.paperDark, shade: darker(P.paperDark, 0.2), sx: 2, sy: 2, stroke: 4,
  });
  s += cel(mixed(xfm(kidHand, 160, 104, 1.25, -0.95)), { ...paperFill, sx: 2, sy: 2.5, stroke: 3.4 });
  return s;
}

function fragRoom(): string {
  let s = paper(2202);
  const A = ACC2;
  let room = '';
  room += fillPath(poly([[7, 7], [193, 7], [148, 36], [52, 36]]), darker(P.paperDark, 0.28));
  room += fillPath(poly([[7, 7], [52, 36], [52, 100], [7, 143]]), darker(P.paperDark, 0.16));
  room += fillPath(poly([[193, 7], [148, 36], [148, 100], [193, 143]]), darker(P.paperDark, 0.16));
  room += fillPath(poly([[52, 100], [148, 100], [193, 143], [7, 143]]), P.paperDark);
  room += rect(52, 36, 96, 64, '#d9ceb8');
  room += dot(112, 70, 70, A, 0.16) + dot(112, 70, 46, A, 0.2) + dot(112, 70, 26, A, 0.22);
  room += line('M52 36L7 7M148 36L193 7M52 100L7 143M148 100L193 143', INK, 3);
  room += line(rrect(52, 36, 96, 64, 0), INK, 3.5);
  // Window with the night outside.
  room += cel(rrect(64, 44, 28, 26, 1.5), { fill: '#3a3550', stroke: 3.4, over: line('M78 44V70M64 57H92', INK, 2.6) + dot(71, 50, 1.4, IV) + dot(86, 63, 1, IV) });
  // Little bed along the left wall.
  room += cel(poly([[16, 108], [52, 96], [70, 102], [40, 118]]), { ...paperFill, stroke: 3.2 });
  room += cel(poly([[16, 108], [40, 118], [40, 132], [16, 120]]), { fill: P.paperDark, shade: darker(P.paperDark, 0.2), sx: 2, sy: 0, stroke: 3.2 });
  room += cel(poly([[40, 118], [70, 102], [70, 114], [40, 132]]), { fill: '#cabda4', stroke: 3.2 });
  room += cel(smooth([[46, 99], [56, 96], [62, 99], [52, 103]]), { ...paperFill, stroke: 2.6 });
  // Stool and the candle.
  room += fillPath(ellipsePath(116, 122, 20, 4), darker(P.paperDark, 0.2));
  room += line('M104 104L100 122M128 104L132 122M116 106V124', INK, 3.6);
  room += cel(ellipsePath(116, 103, 17, 4.5), { ...paperFill, stroke: 3.4 });
  room += cel(rrect(111, 84, 10, 18, 2), { ...paperFill, sx: 2.5, sy: 0, stroke: 3 });
  room += line('M116 84V79', INK, 2.2);
  room += glow(116, 72, 20, A, 0.7);
  room += cel(smooth([[116, 62], [120.5, 71], [119, 77], [116, 79], [113, 77], [111.5, 71]]), { ...accentFill(A), sx: 1.5, sy: 0, stroke: 2.8 });
  s += clipTo(rrect(7.5, 7.5, 185, 135, 7), room);
  s += line(rrect(6.5, 6.5, 187, 137, 7), INK, 2.5);
  return s;
}

// Child in a nightgown holding a candle, feet at the origin, facing +x.
const CHILD_HEAD: Pt = [0, -39];
const CHILD_GOWN: Pt[] = [[-5.5, -31], [5, -31], [8.5, -20], [12, -5], [-12, -5], [-9, -20]];
const CHILD_ARM: Pt[] = [[3, -28], [9, -22], [15, -21]];

function childShape(): string {
  return `${ellipsePath(CHILD_HEAD[0], CHILD_HEAD[1], 7.5, 7.5)}${smooth(CHILD_GOWN)}${taper(CHILD_ARM, 5, 4)}${smooth([[-8, -44], [-4, -48], [2, -47.5], [6, -44], [0, -45]])}`;
}

function fragShadow(): string {
  let s = paper(2203);
  const A = ACC2;
  s += fillPath('M7 124H193V143H7Z', P.paperDark, 0.55);
  s += line('M10 124H190', INK, 3.5);
  const shape = childShape();
  s += `<g transform="translate(56 124) skewX(-12) scale(2.6)"><path d="${shape}" fill="#6d6252" opacity="0.62"/></g>`;
  s += `<g transform="translate(70 124) skewX(-7) scale(1.75)"><path d="${shape}" fill="#6d6252" opacity="0.3"/></g>`;
  const kid = `<g transform="translate(94 124) scale(1.3)">` +
    fillPath(ellipsePath(0, 0, 15, 2.4), darker(P.paperDark, 0.2)) +
    cel(ellipsePath(-4, -2, 3.6, 2.4), { fill: IV, stroke: 2 }) + cel(ellipsePath(4, -2, 3.6, 2.4), { fill: IV, stroke: 2 }) +
    cel(smooth(CHILD_GOWN), { ...paperFill, stroke: 2.6, sx: -2.5, sy: 0, hx: -1, hy: 1 }) +
    cel(ellipsePath(CHILD_HEAD[0], CHILD_HEAD[1], 7.5, 7.5), { ...paperFill, stroke: 2.6, sx: -2, sy: 1, hx: -1, hy: 1 }) +
    cel(smooth([[-8, -44], [-4, -48], [2, -47.5], [6, -44], [0, -45]]), { fill: P.paperDark, stroke: 2.2 }) +
    cel(rrect(13.5, -32, 5, 11, 1.2), { ...paperFill, stroke: 2 }) +
    cel(taper(CHILD_ARM, 5, 4), { ...paperFill, stroke: 2.2 }) +
    glow(16, -38, 18, A, 0.75) +
    cel(smooth([[16, -44], [18.8, -38.5], [17.8, -35], [16, -34], [14.2, -35], [13.2, -38.5]]), { ...accentFill(A), sx: 1, sy: 0, stroke: 2 }) +
    `</g>`;
  s += kid;
  return s;
}

function fragRain(): string {
  let s = paper(2301);
  const A = ACC3;
  s += line('M66 24Q100 44 134 24', INK, 4.5);
  s += line('M74 31l-5 7M86 36l-3 8M100 38v8M114 36l3 8M126 31l5 7', INK, 3);
  s += line('M84 60v10M116 58v12M100 52v6', INK, 3);
  const drop = 'M100 54C103 66 119 78 119 92A19 19 0 0 1 81 92C81 78 97 66 100 54Z';
  s += cel(drop, { ...accentFill(A), sx: 4, sy: 3, hx: 2.5, hy: 2, stroke: 4.5, over: fillPath(smooth([[89, 86], [92, 78], [95, 80], [92, 90]]), paler(A, 0.7)) });
  s += ring(100, 132, 26, 4.5, A, 3.5) + ring(100, 132, 42, 7.5, A, 2.5, 0.7);
  s += fillPath(ellipsePath(100, 132, 26, 4.5), A, 0.25);
  s += dot(70, 122, 2.6, A) + dot(132, 120, 2.2, A) + dot(80, 116, 1.8, A);
  return s;
}

function flowerHead(cx: number, cy: number, r: number, rot: number, petalColor: { fill: string; shade: string; light: string }, n: number, droop = 0): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    const len = r * (1 + (i % 2) * 0.08);
    const bend = droop * Math.sin(a - rot);
    const pts = xf([[0, 0], [len * 0.35, -len * 0.26], [len * 0.9, -len * 0.2 + bend], [len, bend * 1.2], [len * 0.9, len * 0.2 + bend], [len * 0.35, len * 0.26]], cx, cy, 1, a);
    s += cel(smooth(pts), { ...petalColor, sx: 2, sy: 2, hx: 1.5, hy: 1.5, stroke: 3.4 });
  }
  return s;
}

function fragWilt(): string {
  let s = paper(2302);
  const faded = mix(ACC3, P.paperDark, 0.5);
  const petals = { fill: faded, shade: darker(faded, 0.2), light: paler(faded, 0.25), sx: 2, sy: 2, hx: 1.5, hy: 1.5, stroke: 3.4 };
  s += cel(smooth([[30, 134], [60, 122], [100, 118], [140, 122], [170, 134], [100, 140]]), { fill: P.paperDark, shade: darker(P.paperDark, 0.2), sx: 0, sy: 3, stroke: 4 });
  s += cel(taper([[96, 124], [94, 94], [98, 66], [112, 50], [128, 52], [138, 66]], 7, 4.5), { ...paperFill, fill: '#cfc4ad', sx: 2, sy: 0, stroke: 3.8 });
  const leaf = (pts: Pt[]): string => cel(smooth(pts), { fill: '#cfc4ad', shade: P.paperDark, sx: 2, sy: 2, stroke: 3.4 });
  s += leaf([[95, 106], [82, 104], [68, 110], [60, 120], [72, 116], [86, 112]]);
  s += leaf([[97, 96], [108, 98], [118, 106], [122, 118], [112, 110], [100, 104]]);
  // Head hanging down, petals limp.
  const petal = (deg: number, len: number): string =>
    cel(smooth(xf([[0, 0], [len * 0.3, -5], [len * 0.8, -5.5], [len, -1], [len * 0.9, 4], [len * 0.35, 5]], 138, 72, 1, (deg * Math.PI) / 180)), petals);
  s += petal(62, 26) + petal(118, 24) + petal(78, 30) + petal(102, 29) + petal(90, 32);
  s += cel(ellipsePath(138, 70, 6.5, 5.5), { fill: '#b8ab92', shade: darker(P.paperDark, 0.25), sx: 1.5, sy: 1.5, stroke: 3 });
  s += cel(smooth(xf([[0, 0], [6, -4.5], [15, -1], [14, 3], [5, 4]], 150, 114, 1, 0.5)), petals);
  s += cel(smooth(xf([[0, 0], [6, -4.5], [15, -1], [14, 3], [5, 4]], 116, 124, 1, -0.2)), petals);
  s += line('M160 96q2 5 0 9M152 100q1 3 0 6', INK, 2.6);
  return s;
}

function fragBloom(): string {
  let s = paper(2303);
  const petals = accentFill(ACC3);
  s += cel(smooth([[30, 134], [60, 122], [100, 118], [140, 122], [170, 134], [100, 140]]), { fill: P.paperDark, shade: darker(P.paperDark, 0.2), sx: 0, sy: 3, stroke: 4 });
  s += cel(taper([[100, 124], [98, 94], [100, 66]], 7, 5.5), { ...paperFill, fill: '#cfc4ad', sx: 2, sy: 0, stroke: 3.8 });
  const leaf = (pts: Pt[]): string => cel(smooth(pts), { fill: '#cfc4ad', shade: P.paperDark, light: '#e2d8c2', sx: 2, sy: 2, hx: 1, hy: 1, stroke: 3.4 });
  s += leaf([[99, 106], [86, 100], [72, 88], [66, 76], [80, 82], [94, 96]]);
  s += leaf([[100, 96], [112, 88], [126, 80], [136, 70], [128, 88], [110, 100]]);
  s += flowerHead(100, 52, 24, -Math.PI / 2, petals, 8);
  s += cel(ellipsePath(100, 52, 10, 10), { ...paperFill, fill: '#e7d49a', shade: '#c9b273', light: '#f4e6ba', stroke: 3.4, over: dot(97, 49, 1.6, INK) + dot(103, 51, 1.6, INK) + dot(99, 56, 1.6, INK) + dot(104, 56, 1.2, INK) });
  s += line('M58 30l-8 -5M60 44h-10M142 30l8 -5M140 44h10M100 14V6M76 16l-4 -6M124 16l4 -6', INK, 3);
  return s;
}

// ============================================================ portraits 160×160

function portraitBg(seed: number, disc = '#322d4b'): string {
  const rng = new Rng(seed);
  return rect(0, 0, 160, 160, '#2a2640') + dot(80, 80, 70, disc) + specks(rng, 16, [8, 8, 152, 152], '#e6e9f3', [0.4, 0.9], [0.1, 0.35]);
}

function portraitRoot(): string {
  let s = portraitBg(3101);
  const bark = { fill: P.bark, shade: P.barkDark, light: P.barkLight, sx: 2.2, sy: 2, hx: 1.2, hy: 1.2, stroke: 2.8 };
  const br = (pts: Pt[], w0: number, w1: number): string => cel(taper(pts, w0, w1), bark);
  // Branch hair rising up and back from the skull.
  s += br([[62, 60], [48, 46], [36, 36], [26, 22], [24, 10]], 12, 2.4);
  s += br([[36, 36], [24, 38], [14, 32]], 4.2, 1.4);
  s += br([[28, 24], [18, 18]], 3, 1.2);
  s += br([[74, 50], [70, 34], [64, 20], [66, 8]], 11, 2.2);
  s += br([[68, 30], [78, 20], [86, 12]], 4, 1.4);
  s += br([[56, 68], [40, 66], [26, 60], [16, 50], [12, 38]], 10, 2.2);
  s += br([[24, 59], [16, 64], [8, 62]], 3.6, 1.3);
  s += br([[88, 48], [96, 34], [102, 22], [100, 12]], 8, 2);
  s += br([[98, 30], [110, 26], [118, 18]], 3.4, 1.2);
  // Shoulders of bark with violet veins.
  s += cel(smooth([[16, 176], [22, 142], [40, 124], [62, 117], [100, 117], [120, 125], [136, 142], [144, 176]]), {
    fill: P.gortiBark, shade: P.gortiBarkDark, light: P.gortiBarkLight, sx: 6, sy: 2, hx: 2, hy: 2, stroke: 3.2,
    over: line('M72 120Q76 134 70 150Q66 160 70 170M92 122Q96 136 104 146Q112 154 110 170M104 146Q118 144 128 150', P.violet, 1.8) +
      line('M72 120Q76 134 70 150', P.vein, 0.8, 0.8) +
      line('M36 142q6 6 4 16M124 138q-4 8 0 16M52 132l2 6', P.gortiBarkDark, 1.4),
  });
  s += cel(smooth([[62, 104], [94, 104], [98, 124], [78, 130], [58, 124]]), {
    fill: P.gortiBark, shade: P.gortiBarkDark, sx: 4, sy: 0, stroke: 3,
    over: line('M66 106q2 10 -2 18M76 108q-1 10 2 20M88 106q3 8 1 18', P.gortiBarkDark, 1.3),
  });
  // Skull, three-quarter view, veins running from the eye clusters.
  const skull: Pt[] = [[58, 108], [51, 94], [48, 78], [50, 62], [58, 50], [72, 43], [88, 44], [100, 52], [108, 63], [111, 74], [116, 83], [112, 89], [110, 99], [103, 110], [90, 116], [72, 116]];
  const face =
    line(ellipsePath(62, 88, 3.2, 4.4), P.gortiBarkDark, 1.4) + line(ellipsePath(70, 56, 2.2, 3), P.gortiBarkDark, 1.2) +
    line('M56 70q-2 8 2 14M64 102q6 4 12 3', P.gortiBarkDark, 1.3) +
    line('M84 76Q76 86 78 98Q80 106 74 112M84 76Q72 70 64 60M84 76Q92 64 90 52M104 74Q108 88 104 100M104 74L112 70', P.violet, 1.8) +
    line('M84 76Q76 86 78 98M84 76Q92 64 90 52', P.vein, 0.8, 0.9) +
    line('M92 104Q98 101 104 103', P.gortiBarkDark, 1.8) +
    line('M108 78q4 3 5 7', P.gortiBarkDark, 1.3) +
    line('M72 66Q81 59.5 92 63', '#2d1f3f', 4.6) + line('M74 63.8Q82 59 90 61.2', '#b9a3d6', 1, 0.7) +
    line('M98 63.5Q104 60.5 110 62.5', '#2d1f3f', 3.6) +
    fillPath(smooth([[74, 90], [86, 94], [96, 92], [88, 100], [78, 99]]), P.gortiBarkDark, 0.7) +
    line('M56 58q-4 10 -2 20M60 86q-3 8 0 16M84 50q-4 4 -4 9M96 50q4 5 4 10M68 110q6 2 12 1', P.gortiBarkDark, 1.3) +
    line(ellipsePath(96, 56, 1.8, 2.6), P.gortiBarkDark, 1.1);
  s += cel(smooth(skull), { fill: P.gortiBark, shade: P.gortiBarkDark, light: P.gortiBarkLight, sx: 6, sy: 3, hx: 2, hy: 2, stroke: 3.2, over: face });
  for (const [pts, w] of [[[[70, 113], [68, 122], [70, 130]], 3.4], [[[80, 116], [81, 126], [78, 134]], 3.8], [[[92, 114], [95, 123], [94, 131]], 3.2], [[[101, 108], [106, 116], [106, 124]], 2.8]] as const) {
    s += cel(taper(pts.map((p) => [p[0], p[1]] as Pt), w, 1), { fill: P.gortiBark, shade: P.gortiBarkDark, sx: 1, sy: 0, stroke: 2 });
  }
  // The eyes are black hollows.
  s += fillPath(ellipsePath(84, 76, 7.2, 5.6), '#07060b') + fillPath(ellipsePath(104, 74, 4.8, 3.9), '#07060b');
  return s;
}

function portraitAmca(): string {
  let s = portraitBg(3102);
  const skin = { fill: P.skin, shade: P.skinDark, light: P.skinLight };
  const shirt = { fill: P.shirt, shade: P.shirtDark, light: '#d3ceba' };
  s += cel(smooth([[12, 176], [18, 144], [36, 129], [60, 121], [100, 121], [124, 129], [142, 144], [148, 176]]), {
    ...shirt, sx: 6, sy: 0, hx: 2, hy: 2, stroke: 3.2,
    over: line('M80 136V170M38 150q6 8 4 20M122 148q-4 10 -2 22', P.shirtDark, 1.6) + dot(80, 148, 1.8, INK) + dot(80, 162, 1.8, INK),
  });
  s += cel(smooth([[62, 102], [98, 102], [100, 126], [80, 138], [60, 126]]), { ...skin, sx: 5, sy: 0, stroke: 3, over: line('M72 118q8 5 16 0', P.skinDark, 1.4) });
  s += cel(poly([[58, 120], [80, 138], [72, 148], [52, 128]]), { ...shirt, sx: 1.5, sy: 2, stroke: 2.6 });
  s += cel(poly([[102, 120], [80, 138], [88, 148], [108, 128]]), { ...shirt, sx: 1.5, sy: 2, stroke: 2.6 });
  const ear = (flip: boolean): string => {
    const pts = xf([[0, 0], [-6, -3], [-9, 4], [-7, 14], [-1, 17]], flip ? 114 : 46, 70, 1, 0, flip);
    return cel(smooth(pts), { ...skin, sx: 1.5, sy: 1.5, stroke: 2.6, over: line(open(xf([[-3, 2], [-5.5, 7], [-3, 12]], flip ? 114 : 46, 70, 1, 0, flip)), P.skinDark, 1.4) });
  };
  const eye = (cx: number): string =>
    fillPath(smooth([[cx - 7.5, 73], [cx - 3.5, 70.2], [cx + 3.5, 70.2], [cx + 7.5, 73], [cx + 3.5, 75.6], [cx - 3.5, 75.6]]), '#07060b') +
    fillPath(smooth([[cx - 8.5, 72.4], [cx - 4, 67.5], [cx + 4, 67.5], [cx + 8.5, 72.4], [cx + 4, 72.2], [cx - 4, 72.2]]), P.skinDark) +
    line(open([[cx - 8, 73], [cx - 3.5, 71.8], [cx + 3.5, 71.8], [cx + 8, 73]]), INK, 2) +
    line(open([[cx - 6.5, 77.6], [cx, 79.2], [cx + 6.5, 77.6]]), P.skinDark, 1.3) +
    line(open([[cx - 5, 81], [cx, 82.2], [cx + 5, 81]]), P.skinDark, 1, 0.7);
  const face =
    line('M54 63.5Q63 58.5 73.5 61.5M86.5 61.5Q97 58.5 106 63.5', '#3b3740', 4.6) +
    eye(64) + eye(96) +
    line('M78 70Q76 80 75.5 87', P.skinDark, 1.6) +
    line('M70 88Q73 93.5 80 94.5Q87 93.5 90 88', INK, 2) + line('M74.5 90.6q1.5 1 3 0.4M82.5 91q1.5 0.6 3 -0.4', INK, 1.4) +
    line('M70 94Q66.5 100 66.5 106M90 94Q93.5 100 93.5 106', P.skinDark, 1.6) +
    line('M70.5 103.4Q80 101.6 89.5 103.4', '#7c5046', 2.4) + line('M75 107q5 1.4 10 0', P.skinDark, 1.3) +
    line('M74 112.5q6 1.6 12 0', P.skinDark, 1.1) +
    line('M63 49.5Q80 46.5 97 49.5M67 55Q80 53 93 55', P.skinDark, 1.3) +
    line('M53.5 55Q56 61 53.5 67Q52.5 72 55 77', P.violet, 1.5, 0.8) +
    fillPath(ellipsePath(70, 42, 9, 4), '#f1d2b6', 0.7);
  s += cel(smooth([[47, 74], [48, 54], [58, 38.5], [80, 31.5], [102, 38.5], [112, 54], [113, 74], [111, 92], [104, 106], [92, 115], [80, 118], [68, 115], [56, 106], [49, 92]]), {
    ...skin, sx: 6, sy: 3, hx: 2.5, hy: 2.5, stroke: 3.2, over: face,
  });
  const fringe = { fill: '#9a969e', shade: '#77737e', light: '#b4b0b8', sx: 1.2, sy: 1.2, hx: 0.8, hy: 0.8, stroke: 2.2 };
  const side = (flip: boolean): string => {
    const o = (pts: Pt[]): Pt[] => xf(pts, flip ? 160 : 0, 0, 1, 0, flip);
    const tuft: MPt[] = [[50.5, 53.5], [53.2, 60], [52.2, 68], [49.5, 73, 1], [47.4, 70.4], [45, 74.6, 1], [43.2, 70.6], [40.6, 72.4, 1], [40.6, 65], [43.6, 58]];
    return cel(mixed(xfm(tuft, flip ? 160 : 0, 0, 1, 0, flip)), {
      ...fringe, over: line(open(o([[47.5, 58], [48, 66]])), '#77737e', 1.1) + line(open(o([[44, 62], [44.5, 68]])), '#77737e', 1.1),
    });
  };
  s += side(false) + side(true);
  s += ear(false) + ear(true);
  return s;
}

function portraitCoward(): string {
  let s = portraitBg(3103);
  s += glow(104, 34, 78, P.fire, 0.28);
  const cloth = { fill: '#5a4d48', shade: '#433834', light: '#8a6e5a', sx: 4, sy: 1, hx: -2, hy: 1 };
  // Ragged cloak.
  s += cel(poly([[6, 170], [8, 150], [18, 132], [34, 122], [60, 116], [96, 118], [120, 128], [138, 146], [150, 170]]), {
    ...cloth, stroke: 3,
    over: cel(rrect(26, 140, 22, 18, 2), { fill: '#6e5a48', shade: '#554536', sx: 1.5, sy: 1.5, stroke: 1.8 }) +
      line('M29 143l3 3M35 143l3 3M41 143l3 3M29 153l3 3M35 153l3 3M41 153l3 3', '#d5ccb8', 1, 0.7) +
      line('M64 126l-6 20M88 126l4 22M126 140l-8 14', '#433834', 1.6),
  });
  s += fillPath(poly([[10, 150], [16, 158], [22, 148], [28, 160], [34, 150], [40, 162], [8, 164]]), '#2a2640');
  // Hood with torn edges round the face.
  s += cel(poly([[24, 120], [26, 96], [30, 80], [38, 64], [52, 50], [70, 45], [88, 50], [99, 64], [103, 84], [102, 104], [96, 116], [84, 124], [52, 126]]), {
    ...cloth, stroke: 3, over: line('M44 58Q36 76 38 100M92 58Q98 76 96 98', '#433834', 1.6),
  });
  s += fillPath(smooth([[40, 96], [42, 76], [52, 62], [68, 58], [84, 64], [92, 80], [92, 100], [84, 114], [66, 118], [48, 112]]), '#231c2a');
  s += line('M42 80l-5 3 4 3M44 104l-6 2 5 4M90 76l6 1 -4 4M91 100l6 3 -5 3M60 60l-1 -6 4 4M76 60l3 -5 1 6', '#433834', 2);
  // Face lit by the torch from the right.
  // Black eyes under high, frightened brows.
  const face =
    fillPath(ellipsePath(57, 84, 6.6, 7.8), '#07060b') + fillPath(ellipsePath(75.5, 84, 5.9, 7.6), '#07060b') +
    cel('M47.5 76.5Q53 72.5 61.5 68.2L62.6 71.4Q55 74.4 49.2 79.4Z', { fill: '#3d3438', shade: INK, sx: 0.6, sy: 0.6, stroke: 1.4 }) +
    cel('M70 68.2Q77.5 71.6 83 75.8L81.6 78.6Q76.4 75.4 69.2 71.4Z', { fill: '#3d3438', shade: INK, sx: 0.6, sy: 0.6, stroke: 1.4 }) +
    line('M59.5 101Q62.5 98.8 65.5 101Q68.5 103 71.5 100.6', INK, 1.7) +
    line('M52 94q3 2 6 1M74 94q3 1.6 5.6 0', '#958aa6', 1.2);
  s += cel(smooth([[46, 88], [49, 74], [59, 65], [74, 65.5], [84, 74], [86, 90], [81, 104], [69, 111], [56, 108], [48, 100]]), {
    fill: '#b8aec6', shade: '#958aa6', light: '#e8c49c', sx: 3, sy: 2, hx: -2.2, hy: 0.6, stroke: 2.6, over: face,
  });
  s += cel('M45.5 70.5Q48.5 75.5 45.5 78.5Q42.5 75.5 45.5 70.5Z', { fill: P.crystalBlueLight, stroke: 1.4 });
  // Oversized torch clutched in both hands.
  s += cel(taper([[114, 168], [110, 118], [106, 66]], 10, 8.5), {
    fill: '#7a5a44', shade: '#5c4232', light: '#98765c', sx: 2, sy: 0, hx: -1, hy: 0, stroke: 2.6,
    over: line('M110 150l2 -12M108 100l1 -10', '#5c4232', 1.2),
  });
  const sleeve = { ...cloth, stroke: 2.6 };
  s += cel(taper([[64, 128], [84, 122], [104, 114]], 18, 14), sleeve);
  s += cel(taper([[70, 152], [90, 146], [108, 140]], 18, 14), sleeve);
  const fist = (x: number, y: number): string =>
    cel(smooth([[x - 7, y - 6], [x + 1, y - 8.5], [x + 8.5, y - 5], [x + 9, y + 3], [x + 4, y + 8], [x - 5, y + 7.5], [x - 8.5, y + 1]]), {
      fill: '#b8aec6', shade: '#958aa6', light: '#e8c49c', sx: 1.5, sy: 1.5, hx: -1.5, hy: 0.5, stroke: 2.4,
      over: line(`M${x + 1} ${y - 7}q2.4 3 2 7M${x + 5} ${y - 5}q2 3 1.4 6.4M${x - 3} ${y - 7}q2.4 3 2 7`, '#958aa6', 1.1),
    });
  s += fist(108, 113) + fist(110, 139);
  s += cel(smooth([[98, 70], [96, 56], [100, 50], [112, 50], [116, 56], [114, 70], [106, 74]]), {
    fill: '#6e5a48', shade: '#554536', light: '#8a7058', sx: 2, sy: 1, hx: -1, hy: 1, stroke: 2.6,
    over: line('M97 58Q106 62 116 57M97 64Q106 68 115.5 63', '#554536', 1.4),
  });
  // The big flame.
  s += glow(106, 30, 40, P.fireLight, 0.55);
  s += cel(smooth([[106, 2], [112, 12], [124, 22], [124, 36], [118, 48], [106, 54], [94, 49], [87, 38], [88, 24], [96, 18], [99, 8]]), {
    fill: P.crystalOrange, shade: P.crystalOrangeDark, sx: -2, sy: 0, stroke: 2.8,
    over: fillPath(smooth([[106, 16], [114, 26], [116, 38], [108, 48], [98, 46], [94, 36], [99, 28]]), P.fire) +
      fillPath(smooth([[106, 30], [110, 38], [106, 46], [101, 41]]), P.fireLight),
  });
  return s;
}

function portraitMech(): string {
  let s = portraitBg(3104, '#2f2d3e');
  const metal = { fill: P.metal, shade: P.metalDark, light: P.metalLight };
  const bone = { fill: P.bone, shade: '#b1a791', light: '#ece6d8', sx: 1.5, sy: 1.5, hx: 1, hy: 1, stroke: 2.2 };
  // Shoulders and segmented neck braced with bone.
  s += cel(smooth([[10, 176], [16, 146], [40, 132], [120, 132], [144, 146], [150, 176]]), {
    ...metal, sx: 5, sy: 2, hx: 2, hy: 2, stroke: 3.2,
    over: line('M40 132Q52 150 48 176M120 132Q108 150 112 176M16 156H144', P.metalDark, 1.8) + dot(46, 142, 1.6, P.metalLight) + dot(114, 142, 1.6, P.metalLight),
  });
  for (let i = 0; i < 3; i++) s += cel(rrect(62 - i * 3, 112 + i * 9, 36 + i * 6, 11, 3), { ...metal, sx: 3, sy: 1, stroke: 2.6 });
  s += cel(limb([60, 116], [52, 140], 6, 5, 0), bone) + cel(limb([100, 116], [108, 140], 6, 5, 0), bone);
  // Head: riveted plates.
  const rivets = [[52, 58], [64, 55.5], [96, 55.5], [108, 58], [80, 28], [80, 44], [50, 96], [110, 96], [66, 30.5], [94, 30.5]]
    .map(([x, y]) => dot(x!, y!, 1.5, '#8a93a6') + ring(x!, y!, 1.5, 1.5, INK, 0.7)).join('');
  const plates =
    fillPath('M40 54Q80 46 120 54L120 64Q80 56 40 64Z', P.metalDark) +
    line('M40 54Q80 46 120 54M40 64Q80 56 40 64M40 64Q80 56 120 64', INK, 1.6) +
    line('M80 22V50M48 96Q80 104 112 96M58 34Q70 44 66 54M102 34Q90 44 94 54', INK, 1.4) + rivets;
  s += cel(smooth([[40, 72], [42, 48], [56, 30], [80, 21], [104, 30], [118, 48], [120, 72], [116, 94], [106, 112], [94, 121], [80, 124], [66, 121], [54, 112], [44, 94]]), {
    ...metal, sx: 6, sy: 3, hx: 2.5, hy: 2.5, stroke: 3.4, over: plates,
  });
  // Bone struts: temples, cheekbones, a ribbed jaw.
  s += cel(taper([[46, 88], [42, 70], [46, 48], [56, 34]], 5, 3.4), bone) + cel(taper([[114, 88], [118, 70], [114, 48], [104, 34]], 5, 3.4), bone);
  s += cel(limb([48, 90], [70, 100], 7, 5, 0), bone) + cel(limb([112, 90], [90, 100], 7, 5, 0), bone);
  s += cel(rrect(62, 101, 36, 5, 2), bone);
  for (const x of [66, 73, 80, 87, 94]) s += cel(limb([x, 104], [x, 117], 4.6, 4, 0), bone);
  s += line('M76.5 86v5M83.5 86v5', INK, 2);
  // Key eye.
  const brass = { fill: P.sun, shade: P.sunDark, light: P.sunLight, sx: 1.5, sy: 1.5, hx: 1, hy: 1, stroke: 2.2 };
  s += cel(`M44 70.5H57V75.5H53V81H50V75.5H48V79H45V75.5H44Z`, brass);
  s += cel(ellipsePath(64, 73, 9.5, 9.5), { ...brass, stroke: 2.4 });
  s += dot(64, 73, 5, '#07060b');
  // Keyhole eye: black like the other.
  s += cel(ellipsePath(96, 74, 11, 13), { ...brass, fill: P.metalDark, shade: '#23272f', light: P.metalLight, stroke: 2.4 });
  s += fillPath('M96 64.5A5 5 0 0 1 98.6 73.8L100.2 83.5H91.8L93.4 73.8A5 5 0 0 1 96 64.5Z', '#07060b');
  // Riveted steel brows, set hard.
  const steel = { fill: '#343945', shade: INK, light: P.metalLight, sx: 0.8, sy: 0.8, hx: 0.6, hy: 0.6, stroke: 1.8 };
  s += cel('M50 59.5L73 62.5L72.2 66.8L49.4 64.2Z', steel) + cel('M86 62.8L107 58.8L108 63.4L87.2 67Z', steel);
  s += dot(53, 62, 1, P.metalLight) + dot(104.4, 61.4, 1, P.metalLight);
  return s;
}

function portraitHorse(): string {
  const rng = new Rng(3105);
  let s = portraitBg(3105);
  const barkC = { fill: P.bark, shade: P.barkDark, light: P.barkLight, sx: 2, sy: 1.5, hx: 1, hy: 1, stroke: 2.4 };
  const root = (pts: Pt[], w0: number, w1: number): string => cel(taper(pts, w0, w1), barkC);
  // Root mane behind the neck.
  s += root([[118, 58], [134, 72], [144, 92], [150, 114], [152, 138]], 8, 2);
  s += root([[126, 80], [142, 98], [152, 120], [156, 146]], 7, 1.8);
  // Ears.
  s += cel(smooth([[100, 34], [104, 16], [110, 8], [116, 18], [114, 36]]), { fill: P.horseDark, shade: '#472676', sx: 1.5, sy: 1, stroke: 2.6 });
  s += cel(smooth([[88, 36], [90, 18], [96, 8], [102, 20], [102, 38]]), { fill: P.horse, shade: P.horseDark, light: P.horseLight, sx: 2, sy: 1, hx: 1, hy: 1, stroke: 2.6, over: line('M94 30q2 -10 3 -16', P.horseDark, 1.4) });
  // Head and neck of soil and liquid.
  const cracks = (d: string): string => line(d, P.violetDark, 3.4) + line(d, P.vein, 1.5);
  let over = '';
  for (let i = 0; i < 14; i++) over += fillPath(ellipsePath(rng.range(40, 140), rng.range(30, 160), rng.range(2, 5), rng.range(1.5, 3.5)), P.horseDark, 0.6);
  over += specks(rng, 24, [30, 30, 150, 160], P.horseLight, [0.6, 1.4], [0.5, 0.9]);
  over += line('M100 72Q108 92 98 116', P.horseDark, 2);
  over += cracks('M84 64L76 78L80 90L70 104L73 116') + cracks('M70 44L62 54L64 62') + cracks('M122 98L116 114L124 128L118 146') + cracks('M100 86L108 96L104 106');
  over += glow(76, 90, 14, P.vein, 0.5) + glow(120, 124, 14, P.vein, 0.5);
  s += cel(smooth([[98, 32], [84, 33], [70, 41], [56, 58], [44, 78], [36, 97], [29, 112], [25.5, 122], [26, 130], [31, 135.5], [38, 137], [42, 141], [50, 141.5], [58, 136], [68, 128], [82, 124.5], [96, 124], [104, 132], [110, 150], [112, 176], [158, 176], [150, 136], [140, 104], [128, 70], [112, 42]]), {
    fill: P.horse, shade: P.horseDark, light: P.horseLight, sx: 6, sy: 3, hx: 2.5, hy: 2.5, stroke: 3.2, over,
  });
  // Nostril, mouth, drips.
  s += fillPath(smooth([[32, 114], [36, 109], [40, 111], [37, 117]]), '#2e1a4d') + line('M33.5 115Q37 111 39 112', P.vein, 1.2);
  s += line('M27 130Q34 131 40 129', INK, 2);
  const drip = (x: number, y: number, len: number): string =>
    cel(`M${x - 2.4} ${y}Q${x - 1.4} ${y + len * 0.55} ${x - 2.2} ${y + len - 1.6}A3 3 0 1 0 ${x + 2.2} ${y + len - 1.6}Q${x + 1.4} ${y + len * 0.55} ${x + 2.4} ${y}Z`, {
      fill: P.horse, shade: P.horseDark, light: P.horseLight, sx: 1, sy: 0, hx: -0.8, hy: 0, stroke: 2, over: dot(x - 0.8, y + len * 0.6, 0.8, '#e9dbff'),
    });
  s += drip(48, 139, 12) + drip(80, 123, 9) + drip(62, 132, 7);
  s += cel(`M60 152Q57 156 60 159Q63 156 60 152Z`, { fill: P.horseLight, stroke: 1.6 });
  // Luminous eye.
  s += fillPath(smooth([[72, 58], [80, 53], [90, 56], [84, 63], [76, 64]]), '#2e1a4d');
  s += glow(81, 58.5, 14, P.vein, 0.7);
  s += fillPath(smooth([[75, 58.5], [80.5, 55.5], [87, 57.5], [82.5, 61.5], [77.5, 61.5]]), P.vein) + dot(81.5, 58.5, 1.6, '#fbf5ff');
  s += line('M71 56Q80 49 92 55', INK, 2.2);
  // Root forelock and crest.
  s += root([[104, 30], [118, 36], [130, 48], [140, 64], [146, 84]], 9, 2.2);
  s += root([[108, 44], [124, 56], [134, 74], [138, 96]], 7, 2);
  s += root([[98, 32], [88, 38], [80, 48]], 6, 1.6);
  s += root([[134, 72], [146, 76], [154, 86]], 3, 1.2) + root([[140, 64], [150, 60], [156, 62]], 2.6, 1);
  return s;
}

function portraitMoon(): string {
  let s = portraitBg(3106, '#2f2b47');
  s += glow(80, 80, 80, P.moonLight, 0.22);
  const crater = (x: number, y: number, r: number): string =>
    cel(ellipsePath(x, y, r, r * 0.86), { fill: P.moon, shade: P.moonDark, light: P.moonLight, sx: -1.6, sy: -1.6, hx: -1, hy: -1, stroke: 1.4, ink: '#7d8298' });
  const contour = '#7d8298';
  let face = crater(34, 58, 6) + crater(122, 96, 8) + crater(106, 128, 5) + crater(46, 124, 5.5) + crater(114, 38, 4) + crater(28, 90, 4) + crater(88, 24, 3.5);
  face +=
    line('M44 50Q80 36 116 50M50 42Q80 30 110 42M56 34Q80 24 104 34', contour, 1.6) +
    line('M42 64Q56 55 72 61M88 61Q104 55 118 64', INK, 2.8) +
    line('M46 72Q58 78 71 72M89 72Q102 78 114 72', INK, 2.8) + line('M50 70.5l-2 5M58 75l-1 5M66 74l1 5M94 74l-1 5M102 75l1 5M110 70.5l2 5', INK, 1.6) +
    line('M44 80Q58 89 73 80M87 80Q102 89 116 80M42 87Q58 98 75 87M85 87Q102 98 118 87', contour, 1.6) +
    line('M80 62Q78 80 77 94M72 98Q78 102.5 86 98', INK, 2.4) + line('M68 66Q65 82 66 96M92 66Q95 82 94 96', contour, 1.5) +
    line('M60 113Q80 109 100 113', INK, 2.8) +
    line('M54 104Q50 116 56 128M106 104Q110 116 104 128M64 124Q80 130 96 124M68 133Q80 138 92 133', contour, 1.6) +
    line('M30 76Q34 100 48 114M130 76Q126 100 112 114M36 74Q40 96 52 108M124 74Q120 96 108 108', contour, 1.4);
  s += cel(ellipsePath(80, 80, 64, 64), { fill: P.moon, shade: P.moonDark, light: P.moonLight, sx: 10, sy: 7, hx: 3, hy: 3, stroke: 3.4, over: face });
  return s;
}

function portraitBabyMoon(): string {
  let s = portraitBg(3107, '#2f2b47');
  s += glow(80, 84, 76, P.moonLight, 0.35);
  s += specks(new Rng(31071), 6, [14, 14, 146, 146], '#f6f7fb', [0.8, 1.4], [0.5, 0.9]);
  const eye = (x: number): string =>
    dot(x, 86, 8.6, '#2a2640') + dot(x - 2.6, 83, 3, '#ffffff') + dot(x + 3, 89.4, 1.3, '#ffffff') + line(`M${x - 8} 74.5Q${x} 71 ${x + 8} 74.5`, '#9ea3b8', 1.6);
  const face =
    dot(96, 44, 3, '#c9cddd') + dot(56, 52, 2.2, '#c9cddd') + dot(110, 112, 2.6, '#c9cddd') + dot(44, 102, 1.8, '#c9cddd') +
    eye(62) + eye(98) +
    fillPath(ellipsePath(52, 101, 8.5, 5), '#eab2bf', 0.65) + fillPath(ellipsePath(108, 101, 8.5, 5), '#eab2bf', 0.65) +
    line('M77 97Q80 99.4 83 97', '#8d92a8', 1.8) +
    line('M73 105Q80 111 87 105', INK, 2.4);
  s += cel(ellipsePath(80, 84, 54, 52), { fill: '#e3e5ef', shade: '#b9bdd0', light: '#f7f8fb', sx: 8, sy: 6, hx: 3, hy: 3, stroke: 3.4, over: face });
  s += line('M80 33Q70 23 77.5 16Q86.5 10.5 90 18.5Q91.5 25.5 84.5 25Q81.5 20.5 85.5 19', INK, 5) + line('M80 33Q70 23 77.5 16Q86.5 10.5 90 18.5Q91.5 25.5 84.5 25Q81.5 20.5 85.5 19', '#c9cddd', 2.4);
  return s;
}

function portraitSun(): string {
  let s = portraitBg(3108, '#342b45');
  s += glow(80, 80, 80, P.sunLight, 0.2);
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 - Math.PI / 2 + 0.11;
    const long = i % 2 === 0;
    const r1 = long ? 73 : 63 - (i % 3) * 2;
    const droop = Math.cos(a) * 0.12;
    const w = long ? 0.13 : 0.1;
    const pt = (r: number, aa: number): Pt => [80 + Math.cos(aa) * r, 80 + Math.sin(aa) * r];
    const tip = pt(r1, a + droop * (Math.sin(a) > 0 ? 1.6 : 1));
    s += cel(smooth([pt(46, a - w * 1.4), pt(56, a - w * 0.9), tip, pt(56, a + w * 0.9), pt(46, a + w * 1.4)], 0.7), {
      fill: P.sun, shade: P.sunDark, light: P.sunLight, sx: 2, sy: 2, hx: 1, hy: 1, stroke: 2.6,
    });
  }
  const channel = (d: string): string => line(d, P.sunDark, 5) + line(d, P.bruise, 1.8) + line(d, '#f8e6b8', 0.8, 0.8);
  const face =
    fillPath(smooth([[48, 76], [52, 66], [62, 63], [73, 67], [76, 77], [70, 86], [58, 87], [50, 83]]), P.bruise, 0.9) +
    fillPath(smooth([[112, 76], [108, 66], [98, 63], [87, 67], [84, 77], [90, 86], [102, 87], [110, 83]]), P.bruise, 0.9) +
    fillPath(smooth([[53, 77], [62, 72.5], [71.5, 77.5], [62, 81.5]]), '#3a2448') + fillPath(smooth([[107, 77], [98, 72.5], [88.5, 77.5], [98, 81.5]]), '#3a2448') +
    dot(62.5, 79, 2.3, INK) + dot(97.5, 79, 2.3, INK) +
    fillPath(smooth([[52, 76.5], [57, 71], [66, 70], [72.5, 76], [62, 74.8]]), P.sunDark) + fillPath(smooth([[108, 76.5], [103, 71], [94, 70], [87.5, 76], [98, 74.8]]), P.sunDark) +
    line('M52 77Q62 73.6 72.4 77M88 77Q98 73.6 108 77', INK, 2.4) +
    line('M49 64Q60 58 71 62M89 62Q100 58 111 64', P.sunDark, 2.6) +
    channel('M58 88Q55 100 57 112Q59 120 62 126') + channel('M102 88Q105 100 103 112Q101 120 98 126') +
    line('M80 76Q78.5 88 77.5 94Q80 97 83 95', P.sunDark, 1.8) +
    line('M70 107Q80 103.5 90 107', INK, 2.4) + line('M74 111q6 2 12 0', P.sunDark, 1.4) +
    line('M64 48Q80 43 96 48M68 54Q80 50.5 92 54', P.sunDark, 1.5);
  s += cel(ellipsePath(80, 80, 50, 50), { fill: P.sun, shade: P.sunDark, light: P.sunLight, sx: 7, sy: 5, hx: 3, hy: 3, stroke: 3.4, over: face });
  return s;
}

function portraitWhale(): string {
  const rng = new Rng(3109);
  let s = rect(0, 0, 160, 160, '#223355');
  s += fillPath(poly([[96, -4], [118, -4], [150, 60], [110, 60]]), '#b9d4f2', 0.07) + fillPath(poly([[40, -4], [52, -4], [62, 50], [30, 50]]), '#b9d4f2', 0.05);
  for (let i = 0; i < 9; i++) s += ring(rng.range(20, 120), rng.range(8, 40), rng.range(0.8, 2.2), rng.range(0.8, 2.2), P.crystalBlueLight, 0.8, rng.range(0.35, 0.7));
  let over = '';
  for (let i = 0; i < 26; i++) over += fillPath(ellipsePath(rng.range(-6, 166), rng.range(40, 104), rng.range(1.6, 4.6), rng.range(1, 3)), '#86a4c6', 0.55);
  const mouth: Pt[] = [[-10, 124], [28, 119], [64, 111], [92, 102], [110, 95]];
  over += fillPath(`${open([[-10, 127], [28, 122], [64, 114], [92, 105], [110, 99], [138, 106], [176, 114]])}L176 180L-10 180Z`, '#c3d0df');
  for (let k = 1; k <= 8; k++) {
    over += line(open([[-10, 124 + k * 7.5], [28, 119 + k * 7.8], [64, 111 + k * 8.4], [92, 102 + k * 9], [112, 97 + k * 9.2], [138, 104 + k * 8.4], [176, 112 + k * 7.6]]), '#8ea3bb', 1.4);
  }
  over += line('M20 70Q44 64 60 70M118 50Q136 46 150 54', '#cfdae6', 1.1, 0.7);
  s += cel(smooth([[-12, 46], [30, 36], [80, 33], [124, 38], [150, 48], [174, 64], [174, 176], [-12, 176]]), { ...WHALE_BLUE, sx: 0, sy: 6, hx: 0, hy: 3, stroke: 3.2, over });
  s += line(open(mouth), INK, 3);
  for (const [x, y, r] of [[18, 128, 3], [24, 131, 2.2], [13, 133, 2.4], [30, 127, 1.8], [20, 136, 1.6]] as const) {
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#d5ccb8" stroke="${INK}" stroke-width="0.9"/>`;
  }
  // The old eye.
  s += line('M76 68Q100 58 124 70M80 94Q100 100 120 90', '#3d5a7d', 2.2) + line('M70 62Q100 48 132 64', '#3d5a7d', 1.6, 0.7);
  s += fillPath(smooth([[84, 80], [92, 72], [104, 70.5], [116, 76], [110, 86], [98, 89], [88, 87]]), '#c3d0df');
  s += fillPath(smooth([[88, 80], [95, 74.5], [104, 73.5], [112, 77.5], [107, 84.5], [97, 86.5], [91, 85]]), '#141a2c');
  s += ring(100.5, 80, 5.4, 5.2, '#3b4a6a', 1.6) + dot(97.5, 77.5, 1.8, '#e6f3ff') + dot(104, 83, 0.8, '#e6f3ff', 0.8);
  s += line('M84 80Q96 69 116 76', INK, 2.6) + line('M88 87Q98 90.5 110 86', INK, 1.6);
  return s;
}

// ------------------------------------------------------------------ registry

const MEMORY: Record<string, Draw> = {
  well: artWell,
  toywhale: artToyWhale,
  raccoon: artRaccoon,
  tea: artTea,
  whales: artWhales,
  ice: artIce,
  nest: artNest,
  door: artDoor,
};

const FRAGMENTS: Record<string, Draw> = {
  alarm: fragAlarm,
  shoes: fragShoes,
  closedoor: fragCloseDoor,
  candle: fragCandle,
  room: fragRoom,
  shadow: fragShadow,
  rain: fragRain,
  wilt: fragWilt,
  bloom: fragBloom,
};

const PORTRAITS: Record<string, Draw> = {
  root: portraitRoot,
  amca: portraitAmca,
  coward: portraitCoward,
  mech: portraitMech,
  horse: portraitHorse,
  moon: portraitMoon,
  babymoon: portraitBabyMoon,
  sun: portraitSun,
  whale: portraitWhale,
};

export const MEMORY_ART_KEYS: string[] = Object.keys(MEMORY);
export const FRAGMENT_KEYS: string[] = Object.keys(FRAGMENTS);
export const PORTRAIT_KEYS: string[] = Object.keys(PORTRAITS);

/**
 * The paintings' coloured-pencil grain for pictures shown as DOM images
 * (the atlas gets it at rasterization instead): a tile of short hatch
 * strokes, light and dark, laid over the whole picture.
 */
let grainTileSvg = '';
function grainFilter(w: number, h: number): string {
  if (!grainTileSvg) {
    const rng = new Rng(0x9a17);
    const T = 96;
    const light: string[] = [];
    const dark: string[] = [];
    for (let i = 0; i < 230; i++) {
      const x = rng.range(0, T);
      const y = rng.range(0, T);
      const a = rng.chance(0.75) ? -0.62 + rng.range(-0.18, 0.18) : -1.25 + rng.range(-0.15, 0.15);
      const len = rng.range(4, 14) / 2;
      const dx = Math.cos(a) * len;
      const dy = Math.sin(a) * len;
      for (const ox of [-T, 0, T]) {
        for (const oy of [-T, 0, T]) {
          const x0 = x - dx + ox;
          const y0 = y - dy + oy;
          const x1 = x + dx + ox;
          const y1 = y + dy + oy;
          if (Math.max(x0, x1) < 0 || Math.min(x0, x1) > T || Math.max(y0, y1) < 0 || Math.min(y0, y1) > T) continue;
          (rng.chance(0.6) ? light : dark).push(`M${n2(x0)} ${n2(y0)}L${n2(x1)} ${n2(y1)}`);
        }
      }
    }
    grainTileSvg =
      `<pattern id="pgrain" width="${T}" height="${T}" patternUnits="userSpaceOnUse">` +
      `<path d="${light.join('')}" stroke="#fffdf7" stroke-opacity="0.12" stroke-width="1" stroke-linecap="round" fill="none"/>` +
      `<path d="${dark.join('')}" stroke="#342c3a" stroke-opacity="0.08" stroke-width="1" stroke-linecap="round" fill="none"/>` +
      `</pattern>`;
  }
  return `${grainTileSvg}<rect x="0" y="0" width="${w}" height="${h}" fill="url(#pgrain)" pointer-events="none"/>`;
}

const cache = new Map<string, string>();

function toUrl(svg: string): string {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/** Neutral stand-in for unknown keys: a dark rounded panel. */
function neutral(w: number, h: number): string {
  const r = Math.min(w, h) * 0.08;
  return svgDoc(
    w,
    h,
    `<path d="${rrect(2, 2, w - 4, h - 4, r)}" fill="#e9e3ec" stroke="${INK}" stroke-width="2.2"/>` +
      `<path d="${rrect(10, 10, w - 20, h - 20, r * 0.6)}" fill="none" stroke="#b9b1c4" stroke-width="1.4"/>`,
  );
}

/** Renumbers ids per document so the output does not depend on build order. */
function stableIds(svg: string): string {
  const ids = new Map<string, string>();
  for (const m of svg.matchAll(/id="([^"]+)"/g)) if (!ids.has(m[1]!)) ids.set(m[1]!, `i${ids.size}`);
  return svg.replace(/(id="|url\(#)([^")]+)/g, (all: string, pre: string, id: string) => {
    const r = ids.get(id);
    return r ? pre + r : all;
  });
}

function build(kind: string, table: Record<string, Draw>, key: string, w: number, h: number): string {
  const k = String(key);
  const has = Object.prototype.hasOwnProperty.call(table, k);
  const ck = has ? `${kind}:${k}` : `${kind}:\u0000neutral`;
  const hit = cache.get(ck);
  if (hit) return hit;
  let svg: string;
  try {
    svg = has ? stableIds(svgDoc(w, h, pastelMarkup(table[k]!(), true) + grainFilter(w, h))) : neutral(w, h);
  } catch {
    svg = neutral(w, h);
  }
  const url = toUrl(svg);
  cache.set(ck, url);
  return url;
}

/** 320×200 illustrated vignette for a memory fragment of the journal. */
export function memoryArtUrl(key: string): string {
  return build('memory', MEMORY, key, 320, 200);
}

/** 200×150 pictogram on paper for a memory-station puzzle card. */
export function fragmentArtUrl(key: string): string {
  return build('fragment', FRAGMENTS, key, 200, 150);
}

/** 160×160 portrait, subject centred for a circular crop. */
export function portraitUrl(key: string): string {
  return build('portrait', PORTRAITS, key, 160, 160);
}
