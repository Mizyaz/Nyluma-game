import { ellipsePath, taper, type Pt } from '../../render/2d/svg';
import { darkOf, LINE, lightOf, SHADE } from '../../render/2d/style';
import type { PartArt } from '../../render/2d/rig/rigTypes';
import { eyeSet, mouthSet, withoutSmile } from './face';
import { barkLines, claws, comic, comicLimb, comicRoot, fold, hatchLines, ink, neon, part, path, rootSeg, roundPoly, tr } from './kit';
import { humanoidRig, type HumanoidDims } from './skeleton';

// Gorti as a child (painting 1, "House of the Stranger", the right-hand
// figure): a small khaki-green body, brown root arms and legs with bark lines
// and root-claw fingers and toes, and a big square helmet head whose face is
// a pink glowing grid screen. His face lives on that screen as neon marks.

export const CHILD = {
  body: '#bdcb9e',
  root: '#9c8461',
  rootDark: '#7c6649',
  box: '#baa97f',
  boxSide: '#9e8e66',
  bezel: '#8e7f5c',
  screen: '#4c2245',
  glow: '#ff5db6',
  neon: '#ff9ad6',
  core: '#ffe4f4',
} as const;

const NEON = { glow: CHILD.glow, mid: CHILD.neon, core: CHILD.core };

export const CHILD_DIMS: HumanoidDims = {
  hip: 42, thigh: 19, shin: 19, torso: 33, shoulderY: 27, shoulderX: 3, upper: 15, hipX: 5, headX: 1, hand: 20,
  belly: [16.5, -12],
  foot: { sole: 6.2, heel: -5, ball: 9 },
  eye: [8, -32],
  brow: { part: 'gorti.child.brow', up: 8.5, dx: -7.5 },
  face: { eye: 'gorti.child', mouth: 'gorti.child', mouthAt: [10, -19], blink: 'squash', glow: true },
};

// ------------------------------------------------------------------ head

function head(): PartArt {
  return part('gorti.child.head', { x0: -29, y0: -62, x1: 33, y1: 4 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    // A short root neck under the helmet, in its shadow.
    let s = comicRoot([ox, oy + 3], [ox + 1, oy - 8], 9, 8, CHILD.root, 5, { bulge: 0.2, lines: 1, inner: `<path d="M${P(-8, -10)}L${P(9, -10)}L${P(9, -3)}Q${P(0, -1)} ${P(-8, -3)}Z" style="fill:${SHADE.cool}"/>` });
    const box: Pt[] = [[-27, -53], [-18, -60], [25, -60], [31, -54], [31, -9], [26, -3], [-16, -3], [-27, -8]];
    // Side plane of the box (seen three-quarter), in shade, with rivets and dents.
    const sideD = `M${P(-32, -64)}L${P(-16, -64)}L${P(-16, 2)}L${P(-32, 2)}Z`;
    const rivet = (x: number, y: number): string => comic(ellipsePath(ox + x, oy + y, 1.7, 1.7), CHILD.bezel, { line: LINE.fine * 1.3, glint: [-0.5, 0.5], lightFill: lightOf(CHILD.bezel, 0.6) });
    const side =
      `<path d="${sideD}" fill="${CHILD.boxSide}"/>` +
      hatchLines({ x0: ox - 32, y0: oy - 64, x1: ox - 16, y1: oy + 2 }, 2.6, darkOf(CHILD.boxSide, 0.2)) +
      ink(`M${P(-16, -59)}L${P(-16, -4)}`, LINE.detail, darkOf(CHILD.box, 0.5)) +
      rivet(-22, -49) +
      rivet(-22, -13) +
      fold(`M${P(-24, -34)}q2 3 0 7`, darkOf(CHILD.boxSide, 0.45)) +
      fold(`M${P(-4, -60)}l1 3M${P(11, -60)}l-1 3`, darkOf(CHILD.box, 0.45));
    s += comic(roundPoly(o(box), [6, 7, 7, 6, 6, 6, 6, 6]), CHILD.box, {
      line: LINE.body,
      inner: side,
      rim: [2.2, -3],
      glint: [-1.2, 1.4],
      // Scuffs on the painted tin.
      over: fold(`M${P(27, -40)}l2 -1.4M${P(26.6, -30)}l2.2 0.6M${P(4, -2.4)}q2 -1 4 0`, darkOf(CHILD.box, 0.35), LINE.fine),
    });
    // Bezel and the glowing screen.
    s += comic(roundPoly(o([[-12, -55], [28, -55], [28, -8], [-12, -8]]), 6), CHILD.bezel, { line: LINE.small, rim: [1.6, -1.6], glint: [-0.8, 0.9] });
    let grid = '';
    for (let x = -4; x <= 24; x += 5.4) grid += `M${ox + x} ${oy - 53}V${oy - 10}`;
    for (let y = -48; y <= -12; y += 5.4) grid += `M${ox - 10} ${oy + y}H${ox + 27}`;
    const screenInner =
      `<radialGradient id="cgscr"><stop offset="0" stop-color="${CHILD.glow}" stop-opacity="0.45"/><stop offset="1" stop-color="${CHILD.glow}" stop-opacity="0"/></radialGradient>` +
      `<ellipse cx="${ox + 8}" cy="${oy - 31}" rx="26" ry="25" fill="url(#cgscr)"/>` +
      ink(grid, 0.7, CHILD.neon, 0.28) +
      // Glitchy marks of the painting's grid ("ƧƧƧ") in the corners.
      neon(path(o([[-7, -49], [-4, -51], [-4, -47], [-1, -49]])), 0.9, NEON) +
      neon(path(o([[18, -14], [21, -16], [21, -12], [24, -14]])), 0.9, NEON) +
      `<path d="${roundPoly(o([[-8, -51], [25, -51], [25, -11], [-8, -11]]), 4)}" fill="none" stroke="${CHILD.glow}" stroke-width="2.4" opacity="0.35"/>` +
      // The glass: a glare across its top corner.
      `<path d="M${P(-9, -38)}L${P(4, -52)}L${P(12, -52)}L${P(-9, -29)}Z" fill="#ffffff" opacity="0.13"/>` +
      `<path d="M${P(-9, -25)}L${P(15, -52)}L${P(17.5, -52)}L${P(-9, -22)}Z" fill="#ffffff" opacity="0.1"/>`;
    s += comic(roundPoly(o([[-9, -52], [25, -52], [25, -11], [-9, -11]]), 5), CHILD.screen, { line: LINE.small, ink: '#2c1228', inner: screenInner });
    return s;
  });
}

