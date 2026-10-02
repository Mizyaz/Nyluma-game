import type { DoorArt } from '../../../render/2d/fx/doorway';
import { ellipsePath, hashSeed, rrect } from '../../../render/2d/svg';
import { leaf } from '../../characters/kit';
import {
  archPts,
  barkRoot,
  bit,
  circleP,
  comic,
  crescent,
  darkOf,
  deckle,
  doorPart,
  fillP,
  glowDisc,
  grow,
  holed,
  ink,
  leafPart,
  lightOf,
  LINE,
  page,
  poly,
  Rng,
  smooth,
  softStar,
  thread,
  tuft,
  twinkle,
  type Pt,
} from './doorKit';

// The first wind's way on: an old tree at the end of the wood with a round
// green door in its foot. The door stands ajar; as Gorti comes it swings
// wide, the firefly jar over it brightens and a raccoon (the wood's
// raccoons) leans out from behind the jamb to look at him. Inside, the
// tree's rings run back like a tunnel to its far side, and through it the
// next hill shows under the night: the moon, the stone trees, the grass.

const C = {
  bark: '#b39aa8',
  barkDark: '#9d8494',
  barkLight: '#cdb9c3',
  wood: '#ecd3b4',
  ring: '#d9b993',
  moss: '#a9c89c',
  mossDark: '#8fb48c',
  leafy: '#b4d19b',
  leafBack: '#97b894',
  door: '#9cc7a9',
  door2: '#8fbd9f',
  doorBack: '#b8d8bf',
  batten: '#d9b48f',
  knob: '#f3c6d3',
  glass: '#6d7aa1',
  shroom: '#f1a7b9',
  shroomStem: '#f7ead9',
  jar: '#dceef0',
  firefly: '#fff3a6',
  lid: '#c79e7c',
  coon: '#a8a2b4',
  coonDark: '#5d5869',
  coonLight: '#ece8f1',
  nose: '#f0a3b8',
  // Inside: the tree's wood, from its cut lip to the far mouth.
  in1: '#d8b896',
  in2: '#bf9d84',
  in3: '#a5877a',
  floorIn: '#c7a88a',
  // The hill beyond.
  sky: '#3b3a55',
  skyLow: '#56577a',
  hill: '#7f9c86',
  hillFar: '#61796f',
  grass: '#9dbd94',
  moon: '#d9f0f7',
  stoneTree: '#8f8a96',
  trunk: '#9a7790',
} as const;

const f = (n: number): number => Math.round(n * 100) / 100;

/** The door's opening: round topped, 94 wide, 186 high. */
const W = 94;
const H = 186;
const RISE = 47;
const OPEN = archPts(W, H, { rise: RISE, n: 30 });
/** The trunk: wide at its foot, its right side against the end of the room. */
const TL = -136;
const TR = 92;
const TOP = -760;

/** Growth rings round the opening: offset outlines of it, inked lightly. */
function rings(hole: Pt[], from: number, n: number, gap: number, color: string, seed: number): string {
  const rng = new Rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const r = grow(hole, from + i * gap + rng.range(-1, 1)).filter((p) => p[1] < -2);
    s += ink(smooth(r, 1, false), i % 3 === 0 ? 0.8 : 0.55, color);
  }
  return s;
}

