import type { PartArt } from '../../render/2d/rig/rigTypes';
import { ellipsePath, poly, smooth, type Pt } from '../../render/2d/svg';
import { INK, clipped, flat, inked, line, n } from './p1Ink';

// The eye-leaf. In the first painting the big Gorti holds it out at his side:
// a lilac leaf cracked into seven plates whose cracks all run to an eye at
// its heart, under a heavy purple lid, with a red iris. Here it lies on the
// 14th Room's floor, turned a little to rest on its lower edge.
//
// Drawn by hand in the painting's own measure (the leaf about 265 across),
// then shrunk to sit beside the room's other things as it does in the
// painting (a little wider than the gift).

/** The leaf's colours (chosen by eye). */
const LEAF = {
  upperLeft: '#b994bd',
  top: '#c6a0c8',
  upperRight: '#c39bc6',
  right: '#caa3cd',
  lowerRight: '#d4add6',
  bottom: '#d0a9d3',
  lowerLeft: '#d8b3da',
  plateShade: '#7f5a88',
  stem: '#e9c8df',
  stemCut: '#dcb3d0',
  lid: '#9a6aa3',
  socket: '#74487f',
  white: '#f4e4ef',
  iris: '#d64a83',
  pupil: '#3b1734',
  shadow: '#4a3550',
} as const;

/** How much smaller than the painting's measure it is drawn. */
const SIZE = 0.66;
/** How far it is turned (degrees, anticlockwise) to rest on its lower edge, and about where. */
const TURN = -8;
const PIVOT: Pt = [150, 175];
/** The ink: the outline, the cracks, the eyelid. */
const W = { outline: 5, crack: 4.2, lid: 5.4 };

// The outer edge, clockwise from the pale base, in runs between the ends of
// the cracks. Where a crack meets the edge the edge dips in, so each plate
// bulges a little on its own.
const UL_OUT: Pt[] = [[44, 90], [50, 85], [54, 80], [57, 76], [62, 73], [66, 70], [69, 63], [70, 56], [72, 51], [77, 48], [83.8, 48.9]];
const TOP_OUT: Pt[] = [[83.8, 48.9], [82, 42], [84, 35], [88, 32], [91, 27], [95, 22], [101, 17], [110, 13], [121, 11], [133, 11], [141, 14], [147, 19], [151, 26], [153, 33], [152, 39.9]];
const UR_OUT: Pt[] = [[152, 39.9], [156, 36], [163, 34], [172, 35], [180, 40], [185, 47], [188, 54], [186.9, 60.5]];
const R_OUT: Pt[] = [[186.9, 60.5], [193, 62], [200, 67], [207, 74], [215, 82], [223, 90], [231, 98], [239, 106], [246, 113], [251, 119], [252.1, 124.3]];
const LR_OUT: Pt[] = [[252.1, 124.3], [258, 128], [264, 133], [267, 139], [264, 145], [257, 149], [250, 153], [245, 159], [240, 166], [234, 173], [226, 178], [215, 181], [204, 181], [195, 179], [190.6, 174.8]];
const BM_OUT: Pt[] = [[190.6, 174.8], [184, 176], [172, 174], [158, 172], [144, 171], [132, 170], [125.6, 164.1]];
const BL_OUT: Pt[] = [[125.6, 164.1], [118, 170], [106, 172], [93, 172], [82, 169], [72, 164], [64, 158], [58, 151], [53, 144], [50, 136], [50.8, 126.9]];
const LOBE_OUT: Pt[] = [[50.8, 126.9], [44, 124], [34, 121], [24, 116], [15, 109], [11, 102], [13, 97], [26, 97], [38, 96], [44, 90]];

