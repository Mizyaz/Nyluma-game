import { P } from '../palette';
import { cel, ellipsePath, glow, limb, line, poly, rrect, smooth, taper, type Pt } from '../svg';
import type { PartArt, RigDef } from '../rigTypes';
import { humanoidRig, type HumanoidDims } from './gorti';

// The inner forms of Chapter IV: the cowardly torch-bearer and the
// mechanical key-and-lock form.

const tr = (pts: readonly Pt[], ox: number, oy: number): Pt[] => pts.map(([x, y]) => [x + ox, y + oy]);

function part(key: string, box: { x0: number; y0: number; x1: number; y1: number }, draw: (ox: number, oy: number) => string, extra: Partial<PartArt> = {}): PartArt {
  const m = 5;
  const ox = -box.x0 + m;
  const oy = -box.y0 + m;
  return { key, w: Math.ceil(box.x1 - box.x0 + m * 2), h: Math.ceil(box.y1 - box.y0 + m * 2), px: ox, py: oy, body: draw(ox, oy), ...extra };
}

const SKIN = '#c8b4a4';
const SKIN_D = '#a38f82';
const RAG = '#6b5d57';
const RAG_D = '#524640';
const RAG_L = '#83756e';

// ---------------------------------------------------------------- coward

function cowardHead(): PartArt {
  return part('coward.head', { x0: -16, y0: -34, x1: 17, y1: 4 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const skull: Pt[] = [[-5, 1], [-9, -8], [-11, -17], [-9, -25], [-3, -29], [5, -29], [11, -24], [13, -18], [14, -13], [12, -10], [12, -6], [9, -2], [4, 1]];
    const hair = cel(smooth(o([[-12, -18], [-12, -27], [-6, -32], [3, -33], [11, -28], [14, -22], [8, -25], [4, -21], [0, -26], [-4, -21], [-8, -24], [-9, -14]])), {
      fill: '#3d3438', shade: '#2a2327', sx: 1.5, sy: 1.5, stroke: 2.4,
    });
    const face =
      `<path d="${ellipsePath(7 + ox, -17 + oy, 3.2, 3.6)}" fill="#f1e8dc" stroke="${P.ink}" stroke-width="1.4"/>` +
      `<circle cx="${8 + ox}" cy="${-16.5 + oy}" r="1.5" fill="${P.ink}"/>` +
      line(smooth(o([[3, -23], [7, -22], [11, -24]]), 1, false), P.ink, 1.6) + // worried brow
      line(smooth(o([[9, -7], [11, -6.5], [12.5, -7.5]]), 1, false), '#6e4a44', 1.2) +
      line(smooth(o([[-2, -12], [1, -9]]), 1, false), SKIN_D, 1) +
      line(smooth(o([[4, -26], [1, -22]]), 1, false), P.violet, 0.9, 0.6);
    return cel(smooth(o(skull)), { fill: SKIN, shade: SKIN_D, light: '#dccbbd', sx: 3, sy: 2, hx: 1.2, hy: 1.2, stroke: 2.8, over: face }) + hair;
  });
}

function cowardTorso(): PartArt {
  return part('coward.torso', { x0: -11, y0: -35, x1: 12, y1: 8 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const pts: Pt[] = [[-8, 6], [-9, -4], [-8, -16], [-8, -26], [-5, -32], [0, -34], [5, -33], [8, -27], [9, -17], [8, -6], [10, 4], [6, 7], [3, 3], [0, 7], [-3, 3]];
    const details =
      line(smooth(o([[-5, -24], [-2, -20], [1, -23]]), 1, false), RAG_D, 1.2) +
      `<path d="${rrect(ox - 6, oy - 14, 6, 6, 1)}" fill="${RAG_L}" stroke="${P.ink}" stroke-width="1.2"/>` +
      line(`M${ox - 5} ${oy - 11}l4 0M${ox - 3} ${oy - 13}l0 4`, P.ink, 0.8) +
      line(smooth(o([[-7, -2], [-3, 0], [2, -1], [7, 1]]), 1, false), RAG_D, 1.2);
    return cel(smooth(o(pts)), { fill: RAG, shade: RAG_D, light: RAG_L, sx: 3, sy: 2, hx: 1.2, hy: 1, stroke: 2.8, over: details });
  });
}

