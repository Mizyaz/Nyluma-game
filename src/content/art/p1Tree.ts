import type { PartArt } from '../../render/2d/rig/rigTypes';
import { SHADE, darkOf } from '../../render/2d/style';
import { ellipsePath, smooth, type Pt } from '../../render/2d/svg';
import { comic, ink, type ComicOpts } from '../characters/kit';

// The rose tree of the first painting, drawn in the game's own comic manner
// rather than traced. A twisting lilac trunk with thorns holds a crystal up;
// its branches end in roses, and birds come out of them: a big one rising
// from the big rose with a leafy twig in its claws, a chick calling from a
// tall bud, a little one just flown from the rose on the left. A bud hangs
// from a curl. Below, roots with rose leaves run down into a pool of lilac
// mist that drifts off to the right, towards the toys.
//
// Drawn in the painting's measure (the tree about 525 tall), then shrunk to
// Gorti's (the card's scale). The light comes from the upper right, as on
// the characters.

const TREE = {
  trunk: '#b48cc9',
  thorn: '#9670ae',
  crystal: '#b9ebe4',
  crystalLight: '#ecfffc',
  crystalDeep: '#8ccfc6',
  rose: '#e293c2',
  roseBack: '#c870a8',
  roseLight: '#f8d0e4',
  roseHeart: '#a64f88',
  sepal: '#8fb27f',
  teal: '#8fc4bd',
  tealDeep: '#6ea39c',
  tealLight: '#c9eae4',
  beak: '#efe0b8',
  eyeWhite: '#fffaf6',
  iris: '#ec7aab',
  pupil: '#2d2329',
  mouth: '#f39ab9',
  root: '#a27e5a',
  leaf: '#90b27f',
  mist: '#cfaee0',
  mistLight: '#ecdcf5',
  shadow: '#4a3550',
} as const;

/** How much smaller than the painting's measure it is drawn. */
const SIZE = 0.32;
/** Where the trunk meets the floor (its card's pivot). */
const FOOT_X = 244;
/** Contour weights in the painting's measure (the kit's LINE, scaled up to it). */
const L = { body: 6, limb: 5, small: 4.2, detail: 3, fine: 2.2 } as const;
/** The kit's hatching, scaled up to the painting's measure. */
const HATCH = { hatch: 7, hatchWidth: 1.7 } as const;

type Place = (pts: readonly Pt[]) => Pt[];

const n2 = (v: number): string => (Math.round(v * 100) / 100).toString();
const p = ([x, y]: Pt): string => `${n2(x)} ${n2(y)}`;
const open = (pts: readonly Pt[], tension = 0.8): string => smooth(pts, tension, false);
const closed = (pts: readonly Pt[], tension = 0.7): string => smooth(pts, tension, true);
const circle = (x: number, y: number, r: number): string => ellipsePath(x, y, r, r);

/** The kit's cel shading for a shape about `sz` across: a shadow crescent low on the left, a glint high on the right. */
function lit(sz: number, o: ComicOpts = {}): ComicOpts {
  const g = Math.min(4, Math.max(1, sz * 0.05));
  return { rim: [Math.min(16, sz * 0.22), -Math.min(6, sz * 0.08)], glint: [-g, g], ...(sz >= 34 ? HATCH : {}), ...o };
}

/** Places a shape drawn in a unit frame: scaled by (sx, sy), turned by `deg` (clockwise), moved to `at`. */
function placer(at: Pt, sx: number, sy: number, deg: number): Place {
  const a = (deg * Math.PI) / 180;
  const [c, s] = [Math.cos(a), Math.sin(a)];
  return (pts) => pts.map(([x, y]): Pt => [at[0] + x * sx * c - y * sy * s, at[1] + x * sx * s + y * sy * c]);
}

/** A small four-pointed sparkle. */
function sparkle(x: number, y: number, r: number, o = 0.9): string {
  const k = r * 0.28;
  const d = `M${p([x, y - r])}Q${p([x + k, y - k])} ${p([x + r, y])}Q${p([x + k, y + k])} ${p([x, y + r])}Q${p([x - k, y + k])} ${p([x - r, y])}Q${p([x - k, y - k])} ${p([x, y - r])}Z`;
  return `<path d="${d}" fill="#ffffff" opacity="${o}"/>`;
}

// ------------------------------------------------------------ leaves