// ------------------------------------------------------------------ face

/** Both eyes on the screen (the near one larger): neon blocks and marks. */
function eyes(): PartArt[] {
  const E = [
    { x: -7.5, w: 6.4, h: 8, outer: -1 },
    { x: 7.5, w: 5.4, h: 7.4, outer: 1 },
  ];
  return withoutSmile(eyeSet('gorti.child', { x0: -14, y0: -9, x1: 14, y1: 9 }, (v, ox, oy) =>
    E.map((e) => {
      const cx = ox + e.x;
      const cy = oy;
      const hw = e.w / 2;
      const hh = e.h / 2;
      if (v === 'happy') return neon(`M${cx - hw} ${cy + hh * 0.5}L${cx} ${cy - hh * 0.6}L${cx + hw} ${cy + hh * 0.5}`, 1.9, NEON);
      if (v === 'shut') {
        const d = e.outer === -1 ? `M${cx - hw} ${cy - hh * 0.6}L${cx + hw * 0.8} ${cy}L${cx - hw} ${cy + hh * 0.6}` : `M${cx + hw} ${cy - hh * 0.6}L${cx - hw * 0.8} ${cy}L${cx + hw} ${cy + hh * 0.6}`;
        return neon(d, 1.8, NEON);
      }
      if (v === 'sad') {
        // The top edge droops toward the outer corner.
        const yo = cy - hh * 0.1;
        const yi = cy - hh;
        const [yl, yr] = e.outer === -1 ? [yo, yi] : [yi, yo];
        return neon(`M${cx - hw} ${yl}L${cx + hw} ${yr}L${cx + hw} ${cy + hh}L${cx - hw} ${cy + hh}Z`, 1.1, NEON, true);
      }
      return neon(roundPoly([[cx - hw, cy - hh], [cx + hw, cy - hh], [cx + hw, cy + hh], [cx - hw, cy + hh]], 1.6), 1.1, NEON, true);
    }).join(''),
  ));
}

function mouth(): PartArt[] {
  // Gorti has no mouth (as the author draws him): every shape is empty, so
  // talking and emotions live in the eyes, the brows and the body.
  return mouthSet('gorti.child', { x0: -4, y0: -4, x1: 4, y1: 4 }, () => '');
}

function brow(): PartArt {
  return part('gorti.child.brow', { x0: -7, y0: -4, x1: 7, y1: 4 }, (ox, oy) => neon(`M${ox - 4.5} ${oy + 0.6}L${ox + 4.5} ${oy - 0.4}`, 1.9, NEON));
}

// ------------------------------------------------------------------ body