function cowardArm(): PartArt {
  return part('coward.arm', { x0: -5, y0: -4, x1: 5, y1: 20 }, (ox, oy) =>
    cel(limb([ox, oy], [ox, 16 + oy], 7, 6, 0.3), { fill: RAG, shade: RAG_D, light: RAG_L, sx: 2, sy: 0, hx: 1, hy: 0, stroke: 2.4 }),
    { far: true },
  );
}

function cowardFore(): PartArt {
  return part('coward.fore', { x0: -6, y0: -4, x1: 7, y1: 27 }, (ox, oy) => {
    let s = cel(limb([ox, oy], [ox, 18 + oy], 5.5, 5, 0.2), { fill: SKIN, shade: SKIN_D, sx: 1.5, sy: 0, stroke: 2.3 });
    s += cel(smooth(tr([[-3, 17], [3, 17], [4.5, 21], [3, 25], [-1, 26], [-3.5, 22]], ox, oy)), { fill: SKIN, shade: SKIN_D, sx: 1, sy: 1, stroke: 2.2 });
    s += cel(smooth(tr([[-4, -1], [4, -1], [4.5, 5], [0, 7], [-4.5, 5]], ox, oy)), { fill: RAG_D, shade: '#3d332e', sx: 1, sy: 1, stroke: 2 });
    return s;
  }, { far: true });
}

function cowardThigh(): PartArt {
  return part('coward.thigh', { x0: -6, y0: -4, x1: 6, y1: 22 }, (ox, oy) =>
    cel(limb([ox, oy], [ox, 19 + oy], 8, 7, 0.3), { fill: '#5a4f4a', shade: '#433a36', light: '#6f6460', sx: 2, sy: 0, hx: 1, hy: 0, stroke: 2.6 }),
    { far: true },
  );
}

function cowardShin(): PartArt {
  return part('coward.shin', { x0: -5, y0: -4, x1: 5, y1: 22 }, (ox, oy) =>
    cel(limb([ox, oy], [ox, 19 + oy], 7, 6, 0.2), { fill: '#5a4f4a', shade: '#433a36', sx: 2, sy: 0, stroke: 2.5, over: line(`M${ox - 3} ${oy + 10}l6 2`, '#433a36', 1) }),
    { far: true },
  );
}

function cowardFoot(): PartArt {
  return part('coward.foot', { x0: -7, y0: -4, x1: 12, y1: 7 }, (ox, oy) =>
    cel(smooth(tr([[-4, -2], [-6, 2], [-5, 5], [6, 5], [11, 4], [9, 0], [3, -2]], ox, oy)), { fill: '#8a7a6c', shade: '#6d5f53', sx: 1, sy: 1.5, stroke: 2.3, over: line(`M${ox - 3} ${oy + 1}l7 1`, '#6d5f53', 1) }),
    { far: true },
  );
}

function torch(): PartArt {
  // Oversized torch; pivot at the grip (held around its middle).
  return part('coward.torch', { x0: -8, y0: -58, x1: 8, y1: 26 }, (ox, oy) => {
    let s = cel(limb([ox, 24 + oy], [ox + 1, -40 + oy], 6, 7, 0.4), { fill: '#7a5a44', shade: '#5c4232', light: '#98765c', sx: 2, sy: 0, hx: 1, hy: 0, stroke: 2.6 });
    s += cel(rrect(ox - 7, oy - 52, 15, 14, 4), { fill: '#6e5140', shade: '#533c30', sx: 2, sy: 2, stroke: 2.6, over: line(`M${ox - 6} ${oy - 47}l13 0M${ox - 6} ${oy - 42}l13 0`, P.ink, 1.1) });
    return s;
  });
}

function flame(): PartArt {
  return part('coward.flame', { x0: -12, y0: -30, x1: 12, y1: 4 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    let s = glow(ox, oy - 10, 14, P.fireLight, 0.5);
    s += cel(smooth(o([[-9, 0], [-10, -9], [-5, -17], [-3, -26], [2, -18], [6, -24], [9, -12], [9, -2], [3, 2]])), { fill: P.fire, shade: '#d9853a', sx: 2, sy: 0, stroke: 2.4 });
    s += `<path d="${smooth(o([[-4, -1], [-5, -8], [-1, -14], [3, -9], [4, -2]]))}" fill="${P.fireLight}"/>`;
    return s;
  }, { scale: 2 });
}