/** The old tree: its trunk and roots, the opening's cut lip, moss, mushrooms, the stub the jar hangs from. */
function trunk(): string {
  const rng = new Rng(hashSeed('door.tree.trunk'));
  // Outline: roots flaring onto the floor, the trunk rising, a little wavy.
  const left: Pt[] = [
    [TL - 50, 4],
    [TL - 30, -6],
    [TL - 6, -26],
    [TL + 6, -70],
    [TL + 14, -150],
    [TL + 10, -260],
    [TL + 18, -380],
    [TL + 14, -520],
    [TL + 22, -660],
    [TL + 20, TOP],
  ];
  const right: Pt[] = [
    [TR - 20, TOP],
    [TR - 24, -640],
    [TR - 18, -500],
    [TR - 22, -360],
    [TR - 14, -220],
    [TR - 8, -110],
    [TR, -40],
    [TR + 10, 4],
  ];
  const outline: Pt[] = [...left, ...right];
  // Bark: long grooves up the trunk, a few knots, moss at the foot.
  let bark = '';
  for (let i = 0; i < 14; i++) {
    const x = TL + 20 + i * 15 + rng.range(-4, 4);
    if (x > -W / 2 - 8 && x < W / 2 + 8) {
      // Over the door only above its arch.
      const pts: Pt[] = [];
      for (let y = -H - 30; y > TOP; y -= 60) pts.push([x + rng.range(-3, 3), y]);
      if (pts.length > 1) bark += ink(smooth(pts, 1, false), 1.1, C.barkDark);
      continue;
    }
    const pts: Pt[] = [];
    for (let y = -6; y > TOP; y -= 55) pts.push([x + Math.sin(y * 0.01 + i) * 4 + rng.range(-2, 2), y]);
    bark += ink(smooth(pts, 1, false), i % 3 ? 1 : 1.4, C.barkDark);
  }
  for (const [x, y, r] of [[-104, -330, 7], [60, -420, 9], [-70, -560, 6]] as const) {
    bark += comic(ellipsePath(x, y, r * 0.7, r), C.barkDark, { line: LINE.detail, over: fillP(ellipsePath(x + 0.5, y + 1, r * 0.3, r * 0.55), darkOf(C.barkDark, 0.35)) });
  }
  let s = comic(holed(outline, [OPEN]), C.bark, { line: LINE.body, rim: [6, -2.6], glint: [-1.4, 1.4], hatch: 2.6, hatchWidth: 0.55, inner: bark });
  // The cut lip round the opening: the tree's pale wood and its rings.
  const lip = grow(OPEN, 11).map(([x, y]) => [x, Math.min(3, y)] as Pt);
  s += comic(holed(lip, [OPEN]), C.wood, { line: LINE.limb, rim: [2.4, -1.2], glint: [-0.8, 0.8], inner: rings(OPEN, 3, 3, 3, C.ring, 3) });
  // Roots over the foot, moss and grass.
  s += barkRoot([[-96, -60], [-120, -30], [-150, -8], [-184, 2]], 24, 8, C.bark, 11);
  s += barkRoot([[-62, -18], [-80, -4], [-104, 4]], 14, 5, C.bark, 12);
  s += barkRoot([[62, -40], [76, -16], [100, 3]], 18, 6, C.bark, 13);
  s += comic(smooth([[-176, 4], [-160, -10], [-130, -14], [-104, -6], [-90, 4]]), C.moss, { line: LINE.small, rim: [2, -1], hatch: 0 });
  s += comic(smooth([[60, 4], [70, -8], [92, -12], [104, 0]]), C.moss, { line: LINE.small, rim: [2, -1] });
  for (const [x, k] of [[-150, 10], [-118, 8], [-64, 7], [70, 9], [96, 7]] as const) s += tuft(x, 2, k, C.mossDark, x);
  // Ivy up the left side.
  const ivy: Pt[] = [[-112, -40], [-118, -120], [-106, -200], [-116, -280], [-104, -340]];
  s += ink(smooth(ivy, 1, false), 1.3, darkOf(C.leafy, 0.4));
  ivy.forEach(([x, y], i) => {
    s += leaf([x, y - 10], i % 2 ? -0.4 : Math.PI + 0.4, 13, i % 2 ? C.leafy : C.leafBack);
  });
  // Mushrooms at the foot of the jamb.
  for (const [x, h, r] of [[-70, 14, 8], [-82, 9, 5.5], [64, 11, 6.5]] as const) s += shroom(x, 0, h, r);
  // A carved moon and an arrow over the door: the way to the hill.
  s += ink(crescent(-6, -249, 9, 1.3), 1.1, darkOf(C.bark, 0.45));
  s += ink('M8 -249H24M19 -254L24 -249L19 -244', 1.1, darkOf(C.bark, 0.45));
  // The stub the jar hangs from.
  s += barkRoot([[-104, -262], [-122, -266], [-140, -262]], 14, 9, C.bark, 14);
  s += comic(ellipsePath(-141, -262, 4, 6.5), C.wood, { line: LINE.detail, over: ink('M-141 -265V-259', 0.5, C.ring) });
  // Up the trunk, a round window lit within, a box of flowers under it.
  s += comic(circleP(-30, -420, 24), C.wood, { line: LINE.limb, rim: [2.4, -1.2], inner: rings([[-30, -444], [-6, -420], [-30, -396], [-54, -420]], 1, 1, 3, C.ring, 5) });
  s += comic(circleP(-30, -420, 17), '#ffe3a0', { line: LINE.small, over: glowDisc(-30, -420, 17, '#fff6d0', 0.8) + fillP('M-47 -420Q-40 -436 -30 -437Q-38 -428 -38 -404Z', '#f3b6c8') + ink('M-30 -437V-403M-47 -420H-13', 1.6, C.wood) });
  s += comic(rrect(-56, -398, 52, 10, 3), C.batten, { line: LINE.small, rim: [1.6, -0.8] });
  for (const [x, col] of [[-48, '#f3b6c8'], [-38, '#fff1a6'], [-26, '#c9dcf3'], [-14, '#f3b6c8']] as const) {
    s += ink(`M${x} -398v-7`, 0.9, darkOf(C.leafy, 0.4)) + fillP(circleP(x, -407, 3.2), col) + fillP(circleP(x, -407, 1.1), '#fff8e8');
  }
  return s;
}