/** A rose leaf from base to tip: serrated edges, a midrib and its veins. */
function roseLeaf(base: Pt, tip: Pt, w: number): string {
  const [dx, dy] = [tip[0] - base[0], tip[1] - base[1]];
  const len = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / len, dx / len];
  const at = (t: number, s: number): Pt => [base[0] + dx * t + nx * s, base[1] + dy * t + ny * s];
  // Widest a little before the middle.
  const half = (t: number): number => w * 0.5 * Math.sin(Math.PI * Math.pow(t, 0.8));
  const side = (sg: 1 | -1): Pt[] => {
    const out: Pt[] = [];
    for (let i = 1; i < 12; i++) {
      const t = i / 12;
      // Each tooth leans towards the tip.
      out.push(at(t + (i % 2 ? 0.02 : 0), sg * (half(t) + (i % 2 ? w * 0.07 : -w * 0.02))));
    }
    return out;
  };
  const d = smooth([base, ...side(1), tip, ...side(-1).reverse()], 0.25, true);
  let veins = ink(`M${p(base)}L${p(at(0.9, 0))}`, L.fine, darkOf(TREE.leaf, 0.45));
  for (const t of [0.26, 0.46, 0.66]) {
    for (const sg of [1, -1] as const) {
      veins += ink(`M${p(at(t, 0))}Q${p(at(t + 0.08, sg * half(t) * 0.45))} ${p(at(t + 0.15, sg * half(t + 0.15) * 0.8))}`, L.fine * 0.8, darkOf(TREE.leaf, 0.35));
    }
  }
  return comic(d, TREE.leaf, lit(w, { line: L.detail, over: veins }));
}

// ------------------------------------------------------------ roses
// Each drawn in a unit frame opening upward, its base at (0, 1).

const ROSE_SHADE: ComicOpts = { tone: SHADE.warm, hatchColor: SHADE.hatchWarm };

/** A petal: rolled back at its lip (a pale band along its top), a crease up from its base. */
function petal(T: Place, pts: Pt[], lip: Pt[], crease: Pt[], fill: string = TREE.rose): string {
  const over = ink(open(T(crease)), L.fine, darkOf(fill, 0.22)) + ink(open(T(lip), 0.7), L.detail * 1.8, TREE.roseLight);
  return comic(closed(T(pts)), fill, lit(40, { ...ROSE_SHADE, line: L.small, lightFill: TREE.roseLight, over }));
}

/** The back of the cup, its petal tips curled, and (unless something is coming out of it) the tight heart. */
function roseBack(T: Place, heart: boolean): string {
  const cup: Pt[] = [[-0.82, 0.1], [-0.96, -0.36], [-0.84, -0.78], [-0.58, -0.98], [-0.36, -0.86], [-0.12, -1.04], [0.14, -0.9], [0.36, -1.02], [0.62, -0.94], [0.86, -0.7], [0.94, -0.3], [0.82, 0.1], [0, 0.3]];
  let s = petal(T, cup, [[-0.86, -0.74], [-0.58, -0.94], [-0.36, -0.82], [-0.12, -1], [0.14, -0.86], [0.36, -0.98], [0.62, -0.9], [0.84, -0.68]], [[0, 0.1], [0, -0.4]], TREE.roseBack);
  if (heart) {
    const spiral: Pt[] = [];
    for (let i = 0; i <= 28; i++) {
      const th = 0.6 + (i / 28) * Math.PI * 3.4;
      const r = 0.34 * (1 - i / 32);
      spiral.push([Math.cos(th) * r, -0.5 + Math.sin(th) * r * 0.62]);
    }
    const bud = T([[-0.44, -0.44], [-0.32, -0.72], [0, -0.82], [0.32, -0.72], [0.44, -0.44], [0.3, -0.22], [0, -0.16], [-0.3, -0.22]]);
    s += comic(closed(bud), TREE.rose, lit(22, { ...ROSE_SHADE, line: L.detail, over: ink(open(T(spiral), 0.6), L.detail, TREE.roseHeart) }));
  }
  return s;
}

/** The petals wrapped round the heart, then the outer ones curving round the front. */
function roseFront(T: Place): string {
  let s = '';
  s += petal(T, [[-0.04, 0.5], [-0.5, 0.38], [-0.76, 0.02], [-0.72, -0.44], [-0.52, -0.62], [-0.4, -0.38], [-0.22, -0.1], [-0.06, 0.2]], [[-0.74, -0.42], [-0.54, -0.6], [-0.42, -0.4]], [[-0.2, 0.36], [-0.46, 0.04]]);
  s += petal(T, [[0.04, 0.5], [0.5, 0.38], [0.76, 0.02], [0.72, -0.44], [0.52, -0.62], [0.4, -0.38], [0.22, -0.1], [0.06, 0.2]], [[0.74, -0.42], [0.54, -0.6], [0.42, -0.4]], [[0.2, 0.36], [0.46, 0.04]]);
  s += petal(T, [[0.06, 1], [-0.46, 0.86], [-0.86, 0.44], [-1, -0.06], [-0.9, -0.34], [-0.7, -0.2], [-0.46, 0], [-0.22, 0.3], [-0.04, 0.62]], [[-0.96, -0.26], [-0.72, -0.14], [-0.48, 0.04]], [[-0.2, 0.86], [-0.5, 0.52], [-0.72, 0.14]]);
  s += petal(T, [[-0.06, 1], [0.46, 0.86], [0.86, 0.44], [1, -0.06], [0.9, -0.34], [0.7, -0.2], [0.46, 0], [0.22, 0.3], [0.04, 0.62]], [[0.96, -0.26], [0.72, -0.14], [0.48, 0.04]], [[0.2, 0.86], [0.5, 0.52], [0.72, 0.14]]);
  s += petal(T, [[-0.5, 0.16], [-0.26, -0.06], [0, -0.12], [0.26, -0.06], [0.5, 0.16], [0.42, 0.56], [0, 0.96], [-0.42, 0.56]], [[-0.44, 0.12], [0, -0.03], [0.44, 0.12]], [[0, 0.82], [0.02, 0.4], [0, 0.14]]);
  return s;
}

