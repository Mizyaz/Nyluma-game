import { comic, comicLimb, ink, roundPoly } from '../content/characters/kit';
import { CHILD } from '../content/characters/gortiChild';
import type { Pt } from '../render/2d/svg';
import { darkOf, lightOf, lineFor, PASTEL } from '../render/2d/style';
import { TOUCH } from '../tuning';

// The on-screen controls, drawn by hand in the game's comic manner with the
// characters' own kit: pastel paper discs with contours in each fill's own
// darker tone (never black), a cel shadow low-left, a glint high-right and,
// laid over them by CSS, the paper grain. Each drawing is an inline SVG in a
// 100 × 100 box centred on 0,0.

const LOOK = TOUCH.look;
const r2 = (n: number): number => Math.round(n * 100) / 100;

function svg(body: string, cls = 'art'): string {
  return `<svg class="${cls}" viewBox="-50 -50 100 100" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** A circle as path data (the kit shades paths). */
function circle(r: number, cx = 0, cy = 0): string {
  return `M${r2(cx - r)} ${r2(cy)}A${r} ${r} 0 1 0 ${r2(cx + r)} ${r2(cy)}A${r} ${r} 0 1 0 ${r2(cx - r)} ${r2(cy)}Z`;
}

/** A white tick of light high on the right of a disc of radius r. */
function glint(r: number): string {
  const a0 = -0.42 * Math.PI;
  const a1 = -0.16 * Math.PI;
  const R = r * 0.78;
  const p = (a: number): string => `${r2(Math.cos(a) * R)} ${r2(Math.sin(a) * R)}`;
  return `<path d="M${p(a0)}A${R} ${R} 0 0 1 ${p(a1)}" fill="none" stroke="#fffdf6" stroke-width="${r2(r * 0.075)}" stroke-linecap="round" opacity="0.9"/>` + `<circle cx="${r2(Math.cos(-0.07 * Math.PI) * R)}" cy="${r2(Math.sin(-0.07 * Math.PI) * R)}" r="${r2(r * 0.045)}" fill="#fffdf6" opacity="0.85"/>`;
}

/** A paper disc in the comic manner. */
function disc(fill: string, r = 45): string {
  return comic(circle(r), fill, { line: 2.6, rim: [r * 0.17, -r * 0.17], glint: [-r * 0.06, r * 0.06], hatch: 3.6, hatchWidth: 0.8, top: glint(r) });
}

/** A four-pointed sparkle. */
function sparkle(x: number, y: number, s: number, fill: string): string {
  const d = `M${x} ${y - s}Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y}Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s}Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y}Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s}Z`;
  return `<path d="${d}" fill="${fill}" stroke="${lineFor(fill)}" stroke-width="1.2" stroke-linejoin="round"/>`;
}

// ---------------------------------------------------------------- Zıpla

/**
 * Gorti mid-hop: the TV head with his two glowing marks, the sage body,
 * root arms thrown up and knees tucked, a dotted arc behind him from the
 * puff of dust he left, and his shadow small on the floor below.
 */
function hop(bg: string): string {
  const line = lineFor(bg);
  const root = CHILD.root;
  let s = '';
  // His shadow on the floor, small: he is up in the air.
  s += `<ellipse cx="4" cy="35" rx="11" ry="2.8" fill="${darkOf(bg, 0.32)}" opacity="0.6"/>`;
  // The puff he left and the dotted arc of the hop.
  s += comic(circle(4.4, -28, 29), PASTEL.cream, { line: 1.5, rim: [1.2, -1.2] }) + comic(circle(3.1, -21.5, 31.5), PASTEL.cream, { line: 1.4 });
  s += `<path d="M-26 22Q-24 2 -12 -6" fill="none" stroke="${line}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.1 5.2" opacity="0.85"/>`;
  // Gorti, leaning into the hop.
  let g = '';
  // Far leg and arm first (a little darker), then the body, then the near ones.
  g += comicLimb([-1, 9], [5, 14], 5.2, 4.6, darkOf(root, 0.12), { line: 1.5 });
  g += comicLimb([5, 14], [-1, 20], 4.6, 4, darkOf(root, 0.12), { line: 1.5 });
  g += comicLimb([-3, -2], [-11, -12], 4.4, 3.6, darkOf(root, 0.12), { line: 1.5 });
  g += comic(roundPoly([[-7, -5], [8, -5], [9, 10], [-7, 11]], 4.5), CHILD.body, { line: 1.8, rim: [2.4, -1.4], glint: [-0.8, 0.8] });
  g += comicLimb([4, 9], [12, 11], 5.4, 4.8, root, { line: 1.6 });
  g += comicLimb([12, 11], [8, 19], 4.8, 4.2, root, { line: 1.6 });
  g += comicLimb([6, -3], [15, -12], 4.6, 3.8, root, { line: 1.6 });
  // The helmet head: its side plane, the box, the dark screen and his two marks.
  g += comic(roundPoly([[-17, -33], [-10, -35], [-10, -9], [-17, -10]], 2), CHILD.boxSide, { line: 1.7 });
  g += comic(roundPoly([[-11, -36], [16, -36], [17, -9], [-11, -8]], 4.5), CHILD.box, { line: 2, rim: [2.6, -1.6], glint: [-0.9, 0.9] });
  g += `<path d="${roundPoly([[-6.5, -31], [12, -31], [12.5, -13.5], [-6.5, -13]], 3)}" fill="${CHILD.screen}" stroke="${CHILD.bezel}" stroke-width="1.3"/>`;
  for (const x of [-1.5, 6.5]) {
    g += `<rect x="${x - 2.6}" y="-27.2" width="5.2" height="6" rx="1" fill="${CHILD.glow}" opacity="0.45"/>`;
    g += `<rect x="${x - 1.6}" y="-26.2" width="3.2" height="4" rx="0.6" fill="${CHILD.neon}"/>`;
    g += `<rect x="${x - 0.6}" y="-25.4" width="1.2" height="1.6" fill="${CHILD.core}"/>`;
  }
  s += `<g transform="translate(3 2) scale(1.1) rotate(9 2 0)">${g}</g>`;
  return s;
}

// ---------------------------------------------------------------- Rezonans / İncele

function starPts(cx: number, cy: number, ro: number, ri: number, rot: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < 10; i++) {
    const a = rot + (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 ? ri : ro;
    pts.push([r2(cx + Math.cos(a) * r), r2(cy + Math.sin(a) * r)]);
  }
  return pts;
}

/** The Rezonans star: butter, plump, with two sparkles flying off it. */
function star(): string {
  const d = roundPoly(starPts(-1, 2, 27, 12.5, -0.12), [3.2, 2, 3.2, 2, 3.2, 2, 3.2, 2, 3.2, 2]);
  return comic(d, PASTEL.butter, { line: 2.3, rim: [3.4, -3], glint: [-1.4, 1.4], hatch: 2.6 }) + sparkle(25, -22, 6.5, '#fffdf6') + sparkle(-27, 21, 4.5, PASTEL.pink);
}

/** İncele: a magnifying glass with a pale lens and a coral handle. */
function magnifier(): string {
  let s = comicLimb([7, 8], [24, 25], 8, 7, PASTEL.coral, { line: 2 });
  const ring = `${circle(17, -5, -5)}${circle(11.5, -5, -5)}`;
  s += comic(circle(12, -5, -5), lightOf(PASTEL.aqua, 0.45), { line: 0 });
  s += `<path d="M-12 -9A8 8 0 0 1 -6 -14" fill="none" stroke="#fffdf6" stroke-width="2.6" stroke-linecap="round"/>`;
  s += `<path d="${ring}" fill-rule="evenodd" fill="${PASTEL.sand}" stroke="${lineFor(PASTEL.sand)}" stroke-width="2.2" stroke-linejoin="round"/>`;
  return s;
}

/** Konuş: a paper speech balloon with three dots. */
function balloon(bg: string): string {
  const d = 'M-22 -14C-22 -24 -14 -27 0 -27C15 -27 23 -23 23 -12C23 -1 15 4 2 4L-6 4L-15 14L-12 3C-19 1 -22 -5 -22 -14Z';
  const dot = darkOf(bg, 0.55);
  let s = comic(d, '#fffaf2', { line: 2.2, rim: [2.4, -2], glint: [-1, 1] });
  for (const x of [-10, 0, 10]) s += `<circle cx="${x}" cy="-12" r="3.3" fill="${dot}"/>`;
  return `<g transform="translate(1 7)">${s}</g>`;
}

/** Yık: a crystal split in two, a chip flying off it. */
function cracked(): string {
  const fill = PASTEL.lilac;
  const left = roundPoly([[-4, -28], [-6, -10], [-1, -2], [-7, 8], [-3, 24], [-17, 24], [-21, -4]], 2);
  const right = roundPoly([[1, -30], [16, -6], [12, 24], [3, 24], [7, 9], [1, -1], [5, -12]], 2);
  let s = `<g transform="rotate(-9 -10 24)">${comic(left, fill, { line: 2, rim: [2.6, -2], glint: [-0.8, 0.8] })}</g>`;
  s += `<g transform="rotate(8 8 24)">${comic(right, lightOf(fill, 0.25), { line: 2, rim: [2.6, -2], glint: [-0.8, 0.8] })}</g>`;
  s += comic(roundPoly([[18, -26], [25, -22], [21, -16]], 1), lightOf(fill, 0.4), { line: 1.5 });
  s += ink('M-24 -20L-30 -24M-26 -10L-33 -10M24 -2L31 0', 2.4, darkOf(PASTEL.apricot, 0.5));
  return s;
}

// ---------------------------------------------------------------- chips

/** Biçim: two arrows chasing each other round (root ⇄ human). */
function cycle(bg: string): string {
  const c = darkOf(bg, 0.62);
  const arc = (a0: number, a1: number): string => {
    const R = 17;
    const p = (a: number): Pt => [r2(Math.cos(a) * R), r2(Math.sin(a) * R)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    // Arrowhead at the end, along the tangent.
    const t: Pt = [-Math.sin(a1), Math.cos(a1)];
    const n: Pt = [Math.cos(a1), Math.sin(a1)];
    const h1: Pt = [r2(x1 - t[0] * 7 + n[0] * 5), r2(y1 - t[1] * 7 + n[1] * 5)];
    const h2: Pt = [r2(x1 - t[0] * 7 - n[0] * 5), r2(y1 - t[1] * 7 - n[1] * 5)];
    return ink(`M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}`, 5, c) + `<path d="M${h1[0]} ${h1[1]}L${x1} ${y1}L${h2[0]} ${h2[1]}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  return arc(Math.PI * 1.05, Math.PI * 1.8) + arc(Math.PI * 0.05, Math.PI * 0.8);
}

