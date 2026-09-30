import { ellipsePath, limb, taper, type Pt } from '../../render/2d/svg';
import { DETAIL, flat, INK, PASTEL } from '../../render/2d/style';
import type { PartArt } from '../../render/2d/rig/rigTypes';
import { eyeSet, mouthSet, browPart, withoutSmile } from './face';
import { fillOnly, ink, leaf, part, path, roundPoly, stitches, tr } from './kit';
import { humanoidRig, type HumanoidDims } from './skeleton';

// Gorti as a youth (painting 3, "Late to Work", the centre figure): a
// yellow-green block head with pink-framed eyes and a smile, dark branch
// "hair" tendrils where tiny birds perch, a grey armour torso with yellow and
// pink panels and an eye emblem, a leafy collar, and long grey mechanical
// arms with stitches (a watch on one wrist).

export const YOUTH = {
  head: '#d6e271',
  headSide: '#b8c65a',
  frame: '#f2a3c9',
  socket: '#5a2d52',
  lens: '#c9a6e4',
  lip: '#ee8fb0',
  tendril: '#5d4454',
  tendrilPink: '#e58fb8',
  tendrilGrey: '#8ea59f',
  armour: '#bab9c2',
  armourDark: '#8f8e99',
  yellow: '#f2d878',
  pink: '#f2adcb',
  blue: '#8fa2c4',
  collar: '#c9da7c',
  collarDeep: '#a9c46a',
  limb: '#b0b1b9',
  boot: '#7f818d',
} as const;

// Pink frames around both eyes, in head coordinates: near (larger) and far.
const FRAMES = [
  { cx: -6, cy: -35, w: 15, h: 11.5, outer: -1 as const },
  { cx: 14, cy: -35, w: 11, h: 10.5, outer: 1 as const },
];
const EYE_AT: Pt = [4, -35];

// Branch tendrils: base inside the block's top, main stroke, width, colour
// and what sits on them.
const TENDRILS: { id: string; base: Pt; pts: Pt[]; w: number; color: string; bird?: 'green' | 'lilac'; band?: boolean }[] = [
  { id: 'hairA', base: [-15, -52], pts: [[-15, -52], [-23, -61], [-33, -64], [-40, -73], [-39, -83], [-34, -89]], w: 9, color: YOUTH.tendril, band: true },
  { id: 'hairB', base: [-7, -55], pts: [[-7, -55], [-12, -67], [-10, -79], [-15, -89], [-23, -93]], w: 8.5, color: YOUTH.tendril, bird: 'green' },
  { id: 'hairC', base: [3, -56], pts: [[3, -56], [5, -68], [1, -79], [4, -89], [10, -92]], w: 7.5, color: YOUTH.tendrilGrey },
  { id: 'hairD', base: [12, -55], pts: [[12, -55], [18, -65], [17, -75], [23, -83], [31, -83]], w: 8, color: YOUTH.tendril, bird: 'lilac' },
  { id: 'hairE', base: [20, -50], pts: [[20, -50], [29, -55], [35, -63], [36, -70]], w: 6.5, color: YOUTH.tendril, band: true },
];

export const YOUTH_DIMS: HumanoidDims = {
  hip: 50, thigh: 23, shin: 23, torso: 44, shoulderY: 37, shoulderX: 3, upper: 22, hipX: 5, headX: 3, hand: 27,
  eye: EYE_AT,
  brow: { part: 'gorti.youth.brow', up: 9.5, dx: -10 },
  face: { eye: 'gorti.youth', mouth: 'gorti.youth', mouthAt: [9, -17], blink: 'squash' },
  hair: TENDRILS.map((t, i) => {
    const end = t.pts[t.pts.length - 1]!;
    return { part: `gorti.youth.${t.id}`, id: t.id, at: t.base, tip: [end[0] - t.base[0], end[1] - t.base[1]] as Pt, z: 55 + i, k: 150, c: 6 };
  }),
};

// ------------------------------------------------------------------ head