const SEPALS: readonly Pt[][] = [
  [[-0.1, 0.86], [-0.46, 0.9], [-0.72, 1.08], [-0.36, 1.02], [0, 0.98]],
  [[0.1, 0.86], [0.46, 0.9], [0.74, 1.06], [0.36, 1.02], [0, 0.98]],
  [[-0.08, 0.92], [0, 1.08], [0.06, 1.26], [0.12, 1.06], [0.1, 0.92]],
];

/** Green sepals curling back from the rose's base. */
function sepals(T: Place): string {
  return SEPALS.map((pts) => comic(closed(T(pts), 0.5), TREE.sepal, lit(12, { line: L.detail }))).join('');
}

/** A whole rose; `inside` is what is coming out of it, drawn between its back and its front petals. */
function rose(T: Place, inside = ''): string {
  return roseBack(T, !inside) + inside + roseFront(T) + sepals(T);
}

/** A bud: sepals hugging it, a petal wrapped round it; `inside` is coming out of its parted tip. */
function bud(T: Place, inside = ''): string {
  let s = '';
  for (const pts of [
    [[-0.08, 0.92], [-0.62, 0.62], [-0.84, 0.06], [-0.5, 0.42], [-0.08, 0.76]],
    [[0.08, 0.92], [0.64, 0.6], [0.86, 0.02], [0.5, 0.42], [0.08, 0.76]],
  ] as Pt[][]) {
    s += comic(closed(T(pts), 0.5), TREE.sepal, lit(14, { line: L.detail }));
  }
  const tip: Pt[] = inside ? [[-0.26, -0.98], [0, -0.7], [0.28, -1]] : [[-0.12, -0.98], [0.04, -1.04], [0.2, -0.94]];
  const body = T([[0, 1], [-0.56, 0.84], [-0.8, 0.36], [-0.74, -0.22], [-0.46, -0.7], ...tip, [0.5, -0.7], [0.76, -0.22], [0.8, 0.36], [0.56, 0.84]]);
  s += comic(closed(body), TREE.roseBack, lit(40, { ...ROSE_SHADE, line: L.small, lightFill: TREE.rose }));
  s += inside;
  const wrap = T([[-0.66, 0.24], [-0.3, -0.22], [0.16, -0.48], [0.62, -0.58], [0.7, -0.08], [0.58, 0.5], [0.2, 0.9], [-0.32, 0.8]]);
  const lip = ink(open(T([[-0.56, 0.12], [-0.16, -0.3], [0.4, -0.52]])), L.detail * 1.8, TREE.roseLight);
  s += comic(closed(wrap), TREE.rose, lit(40, { ...ROSE_SHADE, line: L.small, lightFill: TREE.roseLight, over: lip + ink(open(T([[0.1, 0.8], [0.3, 0.3], [0.36, -0.2]])), L.fine, darkOf(TREE.rose, 0.22)) }));
  return s + sepals(T);
}

/** Two petals drifting off where the little bird burst out of its rose. */
function adrift(): string {
  let s = '';
  for (const [x, y, deg] of [[114, 176, -30], [122, 238, 40]] as const) {
    const T = placer([x, y], 7, 9, deg);
    s += comic(closed(T([[0, -1], [0.9, -0.2], [0.6, 0.8], [0, 1], [-0.6, 0.8], [-0.9, -0.2]])), TREE.rose, { line: L.detail, glint: [-1, 1], lightFill: TREE.roseLight });
  }
  return s;
}

// ------------------------------------------------------------ trunk and branches

/** A strand's outline: its two sides at each point's width, round at the tip. */
function strandD(pts: readonly Pt[], w: readonly number[]): string {
  const side = (k: number): Pt[] =>
    pts.map(([x, y], i): Pt => {
      const a = pts[Math.max(0, i - 1)]!;
      const b = pts[Math.min(pts.length - 1, i + 1)]!;
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const h = (w[i] ?? 10) / 2;
      return [x - ((b[1] - a[1]) / len) * h * k, y + ((b[0] - a[0]) / len) * h * k];
    });
  const [last, prev] = [pts[pts.length - 1]!, pts[pts.length - 2]!];
  const len = Math.hypot(last[0] - prev[0], last[1] - prev[1]) || 1;
  const reach = (w[w.length - 1] ?? 8) * 0.45;
  const tip: Pt = [last[0] + ((last[0] - prev[0]) / len) * reach, last[1] + ((last[1] - prev[1]) / len) * reach];
  return smooth([...side(1), tip, ...side(-1).reverse()], 0.55);
}

