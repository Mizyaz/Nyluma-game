import type { PartArt } from '../../render/2d/rig/rigTypes';
import { LINE, darkOf, lightOf } from '../../render/2d/style';
import { ellipsePath, poly, smooth, taper, type Pt } from '../../render/2d/svg';
import { comic, ink } from '../characters/kit';

// The two pictures on the 14th Room's back wall, after the first painting,
// drawn in the game's comic manner with the characters' kit: coloured
// contours, cel shadows low on the left, glints high on the right.
//
// The portrait: a green creature whose hair is four snake-headed tendrils,
// with pink, heavy-lidded eyes and a finger to its lips, in a sage shirt with
// shoulder pads, on dusty rose. Its slate frame is torn in four places and
// hangs crooked from one nail at its top-left corner; the wall is cracked
// about the nail, and a speck of gold shines beside it.
//
// The sign: a cyan crystal sigil inlaid in a brown panel (a barbed spire
// between two pairs of blades, over an angular base) in a dark frame cracked
// at both sides, hung straight on a wire from a nail.

/** The pictures' colours (chosen by eye). */
const PIC = {
  frame: '#7b7f98',
  canvas: '#cfa6aa',
  glow: '#e6c3c2',
  green: '#7cc067',
  greenDeep: '#5f9e50',
  lips: '#4f8a43',
  eye: '#f7dbe5',
  iris: '#d4529a',
  pupil: '#3b1734',
  tongue: '#e8789f',
  snakeEye: '#f2d36b',
  shirt: '#a9bea0',
  shirtDeep: '#8fa486',
  cloth: '#978c7f',
  hand: '#a89c8b',
  gold: '#f2c84b',
  signFrame: '#5f6476',
  brown: '#9e7f72',
  cyan: '#8ce0dc',
  groove: '#5d4339',
  crack: '#5f5566',
  wallCrack: '#7d7180',
  nail: '#8a8d9c',
  wire: '#6f7384',
} as const;

const n = (v: number): string => (Math.round(v * 100) / 100).toString();
const circle = (x: number, y: number, r: number): string => ellipsePath(x, y, r, r);
const dot = (x: number, y: number, r: number, color: string, o = 1): string => `<path d="${circle(x, y, r)}" fill="${color}"${o !== 1 ? ` opacity="${n(o)}"` : ''}/>`;

/** Points mirrored across the vertical line u = c. */
const mirror = (pts: readonly Pt[], c: number): Pt[] => pts.map(([u, v]) => [2 * c - u, v]);

/** The nail a picture hangs from, round-headed, with its glint. */
function nail(x: number, y: number, r: number): string {
  return comic(circle(x, y, r), PIC.nail, { line: LINE.detail, ink: darkOf(PIC.nail, 0.55), rim: [r * 0.4, -r * 0.3], glint: [-r * 0.18, r * 0.18] }) + dot(x - r * 0.3, y - r * 0.32, r * 0.28, '#ffffff', 0.85);
}

/** A broken piece of a frame: shaded, a light bevel along its lit edges. */
function framePiece(pts: readonly Pt[], color: string): string {
  return comic(poly(pts), color, { line: LINE.small, ink: darkOf(color, 0.55), rim: [1.8, -1.2], glint: [-0.7, 0.7] });
}

/** A crack: a jagged line, darker than what it runs through. */
function crack(pts: readonly Pt[], w: number = LINE.detail, color: string = PIC.crack): string {
  return ink(poly(pts, false), w, color);
}

/** A small four-pointed sparkle. */
function sparkle(x: number, y: number, r: number, o = 0.9): string {
  const k = r * 0.28;
  return `<path d="M${n(x)} ${n(y - r)}Q${n(x + k)} ${n(y - k)} ${n(x + r)} ${n(y)}Q${n(x + k)} ${n(y + k)} ${n(x)} ${n(y + r)}Q${n(x - k)} ${n(y + k)} ${n(x - r)} ${n(y)}Q${n(x - k)} ${n(y - k)} ${n(x)} ${n(y - r)}Z" fill="#ffffff" opacity="${o}"/>`;
}

// ================================================================ the portrait