function shroom(x: number, y: number, h: number, r: number): string {
  let s = comic(rrect(x - r * 0.28, y - h, r * 0.56, h, r * 0.2), C.shroomStem, { line: LINE.detail, rim: [1, -0.4] });
  s += comic(smooth([[x - r, y - h + 1], [x - r * 0.7, y - h - r * 0.7], [x, y - h - r * 0.95], [x + r * 0.7, y - h - r * 0.7], [x + r, y - h + 1]]), C.shroom, {
    line: LINE.detail,
    rim: [1.4, -0.6],
    glint: [-0.5, 0.5],
    over: fillP(circleP(x - r * 0.35, y - h - r * 0.45, r * 0.16), '#fff6f0') + fillP(circleP(x + r * 0.3, y - h - r * 0.6, r * 0.12), '#fff6f0'),
  });
  return s;
}

/** The crown: green masses over the trunk, mostly above the picture (its lower edge shows). */
function crown(): string {
  const rng = new Rng(hashSeed('door.tree.crown'));
  let s = '';
  const blobs: [number, number, number, string][] = [
    [-150, -720, 90, C.leafBack],
    [60, -740, 96, C.leafBack],
    [-60, -690, 84, C.leafy],
    [-200, -660, 60, C.leafy],
    [110, -660, 64, C.leafy],
    [-10, -640, 58, C.leafy],
  ];
  for (const [x, y, r, col] of blobs) {
    const pts: Pt[] = [];
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const k = r * (0.86 + 0.14 * Math.sin(i * 2.7 + x)) * rng.range(0.94, 1.05);
      pts.push([x + Math.cos(a) * k, y + Math.sin(a) * k * 0.8]);
    }
    let marks = '';
    for (let i = 0; i < 5; i++) {
      const mx = x + rng.range(-r * 0.6, r * 0.6);
      const my = y + rng.range(-r * 0.3, r * 0.5);
      marks += ink(`M${f(mx - 6)} ${f(my - 2)}Q${f(mx)} ${f(my + 3)} ${f(mx + 6)} ${f(my - 2)}`, 1.1, darkOf(col, 0.3));
    }
    s += comic(smooth(pts), col, { line: LINE.body, rim: [r * 0.12, -r * 0.08], glint: [-2, 2], hatch: 2.6, hatchWidth: 0.5, over: marks });
  }
  return s;
}

/** The jar of fireflies on its string (the string's top at 0,0). */
function jar(): string {
  let s = thread([0, 0], [0, 22], darkOf(C.lid, 0.4), 0.8);
  s += glowDisc(0, 36, 22, C.firefly, 0.55);
  s += comic(smooth([[-9, 26], [-10, 40], [-6, 47], [6, 47], [10, 40], [9, 26]]), C.jar, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8] });
  s += comic(rrect(-8, 21, 16, 6, 2), C.lid, { line: LINE.detail, rim: [1, -0.5] });
  for (const [x, y] of [[-3, 34], [4, 38], [0, 42], [-5, 41], [3, 31]] as const) s += fillP(circleP(x, y, 1.4), C.firefly) + fillP(circleP(x, y, 0.6), '#ffffff');
  return s;
}

