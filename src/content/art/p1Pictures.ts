import type { PartArt } from '../../render/2d/rig/rigTypes';
import { ellipsePath, poly, smooth, taper, type Pt } from '../../render/2d/svg';
import { INK, clipped, flat, inked, line, n } from './p1Ink';

// The two pictures on the 14th Room's back wall, drawn by hand after the
// first painting and in its manner: flat colours in bold ink.
//
// The portrait: a green creature whose hair is four snake-headed tendrils,
// with pink, heavy-lidded eyes and a finger to its lips, in a sage shirt with
// shoulder pads, on dusty rose. Its slate frame is torn in four places and
// hangs crooked from one nail at its top-left corner; the wall is cracked
// about the nail, and a speck of gold shines beside it.
//
// The sign: a cyan crystal sigil inlaid in brown (a barbed spire between two
// pairs of blades, over an angular base) in a dark frame cracked at both
// sides, hung straight on a wire from a nail.

/** The pictures' colours (chosen by eye). */
const PIC = {
  frame: '#7b7f98',
  canvas: '#cfa6aa',
  green: '#7cc067',
  greenDeep: '#5f9e50',
  eye: '#f7dbe5',
  iris: '#d4529a',
  shirt: '#a9bea0',
  shirtDeep: '#8fa486',
  cloth: '#978c7f',
  hand: '#a89c8b',
  gold: '#f2c84b',
  signFrame: '#5f6476',
  brown: '#9e7f72',
  cyan: '#8ce0dc',
  groove: '#414a59',
  nail: '#5d6070',
} as const;

/** Points mirrored across the vertical line u = c. */
const mirror = (pts: readonly Pt[], c: number): Pt[] => pts.map(([u, v]) => [2 * c - u, v]);

/** The nail a picture hangs from, with its glint. */
function nail(x: number, y: number, r: number): string {
  return inked(ellipsePath(x, y, r, r), PIC.nail, 1.3) + flat(ellipsePath(x - r * 0.3, y - r * 0.32, r * 0.3, r * 0.3), '#ffffff', 0.55);
}

// ================================================================ the portrait

/** A snake's head at (x, y), facing `deg`, its mouth a little open; heads facing left keep their eye on top. */
function snakeHead(x: number, y: number, deg: number): string {
  const head = smooth([[-5, -3.6], [1.5, -5.2], [7.5, -3], [11, -0.6], [6, 0.7], [10, 2.6], [1.5, 4.6], [-5, 3.4]]);
  const flip = Math.abs(deg) > 90 ? ' scale(1 -1)' : '';
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(deg)})${flip}">${inked(head, PIC.green, 1.8)}${flat(ellipsePath(2.6, -1.9, 1.35, 1.35), INK)}${line('M6 0.7L1.5 1.1', 1.1)}</g>`;
}

/** One tendril of its hair: from the head out along `pts`, ending in a snake's head facing `deg`. */
function tendril(pts: readonly Pt[], deg: number): string {
  const end = pts[pts.length - 1]!;
  return inked(taper(pts, 13.5, 9), PIC.green, 2) + line(smooth(pts.slice(0, -1), 1, false), 1.5, PIC.greenDeep, 0.65) + snakeHead(end[0], end[1], deg);
}

/** An eye: a pink almond, its iris without a pupil, under a heavy lid; `tilt` lets the outer corner droop. */
function eye(cx: number, cy: number, tilt: number): string {
  const almond = `M${n(cx - 6.2)} ${n(cy)}Q${n(cx)} ${n(cy - 5.4)} ${n(cx + 6.2)} ${n(cy)}Q${n(cx)} ${n(cy + 4.4)} ${n(cx - 6.2)} ${n(cy)}Z`;
  let s = flat(almond, PIC.eye) + clipped(almond, flat(ellipsePath(cx + 0.3, cy + 0.3, 3, 3), PIC.iris));
  s += line(almond, 1.4);
  s += line(`M${n(cx - 7)} ${n(cy + 0.5)}Q${n(cx)} ${n(cy - 6.2)} ${n(cx + 7)} ${n(cy - 0.3)}`, 2.6);
  return `<g transform="rotate(${n(tilt)} ${n(cx)} ${n(cy)})">${s}</g>`;
}

