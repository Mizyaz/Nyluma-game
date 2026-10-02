import type { DoorArt } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { archPts, area, circleP, comic, crystals, darkOf, doorPart, fillP, glowDisc, ink, leafPart, lightOf, LINE, page, poly, resample, Rng, smooth, tuft, twinkle, type Pt } from './doorKit';

// b01's way on, at the far end of "Form Kapısı": a clipped hedge arch, as
// a garden keeps between its rooms, and since this room is all about
// forms, the hedge is clipped into one: a topiary bunny sits on top, its
// ears drooping while the little picket gate below stays shut. Once Gorti
// has been through the form door the gate swings open, the roses on the
// hedge bloom, the bunny pricks up its ears at him and, when he comes
// close, hops. Through the arch, a path between hedges leads to the next
// room: the hill where the Sun is out and a crystal gate waits for night.

const C = {
  hedge: '#9fcf98',
  hedgeDark: '#86bb83',
  hedgeLight: '#b9e0ac',
  rose: '#f4a9bf',
  roseBud: '#e98aa6',
  picket: '#f6f1e8',
  eye: '#3f3346',
  nose: '#f08fa6',
  // Inside: the hedge's thickness, the path, the hill of the next room.
  inHedge: '#7fae86',
  path: '#d9c9a6',
  sky: '#55527a',
  skyLow: '#7a6f8e',
  sunFace: '#f6ad67',
  ray: '#f5e06c',
  hill: '#7d7a98',
  hillNear: '#9cb79a',
  stoneTree: '#77737f',
  trunk: '#7c5a78',
  teal: '#a6dcd5',
  lilac: '#c8b8ea',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The opening: 96 wide, 196 high; the gate: two leaves 104 high. */
const W = 96;
const H = 196;
const OPEN = archPts(W, H, { rise: 48, n: 28 });
const GATE_H = 104;
/** The hedge: 260 wide, 262 high, the bunny on its top. */
const HW = 130;
const HT = -262;

/** A closed outline (clockwise on the screen) drawn with every edge but the floor bulging out in leafy bumps. */
function bumps(pts: readonly Pt[], every: number, bump: number, seed: number): string {
  const rng = new Rng(seed);
  const p0 = area(pts) > 0 ? [...pts] : [...pts].reverse();
  const p = resample(p0, every);
  let d = `M${f(p[0]![0])} ${f(p[0]![1])}`;
  for (let i = 0; i < p.length; i++) {
    const a = p[i]!;
    const b = p[(i + 1) % p.length]!;
    if (a[1] > -3 && b[1] > -3) {
      d += `L${f(b[0])} ${f(b[1])}`;
      continue;
    }
    const tx = b[0] - a[0];
    const ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    const k = bump * rng.range(0.7, 1.3) * 2;
    d += `Q${f((a[0] + b[0]) / 2 + (ty / l) * k)} ${f((a[1] + b[1]) / 2 - (tx / l) * k)} ${f(b[0])} ${f(b[1])}`;
  }
  return d + 'Z';
}

/** Leafy texture inside a hedge: little clumps, light up and right, dark down and left. */
function clumps(x0: number, y0: number, x1: number, y1: number, seed: number, n: number): string {
  const rng = new Rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rng.range(x0, x1);
    const y = rng.range(y0, y1);
    const r = rng.range(5, 10);
    s += fillP(circleP(x - 1.4, y + 1.4, r), C.hedgeDark, 0.55) + fillP(circleP(x + 0.8, y - 0.8, r * 0.7), C.hedgeLight, 0.6);
    if (rng.chance(0.3)) s += ink(`M${f(x - r * 0.4)} ${f(y)}q${f(r * 0.3)} -${f(r * 0.4)} ${f(r * 0.7)} 0`, 0.6, darkOf(C.hedge, 0.3));
  }
  return s;
}

function hedge(): string {
  const outer = archPts(HW * 2, -HT, { rise: 112, n: 30 });
  const cut = [...OPEN];
  const d = bumps(outer, 16, 4.5, hashSeed('door.hedge.outline')) + poly(area(cut) > 0 ? [...cut].reverse() : cut);
  let s = comic(d, C.hedge, { line: LINE.body, rim: [5, -2.4], glint: [-1.2, 1.2], hatch: 2.6, hatchWidth: 0.5, inner: clumps(-HW, HT, HW, 0, hashSeed('door.hedge.clumps'), 70) });
  // The cut edge of the opening, clipped neat.
  s += ink(smooth(OPEN.filter((p) => p[1] < -1).map(([x, y]) => [x * 1.06, y * 1.02 - 2] as Pt), 1, false), 1.2, darkOf(C.hedge, 0.3));
  // Gate posts at the opening's feet.
  for (const x of [-W / 2 - 4, W / 2 + 4]) {
    s += comic(rrect(x - 5, -GATE_H - 14, 10, GATE_H + 14, 2), C.picket, { line: LINE.small, rim: [2.4, -1], glint: [-0.6, 0.6] });
    s += comic(circleP(x, -GATE_H - 17, 5.4), C.picket, { line: LINE.small, rim: [1.6, -0.8] });
  }
  for (const x of [-HW + 16, HW - 22]) s += tuft(x, 2, 9, C.hedgeLight, x * 7);
  return s;
}

