import { darkOf, lightOf, lineFor, LINE, PASTEL, SHADE } from '../../render/2d/style';
import { Rng, smooth, type Pt } from '../../render/2d/svg';
import { comic, fold, ink } from '../characters/kit';

// The stagecraft of the paper theatre the rooms are played in (the scene
// changes between rooms and chapters, src/paper/theatre.ts): the two painted
// flats that roll in from the wings, the drop curtain with its fringed hem,
// and the paper of the chapter's title card. Drawn by hand in the comic
// manner: pastel fills, contours in each fill's own darker tone, cel shadows
// low on the left and glints high on the right (the light comes from the
// upper right), light hatching in the shade. The flats and the curtain are
// tiles: a body that repeats, and the decorated edge it ends in.
//
// Units are world px at the depth they stand at (the theatre prints them at
// the screen's own scale there).

const r2 = (n: number): string => (Math.round(n * 100) / 100).toString();

/** The theatre's colours. */
export const THEATRE = {
  /** The flats' painted paper, the little things printed on it, their border and its cut edge. */
  flat: '#f3e6d2',
  motifs: [PASTEL.lilac, PASTEL.teal, PASTEL.pink, PASTEL.butter] as readonly string[],
  trim: PASTEL.periwinkle,
  trimLine: PASTEL.cream,
  /** The drop curtain, its braid and fringe. */
  curtain: '#7a4a7e',
  braid: PASTEL.butter,
  /** The white core of cut paper. */
  core: '#fffaf1',
  /** Shadows the sheets throw (drawn see-through). */
  shadow: '#2a2238',
  /** The title card's paper and its ledge. */
  card: '#fbf3e4',
  ledge: PASTEL.sand,
  /** The threads the card hangs on: a pale thread, inked along its side. */
  thread: '#4a3550',
  threadLight: '#f1e6cf',
} as const;

/** A tile: its size (world px) and its markup. */
export interface Tile {
  w: number;
  h: number;
  body: string;
}

/** The flats' body: painted paper with little crystals, stars and dots on it (repeats both ways). */
export const FLAT_TILE = 168;

export function flatTile(seed = 7): Tile {
  const s = FLAT_TILE;
  const rng = new Rng(seed);
  let body = `<rect x="0" y="0" width="${s}" height="${s}" fill="${THEATRE.flat}"/>`;
  // A faint wash of painted stripes (the flat's canvas), the same at every edge.
  for (let x = 0; x < s; x += 28) body += `<rect x="${x}" y="0" width="14" height="${s}" fill="${darkOf(THEATRE.flat, 0.05)}" opacity="0.5"/>`;
  // The motifs sit on a loose grid, well inside the tile so they never cross its edge.
  const cells = 3;
  const step = s / cells;
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const cx = step * (i + 0.5) + rng.range(-8, 8);
      const cy = step * (j + 0.5) + rng.range(-8, 8) + (i % 2 ? step * 0.25 : -step * 0.1);
      const y = Math.max(16, Math.min(s - 16, cy));
      const fill = THEATRE.motifs[(i + j * 2) % THEATRE.motifs.length]!;
      const k = (i * cells + j) % 3;
      if (k === 0) body += crystal(cx, y, rng.range(11, 14), fill, rng.range(-0.3, 0.3));
      else if (k === 1) body += star(cx, y, rng.range(6, 8), fill);
      else body += `<circle cx="${r2(cx)}" cy="${r2(y)}" r="${r2(rng.range(2.4, 3.4))}" fill="${fill}" stroke="${lineFor(fill)}" stroke-width="${LINE.fine}"/>`;
    }
  }
  return { w: s, h: s, body };
}

/** A little crystal printed on the flat. */
function crystal(x: number, y: number, h: number, fill: string, lean: number): string {
  const w = h * 0.42;
  const c = Math.cos(lean);
  const sn = Math.sin(lean);
  const P = (u: number, v: number): string => `${r2(x + u * c - v * sn)} ${r2(y + u * sn + v * c)}`;
  const d = `M${P(0, -h)}L${P(w, -h * 0.3)}L${P(w * 0.7, h * 0.6)}L${P(0, h)}L${P(-w * 0.7, h * 0.6)}L${P(-w, -h * 0.3)}Z`;
  return comic(d, fill, { line: LINE.small, rim: [w * 0.35, -w * 0.15], glint: [-w * 0.18, w * 0.18], over: fold(`M${P(0, -h)}L${P(0, h)}`, darkOf(fill, 0.3), LINE.fine) });
}

