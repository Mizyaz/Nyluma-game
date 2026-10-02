import { h } from './dom';
import { buildStage, STAGE_SIZE, type StageKind } from './loadingStage';
import type { PaintAsk, Painted } from './loadingPaint.worker';
import Painter from './loadingPaint.worker?worker&inline';

// The loading screen: a pop-up paper theatre that builds itself while the
// game draws its pictures (the art is in loadingStage.ts). The proscenium
// springs up first with Gorti on the stage, his TV screen counting; then, as
// the progress rises, the night sky, the stars on their threads, the Moon
// and the Sun, the hills and the ground pop up one after another, and
// crystals sprout one by one while Gorti glances at each. At 100% the
// curtains part with a burst of paper confetti; close() fades it into the
// game. The words passed to set() stay readable on a paper strip.
//
// It runs beside the game drawing its atlases on the same machine, so it is
// cheap: the theatre is a stack of flat layers, each painted once; only
// their transforms and opacities move, on the compositor. Its big still
// pictures are painted as bitmaps by a worker (loadingPaint.ts), not by the
// page, and a piece comes up once its pictures are there. While it covers
// the game, the game's canvas is not drawn (styles.css), so that a frame
// redraws only what changed in the theatre. The pointer slides the layers
// against each other (the one script loop, which stops when it settles).
// The pieces wait their turns by transition delays, not timers, so the
// ripple plays on while the game keeps the page busy, and set() touches the
// page only when something there changes.
// Reduced motion: no parallax or bobbing, and the pieces simply appear.

/** Time between two pieces coming up (ms), so a jump in progress plays as a ripple. */
const BEAT = 60;
/**
 * The longest a piece waits for its turn (ms). When the game draws quickly
 * the pieces come due faster than a beat apart, and the ripple tightens
 * rather than trail behind the progress.
 */
const MAX_LAG = 200;
/** How long the pictures may take before the theatre shows them as SVG after all (ms). */
const PAINT_WAIT = 8000;
/** The most device pixels per CSS pixel the pictures are painted at. */
const MAX_DPR = 3;
/**
 * Near the end the game finishes its pictures in one long stretch that keeps
 * the page busy, and the theatre holds still for it from here: everything has
 * come up by then, and the small life pauses (where a software GPU draws the
 * page, each frame of it would hold up the game's own pictures). It is well
 * before 100% so that the pause is on screen before that stretch begins.
 */
const HUSH = 0.9;
/** The drapes gather toward the sides as the progress rises, up to here. */
const GATHERED = 0.8;

/**
 * The painter, made once and kept for the page's life. Its canvases hold a
 * GPU context, so ending it waits on the GPU process, and at the end of the
 * boot that process is busy with the game's pictures (ending it there held
 * the page up for seconds). Undefined until first wanted; null where it
 * cannot run.
 */
let painter: Worker | null | undefined;
/** Numbers the requests for paintings, across theatres (they share the painter). */
let asked = 0;

function sharedPainter(): Worker | null {
  if (painter === undefined) {
    painter = null;
    if (typeof OffscreenCanvas === 'function' && typeof Path2D === 'function') {
      try {
        painter = new Painter();
      } catch {
        painter = null;
      }
    }
  }
  return painter;
}

/** A layer of the theatre and how it slides with the pointer (see loadingStage's Slide). */
interface Slider {
  el: HTMLElement;
  p: number[];
}