/** A rose on the hedge: a bud, or open. */
function rose(open: boolean): string {
  if (!open) return comic('M0 -6Q4.4 -2 3 2.4Q0 4.6 -3 2.4Q-4.4 -2 0 -6Z', C.roseBud, { line: LINE.detail, rim: [1, -0.5] }) + comic('M-3 2.6Q0 6 3 2.6L0 5.4Z', C.hedgeDark, { line: LINE.fine });
  let s = '';
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    s += comic(ellipsePath(Math.cos(a) * 4.2, Math.sin(a) * 4.2, 3.8, 3), C.rose, { line: LINE.fine });
  }
  return s + comic(circleP(0, 0, 3), darkOf(C.rose, 0.12), { line: LINE.fine, over: ink('M-1.6 0q1.6 -1.8 3.2 0', 0.6, darkOf(C.rose, 0.35)) });
}

// ---------------------------------------------------------------- the topiary bunny

/** Its body and head, clipped from the hedge (sitting on the arch at 0,0). */
function bunny(): string {
  let s = comic(smooth([[-30, 0], [-32, -18], [-22, -34], [-4, -38], [10, -32], [18, -20], [20, -6], [16, 0]]), C.hedge, { line: LINE.limb, rim: [3.4, -1.6], glint: [-1, 1], inner: clumps(-32, -40, 20, 0, 31, 12) });
  // The tail, round and fluffy, and the head.
  s += comic(circleP(-30, -12, 8), C.hedgeLight, { line: LINE.small, rim: [1.8, -0.8], inner: clumps(-38, -20, -22, -4, 32, 3) });
  s += comic(smooth([[2, -34], [6, -50], [20, -58], [34, -52], [38, -38], [30, -28], [12, -26]]), C.hedge, { line: LINE.limb, rim: [3, -1.4], glint: [-1, 1], inner: clumps(2, -60, 38, -26, 33, 7) });
  return s;
}

/** An ear (its base at 0,0, standing up). */
function ear(): string {
  return comic('M-5 0Q-9 -20 -3 -34Q2 -38 5 -32Q8 -18 5 0Z', C.hedge, { line: LINE.small, rim: [2, -1], glint: [-0.6, 0.6], inner: clumps(-8, -36, 6, 0, 34, 4) + fillP('M-2 -4Q-4 -18 -1 -28Q2 -18 2 -4Z', C.rose, 0.45) });
}

/** Its face: button eyes, a pink nose (centred at the head). */
function face(): string {
  return fillP(circleP(-4, -2, 2.6), C.eye) + fillP(circleP(-3.2, -2.9, 0.8), '#ffffff') + fillP(circleP(8, -2.4, 2.4), C.eye) + fillP(circleP(8.7, -3.2, 0.7), '#ffffff') + comic(ellipsePath(14.6, 3, 2.6, 2), C.nose, { line: LINE.fine });
}

// ---------------------------------------------------------------- the picket gate

/** A leaf of the little gate: pickets on two rails (its hinge on the left: the left leaf; mirrored for the right). */
function gateLeaf(back: boolean): string {
  const w = W / 2 - 1;
  const h = GATE_H;
  let s = '';
  for (const y of [h * 0.3, h * 0.78]) s += comic(rrect(0, y, w, 7, 1.5), darkOf(C.picket, 0.05), { line: LINE.detail, rim: [1.4, -0.6] });
  if (back) s += comic(poly([[3, h * 0.78], [w - 3, h * 0.3 + 6], [w - 3, h * 0.3 + 12], [3, h * 0.78 + 6]]), darkOf(C.picket, 0.06), { line: LINE.fine });
  const n = 5;
  for (let i = 0; i < n; i++) {
    const x = 2 + (i * (w - 10)) / (n - 1);
    const top = 6 + Math.abs(i - (n - 1) / 2) * -1.6 + 3;
    s += comic(`M${f(x)} ${f(top + 6)}L${f(x + 3)} ${f(top)}L${f(x + 6)} ${f(top + 6)}V${h}H${f(x)}Z`, C.picket, { line: LINE.small, rim: [1.8, -0.8], glint: [-0.5, 0.5] });
  }
  if (!back) s += `<g transform="translate(${f(w / 2)} ${f(h * 0.55)})">${comic('M0 -2C-2.6 -5 -6.4 -2.6 -4.4 0.6L0 4.4L4.4 0.6C6.4 -2.6 2.6 -5 0 -2Z', C.rose, { line: LINE.fine })}</g>`;
  return s;
}