// The cracks, each from the edge (or a crack) in to the eye.
const C_TOP_LEFT: Pt[] = [[83.8, 48.9], [89, 53], [95, 58], [100, 65], [104, 73], [108, 81], [112, 88]];
const C_TOP_RIGHT: Pt[] = [[152, 39.9], [150, 46], [152, 53], [150, 62], [151, 72], [150, 82], [152, 90]];
const C_UPPER_RIGHT: Pt[] = [[186.9, 60.5], [183, 65], [178, 71], [173, 77], [169, 84], [167, 91], [165, 98], [164, 103]];
/** The long wavy one, from the eye's far corner out to the tip's edge. */
const C_RIGHT: Pt[] = [[164, 103], [169, 109], [175, 112], [181, 108], [188, 111], [194, 118], [201, 115], [207, 121], [214, 118], [221, 123], [228, 120], [235, 126], [242, 124], [248, 129], [252.1, 124.3]];
const C_LOWER_RIGHT: Pt[] = [[152, 118], [156, 128], [160, 137], [166, 147], [172, 156], [180, 165], [186, 171], [190.6, 174.8]];
const C_BOTTOM: Pt[] = [[118, 118], [120, 128], [118, 138], [121, 148], [124, 157], [125.6, 164.1]];
const C_LEFT: Pt[] = [[110, 113], [100, 117], [90, 118], [78, 120], [66, 123], [57, 125], [50.8, 126.9]];

/** The hollow the cracks meet in, holding the eye: clockwise from the top-left crack. */
const SOCKET: Pt[] = [[112, 88], [133, 82], [152, 90], [164, 103], [152, 118], [135, 119], [118, 118], [110, 113], [105, 101]];

const rev = (p: readonly Pt[]): Pt[] => [...p].reverse();

