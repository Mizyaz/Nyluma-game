import { P } from '../palette';
import { cel, ellipsePath, glow, limb, line, smooth, taper, type Pt } from '../svg';
import type { PartArt, RigDef, RigJoint } from '../rigTypes';

// Gorti Evaskinan: root body, the Sivaslı amca human form and the exhausted
// suited form. Every part is drawn in a local frame (joint at 0,0) and then
// translated into its part canvas.

const tr = (pts: readonly Pt[], ox: number, oy: number): Pt[] => pts.map(([x, y]) => [x + ox, y + oy]);
const tp = (p: Pt, ox: number, oy: number): Pt => [p[0] + ox, p[1] + oy];

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** Builds a part whose local frame spans `box`; `draw` receives the offset. */
function part(key: string, box: Box, draw: (ox: number, oy: number) => string, extra: Partial<PartArt> = {}): PartArt {
  const m = 5;
  const ox = -box.x0 + m;
  const oy = -box.y0 + m;
  return {
    key,
    w: Math.ceil(box.x1 - box.x0 + m * 2),
    h: Math.ceil(box.y1 - box.y0 + m * 2),
    px: ox,
    py: oy,
    body: draw(ox, oy),
    ...extra,
  };
}

// ---------------------------------------------------------------- root form

function rootHead(key: string, giant = false): PartArt {
  return part(key, { x0: -40, y0: -62, x1: 22, y1: 4 }, (ox, oy) => {
    const skull: Pt[] = [
      [-5, 1], [-8, -7], [-12, -15], [-12, -23], [-7, -29], [1, -31], [8, -29], [13, -24],
      [15, -19], [14, -14], [13, -9], [11, -5], [6, -2], [4, 1],
    ];
    const bark = { fill: P.bark, shade: P.barkDark, light: P.barkLight, sx: 1.6, sy: 1.6, hx: 1, hy: 1, stroke: 2.6 };
    const br = (pts: Pt[], w0: number, w1: number): string => cel(taper(tr(pts, ox, oy), w0, w1), bark);
    let s = '';
    // Branch hair continues the skull silhouette up and back.
    s += br([[-9, -18], [-18, -22], [-27, -24], [-33, -31], [-35, -39]], 6.5, 1.6);
    s += br([[-26, -24], [-31, -21], [-37, -22]], 2.6, 1.1);
    s += br([[-5, -26], [-12, -35], [-19, -43], [-21, -52], [-18, -59]], 7.5, 1.8);
    s += br([[-17, -42], [-25, -46], [-30, -45]], 2.8, 1.1);
    s += br([[-20, -51], [-26, -56]], 2, 1);
    s += br([[2, -29], [0, -38], [-4, -46], [-3, -54]], 5, 1.5);
    s += br([[-1, -43], [5, -48], [8, -55]], 2.4, 1);
    s += br([[7, -27], [11, -33], [12, -40]], 3.4, 1.2);
    const knots =
      line(ellipsePath(-4 + ox, -14 + oy, 2.4, 3.4), P.gortiBarkDark, 1.1) +
      line(ellipsePath(-7 + ox, -22 + oy, 1.6, 2.2), P.gortiBarkDark, 1) +
      line(smooth(tr([[-8, -9], [-6, -6], [-2, -5]], ox, oy), 1, false), P.gortiBarkDark, 0.9);
    const veins =
      line(smooth(tr([[9, -17], [8, -12], [5, -7], [3, -3]], ox, oy), 1, false), P.violet, 1.4) +
      line(smooth(tr([[6, -21], [1, -23], [-4, -26]], ox, oy), 1, false), P.violet, 1.2) +
      line(smooth(tr([[8, -15], [11, -11]], ox, oy), 1, false), P.violet, 1);
    // Luminous vein cluster in place of eyes.
    const ex = 9 + ox;
    const ey = -20 + oy;
    let eye = `<path d="${ellipsePath(ex, ey, 4.2, 3)}" fill="${P.violetDark}"/>`;
    const rays: Pt[] = [[5, -2], [5.5, 1.5], [3, 4], [-1, 4.5], [-4, 2], [-4.5, -1.5], [-1, -4.2], [3, -4]];
    for (const [dx, dy] of rays) eye += line(`M${ex} ${ey}L${ex + dx} ${ey + dy}`, P.vein, 1.1);
    eye += `<circle cx="${ex + 0.5}" cy="${ey}" r="1.8" fill="#f4e8ff"/>`;
    s += cel(smooth(tr(skull, ox, oy)), {
      fill: P.gortiBark,
      shade: P.gortiBarkDark,
      light: P.gortiBarkLight,
      sx: 3.5,
      sy: 2.5,
      hx: 1.6,
      hy: 1.6,
      stroke: 3,
      over: knots + veins + eye,
    });
    if (giant) {
      s += line(smooth(tr([[-10, -18], [-4, -16], [2, -10]], ox, oy), 1, false), P.vein, 1.2, 0.8);
    }
    return s;
  });
}