function hexFrame(cx: number, cy: number, w: number, h: number): Pt[] {
  const hw = w / 2;
  const hh = h / 2;
  return [[cx - hw, cy - hh * 0.35], [cx - hw * 0.55, cy - hh], [cx + hw * 0.55, cy - hh], [cx + hw, cy - hh * 0.35], [cx + hw * 0.8, cy + hh], [cx - hw * 0.8, cy + hh]];
}

function head(): PartArt {
  return part('gorti.youth.head', { x0: -24, y0: -60, x1: 28, y1: 3 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const block: Pt[] = [[-21, -52], [-14, -57], [20, -57], [26, -51], [27, -26], [24, -10], [17, -3], [-9, -2], [-19, -8], [-22, -26]];
    const inner =
      fillOnly(`M${ox - 30} ${oy - 62}L${ox - 13} ${oy - 62}Q${ox - 15} ${oy - 30} ${ox - 12} ${oy + 3}L${ox - 30} ${oy + 3}Z`, YOUTH.headSide) +
      ink(`M${ox - 13} ${oy - 56}Q${ox - 15} ${oy - 30} ${ox - 12} ${oy - 3}`, DETAIL) +
      // The painting's cracks and panel lines: jaw lines from the mouth, bricks on the cheek.
      ink(path(o([[1, -15], [0, -9], [1, -3]])), DETAIL) +
      ink(path(o([[19, -15], [20, -9], [18, -4]])), DETAIL) +
      ink(`M${ox - 11} ${oy - 21}h5M${ox - 9} ${oy - 16}h5M${ox - 11} ${oy - 11}h4M${ox + 22} ${oy - 22}h3`, DETAIL * 0.9) +
      ink(path(o([[16, -57], [14, -52], [17, -48]])), DETAIL * 0.9) +
      ink(path(o([[-6, -57], [-5, -53]])), DETAIL * 0.9) +
      // Nose: a small wedge between the eyes.
      ink(path(o([[6, -30], [8, -24], [5, -23]])), DETAIL);
    let s = flat(roundPoly(o(block), [5, 6, 6, 5, 6, 7, 6, 6, 6, 5]), YOUTH.head, { inner });
    for (const f of FRAMES) {
      s += flat(roundPoly(o(hexFrame(f.cx, f.cy, f.w + 5, f.h + 4.5)), 1.5), YOUTH.frame, { stroke: DETAIL * 1.2 });
      s += flat(roundPoly(o(hexFrame(f.cx, f.cy, f.w, f.h)), 1), YOUTH.socket, { stroke: DETAIL });
    }
    return s;
  });
}

/** Both lenses in their frames: lilac with a dark pupil. */
function eyes(): PartArt[] {
  return withoutSmile(eyeSet('gorti.youth', { x0: -18, y0: -9, x1: 18, y1: 9 }, (v, ox, oy) =>
    FRAMES.map((f) => {
      const cx = ox + f.cx - EYE_AT[0];
      const cy = oy + f.cy - EYE_AT[1];
      const hw = f.w / 2 - 1.2;
      const hh = f.h / 2 - 1.2;
      if (v === 'happy') return ink(`M${cx - hw} ${cy + hh * 0.45}Q${cx} ${cy - hh * 1.3} ${cx + hw} ${cy + hh * 0.45}`, 2.4, YOUTH.lens) + ink(`M${cx - hw} ${cy + hh * 0.45}Q${cx} ${cy - hh * 1.3} ${cx + hw} ${cy + hh * 0.45}`, 0.9);
      if (v === 'shut') return ink(`M${cx - hw} ${cy}Q${cx} ${cy + hh * 0.8} ${cx + hw} ${cy}`, 2.2, YOUTH.lens) + ink(`M${cx - hw} ${cy}Q${cx} ${cy + hh * 0.8} ${cx + hw} ${cy}`, 0.9);
      const lens = roundPoly(hexFrame(cx, cy, f.w - 2.4, f.h - 2.4), 1);
      let inner = '';
      if (v === 'sad') {
        const [yl, yr] = f.outer === -1 ? [cy + hh * 0.1, cy - hh * 0.8] : [cy - hh * 0.8, cy + hh * 0.1];
        inner += `<path d="M${cx - hw - 2} ${cy - hh - 3}L${cx + hw + 2} ${cy - hh - 3}L${cx + hw + 2} ${yr}L${cx - hw - 2} ${yl}Z" fill="${YOUTH.socket}"/>` + ink(`M${cx - hw - 2} ${yl}L${cx + hw + 2} ${yr}`, 1);
      }
      return flat(lens, YOUTH.lens, { stroke: 0.9, inner });
    }).join(''),
  ));
}