/** A line along a strand, `k` of its half-width off the middle, wandering by `twist`. */
function along(pts: readonly Pt[], w: readonly number[], k: number, twist = 0): Pt[] {
  return pts.map(([x, y], i): Pt => {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(pts.length - 1, i + 1)]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const off = ((w[i] ?? 10) / 2) * (k + twist * Math.sin(i * 1.3));
    return [x - ((b[1] - a[1]) / len) * off, y + ((b[0] - a[0]) / len) * off];
  });
}

/** A branch tapering from w0 to w1, a groove along it. */
function branch(pts: Pt[], w0: number, w1: number, color: string = TREE.trunk): string {
  const w = pts.map((_, i) => w0 + ((w1 - w0) * i) / Math.max(1, pts.length - 1));
  return comic(strandD(pts, w), color, lit(w0, { line: L.limb, over: ink(open(along(pts, w, 0.2)), L.fine, darkOf(color, 0.3)) }));
}

/** A thorn on the trunk's edge at `at`, hooked along `dir`. */
function thorn(at: Pt, dir: Pt, size: number): string {
  const [dx, dy] = dir;
  const [nx, ny] = [-dy, dx];
  const pts: Pt[] = [
    [at[0] - nx * size * 0.45, at[1] - ny * size * 0.45],
    [at[0] + dx * size + nx * size * 0.25, at[1] + dy * size + ny * size * 0.25],
    [at[0] + nx * size * 0.45, at[1] + ny * size * 0.45],
  ];
  return comic(smooth(pts, 0.35, true), TREE.thorn, { line: L.detail, glint: [-0.8, 0.8] });
}

const TRUNK: Pt[] = [[246, 356], [238, 328], [230, 300], [226, 274], [228, 248], [229, 222], [226, 196], [221, 170], [217, 144], [215, 122]];
const TRUNK_W = [36, 31, 28, 27, 25, 25, 24, 24, 26, 32];

function trunk(): string {
  // The bark twists up it: a groove up each side, and grooves winding across.
  const groove = darkOf(TREE.trunk, 0.32);
  let over = ink(open(along(TRUNK, TRUNK_W, 0.5, 0.12)), L.detail, groove) + ink(open(along(TRUNK, TRUNK_W, -0.6, 0.1).slice(1)), L.fine, groove);
  const left = along(TRUNK, TRUNK_W, -0.9);
  const right = along(TRUNK, TRUNK_W, 0.9);
  for (let j = 0; j < TRUNK.length - 2; j += 2) {
    const [a, b] = [left[j]!, right[j + 1]!];
    over += ink(open([a, [(a[0] + b[0]) / 2 + 2, (a[1] + b[1]) / 2 + 4], b], 0.9), L.detail, groove);
  }
  const knot = ellipsePath(229, 236, 4, 7);
  over += `<path d="${knot}" fill="${darkOf(TREE.trunk, 0.18)}"/>` + ink(knot, L.fine, darkOf(TREE.trunk, 0.45));
  let s = comic(strandD(TRUNK, TRUNK_W), TREE.trunk, lit(26, { ...HATCH, line: L.body, over }));
  // Thorns along both edges, hooked upward.
  s += thorn([210, 180], [-0.9, -0.45], 10) + thorn([215, 258], [-0.92, -0.4], 9) + thorn([216, 318], [-0.9, -0.42], 10);
  s += thorn([231, 152], [0.92, -0.38], 9) + thorn([242, 226], [0.9, -0.44], 8) + thorn([253, 330], [0.9, -0.44], 10);
  return s;
}

// ------------------------------------------------------------ the crystal

function crystal(): string {
  const tip: Pt = [207, 48];
  const shL: Pt = [190, 76];
  const shR: Pt = [227, 73];
  const beltL: Pt = [187, 99];
  const beltR: Pt = [233, 96];
  const mid: Pt = [209, 84];
  const low: Pt = [211, 128];
  const lowL: Pt = [195, 120];
  const lowR: Pt = [227, 120];
  const outline = `M${[tip, shR, beltR, lowR, low, lowL, beltL, shL].map(p).join('L')}Z`;
  const face = (pts: Pt[], color: string): string => `<path d="M${pts.map(p).join('L')}Z" fill="${color}"/>`;
  let over = face([tip, shL, mid], TREE.crystalLight) + face([tip, mid, shR], TREE.crystal);
  over += face([shL, mid, low, lowL, beltL], TREE.crystal) + face([mid, shR, beltR, lowR, low], TREE.crystalDeep);
  over += ink(`M${p(shL)}L${p(mid)}L${p(shR)}M${p(tip)}L${p(mid)}L${p(low)}`, L.fine, darkOf(TREE.crystal, 0.4));
  over += ink(open([[195, 84], [196, 102], [201, 116]]), L.detail, '#ffffff', 0.85);
  let s = comic(outline, TREE.crystal, { line: L.small, ink: darkOf(TREE.crystal, 0.55), over });
  s += sparkle(226, 56, 9) + sparkle(183, 68, 5, 0.8) + sparkle(240, 110, 3.5, 0.7);
  return s;
}

