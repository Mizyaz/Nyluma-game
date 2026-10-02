import type { DoorArt, DoorPiece } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { archPts, circleP, comic, crescent, crystals, darkOf, doorPart, fillP, glowDisc, ink, lightOf, LINE, lining, page, poly, Rng, smooth, softStar, tuft, twinkle, type Pt } from './doorKit';

// b02's way on, at the far end of "Ay Kapısı": a door into a grassy hill,
// closed by a great wheel painted half day and half night, like a playing
// card: the Sun rising over a green hill on its upper half, and on its
// lower half, upside down, the Moon in her nightcap over a blue one. The
// Sun sleeps until Gorti comes, then wakes and watches him, and the wheel
// rocks as if it wanted to roll: but this door waits for the night. Once
// he has gone through the Moon's gate, the wheel rolls aside along its
// groove, turning over as it goes, so that the Moon comes up on top; she
// opens her eye at him. Through the tunnel: the next room's clearing, its
// toy blocks and its blue crystal, at dusk.

const C = {
  hill: '#a9cf9c',
  hillDark: '#8dbb86',
  grass: '#bfe0ae',
  soil: '#c7a98a',
  stone: '#cfc6d6',
  stone2: '#bdb3c8',
  rim: '#e2c08c',
  bolt: '#b5916a',
  dayTop: '#cfe6f2',
  dayLow: '#f8e2c2',
  cloud: '#fffaf2',
  sun: '#f7ad6a',
  ray: '#f6dc6a',
  dayHill: '#b9dc9e',
  nightTop: '#3f4278',
  nightLow: '#5a5a92',
  moon: '#fff0b4',
  cap: '#9d8fd6',
  capBand: '#f2e9ff',
  nightHill: '#6c77a8',
  cheek: '#f2a6b6',
  white: '#fffaf3',
  iris: '#d886a6',
  pupil: '#4a3550',
  flower: '#f7d0e0',
  flower2: '#fbefb4',
  mush: '#f0a8a8',
  // Inside: the tunnel, then the next room's clearing at dusk.
  tunnel: '#a88f78',
  tunnelDeep: '#8e7866',
  floorIn: '#7f6c5c',
  sky: '#6d6684',
  skyLow: '#9a8ea6',
  pines: '#5d5a72',
  ground: '#d8c3c2',
  groundFar: '#b9a7b6',
  crystal: '#a9c4f0',
  crystal2: '#bcd2f6',
  blockA: '#f4b6c2',
  blockB: '#bfe3d0',
  blockC: '#f9e3a1',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The opening into the hill, and the wheel that closes it. */
const W = 96;
const H = 180;
/** A threshold of stones: the opening starts this far up, so the round wheel closes it all. */
const SILL = 10;
const ARCH = archPts(W, H, { rise: 48, n: 28 });
const OPEN: Pt[] = archPts(W, H - SILL, { rise: 48, n: 28 }).map(([x, y]) => [x, y - SILL]);
const R = 100;
/** Where the wheel comes to rest once it has rolled aside: half a turn, so the Moon is on top. */
const ROLL = -Math.round(Math.PI * R);
/** The Sun's face on the wheel (from its middle); the Moon, and her eye, on the night half drawn upright. */
const SUN: Pt = [0, -46];
const SUN_EYES: Pt = [0, -51];
const MOON: Pt = [10, -44];
const MOON_EYE: Pt = [-8, -49];
/** How far the wheel rocks while it wakes (degrees), and how long a rock takes. */
const ROCK = 1.4;
const ROCK_MS = 1500;

/** A clump of shrubs on the hill: a bumpy dome. */
function lump(x: number, y: number, w: number, h: number, seed: number): string {
  const rng = new Rng(seed);
  const pts: Pt[] = [[x - w / 2, y]];
  const n = 7;
  for (let i = 1; i < n; i++) {
    const t = Math.PI - (i / n) * Math.PI;
    const k = i % 2 ? rng.range(1.02, 1.12) : rng.range(0.9, 0.96);
    pts.push([x + Math.cos(t) * (w / 2) * k, y - Math.sin(t) * h * k]);
  }
  pts.push([x + w / 2, y]);
  const d = smooth(pts, 0.85);
  return comic(d, C.hillDark, { line: LINE.small, rim: [3.4, -1.6], glint: [-0.9, 0.9], hatch: 2.4, hatchWidth: 0.45, over: ink(`M${f(x - w * 0.2)} ${f(y - h * 0.5)}q${f(w * 0.08)} ${f(-h * 0.18)} ${f(w * 0.16)} 0`, 0.8, darkOf(C.hillDark, 0.25)) });
}

/** A daisy. */
function daisy(x: number, y: number, r: number, petal: string): string {
  let s = ink(`M${f(x)} ${f(y + r)}v${f(r * 2.4)}`, 0.9, darkOf(C.hill, 0.3));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    s += comic(ellipsePath(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.5, r * 0.32), petal, { line: LINE.fine });
  }
  return s + comic(circleP(x, y, r * 0.38), '#f6cf6a', { line: LINE.fine });
}