function rootTorso(key: string): PartArt {
  return part(key, { x0: -12, y0: -40, x1: 12, y1: 4 }, (ox, oy) => {
    const pts: Pt[] = [
      [-8, 2], [-9, -6], [-7, -15], [-9, -26], [-8, -33], [-3, -38], [3, -38], [9, -35], [10, -28],
      [7, -20], [5, -12], [7, -4], [8, 2],
    ];
    const veins =
      line(smooth(tr([[0, -36], [2, -28], [4, -20], [1, -12], [-3, -5]], ox, oy), 1, false), P.violet, 1.5) +
      line(smooth(tr([[3, -22], [6, -17], [6, -9]], ox, oy), 1, false), P.violet, 1.1) +
      line(smooth(tr([[2, -30], [-4, -27], [-6, -21]], ox, oy), 1, false), P.violet, 1.1) +
      line(smooth(tr([[0, -35], [2, -28], [4, -21]], ox, oy), 1, false), P.vein, 0.6, 0.8);
    const grain =
      line(`M${-5 + ox} ${-30 + oy}l1 6`, P.gortiBarkDark, 1) +
      line(`M${-6 + ox} ${-12 + oy}l2 5`, P.gortiBarkDark, 1) +
      line(`M${5 + ox} ${-2 + oy}l-1 -5`, P.gortiBarkDark, 1);
    return cel(smooth(tr(pts, ox, oy)), {
      fill: P.gortiBark,
      shade: P.gortiBarkDark,
      light: P.gortiBarkLight,
      sx: 4,
      sy: 1,
      hx: 1.5,
      hy: 1,
      stroke: 3.2,
      over: grain + veins,
    });
  });
}

function rootUpperArm(key: string): PartArt {
  return part(
    key,
    { x0: -6, y0: -5, x1: 6, y1: 24 },
    (ox, oy) =>
      cel(limb([ox, oy], [ox, 20 + oy], 8, 6, 0.5), {
        fill: P.gortiBark, shade: P.gortiBarkDark, light: P.gortiBarkLight, sx: 2.5, sy: 0, hx: 1, hy: 0, stroke: 2.8,
        over: line(`M${ox + 1} ${oy + 3}q1 8 -1 14`, P.violet, 1),
      }),
    { far: true },
  );
}

function rootForearm(key: string): PartArt {
  return part(
    key,
    { x0: -9, y0: -4, x1: 10, y1: 45 },
    (ox, oy) => {
      const o = (p: Pt): Pt => tp(p, ox, oy);
      const finger = (a: Pt, b: Pt, wa: number): string =>
        cel(limb(o(a), o(b), wa, 1.1), { fill: P.gortiBark, shade: P.gortiBarkDark, sx: 1, sy: 0, stroke: 2.2 });
      let s = '';
      s += finger([-1, 26], [-5, 40], 2.8);
      s += finger([1, 27], [4, 39], 2.8);
      s += finger([0, 27], [0, 43], 3);
      s += finger([2, 23], [7, 31], 2.5);
      s += cel(limb(o([0, 0]), o([0, 25]), 6, 5.5, 0.4), {
        fill: P.gortiBark, shade: P.gortiBarkDark, light: P.gortiBarkLight, sx: 2, sy: 0, hx: 1, hy: 0, stroke: 2.8,
        over: line(`M${ox} ${oy + 4}q-1.5 9 1 18`, P.violet, 1),
      });
      return s;
    },
    { far: true },
  );
}