/** Runs joined end to end into one closed outline (shared ends kept once). */
function chain(...runs: readonly (readonly Pt[])[]): Pt[] {
  const out: Pt[] = [];
  for (const run of runs) {
    for (const p of run) {
      const last = out[out.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
    }
  }
  const [a, b] = [out[0], out[out.length - 1]];
  if (out.length > 1 && a[0] === b[0] && a[1] === b[1]) out.pop();
  return out;
}

const OUTLINE = chain(UL_OUT, TOP_OUT, UR_OUT, R_OUT, LR_OUT, BM_OUT, BL_OUT, LOBE_OUT);

/** The seven plates, each with its colour. */
const PLATES: readonly [Pt[], string][] = [
  [chain(UL_OUT, C_TOP_LEFT, [[112, 88], [105, 101], [110, 113]], C_LEFT, LOBE_OUT), LEAF.upperLeft],
  [chain(TOP_OUT, C_TOP_RIGHT, [[152, 90], [133, 82], [112, 88]], rev(C_TOP_LEFT)), LEAF.top],
  [chain(UR_OUT, C_UPPER_RIGHT, [[164, 103], [152, 90]], rev(C_TOP_RIGHT)), LEAF.upperRight],
  [chain(R_OUT, rev(C_RIGHT), rev(C_UPPER_RIGHT)), LEAF.right],
  [chain(C_RIGHT, LR_OUT, rev(C_LOWER_RIGHT), [[152, 118], [164, 103]]), LEAF.lowerRight],
  [chain(C_LOWER_RIGHT, BM_OUT, rev(C_BOTTOM), [[118, 118], [135, 119], [152, 118]]), LEAF.bottom],
  [chain(C_BOTTOM, BL_OUT, rev(C_LEFT), [[110, 113], [118, 118]]), LEAF.lowerLeft],
];

/** The pale band at its base, where it was cut from its stem. */
const BASE: Pt[] = [[10, 89], [24, 86], [38, 86], [47, 89], [46, 96], [31, 98], [17, 99], [10, 97]];

/** The eye: its lid, the shadow under its far corner, the white, the iris. */
function eye(): string {
  let s = '';
  s += inked(smooth(SOCKET, 0.8), LEAF.lid, W.crack);
  s += flat(smooth([[136, 113], [150, 109], [162, 104], [160, 111], [152, 117], [138, 118]], 0.9), LEAF.socket);
  const white = 'M104 105C114 93 148 89 166 101C152 112 122 118 104 105Z';
  s += flat(white, LEAF.white);
  s += clipped(
    white,
    // The far half of the eye in the lid's shade.
    flat(ellipsePath(154, 107, 15, 8), LEAF.socket, 0.8) +
      flat(ellipsePath(126, 104.5, 6.8, 6.8), LEAF.iris) +
      line(ellipsePath(126, 104.5, 6.8, 6.8), 1.5, INK) +
      flat(ellipsePath(126, 104.5, 3, 3), LEAF.pupil) +
      flat(ellipsePath(124.3, 102.4, 1.3, 1.3), '#ffffff', 0.9) +
      line('M106 102C118 94 148 91 164 100', 3.2, LEAF.socket, 0.35),
  );
  s += line('M104 105C122 118 152 112 166 101', 2.6);
  s += line('M101 105C112 91 150 86 169 101', W.lid);
  return s;
}

function leaf(): string {
  let s = '';
  const edge = smooth(OUTLINE, 0.6);
  let plates = '';
  for (const [pts, color] of PLATES) {
    const d = poly(pts);
    // Each plate a little darker at its rims, so the plates read as slabs.
    plates += flat(d, color) + clipped(d, line(d, 9, LEAF.plateShade, 0.2));
  }
  // A glint along the upper plates, where the light falls.
  plates += line(smooth([[96, 30], [110, 22], [128, 19], [142, 23]], 1, false), 2.2, '#ffffff', 0.35);
  plates += line(smooth([[196, 74], [214, 90], [232, 106]], 1, false), 2, '#ffffff', 0.3);
  s += flat(edge, LEAF.upperLeft) + clipped(edge, plates);
  for (const crack of [C_TOP_LEFT, C_TOP_RIGHT, C_UPPER_RIGHT, C_RIGHT, C_LOWER_RIGHT, C_BOTTOM, C_LEFT]) {
    s += line(smooth(crack, 0.9, false), W.crack);
  }
  s += eye();
  s += line(edge, W.outline);
  s += inked(smooth(BASE, 0.8), LEAF.stem, W.crack);
  s += inked(ellipsePath(10.5, 93, 2.2, 4.2), LEAF.stemCut, 2);
  return s;
}

/** A point as the turn moves it. */
function turned([x, y]: Pt): Pt {
  const a = (TURN * Math.PI) / 180;
  const [dx, dy] = [x - PIVOT[0], y - PIVOT[1]];
  return [PIVOT[0] + dx * Math.cos(a) - dy * Math.sin(a), PIVOT[1] + dx * Math.sin(a) + dy * Math.cos(a)];
}

/** The eye-leaf, lying on the floor: its pivot is the middle of where it rests. */
export function eyeLeaf(): PartArt {
  const pts = [...OUTLINE, ...BASE].map(turned);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const pad = 6;
  const [x0, y0] = [Math.min(...xs) - pad, Math.min(...ys) - pad];
  const [x1, floor] = [Math.max(...xs) + pad, Math.max(...ys)];
  // Its shadow on the boards, under where it rests.
  const shadow = flat(ellipsePath((x0 + x1) / 2 + 10, floor - 3, (x1 - x0) * 0.4, 7), LEAF.shadow, 0.16);
  const body = `<g transform="scale(${SIZE}) translate(${n(-x0)} ${n(-y0)})">${shadow}<g transform="rotate(${TURN} ${PIVOT[0]} ${PIVOT[1]})">${leaf()}</g></g>`;
  const w = Math.ceil((x1 - x0) * SIZE);
  const h = Math.ceil((floor - y0 + 4) * SIZE);
  return { key: 'p1.eyeleaf', w, h, px: Math.round(w / 2), py: Math.round((floor - y0) * SIZE), body, scale: 1 };
}