// ------------------------------------------------------------ birds

/** A big round eye: white, a pink iris looking along `look`, a pupil, a glint, and a brow over it. */
function eye(x: number, y: number, r: number, look: Pt = [0, 0]): string {
  const [ix, iy] = [x + look[0] * r * 0.3, y + look[1] * r * 0.3];
  let s = `<path d="${circle(x, y, r)}" fill="${TREE.eyeWhite}"/>`;
  s += `<path d="${circle(ix, iy, r * 0.62)}" fill="${TREE.iris}"/><path d="${circle(ix, iy, r * 0.32)}" fill="${TREE.pupil}"/>`;
  s += `<path d="${circle(ix - r * 0.22, iy - r * 0.24, r * 0.17)}" fill="#ffffff"/>`;
  s += ink(circle(x, y, r), L.detail, darkOf(TREE.teal, 0.6));
  s += ink(`M${p([x - r * 1.05, y - r * 0.55])}Q${p([x, y - r * 1.5])} ${p([x + r * 1.05, y - r * 0.6])}`, L.detail, darkOf(TREE.teal, 0.65));
  return s;
}

/** A rosy cheek. */
function blush(x: number, y: number, rx: number, ry: number): string {
  return `<path d="${ellipsePath(x, y, rx, ry)}" fill="${TREE.mouth}" opacity="0.5"/>`;
}

/** A feather from `root` to `tip`, a shaft down it. */
function feather(root: Pt, tip: Pt, w: number, color: string): string {
  const [dx, dy] = [tip[0] - root[0], tip[1] - root[1]];
  const len = Math.hypot(dx, dy) || 1;
  const [nx, ny] = [-dy / len, dx / len];
  const at = (k: number, o: number): Pt => [root[0] + dx * k + nx * o, root[1] + dy * k + ny * o];
  const d = smooth([root, at(0.35, w * 0.5), at(0.75, w * 0.42), tip, at(0.78, -w * 0.3), at(0.35, -w * 0.45)], 0.55, true);
  return comic(d, color, lit(w, { line: L.detail, over: ink(`M${p(at(0.15, 0))}L${p(at(0.85, 0))}`, L.fine * 0.8, darkOf(color, 0.3)) }));
}

/**
 * A raised wing: the shoulder at `at`, reaching back along -x in its own
 * frame (mirrored when `flip`), `size` long, turned by `deg`. Long flight
 * feathers, shorter ones under them, and the coverts over their roots,
 * scalloped along their lower edge.
 */
function wing(at: Pt, size: number, deg: number, color: string, flip = false): string {
  const T = placer(at, flip ? -size : size, size, deg);
  let s = '';
  const one = (root: Pt, tip: Pt, w: number): string => {
    const [a, b] = T([root, tip]);
    return feather(a!, b!, w * size, color);
  };
  const primaries: [Pt, Pt][] = [
    [[-0.52, -0.32], [-1.08, -0.48]],
    [[-0.46, -0.2], [-1.04, -0.24]],
    [[-0.4, -0.08], [-0.94, -0.02]],
    [[-0.34, 0.04], [-0.78, 0.16]],
  ];
  for (const [r, t] of primaries) s += one(r, t, 0.2);
  for (const [r, t] of [[[-0.3, 0.02], [-0.62, 0.26]], [[-0.2, 0.06], [-0.46, 0.32]], [[-0.1, 0.08], [-0.3, 0.32]]] as [Pt, Pt][]) s += one(r, t, 0.18);
  // The coverts: a leading edge up to the wrist, then scallops back to the shoulder.
  const lead = T([[0.06, 0.12], [-0.22, -0.5], [-0.82, -0.48]]);
  const back = T([[-0.82, -0.48], [-0.6, -0.26], [-0.4, -0.12], [-0.2, 0.02], [0.06, 0.12]]);
  const bow = flip ? -0.35 : 0.35;
  let d = `M${p(lead[0]!)}Q${p(lead[1]!)} ${p(lead[2]!)}`;
  for (let i = 1; i < back.length; i++) {
    const [a, b] = [back[i - 1]!, back[i]!];
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    d += `Q${p([(a[0] + b[0]) / 2 - dy * bow, (a[1] + b[1]) / 2 + dx * bow])} ${p(b)}`;
  }
  s += comic(d + 'Z', color, lit(size * 0.4, { line: L.small }));
  return s;
}