/** The jar's light, drawn additive. */
function jarGlow(): string {
  return glowDisc(0, 0, 34, '#fff1a0', 0.9);
}

/** The door's front: planks of soft green, two battens, a round window, a pink knob, a painted moon. */
function doorFront(): string {
  const w = W - 2;
  const h = H - 1;
  const shape = archPts(w, h, { rise: RISE - 1, n: 26 }).map(([x, y]) => [x + w / 2, y + h] as Pt);
  let planks = '';
  for (let i = 1; i < 4; i++) planks += ink(`M${f((w * i) / 4)} 6V${h}`, LINE.small, darkOf(C.door, 0.35));
  for (let i = 0; i < 4; i++) {
    const x = (w * (i + 0.5)) / 4;
    planks += ink(`M${f(x - 3)} ${f(h * 0.3)}q2 14 0 30M${f(x + 4)} ${f(h * 0.62)}q-2 10 0 20`, 0.6, darkOf(C.door, 0.25));
  }
  let s = comic(poly(shape), C.door, { line: LINE.limb, rim: [4, -1.8], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5, inner: planks });
  for (const y of [h * 0.36, h * 0.8]) s += comic(rrect(4, y, w - 8, 9, 3), C.batten, { line: LINE.small, rim: [1.6, -0.8], over: fillP(circleP(10, y + 4.5, 1.3), darkOf(C.batten, 0.4)) + fillP(circleP(w - 10, y + 4.5, 1.3), darkOf(C.batten, 0.4)) });
  // The round window, the night in it.
  const cx = w / 2;
  const cy = h * 0.2;
  s += comic(circleP(cx, cy, 14), C.batten, { line: LINE.small, rim: [1.6, -0.8] });
  s += comic(circleP(cx, cy, 10.5), C.glass, { line: LINE.detail, over: ink(`M${f(cx)} ${f(cy - 10)}V${f(cy + 10)}M${f(cx - 10)} ${f(cy)}H${f(cx + 10)}`, 1.4, C.batten) + fillP(ellipsePath(cx + 4, cy - 4, 2.4, 1.6), '#dfe6ff', 0.8) });
  // The knob (by the free edge: it hangs on its right) and a painted crescent.
  s += comic(circleP(13, h * 0.58, 4.6), C.knob, { line: LINE.detail, rim: [1.2, -0.6], glint: [-0.6, 0.6] });
  s += fillP(crescent(cx - 2, h * 0.5 + 7, 7, 1.3), '#f6f0d8');
  s += twinkle(cx + 8, h * 0.52, 2.2, '#f6f0d8', 0.5) + twinkle(cx + 12, h * 0.6, 1.6, '#f6f0d8', 0.5);
  return s;
}

/** Its back (seen when it swings past square): bare planks, a Z brace, a hook with a tiny scarf. */
function doorBack(): string {
  const w = W - 2;
  const h = H - 1;
  const shape = archPts(w, h, { rise: RISE - 1, n: 26 }).map(([x, y]) => [x + w / 2, y + h] as Pt);
  let planks = '';
  for (let i = 1; i < 4; i++) planks += ink(`M${f((w * i) / 4)} 6V${h}`, LINE.small, darkOf(C.doorBack, 0.35));
  let s = comic(poly(shape), C.doorBack, { line: LINE.limb, rim: [4, -1.8], glint: [-1, 1], inner: planks });
  s += comic(poly([[6, h * 0.3], [w - 6, h * 0.3], [w - 6, h * 0.3 + 9], [16, h * 0.82], [6, h * 0.82], [6, h * 0.82 - 9], [w - 18, h * 0.3 + 9], [6, h * 0.3 + 9]]), C.batten, { line: LINE.small, rim: [1.6, -0.8] });
  // A hook, and a striped scarf on it.
  s += comic(circleP(w * 0.3, h * 0.22, 2.4), C.lid, { line: LINE.detail });
  s += comic(smooth([[w * 0.3 - 4, h * 0.22], [w * 0.3 + 5, h * 0.22], [w * 0.3 + 7, h * 0.5], [w * 0.3 + 1, h * 0.52], [w * 0.3 - 2, h * 0.3]]), '#f2b7c6', {
    line: LINE.detail,
    rim: [1.4, -0.6],
    over: ink(`M${f(w * 0.3 - 2)} ${f(h * 0.3)}h8M${f(w * 0.3 - 1)} ${f(h * 0.38)}h8M${f(w * 0.3)} ${f(h * 0.46)}h7`, 1.4, '#fff1d6'),
  });
  return s;
}