/** Şarkı: two beamed notes. */
function notes(bg: string): string {
  const c = darkOf(bg, 0.6);
  const head = (x: number, y: number): string => `<ellipse cx="${x}" cy="${y}" rx="6.4" ry="4.8" transform="rotate(-24 ${x} ${y})" fill="${c}"/>`;
  return head(-9, 13) + head(10, 9) + ink('M-3.6 12V-15M15.4 8V-19', 3.4, c) + `<path d="M-5.3 -16L17 -21V-14L-5.3 -9Z" fill="${c}"/>`;
}

/** Nefes: a breath curling out. */
function breath(bg: string): string {
  const c = darkOf(bg, 0.6);
  return ink('M-20 4C-10 4 -4 -2 4 -2C13 -2 15 10 7 11C1 12 0 4 6 3', 4, c) + ink('M-18 14C-8 14 6 15 18 10', 3.4, c, 0.75) + `<circle cx="20" cy="-8" r="2.6" fill="${c}"/><circle cx="14" cy="-16" r="1.8" fill="${c}"/>`;
}

// ---------------------------------------------------------------- the stick

/** A ring sector (radius r0 to r1, centred on angle a, ±half), for the dial's lit directions. */
function sector(a: number, half: number, r0: number, r1: number): string {
  const p = (r: number, t: number): string => `${r2(Math.cos(t) * r)} ${r2(Math.sin(t) * r)}`;
  return `M${p(r0, a - half)}L${p(r1, a - half)}A${r1} ${r1} 0 0 1 ${p(r1, a + half)}L${p(r0, a + half)}A${r0} ${r0} 0 0 0 ${p(r0, a - half)}Z`;
}

