import { Lens, type Framing } from './lens';
import { RISE, riseAt } from './popUp';

// The scene changes of the paper theatre (WarpScene draws them with
// theatre.ts): when, and where, every sheet of stagecraft is. Kept free of
// Phaser so the timeline and the layout can be tested.
//
// Between rooms two painted flats roll in from the wings close to the eye
// and meet; behind them the room is changed; they roll back out and the next
// room's cards stand up. Between chapters a drop curtain comes down, the
// chapter's title card comes down in front of it on two threads and its
// little picture stands up on a ledge; the card goes up, the curtain rises,
// and the chapter's first room stands up. Less motion: the flats and the
// curtain only fade in where they stand, and out again; nothing rolls,
// drops, sways or stands up.
//
// Everything is a sheet facing the viewer at a real depth in front of the
// box (the box's front is at 170, the eye at FRAMING.dist): drawn by the
// lens like every card of the room, nothing is laid flat over the screen.

/** Depths of the stagecraft (world px; the actors walk at 0). */
export const STAGE_DEPTH = {
  curtain: 300,
  /** The left flat, and the right one a little nearer (it laps over the left one where they meet). */
  flatL: 330,
  flatR: 338,
  card: 400,
  /** The picture stands on the card's ledge, this far in front of it. */
  picture: 432,
} as const;

/** Timings (s). */
export const STAGE_TIMES = {
  /** The flats roll in from the wings and meet. */
  close: 0.42,
  /** They stay shut at least this long. */
  shut: 0.1,
  /** They roll back into the wings. */
  open: 0.62,
  /** From the flats' (or the curtain's) going until the room's cards begin to stand up. */
  riseAfter: 0.08,
  /** The curtain comes down (and settles). */
  drop: 0.55,
  /** The title card comes down on its threads after the curtain lands, and the picture stands up a little later. */
  cardAfter: 0.05,
  pictureAfter: 0.32,
  /** The chapter is shown at least this long (from the start). */
  chapterHold: 2.15,
  /** The card goes up and the curtain rises. */
  raise: 0.86,
  /** The room's cards begin to stand up this long after the curtain starts to rise. */
  raiseRise: 0.26,
  /** Less motion: the fades, and how long the chapter stays. */
  fadeOut: 0.26,
  fadeIn: 0.3,
  reducedHold: 1.5,
  /** Whatever happens, it is over by then. */
  limit: 8,
} as const;
const T = STAGE_TIMES;

export type ChangeKind = 'room' | 'chapter';

/** One scene change: what it is, and when the stage opens again (Infinity until the room is ready). */
export interface Plan {
  kind: ChangeKind;
  reduced: boolean;
  open: number;
}

/** When the old room is out of sight and may be swapped (s from the start). */
export function peakAt(kind: ChangeKind, reduced: boolean): number {
  if (reduced) return T.fadeOut;
  return kind === 'room' ? T.close : T.drop;
}

/** The earliest the stage may open again (s from the start); it also waits for the room. */
export function earliestOpen(kind: ChangeKind, reduced: boolean): number {
  if (kind === 'chapter') return reduced ? T.reducedHold : T.chapterHold;
  return peakAt(kind, reduced) + (reduced ? 0 : T.shut);
}

/** How long after the stage begins to open the room is played (s). */
export function openLength(kind: ChangeKind, reduced: boolean): number {
  if (reduced) return T.fadeIn;
  // The nearest cards have nearly settled by then (popUp.ts).
  const settled = RISE.spread + RISE.dur * 0.62;
  return kind === 'room' ? Math.max(T.open, T.riseAfter + settled) : Math.max(T.raise, T.raiseRise + settled);
}

/** When the room's cards begin to stand up, after the stage opens at `open` (s). */
export function riseAtTime(kind: ChangeKind, reduced: boolean, open: number): number {
  if (reduced) return open;
  return open + (kind === 'room' ? T.riseAfter : T.raiseRise);
}