/** The raccoon who lives here, leaning out from behind the right jamb (its pivot at its feet). */
function raccoon(): string {
  let s = '';
  // Body (mostly behind the jamb), striped tail curling out.
  s += comic(smooth([[-16, 0], [-20, -30], [-14, -54], [4, -60], [18, -46], [20, -18], [16, 0]]), C.coon, { line: LINE.small, rim: [3, -1.4], glint: [-1, 1] });
  s += comic(smooth([[-14, -50], [-6, -58], [6, -58], [12, -48], [6, -40], [-8, -40]]), C.coonLight, { line: LINE.detail });
  // Head.
  const head = smooth([[-22, -72], [-18, -88], [-6, -96], [8, -95], [18, -86], [22, -72], [14, -62], [0, -58], [-14, -62]]);
  s += comic(smooth([[-20, -86], [-24, -102], [-11, -94]]), C.coon, { line: LINE.detail, over: fillP(smooth([[-20, -90], [-21, -98], [-14, -93]]), C.nose, 0.7) });
  s += comic(smooth([[18, -86], [22, -102], [9, -94]]), C.coon, { line: LINE.detail, over: fillP(smooth([[18, -90], [19, -98], [12, -93]]), C.nose, 0.7) });
  s += comic(head, C.coon, { line: LINE.small, rim: [2.4, -1.1], glint: [-0.8, 0.8] });
  // The mask, the white brows and muzzle.
  s += fillP(smooth([[-19, -76], [-12, -84], [-2, -78], [2, -78], [12, -84], [19, -76], [12, -70], [0, -74], [-12, -70]]), C.coonDark);
  s += fillP(smooth([[-14, -88], [-6, -91], [-2, -86], [-9, -85]]), C.coonLight) + fillP(smooth([[14, -88], [6, -91], [2, -86], [9, -85]]), C.coonLight);
  s += comic(smooth([[-9, -68], [0, -74], [9, -68], [6, -61], [-6, -61]]), C.coonLight, { line: LINE.detail });
  s += fillP(ellipsePath(0, -70, 2.6, 1.8), C.nose);
  // Eyes, shining in the mask.
  for (const x of [-9, 9]) s += fillP(circleP(x, -78, 2.6), '#2c2836') + fillP(circleP(x + 0.9, -79, 1), '#ffffff');
  s += ink('M-3 -65Q0 -63 3 -65', 0.8, darkOf(C.coonLight, 0.5));
  // A paw on the jamb's edge.
  s += comic(smooth([[-26, -52], [-30, -58], [-24, -63], [-18, -58], [-18, -50]]), C.coonDark, { line: LINE.detail, over: ink('M-26 -60l-1 3M-23 -61l0 3', 0.5, '#8f899c') });
  // The tail.
  s += comic(smooth([[14, -14], [26, -22], [34, -34], [32, -44], [26, -38], [20, -26], [10, -18]]), C.coon, {
    line: LINE.detail,
    rim: [1.6, -0.7],
    over: ink('M22 -21l6 4M28 -29l5 3M31 -37l4 2', 2.2, C.coonDark),
  });
  return s;
}

// ---------------------------------------------------------------- inside: through the trunk to the hill

const HOLE1 = archPts(90, 180, { rise: 45 });
const HOLE2 = archPts(86, 174, { rise: 43 });
const HOLE3 = deckle(archPts(84, 168, { rise: 42 }), 1.4, 31, 5).map(([x, y]) => [x, Math.min(0, y)] as Pt);