function hill(): string {
  const rng = new Rng(hashSeed('door.hill'));
  const outline: Pt[] = [
    [-300, 2],
    [-288, -40],
    [-252, -112],
    [-192, -196],
    [-112, -250],
    [-20, -268],
    [70, -250],
    [132, -200],
    [170, -122],
    [186, -40],
    [192, 2],
  ];
  let inner = '';
  for (let i = 0; i < 60; i++) {
    const x = rng.range(-290, 180);
    const y = rng.range(-260, -6);
    inner += tuft(x, y, rng.range(5, 9), rng.chance(0.5) ? C.grass : C.hillDark, i + 7);
  }
  const hole = [...OPEN].reverse();
  // Shrubs and stones half sunk in the turf.
  for (const [x, y, w, h] of [[-214, -112, 58, 26], [-150, -196, 64, 28], [-62, -232, 50, 20], [104, -150, 52, 24], [138, -64, 44, 20], [-238, -26, 46, 22]] as const) inner += lump(x, y, w, h, Math.round(x * 7 - y));
  for (const [x, y, w] of [[-176, -70, 13], [-96, -150, 9], [80, -212, 10], [150, -100, 8]] as const) inner += comic(ellipsePath(x, y, w, w * 0.55), C.stone2, { line: LINE.detail, rim: [1.6, -0.8], glint: [-0.6, 0.6] });
  let s = comic(smooth(outline, 0.9) + poly(hole), C.hill, { line: LINE.body, rim: [16, -7], glint: [-1.6, 1.6], hatch: 2.6, hatchWidth: 0.5, inner });
  // A ring of stones round the doorway.
  s += lining(OPEN, { every: 15, thick: 13, fills: [C.stone, C.stone2, lightOf(C.stone, 0.1)], seed: 61, round: 0.6, line: LINE.detail });
  // The track the wheel has worn, out past the hill's foot.
  s += fillP(smooth([[ROLL - R * 0.7, 2], [ROLL - R * 0.6, -5], [R * 0.5, -6], [R * 0.7, 2]], 0.6), C.soil, 0.4);
  s += ink(`M${ROLL - R * 0.62} 1.4H${R * 0.6}`, 0.8, darkOf(C.soil, 0.25), 0.6);
  for (let i = 0; i < 9; i++) s += comic(ellipsePath(rng.range(ROLL - R * 0.5, R * 0.4), rng.range(-3.5, -0.5), rng.range(1.4, 2.6), rng.range(0.9, 1.5)), C.stone2, { line: LINE.fine });
  // Flowers on the hill, and toadstools at its foot.
  for (let i = 0; i < 18; i++) {
    const x = rng.range(-260, 160);
    const y = rng.range(-232, -30);
    if (Math.abs(x) < W / 2 + 24 && y > -H - 30) continue;
    s += i % 3 === 0 ? daisy(x, y - 9, 4.2, '#fffaf0') : ink(`M${f(x)} ${f(y)}v-8`, 0.9, darkOf(C.hill, 0.3)) + comic(circleP(x, y - 9, 3), i % 2 ? C.flower : C.flower2, { line: LINE.fine });
  }
  for (const [x, k] of [[96, 1], [116, 0.75], [-262, 0.85]] as const) {
    s += comic(rrect(x - 2.5 * k, -12 * k - 4, 5 * k, 12 * k, 2), '#f6efe2', { line: LINE.fine });
    s += comic(smooth([[x - 10 * k, -11 * k - 4], [x - 6 * k, -18 * k - 4], [x + 6 * k, -18 * k - 4], [x + 10 * k, -11 * k - 4]]), C.mush, { line: LINE.fine, rim: [1, -0.5], over: fillP(circleP(x - 3 * k, -14 * k - 4, 1.4 * k), '#fff6f0') + fillP(circleP(x + 4 * k, -13 * k - 4, 1.1 * k), '#fff6f0') });
  }
  return s;
}