/** Where everything is at time t. */
export interface Pose {
  /** How far the flats have rolled in (0: in the wings, 1: meeting; a little more as they bump), and how much they show. */
  flats: number;
  flatsAlpha: number;
  /** How far the curtain has come down (0: up in the flies, 1: down), and how much it shows. */
  curtain: number;
  curtainAlpha: number;
  /** The title card: how far down on its threads (0: up out of sight, 1: hanging), its sway (world px), how much it shows. */
  card: number;
  sway: number;
  cardAlpha: number;
  /** The picture: how far it has stood up on its ledge (0..1, a little past 1 as it springs up). */
  picture: number;
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const easeInOut = (u: number): number => {
  const x = clamp01(u);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const easeIn = (u: number): number => {
  const x = clamp01(u);
  return x * x;
};

/** The flats' roll: slow off the mark, quick across, a soft bump as they meet, settling. */
export function flatsIn(u: number): number {
  if (u <= 0) return 0;
  if (u < 1) return easeInOut(u);
  // The bump, after they meet (u from 1): they lap a little further, and settle.
  const v = (u - 1) * (T.close / 0.16);
  return v >= 1 ? 1 : 1 + 0.02 * Math.sin(Math.PI * v) * (1 - v);
}

/** The curtain's fall: it drops, lands, hops up a little on its hem and settles. */
export function curtainDown(u: number): number {
  if (u <= 0) return 0;
  const land = 0.78;
  if (u < land) return easeIn(u / land);
  const v = clamp01((u - land) / (1 - land));
  return 1 - 0.035 * Math.sin(Math.PI * v) * (1 - v * 0.4);
}

export function pose(plan: Plan, t: number): Pose {
  const p: Pose = { flats: 0, flatsAlpha: 1, curtain: 0, curtainAlpha: 1, card: 0, sway: 0, cardAlpha: 1, picture: 0 };
  const o = plan.open;
  if (plan.reduced) {
    // Nothing moves: it fades in where it stands, and out again.
    const a = Math.min(clamp01(t / T.fadeOut), 1 - clamp01((t - o) / T.fadeIn));
    if (plan.kind === 'room') {
      p.flats = 1;
      p.flatsAlpha = a;
    } else {
      p.curtain = 1;
      p.curtainAlpha = a;
      p.card = 1;
      p.picture = 1;
      p.cardAlpha = a;
    }
    return p;
  }
  if (plan.kind === 'room') {
    p.flats = t < o ? flatsIn(t / T.close) : 1 - easeInOut((t - o) / T.open);
    return p;
  }
  p.curtain = t < o ? curtainDown(t / T.drop) : 1 - easeInOut((t - o - 0.1) / (T.raise - 0.1));
  // The card comes down on its threads with a spring, swings a little and then only breathes.
  const c0 = T.drop + T.cardAfter;
  const v = (t - c0) / 0.7;
  const down = v <= 0 ? 0 : riseAt(Math.min(1, v));
  const up = t < o ? 0 : easeIn((t - o - 0.02) / 0.4);
  p.card = Math.max(0, down - up);
  if (v > 0) p.sway = 7 * Math.exp(-2.2 * v) * Math.sin(v * 6.5) + 1.2 * Math.sin((t - c0) * 1.9);
  // The picture stands up on its ledge, and lies down again before the card goes.
  const w = (t - c0 - T.pictureAfter) / RISE.dur;
  const fold = t < o ? 1 : 1 - easeIn((t - o) / 0.2);
  p.picture = (w <= 0 ? 0 : riseAt(Math.min(1, w))) * fold;
  return p;
}

/** The theatre's eye: the stage's own framing for a picture W × H device px, the eye over x = 0, the floor at y = 0. */
export function theatreLens(W: number, H: number, framing: Framing, actorScale: number): Lens {
  const lens = new Lens();
  const span = Math.max(300, H / actorScale);
  lens.frame(W, H, { ...framing, span }, 0, 1);
  lens.eye.x = 0;
  return lens;
}

/** What the eye sees at depth z (world px): x0..x1, y0..y1. */
export function viewAt(lens: Lens, z: number): { x0: number; x1: number; y0: number; y1: number } {
  const a = lens.unproject(0, 0, z);
  const b = lens.unproject(lens.w, lens.h, z);
  return { x0: a.x, x1: b.x, y0: a.y, y1: b.y };
}

/** The depth of the left (-1) or the right (1) flat. */
export const flatDepth = (side: -1 | 1): number => (side < 0 ? STAGE_DEPTH.flatL : STAGE_DEPTH.flatR);

/** Where a flat stands at its depth (world px). */
export interface FlatPlace {
  /** Its border's inner side: the body ends here, and its scalloped edge reaches on toward the middle. */
  xe: number;
  /** Its body. */
  x0: number;
  x1: number;
  /** Its top and its foot. */
  y0: number;
  y1: number;
}

/**
 * Where the left (-1) or right (1) flat stands, rolled in by `roll`
 * (Pose.flats): out in the wings at 0, its border `edgeW` wide clear of the
 * picture; at 1 the two meet at the screen x `meetPx` (kept off the
 * picture's sides; null: the middle), each border lapping 10 px past it.
 */
export function flatPlace(lens: Lens, side: -1 | 1, roll: number, meetPx: number | null, edgeW: number): FlatPlace {
  const z = flatDepth(side);
  const v = viewAt(lens, z);
  const mx = meetPx === null ? lens.w / 2 : Math.max(lens.w * 0.3, Math.min(lens.w * 0.7, meetPx));
  const meet = lens.unproject(mx, 0, z).x;
  const tongue = edgeW - 6;
  const open = side < 0 ? v.x0 - tongue - 40 : v.x1 + tongue + 40;
  const shut = side < 0 ? meet - 10 : meet + 10;
  const xe = open + (shut - open) * roll;
  const bodyW = v.x1 - v.x0 + 80;
  return { xe, x0: side < 0 ? xe - bodyW : xe, x1: side < 0 ? xe : xe + bodyW, y0: v.y0 - 40, y1: v.y1 + 40 };
}

/**
 * Where the drop curtain's hem ends (world y at its depth), down by `drop`
 * (Pose.curtain): up out of sight at 0; at 1 low enough that the hem's
 * solid braid (`hemBand` of its `hemH`) reaches past the picture's foot.
 */
export function curtainFoot(lens: Lens, drop: number, hemH: number, hemBand: number): number {
  const v = viewAt(lens, STAGE_DEPTH.curtain);
  const up = v.y0 - 20;
  const down = v.y1 + (hemH - hemBand) + 8;
  return up + (down - up) * drop;
}

/** A rectangle (world px at its depth, or device px on the screen). */
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where the title card, its words, its ledge and its picture go (device px), for a picture W × H. */
export interface CardLayout {
  card: Rect;
  /** "BÖLÜM", the numeral, the title (its font size, device px) and the rule under it. */
  tag: Rect;
  numeral: Rect;
  title: Rect;
  titleSize: number;
  rule: Rect;
  /** The picture standing on the ledge, as it shows when standing (device px; it stands nearer than the card). */
  picture: Rect;
  /** The threads' eyelets on the card (device px). */
  eyelets: [number, number][];
}

/** The picture's measure (chapterArt.PICTURE). */
const PIC = { w: 320, h: 240 };

export function cardLayout(W: number, H: number): CardLayout {
  // The card fills most of the picture, under its threads; the words on its
  // left, the picture standing on its ledge on the right.
  const cw = Math.min(W * 0.86, H * 1.62);
  const ch = Math.min(H * 0.7, cw * 0.56);
  const card: Rect = { x: (W - cw) / 2, y: H * 0.13, w: cw, h: ch };
  const pad = ch * 0.08;
  const colW = cw * 0.54;
  const left = card.x + pad * 1.3;
  const tag: Rect = { x: left, y: card.y + pad * 1.05, w: colW * 0.5, h: ch * 0.095 };
  const numeral: Rect = { x: left, y: tag.y + tag.h + ch * 0.03, w: colW - pad * 1.6, h: ch * 0.36 };
  const title: Rect = { x: left, y: numeral.y + numeral.h + ch * 0.03, w: colW - pad, h: ch * 0.27 };
  const rule: Rect = { x: left, y: card.y + ch - pad * 1.25, w: title.w * 0.8, h: ch * 0.05 };
  const pw = Math.min(cw - colW - pad * 1.6, (ch - pad * 2.2) * (PIC.w / PIC.h));
  const ph = pw * (PIC.h / PIC.w);
  const picture: Rect = { x: card.x + colW + (cw - colW - pw) / 2 - pad * 0.2, y: card.y + ch - pad * 1.1 - ph, w: pw, h: ph };
  const eyelets: [number, number][] = [
    [card.x + cw * 0.14, card.y + ch * 0.06],
    [card.x + cw * 0.86, card.y + ch * 0.06],
  ];
  return { card, tag, numeral, title, titleSize: ch * 0.2, rule, picture, eyelets };
}

/** The words split into `n` lines with the narrowest widest line: each line's [start, end) and that width. */
export function bestSplit(widths: readonly number[], space: number, n: number): { cuts: [number, number][]; width: number } {
  const count = widths.length;
  const lineW = (a: number, b: number): number => {
    let s = 0;
    for (let i = a; i < b; i++) s += widths[i]! + (i > a ? space : 0);
    return s;
  };
  let best: { cuts: [number, number][]; width: number } = { cuts: [[0, count]], width: lineW(0, count) };
  const go = (start: number, left: number, cuts: [number, number][]): void => {
    if (left === 1) {
      const all: [number, number][] = [...cuts, [start, count]];
      const wMax = Math.max(...all.map(([a, b]) => lineW(a, b)));
      if (wMax < best.width) best = { cuts: all, width: wMax };
      return;
    }
    for (let c = start + 1; c <= count - (left - 1); c++) go(c, left - 1, [...cuts, [start, c]]);
  };
  if (n > 1 && count > 1) go(0, Math.min(n, count), []);
  return best;
}
