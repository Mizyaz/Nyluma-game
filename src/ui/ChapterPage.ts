import { h } from './dom';
import type { Clock, Rect } from './PageTurn';
import { shadeAt } from './pageCurl';
import { CHAPTER_TITLES } from '../engine/state/GameState';
import { ROMAN, comicTitle } from './Menus';
import { endpaperTile, flourish, lookOf, numeral, paintbrush, picture, PICTURE, tornSheet, wash, type ChapterLook } from '../content/art/chapterArt';
import { darkOf, lightOf, lineFor, SHADE } from '../render/2d/style';
import { nextId, type Pt } from '../render/2d/svg';
import { hatchLines } from '../content/characters/kit';

// A chapter's page in the storybook, shown between chapters (WarpScene): a
// sheet torn from a sketchbook, taped onto the chapter's endpaper, with
// "BÖLÜM", the chapter's numeral painted on with a brush, its title in comic
// lettering and a little picture of what the chapter holds standing up off
// the page like a pop-up card (and moving a little while it is read).
//
// The page is a gatefold: it is made twice, each copy showing one half, and
// to open onto the chapter's first room the halves swing open toward the
// viewer on hinges at the screen's edges, in perspective, shaded as they
// turn from the light (upper right), their shadows lying on the room.
//
// Everything is drawn in its final state; `reveal` plays it in, each part as
// the page turned over it uncovers it. Less motion: it is simply there, and
// fades. Every motion goes through the transition's Clock.

const r1 = (n: number): string => (Math.round(n * 10) / 10).toString();
const px = (n: number): string => `${r1(n)}px`;
const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** CSS's cubic-bezier(x1, y1, x2, y2) as a function of time (0..1). */
function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  return (t) => {
    let u = t;
    for (let i = 0; i < 8; i++) {
      const e = ((ax * u + bx) * u + cx) * u - t;
      const d = (3 * ax * u + 2 * bx) * u + cx;
      if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break;
      u = clamp01(u - e / d);
    }
    return ((ay * u + by) * u + cy) * u;
  };
}

/** The point a share `f` of the way along a polyline. */
function along(pts: readonly Pt[], f: number): Pt {
  let total = 0;
  for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
  let left = clamp01(f) * total;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (left <= l || i === pts.length - 1) {
      const k = l > 0 ? Math.min(1, left / l) : 0;
      return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
    }
    left -= l;
  }
  return pts[pts.length - 1]!;
}

/** The brush's stroke: as the paint's (stroke-dashoffset) easing. */
const PAINT_EASE = [0.35, 0.1, 0.35, 1] as const;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where everything goes (page px). */
interface Layout {
  sheet: Box;
  tag: Box;
  num: Box;
  title: Box;
  titleSize: number;
  /** The title's lines start at these words. */
  breaks: number[];
  flo: Box;
  pic: Box;
  tapes: { x: number; y: number; w: number; h: number }[];
  /** The page's measure (its smaller side). */
  m: number;
}

/** One copy of the page (each half of the gatefold shows one). */
interface Copy {
  root: HTMLElement;
  tag: HTMLElement;
  wash: Element;
  spines: SVGPathElement[];
  brush: Element;
  chars: HTMLElement[];
  flo: Element;
  card: HTMLElement;
  cardShadow: Element;
  cardLight: Element;
  movers: SVGGElement[];
}

interface Door {
  el: HTMLElement;
  sh: HTMLElement;
  gl: HTMLElement;
  gs: HTMLElement;
  copy: Copy;
  /** -1: the left half (hinged on the left edge), 1: the right. */
  side: -1 | 1;
  w: number;
}

/** Sounds the page makes as it comes in (WarpScene plays them). */
export type PageSound = (name: 'pop' | 'brush' | 'chapter', o?: { vol?: number; pitch?: number }) => void;