/** A four-pointed star. */
function star(x: number, y: number, r: number, fill: string): string {
  const k = r * 0.26;
  const d = `M${r2(x)} ${r2(y - r)}Q${r2(x + k)} ${r2(y - k)} ${r2(x + r)} ${r2(y)}Q${r2(x + k)} ${r2(y + k)} ${r2(x)} ${r2(y + r)}Q${r2(x - k)} ${r2(y + k)} ${r2(x - r)} ${r2(y)}Q${r2(x - k)} ${r2(y - k)} ${r2(x)} ${r2(y - r)}Z`;
  return comic(d, fill, { line: LINE.detail, glint: [-r * 0.12, r * 0.12] });
}

/** The flat's edge: how wide its painted border and scallops are, and how often the scallops repeat (a tile repeats down the edge). */
export const FLAT_EDGE = { w: 58, h: 168, border: 30, period: 42 } as const;

/**
 * The scalloped cut edge of a flat as one closed path over a tile and beyond
 * it: from its border at `left` out to round tongues `reach` past `x0`. `dir`
 * 1: the edge of the left flat (its tongues point right), -1: of the right
 * flat (mirrored inside a tile `w` wide, so its light still comes from the
 * upper right).
 */
function scallops(left: number, x0: number, reach: number, period: number, h: number, w: number, dir: 1 | -1): string {
  const X = (x: number): string => r2(dir > 0 ? x : w - x);
  const r = period / 2;
  let d = `M${X(left)} ${r2(-period)}L${X(x0)} ${r2(-period)}`;
  for (let y = -period; y < h + period; y += period) {
    // A round tongue, then a little notch.
    d += `C${X(x0 + reach * 1.15)} ${r2(y + r * 0.1)} ${X(x0 + reach * 1.15)} ${r2(y + period - r * 0.25)} ${X(x0 + 2)} ${r2(y + period - 2)}`;
    d += `L${X(x0)} ${r2(y + period)}`;
  }
  return `${d}L${X(left)} ${r2(h + period)}Z`;
}

/** A flat's edge tile (1: the left flat's, -1: the right one's): the body's paper, a painted border, the scallops cut out of it (the paper's white core showing at the cut). */
export function flatEdge(dir: 1 | -1): Tile {
  const E = FLAT_EDGE;
  const reach = E.w - E.border - 4;
  const trim = THEATRE.trim;
  const X = (x: number): number => (dir > 0 ? x : E.w - x);
  const edge0 = 6;
  const cut = scallops(edge0, E.border, reach, E.period, E.h, E.w, dir);
  const inner = scallops(edge0 + 0.6, E.border - 0.6, reach - 2.4, E.period, E.h, E.w, dir);
  let body = `<rect x="${dir > 0 ? 0 : E.w - edge0 - 1}" y="0" width="${edge0 + 1}" height="${E.h}" fill="${THEATRE.flat}"/>`;
  // The cut: the white core, then the painted face a hair inside it.
  body += `<path d="${cut}" fill="${THEATRE.core}"/>`;
  body += comic(inner, trim, {
    line: 0,
    rim: [3.2, -1.2],
    glint: [-1.4, 1.4],
    hatch: 2.6,
    over:
      // A cream line painted along the border, dots on the tongues.
      ink(`M${r2(X(edge0 + 8))} ${-E.period}V${E.h + E.period}`, 1.6, THEATRE.trimLine, 0.9) +
      Array.from({ length: Math.round(E.h / E.period) + 2 }, (_, i) => {
        const y = (i - 1) * E.period + E.period / 2;
        return `<circle cx="${r2(X(E.border + reach * 0.42))}" cy="${r2(y)}" r="2.6" fill="${THEATRE.trimLine}" stroke="${lineFor(trim)}" stroke-width="${LINE.fine}"/>`;
      }).join(''),
  });
  body += `<path d="${cut}" fill="none" stroke="${lineFor(trim)}" stroke-width="${LINE.small}" stroke-linejoin="round"/>`;
  return { w: E.w, h: E.h, body };
}