function rootThigh(key: string): PartArt {
  return part(
    key,
    { x0: -7, y0: -5, x1: 7, y1: 27 },
    (ox, oy) =>
      cel(limb([ox, oy], [ox, 23 + oy], 10, 8, 0.6), {
        fill: P.gortiBark, shade: P.gortiBarkDark, light: P.gortiBarkLight, sx: 3, sy: 0, hx: 1, hy: 0, stroke: 3,
        over: line(`M${ox - 1} ${oy + 4}q2 7 0 15`, P.violet, 1),
      }),
    { far: true },
  );
}

function rootShin(key: string): PartArt {
  return part(
    key,
    { x0: -6, y0: -4, x1: 6, y1: 26 },
    (ox, oy) =>
      cel(limb([ox, oy], [ox, 23 + oy], 8, 6.5, 0.2), {
        fill: P.gortiBark, shade: P.gortiBarkDark, light: P.gortiBarkLight, sx: 2.5, sy: 0, hx: 1, hy: 0, stroke: 2.8,
        over: line(`M${ox - 3} ${oy + 8}l3 2`, P.gortiBarkDark, 1),
      }),
    { far: true },
  );
}

function rootFoot(key: string): PartArt {
  return part(
    key,
    { x0: -11, y0: -6, x1: 22, y1: 11 },
    (ox, oy) => {
      const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
      const foot: Pt[] = [[-4, -4], [-8, 1], [-7, 6], [4, 7], [14, 7], [20, 5], [16, 1], [7, -2], [2, -5]];
      let s = '';
      s += line(smooth(o([[10, 6], [14, 9], [17, 10]]), 1, false), P.gortiBarkDark, 1.6);
      s += line(smooth(o([[0, 6], [-1, 9], [-3, 10]]), 1, false), P.gortiBarkDark, 1.4);
      s += cel(smooth(o(foot)), {
        fill: P.gortiBark, shade: P.gortiBarkDark, light: P.gortiBarkLight, sx: 1, sy: 2.5, hx: 1, hy: 1, stroke: 2.8,
        over: line(smooth(o([[6, 3], [11, 4], [16, 4]]), 1, false), P.gortiBarkDark, 1),
      });
      return s;
    },
    { far: true },
  );
}

function watch(key: string): PartArt {
  return part(key, { x0: -6, y0: -5, x1: 6, y1: 5 }, (ox, oy) => {
    let s = `<rect x="${ox - 5.5}" y="${oy - 2}" width="11" height="4" rx="1.5" fill="#4a3528" stroke="${P.ink}" stroke-width="1.4"/>`;
    s += `<circle cx="${ox + 1}" cy="${oy}" r="3.4" fill="${P.ivory}" stroke="${P.ink}" stroke-width="1.5"/>`;
    s += `<circle cx="${ox + 1}" cy="${oy}" r="2.6" fill="none" stroke="#b9a36a" stroke-width="0.8"/>`;
    s += line(`M${ox + 1} ${oy}l0 -1.8M${ox + 1} ${oy}l1.3 0.6`, P.ink, 0.7);
    return s;
  });
}

function eyeGlow(key: string, color: string): PartArt {
  return part(key, { x0: -9, y0: -9, x1: 9, y1: 9 }, (ox, oy) => glow(ox, oy, 9, color, 0.45), {
    additive: true,
  });
}

// ---------------------------------------------------------------- human form

