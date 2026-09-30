import { ellipsePath, type Pt } from '../svg';
import { DETAIL, flat, INK } from '../style';
import type { PartArt } from '../rigTypes';
import { ink, part, path, tr, type Box } from './kit';

// Faces. The pose system (animPoses: faceFor/applyFace/applyBrows) swaps the
// eye and mouth shapes by name and scales them (blinks squash the eye,
// surprise widens it, talking opens the mouth), and tilts and lifts the
// brow. Every face therefore provides the same named shapes:
//   <prefix>.eye   + .happy .sad .shut
//   <prefix>.mouth + .smile .open .grin .grit .frown
// A head seen three-quarter keeps both eyes in the one eye part, so blinks
// and emotions move them together.

export type EyeShape = '' | 'happy' | 'sad' | 'shut';
export type MouthShape = '' | 'smile' | 'open' | 'grin' | 'grit' | 'frown';

export const EYE_SHAPES: readonly EyeShape[] = ['', 'happy', 'sad', 'shut'];
export const MOUTH_SHAPES: readonly MouthShape[] = ['', 'smile', 'open', 'grin', 'grit', 'frown'];

const key = (base: string, v: string): string => (v ? `${base}.${v}` : base);

/** All eye shapes of a face; `draw` gets the shape and the part offset. */
export function eyeSet(prefix: string, box: Box, draw: (v: EyeShape, ox: number, oy: number) => string): PartArt[] {
  return EYE_SHAPES.map((v) => part(key(`${prefix}.eye`, v), box, (ox, oy) => draw(v, ox, oy)));
}

/** All mouth shapes of a face. */
export function mouthSet(prefix: string, box: Box, draw: (v: MouthShape, ox: number, oy: number) => string): PartArt[] {
  return MOUTH_SHAPES.map((v) => part(key(`${prefix}.mouth`, v), box, (ox, oy) => draw(v, ox, oy)));
}

const f2 = (n: number): string => (Math.round(n * 100) / 100).toString();

/**
 * One painted eye (the paintings' almond eyes: pale white, dark iris, a thin
 * ink lid). `outer` is the side of the outer corner (-1 left, +1 right),
 * where a sad lid droops. `lid` (0..1) lowers the upper lid at rest.
 */
export function almondEye(
  v: EyeShape,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  o: { outer: -1 | 1; iris: string; white?: string; lid?: number; lidFill?: string; lash?: boolean; pupil?: number; look?: number },
): string {
  const white = o.white ?? '#fbf6ee';
  const w = Math.max(1.3, ry * 0.42);
  if (v === 'happy') return ink(`M${f2(cx - rx)} ${f2(cy + ry * 0.35)}Q${f2(cx)} ${f2(cy - ry * 1.5)} ${f2(cx + rx)} ${f2(cy + ry * 0.35)}`, w * 1.15);
  if (v === 'shut') return ink(`M${f2(cx - rx)} ${f2(cy - ry * 0.1)}Q${f2(cx)} ${f2(cy + ry * 1.0)} ${f2(cx + rx)} ${f2(cy - ry * 0.1)}`, w);
  const almond = `M${f2(cx - rx)} ${f2(cy)}Q${f2(cx)} ${f2(cy - ry * 1.9)} ${f2(cx + rx)} ${f2(cy)}Q${f2(cx)} ${f2(cy + ry * 1.7)} ${f2(cx - rx)} ${f2(cy)}Z`;
  const look = o.look ?? 0.25;
  const ir = ry * 0.9;
  let inner = `<path d="${ellipsePath(cx + rx * look, cy + ry * 0.05, ir * 0.92, ir)}" fill="${o.iris}"/>`;
  inner += `<path d="${ellipsePath(cx + rx * look, cy + ry * 0.05, ir * (o.pupil ?? 0.45), ir * (o.pupil ?? 0.45) * 1.08)}" fill="${INK}"/>`;
  // Upper lid: at rest `lid` covers the top of the eye; a sad lid droops
  // toward the outer corner.
  const lidAt = o.lid ?? 0;
  if (lidAt > 0 || v === 'sad') {
    const top = cy - ry * 0.95;
    const hgt = ry * 1.8;
    const yOuter = top + hgt * (v === 'sad' ? Math.max(lidAt, 0.2) + 0.42 : lidAt);
    const yInner = top + hgt * (v === 'sad' ? Math.max(lidAt - 0.12, 0.04) : lidAt);
    const [xl, xr] = [cx - rx - 2, cx + rx + 2];
    const [yl, yr] = o.outer === -1 ? [yOuter, yInner] : [yInner, yOuter];
    inner += `<path d="M${f2(xl)} ${f2(cy - ry * 2.5)}L${f2(xr)} ${f2(cy - ry * 2.5)}L${f2(xr)} ${f2(yr)}L${f2(xl)} ${f2(yl)}Z" fill="${o.lidFill ?? '#e9c7cf'}"/>`;
    inner += ink(`M${f2(xl)} ${f2(yl)}L${f2(xr)} ${f2(yr)}`, DETAIL);
  }
  let s = flat(almond, white, { stroke: DETAIL * 1.25, inner });
  if (o.lash) {
    const ox = o.outer * rx;
    s += ink(`M${f2(cx + ox)} ${f2(cy)}l${f2(o.outer * 2.2)} ${f2(-1.6)}`, DETAIL);
  }
  return s;
}

