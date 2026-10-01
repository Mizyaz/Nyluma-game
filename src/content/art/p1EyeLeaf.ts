import type { PartArt } from '../../render/2d/rig/rigTypes';
import { darkOf } from '../../render/2d/style';
import { ellipsePath, poly, smooth, type Pt } from '../../render/2d/svg';
import { comic, ink } from '../characters/kit';

// The eye-leaf. In the first painting the big Gorti holds it out at his side:
// a lilac leaf cracked into seven plates whose cracks all run to an eye at
// its heart, under a heavy purple lid, with a red iris. Here it lies on the
// 14th Room's floor, turned a little to rest on its lower edge.
//
// Drawn in the game's comic manner with the characters' kit, as the rose
// tree is: each plate its own slab, shaded and veined, the cracks between
// them, the eye big and heavy-lidded. Drawn in the painting's measure (the
// leaf about 265 across), then shrunk to Gorti's.

/** The leaf's colours (chosen by eye). */
const LEAF = {
  right: '#caa3cd',
  lowerRight: '#d4add6',
  bottom: '#d0a9d3',
  lowerLeft: '#d8b3da',
  upperLeft: '#b994bd',
  top: '#c6a0c8',
  upperRight: '#c39bc6',
  crack: '#5e3c6b',
  edge: '#6a4576',
  stem: '#e9c8df',
  stemCut: '#f6e2ee',
  lid: '#9a6aa3',
  socket: '#74487f',
  white: '#fbf1f6',
  iris: '#d64a83',
  pupil: '#3b1734',
  shadow: '#4a3550',
} as const;

/** How much smaller than the painting's measure it is drawn. */
const SIZE = 0.36;
/** How far it is turned (degrees) to rest on its lower edge. */
const TURN = -8;
/** Contour weights in the painting's measure. */
const L = { body: 6, small: 4.2, detail: 3, fine: 2.2 } as const;
/** The eye, at the leaf's heart. */
const E: Pt = [140, 100];

/** The cracks' angles round the eye (degrees, clockwise from the tip); a plate lies between each two. */
const CRACKS = [-4, 50, 102, 150, 204, 248, 298, 356] as const;
const PLATE_COLOURS = [LEAF.right, LEAF.lowerRight, LEAF.bottom, LEAF.lowerLeft, LEAF.upperLeft, LEAF.top, LEAF.upperRight] as const;

const at = (deg: number, r: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [E[0] + Math.cos(a) * r, E[1] + Math.sin(a) * r];
};

/** The hollow round the eye, where the cracks start. */
function socketR(deg: number): number {
  const a = (deg * Math.PI) / 180;
  return 1 / Math.hypot(Math.cos(a) / 46, Math.sin(a) / 27);
}

/**
 * The leaf's shape without its plates' bulges: a rounded base, widest a
 * little before the eye, tapering to a point at the tip, its middle arched
 * a little.
 */
const BLADE: Pt[] = (() => {
  const [xb, xt] = [E[0] - 104, E[0] + 172];
  const at2 = (u: number, side: number): Pt => {
    const h = Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.9);
    return [xb + (xt - xb) * u, E[1] - 6 * Math.sin(Math.PI * u) + side * (side < 0 ? 70 : 62) * h];
  };
  const n = 90;
  const up = Array.from({ length: n + 1 }, (_, i) => at2(i / n, -1));
  const down = Array.from({ length: n - 1 }, (_, i) => at2(1 - (i + 1) / n, 1));
  return [...up, ...down];
})();

/** How far from the eye the blade's edge is along a ray (the last crossing). */
function bladeR(deg: number): number {
  const a = (deg * Math.PI) / 180;
  const [dx, dy] = [Math.cos(a), Math.sin(a)];
  let best = 0;
  for (let i = 0; i < BLADE.length; i++) {
    const [p1, p2] = [BLADE[i]!, BLADE[(i + 1) % BLADE.length]!];
    const [ex, ey] = [p2[0] - p1[0], p2[1] - p1[1]];
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const [wx, wy] = [p1[0] - E[0], p1[1] - E[1]];
    const t = (wx * ey - wy * ex) / den;
    const u = (wx * dy - wy * dx) / den;
    if (t > 0 && u >= 0 && u <= 1) best = Math.max(best, t);
  }
  return best;
}