function humanHead(key: string, suit = false): PartArt {
  return part(key, { x0: -17, y0: -38, x1: 22, y1: 4 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const skull: Pt[] = [
      [-6, 1], [-10, -7], [-13, -17], [-12, -26], [-7, -32], [1, -35], [9, -33], [14, -28], [16, -22],
      [17, -18], [19, -14], [16, -12], [17, -8], [14, -5], [13, -2], [7, 0], [4, 2],
    ];
    const ear = cel(smooth(o([[-4, -20], [-1, -21], [0, -16], [-2, -12], [-5, -14]])), {
      fill: P.skin, shade: P.skinDark, sx: 1, sy: 1, stroke: 1.8,
      over: line(smooth(o([[-2.5, -18], [-1.5, -16], [-3, -14]]), 1, false), P.skinDark, 1),
    });
    const fringe = cel(smooth(o([[-12, -25], [-8, -26], [-5, -22], [-6, -14], [-9, -10], [-12, -15]])), {
      fill: '#9a969e', shade: '#77737e', sx: 1, sy: 1.5, stroke: 1.8,
    });
    const face =
      line(smooth(o([[5, -25], [9, -26], [13, -24]]), 1, false), '#8d8790', 2) + // brow
      `<path d="${smooth(o([[8, -21], [11, -22], [13.5, -20.5], [11, -19.2]]))}" fill="${P.ink}"/>` + // eye
      line(smooth(o([[7, -23], [10.5, -23.5], [14, -21.5]]), 1, false), P.skinDark, 1.4) + // heavy lid
      line(smooth(o([[10, -17], [8, -12]]), 1, false), P.skinDark, 1) + // cheek fold
      line(smooth(o([[12, -7], [15, -7.5]]), 1, false), '#7c5046', 1.2) + // mouth
      line(smooth(o([[2, -29], [0, -25], [-1, -21]]), 1, false), P.violet, 1, 0.75) + // faint temple vein
      line(smooth(o([[7, -30], [3, -32]]), 1, false), P.skinDark, 0.9, 0.7);
    let traces = '';
    if (suit) {
      traces =
        line(smooth(o([[13, -19], [12, -15], [13, -12]]), 1, false), P.violet, 1.2, 0.9) +
        line(smooth(o([[8, -19], [6, -15]]), 1, false), P.vein, 1, 0.8) +
        line(smooth(o([[7, -18.5], [12, -18]]), 1, false), P.skinDark, 1);
    }
    let s = ear;
    s += cel(smooth(o(skull)), {
      fill: P.skin, shade: P.skinDark, light: P.skinLight, sx: 3, sy: 2, hx: 1.5, hy: 1.5, stroke: 3,
      over: face + traces,
    });
    s += fringe;
    s += ear;
    return s;
  });
}