/** How the little pictures move while the page is read (`data-mv` in chapterArt.ts): keyframes and a period (s). */
const LIFE: Record<string, { frames: Keyframe[]; dur: number; easing?: string }> = {
  twinkle: {
    frames: [
      { transform: 'scale(0.55) rotate(0deg)', opacity: 0.6 },
      { transform: 'scale(1.18) rotate(22deg)', opacity: 1, offset: 0.5 },
      { transform: 'scale(0.55) rotate(45deg)', opacity: 0.6 },
    ],
    dur: 1.3,
    easing: 'ease-in-out',
  },
  pulse: { frames: [{ opacity: 0.72, transform: 'scale(0.96)' }, { opacity: 1, transform: 'scale(1.05)', offset: 0.5 }, { opacity: 0.72, transform: 'scale(0.96)' }], dur: 1.5, easing: 'ease-in-out' },
  blink: { frames: [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1)', offset: 0.84 }, { transform: 'scaleY(0.1)', offset: 0.9 }, { transform: 'scaleY(1)', offset: 0.96 }, { transform: 'scaleY(1)' }], dur: 1.9 },
  peek: {
    frames: [
      { transform: 'translate(0px, 6px) rotate(-4deg)' },
      { transform: 'translate(-3px, -4px) rotate(5deg)', offset: 0.38 },
      { transform: 'translate(0px, 0px) rotate(-1deg)', offset: 0.7 },
      { transform: 'translate(0px, 6px) rotate(-4deg)' },
    ],
    dur: 2.4,
    easing: 'ease-in-out',
  },
  swing: { frames: [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0.84)', offset: 0.5 }, { transform: 'scaleX(1)' }], dur: 2.2, easing: 'ease-in-out' },
  sway: { frames: [{ transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)', offset: 0.5 }, { transform: 'rotate(-6deg)' }], dur: 1.9, easing: 'ease-in-out' },
  bob: { frames: [{ transform: 'translateY(-3px) rotate(-4deg)' }, { transform: 'translateY(3px) rotate(4deg)', offset: 0.5 }, { transform: 'translateY(-3px) rotate(-4deg)' }], dur: 2.6, easing: 'ease-in-out' },
  gallop: {
    frames: [
      { transform: 'translateY(0px) rotate(0deg)' },
      { transform: 'translateY(-10px) rotate(-4deg)', offset: 0.35 },
      { transform: 'translateY(-2px) rotate(2deg)', offset: 0.7 },
      { transform: 'translateY(0px) rotate(0deg)' },
    ],
    dur: 0.52,
  },
  swish: { frames: [{ transform: 'rotate(-12deg)' }, { transform: 'rotate(9deg)', offset: 0.5 }, { transform: 'rotate(-12deg)' }], dur: 0.52, easing: 'ease-in-out' },
  spin: { frames: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], dur: 9 },
  tick: { frames: [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], dur: 6, easing: 'steps(12, end)' },
  drift: { frames: [{ transform: 'translate(0px, 0px)', opacity: 0.5 }, { transform: 'translate(6px, -7px)', opacity: 1, offset: 0.5 }, { transform: 'translate(0px, 0px)', opacity: 0.5 }], dur: 2.8, easing: 'ease-in-out' },
  breathe: { frames: [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.08)', offset: 0.45 }, { transform: 'scaleY(1)' }], dur: 2.3, easing: 'ease-in-out' },
  flicker: { frames: [{ opacity: 0.82 }, { opacity: 1, offset: 0.2 }, { opacity: 0.74, offset: 0.3 }, { opacity: 1, offset: 0.55 }, { opacity: 0.9, offset: 0.8 }, { opacity: 0.82 }], dur: 1.3 },
  thump: {
    frames: [
      { transform: 'translateY(-4px) scaleY(1)' },
      { transform: 'translateY(-12px) scaleY(1.02)', offset: 0.34, easing: 'cubic-bezier(.6,0,1,.7)' },
      { transform: 'translateY(19px) scaleY(0.9)', offset: 0.5 },
      { transform: 'translateY(15px) scaleY(1.03)', offset: 0.6 },
      { transform: 'translateY(19px) scaleY(1)', offset: 0.7, easing: 'ease-in-out' },
      { transform: 'translateY(-4px) scaleY(1)' },
    ],
    dur: 1.15,
  },
  flutter: {
    frames: [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(0deg)', offset: 0.5 },
      { transform: 'rotate(-4deg) translateY(1px)', offset: 0.56 },
      { transform: 'rotate(1.5deg)', offset: 0.64 },
      { transform: 'rotate(0deg)', offset: 0.74 },
      { transform: 'rotate(0deg)' },
    ],
    dur: 1.15,
  },
};

/** Measures the title's words at 100px (their widths and the space between). */
function measureTitle(host: HTMLElement, text: string): { words: number[]; space: number } {
  const t = comicTitle(text);
  t.classList.add('cp-title');
  t.style.cssText = 'position:absolute;left:0;top:0;font-size:100px;white-space:nowrap;width:max-content;rotate:none;visibility:hidden';
  host.append(t);
  const rs = [...t.querySelectorAll<HTMLElement>('.word')].map((w) => w.getBoundingClientRect());
  const words = rs.map((r) => r.width);
  const space = rs.length > 1 ? Math.max(10, rs[1]!.left - rs[0]!.right) : 28;
  t.remove();
  return { words: words.length ? words : [100], space };
}

/** The best way to set the words in `k` lines: the line starts, and the widest line. */
function setLines(words: readonly number[], space: number, k: number): { breaks: number[]; width: number } {
  const n = words.length;
  let best = { breaks: [] as number[], width: Infinity };
  const lineW = (a: number, b: number): number => {
    let w = 0;
    for (let i = a; i < b; i++) w += words[i]! + (i > a ? space : 0);
    return w;
  };
  const go = (start: number, left: number, cuts: number[]): void => {
    if (left === 1) {
      const ends = [...cuts, n];
      let s = 0;
      let wMax = 0;
      for (const e of ends) {
        wMax = Math.max(wMax, lineW(s, e));
        s = e;
      }
      if (wMax < best.width) best = { breaks: cuts, width: wMax };
      return;
    }
    for (let c = start + 1; c <= n - (left - 1); c++) go(c, left - 1, [...cuts, c]);
  };
  go(0, Math.min(k, n), []);
  return best;
}

/** The title's size and lines in a box `w` × `hMax` px (largest that fits, fewer lines a little preferred). */
function fitTitle(m: { words: number[]; space: number }, w: number, hMax: number, fMax: number): { size: number; breaks: number[]; lines: number } {
  let best = { size: 0, breaks: [] as number[], lines: 1, score: -1 };
  for (let k = 1; k <= Math.min(3, m.words.length); k++) {
    const s = setLines(m.words, m.space, k);
    // Measured at 100px; the letters' tilt and outline need a little room.
    const size = Math.min(fMax, (100 * w * 0.92) / s.width, hMax / (k * 1.12));
    const score = size * (1 - 0.07 * (k - 1));
    if (score > best.score) best = { size, breaks: s.breaks, lines: k, score };
  }
  return { size: Math.max(12, best.size), breaks: best.breaks, lines: best.lines };
}

export class ChapterPage {
  readonly el: HTMLElement;
  private readonly look: ChapterLook;
  private readonly W: number;
  private readonly H: number;
  private readonly L: Layout;
  private readonly doors: Door[] = [];
  private readonly veil: HTMLElement | null = null;
  private readonly roman: string;
  /** The numeral's strokes, as the brush goes along them (numeral units). */
  private strokePts: (readonly Pt[])[] = [];

  constructor(
    private readonly clock: Clock,
    parent: HTMLElement,
    readonly chapter: number,
    size: { w: number; h: number },
    private readonly view: Rect,
    private readonly reduced: boolean,
    private readonly sound: PageSound = () => undefined,
  ) {
    this.look = lookOf(chapter);
    this.W = Math.max(1, Math.round(size.w));
    this.H = Math.max(1, Math.round(size.h));
    this.roman = ROMAN[chapter] ?? String(chapter);
    const W = this.W;
    const H = this.H;
    this.el = h('div', { class: 'cp' });
    this.el.style.cssText = `width:${W}px;height:${H}px;perspective:${Math.round(Math.max(W, H) * 1.5)}px`;
    parent.prepend(this.el);
    this.L = this.layOut(measureTitle(this.el, CHAPTER_TITLES[chapter] ?? ''));
    // The gatefold's halves, each showing its half of a copy of the page.
    const half = Math.floor(W / 2);
    for (const side of [-1, 1] as const) {
      const x = side < 0 ? 0 : half;
      const w = side < 0 ? half : W - half;
      const el = h('div', { class: `cp-door ${side < 0 ? 'l' : 'r'}` });
      el.style.cssText = `left:${x}px;width:${w}px;height:${H}px`;
      const copy = this.build(x);
      const sh = h('i', { class: 'cp-sh' });
      const gl = h('i', { class: 'cp-gl' });
      const face = h('div', { class: 'cp-face' }, copy.root, sh, gl);
      el.append(face, h('div', { class: 'cp-back' }));
      // Its shadow on the room as it opens (PageTurn's ground shadow, darkest at the door).
      const gs = h('i', { class: side < 0 ? 'pt-gs' : 'pt-gs flip' });
      this.el.append(gs);
      this.doors.push({ el, sh, gl, gs, copy, side, w });
    }
    for (const d of this.doors) this.el.append(d.el);
    // Round the game view (a phone held upright) the page comes in over the
    // paper already there; over the view itself it is there at once (the
    // turning page uncovers it).
    const v = view;
    if (v.x > 1 || v.y > 1 || v.x + v.w < W - 1 || v.y + v.h < H - 1) {
      const veil = h('div', { class: 'cp-veil' });
      const hole = `${px(v.x)} ${px(v.y)}, ${px(v.x)} ${px(v.y + v.h)}, ${px(v.x + v.w)} ${px(v.y + v.h)}, ${px(v.x + v.w)} ${px(v.y)}, ${px(v.x)} ${px(v.y)}`;
      veil.style.cssText = `width:${W}px;height:${H}px;clip-path:polygon(evenodd, 0 0, ${W}px 0, ${W}px ${H}px, 0 ${H}px, 0 0, ${hole})`;
      this.el.after(veil);
      this.veil = veil;
      clock.play(veil, [{ opacity: 1 }, { opacity: 0 }], { duration: reduced ? 260 : 340, easing: 'ease-in' });
    }
  }

  /** Lays the page out for its size: two columns lying wide, one standing tall. */
  private layOut(words: { words: number[]; space: number }): Layout {
    const W = this.W;
    const H = this.H;
    const m = Math.min(W, H);
    const portrait = H > W * 1.05;
    const n = numeral(this.roman, this.look.paint, 1);
    const numAspect = n.w / n.h;
    const tagH = Math.min(40, Math.max(18, m * 0.055));
    const gap = m * 0.03;
    const tapeW = m * 0.17;
    const tapeH = m * 0.05;
    let sheet: Box;
    let pic: Box;
    let col: Box;
    let numH: number;
    let titleMax: number;
    if (!portrait) {
      sheet = { x: W * 0.035, y: H * 0.05, w: W * 0.93, h: H * 0.885 };
      const pad = m * 0.075;
      const inner = { x: sheet.x + pad, y: sheet.y + pad * 0.8, w: sheet.w - pad * 2, h: sheet.h - pad * 1.6 };
      const pw = Math.min(inner.w * 0.47, inner.h * 0.92 * (PICTURE.w / PICTURE.h));
      const ph = pw * (PICTURE.h / PICTURE.w);
      pic = { x: inner.x + inner.w - pw, y: inner.y + (inner.h - ph) * 0.42, w: pw, h: ph };
      col = { x: inner.x, y: inner.y, w: pic.x - inner.x - pad * 0.6, h: inner.h };
      numH = Math.min(col.h * 0.4, (col.w * 0.9) / numAspect);
      titleMax = col.h * 0.3;
    } else {
      sheet = { x: W * 0.045, y: H * 0.03, w: W * 0.91, h: H * 0.94 };
      const pad = W * 0.07;
      col = { x: sheet.x + pad, y: sheet.y + pad, w: sheet.w - pad * 2, h: sheet.h - pad * 2 };
      const pw = Math.min(col.w, col.h * 0.42 * (PICTURE.w / PICTURE.h));
      pic = { x: col.x + (col.w - pw) / 2, y: 0, w: pw, h: pw * (PICTURE.h / PICTURE.w) };
      numH = Math.min(H * 0.14, (col.w * 0.8) / numAspect);
      titleMax = H * 0.17;
    }
    const fit = fitTitle(words, col.w, titleMax, m * 0.16);
    const titleH = fit.lines * fit.size * 1.12;
    const floW = Math.min(col.w * 0.62, m * 0.5);
    const floH = (floW * 20) / 300;
    const stack = [tagH, gap * 0.8, numH, gap, titleH, gap * 0.7, floH];
    if (portrait) stack.push(gap * 1.6, pic.h);
    const total = stack.reduce((a, b) => a + b, 0);
    let y = col.y + Math.max(0, (col.h - total) / 2);
    const cx = col.x + col.w / 2;
    const tag = { x: cx - tagH * 2.6, y, w: tagH * 5.2, h: tagH };
    y += tagH + gap * 0.8;
    const num = { x: cx - (numH * numAspect) / 2, y, w: numH * numAspect, h: numH };
    y += numH + gap;
    const title = { x: col.x, y, w: col.w, h: titleH };
    y += titleH + gap * 0.7;
    const flo = { x: cx - floW / 2, y, w: floW, h: floH };
    y += floH + gap * 1.6;
    if (portrait) pic = { ...pic, y };
    const tapes = [
      { x: sheet.x + tapeW * 0.3, y: sheet.y + tapeH * 0.5, w: tapeW, h: tapeH },
      { x: sheet.x + sheet.w - tapeW * 0.3, y: sheet.y + sheet.h - tapeH * 0.5, w: tapeW, h: tapeH },
    ];
    return { sheet, tag, num, title, titleSize: fit.size, breaks: fit.breaks, flo, pic, tapes, m };
  }

  /** One copy of the page, placed so that its part from `off` px shows in a half. */
  private build(off: number): Copy {
    const L = this.L;
    const look = this.look;
    const W = this.W;
    const H = this.H;
    const m = L.m;
    const root = h('div', { class: 'cp-page' });
    root.style.cssText =
      `left:${-off}px;width:${W}px;height:${H}px;` +
      `--ground:${look.ground};--ground-hi:${lightOf(look.ground, 0.12)};--ground-lo:${darkOf(look.ground, 0.2)};--tile:${endpaperTile(look, 5 + this.chapter)}`;
    // The sheet: its cel shadow low on the left, the torn fibres, the surface.
    const S = L.sheet;
    const torn = tornSheet(S.x, S.y, S.w, S.h, 31 + this.chapter * 7, Math.max(4, m * 0.013));
    const sx = -m * 0.016;
    const sy = m * 0.022;
    root.insertAdjacentHTML(
      'beforeend',
      `<svg class="cp-sheet" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">` +
        `<path d="${torn.outer}" fill="#160d22" opacity="0.5" transform="translate(${r1(sx)} ${r1(sy)})"/>` +
        `<path d="${torn.outer}" fill="#fffbf3" stroke="#e0d0b4" stroke-width="0.8"/>` +
        `<path d="${torn.inner}" fill="#f5ead4"/>` +
        `<path d="${torn.inner}" fill="none" stroke="#cbb48e" stroke-width="1"/>` +
        `</svg>`,
    );
    const paper = h('div', { class: 'cp-paper' });
    paper.style.clipPath = `path('${torn.inner}')`;
    root.append(paper);
    // The fold down the middle of the gatefold.
    const crease = h('i', { class: 'cp-crease' });
    crease.style.left = px(W / 2 - 2);
    root.append(crease);
    // Tape at two corners.
    L.tapes.forEach((t, i) => {
      const tape = h('i', { class: 'cp-tape' });
      const c = look.words[i % look.words.length]!;
      tape.style.cssText = `left:${px(t.x)};top:${px(t.y)};width:${px(t.w)};height:${px(t.h)};--a:${c};--b:${lightOf(c, 0.4)};rotate:${i ? -36 : -38}deg`;
      root.append(tape);
    });
    // BÖLÜM, on a caption tag.
    const tag = h('div', { class: 'cp-tag', text: 'BÖLÜM' });
    tag.style.cssText = `left:${px(L.tag.x + L.tag.w / 2)};top:${px(L.tag.y)};font-size:${px(L.tag.h * 0.6)}`;
    root.append(tag);
    // The numeral, each brush stroke behind a mask the brush paints on.
    const n = numeral(this.roman, look.paint, 7 + this.chapter);
    let defs = '';
    // A watercolour wash first, behind the strokes.
    let body = `<g class="cp-wash">${wash({ x: -6, y: 2, w: n.w - 8, h: 98 }, look.paint, 3 + this.chapter)}</g>`;
    this.strokePts = n.strokes.map((s) => s.pts);
    for (const s of n.strokes) {
      const id = nextId('cpn');
      defs += `<mask id="${id}"><path class="cp-spine" d="${s.spine}" pathLength="1" fill="none" stroke="#fff" stroke-width="${r1(s.w)}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 2"/></mask>`;
      body += `<g mask="url(#${id})">${s.art}</g>`;
    }
    root.insertAdjacentHTML(
      'beforeend',
      `<svg class="cp-num" viewBox="${r1(n.x)} ${r1(n.y)} ${r1(n.w)} ${r1(n.h)}" style="left:${px(L.num.x)};top:${px(L.num.y)};width:${px(L.num.w)};height:${px(L.num.h)}" aria-hidden="true"><defs>${defs}</defs>${body}<g class="cp-brush">${paintbrush(look.paint)}</g></svg>`,
    );
    const spines = [...root.querySelectorAll<SVGPathElement>('.cp-spine')];
    const washEl = root.querySelector('.cp-wash')!;
    const brushEl = root.querySelector('.cp-brush')!;
    // The title: each word in its own pastel, inked in its own darker tone.
    const title = comicTitle(CHAPTER_TITLES[this.chapter] ?? '');
    title.classList.add('cp-title');
    title.style.cssText = `left:${px(L.title.x)};top:${px(L.title.y)};width:${px(L.title.w)};font-size:${px(L.titleSize)};--o:${px(Math.max(1.5, L.titleSize * 0.04))}`;
    const words = [...title.querySelectorAll<HTMLElement>('.word')];
    words.forEach((w, i) => {
      const c = look.words[i % look.words.length]!;
      w.style.setProperty('--c', c);
      w.style.setProperty('--line', lineFor(c));
      if (L.breaks.includes(i)) {
        const sp = w.previousSibling;
        if (sp && sp.nodeType === Node.TEXT_NODE) sp.replaceWith(h('br'));
        else w.before(h('br'));
      }
    });
    root.append(title);
    const chars = [...title.querySelectorAll<HTMLElement>('.ch')];
    // A hand-drawn rule under it.
    root.insertAdjacentHTML(
      'beforeend',
      `<svg class="cp-flo" viewBox="0 0 300 20" style="left:${px(L.flo.x)};top:${px(L.flo.y)};width:${px(L.flo.w)};height:${px(L.flo.h)}" aria-hidden="true">${flourish(300, look.accent)}</svg>`,
    );
    const flo = root.lastElementChild!;
    // The picture, standing on its hinge off the page, its shadow behind it.
    const pic = picture(this.chapter);
    const shId = nextId('cps');
    const holder = h('div', { class: 'cp-pic' });
    holder.style.cssText = `left:${px(L.pic.x)};top:${px(L.pic.y)};width:${px(L.pic.w)};height:${px(L.pic.h)};perspective:${Math.round(L.pic.h * 3.2)}px`;
    const lay = Math.max(4, L.pic.w * 0.028);
    holder.insertAdjacentHTML(
      'beforeend',
      `<i class="cp-hinge"></i>` +
        `<svg class="cp-card-sh" viewBox="0 0 ${PICTURE.w} ${PICTURE.h}" style="left:${px(-lay)};top:${px(lay * 1.2)}" aria-hidden="true">` +
        `<clipPath id="${shId}"><path d="${pic.outline}"/></clipPath>` +
        `<path d="${pic.outline}" fill="${SHADE.deep}"/>` +
        `<g clip-path="url(#${shId})">${hatchLines({ x0: 0, y0: 0, x1: PICTURE.w, y1: PICTURE.h }, 5, SHADE.hatch, 0.9)}</g>` +
        `</svg>` +
        `<div class="cp-card"><svg viewBox="0 0 ${PICTURE.w} ${PICTURE.h}" aria-hidden="true">${pic.art}<path class="cp-card-gl" d="${pic.outline}" fill="#fffcf4" opacity="0"/></svg></div>`,
    );
    root.append(holder);
    const card = holder.querySelector<HTMLElement>('.cp-card')!;
    return {
      root,
      tag,
      wash: washEl,
      spines,
      brush: brushEl,
      chars,
      flo,
      card,
      cardShadow: holder.querySelector('.cp-card-sh')!,
      cardLight: holder.querySelector('.cp-card-gl')!,
      movers: [...card.querySelectorAll<SVGGElement>('[data-mv]')],
    };
  }

  /** Plays `frames` on the same part of both copies. */
  private both(pick: (c: Copy) => Element | Element[], frames: Keyframe[], o: { duration: number; delay?: number; iterations?: number; easing?: string }): void {
    for (const d of this.doors) {
      const t = pick(d.copy);
      for (const el of Array.isArray(t) ? t : [t]) this.clock.play(el, frames, o);
    }
  }

  /**
   * The page comes in, each part as it is uncovered: under the page turning
   * away (`leaf`, its free edge on the `dir` side, uncovering from `at` s),
   * else all from `at`. Times are the transition's (s).
   */
  reveal(dir: 1 | -1, at: number, leaf = true): void {
    if (this.reduced) return;
    const L = this.L;
    const v = this.view;
    const now = this.clock.t;
    const ms = (t: number): number => Math.max(0, (t - now) * 1000);
    const when = (b: Box, order: number): number => {
      if (!leaf) return at + order * 0.12;
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      // Outside the game view the page is there as the paper round it fades.
      if (cx < v.x || cx > v.x + v.w || cy < v.y || cy > v.y + v.h) return 0.3 + order * 0.1;
      const x01 = (cx - v.x) / Math.max(1, v.w);
      return at - 0.1 + 0.5 * clamp01(dir > 0 ? 1 - x01 : x01);
    };
    // The picture stands up on its hinge, overshoots and settles.
    const tPic = when(L.pic, 1);
    const rise = 640;
    this.both((c) => c.card, [
      { transform: 'rotateX(-86deg)', offset: 0, easing: 'cubic-bezier(.25,.6,.45,1)' },
      { transform: 'rotateX(13deg)', offset: 0.5, easing: 'ease-in-out' },
      { transform: 'rotateX(-5deg)', offset: 0.74, easing: 'ease-in-out' },
      { transform: 'rotateX(1.5deg)', offset: 0.88, easing: 'ease-in-out' },
      { transform: 'rotateX(0deg)', offset: 1 },
    ], { duration: rise, delay: ms(tPic) });
    this.both((c) => c.cardShadow, [
      { transform: 'scaleY(0)', opacity: 0, offset: 0, easing: 'cubic-bezier(.25,.6,.45,1)' },
      { transform: 'scaleY(0.9)', opacity: 0.85, offset: 0.5 },
      { transform: 'scaleY(1.03)', opacity: 1, offset: 0.74 },
      { transform: 'scaleY(1)', opacity: 1, offset: 1 },
    ], { duration: rise, delay: ms(tPic) });
    // Lying, it faces the light; standing, it is lit as the page.
    this.both((c) => c.cardLight, [{ opacity: 0.45 }, { opacity: 0, offset: 0.5 }, { opacity: 0 }], { duration: rise, delay: ms(tPic) });
    this.clock.after(tPic + 0.28 - now, () => this.sound('pop', { vol: 0.8, pitch: 0.9 }));
    // Then it comes to life.
    const tLife = tPic + rise / 1000 - 0.1;
    for (const d of this.doors) {
      for (const g of d.copy.movers) {
        const life = LIFE[g.dataset.mv ?? ''];
        if (!life) continue;
        const ph = Number(g.dataset.ph ?? 0) || 0;
        this.clock.play(g, life.frames, { duration: life.dur * 1000, delay: ms(tLife + ph), iterations: Infinity, easing: life.easing });
      }
    }
    // BÖLÜM is slapped on.
    const tTag = when(L.tag, 0);
    this.both((c) => c.tag, [
      { transform: 'scale(1.7) rotate(-9deg)', opacity: 0, offset: 0, easing: 'cubic-bezier(.5,0,.8,.4)' },
      { transform: 'scale(0.9) rotate(1deg)', opacity: 1, offset: 0.55 },
      { transform: 'scale(1.04) rotate(-1deg)', opacity: 1, offset: 0.78 },
      { transform: 'scale(1) rotate(0deg)', opacity: 1, offset: 1 },
    ], { duration: 340, delay: ms(tTag) });
    // The numeral is painted on, stroke by stroke (the stems first, then the
    // serifs) by a little brush that hops from one stroke to the next.
    const tNum = Math.max(tTag + 0.12, when(L.num, 1));
    this.both((c) => c.wash, [
      { transform: 'scale(0.35)', opacity: 0, offset: 0, easing: 'cubic-bezier(.3,.7,.4,1)' },
      { transform: 'scale(1.05)', opacity: 1, offset: 0.65, easing: 'ease-in-out' },
      { transform: 'scale(1)', opacity: 1, offset: 1 },
    ], { duration: 420, delay: ms(tNum - 0.1) });
    const pts = this.strokePts;
    const strokes = pts.length;
    const each = Math.min(0.17, 0.55 / Math.max(1, strokes));
    const hop = Math.min(0.04, 0.25 / Math.max(1, strokes));
    const t0 = (i: number): number => tNum + 0.14 + i * (each + hop);
    const ease = `cubic-bezier(${PAINT_EASE.join(',')})`;
    for (let i = 0; i < strokes; i++) {
      this.both((c) => c.spines[i]!, [{ strokeDashoffset: '1.02' }, { strokeDashoffset: '0' }], { duration: each * 1000, delay: ms(t0(i)), easing: ease });
      if (i < 4) this.clock.after(t0(i) - now, () => this.sound('brush', { vol: 0.7, pitch: 0.9 + 0.08 * i }));
    }
    if (strokes) {
      const E = bezier(...PAINT_EASE);
      const keys: { t: number; p: Pt; o: number }[] = [];
      const first = pts[0]![0]!;
      keys.push({ t: tNum - 0.04, p: [first[0] + 46, first[1] - 40], o: 0 });
      keys.push({ t: t0(0) - 0.02, p: first, o: 1 });
      for (let i = 0; i < strokes; i++) {
        for (let k = 0; k <= 6; k++) keys.push({ t: t0(i) + (each * k) / 6, p: along(pts[i]!, E(k / 6)), o: 1 });
        const end = pts[i]![pts[i]!.length - 1]!;
        const next = pts[i + 1]?.[0];
        if (next) keys.push({ t: t0(i) + each + hop / 2, p: [(end[0] + next[0]) / 2, Math.min(end[1], next[1]) - 9], o: 1 });
        else keys.push({ t: t0(i) + each + 0.24, p: [end[0] + 50, end[1] - 46], o: 0 });
      }
      const ta = keys[0]!.t;
      const span = keys[keys.length - 1]!.t - ta;
      const frames: Keyframe[] = keys.map((k) => ({
        transform: `translate(${r1(k.p[0])}px, ${r1(k.p[1])}px)`,
        opacity: k.o,
        offset: Math.min(1, Math.max(0, (k.t - ta) / span)),
      }));
      // Offsets must not go back (two keys at one time keep their order).
      for (let i = 1; i < frames.length; i++) frames[i]!.offset = Math.max(frames[i]!.offset as number, frames[i - 1]!.offset as number);
      this.both((c) => c.brush, frames, { duration: span * 1000, delay: ms(ta) });
    }
    // The title's letters pop up one after another, with a little tune.
    const tTitle = Math.max(when(L.title, 2), tNum + 0.22);
    const nc = this.doors[0]!.copy.chars.length;
    const step = Math.min(0.035, 0.5 / Math.max(1, nc));
    for (let i = 0; i < nc; i++) {
      this.both((c) => c.chars[i]!, [
        { transform: 'translateY(0.4em) scale(0.1)', opacity: 0, offset: 0, easing: 'cubic-bezier(.3,.6,.5,1)' },
        { transform: 'translateY(-0.1em) scale(1.24)', opacity: 1, offset: 0.55, easing: 'ease-in-out' },
        { transform: 'translateY(0.02em) scale(0.94)', opacity: 1, offset: 0.8, easing: 'ease-in-out' },
        { transform: 'translateY(0em) scale(1)', opacity: 1, offset: 1 },
      ], { duration: 330, delay: ms(tTitle + i * step) });
    }
    this.clock.after(tTitle - now, () => this.sound('chapter', { vol: 0.9 }));
    // The rule is drawn out from its middle.
    const tFlo = tTitle + nc * step + 0.12;
    this.both((c) => c.flo, [
      { clipPath: 'inset(0 50% 0 50%)', opacity: 0.2 },
      { clipPath: 'inset(0 0% 0 0%)', opacity: 1 },
    ], { duration: 420, delay: ms(tFlo), easing: 'cubic-bezier(.3,.6,.4,1)' });
  }

  /**
   * The gatefold opens over `ms`: the halves swing toward the viewer on
   * their outer hinges, darken or catch the light as they turn, and leave.
   */
  open(ms: number): void {
    const W = this.W;
    const P = Math.max(W, this.H) * 1.5;
    const n = 18;
    // A little push at the fold, then a swing that speeds up as it goes.
    const swing = (u: number): number => {
      const push = u < 0.2 ? 0.09 * Math.sin((Math.PI * u) / 0.2) : 0;
      const v = clamp01((u - 0.08) / 0.92);
      return push + 1.78 * (0.3 * v + 0.7 * v * v);
    };
    for (const d of this.doors) {
      const frames: Keyframe[] = [];
      const sh: Keyframe[] = [];
      const gl: Keyframe[] = [];
      const gs: Keyframe[] = [];
      for (let i = 0; i <= n; i++) {
        const u = i / n;
        const a = swing(u);
        const deg = (a * 180) / Math.PI;
        frames.push({ transform: `rotateY(${r1(d.side < 0 ? -deg : deg)}deg)`, offset: u });
        const s = shadeAt(a, d.side < 0 ? 1 : -1);
        sh.push({ opacity: Math.min(1, s.front * 1.05), offset: u });
        gl.push({ opacity: s.glint * 0.8, offset: u });
        // The free edge on screen, and the shadow lying beside it on the room.
        const z = d.w * Math.sin(a);
        const xe = d.side < 0 ? d.w * Math.cos(a) : W - d.w * Math.cos(a);
        const sx = W / 2 + ((xe - W / 2) * P) / Math.max(1, P - z);
        const bw = Math.max(2, d.w * Math.sin(a) * 0.5 + d.w * 0.04);
        const left = d.side < 0 ? sx : sx - bw;
        gs.push({ transform: `translate3d(${r1(left)}px,0,0) scaleX(${(bw / 200).toFixed(3)})`, opacity: 0.85 * (1 - clamp01((a - 0.25) / 1.2)) * clamp01(a / 0.12), offset: u });
      }
      this.clock.play(d.el, frames, { duration: ms });
      this.clock.play(d.sh, sh, { duration: ms });
      this.clock.play(d.gl, gl, { duration: ms });
      this.clock.play(d.gs, gs, { duration: ms });
    }
    // Whatever is still in sight at the end goes.
    this.clock.play(this.el, [{ opacity: 1 }, { opacity: 1, offset: 0.9 }, { opacity: 0 }], { duration: ms });
  }

  /** Less motion: the page fades. */
  fade(ms: number): void {
    this.clock.play(this.el, [{ opacity: 1 }, { opacity: 0 }], { duration: ms, easing: 'ease-in' });
  }

  destroy(): void {
    this.el.remove();
    this.veil?.remove();
  }
}