function mouth(): PartArt[] {
  // No mouth (as the author draws him).
  return mouthSet('gorti.youth', { x0: -4, y0: -4, x1: 4, y1: 4 }, () => '');
}

function tendril(t: (typeof TENDRILS)[number]): PartArt {
  const pts = t.pts.map(([x, y]): Pt => [x - t.base[0], y - t.base[1]]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const box = { x0: Math.min(...xs) - 10, y0: Math.min(...ys) - 12, x1: Math.max(...xs) + 10, y1: Math.max(...ys) + 6 };
  return part(`gorti.youth.${t.id}`, box, (ox, oy) => {
    const q = tr(pts, ox, oy);
    let s = flat(taper(q, t.w, 1.6), t.color, { stroke: DETAIL * 1.2, over: ink(path(q.slice(1, -1)), DETAIL * 0.7, '#8b6d7e') });
    if (t.band) {
      const m = q[Math.floor(q.length / 2)]!;
      s += `<circle cx="${m[0]}" cy="${m[1]}" r="${t.w * 0.42}" fill="${YOUTH.tendrilPink}" stroke="${INK}" stroke-width="${DETAIL}"/>`;
    }
    const tip = q[q.length - 1]!;
    if (t.bird) {
      // A tiny perched bird.
      const body = t.bird === 'green' ? PASTEL.leaf : PASTEL.lilac;
      const bx = tip[0];
      const by = tip[1] - 4;
      s += flat(`M${bx - 5} ${by + 1}Q${bx - 3} ${by - 5} ${bx + 3} ${by - 3}Q${bx + 6} ${by - 1} ${bx + 3} ${by + 3}Q${bx - 1} ${by + 4} ${bx - 5} ${by + 1}Z`, body, { stroke: DETAIL });
      s += flat(`M${bx + 0.5} ${by + 0.5}Q${bx + 3.5} ${by} ${bx + 3} ${by + 2.5}Q${bx + 1} ${by + 3} ${bx + 0.5} ${by + 0.5}Z`, PASTEL.pink, { stroke: 0.8 });
      s += flat(`M${bx + 4.5} ${by - 2.5}l3 0.6l-2.6 1.2Z`, PASTEL.butter, { stroke: 0.8 });
      s += `<circle cx="${bx + 2.4}" cy="${by - 2.2}" r="0.7" fill="${INK}"/>`;
      s += ink(`M${bx - 5} ${by + 1}l-3 -1.5M${bx - 5} ${by + 1}l-3 1`, DETAIL * 0.9);
    } else s += leaf(tip, Math.atan2(tip[1] - q[q.length - 2]![1], tip[0] - q[q.length - 2]![0]), 6, YOUTH.collar, { vein: false });
    return s;
  });
}

// ------------------------------------------------------------------ body

function torso(): PartArt {
  return part('gorti.youth.torso', { x0: -24, y0: -66, x1: 28, y1: 10 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const armour: Pt[] = [[-12, 5], [-13, -8], [-15, -22], [-16, -35], [-12, -42], [-2, -45], [10, -44], [16, -38], [16, -24], [13, -10], [12, 5]];
    // Yellow and pink crenellated columns on the belly.
    let cols = '';
    const colX = [-10, -4.5, 1, 6.5];
    colX.forEach((x, i) => {
      const c = i % 2 === 0 ? YOUTH.yellow : YOUTH.pink;
      cols += flat(`M${ox + x} ${oy - 1}V${oy - 17}L${ox + x + 1.8} ${oy - 19.5}L${ox + x + 3} ${oy - 17}L${ox + x + 4.2} ${oy - 19.5}L${ox + x + 5.5} ${oy - 17}V${oy - 1}Z`, c, { stroke: DETAIL });
    });
    // The eye emblem on the chest.
    const ex = ox + 3;
    const ey = oy - 31;
    const emblem =
      flat(`M${ex - 6} ${ey}Q${ex} ${ey - 5.5} ${ex + 6} ${ey}Q${ex} ${ey + 5} ${ex - 6} ${ey}Z`, '#fbf6ee', { stroke: DETAIL, inner: `<circle cx="${ex + 0.5}" cy="${ey}" r="2.4" fill="#6fb2d8"/><circle cx="${ex + 0.5}" cy="${ey}" r="1.1" fill="${INK}"/>` }) +
      ink(`M${ex - 5} ${ey - 3}l-1.5 -2M${ex - 2} ${ey - 4.2}l-0.6 -2.4M${ex + 1.5} ${ey - 4.4}l0.3 -2.4M${ex + 5} ${ey - 3}l1.6 -2M${ex - 3} ${ey + 3.8}l-0.8 2M${ex + 3} ${ey + 3.8}l0.8 2`, DETAIL * 0.85);
    const plates =
      ink(path(o([[-15, -23], [0, -22], [16, -24]])), DETAIL) +
      `<circle cx="${ox - 11}" cy="${oy - 38}" r="1.2" fill="${YOUTH.armourDark}" stroke="${INK}" stroke-width="0.8"/><circle cx="${ox + 12}" cy="${oy - 38}" r="1.2" fill="${YOUTH.armourDark}" stroke="${INK}" stroke-width="0.8"/>` +
      fillOnly(`M${ox - 20} ${oy + 1}H${ox + 20}V${oy + 9}H${ox - 20}Z`, YOUTH.armourDark) +
      ink(`M${ox - 20} ${oy + 1}H${ox + 20}`, DETAIL) +
      `<rect x="${ox + 1}" y="${oy + 1.5}" width="5" height="4" rx="1" fill="${YOUTH.yellow}" stroke="${INK}" stroke-width="0.9"/>`;
    let s = flat(roundPoly(o(armour), 5), YOUTH.armour, { inner: plates, over: cols + emblem });
    // The leafy collar (a ruff of yellow-green leaves under the head).
    const neck: Pt = [ox + 3, oy - 44];
    const ruff: [number, number, string][] = [[-2.95, 22, YOUTH.collarDeep], [-0.2, 21, YOUTH.collarDeep], [-2.6, 20, YOUTH.collar], [-0.55, 20, YOUTH.collar], [-2.25, 16, YOUTH.collar], [-0.9, 16, YOUTH.collar]];
    for (const [a, len, c] of ruff) s += leaf([neck[0] + Math.cos(a) * 3, neck[1] + Math.sin(a) * 2], a, len, c, { width: 0.3, stroke: DETAIL });
    return s;
  });
}

function upperArm(): PartArt {
  return part('gorti.youth.arm', { x0: -8, y0: -7, x1: 8, y1: 27 }, (ox, oy) =>
    flat(limb([ox, oy], [ox, oy + 22], 9.5, 8, 0.4), YOUTH.limb, { over: stitches([[ox + 1, oy + 7], [ox + 1.5, oy + 18]], 3.6, 1.8) }) +
    flat(roundPoly([[ox - 7, oy - 5], [ox + 7, oy - 5], [ox + 6.5, oy + 7], [ox - 6.5, oy + 7]], 3), YOUTH.blue, { stroke: DETAIL * 1.2, over: ink(`M${ox - 6} ${oy + 1}H${ox + 6}`, DETAIL * 0.8) }) +
    flat(roundPoly([[ox - 5, oy + 15], [ox + 5, oy + 15], [ox + 5, oy + 20], [ox - 5, oy + 20]], 1.5), YOUTH.yellow, { stroke: DETAIL }),
  { far: true });
}

function forearm(): PartArt {
  return part('gorti.youth.fore', { x0: -9, y0: -5, x1: 10, y1: 32 }, (ox, oy) => {
    let s = flat(limb([ox, oy], [ox, oy + 20], 8.2, 7, 0.3), YOUTH.limb, { over: stitches([[ox - 0.5, oy + 3], [ox, oy + 12]], 3.4, 1.7) });
    // The watch on the wrist.
    s += flat(`M${ox - 4.6} ${oy + 13}H${ox + 4.6}V${oy + 17.5}H${ox - 4.6}Z`, '#5a4e56', { stroke: DETAIL });
    s += flat(ellipsePath(ox + 1.5, oy + 15.2, 3.6, 3.6), '#f7eddc', { stroke: DETAIL, over: ink(`M${ox + 1.5} ${oy + 15.2}v-2.2M${ox + 1.5} ${oy + 15.2}l1.6 0.8`, 0.8) });
    // A mechanical hand: a palm block and blocky fingers.
    s += flat(roundPoly([[ox - 1.5, oy + 21], [ox + 3.2, oy + 22], [ox + 5.8, oy + 27.5], [ox + 3.5, oy + 29]], 1.2), YOUTH.limb, { stroke: DETAIL });
    s += flat(roundPoly([[ox - 4.5, oy + 19.5], [ox + 4, oy + 19.5], [ox + 4, oy + 25], [ox - 4.5, oy + 25]], 1.8), YOUTH.limb, { stroke: DETAIL * 1.1 });
    for (const x of [-3.5, -0.8, 1.9]) s += flat(roundPoly([[ox + x, oy + 24.5], [ox + x + 2.3, oy + 24.5], [ox + x + 2.1, oy + 30.5], [ox + x + 0.2, oy + 30.5]], 0.9), YOUTH.limb, { stroke: DETAIL * 0.9 });
    return s;
  }, { far: true });
}

function thigh(): PartArt {
  return part('gorti.youth.thigh', { x0: -8, y0: -5, x1: 8, y1: 27 }, (ox, oy) =>
    flat(limb([ox, oy], [ox, oy + 23], 12.5, 10, 0.5), YOUTH.limb, {
      over:
        stitches([[ox - 2, oy + 3], [ox - 2.5, oy + 13]], 3.6, 1.8) +
        flat(roundPoly([[ox - 5.5, oy + 16], [ox + 5.5, oy + 15.5], [ox + 5, oy + 24], [ox - 5, oy + 24]], 2), YOUTH.pink, { stroke: DETAIL, over: ink(`M${ox - 3} ${oy + 18}l2 2M${ox + 1} ${oy + 18}l2 2`, DETAIL * 0.8) }),
    }),
  { far: true });
}

function shin(): PartArt {
  return part('gorti.youth.shin', { x0: -7, y0: -4, x1: 7, y1: 26 }, (ox, oy) =>
    flat(limb([ox, oy], [ox, oy + 23], 10, 8, 0.2), YOUTH.limb, { over: ink(`M${ox - 5} ${oy + 9}H${ox + 5}`, DETAIL) + stitches([[ox + 1.5, oy + 11], [ox + 1.5, oy + 20]], 3.2, 1.6) }),
  { far: true });
}

/** A chunky boot (pivot at the ankle, sole at +6). */
function foot(): PartArt {
  return part('gorti.youth.foot', { x0: -8, y0: -5, x1: 16, y1: 8 }, (ox, oy) =>
    flat(roundPoly(tr([[-6, -3], [3, -3], [7, 0], [14, 1.5], [15, 6], [-7, 6]], ox, oy), [2, 2, 3, 3, 1.5, 1.5]), YOUTH.boot, {
      over: fillOnly(`M${ox - 8} ${oy + 3.8}H${ox + 16}V${oy + 7}H${ox - 8}Z`, YOUTH.pink) + ink(`M${ox - 7} ${oy + 3.8}H${ox + 15}`, DETAIL) + ink(`M${ox + 4} ${oy - 1}l-2 3`, DETAIL * 0.9),
    }),
  { far: true });
}

export function youthParts(): PartArt[] {
  return [
    head(), ...eyes(), ...mouth(), browPart('gorti.youth.brow', YOUTH.tendril, 12, 3.4, { stroke: DETAIL }),
    ...TENDRILS.map(tendril), torso(), upperArm(), forearm(), thigh(), shin(), foot(),
  ];
}

export const RIG_GORTI_YOUTH = humanoidRig('gorti.root.youth', 'gorti.youth', YOUTH_DIMS);