/** The silhouette of a flat's edge tile, for its shadow. */
export function flatEdgeShadow(dir: 1 | -1): Tile {
  const E = FLAT_EDGE;
  return { w: E.w, h: E.h, body: `<path d="${scallops(0, E.border, E.w - E.border - 4, E.period, E.h, E.w, dir)}" fill="${THEATRE.shadow}"/>` };
}

/** The drop curtain's pleats (a tile repeats across; the folds hang straight, so it repeats down too). */
export const PLEAT = { w: 76, h: 120 } as const;

export function curtainTile(): Tile {
  const { w, h } = PLEAT;
  const c = THEATRE.curtain;
  const lit = lightOf(c, 0.22);
  const deep = darkOf(c, 0.3);
  // One pleat: the fold's crest lit from the right, its trough in shade on the left.
  let body = `<rect x="0" y="0" width="${w}" height="${h}" fill="${c}"/>`;
  body += `<rect x="0" y="0" width="${w * 0.24}" height="${h}" fill="${deep}"/>`;
  body += `<rect x="${w * 0.24}" y="0" width="${w * 0.1}" height="${h}" fill="${darkOf(c, 0.14)}"/>`;
  body += `<rect x="${w * 0.52}" y="0" width="${w * 0.26}" height="${h}" fill="${lit}"/>`;
  body += `<rect x="${w * 0.6}" y="0" width="${w * 0.07}" height="${h}" fill="${lightOf(c, 0.4)}"/>`;
  // The folds inked in the curtain's own dark tone, a light hatching in the trough.
  body += fold(`M${r2(w * 0.24)} 0V${h}M${r2(w * 0.995)} 0V${h}`, lineFor(c), LINE.small);
  body += fold(`M${r2(w * 0.78)} 0V${h}`, darkOf(c, 0.2), LINE.detail);
  let hatch = '';
  for (let y = -12; y < h + 12; y += 9) hatch += `M1 ${y + 10}L${r2(w * 0.22)} ${y}`;
  body += `<path d="${hatch}" fill="none" stroke="${darkOf(c, 0.45)}" stroke-width="${LINE.fine}" opacity="0.7"/>`;
  return { w, h, body };
}

/** The curtain's hem: the pleats end in a braided band, its scalloped edge and a tassel under each pleat (a tile repeats across). */
export const HEM = { w: PLEAT.w, h: 76, band: 22 } as const;

function hemPath(o = 0): string {
  const { w, band } = HEM;
  const y = 18 + band;
  // The band's lower edge swags between the pleats.
  return `M${-o} 0H${w + o}V${y}Q${r2(w * 0.75)} ${y + 9} ${r2(w * 0.5)} ${y + 3}Q${r2(w * 0.25)} ${y + 9} ${-o} ${y}Z`;
}