/** Mouth shapes in the paintings' manner: ink lines and flat lips/insides. */
export function paintedMouth(v: MouthShape, cx: number, cy: number, m: number, o: { lip?: string; inside?: string; teeth?: string; line?: number; sad?: number }): string {
  const inside = o.inside ?? '#5a2438';
  const teeth = o.teeth ?? '#fbf6ee';
  const lw = o.line ?? DETAIL * 1.15;
  const sad = o.sad ?? 0;
  const P = (x: number, y: number): string => `${f2(cx + x * m)} ${f2(cy + y * m)}`;
  switch (v) {
    case '':
      return ink(`M${P(-1, 0.1 + sad * 0.3)}Q${P(0, -0.12 - sad * 0.3)} ${P(1, 0.08 + sad * 0.3)}`, lw);
    case 'smile':
      return (o.lip ? flat(`M${P(-1, -0.1)}Q${P(0, 0.9)} ${P(1, -0.2)}Q${P(0, 0.4)} ${P(-1, -0.1)}Z`, o.lip, { stroke: DETAIL }) : '') + ink(`M${P(-1, -0.12)}Q${P(0, 0.75)} ${P(1, -0.22)}`, lw);
    case 'open':
      return flat(ellipsePath(cx, cy + m * 0.1, m * 0.55, m * 0.7), inside, { stroke: DETAIL * 1.2, inner: `<path d="${ellipsePath(cx, cy + m * 0.62, m * 0.38, m * 0.22)}" fill="${o.lip ?? '#e98aa8'}"/>` });
    case 'grin':
      return flat(`M${P(-1.05, -0.25)}Q${P(0, 1.25)} ${P(1.05, -0.3)}Q${P(0, 0.05)} ${P(-1.05, -0.25)}Z`, inside, {
        stroke: DETAIL * 1.2,
        inner: `<path d="M${P(-1.1, -0.35)}Q${P(0, 0.2)} ${P(1.1, -0.4)}L${P(1.1, -0.9)}L${P(-1.1, -0.9)}Z" fill="${teeth}"/>` + ink(`M${P(-1.05, -0.2)}Q${P(0, 0.2)} ${P(1.05, -0.25)}`, DETAIL * 0.8),
      });
    case 'grit':
      return flat(`M${P(-1, -0.38)}L${P(1, -0.38)}L${P(1, 0.38)}L${P(-1, 0.38)}Z`, teeth, {
        stroke: DETAIL * 1.2,
        over: ink(`M${P(-0.95, 0)}H${f2(cx + m * 0.95)}M${P(-0.35, -0.38)}V${f2(cy + m * 0.38)}M${P(0.35, -0.38)}V${f2(cy + m * 0.38)}`, DETAIL * 0.8),
      });
    case 'frown':
      return ink(`M${P(-1, 0.4)}Q${P(0, -0.45)} ${P(1, 0.35)}`, lw);
  }
}

/**
 * A brow part (pivot at its middle), authored for a right-facing head: the
 * inner end (toward the nose) is on the right. `sad` tilts it at rest.
 */
export function browPart(k: string, fill: string, len: number, thick: number, o: { sad?: number; stroke?: number } = {}): PartArt {
  const hl = len / 2;
  const tilt = o.sad ?? 0;
  return part(k, { x0: -hl - 2, y0: -thick - 3, x1: hl + 2, y1: thick + 3 }, (ox, oy) => {
    const pts: Pt[] = [
      [-hl, 0.6 + tilt * 0.4],
      [-hl * 0.2, -0.7],
      [hl * 0.5, -0.5 - tilt * 0.8],
      [hl, 0.3 - tilt * 1.2],
    ];
    const t = tr(pts, ox, oy);
    // A tapered stroke: thick at the inner end.
    const top = t.map(([x, y], i): Pt => [x, y - (thick * (0.35 + 0.65 * (i / 3))) / 2]);
    const bot = t.map(([x, y], i): Pt => [x, y + (thick * (0.35 + 0.65 * (i / 3))) / 2]).reverse();
    const d = `${path(top)}L${bot.map(([x, y]) => `${f2(x)} ${f2(y)}`).join('L')}Z`;
    return flat(d, fill, { stroke: o.stroke ?? DETAIL * 1.1 });
  });
}

// ------------------------------------------------ generic sets (older rigs)

/**
 * A simple dark-eyed face set for small heads (the torch-bearer): a dark
 * almond, a smiling arc, a lidded eye and a squeezed line.
 */
export function eyeParts(prefix: string, rx: number, ry: number, iris = '#3a2d3f'): PartArt[] {
  const box = { x0: -rx - 2.5, y0: -ry * 2 - 1, x1: rx + 2.5, y1: ry * 1.8 + 1 };
  return eyeSet(prefix, box, (v, ox, oy) => almondEye(v, ox, oy, rx, ry, { outer: -1, iris, look: 0.3, pupil: 0.5 }));
}

export function mouthParts(prefix: string, half: number, lip: string, inside: string): PartArt[] {
  const m = half;
  const box = { x0: -m * 1.2 - 2, y0: -m - 2, x1: m * 1.2 + 2, y1: m * 1.3 + 2 };
  return mouthSet(prefix, box, (v, ox, oy) => paintedMouth(v, ox, oy, m, { lip, inside }));
}

/** Legacy name kept for other modules. */
export function brow(k: string, fill: string, len: number, thick: number, _far = false): PartArt {
  return browPart(k, fill, len, thick);
}