function humanTorso(key: string, suit = false): PartArt {
  return part(key, { x0: -14, y0: -43, x1: 19, y1: 5 }, (ox, oy) => {
    const o = (pts: Pt[]): Pt[] => tr(pts, ox, oy);
    const pts: Pt[] = [
      [-9, 3], [-11, -8], [-12, -20], [-11, -30], [-8, -37], [-2, -41], [5, -41], [10, -37], [13, -29], [16, -19],
      [17, -9], [13, 0], [9, 4],
    ];
    if (!suit) {
      const details =
        line(smooth(o([[5, -39], [7, -30], [10, -22], [13, -12], [12, -3]]), 1, false), P.shirtDark, 1.3) +
        `<circle cx="${ox + 8.5}" cy="${oy - 26}" r="1.1" fill="${P.ink}"/><circle cx="${ox + 11.5}" cy="${oy - 16}" r="1.1" fill="${P.ink}"/><circle cx="${ox + 13}" cy="${oy - 7}" r="1.1" fill="${P.ink}"/>` +
        line(smooth(o([[-2, -40], [3, -36], [7, -40]]), 1, false), P.shirtDark, 1.4) + // collar
        `<rect x="${ox - 12}" y="${oy - 3}" width="30" height="5" fill="#3b2c24"/>` + // belt
        line(smooth(o([[-6, -20], [-2, -16], [3, -18]]), 1, false), P.shirtDark, 1, 0.9) + // wrinkle
        line(smooth(o([[-3, -33], [-1, -28]]), 1, false), P.violet, 1, 0.55);
      return cel(smooth(o(pts)), {
        fill: P.shirt, shade: P.shirtDark, light: '#d3ceba', sx: 4, sy: 2, hx: 1.5, hy: 1, stroke: 3.2, over: details,
      });
    }
    // Wrinkled, loose jacket over a pale shirt.
    const shirt =
      cel(smooth(o([[3, -41], [8, -40], [10, -35], [9, -30], [6, -33]])), {
        fill: '#d8d2c2', shade: '#b3ad9c', sx: 1, sy: 1, stroke: 1.6,
      }) +
      cel(smooth(o([[7, -35], [9.5, -34], [12, -24], [13.5, -15], [11.5, -14], [9, -24]])), {
        fill: '#6d3c48', shade: '#4d2a33', sx: 1, sy: 1, stroke: 1.5,
      });
    const wrinkles =
      line(smooth(o([[-8, -22], [-4, -19], [0, -21]]), 1, false), P.suitDark, 1.2) +
      line(smooth(o([[-9, -12], [-5, -10], [-1, -12]]), 1, false), P.suitDark, 1.2) +
      line(smooth(o([[-6, -31], [-3, -28]]), 1, false), P.suitDark, 1.1) +
      line(smooth(o([[12, -14], [14, -9], [11, -4]]), 1, false), P.suitDark, 1.1) +
      line(smooth(o([[1, -40], [5, -28], [9, -16], [12, -4]]), 1, false), P.ink, 1.4) + // lapel edge
      `<rect x="${ox + 9}" y="${oy - 30}" width="4" height="2" fill="${P.suitLight}"/>`;
    return (
      cel(smooth(o(pts)), {
        fill: P.suit, shade: P.suitDark, light: P.suitLight, sx: 4, sy: 2, hx: 1.5, hy: 1, stroke: 3.2, over: wrinkles,
      }) + shirt
    );
  });
}

function humanUpperArm(key: string, suit = false): PartArt {
  return part(
    key,
    { x0: -7, y0: -5, x1: 7, y1: 24 },
    (ox, oy) =>
      cel(limb([ox, oy], [ox, 20 + oy], 11, 9, 0.6), {
        fill: suit ? P.suit : P.shirt,
        shade: suit ? P.suitDark : P.shirtDark,
        light: suit ? P.suitLight : '#d3ceba',
        sx: 3, sy: 0, hx: 1, hy: 0, stroke: 2.8,
        over: line(`M${ox - 2} ${oy + 10}q3 2 5 0`, suit ? P.suitDark : P.shirtDark, 1),
      }),
    { far: true },
  );
}

function humanForearm(key: string, suit = false): PartArt {
  return part(
    key,
    { x0: -8, y0: -4, x1: 9, y1: 36 },
    (ox, oy) => {
      const o = (p: Pt): Pt => tp(p, ox, oy);
      let s = '';
      // Hand
      s += cel(smooth(tr([[-3, 21], [3, 21], [5, 26], [4, 31], [1, 33], [-3, 31], [-4, 26]], ox, oy)), {
        fill: P.skin, shade: P.skinDark, sx: 1.5, sy: 1, stroke: 2.4,
        over: line(`M${ox + 3} ${oy + 25}l3 3`, P.skinDark, 1),
      });
      if (suit) {
        s += cel(limb(o([0, 0]), o([0, 21]), 9, 8, 0.3), {
          fill: P.suit, shade: P.suitDark, light: P.suitLight, sx: 2.5, sy: 0, hx: 1, hy: 0, stroke: 2.8,
          over: `<rect x="${ox - 5}" y="${oy + 17}" width="10" height="3" fill="#d8d2c2"/>`,
        });
      } else {
        // Rolled sleeve then bare forearm.
        s += cel(limb(o([0, 4]), o([0, 21]), 7, 6, 0.3), {
          fill: P.skin, shade: P.skinDark, light: P.skinLight, sx: 2, sy: 0, hx: 1, hy: 0, stroke: 2.6,
          over: line(`M${ox - 1} ${oy + 9}q2 5 0 9`, P.violet, 0.9, 0.5),
        });
        s += cel(smooth(tr([[-5, -1], [5, -1], [6, 5], [-6, 5]], ox, oy)), {
          fill: P.shirt, shade: P.shirtDark, sx: 1.5, sy: 1, stroke: 2.4,
        });
      }
      return s;
    },
    { far: true },
  );
}