/** The leaf's edge: the blade, each plate bulging a little between its cracks. */
function edgeR(deg: number): number {
  let r = bladeR(deg);
  let d = deg;
  while (d < CRACKS[0]) d += 360;
  while (d >= CRACKS[0] + 360) d -= 360;
  for (let k = 0; k < CRACKS.length - 1; k++) {
    if (d >= CRACKS[k]! && d <= CRACKS[k + 1]!) {
      r *= 1 + 0.08 * Math.pow(Math.max(0, Math.sin(Math.PI * ((d - CRACKS[k]!) / (CRACKS[k + 1]! - CRACKS[k]!)))), 0.7);
      break;
    }
  }
  return r;
}

/** Points along a ring between two angles. */
function arc(d0: number, d1: number, rf: (deg: number) => number, step = 2): Pt[] {
  const n = Math.max(2, Math.ceil(Math.abs(d1 - d0) / step));
  return Array.from({ length: n + 1 }, (_, i) => {
    const d = d0 + ((d1 - d0) * i) / n;
    return at(d, rf(d));
  });
}

/** A crack from the hollow out to the edge, wandering (the one to the tip least: it is the midrib). */
function crack(deg: number): Pt[] {
  const [rs, re] = [socketR(deg), edgeR(deg)];
  const a = (deg * Math.PI) / 180;
  const [px, py] = [-Math.sin(a), Math.cos(a)];
  const n = 6;
  const jag = deg === CRACKS[0] || deg === CRACKS[CRACKS.length - 1] ? 0.5 : 1;
  return Array.from({ length: n + 1 }, (_, i): Pt => {
    const t = i / n;
    const o = i === 0 || i === n ? 0 : Math.sin(i * 2.1 + deg * 0.05) * (3 + 3 * t) * jag;
    const [x, y] = at(deg, rs + t * (re - rs));
    return [x + px * o, y + py * o];
  });
}

/** Plate k: the hollow's rim, out along one crack, back along the edge, in along the other. */
function plate(k: number): string {
  const [d0, d1] = [CRACKS[k]!, CRACKS[k + 1]!];
  const pts = [...arc(d0, d1, socketR, 4), ...crack(d1).slice(1), ...arc(d1, d0, edgeR).slice(1, -1), ...crack(d0).reverse()];
  const color = PLATE_COLOURS[k]!;
  // Veins running out from the eye, each plate its own.
  let veins = '';
  for (const f of [0.34, 0.66]) {
    const d = d0 + (d1 - d0) * f;
    const [rs, re] = [socketR(d), edgeR(d)];
    veins += ink(smooth([at(d, rs + 10), at(d + 3, rs + (re - rs) * 0.5), at(d + 1, re * 0.86)], 0.8, false), L.fine, darkOf(color, 0.24));
  }
  return comic(poly(pts), color, { line: L.small, rim: [8, -3.5], glint: [-2.2, 2.2], hatch: 7, hatchWidth: 1.7, over: veins });
}

/** The eye: the hollow, the white with its red iris, the heavy lid, its lashes. */
function eye(): string {
  const [x, y] = E;
  let s = comic(ellipsePath(x, y, 46, 27), LEAF.socket, { line: L.small, ink: LEAF.crack, rim: [5, -3], glint: [-1.4, 1.4] });
  const white = `M${x - 36} ${y + 2}Q${x} ${y - 30} ${x + 36} ${y - 1}Q${x + 2} ${y + 25} ${x - 36} ${y + 2}Z`;
  const [ix, iy] = [x - 4, y + 1];
  const iris = `<path d="${ellipsePath(ix, iy, 13.5, 13.5)}" fill="${LEAF.iris}"/>` + ink(ellipsePath(ix, iy, 13.5, 13.5), L.fine, darkOf(LEAF.iris, 0.45));
  const pupil = `<path d="${ellipsePath(ix, iy, 6.2, 6.2)}" fill="${LEAF.pupil}"/>`;
  const glints = `<path d="${ellipsePath(ix - 4, iy - 4, 2.4, 2.4)}" fill="#ffffff"/><path d="${ellipsePath(ix + 4.5, iy + 4, 1.2, 1.2)}" fill="#ffffff" opacity="0.8"/>`;
  // The lid's shadow across the top of the white.
  const lidShade = `M${x - 36} ${y + 2}Q${x} ${y - 30} ${x + 36} ${y - 1}L${x + 36} ${y + 4}Q${x} ${y - 12} ${x - 36} ${y + 7}Z`;
  s += comic(white, LEAF.white, { line: L.detail, ink: LEAF.crack, inner: iris + pupil + glints, shade: lidShade, tone: '#d9c3e0' });
  // The heavy lid, half closed over it, a crease above, lashes off its rim.
  const lid = `M${x - 40} ${y + 1}Q${x - 2} ${y - 48} ${x + 40} ${y - 3}Q${x + 2} ${y - 13} ${x - 40} ${y + 1}Z`;
  s += comic(lid, LEAF.lid, { line: L.small, ink: LEAF.crack, rim: [3, -2.5], glint: [-1.2, 1.4] });
  s += ink(`M${x - 30} ${y - 16}Q${x} ${y - 44} ${x + 32} ${y - 20}`, L.detail, LEAF.crack);
  for (const [lx, ly, dx, dy] of [[x + 20, y - 8, 6, -6], [x + 29, y - 5, 9, -2], [x + 36, y - 2, 8, 3]] as const) {
    s += ink(`M${lx} ${ly}q${dx * 0.6} ${dy * 0.2} ${dx} ${dy}`, L.detail, LEAF.crack);
  }
  s += ink(`M${x - 30} ${y + 7}Q${x} ${y + 26} ${x + 30} ${y + 4}`, L.fine, LEAF.crack, 0.6);
  return s;
}