export class LoadingView {
  readonly el: HTMLElement;
  private readonly box: HTMLElement;
  private readonly label: HTMLElement;
  private readonly count: HTMLElement;
  private readonly still: boolean;
  private kind: StageKind | null = null;
  /** One theatre unit, px. */
  private u = 1;
  /** Everything that comes up with the progress, in order. */
  private pieces: { at: number; el: HTMLElement }[] = [];
  private up = 0;
  private due = 0;
  /** When the next piece may come up (ms, performance.now()). */
  private slot = 0;
  /** How many pieces, up before the theatre was redrawn, wait to show again as they stood. */
  private restore = 0;
  private readonly glances = new Set<number>();
  private glancing = 0;
  private first: string | null = null;
  private pct = -1;
  private words = '';
  private gather = '';
  private message = false;
  private hush = false;
  private tada = false;
  private drapes: HTMLElement[] = [];
  private layers: Slider[] = [];
  private head: HTMLElement | null = null;
  private eyes: HTMLElement | null = null;
  private digits: HTMLElement | null = null;
  /** Paints the still pictures; null when they are shown as SVG instead. */
  private painter: Worker | null = null;
  /** The still pictures as drawn now (SVG), by their canvas's data-k. */
  private stills: string[] = [];
  /** Which painting of the pictures is wanted: a redraw or a new size asks again. */
  private gen = 0;
  /** px per unit the pictures were last asked at. */
  private scale = 0;
  private late = 0;
  private resized = 0;
  private raf = 0;
  private last = 0;
  private tx = 0;
  private ty = 0;
  private lx = 0;
  private ly = 0;
  private readonly resize: ResizeObserver;
  private closed = false;

  constructor(parent: HTMLElement) {
    this.still = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduced-motion');
    this.box = h('div', { class: 'ld-box' });
    this.label = h('span', { class: 'ld-lbl' });
    this.count = h('span', { class: 'ld-count' });
    this.el = h('div', { class: `loading${this.still ? ' ld-still' : ''}`, role: 'status', 'aria-live': 'polite' }, this.box, h('p', { class: 'ld-strip' }, this.label, this.count));
    this.painter = this.startPainter();
    parent.append(this.el);
    this.fit();
    this.resize = new ResizeObserver(() => this.fit());
    this.resize.observe(this.el);
    if (!this.still) {
      window.addEventListener('pointermove', this.point, { passive: true });
      window.addEventListener('pointerdown', this.point, { passive: true });
      window.addEventListener('pointerup', this.release, { passive: true });
      document.documentElement.addEventListener('pointerleave', this.release, { passive: true });
    }
  }

  /** Shows how far the drawings are (0..1), with a word about it. It is called for every picture, so it changes the page only when what shows changes. */
  set(progress: number, label: string): void {
    const p = Math.min(1, Math.max(0, progress || 0));
    if (label !== this.words) {
      this.words = label;
      this.label.textContent = label;
    }
    // New words arriving with 100% are a message (the drawings failed), not
    // the end of the growing: no ta-da, and Gorti's screen goes to snow.
    this.first ??= label;
    const message = p >= 1 && label !== this.first;
    if (message !== this.message) {
      this.message = message;
      this.el.classList.toggle('ld-msg', message);
    }
    if (message) {
      if (this.tada) {
        this.tada = false;
        this.el.classList.remove('ld-tada');
      }
      return;
    }
    const pct = Math.round(p * 100);
    if (pct !== this.pct) {
      this.pct = pct;
      this.count.textContent = `%${pct}`;
      if (this.digits) this.digits.textContent = `%${pct}`;
    }
    // The drapes gather a little toward the sides as the stage fills (at 100% they swish apart).
    const gather = (1 - Math.round(Math.min(p, GATHERED) * 10) * 0.022).toFixed(2);
    if (gather !== this.gather) {
      this.gather = gather;
      for (const d of this.drapes) d.style.setProperty('--k', gather);
    }
    if ((p >= HUSH) !== this.hush) {
      this.hush = p >= HUSH;
      this.el.classList.toggle('ld-hush', this.hush);
      if (this.hush) this.settle();
    }
    while (this.due < this.pieces.length && this.pieces[this.due]!.at <= p) this.due++;
    if (this.due > this.up) this.bringUp();
    if (p >= 1 && !this.tada) {
      this.tada = true;
      this.el.classList.add('ld-tada');
    }
  }