function humanThigh(key: string, suit = false): PartArt {
  const c = suit ? { f: P.suit, s: P.suitDark, l: P.suitLight } : { f: P.trousers, s: P.trousersDark, l: '#8a6a55' };
  return part(
    key,
    { x0: -8, y0: -5, x1: 8, y1: 25 },
    (ox, oy) =>
      cel(limb([ox, oy], [ox, 21 + oy], 14, 11, 0.8), {
        fill: c.f, shade: c.s, light: c.l, sx: 3, sy: 0, hx: 1.2, hy: 0, stroke: 3,
        over: line(`M${ox + 2} ${oy + 5}q-3 7 1 13`, c.s, 1.1),
      }),
    { far: true },
  );
}

function humanShin(key: string, suit = false): PartArt {
  const c = suit ? { f: P.suit, s: P.suitDark, l: P.suitLight } : { f: P.trousers, s: P.trousersDark, l: '#8a6a55' };
  return part(
    key,
    { x0: -7, y0: -4, x1: 7, y1: 23 },
    (ox, oy) =>
      `<rect x="${ox - 4}" y="${oy + 14}" width="8" height="6" fill="#3e3a44"/>` +
      cel(limb([ox, oy], [ox, 16 + oy], 11, 10, 0.3), {
        fill: c.f, shade: c.s, light: c.l, sx: 2.5, sy: 0, hx: 1, hy: 0, stroke: 2.8,
      }) +
      line(`M${ox - 4} ${oy + 14}v6M${ox + 4} ${oy + 14}v6`, P.ink, 2),
    { far: true },
  );
}

function shoe(key: string): PartArt {
  return part(
    key,
    { x0: -8, y0: -5, x1: 16, y1: 8 },
    (ox, oy) =>
      cel(smooth(tr([[-5, -3], [-7, 2], [-6, 6], [8, 6], [14, 5], [15, 2], [11, -1], [4, -3]], ox, oy)), {
        fill: P.shoe, shade: '#221b1a', light: '#5a4a45', sx: 1, sy: 2, hx: 1, hy: 1, stroke: 2.6,
        over: line(`M${ox - 6} ${oy + 4.5}h21`, '#6b5a52', 1),
      }),
    { far: true },
  );
}

// ---------------------------------------------------------------- rigs

export interface HumanoidDims {
  hip: number;
  thigh: number;
  shin: number;
  torso: number;
  shoulderY: number;
  shoulderX: number;
  upper: number;
  hipX: number;
  headX: number;
  eye?: Pt;
}