export function hemTile(): Tile {
  const { w, h, band } = HEM;
  const c = THEATRE.curtain;
  const b = THEATRE.braid;
  // The pleats run on into the hem, the band hides their ends.
  let body = `<clipPath id="hemc"><path d="${hemPath()}"/></clipPath><g clip-path="url(#hemc)">${curtainTile().body}</g>`;
  const y0 = 18;
  const bandD = `M0 ${y0}H${w}V${y0 + band}Q${r2(w * 0.75)} ${y0 + band + 9} ${r2(w * 0.5)} ${y0 + band + 3}Q${r2(w * 0.25)} ${y0 + band + 9} 0 ${y0 + band}Z`;
  body += `<path d="M-2 ${y0 - 1.6}H${w + 2}" stroke="${THEATRE.core}" stroke-width="2.2"/>`;
  body += comic(bandD, b, {
    line: LINE.small,
    rim: [0, -3],
    glint: [0, 1.6],
    // The braid's twist.
    over: Array.from({ length: 7 }, (_, i) => fold(`M${r2(i * (w / 6) - 4)} ${y0 + band - 3}L${r2(i * (w / 6) + 6)} ${y0 + 4}`, darkOf(b, 0.28), LINE.detail)).join(''),
  });
  // A tassel under the pleat's crest.
  const tx = w * 0.62;
  const ty = y0 + band + 4;
  body += fold(`M${r2(tx)} ${ty - 4}V${ty + 6}`, darkOf(b, 0.4), LINE.detail);
  body += comic(`M${r2(tx - 4)} ${ty + 4}Q${r2(tx)} ${ty + 1} ${r2(tx + 4)} ${ty + 4}L${r2(tx + 7)} ${h - 8}Q${r2(tx)} ${h - 3} ${r2(tx - 7)} ${h - 8}Z`, b, {
    line: LINE.small,
    rim: [2.4, -1],
    glint: [-1, 1],
    over: fold(`M${r2(tx - 3)} ${ty + 12}L${r2(tx - 4)} ${h - 9}M${r2(tx + 1)} ${ty + 12}V${h - 7}M${r2(tx + 4)} ${ty + 12}L${r2(tx + 5)} ${h - 9}`, darkOf(b, 0.3), LINE.fine),
  });
  body += comic(`M${r2(tx - 5)} ${ty + 6}H${r2(tx + 5)}V${ty + 11}H${r2(tx - 5)}Z`, lightOf(c, 0.2), { line: LINE.detail });
  return { w, h, body };
}

/** The hem's silhouette (for the shadow it throws). */
export function hemShadow(): Tile {
  const { w, h, band } = HEM;
  const y0 = 18;
  const tx = w * 0.62;
  const ty = y0 + band + 4;
  return {
    w,
    h,
    body:
      `<path d="M0 0H${w}V${y0 + band}Q${r2(w * 0.75)} ${y0 + band + 9} ${r2(w * 0.5)} ${y0 + band + 3}Q${r2(w * 0.25)} ${y0 + band + 9} 0 ${y0 + band}Z" fill="${THEATRE.shadow}"/>` +
      `<path d="M${r2(tx - 4)} ${ty + 4}L${r2(tx + 7)} ${h - 8}Q${r2(tx)} ${h - 3} ${r2(tx - 7)} ${h - 8}Z" fill="${THEATRE.shadow}"/>`,
  };
}

/** A thread's eyelet on the title card: a little paper ring, punched. */
export function eyelet(x: number, y: number, r: number): string {
  return comic(`M${r2(x - r)} ${r2(y)}A${r2(r)} ${r2(r)} 0 1 0 ${r2(x + r)} ${r2(y)}A${r2(r)} ${r2(r)} 0 1 0 ${r2(x - r)} ${r2(y)}Z`, PASTEL.butter, {
    line: LINE.small,
    glint: [-r * 0.15, r * 0.15],
    over: `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r * 0.42)}" fill="${THEATRE.thread}"/>`,
  });
}

/** A strip of torn paper tape (holds the title card's corners). */
export function tape(x: number, y: number, w: number, h: number, rot: number, seed: number): string {
  const rng = new Rng(seed);
  const pts: Pt[] = [];
  const n = 5;
  for (let i = 0; i <= n; i++) pts.push([-w / 2 + (w * i) / n, -h / 2 + rng.range(-0.8, 0.8)]);
  pts.push([w / 2 + rng.range(-1, 1), 0]);
  for (let i = n; i >= 0; i--) pts.push([-w / 2 + (w * i) / n, h / 2 + rng.range(-0.8, 0.8)]);
  pts.push([-w / 2 + rng.range(-1, 1), 0]);
  const d = smooth(pts, 0.2, true);
  return `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})"><path d="${d}" fill="${PASTEL.blush}" opacity="0.85" stroke="${lineFor(PASTEL.blush)}" stroke-width="${LINE.fine}"/></g>`;
}

/** Shade colour used by the card's hatching. */
export const CARD_HATCH = SHADE.hatch;