/** The day: sky, the Sun rising (its eyes are their own pieces), a green hill. */
function day(): string {
  let s = `<linearGradient id="hwday" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.dayTop}"/><stop offset="1" stop-color="${C.dayLow}"/></linearGradient>`;
  s += `<rect x="${-R}" y="${-R}" width="${2 * R}" height="${R}" fill="url(#hwday)"/>`;
  s += glowDisc(SUN[0], SUN[1], 54, '#fff6d0', 0.9);
  for (const [x, y, k] of [[-58, -58, 1], [56, -66, 0.8]] as const) {
    s += comic(smooth([[x - 16 * k, y + 4], [x - 10 * k, y - 5 * k], [x - 2 * k, y - 8 * k], [x + 8 * k, y - 6 * k], [x + 16 * k, y + 4]]), C.cloud, { line: LINE.fine, rim: [1.2, -0.6] });
  }
  // A ring of soft rays round the Sun, like the one in the sky.
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.11;
    const P = (r: number, da: number): Pt => [SUN[0] + Math.cos(a + da) * r, SUN[1] + Math.sin(a + da) * r];
    s += comic(smooth([P(24, -0.2), P(38, 0), P(24, 0.2)], 0.3), C.ray, { line: LINE.fine });
  }
  s += comic(circleP(SUN[0], SUN[1], 26), C.sun, { line: LINE.small, rim: [2.6, -1.2], glint: [-0.8, 0.8] });
  for (const x of [-14, 14]) s += fillP(ellipsePath(SUN[0] + x, SUN[1] + 9, 4.4, 2.6), C.cheek, 0.8);
  // Asleep: the eyes (their own pieces) cover these lids when the Sun wakes.
  s += `<g transform="translate(${SUN_EYES[0]} ${SUN_EYES[1]})">${lids([-9, 9], C.sun)}</g>`;
  s += ink(`M${SUN[0] - 7} ${SUN[1] + 12}Q${SUN[0]} ${SUN[1] + 18} ${SUN[0] + 7} ${SUN[1] + 12}`, 1.4, darkOf(C.sun, 0.5));
  s += comic(smooth([[-R - 4, 4], [-R, -10], [-60, -20], [-20, -13], [30, -22], [R, -10], [R + 4, 4]]), C.dayHill, { line: LINE.small, rim: [2, -1] });
  return s;
}