function torso(): PartArt {
  return part('gorti.child.torso', { x0: -19, y0: -38, x1: 19, y1: 8 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const P = (x: number, y: number): string => `${ox + x} ${oy + y}`;
    const body: Pt[] = [[-13, 6], [-16.5, -4], [-16.5, -16], [-15, -26], [-9, -32.5], [2, -35], [11, -32], [16, -25], [17, -12], [15.5, -2], [13, 6]];
    const knit = darkOf(CHILD.body, 0.32);
    // Brown root bundle of the hips (the painting's lower body).
    const rootEdge = `M${P(-18, -7)}Q${P(-9, -12)} ${P(-1, -7)}T${P(18, -8)}`;
    const roots =
      `<path d="${rootEdge}L${P(18, 10)}L${P(-18, 10)}Z" fill="${CHILD.root}"/>` +
      barkLines([ox - 7, oy - 8], [ox - 8, oy + 6], 8, 11, { n: 2, knots: 0, color: darkOf(CHILD.root, 0.5) }) +
      barkLines([ox + 5, oy - 8], [ox + 6, oy + 6], 8, 12, { n: 2, knots: 0, color: darkOf(CHILD.root, 0.5) }) +
      // The sweater hem casts a little shadow on the roots.
      `<path d="${rootEdge}l0 3.2Q${P(-1, -4)} ${P(-9, -9)}T${P(-18, -4)}Z" style="fill:${SHADE.deep}"/>`;
    // The sweater: rootlets creeping up it, the collar, a few knit creases.
    const over =
      ink(rootEdge, LINE.detail, darkOf(CHILD.body, 0.55)) +
      ink(path(o([[-4, -9], [-5, -15], [-3, -20]])), LINE.detail * 0.9, darkOf(CHILD.root, 0.3)) +
      ink(path(o([[7, -9], [8, -13], [10, -16]])), LINE.detail * 0.9, darkOf(CHILD.root, 0.3)) +
      fold(path(o([[-4, -31], [1, -28], [7, -30]])), knit) +
      fold(path(o([[-9, -21], [-6, -19]])), knit, LINE.fine * 1.2) +
      fold(`M${P(9, -24)}q3 1.4 5.4 -0.4M${P(10, -18)}q2.6 1 4.8 -0.6`, knit, LINE.fine * 1.2) +
      fold(`M${P(-14, -12)}l2.2 1.4M${P(-13.4, -16)}l2.2 1.2`, knit, LINE.fine);
    return comic(path(o(body)) + 'Z', CHILD.body, { line: LINE.body, inner: roots, rim: [5, -2.6], hatch: 2.4, glint: [-1.1, 1.3], over });
  });
}

function upperArm(): PartArt {
  return part('gorti.child.arm', { x0: -6, y0: -5, x1: 6, y1: 19 }, (ox, oy) =>
    comicLimb([ox, oy], [ox, oy + 15], 10.4, 8.4, CHILD.body, { bulge: 0.6, over: fold(`M${ox - 3} ${oy + 11}q3 2 6 0`, darkOf(CHILD.body, 0.32)) }),
  { far: true });
}

function forearm(): PartArt {
  return part('gorti.child.fore', { x0: -9, y0: -4, x1: 9, y1: 26 }, (ox, oy) =>
    claws([ox, oy + 13], Math.PI / 2, 1.25, [8, 10, 10.5, 8.5], 3.6, CHILD.rootDark, 21, 0.25) +
    rootSeg([ox, oy], [ox, oy + 14], 8.2, 7.2, CHILD.root, 22, { lines: 2 }),
  { far: true });
}

function thigh(): PartArt {
  return part('gorti.child.thigh', { x0: -8, y0: -5, x1: 8, y1: 23 }, (ox, oy) => rootSeg([ox, oy], [ox, oy + 19], 12.8, 10.2, CHILD.root, 31, { bulge: 0.8 }), { far: true });
}

function shin(): PartArt {
  return part('gorti.child.shin', { x0: -7, y0: -4, x1: 7, y1: 22 }, (ox, oy) => rootSeg([ox, oy], [ox, oy + 19], 10.2, 8, CHILD.root, 32, { lines: 2 }), { far: true });
}

/** Root-claw toes spread on the ground (pivot at the ankle, sole at +6). */
function foot(): PartArt {
  return part('gorti.child.foot', { x0: -10, y0: -5, x1: 17, y1: 8 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const toe = (pts: Pt[], w: number): string => comic(taper(o(pts), w, 0.7), CHILD.rootDark, { line: LINE.small * 0.9, rim: [0, -w * 0.3], glint: [0, w * 0.2] });
    let s = toe([[-2, 3], [-6, 5], [-9, 6.2]], 3.4);
    s += toe([[1, 3.5], [6, 5.5], [10, 6.3]], 3.8);
    s += toe([[2, 2], [9, 3], [15, 5.8]], 4.2);
    s += comic(ellipsePath(ox, oy + 2.5, 6, 4.2), CHILD.root, { line: LINE.small, rim: [1.6, -1.2], glint: [-0.6, 0.7], over: fold(`M${ox - 2} ${oy + 1}q2 2 4 0`, darkOf(CHILD.root, 0.5), LINE.fine * 1.2) });
    return s;
  }, { far: true });
}

export function childParts(): PartArt[] {
  return [head(), ...eyes(), ...mouth(), brow(), torso(), upperArm(), forearm(), thigh(), shin(), foot()];
}

export const RIG_GORTI_CHILD = humanoidRig('gorti.root.child', 'gorti.child', CHILD_DIMS);