/** A snake's head at (x, y), facing `deg`, its mouth a little open (a tongue flicking out of some); heads facing left keep their eye on top. */
function snakeHead(x: number, y: number, deg: number, tongue: boolean): string {
  const head = smooth([[-5, -3.6], [1.5, -5.2], [7.5, -3], [11, -0.6], [6, 0.7], [10, 2.6], [1.5, 4.6], [-5, 3.4]]);
  const flip = Math.abs(deg) > 90 ? ' scale(1 -1)' : '';
  let s = tongue ? ink('M8.5 1.2Q12.5 1.4 14.6 0.2M14.6 0.2L16.6 -1.2M14.6 0.2L16.4 1.6', 0.7, PIC.tongue) : '';
  s += comic(head, PIC.green, { line: LINE.detail, rim: [1.4, -1], glint: [-0.45, 0.45], over: ink('M6 0.7L1.5 1.1', LINE.fine, darkOf(PIC.green, 0.5)) });
  s += dot(2.6, -1.9, 1.5, PIC.snakeEye) + `<path d="${ellipsePath(2.75, -1.9, 0.42, 1.15)}" fill="${PIC.pupil}"/>` + ink(circle(2.6, -1.9, 1.5), 0.5, darkOf(PIC.green, 0.55));
  s += dot(9.2, -1.5, 0.45, darkOf(PIC.green, 0.55));
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(deg)})${flip}">${s}</g>`;
}

/** One tendril of its hair: from the head out along `pts`, scaled, ending in a snake's head facing `deg`. */
function tendril(pts: readonly Pt[], deg: number, tongue = false): string {
  const end = pts[pts.length - 1]!;
  // Scales: little chevrons along it, pointing out towards the head.
  let scales = '';
  for (let i = 0; i < pts.length - 2; i++) {
    const [a, b] = [pts[i]!, pts[i + 1]!];
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    const len = Math.hypot(dx, dy) || 1;
    const [ux, uy, nx, ny] = [dx / len, dy / len, -dy / len, dx / len];
    for (const f of [0.3, 0.75]) {
      const [mx, my] = [a[0] + dx * f, a[1] + dy * f];
      const w = 4.2 - i * 0.4;
      scales += ink(`M${n(mx + nx * w)} ${n(my + ny * w)}Q${n(mx + ux * 2.4)} ${n(my + uy * 2.4)} ${n(mx - nx * w)} ${n(my - ny * w)}`, LINE.fine, darkOf(PIC.green, 0.3), 0.85);
    }
  }
  const back = ink(smooth(pts.slice(0, -1), 1, false), 1.4, lightOf(PIC.green, 0.35), 0.7);
  return comic(taper(pts, 13.5, 9), PIC.green, { line: LINE.small, rim: [2.4, -1.4], glint: [-0.6, 0.6], over: scales + back }) + snakeHead(end[0], end[1], deg, tongue);
}