export function humanoidRig(id: string, prefix: string, d: HumanoidDims, withWatch: boolean, glowKey?: string): RigDef {
  const j: RigJoint[] = [
    { id: 'root', parent: null, x: 0, y: 0, z: 0 },
    { id: 'hips', parent: 'root', x: 0, y: -d.hip, z: 0 },
    { id: 'torso', parent: 'hips', x: 0, y: 0, part: `${prefix}.torso`, z: 50 },
    { id: 'head', parent: 'torso', x: d.headX, y: -d.torso, part: `${prefix}.head`, z: 60 },
    { id: 'armR', parent: 'torso', x: d.shoulderX, y: -d.shoulderY, part: `${prefix}.arm`, side: 'R', z: 70 },
    { id: 'foreR', parent: 'armR', x: 0, y: d.upper, part: `${prefix}.fore`, side: 'R', z: 71 },
    { id: 'armL', parent: 'torso', x: -d.shoulderX * 0.4, y: -d.shoulderY - 1, part: `${prefix}.arm`, side: 'L', z: 70 },
    { id: 'foreL', parent: 'armL', x: 0, y: d.upper, part: `${prefix}.fore`, side: 'L', z: 71 },
    { id: 'legR', parent: 'hips', x: d.hipX, y: -1, part: `${prefix}.thigh`, side: 'R', z: 40 },
    { id: 'shinR', parent: 'legR', x: 0, y: d.thigh, part: `${prefix}.shin`, side: 'R', z: 41 },
    { id: 'footR', parent: 'shinR', x: 0, y: d.shin, part: `${prefix}.foot`, side: 'R', z: 42 },
    { id: 'legL', parent: 'hips', x: -d.hipX, y: -1, part: `${prefix}.thigh`, side: 'L', z: 40 },
    { id: 'shinL', parent: 'legL', x: 0, y: d.thigh, part: `${prefix}.shin`, side: 'L', z: 41 },
    { id: 'footL', parent: 'shinL', x: 0, y: d.shin, part: `${prefix}.foot`, side: 'L', z: 42 },
  ];
  if (withWatch) j.push({ id: 'watch', parent: 'shinL', x: 0, y: d.shin - 4, part: 'gorti.watch', side: 'L', z: 43 });
  if (glowKey && d.eye) j.push({ id: 'eyeGlow', parent: 'head', x: d.eye[0], y: d.eye[1], part: glowKey, z: 65, additive: true });
  return {
    id,
    joints: j,
    attach: {
      handR: { joint: 'foreR', x: 0, y: 30 },
      handL: { joint: 'foreL', x: 0, y: 30 },
      chest: { joint: 'torso', x: 2, y: -24 },
      eye: { joint: 'head', x: d.eye?.[0] ?? 8, y: d.eye?.[1] ?? -20 },
      ankleL: { joint: 'shinL', x: 0, y: d.shin - 4 },
    },
    animations: [
      'idle', 'walk', 'run', 'rise', 'fall', 'land', 'interact', 'reach', 'song', 'breath', 'transform', 'hurt',
      'collapse', 'push', 'sit', 'kneel', 'shout',
    ],
  };
}

export const GORTI_ROOT_DIMS: HumanoidDims = {
  hip: 48, thigh: 23, shin: 23, torso: 37, shoulderY: 33, shoulderX: 3, upper: 20, hipX: 3, headX: 1, eye: [9, -20],
};
export const GORTI_HUMAN_DIMS: HumanoidDims = {
  hip: 43, thigh: 21, shin: 18, torso: 40, shoulderY: 36, shoulderX: 2, upper: 20, hipX: 4, headX: 2, eye: [11, -21],
};

export function gortiParts(): PartArt[] {
  return [
    rootHead('gorti.root.head'),
    rootTorso('gorti.root.torso'),
    rootUpperArm('gorti.root.arm'),
    rootForearm('gorti.root.fore'),
    rootThigh('gorti.root.thigh'),
    rootShin('gorti.root.shin'),
    rootFoot('gorti.root.foot'),
    watch('gorti.watch'),
    eyeGlow('gorti.eyeglow', P.vein),
    humanHead('gorti.human.head'),
    humanTorso('gorti.human.torso'),
    humanUpperArm('gorti.human.arm'),
    humanForearm('gorti.human.fore'),
    humanThigh('gorti.human.thigh'),
    humanShin('gorti.human.shin'),
    shoe('gorti.human.foot'),
    humanHead('gorti.suit.head', true),
    humanTorso('gorti.suit.torso', true),
    humanUpperArm('gorti.suit.arm', true),
    humanForearm('gorti.suit.fore', true),
    humanThigh('gorti.suit.thigh', true),
    humanShin('gorti.suit.shin', true),
    eyeGlow('gorti.humanglow', P.violet),
  ];
}

export const RIG_GORTI_ROOT = humanoidRig('gorti.root', 'gorti.root', GORTI_ROOT_DIMS, true, 'gorti.eyeglow');
export const RIG_GORTI_HUMAN = humanoidRig('gorti.human', 'gorti.human', GORTI_HUMAN_DIMS, true);
export const RIG_GORTI_SUIT = (() => {
  const r = humanoidRig('gorti.suit', 'gorti.suit', GORTI_HUMAN_DIMS, true);
  for (const jt of r.joints) if (jt.part === 'gorti.suit.foot') jt.part = 'gorti.human.foot';
  return r;
})();