// ---------------------------------------------------------------- inside

function in0(): string {
  // The hedge's thickness: leafy walls either side.
  return page(OPEN, -110, 110, -220, 12, C.inHedge, darkOf(C.path, 0.12), { wallOver: clumps(-110, -220, 110, 0, 41, 40), rim: 4 });
}

function in1(): string {
  // A second hedge further in, the path running on through it.
  const hole = archPts(W - 6, H - 4, { rise: 46 });
  return page(hole, -130, 130, -232, 24, darkOf(C.inHedge, 0.06), C.path, { wallOver: clumps(-130, -232, 130, 0, 42, 46), rim: 3 });
}

/** The next room: the hill where the Sun is out, the crystal gate far off, waiting. */
function beyond(): string {
  const rng = new Rng(hashSeed('door.hedge.beyond'));
  let s = `<linearGradient id="hgsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky}"/><stop offset="1" stop-color="${C.skyLow}"/></linearGradient>`;
  s += `<rect x="-170" y="-250" width="340" height="252" fill="url(#hgsky)"/>`;
  // The Sun high up, beaming (she is out in there).
  s += glowDisc(60, -186, 60, '#ffe9a8', 0.5);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    s += comic(poly([[60 + Math.cos(a - 0.2) * 16, -186 + Math.sin(a - 0.2) * 16], [60 + Math.cos(a) * 26, -186 + Math.sin(a) * 26], [60 + Math.cos(a + 0.2) * 16, -186 + Math.sin(a + 0.2) * 16]]), C.ray, { line: LINE.fine });
  }
  s += comic(circleP(60, -186, 16), C.sunFace, { line: LINE.small, rim: [2, -1], glint: [-0.6, 0.6] });
  s += ink('M53 -188q2.4 -2.4 4.8 0M62.6 -188q2.4 -2.4 4.8 0M55 -180q5 4 10 0', 0.9, darkOf(C.sunFace, 0.5));
  for (let i = 0; i < 8; i++) s += fillP(circleP(rng.range(-160, 160), rng.range(-240, -120), rng.range(0.6, 1.2)), '#efeaff', rng.range(0.3, 0.7));
  s += comic(smooth([[-180, -70], [-90, -96], [0, -84], [90, -104], [180, -80], [180, 4], [-180, 4]]), C.hill, { line: LINE.small, rim: [3, -1.4] });
  // The crystal gate, far off on the hill.
  s += crystals(26, -88, 22, [C.teal, C.lilac], 51, 0.5) + crystals(44, -86, 20, [C.lilac, C.teal], 52, 0.5);
  s += comic(rrect(-66, -142, 7, 48, 3), C.trunk, { line: LINE.detail });
  s += comic(smooth([[-86, -136], [-82, -168], [-60, -178], [-38, -166], [-36, -136], [-62, -128]]), C.stoneTree, { line: LINE.small, rim: [3, -1.4], over: ink('M-74 -152q5 4 10 0M-60 -164q5 4 10 0', 0.8, darkOf(C.stoneTree, 0.35)) });
  s += comic(smooth([[-180, -30], [-80, -40], [20, -34], [180, -46], [180, 92], [-180, 92]]), C.hillNear, { line: LINE.small, rim: [3, -1.4] });
  for (let i = 0; i < 7; i++) s += tuft(rng.range(-150, 150), rng.range(-20, 30), rng.range(6, 9), lightOf(C.hillNear, 0.12), 80 + i);
  s += twinkle(-20, -210, 2.4, '#fff7d6', 0.5);
  return s;
}

