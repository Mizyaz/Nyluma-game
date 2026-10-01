import { h } from './dom';
import { buildStage, STAGE_SIZE, type StageKind } from './loadingStage';

// The loading screen: a pop-up paper theatre that builds itself while the
// game draws its pictures (the art is in loadingStage.ts). The proscenium
// springs up first with Gorti on the stage, his TV screen counting; then, as
// the progress rises, the night sky, the stars on their threads, the Moon
// and the Sun, the hills and the ground pop up one after another, and
// crystals sprout one by one while Gorti glances at each. At 100% the
// curtains part with a burst of paper confetti; close() fades it into the
// game. The words passed to set() stay readable on a paper strip.
//
// Cheap to run: everything moves by CSS transforms and opacity on the
// compositor; the only script loop eases the pointer parallax and stops
// when it settles. Reduced motion: no sway, parallax or bobbing, and the
// pieces simply fade in.

/** Time between two pieces coming up (ms), so a jump in progress plays as a ripple. */
const BEAT = 85;

export class LoadingView {
  readonly el: HTMLElement;
  private readonly box: HTMLElement;
  private readonly label: HTMLElement;
  private readonly count: HTMLElement;
  private readonly still: boolean;
  private kind: StageKind | null = null;
  /** Everything that comes up with the progress, in order. */
  private pieces: { at: number; el: HTMLElement }[] = [];
  private up = 0;
  private due = 0;
  private beat = 0;
  private glancing = 0;
  private first: string | null = null;
  private pct = -1;
  private words = '';
  private gather = '';
  private drapes: HTMLElement[] = [];
  private look: HTMLElement | null = null;
  private head: HTMLElement | null = null;
  private eyes: HTMLElement | null = null;
  private digits: HTMLElement | null = null;
  private raf = 0;
  private last = 0;
  private tx = 0;
  private ty = 0;
  private lx = 0;
  private ly = 0;
  private resize: ResizeObserver | null = null;
  private closed = false;

  constructor(parent: HTMLElement) {
    this.still = matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduced-motion');
    this.box = h('div', { class: 'ld-box' });
    this.label = h('span', { class: 'ld-lbl' });
    this.count = h('span', { class: 'ld-count' });
    this.el = h('div', { class: `loading${this.still ? ' ld-still' : ''}`, role: 'status', 'aria-live': 'polite' }, this.box, h('p', { class: 'ld-strip' }, this.label, this.count));
    parent.append(this.el);
    this.fit();
    if (typeof ResizeObserver !== 'undefined') {
      this.resize = new ResizeObserver(() => this.fit());
      this.resize.observe(this.el);
    } else window.addEventListener('resize', this.fit);
    if (!this.still) {
      window.addEventListener('pointermove', this.point, { passive: true });
      window.addEventListener('pointerdown', this.point, { passive: true });
      window.addEventListener('pointerup', this.release, { passive: true });
      document.documentElement.addEventListener('pointerleave', this.release, { passive: true });
    }
  }

  /** Shows how far the drawings are (0..1), with a word about it. */
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
    this.el.classList.toggle('ld-msg', message);
    if (message) {
      this.el.classList.remove('ld-tada');
      return;
    }
    const pct = Math.round(p * 100);
    if (pct !== this.pct) {
      this.pct = pct;
      this.count.textContent = `%${pct}`;
      if (this.digits) this.digits.textContent = `%${pct}`;
    }
    // The drapes gather a little toward the sides as the stage fills (at 100% they swish apart).
    const gather = (1 - Math.round(p * 10) * 0.022).toFixed(2);
    if (gather !== this.gather) {
      this.gather = gather;
      for (const d of this.drapes) d.style.setProperty('--k', gather);
    }
    while (this.due < this.pieces.length && this.pieces[this.due]!.at <= p) this.due++;
    this.next();
    if (p >= 1) this.el.classList.add('ld-tada');
  }

  /** Fades away, then leaves. */
  close(): void {
    if (this.closed) return;
    this.closed = true;
    // Whatever was still waiting comes up at once.
    for (const { el } of this.pieces.slice(this.up)) el.classList.add('on');
    this.up = this.pieces.length;
    window.clearTimeout(this.beat);
    window.clearTimeout(this.glancing);
    cancelAnimationFrame(this.raf);
    this.resize?.disconnect();
    window.removeEventListener('resize', this.fit);
    window.removeEventListener('pointermove', this.point);
    window.removeEventListener('pointerdown', this.point);
    window.removeEventListener('pointerup', this.release);
    document.documentElement.removeEventListener('pointerleave', this.release);
    this.el.classList.add('done');
    window.setTimeout(() => this.el.remove(), 450);
  }

  /** Brings up the next piece the progress has reached, then waits a beat (half a beat when it lags behind). */
  private next(): void {
    if (this.beat || this.up >= this.due) return;
    const { el } = this.pieces[this.up++]!;
    el.classList.add('on');
    if (el.dataset.g) this.glance(el.dataset.g);
    this.beat = window.setTimeout(
      () => {
        this.beat = 0;
        this.next();
      },
      this.pct >= 100 || this.due - this.up > 5 ? BEAT / 2 : BEAT,
    );
  }

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
    this.el.style.setProperty('--u', `${u.toFixed(4)}px`);
    if (kind !== this.kind) this.build(kind);
    this.fitTitle();
  };

  /** Draws the theatre; a rebuild (the screen turned) keeps what was already up, without playing it again. */
  private build(kind: StageKind): void {
    this.kind = kind;
    const [W, H] = STAGE_SIZE[kind];
    const art = buildStage(kind);
    this.box.style.cssText = `--W:${W};--H:${H};--oy:${art.oy}`;
    this.box.innerHTML = art.html;
    this.pieces = [...this.box.querySelectorAll<HTMLElement>('[data-at]')].map((el) => ({ at: Number(el.dataset.at), el })).sort((a, b) => a.at - b.at);
    this.look = this.box.querySelector('.ld-look');
    this.head = this.box.querySelector('.ld-head');
    this.eyes = this.box.querySelector('.ld-eyes');
    this.digits = this.box.querySelector('.ld-digits');
    this.drapes = [...this.box.querySelectorAll<HTMLElement>('.ld-drape')];
    if (this.digits && this.pct >= 0) this.digits.textContent = `%${this.pct}`;
    for (const d of this.drapes) d.style.setProperty('--k', this.gather || '1');
    if (this.up) {
      this.el.classList.add('ld-instant');
      for (const { el } of this.pieces.slice(0, this.up)) el.classList.add('on');
      void this.el.offsetWidth;
      this.el.classList.remove('ld-instant');
    }
    this.due = Math.max(this.due, this.up);
    this.lx = this.ly = 0;
    if (this.look) this.look.style.transform = '';
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

  /** Eases the stage toward the pointer: the near layers move more than the far ones. */
  private frame = (now: number): void => {
    const k = 1 - Math.exp(-Math.min(64, now - this.last) / 170);
    this.last = now;
    this.lx += (this.tx - this.lx) * k;
    this.ly += (this.ty - this.ly) * k;
    if (this.look) this.look.style.transform = `rotateX(${(this.ly * 4).toFixed(2)}deg) rotateY(${(-this.lx * 7).toFixed(2)}deg)`;
    this.raf = Math.abs(this.tx - this.lx) + Math.abs(this.ty - this.ly) > 0.002 ? requestAnimationFrame(this.frame) : 0;
  };
}