/** An eye: a pink almond, its iris looking out, under a heavy lid with a crease and lashes; `tilt` lets the outer corner droop. */
function eye(cx: number, cy: number, tilt: number, outer: 1 | -1): string {
  const almond = `M${n(cx - 6.2)} ${n(cy)}Q${n(cx)} ${n(cy - 5.4)} ${n(cx + 6.2)} ${n(cy)}Q${n(cx)} ${n(cy + 4.4)} ${n(cx - 6.2)} ${n(cy)}Z`;
  const iris = dot(cx + 0.3, cy + 0.6, 3, PIC.iris) + dot(cx + 0.3, cy + 0.6, 1.4, PIC.pupil) + dot(cx - 0.6, cy - 0.3, 0.7, '#ffffff');
  const lidShade = `M${n(cx - 6.2)} ${n(cy)}Q${n(cx)} ${n(cy - 5.4)} ${n(cx + 6.2)} ${n(cy)}L${n(cx + 6.2)} ${n(cy + 1)}Q${n(cx)} ${n(cy - 2.2)} ${n(cx - 6.2)} ${n(cy + 1.4)}Z`;
  let s = comic(almond, PIC.eye, { line: LINE.detail, ink: darkOf(PIC.green, 0.6), inner: iris, shade: lidShade, tone: '#d8bccb' });
  const lid = `M${n(cx - 7)} ${n(cy + 0.5)}Q${n(cx)} ${n(cy - 7.6)} ${n(cx + 7)} ${n(cy - 0.3)}Q${n(cx)} ${n(cy - 2.4)} ${n(cx - 7)} ${n(cy + 0.5)}Z`;
  s += comic(lid, PIC.green, { line: LINE.detail, ink: darkOf(PIC.green, 0.6), glint: [-0.3, 0.4] });
  s += ink(`M${n(cx - 5.4)} ${n(cy - 4.2)}Q${n(cx)} ${n(cy - 8.4)} ${n(cx + 5.6)} ${n(cy - 4.4)}`, LINE.fine, darkOf(PIC.green, 0.45));
  const ox = cx + outer * 6.4;
  s += ink(`M${n(ox)} ${n(cy - 0.6)}l${n(outer * 1.8)} -1.2M${n(ox - outer * 1.4)} ${n(cy - 2)}l${n(outer * 1.4)} -1.6`, LINE.fine, darkOf(PIC.green, 0.6));
  return `<g transform="rotate(${n(tilt)} ${n(cx)} ${n(cy)})">${s}</g>`;
}

/** The creature: drawn inside the canvas (frame coordinates). */
function creature(): string {
  const green = { line: LINE.small, ink: darkOf(PIC.green, 0.55) };
  let s = '';
  // The tendrils, behind the head.
  s += tendril([[49, 47], [42, 39], [34, 31], [27, 25]], -140, true);
  s += tendril([[65, 46], [73, 39], [82, 35], [89, 37]], 60);
  s += tendril([[44, 57], [34, 51], [25, 52], [19, 58]], 135);
  s += tendril([[72, 57], [82, 52], [90, 56], [93, 63]], 70, true);
  // The neck, the shirt and its collar, its folds.
  s += comic(poly([[52, 80], [63, 80], [64, 98], [51, 98]]), PIC.green, { ...green, rim: [2, -1] });
  const folds = ink('M61 109Q62.5 125 60 146', LINE.detail, darkOf(PIC.shirt, 0.3)) + ink('M75 112Q81 123 78.5 140', LINE.detail, darkOf(PIC.shirt, 0.3)) + ink('M84 108Q86 116 84 124', LINE.detail, darkOf(PIC.shirt, 0.25));
  s += comic(smooth([[48, 95], [36, 98], [29, 104], [31, 120], [36, 136], [37, 154], [85, 154], [88, 136], [91, 120], [92, 105], [82, 97], [68, 95]]), PIC.shirt, { line: LINE.limb, rim: [4, -1.6], hatch: 2.4, glint: [-0.8, 0.8], over: folds });
  s += comic(poly([[49.5, 95.5], [58.5, 106], [67.5, 95.5]]), PIC.shirtDeep, { line: LINE.detail, rim: [1.2, -0.8] });
  // The shoulder pads.
  const pad = (x: number, y: number, deg: number): string =>
    `<g transform="rotate(${deg} ${x} ${y})">${comic(ellipsePath(x, y, 9, 5.4), PIC.cloth, { line: LINE.small, rim: [2.4, -1.4], glint: [-0.6, 0.6], over: ink(`M${x - 6} ${y + 1}Q${x} ${y + 3.4} ${x + 6} ${y + 1}`, LINE.fine, darkOf(PIC.cloth, 0.3)) })}</g>`;
  s += pad(34, 101, -18) + pad(86, 102, 16);
  // The head: wide under the tendrils, narrowing to a long chin; lips behind the finger.
  const head = smooth([[55, 42], [64, 42], [72, 47], [76, 55], [72, 67], [63, 82], [57, 89], [52, 82], [43, 68], [38, 56], [42, 47], [48, 43]]);
  const face = ink('M51 47Q56 44.5 62 47', LINE.detail, darkOf(PIC.green, 0.35)) + dot(44.5, 70, 2.6, PIC.tongue, 0.35) + dot(68.5, 70, 2.6, PIC.tongue, 0.35);
  s += comic(head, PIC.green, { line: LINE.limb, ink: darkOf(PIC.green, 0.55), rim: [4, -1.6], hatch: 2.4, glint: [-0.8, 0.8], over: face });
  s += comic(ellipsePath(56.6, 83.4, 4.2, 1.7), PIC.lips, { line: LINE.fine, ink: darkOf(PIC.lips, 0.5), glint: [-0.3, 0.4] });
  s += eye(48.5, 61, -12, -1) + eye(64, 61.5, 12, 1);
  // Its right arm raised: the sleeve down to the elbow and back up across the chest.
  const cloth = { line: LINE.small, ink: darkOf(PIC.cloth, 0.55), rim: [2.4, -1.2] as [number, number], glint: [-0.6, 0.6] as [number, number] };
  s += comic(taper([[31, 104], [31, 116], [35, 126]], 12, 12), PIC.cloth, cloth);
  s += comic(taper([[35, 126], [43, 112], [52, 99]], 12.5, 9.5), PIC.cloth, { ...cloth, over: ink('M37 117Q41 116 43 119M42 108Q45 108 47 110', LINE.detail, darkOf(PIC.cloth, 0.35)) });
  // The fist, and the finger at its lips.
  s += comic(ellipsePath(55.5, 95, 6.5, 5.6), PIC.hand, { line: LINE.small, ink: darkOf(PIC.hand, 0.55), rim: [1.8, -1.2], glint: [-0.5, 0.5], over: ink('M50.5 93Q53 91.6 55.5 93.6M51 97Q54 95.6 56.5 97.6', LINE.fine, darkOf(PIC.hand, 0.4)) });
  s += comic('M53.8 92V74Q53.8 70.8 56.4 70.8Q59 70.8 59 74V92Z', PIC.hand, { line: LINE.detail, ink: darkOf(PIC.hand, 0.55), rim: [1.2, -0.6], glint: [-0.4, 0.4], over: ink('M54.8 75.5Q56.4 76.6 58 75.5', LINE.fine, darkOf(PIC.hand, 0.4)) });
  return s;
}