/** The hedge arch at the end of b01. */
export function hedgeArch(): DoorArt {
  const BY = HT + 30;
  const parts = [
    doorPart('door.hedge.frame', { x0: -HW - 12, y0: HT - 12, x1: HW + 12, y1: 6 }, hedge()),
    doorPart('door.hedge.bunny', { x0: -42, y0: -64, x1: 42, y1: 4 }, bunny()),
    doorPart('door.hedge.ear', { x0: -11, y0: -40, x1: 10, y1: 3 }, ear()),
    doorPart('door.hedge.face', { x0: -8, y0: -7, x1: 18, y1: 6 }, face()),
    doorPart('door.hedge.bud', { x0: -6, y0: -8, x1: 6, y1: 7 }, rose(false)),
    doorPart('door.hedge.rose', { x0: -9, y0: -9, x1: 9, y1: 9 }, rose(true)),
    leafPart('door.hedge.gateL', W / 2 - 1, GATE_H, gateLeaf(false)),
    leafPart('door.hedge.gateL.back', W / 2 - 1, GATE_H, gateLeaf(true)),
    leafPart('door.hedge.gateR', W / 2 - 1, GATE_H, gateLeaf(false)),
    leafPart('door.hedge.gateR.back', W / 2 - 1, GATE_H, gateLeaf(true)),
    doorPart('door.hedge.in0', { x0: -110, y0: -220, x1: 110, y1: 12 }, in0()),
    doorPart('door.hedge.in1', { x0: -130, y0: -232, x1: 130, y1: 24 }, in1()),
    doorPart('door.hedge.beyond', { x0: -170, y0: -250, x1: 170, y1: 92 }, beyond()),
  ];
  const hop = { y: -14 };
  const roses: [number, number][] = [
    [-104, -150],
    [-70, -232],
    [92, -196],
    [112, -96],
    [-112, -60],
  ];
  return {
    parts,
    opening: OPEN,
    frame: [{ key: 'door.hedge.frame', x: 0, y: 0, dz: 0 }],
    inside: [
      { key: 'door.hedge.beyond', x: 0, y: 0, dz: -150, order: 0 },
      { key: 'door.hedge.in1', x: 0, y: 0, dz: -60, order: 2 },
      { key: 'door.hedge.in0', x: 0, y: 0, dz: -20, order: 3 },
    ],
    backdrop: 0x2f2c40,
    front: [],
    pieces: [
      // The roses: buds while the gate is shut, opening one after another.
      ...roses.flatMap(([x, y], i) => [
        { key: 'door.hedge.bud', x, y, dz: 1, shut: {}, open: { alpha: 0, sx: 0.4, sy: 0.4 }, lag: 0.2 + i * 0.1 },
        { key: 'door.hedge.rose', x, y, dz: 1.1, shut: { alpha: 0, sx: 0.2, sy: 0.2, angle: -60 }, open: {}, lag: 0.25 + i * 0.1, sway: { angle: 5, ms: 2600 + i * 300 } },
      ]),
      // The bunny: its ears droop while the gate is shut and prick up as Gorti comes; it hops when he is near.
      { key: 'door.hedge.ear', x: 14, y: BY - 52, dz: 0.4, shut: { angle: -70 }, open: { angle: -20 }, wake: { angle: 22 }, wakeShut: true, peek: hop, sway: { angle: 4, ms: 1900 } },
      { key: 'door.hedge.bunny', x: 0, y: BY, dz: 0.5, peek: hop, sway: { y: 0.8, ms: 2400 } },
      { key: 'door.hedge.ear', x: 24, y: BY - 52, dz: 0.6, shut: { angle: 60 }, open: { angle: 14 }, wake: { angle: -16 }, wakeShut: true, peek: hop, sway: { angle: -4, ms: 1700 } },
      { key: 'door.hedge.face', x: 18, y: BY - 42, dz: 0.7, peek: hop, look: { x: 2, y: 0.5 }, blink: true, sway: { y: 0.8, ms: 2400 } },
    ],
    leaves: [
      { front: 'door.hedge.gateL', back: 'door.hedge.gateL.back', hinge: 'left', x: -W / 2 + 1, y: -GATE_H, dz: 1, shutAngle: 0, restAngle: 150, wideAngle: 162, strips: 8 },
      { front: 'door.hedge.gateR', back: 'door.hedge.gateR.back', hinge: 'right', x: W / 2 - 1, y: -GATE_H, dz: 1, shutAngle: 0, restAngle: 96, wideAngle: 118, strips: 8 },
    ],
    light: { color: 0xfff0c4, radius: 300, intensity: 0.8, y: 80 },
    glow: { color: 0xffe9b8, pool: 0xfff0c8 },
    sparks: { colors: [0xf8c8d8, 0xfff1a0, 0xe8ffc8], frame: 'fx.petal', rate: 1.1, size: 0.4 },
    sounds: { wake: ['chirp', 0.22, 1.5], peek: ['chirp', 0.3, 1.9], open: [['door', 0.35, 1.45], ['bloom', 0.35, 1.1]] },
    openMs: 1300,
  };
}