/** The stub of stem at its base, its cut end pale. */
function stem(): string {
  const base = at(180, edgeR(180));
  const d = smooth([[base[0] + 8, base[1] - 7], [base[0] - 10, base[1] - 6], [base[0] - 26, base[1] - 2], [base[0] - 26, base[1] + 7], [base[0] - 10, base[1] + 7], [base[0] + 8, base[1] + 7]], 0.5);
  let s = comic(d, LEAF.stem, { line: L.small, rim: [2, -2], glint: [-1, 1] });
  s += comic(ellipsePath(base[0] - 26, base[1] + 2.5, 3.4, 5.6), LEAF.stemCut, { line: L.detail });
  return s;
}

/** The whole edge, for the outer contour and the card's bounds. */
const OUTLINE = arc(CRACKS[0], CRACKS[0] + 360, edgeR);

function leaf(): string {
  let s = stem();
  for (let k = 0; k < CRACKS.length - 1; k++) s += plate(k);
  for (const d of CRACKS.slice(0, -1)) s += ink(poly(crack(d), false), L.small, LEAF.crack);
  s += ink(poly(OUTLINE), L.body, LEAF.edge);
  return s + eye();
}

/** A point as the turn moves it. */
function turned([x, y]: Pt): Pt {
  const a = (TURN * Math.PI) / 180;
  const [dx, dy] = [x - E[0], y - E[1]];
  return [E[0] + dx * Math.cos(a) - dy * Math.sin(a), E[1] + dx * Math.sin(a) + dy * Math.cos(a)];
}

/** The eye-leaf, lying on the floor: its pivot is the middle of where it rests. */
export function eyeLeaf(): PartArt {
  const stemTip = at(180, edgeR(180));
  const pts = [...OUTLINE, [stemTip[0] - 30, stemTip[1] - 4] as Pt, [stemTip[0] - 30, stemTip[1] + 9] as Pt].map(turned);
  const xs = pts.map((q) => q[0]);
  const ys = pts.map((q) => q[1]);
  const pad = 8;
  const [x0, y0] = [Math.min(...xs) - pad, Math.min(...ys) - pad];
  const [x1, floor] = [Math.max(...xs) + pad, Math.max(...ys)];
  // Its shadow on the boards, under where it rests.
  const shadow = `<path d="${ellipsePath((x0 + x1) / 2 + 10, floor - 3, (x1 - x0) * 0.4, 7)}" fill="${LEAF.shadow}" opacity="0.16"/>`;
  const body = `<g transform="scale(${SIZE}) translate(${-x0} ${-y0})">${shadow}<g transform="rotate(${TURN} ${E[0]} ${E[1]})">${leaf()}</g></g>`;
  const w = Math.ceil((x1 - x0) * SIZE);
  const h = Math.ceil((floor - y0 + 4) * SIZE);
  return { key: 'p1.eyeleaf', w, h, px: Math.round(w / 2), py: Math.round((floor - y0) * SIZE), body, scale: 1 };
}