/** The portrait in its frame's coordinates (108 × 148; the nail at its top-left corner, 0,0). */
function portraitBody(): string {
  // The canvas, torn where the frame is: a bite at the left, the corners chipped.
  const canvas = poly([
    [3, 2], [26, 2], [31, 8], [35, 5.5], [40, 15], [44.5, 8.5], [48, 11.5], [53, 2.5], [104, 3],
    [104, 17], [93, 22], [99, 25], [92, 28.5], [104.5, 31],
    [104, 129], [96, 134], [100.5, 138], [92, 144.5],
    [42, 145], [37, 139.5], [32.5, 146], [27, 140.5], [22, 145], [1, 145],
    [0, 101], [18, 95], [10.5, 91.5], [16, 88], [3, 82],
  ]);
  // A soft glow behind the head, dry strokes of rose across the ground.
  let ground = dot(58, 64, 40, PIC.glow, 0.55) + dot(58, 62, 26, PIC.glow, 0.6);
  for (const [x, y, len] of [[8, 30, 22], [80, 20, 18], [12, 120, 20], [86, 120, 16], [70, 136, 14], [6, 60, 14]] as const) {
    ground += ink(`M${x} ${y}q${n(len * 0.5)} -3 ${len} -1`, 1.6, darkOf(PIC.canvas, 0.12), 0.7);
  }
  // The frame's shadow falls on the canvas inside its top and right bars.
  let s = comic(canvas, PIC.canvas, { line: LINE.small, ink: darkOf(PIC.canvas, 0.5), inner: ground + creature(), rim: [-3.2, 2.4] });
  // The frame: what is left of it.
  const frame: Pt[][] = [
    // The top-left corner, with the stubs of the top and left bars.
    [[-1, -1], [26, -1], [23, 3.5], [27, 6], [24, 9.5], [9.5, 9.5], [9.5, 79], [6, 82.5], [9, 86], [-1, 86]],
    // The left bar's lower part, knocked out a little, round the corner into the bottom bar.
    [[-7, 101], [-2, 98.5], [3, 102], [3, 138.5], [21, 138.5], [24.5, 142], [21, 145.5], [23.5, 149], [-7, 149]],
    // The bottom bar's right part (the corner beyond it is gone).
    [[42, 138.5], [91, 138.5], [91, 149], [44, 149], [46, 144]],
    // The right bar, from its crack down.
    [[98.5, 30], [102, 33], [105.5, 29], [109, 31.5], [109, 128], [98.5, 128]],
    // The top-right corner, the top bar from where it tore.
    [[53, -1], [109, -1], [109, 16], [105, 19.5], [101.5, 16.5], [98.5, 18.5], [98.5, 9.5], [54, 9.5], [56.5, 5], [52, 2.5]],
  ];
  for (const p of frame) s += framePiece(p, PIC.frame);
  // The cracks running on into the canvas.
  s += crack([[40, 15], [42.5, 20], [39.5, 25], [43, 31], [40.5, 36]], LINE.small);
  s += crack([[92, 28.5], [87, 30], [89, 32.5], [84, 34]]);
  s += crack([[18, 95], [23, 96.5], [21, 98.5], [26.5, 100]]);
  // The nail at the corner, the wall cracked about it.
  s += crack([[0, -2], [-2.5, -8], [-0.5, -12], [-4, -19]], LINE.small, PIC.wallCrack) + crack([[-1.5, -10], [-6, -12.5]], LINE.detail, PIC.wallCrack);
  s += crack([[2.5, -2], [7, -8], [5.5, -12], [11, -17]], LINE.small, PIC.wallCrack) + crack([[6, -11], [10.5, -10]], LINE.detail, PIC.wallCrack);
  s += nail(1, 1, 2.8);
  // A speck of gold beside the frame, catching the light.
  s += comic(smooth([[100, -8], [104.5, -9.5], [108, -5.5], [105.5, -1], [100.5, -2.5]]), PIC.gold, { line: LINE.detail, ink: darkOf(PIC.gold, 0.45), rim: [1.2, -0.8], glint: [-0.5, 0.5] }) + sparkle(107, -9, 3.2);
  return s;
}