/** The big bird coming up out of the big rose, its wings raised. */
function bigBird(): string {
  let s = '';
  s += wing([426, 146], 50, 48, TREE.tealDeep);
  const body = closed([[426, 136], [404, 140], [384, 152], [368, 170], [358, 192], [358, 214], [376, 214], [396, 204], [416, 192], [434, 176], [444, 158], [440, 142]]);
  const breast = closed([[386, 208], [406, 196], [426, 182], [440, 164], [444, 150], [446, 168], [430, 188], [404, 204]]);
  s += comic(body, TREE.teal, lit(46, { line: L.limb, over: `<path d="${breast}" fill="${TREE.tealLight}" opacity="0.9"/>` }));
  s += wing([404, 156], 70, 40, TREE.teal);
  // The head: a crest, a hooked beak, a great eye.
  s += feather([436, 114], [424, 92], 7, TREE.teal) + feather([442, 111], [440, 86], 7, TREE.teal) + feather([449, 111], [458, 90], 6, TREE.teal);
  s += comic(closed([[464, 124], [482, 128], [492, 140], [480, 141], [466, 144]], 0.45), TREE.beak, { line: L.detail, rim: [1.4, -0.8], glint: [-0.8, 0.8] });
  const head = closed([[426, 132], [430, 116], [444, 108], [460, 112], [469, 126], [466, 142], [454, 151], [436, 150]]);
  s += comic(head, TREE.teal, lit(40, { line: L.limb, hatch: 0, over: blush(458, 142, 6, 3.6) }));
  s += eye(447, 128, 9.5, [0.6, 0.1]);
  return s;
}

/** The chick calling out of the tall bud, its beak wide open. */
function chick(): string {
  let s = '';
  s += comic(closed([[270, 158], [272, 140], [280, 130], [292, 134], [292, 156]]), TREE.teal, lit(20, { line: L.small }));
  s += feather([276, 106], [270, 92], 5, TREE.teal) + feather([284, 104], [286, 90], 5, TREE.teal);
  const head = closed([[268, 126], [268, 112], [276, 104], [288, 103], [298, 108], [302, 120], [298, 132], [286, 138], [274, 136]]);
  s += comic(head, TREE.teal, lit(32, { line: L.small, over: blush(292, 128, 4.4, 2.8) }));
  // Its beak wide open: the mouth, then the two halves.
  s += `<path d="${closed([[296, 112], [310, 92], [324, 104], [302, 118]], 0.4)}" fill="${TREE.mouth}"/>`;
  s += comic(closed([[295, 108], [303, 96], [314, 86], [310, 100], [301, 113]], 0.35), TREE.beak, { line: L.detail });
  s += comic(closed([[300, 116], [313, 108], [327, 103], [320, 114], [303, 121]], 0.35), TREE.beak, { line: L.detail });
  s += eye(283, 119, 7.2, [0.4, -0.4]);
  return s;
}

/** The little bird just flown from the left rose: wings up, legs trailing. */
function littleBird(): string {
  let s = '';
  const claw = darkOf(TREE.teal, 0.6);
  s += wing([90, 196], 40, -40, TREE.tealDeep, true);
  s += ink(`M${p([80, 214])}l-4 14l-6 6M${p([76, 228])}l2 8M${p([92, 212])}l4 12l-4 6M${p([96, 224])}l6 4`, L.detail, claw);
  s += feather([98, 204], [124, 196], 8, TREE.tealDeep) + feather([98, 206], [128, 206], 8, TREE.tealDeep) + feather([98, 208], [122, 216], 8, TREE.tealDeep);
  const body = closed([[40, 206], [48, 196], [60, 191], [76, 193], [92, 198], [104, 203], [98, 211], [84, 215], [66, 217], [50, 215]]);
  const breast = closed([[52, 212], [70, 208], [92, 206], [86, 214], [64, 218]]);
  s += comic(body, TREE.teal, lit(26, { line: L.small, over: `<path d="${breast}" fill="${TREE.tealLight}" opacity="0.85"/>` + blush(50, 208, 4, 2.4) }));
  s += comic(closed([[41, 201], [28, 207], [41, 211]], 0.3), TREE.beak, { line: L.detail });
  s += wing([78, 196], 50, -30, TREE.teal, true);
  s += eye(54, 201, 5.6, [-0.6, 0]);
  return s;
}

// ------------------------------------------------------------ roots and mist

/** The roots: braided together under the trunk, then spreading into the mist. */
const BUNDLE: Pt[] = [[246, 346], [245, 372], [246, 398], [248, 422], [250, 440]];
const BUNDLE_W = [32, 34, 37, 41, 46];
const ROOTS: readonly { pts: Pt[]; w: number[] }[] = [
  // Two crossing behind the rest.
  { pts: [[232, 430], [250, 470], [282, 500], [300, 524]], w: [12, 11, 10, 7] },
  { pts: [[268, 430], [248, 474], [222, 506], [208, 528]], w: [12, 11, 10, 7] },
  { pts: [[266, 412], [296, 420], [326, 440], [346, 466], [356, 492]], w: [14, 13, 12, 10, 6] },
  { pts: [[236, 424], [218, 446], [196, 468], [182, 494], [184, 520], [196, 540]], w: [16, 15, 14, 12, 9, 6] },
  { pts: [[262, 424], [284, 446], [306, 470], [322, 500], [320, 528], [310, 544]], w: [16, 15, 14, 12, 9, 6] },
  { pts: [[244, 432], [238, 462], [226, 492], [222, 520], [230, 544]], w: [16, 15, 13, 10, 6] },
  { pts: [[254, 432], [262, 462], [272, 494], [270, 522], [262, 546]], w: [16, 15, 13, 10, 6] },
];
const ROOT_LEAVES_BACK: readonly [Pt, Pt, number][] = [
  [[200, 464], [150, 446], 22],
  [[186, 500], [142, 520], 18],
  [[316, 446], [338, 404], 20],
];
const ROOT_LEAVES_FRONT: readonly [Pt, Pt, number][] = [
  [[236, 388], [204, 376], 15],
  [[256, 412], [288, 400], 15],
];