function in1(): string {
  // Rings, a little shelf with a jar of jam and a tiny book.
  let over = rings(HOLE1, 2, 6, 5, darkOf(C.in1, 0.18), 41);
  over += comic(rrect(36, -96, 26, 4, 1.5), C.batten, { line: LINE.detail });
  over += comic(rrect(40, -110, 8, 14, 2), '#f2b7c6', { line: LINE.detail, over: fillP(rrect(40, -112, 8, 4, 1), '#e8d6c0') });
  over += comic(rrect(50, -106, 5, 10, 1), '#a9c8ec', { line: LINE.detail });
  return page(HOLE1, -110, 110, -230, 16, C.in1, C.floorIn, { wallOver: over, rim: 4 });
}

function in2(): string {
  let over = rings(HOLE2, 2, 6, 5, darkOf(C.in2, 0.18), 42);
  // A root poking through, a glow-moth.
  over += barkRoot([[-60, -150], [-46, -140], [-40, -124]], 6, 2, C.bark, 43);
  return page(HOLE2, -130, 130, -232, 26, C.in2, darkOf(C.floorIn, 0.08), { wallOver: over, rim: 4 });
}

function in3(): string {
  // The far mouth: rough bark round it, moss on its lip.
  let over = rings(HOLE3, 2, 3, 6, darkOf(C.in3, 0.18), 44);
  over += comic(smooth([[-44, -6], [-30, -14], [-10, -10], [10, -14], [34, -12], [46, -4], [44, 4], [-44, 4]]), C.moss, { line: LINE.small });
  for (const [x, y] of [[-46, -120], [44, -150], [-30, -170]] as const) over += leaf([x, y], x < 0 ? Math.PI + 0.3 : -0.3, 12, C.leafy);
  return page(HOLE3, -150, 150, -236, 36, C.in3, darkOf(C.floorIn, 0.16), { wallOver: over, rim: 3 });
}

/** The hill beyond, under the night: sky, the moon, stone trees, grass. */
function beyond(): string {
  const rng = new Rng(hashSeed('door.tree.beyond'));
  let s = `<linearGradient id="tbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.sky}"/><stop offset="1" stop-color="${C.skyLow}"/></linearGradient>`;
  s += `<rect x="-170" y="-250" width="340" height="252" fill="url(#tbsky)"/>`;
  for (let i = 0; i < 18; i++) s += fillP(circleP(rng.range(-160, 160), rng.range(-240, -60), rng.range(0.6, 1.4)), '#f3f0ff', rng.range(0.5, 0.9));
  s += twinkle(-40, -190, 3, '#fff7d6', 0.5) + twinkle(30, -150, 2.4, '#fff7d6', 0.5);
  // The moon, its face asleep.
  s += glowDisc(26, -176, 40, '#d9f0f7', 0.35);
  s += comic(crescent(36, -176, 24, 1.3), C.moon, { line: LINE.small, rim: [2, -1], glint: [-0.8, 0.8], over: ink('M17 -178q3 3 6 0', 0.9, darkOf(C.moon, 0.5)) });
  // Far hills, the stone trees, the near grass.
  s += comic(smooth([[-180, -40], [-120, -78], [-40, -66], [40, -86], [120, -70], [180, -54], [180, 4], [-180, 4]]), C.hillFar, { line: LINE.small, rim: [3, -1.4] });
  for (const [x, y, r] of [[-70, -86, 26], [80, -102, 30]] as const) {
    s += comic(rrect(x - 4, y, 8, 50, 3), C.trunk, { line: LINE.detail });
    s += comic(smooth([[x - r, y + 4], [x - r * 0.9, y - r * 0.8], [x - r * 0.1, y - r * 1.1], [x + r * 0.9, y - r * 0.7], [x + r, y + 6], [x, y + r * 0.35]]), C.stoneTree, { line: LINE.small, rim: [3, -1.4], over: ink(`M${f(x - 10)} ${f(y - 8)}q6 5 12 0M${f(x - 4)} ${f(y - 18)}q6 5 12 0`, 0.8, darkOf(C.stoneTree, 0.3)) });
  }
  s += comic(smooth([[-180, -18], [-90, -34], [0, -26], [90, -38], [180, -22], [180, 92], [-180, 92]]), C.hill, { line: LINE.small, rim: [3, -1.4], hatch: 0 });
  for (let i = 0; i < 9; i++) s += tuft(rng.range(-150, 150), rng.range(-10, 40), rng.range(6, 10), C.grass, 70 + i);
  s += softStarDot(-120, -120) + softStarDot(140, -200);
  return s;
}