  /** Fades away, then leaves. */
  close(): void {
    if (this.closed) return;
    this.closed = true;
    // Whatever was still waiting comes up at once.
    for (const { el } of this.pieces) el.classList.add('on');
    this.up = this.pieces.length;
    for (const t of this.glances) window.clearTimeout(t);
    window.clearTimeout(this.glancing);
    window.clearTimeout(this.late);
    window.clearTimeout(this.resized);
    this.letGo();
    cancelAnimationFrame(this.raf);
    this.resize.disconnect();
    window.removeEventListener('pointermove', this.point);
    window.removeEventListener('pointerdown', this.point);
    window.removeEventListener('pointerup', this.release);
    document.documentElement.removeEventListener('pointerleave', this.release);
    this.el.classList.add('done');
    window.setTimeout(() => this.el.remove(), 450);
  }

  /**
   * Brings up the pieces the progress has reached, a beat apart: each waits
   * its turn by its own transition delay (--w), never longer than MAX_LAG, so
   * when many come due at once the beat shortens to fit. A piece whose
   * pictures are still being painted holds up those after it.
   */
  private bringUp(): void {
    if (this.restore) return;
    const now = performance.now();
    let wait = Math.min(MAX_LAG, Math.max(0, this.slot - now));
    const beat = Math.min(BEAT, (MAX_LAG - wait) / (this.due - this.up));
    for (; this.up < this.due; this.up++) {
      const { el } = this.pieces[this.up]!;
      if (el.querySelector('.ld-wait')) break;
      if (wait) {
        const w = `${Math.round(wait)}ms`;
        el.style.setProperty('--w', w);
        // A crystal's sparkle stands beside it.
        if (el.classList.contains('ld-cr')) (el.nextElementSibling as HTMLElement | null)?.style.setProperty('--w', w);
      }
      el.classList.add('on');
      const at = el.dataset.g;
      if (at && !this.still) {
        const t = window.setTimeout(() => {
          this.glances.delete(t);
          this.glance(at);
        }, wait);
        this.glances.add(t);
      }
      wait = Math.min(MAX_LAG, wait + beat);
    }
    this.slot = now + wait;
    if (this.hush) this.settle();
  }

  /**
   * From the hush on, whatever is still coming up is set in its place, so
   * that nothing is moving when the game's long last stretch begins. (Where
   * the page is drawn slowly, a piece's move can start well after its turn.)
   * The ta-da, once it starts, plays as it is.
   */
  private settle(): void {
    if (this.tada) return;
    for (const a of this.box.getAnimations({ subtree: true })) {
      if (a.playState === 'finished' || a.playState === 'paused' || !Number.isFinite(a.effect?.getComputedTiming().endTime)) continue;
      try {
        a.finish();
      } catch {
        // It cannot end (it has no end): it is left as it is.
      }
    }
  }

  /** Pieces whose pictures are all there may come up: first, after a redraw, those that were up before. */
  private arrive(): void {
    if (this.restore && !this.pieces.slice(0, this.restore).some(({ el }) => el.querySelector('.ld-wait'))) {
      this.el.classList.add('ld-instant');
      for (const { el } of this.pieces.slice(0, this.restore)) el.classList.add('on', 'ld-up');
      void this.el.offsetWidth;
      this.el.classList.remove('ld-instant');
      this.restore = 0;
    }
    if (this.due > this.up) this.bringUp();
  }

  // ------------------------------------------------------------ the pictures

  private startPainter(): Worker | null {
    const p = sharedPainter();
    if (p) {
      p.onmessage = this.landed;
      p.onerror = this.broke;
    }
    return p;
  }

  /** Stops listening to the painter, which stays for the next theatre. */
  private letGo(): void {
    if (this.painter?.onmessage === this.landed) {
      this.painter.onmessage = null;
      this.painter.onerror = null;
    }
    this.painter = null;
  }

  /** Asks for the still pictures at the theatre's present size, those of the first pieces first. */
  private paint(): void {
    window.clearTimeout(this.late);
    if (!this.painter) {
      this.unpaint();
      return;
    }
    this.scale = this.u * Math.min(MAX_DPR, window.devicePixelRatio || 1);
    // In the order the pieces come up; the confetti, wanted only at the end, last.
    const order = [...this.box.querySelectorAll<HTMLCanvasElement>('canvas[data-k]')]
      .map((c) => [c.closest('.ld-burst') ? 2 : Number(c.closest<HTMLElement>('[data-at]')?.dataset.at ?? -1), Number(c.dataset.k)] as const)
      .sort((a, b) => a[0] - b[0]);
    const ask: PaintAsk = { gen: (this.gen = ++asked), scale: this.scale, pictures: order.map(([, k]) => [k, this.stills[k] ?? '']) };
    this.painter.postMessage(ask);
    if (this.box.querySelector('.ld-wait')) this.late = window.setTimeout(this.unpaint, PAINT_WAIT);
  }