/** The green creature's portrait, crooked on its nail. */
export function portrait(): PartArt {
  return { key: 'p1.picture', w: 154, h: 200, px: 77, py: 100, body: `<g transform="translate(36 29) rotate(8.5)">${portraitBody()}</g>`, scale: 1 };
}

// ================================================================ the sign

/** A shape of the sigil: cyan crystal set in a channel cut into the panel. */
function inlay(pts: readonly Pt[]): string {
  const d = poly(pts);
  return ink(d, 3.4, PIC.groove) + comic(d, PIC.cyan, { line: LINE.detail, ink: darkOf(PIC.cyan, 0.6), rim: [2.2, -1.4], glint: [-0.7, 0.7], lightFill: '#ecfffd' });
}

/** The cyan sigil, symmetric about u = 59 (frame coordinates). */
function sigil(): string {
  const C = 59;
  // The spire: barbed twice down each side, standing on two feet with a bay between them.
  const spireL: Pt[] = [[59, 15], [56, 25], [53, 37], [51, 44], [54, 46.5], [48, 53], [46, 63], [44, 70], [47.5, 72.5], [41, 80], [39, 92], [37.5, 103], [37, 110.5], [49, 110.5], [52, 105.5], [59, 105.5]];
  const spire = [...spireL, ...mirror(spireL.slice(1, -1), C).reverse()];
  // Beside it, a blade each side; beyond them, a wing each side.
  const blade: Pt[] = [[45, 12], [38.5, 26], [33, 44], [29, 60], [26.5, 73], [23, 76], [25, 86], [23, 100], [25, 114], [32.5, 114], [33, 100], [35.5, 86], [38.5, 74], [42.5, 58], [46.5, 40], [49.5, 26], [49.5, 13]];
  const wing: Pt[] = [[33.5, 13], [24.5, 29], [15, 47], [10, 64], [9.5, 79], [13, 83.5], [11.5, 96], [15.5, 109], [21, 107.5], [19.5, 95], [20, 84], [20, 72], [22.5, 57], [28.5, 40], [35.5, 25], [39.5, 15]];
  // Under them, a foot each side and the base between.
  const foot: Pt[] = [[12, 113], [14, 138], [33, 139], [33, 130], [21.5, 128], [19.5, 116]];
  const base: Pt[] = [[38, 120], [49, 120], [52, 126], [66, 126], [69, 120], [80, 120], [80, 140], [38, 140]];
  let s = inlay(spire);
  for (const p of [blade, wing, foot]) s += inlay(p) + inlay(mirror(p, C).reverse());
  s += inlay(base);
  // The crystal's ridges and glints.
  s += ink('M59 18L59 100', LINE.fine, darkOf(PIC.cyan, 0.25), 0.8);
  s += ink('M58.3 24L56.4 40M54 52L51.5 66', 1.2, '#ffffff', 0.75);
  s += ink('M44.6 30L40.6 46M31.5 40L23.5 56M27 122L26.5 132', 1.1, '#ffffff', 0.6);
  s += ink('M73.4 30L77.4 46M86.5 40L94.5 56M41 124L48 124', 1.1, '#ffffff', 0.5);
  return s + sparkle(62, 22, 3.6) + sparkle(28, 66, 2.6, 0.8) + sparkle(92, 92, 2.4, 0.7);
}