function softStarDot(x: number, y: number): string {
  return fillP(softStar(x, y, 3, 0.45), '#fff7d6', 0.9);
}

/** The old tree's door. */
export function treeDoor(): DoorArt {
  const parts = [
    doorPart('door.tree.trunk', { x0: TL - 54, y0: TOP - 4, x1: TR + 14, y1: 8 }, trunk()),
    doorPart('door.tree.crown', { x0: -270, y0: -830, x1: 190, y1: -560 }, crown()),
    doorPart('door.tree.jar', { x0: -12, y0: -2, x1: 12, y1: 60 }, jar()),
    doorPart('door.tree.jarGlow', { x0: -36, y0: -36, x1: 36, y1: 36 }, jarGlow()),
    doorPart('door.tree.coon', { x0: -32, y0: -106, x1: 38, y1: 4 }, raccoon()),
    leafPart('door.tree.door', W - 2, H - 1, doorFront()),
    leafPart('door.tree.door.back', W - 2, H - 1, doorBack()),
    doorPart('door.tree.in1', { x0: -110, y0: -230, x1: 110, y1: 16 }, in1()),
    doorPart('door.tree.in2', { x0: -130, y0: -232, x1: 130, y1: 26 }, in2()),
    doorPart('door.tree.in3', { x0: -150, y0: -236, x1: 150, y1: 36 }, in3()),
    doorPart('door.tree.beyond', { x0: -180, y0: -250, x1: 180, y1: 92 }, beyond()),
  ];
  return {
    parts,
    opening: OPEN,
    frame: [
      { key: 'door.tree.crown', x: 0, y: 0, dz: -6 },
      { key: 'door.tree.trunk', x: 0, y: 0, dz: 0 },
    ],
    front: [],
    inside: [
      { key: 'door.tree.beyond', x: 0, y: 0, dz: -150, order: 0 },
      { key: 'door.tree.in3', x: 0, y: 0, dz: -96, order: 2 },
      { key: 'door.tree.in2', x: 0, y: 0, dz: -54, order: 3 },
      { key: 'door.tree.in1', x: 0, y: 0, dz: -22, order: 4 },
    ],
    backdrop: 0x2b2a3c,
    pieces: [
      // The raccoon leans out from behind the right jamb as Gorti comes.
      { key: 'door.tree.coon', inside: true, x: 66, y: 0, dz: -30, order: 3.5, sway: { y: 1.2, ms: 2700 }, peek: { x: -30, angle: -8, y: -2 } },
      // The firefly jar on the stub, and its light.
      { key: 'door.tree.jarGlow', x: -141, y: -224, dz: 2, additive: true, shut: { alpha: 0.2, sx: 0.8, sy: 0.8 }, open: { alpha: 0.2, sx: 0.8, sy: 0.8 }, wake: { alpha: 0.35, sx: 1.3, sy: 1.3 }, wakeShut: true, sway: { x: 2, ms: 2300 } },
      { key: 'door.tree.jar', x: -141, y: -258, dz: 2, sway: { angle: 4, ms: 2300 }, wake: { angle: -3 } },
    ],
    leaves: [{ front: 'door.tree.door', back: 'door.tree.door.back', hinge: 'right', x: W / 2 - 1, y: -H + 1, dz: 1, shutAngle: 0, restAngle: 34, wideAngle: 108 }],
    light: { color: 0xfff0b0, radius: 320, intensity: 0.8, y: 70 },
    glow: { color: 0xc9d8ff, pool: 0xfff0c0 },
    sparks: { colors: [0xfff3a6, 0xe8ff9e, 0xfff8d0], frame: 'fx.dot', rate: 1.2, size: 0.3 },
    sounds: { wake: ['door', 0.22, 1.25], peek: ['chirp', 0.3, 0.75] },
  };
}

void bit;
void lightOf;