  /** A picture is painted: it goes on its canvas. */
  private landed = ({ data: { gen, key, bitmap } }: MessageEvent<Painted>): void => {
    const c = gen === this.gen && !this.closed ? this.box.querySelector<HTMLCanvasElement>(`canvas[data-k="${key}"]`) : null;
    const ctx = c && bitmap ? c.getContext('bitmaprenderer') : null;
    if (c && bitmap && ctx) {
      c.width = bitmap.width;
      c.height = bitmap.height;
      ctx.transferFromImageBitmap(bitmap);
      c.classList.remove('ld-wait');
    } else {
      bitmap?.close();
      if (c) this.asSvg(c);
    }
    if (!this.box.querySelector('.ld-wait')) window.clearTimeout(this.late);
    this.arrive();
  };

  /** Shows a picture as SVG after all. */
  private asSvg(c: HTMLCanvasElement): void {
    c.insertAdjacentHTML('beforebegin', this.stills[Number(c.dataset.k)] ?? '');
    c.remove();
  }

  /** Paints no more: the pictures still to come are shown as SVG. */
  private unpaint = (): void => {
    window.clearTimeout(this.late);
    this.letGo();
    for (const c of this.box.querySelectorAll<HTMLCanvasElement>('canvas.ld-wait')) this.asSvg(c);
    this.arrive();
  };

  /** The painter failed: it is ended for good, and the pictures still to come are shown as SVG. */
  private broke = (): void => {
    painter?.terminate();
    painter = null;
    this.unpaint();
  };

  /** Gorti turns his head and eyes toward a crystal that just sprouted. */
  private glance(at: string): void {
    if (!this.head || !this.eyes) return;
    const [dx = 0, dy = 0] = at.split(',').map(Number);
    const d = Math.hypot(dx, dy) || 1;
    this.eyes.style.transform = `translate(${((dx / d) * 11).toFixed(1)}%,${((dy / d) * 9).toFixed(1)}%)`;
    this.head.style.transform = `rotate(${(Math.max(-1, Math.min(1, dx / 320)) * 7).toFixed(1)}deg)`;
    window.clearTimeout(this.glancing);
    this.glancing = window.setTimeout(() => {
      if (this.head && this.eyes) this.head.style.transform = this.eyes.style.transform = '';
    }, 1300);
  }

  /** Sizes the theatre to the screen, and picks its shape: wide, 16:9 or upright. */
  private fit = (): void => {
    const cs = getComputedStyle(this.el);
    const w = this.el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const ht = this.el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (w < 40 || ht < 40) return;
    // Room under the stage for the paper strip (it overlaps the front board).
    const aw = w - 24;
    const ah = ht - Math.min(56, Math.max(30, ht * 0.07)) - 16;
    const a = aw / ah;
    const kind: StageKind = a > 1.62 ? 'wide' : a > 1.02 ? 'mid' : 'tall';
    const [W, H] = STAGE_SIZE[kind];
    const u = Math.min((aw * (kind === 'tall' ? 1 : 0.92)) / W, ah / H);
    this.u = u;
    this.el.style.setProperty('--u', `${u.toFixed(4)}px`);
    if (kind !== this.kind) this.build(kind);
    else {
      if (this.lx || this.ly) this.slide();
      // At a new size the pictures are painted again, once the size holds.
      if (this.painter && Math.abs((u * Math.min(MAX_DPR, window.devicePixelRatio || 1)) / this.scale - 1) > 0.02) {
        window.clearTimeout(this.resized);
        this.resized = window.setTimeout(() => this.paint(), 250);
      }
    }
    this.fitTitle();
  };