function rootStrand(pts: readonly Pt[], w: readonly number[]): string {
  const groove = darkOf(TREE.root, 0.38);
  let over = ink(open(along(pts, w, 0.35, 0.15)), L.detail, groove) + ink(open(along(pts, w, -0.3, 0.2).slice(1)), L.fine, darkOf(TREE.root, 0.3));
  for (let i = 1; i < pts.length - 1; i += 2) {
    const [x, y] = pts[i]!;
    const k = (w[i] ?? 10) * 0.3;
    over += ink(`M${p([x - k, y - 2])}q${n2(k)} 5 ${n2(k * 2)} 1`, L.detail, groove);
  }
  return comic(strandD(pts, w), TREE.root, lit(20, { ...HATCH, line: L.limb, over }));
}

/** The braid: lobes leaning left and right in turn, each over the one above it. */
function braid(): string {
  let s = comic(strandD(BUNDLE, BUNDLE_W), darkOf(TREE.root, 0.25), { line: L.limb });
  const lobe: Pt[] = [[-1, 0.1], [-0.7, -0.62], [0, -1], [0.7, -0.62], [1, 0.1], [0.6, 0.72], [0, 0.96], [-0.6, 0.72]];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const y = BUNDLE[0]![1] + t * (BUNDLE[BUNDLE.length - 1]![1] - BUNDLE[0]![1]);
    const side = i % 2 ? 1 : -1;
    const half = 16 + t * 6;
    const T = placer([246 + t * 4 + side * half * 0.32, y], half * 0.8, 9.5, side * 34);
    const groove = ink(open(T([[-0.7, 0.1], [0, -0.1], [0.7, 0.1]])), L.fine, darkOf(TREE.root, 0.38));
    s += comic(closed(T(lobe)), TREE.root, lit(18, { line: L.limb, over: groove }));
  }
  return s;
}

function roots(): string {
  let s = '';
  for (const [b, t, w] of ROOT_LEAVES_BACK) s += roseLeaf(b, t, w);
  for (const { pts, w } of ROOTS) s += rootStrand(pts, w);
  s += braid();
  for (const [b, t, w] of ROOT_LEAVES_FRONT) s += roseLeaf(b, t, w);
  return s;
}

/** A puff of mist: its middle and radius. */
type Puff = [number, number, number];

/** The pool of mist the roots run down into: a flat cloud, puffs along its top and bottom. */
const POOL: readonly Puff[] = [
  [200, 540, 17], [228, 531, 20], [261, 527, 21], [293, 531, 19], [319, 540, 16],
  [214, 560, 16], [246, 566, 18], [280, 566, 16], [308, 558, 15],
];

/** The ribbon of mist drifting off to the right, towards the toys: a band thinning out along a wave, puffs along its top. */
const RIBBON: Pt[] = [[300, 534], [332, 516], [362, 508], [392, 490], [424, 482], [452, 462], [484, 452], [512, 432], [540, 424], [564, 404]];
const RIBBON_W = [30, 26, 24, 22, 20, 17, 14, 11, 8, 5];
const RIBBON_PUFFS: readonly Puff[] = (() => {
  const out: Puff[] = [];
  let since = Infinity;
  for (let i = 0; i < RIBBON.length - 1; i++) {
    const [a, b] = [RIBBON[i]!, RIBBON[i + 1]!];
    const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
    const len = Math.hypot(dx, dy);
    for (let k = 0; k < len; k += 1) {
      const f = k / len;
      const w = RIBBON_W[i]! + (RIBBON_W[i + 1]! - RIBBON_W[i]!) * f;
      // Big and small in turn.
      const r = w * (out.length % 2 ? 0.36 : 0.46);
      if (since < r * 1.15 || w < 7) {
        since += 1;
        continue;
      }
      since = 0;
      out.push([a[0] + dx * f + (dy / len) * w * 0.26, a[1] + dy * f - (dx / len) * w * 0.26, r]);
    }
  }
  return out;
})();

