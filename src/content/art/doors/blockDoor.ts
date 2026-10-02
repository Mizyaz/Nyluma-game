import type { DoorArt, DoorPiece } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { archPts, circleP, comic, crescent, darkOf, doorPart, fillP, glowDisc, ink, lightOf, LINE, page, poly, Rng, smooth, softStar, tuft, twinkle, type Pt } from './doorKit';

// b03, "Kırık Oda": the room of toy blocks and a crystal, and its way on
// is built of them: two columns of big painted blocks (they read KA and
// PI, "kapı"), an arch block across, and on top a jack-in-the-box. Until
// the crystal is broken a barricade of little blocks fills the doorway;
// then it tumbles down and bounces about the floor. Once it is open and
// Gorti comes near, the box's lid flips and the jester springs out to
// bob at him. Through the arch: the next room, an empty hill at night.

const C = {
  pink: '#f4b6c2',
  mint: '#bfe3d0',
  butter: '#f9e3a1',
  lilac: '#c9c0ef',
  peach: '#f9d0a8',
  sky: '#b8d6f2',
  aqua: '#a8d8e0',
  side: '#d9c6a6',
  jester: '#f6d7c0',
  hatA: '#f08fa6',
  hatB: '#9fd2c6',
  pompom: '#f9e3a1',
  // The empty hill beyond.
  night: '#3f3d5c',
  nightLow: '#5a5778',
  hill: '#6e7a8c',
  hillNear: '#8ea294',
  stoneTree: '#77737f',
  trunk: '#7c5a78',
  moon: '#eef2f8',
  floorIn: '#6f6a80',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** A big block's side, the opening between the columns, how high the columns stand. */
const B = 46;
const W = 92;
const COL = 3 * B;
const RISE = 38;
const H = COL + RISE;
const OPEN = archPts(W, H, { rise: RISE, n: 26 });
/** The top of the arch block, and the jack-in-the-box on it. */
const TOP = -COL - 52;
const BOX = 34;

/** A letter painted in thick strokes (K, A, P, I), about 22 px high, centred at cx, cy. */
function letter(ch: string, cx: number, cy: number, color: string): string {
  const P = (x: number, y: number): string => `${f(cx + x)} ${f(cy + y)}`;
  const d: Record<string, string> = {
    K: `M${P(-6, -11)}V${P(-6, 11).split(' ')[1]}M${P(7, -11)}L${P(-5, 1)}M${P(-2, -2)}L${P(8, 11)}`,
    A: `M${P(-8, 11)}L${P(0, -11)}L${P(8, 11)}M${P(-4.6, 3)}H${f(cx + 4.6)}`,
    P: `M${P(-6, 11)}V${f(cy - 11)}H${f(cx + 1)}Q${P(9, -11)} ${P(9, -4)}Q${P(9, 2)} ${P(1, 2)}H${f(cx - 6)}`,
    I: `M${P(0, -11)}V${f(cy + 11)}M${P(-5, -11)}H${f(cx + 5)}M${P(-5, 11)}H${f(cx + 5)}`,
  };
  const path = d[ch] ?? '';
  return ink(path, 6.4, '#fffaf2') + ink(path, 3.8, color);
}

/** A big painted block (its front face), x0,y0 its top left corner: a letter, a star or a moon on it. */
function block(x0: number, y0: number, fill: string, mark: string): string {
  const cx = x0 + B / 2;
  const cy = y0 + B / 2;
  let inner = comic(rrect(x0 + 6, y0 + 6, B - 12, B - 12, 4), lightOf(fill, 0.22), { line: LINE.fine, ink: darkOf(fill, 0.2) });
  const tone = darkOf(fill, 0.42);
  if (mark === '*') inner += comic(softStar(cx, cy + 1, 13, 0.5, -Math.PI / 2), tone, { line: LINE.detail });
  else if (mark === ')') inner += comic(crescent(cx - 2, cy, 12, 1.32), tone, { line: LINE.detail });
  else inner += letter(mark, cx, cy, tone);
  return comic(rrect(x0, y0, B, B, 5), fill, { line: LINE.limb, rim: [3.6, -1.6], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, inner });
}

/** The doorway: the two columns, the arch block across them. */
function frame(): string {
  let s = '';
  const left: [string, string][] = [
    [C.butter, '*'],
    [C.mint, 'A'],
    [C.pink, 'K'],
  ];
  const right: [string, string][] = [
    [C.sky, ')'],
    [C.peach, 'I'],
    [C.lilac, 'P'],
  ];
  left.forEach(([fill, m], i) => (s += block(-W / 2 - B, -(i + 1) * B, fill, m)));
  right.forEach(([fill, m], i) => (s += block(W / 2, -(i + 1) * B, fill, m)));
  // The arch block: a long block with a round bite out of its bottom, dots painted on it.
  const outer: Pt[] = [
    [-W / 2 - B - 4, TOP],
    [W / 2 + B + 4, TOP],
    [W / 2 + B + 4, -COL],
    [W / 2, -COL],
    ...OPEN.filter((p) => p[1] < -COL + 0.5)
      .slice()
      .reverse()
      .map(([x, y]) => [x, y] as Pt),
    [-W / 2, -COL],
    [-W / 2 - B - 4, -COL],
  ];
  let dots = '';
  for (const [x, y, c] of [
    [-110, -168, C.pink],
    [-80, -178, C.butter],
    [80, -176, C.mint],
    [108, -166, C.lilac],
    [-62, -160, C.sky],
    [62, -158, C.peach],
  ] as const)
    dots += comic(circleP(x * 0.92, y, 4.6), c, { line: LINE.fine });
  s += comic(poly(outer), C.aqua, { line: LINE.limb, rim: [4, -1.8], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, inner: dots, over: ink(smooth(OPEN.filter((p) => p[1] < -COL + 0.5).map(([x, y]) => [x * 1.12, y - 5] as Pt), 1, false), 0.8, darkOf(C.aqua, 0.25)) });
  return s;
}

/** A little block of the barricade, centred at 0,0. */
function cube(fill: string, k: number): string {
  const r = 15;
  let inner = comic(rrect(-r + 4, -r + 4, 2 * r - 8, 2 * r - 8, 3), lightOf(fill, 0.22), { line: LINE.fine, ink: darkOf(fill, 0.2) });
  const tone = darkOf(fill, 0.42);
  if (k % 3 === 0) inner += comic(circleP(0, 0, 4.4), tone, { line: LINE.fine });
  else if (k % 3 === 1) for (const [x, y] of [[-4, -4], [4, 4], [0, 0]] as const) inner += fillP(circleP(x, y, 2), tone);
  else inner += comic(softStar(0, 0.6, 6.4, 0.5, -Math.PI / 2), tone, { line: LINE.fine });
  return comic(rrect(-r, -r, 2 * r, 2 * r, 4), fill, { line: LINE.small, rim: [2.6, -1.2], glint: [-0.8, 0.8], inner });
}

// ---------------------------------------------------------------- the jack-in-the-box

function jackBox(): string {
  let s = comic(rrect(-BOX / 2, -BOX, BOX, BOX, 3), C.pink, { line: LINE.small, rim: [3, -1.4], glint: [-0.8, 0.8], inner: comic(rrect(-BOX / 2 + 5, -BOX + 5, BOX - 10, BOX - 10, 3), lightOf(C.pink, 0.2), { line: LINE.fine }) });
  s += comic('M0 -10C-4 -16 -10 -12 -7 -7L0 -1L7 -7C10 -12 4 -16 0 -10Z', C.butter, { line: LINE.detail });
  // The crank on its side.
  s += ink(`M${BOX / 2} -18h6v-8`, 2, darkOf(C.peach, 0.3)) + comic(ellipsePath(BOX / 2 + 6, -28, 3, 4), C.peach, { line: LINE.fine });
  return s;
}

/** The lid, hinged at its left end (0,0), lying along the box's top. */
function jackLid(): string {
  return comic(rrect(-1, -4, BOX + 2, 5, 1.5), darkOf(C.pink, 0.06), { line: LINE.small, rim: [1.4, -0.6], glint: [-0.5, 0.5] }) + comic(circleP(BOX / 2, -5.6, 2.4), C.butter, { line: LINE.fine });
}

/** The jester on his spring (the spring's foot at 0,0, deep in the box). */
function jester(): string {
  let spring = 'M0 30';
  for (let y = 26; y > -14; y -= 6) spring += `L${y % 12 === 2 ? 6 : -6} ${y}`;
  spring += 'L0 -14';
  let s = ink(spring, 2.2, darkOf(C.lilac, 0.25));
  // The collar, the face, the two-tailed hat with its bells.
  s += comic('M-12 -14Q-6 -20 0 -15Q6 -20 12 -14Q8 -10 0 -12Q-8 -10 -12 -14Z', C.hatB, { line: LINE.detail });
  s += comic(circleP(0, -26, 11.5), C.jester, { line: LINE.small, rim: [2.2, -1], glint: [-0.6, 0.6], tone: '#e7c4c6' });
  s += comic('M-11 -30Q-16 -44 -24 -40Q-14 -42 -10 -34Z', C.hatA, { line: LINE.detail }) + comic('M11 -30Q16 -44 24 -40Q14 -42 10 -34Z', C.hatB, { line: LINE.detail });
  s += comic('M-11 -30Q0 -40 11 -30Q0 -34 -11 -30Z', C.hatA, { line: LINE.detail });
  s += comic(circleP(-24, -40, 3), C.pompom, { line: LINE.fine }) + comic(circleP(24, -40, 3), C.pompom, { line: LINE.fine });
  const line = darkOf(C.jester, 0.55);
  for (const x of [-4.2, 4.2]) s += fillP(ellipsePath(x, -27, 1.6, 2.2), '#4a3550') + fillP(circleP(x + 0.5, -27.8, 0.5), '#ffffff');
  for (const x of [-7.6, 7.6]) s += fillP(ellipsePath(x, -22.6, 2.2, 1.3), C.hatA, 0.7);
  s += comic('M-5 -21Q0 -15 5 -21Q0 -19 -5 -21Z', '#e98a9c', { line: LINE.fine, ink: line });
  s += fillP(circleP(0, -24, 2.2), '#f08fa6');
  return s;
}

// ---------------------------------------------------------------- inside: the blocks' thickness, then the empty hill

function in0(): string {
  // The columns' inner faces, block after block, and the arch block's underside.
  let over = '';
  for (let i = 1; i < 3; i++) over += ink(`M-120 ${-i * B}H120`, 0.9, darkOf(C.side, 0.2));
  return page(OPEN, -100, 100, -200, 10, C.side, darkOf(C.side, 0.25), { wallOver: over, rim: 3 });
}

/** The next room, empty: a night hill, one stone tree, the moon, nothing else. */
function beyond(): string {
  const rng = new Rng(hashSeed('door.block.beyond'));
  let s = `<linearGradient id="blsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.night}"/><stop offset="1" stop-color="${C.nightLow}"/></linearGradient>`;
  s += `<rect x="-170" y="-240" width="340" height="242" fill="url(#blsky)"/>`;
  for (let i = 0; i < 14; i++) s += fillP(circleP(rng.range(-160, 160), rng.range(-230, -90), rng.range(0.6, 1.3)), '#efeaff', rng.range(0.4, 0.85));
  s += glowDisc(70, -170, 34, '#dfe6ff', 0.3);
  s += comic(crescent(76, -170, 17, 1.3), C.moon, { line: LINE.small, rim: [1.6, -0.8], over: ink('M63 -172q2.4 2.4 4.8 0', 0.8, darkOf(C.moon, 0.5)) });
  s += twinkle(20, -200, 2.6, '#fff7d6', 0.5);
  s += comic(smooth([[-180, -60], [-90, -84], [0, -74], [90, -92], [180, -70], [180, 4], [-180, 4]]), C.hill, { line: LINE.small, rim: [3, -1.4] });
  s += comic(rrect(56, -122, 8, 46, 3), C.trunk, { line: LINE.detail });
  s += comic(smooth([[36, -116], [40, -150], [62, -162], [86, -150], [88, -118], [60, -108]]), C.stoneTree, { line: LINE.small, rim: [3, -1.4], over: ink('M50 -134q5 4 10 0M64 -146q5 4 10 0', 0.8, darkOf(C.stoneTree, 0.35)) });
  s += comic(smooth([[-180, -22], [-80, -34], [20, -28], [180, -38], [180, 92], [-180, 92]]), C.hillNear, { line: LINE.small, rim: [3, -1.4] });
  for (let i = 0; i < 6; i++) s += tuft(rng.range(-150, 150), rng.range(-14, 30), rng.range(6, 9), lightOf(C.hillNear, 0.12), 90 + i);
  return s;
}

/** The toy-block doorway of b03. */
export function blockDoor(): DoorArt {
  const fills = [C.pink, C.mint, C.butter, C.lilac, C.peach, C.sky];
  const parts = [
    doorPart('door.block.frame', { x0: -W / 2 - B - 8, y0: TOP - 4, x1: W / 2 + B + 8, y1: 4 }, frame()),
    doorPart('door.block.in0', { x0: -100, y0: -200, x1: 100, y1: 10 }, in0()),
    doorPart('door.block.beyond', { x0: -170, y0: -240, x1: 170, y1: 92 }, beyond()),
    doorPart('door.block.box', { x0: -BOX / 2 - 4, y0: -BOX - 4, x1: BOX / 2 + 12, y1: 3 }, jackBox()),
    doorPart('door.block.lid', { x0: -3, y0: -10, x1: BOX + 3, y1: 3 }, jackLid()),
    doorPart('door.block.jester', { x0: -29, y0: -46, x1: 29, y1: 33 }, jester()),
    ...fills.map((fill, i) => doorPart(`door.block.cube${i}`, { x0: -17, y0: -17, x1: 17, y1: 17 }, cube(fill, i))),
  ];
  // The barricade: three columns of four little blocks, the top ones falling first.
  const rng = new Rng(hashSeed('door.block.barricade'));
  const cubes: DoorPiece[] = [];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const x = (col - 1) * 30 + rng.range(-1.5, 1.5);
      const y = -15 - row * 30;
      const side = col === 1 ? (row % 2 ? 1 : -1) : col - 1;
      const land = side * (W / 2 + B + 18 + rng.range(0, 40) + row * 12);
      cubes.push({
        key: `door.block.cube${(row * 3 + col * 2) % 6}`,
        x,
        y,
        dz: 2 + row * 0.1,
        shut: { angle: rng.range(-3, 3) },
        open: { x: land - x, y: -15 - y, angle: side * (90 * (1 + Math.floor(rng.range(0, 3))) + rng.range(-10, 10)) },
        lag: (3 - row) * 0.12 + rng.range(0, 0.05),
        wake: { y: -1 },
        wakeShut: 'only',
        sway: { x: 0.5, ms: 160 + col * 23, byWake: true },
      });
    }
  }
  const jackY = TOP;
  return {
    parts,
    opening: OPEN,
    frame: [{ key: 'door.block.frame', x: 0, y: 0, dz: 0 }],
    inside: [
      { key: 'door.block.beyond', x: 0, y: 0, dz: -140, order: 0 },
      { key: 'door.block.in0', x: 0, y: 0, dz: -22, order: 2 },
    ],
    backdrop: 0x2e2c40,
    shutDim: 0.45,
    front: [],
    pieces: [
      ...cubes,
      // The jester behind the box (it hides him), the lid, the box: he wants out while the way is shut.
      { key: 'door.block.jester', x: 0, y: jackY - 10, dz: -0.6, shut: { y: 30 }, open: { y: 30 }, peek: { y: -68 }, sway: { y: 3, angle: 4, ms: 620 } },
      { key: 'door.block.box', x: 0, y: jackY, dz: 0.4, shut: {}, open: {}, wakeShut: 'only', sway: { angle: 3, ms: 170, byWake: true } },
      { key: 'door.block.lid', x: -BOX / 2, y: jackY - BOX, dz: 0.6, shut: {}, open: {}, peek: { angle: -118, x: -2 }, wakeShut: 'only', sway: { angle: -6, ms: 170, byWake: true } },
    ],
    leaves: [],
    light: { color: 0xd9dcff, radius: 300, intensity: 0.75, y: 80 },
    glow: { color: 0xc9d0ff, pool: 0xe6e0ff },
    sparks: { colors: [0xfff1a0, 0xf8c8d8, 0xc8f0e0], frame: 'fx.spark', rate: 1, size: 0.36 },
    sounds: { wake: ['click', 0.2, 1.4], peek: ['chirp', 0.32, 1.7], open: [['clunk', 0.45, 1.2], ['crystal', 0.25, 1.6]] },
    openMs: 1700,
    openEase: 'Bounce.easeOut',
  };
}