/** The sign in its frame's coordinates (118 × 152; the nail 30 above the top bar's middle). */
function signBody(): string {
  const wire = poly([[33, 0.5], [59, -30], [85, 0.5]], false);
  let s = ink(wire, 2.4, darkOf(PIC.wire, 0.45)) + ink(wire, 0.9, lightOf(PIC.wire, 0.5), 0.9);
  s += nail(59, -30, 4.6);
  // The panel, notched where the frame cracked, its bottom-left corner gone with the frame's; its grain runs down it.
  const canvas = poly([[3, 3], [115, 3], [115, 50], [101, 55], [108, 58.5], [100, 62], [115, 66], [115, 148], [9, 148], [3, 142], [3, 43], [19, 40.5], [11, 37.5], [17, 34], [3, 30]]);
  let grain = '';
  for (const x of [8, 21, 36, 52, 67, 83, 97, 109]) grain += ink(`M${x} 2Q${x + 3} 40 ${x - 1} 76T${x + 1} 150`, LINE.fine, darkOf(PIC.brown, 0.16), 0.9);
  s += comic(canvas, PIC.brown, { line: LINE.small, ink: darkOf(PIC.brown, 0.5), inner: grain + sigil(), rim: [-3.2, 2.4] });
  const frame: Pt[][] = [
    // The top bar and the left bar down to its crack.
    [[0, 0], [101, 0], [103.5, 4], [100, 8], [8, 8], [8, 31.5], [5, 34], [7, 36.5], [0, 33]],
    // The left bar below the crack (its bottom corner broken off).
    [[-1, 40.5], [3.5, 39], [7, 42], [7, 137], [2.5, 140], [-1, 138]],
    // The bottom bar.
    [[10, 144], [111, 144], [114, 147], [111, 152], [10, 152], [12, 148]],
    // The right bar above its crack, below the broken corner.
    [[110, 10.5], [118, 10.5], [118, 50], [114.5, 53.5], [112, 50.5], [110, 52]],
    // The right bar below the crack.
    [[110, 63], [113, 61.5], [115.5, 64], [118, 62.5], [118, 138], [114, 141], [110, 138]],
  ];
  for (const p of frame) s += framePiece(p, PIC.signFrame);
  s += crack([[19, 40.5], [24, 42], [22, 44], [27, 45.5]]);
  s += crack([[100, 62], [95, 63.5], [97, 65.5], [92, 67]]);
  s += crack([[54, 144], [55.5, 148], [53.5, 152]], LINE.small, darkOf(PIC.signFrame, 0.5));
  return s;
}

/** The sign with the cyan sigil, straight on its wire. */
export function sign(): PartArt {
  return { key: 'p1.window', w: 150, h: 212, px: 75, py: 120, body: `<g transform="translate(16 48)">${signBody()}</g>`, scale: 1 };
}