/** A loose curl of mist (or wind) drawn in a line. */
function swirl(x: number, y: number, r: number, color: string): string {
  return ink(`M${p([x - r, y])}a${n2(r)} ${n2(r * 0.7)} 0 1 1 ${n2(r * 1.4)} ${n2(-r * 0.5)}a${n2(r * 0.5)} ${n2(r * 0.36)} 0 1 0 ${n2(-r * 0.7)} ${n2(r * 0.2)}`, L.fine * 1.2, color, 0.95);
}

/**
 * The mist, a cloud in the cartoon way: every puff's contour first (twice
 * the width, as the fills cover its inner half), then every puff filled and
 * shaded over them, so only the outside keeps a line and the puffs inside
 * show as lobes.
 */
function mist(): string {
  const puffs: Puff[] = [...RIBBON_PUFFS, ...POOL];
  const core = ellipsePath(259, 548, 70, 18);
  const edge = darkOf(TREE.mist, 0.4);
  const band = strandD(RIBBON, RIBBON_W);
  let s = '';
  for (const d of [core, band, ...puffs.map(([x, y, r]) => circle(x, y, r))]) s += `<path d="${d}" fill="none" stroke="${edge}" stroke-width="${L.small * 2}" stroke-linejoin="round"/>`;
  s += `<path d="${core}" fill="${TREE.mist}"/>` + comic(band, TREE.mist, { line: 0, rim: [3, -4], glint: [-1.5, 2], lightFill: TREE.mistLight });
  for (const [x, y, r] of puffs) s += comic(circle(x, y, r), TREE.mist, { line: 0, rim: [r * 0.22, -r * 0.14], glint: [-r * 0.1, r * 0.1], lightFill: TREE.mistLight });
  s += swirl(222, 548, 10, TREE.mistLight) + swirl(270, 556, 11, TREE.mistLight) + swirl(300, 540, 8, TREE.mistLight);
  s += swirl(392, 496, 6, TREE.mistLight) + swirl(478, 454, 5, TREE.mistLight);
  s += ink(open([[566, 404], [576, 392], [570, 382], [560, 388], [564, 396]], 0.8), L.detail, edge);
  return s + sparkle(244, 538, 5) + sparkle(300, 566, 3.5, 0.8) + sparkle(352, 500, 4) + sparkle(470, 446, 4.5) + sparkle(540, 410, 3.5, 0.8);
}

// ------------------------------------------------------------ the card

/** The roses and buds: where each sits, how big, which way it opens. */
const BIG_ROSE = placer([356, 214], 44, 44, 30);
const LEFT_ROSE = placer([150, 206], 34, 34, -68);
const TALL_BUD = placer([268, 196], 36, 46, 8);
const HANGING_BUD = placer([196, 342], 20, 34, 186);

function tree(): string {
  let s = roots() + mist();
  // The branches first, so they grow out from behind the trunk; leaves on them.
  s += branch([[220, 282], [206, 276], [194, 280], [189, 290], [194, 300], [200, 304]], 10, 6);
  s += branch([[226, 238], [214, 232], [200, 226], [186, 220]], 12, 8) + roseLeaf([206, 230], [200, 262], 16);
  s += branch([[236, 304], [258, 290], [282, 276], [306, 264], [328, 254]], 13, 9) + roseLeaf([288, 272], [300, 306], 20) + roseLeaf([262, 288], [250, 318], 16);
  s += branch([[234, 274], [244, 262], [256, 250]], 12, 9);
  s += branch([[205, 130], [197, 118], [192, 104]], 10, 6) + branch([[227, 130], [234, 118], [238, 104]], 10, 6);
  s += trunk();
  s += bud(HANGING_BUD);
  s += bud(TALL_BUD, chick());
  s += rose(LEFT_ROSE) + adrift() + littleBird();
  s += rose(BIG_ROSE, bigBird());
  return s + crystal();
}

/** The rose tree, standing on the floor: its pivot is the trunk's foot. */
export function crystalTree(): PartArt {
  const puffs = [...POOL, ...RIBBON_PUFFS];
  const pts: Pt[] = [...puffs.flatMap(([x, y, r]): Pt[] => [[x - r, y - r], [x + r, y + r]]), [578, 380], [207, 38], [24, 207], [40, 150], [128, 150], [494, 150], [424, 84], [350, 70], [326, 100]];
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const pad = 12;
  const [x0, y0] = [Math.min(...xs) - pad, Math.min(...ys) - pad];
  const [x1, floor] = [Math.max(...xs) + pad, Math.max(...ys)];
  const shadow = `<path d="${ellipsePath(262, floor - 4, 96, 10)}" fill="${TREE.shadow}" opacity="0.16"/>`;
  const body = `<g transform="scale(${SIZE}) translate(${n2(-x0)} ${n2(-y0)})">${shadow}${tree()}</g>`;
  const w = Math.ceil((x1 - x0) * SIZE);
  const h = Math.ceil((floor - y0 + 6) * SIZE);
  return { key: 'p1.tree', w, h, px: Math.round((FOOT_X - x0) * SIZE), py: Math.round((floor - y0) * SIZE), body };
}