/** A plump chevron pointing along angle a, its tip at radius r. */
function chevron(a: number, r: number, s: number): string {
  const c = Math.cos(a);
  const n = Math.sin(a);
  const pt = (along: number, across: number): string => `${r2(c * along - n * across)} ${r2(n * along + c * across)}`;
  return `M${pt(r - s, -s)}L${pt(r, 0)}L${pt(r - s, s)}`;
}

/**
 * The walking dial: a cream paper disc with a well for the knob, little
 * ticks round its rim, and four marks. Left and right are bold (walking);
 * up is small and down is big, as the room recedes away from the viewer
 * and comes toward them (walking in depth). The lit sectors show where the
 * thumb points (CSS lights them).
 */
export function stickArt(): string {
  const base = LOOK.stick;
  const line = lineFor(base);
  let s = disc(base, 46);
  const dirs: [string, number, number, string][] = [
    ['l', Math.PI, 8.5, LOOK.walk],
    ['r', 0, 8.5, LOOK.walk],
    ['u', -Math.PI / 2, 5.5, LOOK.depth],
    ['d', Math.PI / 2, 7.2, LOOK.depth],
  ];
  for (const [k, a, , fill] of dirs) s += `<path class="wedge ${k}" d="${sector(a, 0.62, 25, 43)}" fill="${fill}"/>`;
  // The well the knob rests in.
  s += `<circle r="24" fill="${darkOf(base, 0.07)}" stroke="${line}" stroke-width="1.2" stroke-dasharray="2.4 3.2" opacity="0.9"/>`;
  // Ticks round the rim, between the marks.
  let ticks = '';
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) continue;
    const a = (i * Math.PI) / 8;
    ticks += `M${r2(Math.cos(a) * 36)} ${r2(Math.sin(a) * 36)}L${r2(Math.cos(a) * 40.5)} ${r2(Math.sin(a) * 40.5)}`;
  }
  s += `<path d="${ticks}" stroke="${line}" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/>`;
  for (const [k, a, size] of dirs) s += `<path class="mark ${k}" d="${chevron(a, 40, size)}" fill="none" stroke-width="${k === 'u' ? 3.4 : 4.2}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return svg(s);
}

/** The dial's mark colours (CSS custom properties): at rest, and lit for walking along and in depth. */
export function stickInks(): Record<'--mark' | '--mark-walk' | '--mark-depth', string> {
  return { '--mark': lineFor(LOOK.stick), '--mark-walk': darkOf(LOOK.walk, 0.55), '--mark-depth': darkOf(LOOK.depth, 0.5) };
}

/** The knob: a mint paper button with ridges for the thumb. */
export function knobArt(): string {
  const fill = LOOK.knob;
  const ridge = darkOf(fill, 0.42);
  let s = disc(fill, 44);
  for (const y of [-9, 0, 9]) s += ink(`M-15 ${y + 2}Q0 ${y - 3} 15 ${y + 2}`, 3, ridge, 0.75);
  return svg(s);
}

// ---------------------------------------------------------------- buttons

export type ButtonArt = 'jump' | 'move' | 'inspect' | 'talk' | 'break' | 'form' | 'song' | 'focus';

const ICON: Record<ButtonArt, (bg: string) => string> = {
  jump: hop,
  move: star,
  inspect: magnifier,
  talk: balloon,
  break: cracked,
  form: cycle,
  song: notes,
  focus: breath,
};

/** A round button's drawing. */
export function buttonArt(kind: ButtonArt): string {
  const bg = LOOK[kind];
  return svg(disc(bg) + ICON[kind](bg), `art ${kind}`);
}

/** The contour colour of a control (its label tag is edged with it). */
export function edgeOf(kind: ButtonArt | 'stick' | 'knob'): string {
  return lineFor(LOOK[kind]);
}