/** The creature: drawn inside the canvas (frame coordinates). */
function creature(): string {
  let s = '';
  // The tendrils, behind the head.
  s += tendril([[49, 47], [42, 39], [34, 31], [27, 25]], -140);
  s += tendril([[65, 46], [73, 39], [82, 35], [89, 37]], 60);
  s += tendril([[44, 57], [34, 51], [25, 52], [19, 58]], 135);
  s += tendril([[72, 57], [82, 52], [90, 56], [93, 63]], 70);
  // The neck, the shirt and its collar.
  s += inked(poly([[52, 80], [63, 80], [64, 98], [51, 98]]), PIC.green, 1.4);
  s += inked(smooth([[48, 95], [36, 98], [29, 104], [31, 120], [36, 136], [37, 154], [85, 154], [88, 136], [91, 120], [92, 105], [82, 97], [68, 95]]), PIC.shirt, 1.6);
  s += inked(poly([[49.5, 95.5], [58.5, 106], [67.5, 95.5]]), PIC.shirtDeep, 1.3);
  s += line('M61 109Q62.5 125 60 146', 1, INK, 0.45) + line('M75 112Q81 123 78.5 140', 1, INK, 0.4) + line('M84 108Q86 116 84 124', 1, INK, 0.35);
  // The shoulder pads.
  s += `<g transform="rotate(-18 34 101)">${inked(ellipsePath(34, 101, 9, 5.4), PIC.cloth, 1.5)}</g>`;
  s += `<g transform="rotate(16 86 102)">${inked(ellipsePath(86, 102, 9, 5.4), PIC.cloth, 1.5)}</g>`;
  // The head: an onion of green, its right cheek in shade.
  // The head: wide under the tendrils, narrowing to a long chin.
  const head = smooth([[55, 42], [64, 42], [72, 47], [76, 55], [72, 67], [63, 82], [57, 89], [52, 82], [43, 68], [38, 56], [42, 47], [48, 43]]);
  s += inked(head, PIC.green, 2.1);
  s += clipped(head, flat(smooth([[70, 50], [79, 58], [72, 74], [60, 92], [65, 74], [71, 62]]), PIC.greenDeep, 0.45));
  s += line('M51 47Q56 44.5 62 47', 1.3, PIC.greenDeep, 0.8);
  s += eye(48.5, 61, -12) + eye(64, 61.5, 12);
  // Its right arm raised: the sleeve down to the elbow and back up across the chest.
  s += inked(taper([[31, 104], [31, 116], [35, 126]], 12, 12), PIC.cloth, 1.5);
  s += inked(taper([[35, 126], [43, 112], [52, 99]], 12.5, 9.5), PIC.cloth, 1.5);
  s += line('M37 117Q41 116 43 119M42 108Q45 108 47 110', 1, INK, 0.5);
  // The fist, and the finger at its lips.
  s += inked(ellipsePath(55.5, 95, 6.5, 5.6), PIC.hand, 1.4);
  s += line('M50.5 93Q53 91.6 55.5 93.6M51 97Q54 95.6 56.5 97.6', 0.9, INK, 0.75);
  s += inked('M53.8 92V74Q53.8 70.8 56.4 70.8Q59 70.8 59 74V92Z', PIC.hand, 1.3);
  s += line('M54.8 75.5Q56.4 76.6 58 75.5', 0.8, INK, 0.6);
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
  let s = inked(canvas, PIC.canvas, 1.4);
  s += clipped(canvas, creature());
  s += line(canvas, 1.4);
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
  for (const p of frame) s += inked(poly(p), PIC.frame, 2.7);
  // The cracks running on into the canvas.
  s += line(poly([[40, 15], [42.5, 20], [39.5, 25], [43, 31], [40.5, 36]], false), 1.5);
  s += line(poly([[92, 28.5], [87, 30], [89, 32.5], [84, 34]], false), 1.3);
  s += line(poly([[18, 95], [23, 96.5], [21, 98.5], [26.5, 100]], false), 1.3);
  // The nail at the corner, the wall cracked about it.
  s += line(poly([[0, -2], [-2.5, -8], [-0.5, -12], [-4, -19]], false), 1.6) + line(poly([[-1.5, -10], [-6, -12.5]], false), 1.1);
  s += line(poly([[2.5, -2], [7, -8], [5.5, -12], [11, -17]], false), 1.6) + line(poly([[6, -11], [10.5, -10]], false), 1.1);
  s += nail(1, 1, 2.8);
  // A speck of gold beside the frame.
  s += inked(smooth([[100, -8], [104.5, -9.5], [108, -5.5], [105.5, -1], [100.5, -2.5]]), PIC.gold, 1.4);
  return s;
}

/** The green creature's portrait, crooked on its nail. */
export function portrait(): PartArt {
  return { key: 'p1.picture', w: 154, h: 200, px: 77, py: 100, body: `<g transform="translate(36 29) rotate(8.5)">${portraitBody()}</g>`, scale: 1 };
}

// ================================================================ the sign

/** A shape of the sigil: cyan inside a dark rim, outlined in ink. */
function inlay(pts: readonly Pt[]): string {
  const d = poly(pts);
  return flat(d, PIC.cyan) + clipped(d, line(d, 5.2, PIC.groove)) + line(d, 2.2);
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
  // The crystal's glints.
  s += line('M58.3 24L56.4 40M54 52L51.5 66', 1.2, '#ffffff', 0.6);
  s += line('M44.6 30L40.6 46M31.5 40L23.5 56M27 122L26.5 132', 1.1, '#ffffff', 0.5);
  s += line('M73.4 30L77.4 46M86.5 40L94.5 56M41 124L48 124', 1.1, '#ffffff', 0.4);
  return s;
}

/** The sign in its frame's coordinates (118 × 152; the nail 30 above the top bar's middle). */
function signBody(): string {
  const wire = poly([[33, 0.5], [59, -30], [85, 0.5]], false);
  let s = line(wire, 4.4) + line(wire, 1.8, PIC.signFrame);
  s += nail(59, -30, 4.6);
  // The canvas, notched where the frame cracked, its bottom-left corner gone with the frame's.
  const canvas = poly([[3, 3], [115, 3], [115, 50], [101, 55], [108, 58.5], [100, 62], [115, 66], [115, 148], [9, 148], [3, 142], [3, 43], [19, 40.5], [11, 37.5], [17, 34], [3, 30]]);
  s += inked(canvas, PIC.brown, 1.4);
  s += clipped(canvas, sigil());
  s += line(canvas, 1.4);
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
  for (const p of frame) s += inked(poly(p), PIC.signFrame, 2.7);
  s += line(poly([[19, 40.5], [24, 42], [22, 44], [27, 45.5]], false), 1.3);
  s += line(poly([[100, 62], [95, 63.5], [97, 65.5], [92, 67]], false), 1.3);
  s += line(poly([[54, 144], [55.5, 148], [53.5, 152]], false), 1.4);
  return s;
}

/** The sign with the cyan sigil, straight on its wire. */
export function sign(): PartArt {
  return { key: 'p1.window', w: 150, h: 212, px: 75, py: 120, body: `<g transform="translate(16 48)">${signBody()}</g>`, scale: 1 };
}
