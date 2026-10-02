import { TOUCH } from '../tuning';

// Where the on-screen controls go, worked out from the screen alone (no DOM),
// so it can be checked at any size in a unit test. All in CSS px, from the
// top left of the viewport. The numbers it reads are in src/tuning.ts (TOUCH).

export type Hand = 'right' | 'left';
export type ChipKey = 'form' | 'song' | 'focus';
export const CHIPS: readonly ChipKey[] = ['form', 'song', 'focus'];

export interface TouchScreen {
  /** The viewport. */
  w: number;
  h: number;
  /** Held upright: the game view is a band at the top and the controls go below it. */
  portrait: boolean;
  /** Upright: where the game view ends (the subtitles come right under it). */
  viewBottom: number;
  /** Sideways: the subtitle column at the bottom middle, kept clear. */
  column?: { left: number; right: number };
  /** The safe-area insets (notches, rounded corners, the home bar). */
  safe: { l: number; r: number; t: number; b: number };
}

/** A round control: its middle and diameter. */
export interface Disc {
  x: number;
  y: number;
  d: number;
}

export interface TouchLayout {
  /** The scale the sizes in TOUCH were drawn at (1 on a phone 390 px wide, held upright). */
  k: number;
  /** The walking dial; `reach` is the radius of its touch area (a little beyond the dial). */
  stick: Disc & { reach: number };
  jump: Disc;
  action: Disc;
  chips: Record<ChipKey, Disc>;
  /** The top of the area the controls keep below. */
  top: number;
  /** False when even the smallest allowed size could not keep everything in bounds. */
  fits: boolean;
}

const clamp = (v: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, v));

/** The layout at scale k, for a right hand (the dial on the left), before any mirroring. */
function place(s: TouchScreen, k: number, hand: Hand): Omit<TouchLayout, 'fits' | 'top'> {
  const R = (TOUCH.stick.size * k) / 2;
  const J = TOUCH.jump * k;
  const A = TOUCH.action * k;
  const C = TOUCH.chip * k;
  const gap = TOUCH.gap * k;
  // The dial's side and the buttons' side, each with its own inset.
  const near = hand === 'right' ? s.safe.l : s.safe.r;
  const far = hand === 'right' ? s.safe.r : s.safe.l;
  const floor = s.h - s.safe.b - TOUCH.bottom;
  const stick = { x: near + TOUCH.side + R, y: floor - R, d: 2 * R, reach: R * (1 + TOUCH.stick.slop) };
  const jump = { x: s.w - far - TOUCH.side - J / 2, y: floor - J / 2, d: J };
  const arc = s.portrait ? TOUCH.arc.upright : TOUCH.arc.sideways;
  // Ring 1 hugs Zıpla; ring 2 lies outside the action button's ring.
  const at = ([ring, deg]: readonly [1 | 2, number], d: number): Disc => {
    const r = J / 2 + gap + (ring === 2 ? A + gap : 0) + d / 2;
    const a = (deg * Math.PI) / 180;
    return { x: jump.x - Math.cos(a) * r, y: jump.y - Math.sin(a) * r, d };
  };
  const out = {
    k,
    stick,
    jump,
    action: at(arc.action, A),
    chips: { form: at(arc.form, C), song: at(arc.song, C), focus: at(arc.focus, C) },
  };
  if (hand === 'right') return out;
  // Left hand: the same layout seen in a mirror.
  const m = <T extends Disc>(c: T): T => ({ ...c, x: s.w - c.x });
  return { k, stick: m(out.stick), jump: m(out.jump), action: m(out.action), chips: { form: m(out.chips.form), song: m(out.chips.song), focus: m(out.chips.focus) } };
}

/** The top of the area the controls keep below. */
function topOf(s: TouchScreen): number {
  return s.portrait ? s.viewBottom + TOUCH.clearBelowView : s.safe.t + s.h * TOUCH.topClear;
}

/** Everything inside the screen and its bounds, clear of the subtitles, and no two controls touching. */
export function problems(s: TouchScreen, l: Omit<TouchLayout, 'fits' | 'top'>): string[] {
  const out: string[] = [];
  const top = topOf(s);
  const buttons: [string, Disc][] = [['jump', l.jump], ['action', l.action], ...CHIPS.map((c): [string, Disc] => [c, l.chips[c]])];
  const inside = (name: string, c: Disc, r: number): void => {
    if (c.x - r < s.safe.l || c.x + r > s.w - s.safe.r || c.y + r > s.h - s.safe.b) out.push(`${name} off the screen`);
    if (c.y - r < top) out.push(`${name} above the controls' area`);
  };
  inside('stick', l.stick, l.stick.d / 2);
  for (const [n, c] of buttons) inside(n, c, c.d / 2);
  // Apart from each other, with room for the label tags between them.
  const gap = TOUCH.gap * l.k * 0.5;
  for (let i = 0; i < buttons.length; i++) {
    const [na, a] = buttons[i]!;
    if (Math.hypot(a.x - l.stick.x, a.y - l.stick.y) < l.stick.reach + a.d / 2 + gap) out.push(`${na} touches the stick`);
    for (let j = i + 1; j < buttons.length; j++) {
      const [nb, b] = buttons[j]!;
      if (Math.hypot(a.x - b.x, a.y - b.y) < (a.d + b.d) / 2 + gap) out.push(`${na} touches ${nb}`);
    }
  }
  // Sideways the subtitles run along the bottom middle.
  const col = s.column;
  if (col && !s.portrait) {
    const all: [string, number, number][] = [['stick', l.stick.x, l.stick.reach], ...buttons.map(([n, c]): [string, number, number] => [n, c.x, c.d / 2])];
    for (const [n, x, r] of all) if (x + r > col.left && x - r < col.right) out.push(`${n} over the subtitles`);
  }
  return out;
}

/**
 * Places the controls: at the size TOUCH gives for this screen, or smaller
 * (never below TOUCH.minTarget) until they fit.
 */
export function touchLayout(s: TouchScreen, hand: Hand = TOUCH.hand): TouchLayout {
  const short = Math.min(s.w, s.h);
  const smallest = Math.min(TOUCH.chip, TOUCH.action, TOUCH.jump, TOUCH.stick.size);
  const kMin = TOUCH.minTarget / smallest;
  let k = Math.max(kMin, clamp(short / TOUCH.ref, TOUCH.minScale, TOUCH.maxScale) * (s.portrait ? 1 : TOUCH.landscape));
  let l = place(s, k, hand);
  while (problems(s, l).length && k > kMin) {
    k = Math.max(kMin, k * 0.96);
    l = place(s, k, hand);
  }
  return { ...l, top: topOf(s), fits: problems(s, l).length === 0 };
}