/** The night, drawn upright (the wheel shows it upside down until it has turned over). */
function night(): string {
  const rng = new Rng(hashSeed('door.hill.night'));
  let s = `<linearGradient id="hwnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.nightTop}"/><stop offset="1" stop-color="${C.nightLow}"/></linearGradient>`;
  s += `<rect x="${-R}" y="${-R}" width="${2 * R}" height="${R}" fill="url(#hwnight)"/>`;
  s += glowDisc(MOON[0] - 10, MOON[1], 52, '#a3aaf0', 0.55);
  for (let i = 0; i < 18; i++) {
    const x = rng.range(-84, 84);
    const y = rng.range(-88, -14);
    if (Math.hypot(x - MOON[0] + 8, y - MOON[1]) < 36) continue;
    s += fillP(circleP(x, y, rng.range(0.7, 1.5)), '#f3f0ff', rng.range(0.5, 0.9));
  }
  s += twinkle(54, -64, 4.4, '#fff7d6', 0.5) + twinkle(-62, -36, 3.4, '#fff7d6', 0.5) + twinkle(66, -30, 2.6, '#fff7d6', 0.5);
  // The Moon: a fat crescent, her belly to the left, a sleepy cheek and a smile on it.
  const [mx, my] = MOON;
  s += comic(crescent(mx, my, 30, 1.8), C.moon, { line: LINE.small, rim: [2.4, -1.1], glint: [-0.8, 0.8] });
  s += fillP(ellipsePath(mx - 22, my + 7, 3.8, 2.4), C.cheek, 0.85);
  s += `<g transform="translate(${MOON_EYE[0]} ${MOON_EYE[1]})">${lids([0], C.moon)}</g>`;
  s += ink(`M${mx - 20} ${my + 13}q4 3.4 8 0.6`, 1.2, darkOf(C.moon, 0.5));
  // Her nightcap, flopping over her top horn, a bobble on its tip.
  const cap = smooth([[mx - 22, my - 18], [mx - 16, my - 34], [mx - 2, my - 44], [mx + 14, my - 44], [mx + 26, my - 34], [mx + 30, my - 22], [mx + 22, my - 26], [mx + 10, my - 32], [mx - 2, my - 30], [mx - 12, my - 22]], 0.8);
  s += comic(cap, C.cap, { line: LINE.small, rim: [2, -1], glint: [-0.6, 0.6], over: ink(`M${mx - 10} ${my - 38}q8 -4 16 -2M${mx + 6} ${my - 42}q8 0 14 6`, 0.9, lightOf(C.cap, 0.3)) });
  s += comic(smooth([[mx - 24, my - 16], [mx - 22, my - 24], [mx - 12, my - 26], [mx - 4, my - 30], [mx - 2, my - 24], [mx - 12, my - 18]], 0.8), C.capBand, { line: LINE.fine });
  s += comic(circleP(mx + 30, my - 18, 4.6), C.capBand, { line: LINE.fine, rim: [1, -0.5] });
  s += comic(smooth([[-R - 4, 4], [-R, -8], [-52, -18], [6, -11], [58, -20], [R, -8], [R + 4, 4]]), C.nightHill, { line: LINE.small, rim: [2, -1] });
  return s;
}

/** The wheel: the day on its upper half, the night on its lower half (upside down). */
function wheel(): string {
  const halves = `<g>${day()}</g><g transform="rotate(180)">${night()}</g>`;
  let s = comic(circleP(0, 0, R), C.dayTop, { line: LINE.body, rim: [5, -2.2], glint: [-1.2, 1.2], inner: halves });
  // The rim: a wooden tyre with bolts; a hub where the two hills meet.
  s += `<circle cx="0" cy="0" r="${R - 5}" fill="none" stroke="${C.rim}" stroke-width="9"/>`;
  s += `<circle cx="0" cy="0" r="${R - 5}" fill="none" stroke="${darkOf(C.rim, 0.25)}" stroke-width="0.8" stroke-dasharray="3 9"/>`;
  s += `<circle cx="0" cy="0" r="${R - 9.5}" fill="none" stroke="${darkOf(C.rim, 0.3)}" stroke-width="1"/>`;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + Math.PI / 12;
    s += comic(circleP(Math.cos(a) * (R - 5), Math.sin(a) * (R - 5), 2.4), C.bolt, { line: LINE.fine });
  }
  s += comic(circleP(0, 0, 9), C.rim, { line: LINE.small, rim: [2, -1], glint: [-0.6, 0.6], over: comic(circleP(0, 0, 3), C.bolt, { line: LINE.fine }) });
  return s;
}

/** Eyes at `xs`: shut and sleepy (painted on the wheel), open whites, or the irises (the Moon shows one, in profile). */
function lids(xs: readonly number[], color: string): string {
  const line = darkOf(color, 0.55);
  return xs.map((x) => ink(`M${x - 4.4} -0.4Q${x} 3.4 ${x + 4.4} -0.4`, 1.4, line) + ink(`M${x - 3.8} 1.3l-1.3 1.4M${x + 3.8} 1.3l1.3 1.4`, 0.9, line)).join('');
}
function whites(xs: readonly number[], color: string): string {
  return xs.map((x) => comic(ellipsePath(x, 0, 5.2, 6.2), C.white, { line: LINE.detail, ink: darkOf(color, 0.55) })).join('');
}
function irises(xs: readonly number[]): string {
  return xs.map((x) => fillP(circleP(x, 0.6, 2.9), C.iris) + fillP(circleP(x, 0.8, 1.6), C.pupil) + fillP(circleP(x + 0.9, -0.5, 0.8), '#ffffff')).join('');
}

// ---------------------------------------------------------------- inside