  /** Draws the theatre; a rebuild (the screen turned) keeps what was already up, without playing it again. */
  private build(kind: StageKind): void {
    this.kind = kind;
    const [W, H] = STAGE_SIZE[kind];
    const art = buildStage(kind);
    this.stills = art.stills;
    this.box.style.cssText = `--W:${W};--H:${H};--oy:${art.oy}`;
    this.box.innerHTML = art.html;
    this.pieces = [...this.box.querySelectorAll<HTMLElement>('[data-at]')].map((el) => ({ at: Number(el.dataset.at), el })).sort((a, b) => a.at - b.at);
    this.layers = [...this.box.querySelectorAll<HTMLElement>('[data-p]')].map((el) => ({ el, p: (el.dataset.p ?? '').split(' ').map(Number) }));
    this.head = this.box.querySelector('.ld-head');
    this.eyes = this.box.querySelector('.ld-eyes');
    this.digits = this.box.querySelector('.ld-digits');
    this.drapes = [...this.box.querySelectorAll<HTMLElement>('.ld-drape')];
    if (this.digits && this.pct >= 0) this.digits.textContent = `%${this.pct}`;
    for (const d of this.drapes) d.style.setProperty('--k', this.gather || '1');
    this.restore = this.up;
    this.due = Math.max(this.due, this.up);
    window.clearTimeout(this.resized);
    this.paint();
    this.arrive();
    // The new layers start square to the screen and ease back to the pointer.
    this.lx = this.ly = 0;
    if (this.tx || this.ty) this.ease();
  }

  /** Shrinks the title to its banner when the lettering runs wide (it varies by system font). */
  private fitTitle(): void {
    const box = this.box.querySelector<HTMLElement>('.ld-title');
    const title = box?.querySelector<HTMLElement>('.title');
    if (!box || !title) return;
    title.style.scale = '';
    const k = Math.min(1, box.clientWidth / Math.max(1, title.offsetWidth), (box.clientHeight * 1.1) / Math.max(1, title.offsetHeight));
    if (k < 1) title.style.scale = k.toFixed(3);
  }

  // ------------------------------------------------------------ parallax

  private point = (e: PointerEvent): void => {
    this.tx = Math.max(-1, Math.min(1, (e.clientX / (window.innerWidth || 1)) * 2 - 1));
    this.ty = Math.max(-1, Math.min(1, (e.clientY / (window.innerHeight || 1)) * 2 - 1));
    this.ease();
  };

  private release = (e: PointerEvent): void => {
    if (e.type === 'pointerup' && e.pointerType === 'mouse') return;
    this.tx = this.ty = 0;
    this.ease();
  };

  private ease(): void {
    if (this.raf || this.closed) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  /** Eases the stage toward the pointer. */
  private frame = (now: number): void => {
    const k = 1 - Math.exp(-Math.min(64, now - this.last) / 170);
    this.last = now;
    this.lx += (this.tx - this.lx) * k;
    this.ly += (this.ty - this.ly) * k;
    this.slide();
    this.raf = Math.abs(this.tx - this.lx) + Math.abs(this.ty - this.ly) > 0.002 ? requestAnimationFrame(this.frame) : 0;
  };

  /**
   * Slides each layer by its depth: the near ones with the pointer, the far
   * ones against it (a point (x, y) of a layer moves lx·(a0 + a1·x + a2·y)
   * across and ly·(b0 + b1·x + b2·y) down, in units).
   */
  private slide(): void {
    const { lx, ly, u } = this;
    for (const { el, p } of this.layers) {
      const [a0 = 0, a1 = 0, a2 = 0, b0 = 0, b1 = 0, b2 = 0] = p;
      el.style.transform = `matrix(${(1 + lx * a1).toFixed(5)},${(ly * b1).toFixed(5)},${(lx * a2).toFixed(5)},${(1 + ly * b2).toFixed(5)},${(lx * a0 * u).toFixed(2)},${(ly * b0 * u).toFixed(2)})`;
    }
  }
}