// ---------------------------------------------------------------- mech

function mechHead(): PartArt {
  return part('mech.head', { x0: -14, y0: -30, x1: 16, y1: 4 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    let s = cel(poly(o([[-9, 1], [-12, -10], [-10, -24], [-2, -29], [9, -27], [14, -20], [15, -8], [11, -2], [4, 2]])), {
      fill: P.metal, shade: P.metalDark, light: P.metalLight, sx: 3, sy: 2, hx: 1.2, hy: 1.2, stroke: 2.8,
      over:
        line(poly(o([[-10, -14], [14, -14]]), false), P.metalDark, 1.2) +
        `<circle cx="${ox - 8}" cy="${oy - 20}" r="1.3" fill="${P.metalLight}"/><circle cx="${ox - 8}" cy="${oy - 6}" r="1.3" fill="${P.metalLight}"/>`,
    });
    // Key eye (front): bow ring + shaft + bits, glowing.
    const kx = 8 + ox;
    const ky = -19 + oy;
    s += glow(kx + 2, ky, 8, P.vein, 0.55);
    s += `<circle cx="${kx - 2}" cy="${ky}" r="2.6" fill="none" stroke="${P.vein}" stroke-width="1.6"/>`;
    s += line(`M${kx + 0.5} ${ky}L${kx + 7} ${ky}M${kx + 5} ${ky}l0 2.2M${kx + 7} ${ky}l0 2.8`, P.vein, 1.5);
    // Keyhole eye (lower, back): dark slot with violet rim.
    const hx = 3 + ox;
    const hy = -9 + oy;
    s += `<path d="M${hx - 2.2} ${hy - 1}a2.4 2.4 0 1 1 4.4 0l1.2 5.2h-6.8z" fill="${P.ink}" stroke="${P.violet}" stroke-width="1.3" stroke-linejoin="round"/>`;
    // Bone strut crest
    s += cel(taper(o([[-6, -27], [-9, -33], [-8, -38]]), 3.2, 1.4), { fill: P.bone, shade: '#b3a992', sx: 1, sy: 0, stroke: 1.8 });
    return s;
  });
}

function mechTorso(): PartArt {
  return part('mech.torso', { x0: -12, y0: -36, x1: 13, y1: 5 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    let s = cel(poly(o([[-8, 3], [-10, -10], [-9, -28], [-4, -35], [5, -35], [10, -28], [11, -10], [8, 3]])), {
      fill: P.metalDark, shade: '#23262e', light: P.metal, sx: 3, sy: 1, hx: 1, hy: 1, stroke: 2.8,
    });
    // Bone ribs inside the cage
    for (let i = 0; i < 4; i++) {
      const y = -28 + i * 7;
      s += line(`M${ox - 7} ${oy + y}q7 3 15 0`, P.bone, 2.2);
    }
    s += line(`M${ox} ${oy - 33}L${ox} ${oy + 1}`, P.metalLight, 2.2);
    // A lodged memory fragment (small photo)
    s += cel(rrect(ox + 1, oy - 20, 7, 8, 1), { fill: P.paper, shade: P.paperDark, sx: 1, sy: 1, stroke: 1.4, over: `<circle cx="${ox + 4.5}" cy="${oy - 16.5}" r="1.8" fill="${P.violet}"/>` });
    s += `<circle cx="${ox - 8}" cy="${oy - 30}" r="2" fill="${P.metalLight}" stroke="${P.ink}" stroke-width="1"/><circle cx="${ox + 9}" cy="${oy - 30}" r="2" fill="${P.metalLight}" stroke="${P.ink}" stroke-width="1"/>`;
    return s;
  });
}

function mechArm(): PartArt {
  return part('mech.arm', { x0: -5, y0: -5, x1: 5, y1: 23 }, (ox, oy) =>
    cel(rrect(ox - 3, oy - 2, 6, 22, 2), { fill: P.metal, shade: P.metalDark, light: P.metalLight, sx: 1.5, sy: 0, hx: 1, hy: 0, stroke: 2.2 }) +
    `<circle cx="${ox}" cy="${oy}" r="3.2" fill="${P.metalLight}" stroke="${P.ink}" stroke-width="1.6"/>`,
    { far: true },
  );
}