function in0(): string {
  // The tunnel's mouth: earth with roots and pebbles.
  let over = '';
  const rng = new Rng(hashSeed('door.hill.in0'));
  for (let i = 0; i < 14; i++) over += comic(ellipsePath(rng.range(-100, 100), rng.range(-200, -10), rng.range(3, 6), rng.range(2, 4)), C.stone2, { line: LINE.fine });
  over += ink('M-90 -160Q-70 -150 -66 -130M86 -120Q70 -110 72 -90', 1.4, darkOf(C.tunnel, 0.3));
  return page(ARCH, -110, 110, -220, 12, C.tunnel, C.floorIn, { wallOver: over, rim: 4 });
}

function in1(): string {
  const hole = archPts(W - 8, H - 8, { rise: 44 });
  let over = '';
  for (let i = 0; i < 4; i++) over += ink(`M${-120 + i * 70} -10Q${-100 + i * 70} -100 ${-110 + i * 70} -210`, 0.9, darkOf(C.tunnelDeep, 0.2));
  return page(hole, -130, 130, -232, 24, C.tunnelDeep, darkOf(C.floorIn, 0.1), { wallOver: over, rim: 3 });
}

/** The next room, b03's clearing at dusk: pines, a round tree, the blue crystal, toy blocks. Seen from the left, so its middle is right of the door's. */
function beyond(): string {
  const rng = new Rng(hashSeed('door.hill.beyond'));
  let s = `<linearGradient id="hdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky}"/><stop offset="1" stop-color="${C.skyLow}"/></linearGradient>`;
  s += `<rect x="-170" y="-250" width="340" height="252" fill="url(#hdsky)"/>`;
  for (let i = 0; i < 10; i++) s += fillP(circleP(rng.range(-160, 160), rng.range(-240, -120), rng.range(0.6, 1.2)), '#f4eeff', rng.range(0.35, 0.75));
  s += fillP(softStar(96, -176, 4.4, 0.45), '#fff7d6', 0.9) + twinkle(34, -196, 2.6, '#fff7d6', 0.5);
  // Pines along the far edge of the clearing.
  for (let i = 0; i < 9; i++) {
    const x = -150 + i * 38 + rng.range(-6, 6);
    const h = rng.range(34, 52);
    s += comic(poly([[x - 11, -78], [x, -78 - h], [x + 11, -78]]), C.pines, { line: LINE.fine });
  }
  s += comic(smooth([[-180, -86], [-60, -92], [40, -84], [180, -94], [180, -40], [-180, -40]]), C.groundFar, { line: LINE.small, rim: [2, -1] });
  // A round tree, like the clearing's.
  s += comic(rrect(108, -120, 9, 60, 3), '#8a6f8c', { line: LINE.detail });
  s += comic(smooth([[84, -114], [86, -150], [110, -170], [138, -156], [142, -122], [114, -108]]), '#7f8a6c', { line: LINE.small, rim: [3, -1.4], over: ink('M98 -136q5 4 10 0M114 -150q5 4 10 0', 0.8, '#66704f') });
  s += comic(smooth([[-180, -52], [-40, -58], [60, -50], [180, -60], [180, 92], [-180, 92]]), C.ground, { line: LINE.small, rim: [3, -1.4] });
  // The blue crystal, and toy blocks knocked about beside it.
  s += crystals(64, -30, 58, [C.crystal, C.crystal2, C.crystal], 73, 1.0);
  s += comic(rrect(16, -52, 24, 24, 3), C.blockA, { line: LINE.small, rim: [2, -1], glint: [-0.6, 0.6], over: comic(rrect(21, -47, 14, 14, 2), lightOf(C.blockA, 0.2), { line: LINE.fine }) });
  s += comic(poly([[104, -40], [124, -44], [128, -24], [108, -20]]), C.blockC, { line: LINE.small, rim: [2, -1], over: comic(poly([[108, -37], [121, -40], [124, -27], [111, -24]]), lightOf(C.blockC, 0.2), { line: LINE.fine }) });
  s += comic(rrect(-30, -40, 22, 22, 3), C.blockB, { line: LINE.small, rim: [2, -1] });
  for (let i = 0; i < 5; i++) s += tuft(rng.range(-150, 150), rng.range(-24, 30), rng.range(6, 9), lightOf(C.ground, 0.1), 90 + i);
  return s;
}

/** The hill door at the end of b02. */
export function hillDoor(): DoorArt {
  const two = [-9, 9];
  const one = [0];
  const parts = [
    doorPart('door.hill.hill', { x0: -438, y0: -276, x1: 198, y1: 8 }, hill()),
    doorPart('door.hill.wheel', { x0: -R - 4, y0: -R - 4, x1: R + 4, y1: R + 4 }, wheel()),
    doorPart('door.hill.sunEyes', { x0: -16, y0: -8, x1: 16, y1: 8 }, whites(two, C.sun)),
    doorPart('door.hill.sunIris', { x0: -13, y0: -4, x1: 13, y1: 5 }, irises(two)),
    doorPart('door.hill.moonEye', { x0: -7, y0: -8, x1: 7, y1: 8 }, whites(one, C.moon)),
    doorPart('door.hill.moonIris', { x0: -4, y0: -4, x1: 4, y1: 5 }, irises(one)),
    doorPart('door.hill.in0', { x0: -110, y0: -220, x1: 110, y1: 12 }, in0()),
    doorPart('door.hill.in1', { x0: -130, y0: -232, x1: 130, y1: 24 }, in1()),
    doorPart('door.hill.beyond', { x0: -170, y0: -250, x1: 170, y1: 92 }, beyond()),
  ];
  // The wheel rocks a little while it wakes, as if rolling: the Sun's eyes ride with it.
  const th = (ROCK * Math.PI) / 180;
  const rockWheel = { angle: ROCK, x: th * R, ms: ROCK_MS, byWake: true };
  const rockEyes = { angle: ROCK, x: th * (R - SUN_EYES[1]), ms: ROCK_MS, byWake: true };
  // The Sun's eyes, open and watching while Gorti is near (shut, they are painted on); shut again before the wheel rolls.
  const sun = (key: string, dz: number, extra: Partial<DoorPiece>): DoorPiece => ({ key, x: SUN_EYES[0], y: -R + SUN_EYES[1], dz, shut: { alpha: 0 }, open: { alpha: -4 }, wake: { alpha: 1 }, wakeShut: true, sway: rockEyes, ...extra });
  // The Moon's eye, once the wheel has turned over, open while Gorti is near.
  const moon = (key: string, dz: number, extra: Partial<DoorPiece>): DoorPiece => ({ key, x: ROLL + MOON_EYE[0], y: -R + MOON_EYE[1], dz, shut: { alpha: -1 }, open: { alpha: 0 }, lag: 0.92, ...extra });
  return {
    parts,
    opening: OPEN,
    frame: [{ key: 'door.hill.hill', x: 0, y: 0, dz: 0 }],
    inside: [
      { key: 'door.hill.beyond', x: 0, y: 0, dz: -150, order: 0 },
      { key: 'door.hill.in1', x: 0, y: 0, dz: -64, order: 2 },
      { key: 'door.hill.in0', x: 0, y: 0, dz: -22, order: 3 },
    ],
    backdrop: 0x2c2a3e,
    shutDim: 0.4,
    front: [],
    pieces: [
      // The wheel rolls aside and turns over; it waits for the Sun's eyes to close first.
      { key: 'door.hill.wheel', x: 0, y: -R, dz: 2, shut: {}, open: { x: ROLL, angle: -180 }, lag: 0.2, wake: {}, wakeShut: 'only', sway: rockWheel },
      sun('door.hill.sunEyes', 2.6, { blink: true }),
      sun('door.hill.sunIris', 3.6, { look: { x: 2.2, y: 0.6 }, blink: true }),
      moon('door.hill.moonEye', 2.6, { wake: { alpha: 1 }, blink: true }),
      moon('door.hill.moonIris', 3.6, { wake: { alpha: 1 }, look: { x: 1.6, y: 0.5 }, blink: true }),
    ],
    leaves: [],
    light: { color: 0xe6dcff, radius: 320, intensity: 0.75, y: 80 },
    glow: { color: 0xd6d0ff, pool: 0xe8e2ff },
    sparks: { colors: [0xfff7d6, 0xe6dcff, 0xd8f0ff], frame: 'fx.spark', rate: 1.1, size: 0.36 },
    sounds: { wake: ['chirp', 0.18, 1.5], open: [['rumble', 0.35, 1.4], ['noteLow', 0.3, 1.1]] },
    openMs: 2100,
    openEase: 'Sine.easeInOut',
  };
}