function mechFore(): PartArt {
  return part('mech.fore', { x0: -7, y0: -5, x1: 7, y1: 32 }, (ox, oy) => {
    let s = cel(taper(tr([[0, 0], [0, 12], [0, 22]], ox, oy), 4.5, 3.5), { fill: P.bone, shade: '#b3a992', sx: 1.2, sy: 0, stroke: 2 });
    s += `<circle cx="${ox}" cy="${oy}" r="3" fill="${P.metalLight}" stroke="${P.ink}" stroke-width="1.5"/>`;
    // Clamp hand
    s += cel(poly(tr([[-4, 21], [4, 21], [5, 29], [2, 27], [0, 31], [-2, 27], [-5, 29]], ox, oy)), { fill: P.metal, shade: P.metalDark, sx: 1, sy: 1, stroke: 2 });
    return s;
  }, { far: true });
}

function mechThigh(): PartArt {
  return part('mech.thigh', { x0: -6, y0: -5, x1: 6, y1: 24 }, (ox, oy) =>
    cel(rrect(ox - 4, oy - 2, 8, 22, 2), { fill: P.metal, shade: P.metalDark, light: P.metalLight, sx: 2, sy: 0, hx: 1, hy: 0, stroke: 2.4, over: line(`M${ox} ${oy + 3}l0 14`, P.bone, 2) }) +
    `<circle cx="${ox}" cy="${oy}" r="3.4" fill="${P.metalLight}" stroke="${P.ink}" stroke-width="1.5"/>`,
    { far: true },
  );
}

function mechShin(): PartArt {
  return part('mech.shin', { x0: -5, y0: -5, x1: 5, y1: 24 }, (ox, oy) =>
    cel(taper(tr([[0, 0], [0, 10], [0, 21]], ox, oy), 5, 4), { fill: P.bone, shade: '#b3a992', sx: 1.5, sy: 0, stroke: 2.2 }) +
    `<circle cx="${ox}" cy="${oy}" r="3.2" fill="${P.metalLight}" stroke="${P.ink}" stroke-width="1.5"/>`,
    { far: true },
  );
}

function mechFoot(): PartArt {
  return part('mech.foot', { x0: -7, y0: -4, x1: 13, y1: 6 }, (ox, oy) =>
    cel(poly(tr([[-5, -2], [-6, 4], [12, 4], [12, 1], [4, -2]], ox, oy)), { fill: P.metalDark, shade: '#23262e', light: P.metal, sx: 1, sy: 1, stroke: 2.2 }),
    { far: true },
  );
}

export function formParts(): PartArt[] {
  return [
    cowardHead(), cowardTorso(), cowardArm(), cowardFore(), cowardThigh(), cowardShin(), cowardFoot(), torch(), flame(),
    mechHead(), mechTorso(), mechArm(), mechFore(), mechThigh(), mechShin(), mechFoot(),
  ];
}

const COWARD_DIMS: HumanoidDims = { hip: 40, thigh: 19, shin: 19, torso: 32, shoulderY: 29, shoulderX: 2, upper: 16, hipX: 3, headX: 1, eye: [8, -17] };
const MECH_DIMS: HumanoidDims = { hip: 42, thigh: 20, shin: 20, torso: 34, shoulderY: 30, shoulderX: 2, upper: 20, hipX: 4, headX: 1, eye: [9, -19] };

export const RIG_COWARD: RigDef = (() => {
  const r = humanoidRig('coward', 'coward', COWARD_DIMS, false);
  r.joints.push({ id: 'torch', parent: 'foreR', x: 0, y: 22, part: 'coward.torch', z: 72 });
  r.joints.push({ id: 'flame', parent: 'torch', x: 1, y: -50, part: 'coward.flame', z: 73 });
  r.attach.flame = { joint: 'torch', x: 1, y: -58 };
  return r;
})();

export const RIG_MECH: RigDef = humanoidRig('mech', 'mech', MECH_DIMS, false);
