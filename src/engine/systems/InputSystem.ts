import { GAMEPAD, KEYS, LETTERS } from '../../tuning';

export type Action =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'jump'
  | 'action'
  | 'focus'
  | 'form'
  | 'song'
  | 'pause'
  | 'journal'
  | 'confirm'
  | 'note1'
  | 'note2'
  | 'note3';

/** Who currently owns the keyboard/touch input. */
export type InputContext = 'menu' | 'gameplay' | 'dialogue' | 'song' | 'puzzle' | 'cutscene' | 'none';

// The bindings themselves (keys, letters, gamepad) are in src/tuning.ts.
const CODE_MAP = KEYS;
const KEY_MAP = LETTERS;

const EDGE_TTL_MS = 150;

interface Source {
  actions: Set<Action>;
  /** Held since before the last context change: ignored until released. */
  stale: boolean;
  /** Update frame in which the source went down. */
  frame: number;
}

export function actionsForKey(code: string, key: string): Action[] {
  const k = key.length === 1 ? key.toLocaleLowerCase('en-US') : '';
  if (k && KEY_MAP[k]) return [...KEY_MAP[k]!];
  return [...(CODE_MAP[code] ?? [])];
}

function isEditable(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const tag = t.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag === 'INPUT') {
    const type = (t as HTMLInputElement).type;
    return type !== 'button' && type !== 'checkbox' && type !== 'radio' && type !== 'range';
  }
  return t.isContentEditable;
}

/**
 * Unified keyboard + touch input with explicit contexts. Presses are edges
 * that are consumed once; holds carried across a context change are ignored
 * until released, so opening a panel never confirms its first choice.
 */
export class InputSystem {
  private sources = new Map<string, Source>();
  /** Pending presses: when (ms) and during which update frame they happened. */
  private edges = new Map<Action, { t: number; frame: number }>();
  /** Update frames seen so far (advanced by the game loop via beginFrame). */
  private frame = 0;
  /** Directions pressed and released before any update saw them (action → frame). */
  private taps = new Map<Action, number>();
  private contextStack: InputContext[] = ['none'];
  private listeners = new Set<(e: KeyboardEvent, actions: Action[]) => boolean>();
  private blurListeners = new Set<() => void>();
  private attached = false;
  private now: () => number;

  constructor(now: () => number = () => performance.now()) {
    this.now = now;
  }

  get context(): InputContext {
    return this.contextStack[this.contextStack.length - 1]!;
  }

  attach(target: Window = window): void {
    if (this.attached) return;
    this.attached = true;
    target.addEventListener('keydown', this.onKeyDown, { passive: false });
    target.addEventListener('keyup', this.onKeyUp);
    target.addEventListener('blur', this.onBlur);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  detach(target: Window = window): void {
    if (!this.attached) return;
    this.attached = false;
    target.removeEventListener('keydown', this.onKeyDown);
    target.removeEventListener('keyup', this.onKeyUp);
    target.removeEventListener('blur', this.onBlur);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  /** Raw key hook used by DOM menus (focus navigation). Return true to consume. */
  onKey(fn: (e: KeyboardEvent, actions: Action[]) => boolean): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  onFocusLost(fn: () => void): () => void {
    this.blurListeners.add(fn);
    return () => this.blurListeners.delete(fn);
  }

  setContext(ctx: InputContext): void {
    this.contextStack = [ctx];
    this.freeze();
  }

  pushContext(ctx: InputContext): void {
    this.contextStack.push(ctx);
    this.freeze();
  }

  popContext(ctx?: InputContext): void {
    if (ctx !== undefined && this.context !== ctx) {
      const i = this.contextStack.lastIndexOf(ctx);
      if (i > 0) this.contextStack.splice(i, 1);
      return;
    }
    if (this.contextStack.length > 1) this.contextStack.pop();
    this.freeze();
  }

  /** Clears pending presses and ignores current holds until they are released. */
  freeze(): void {
    this.edges.clear();
    this.taps.clear();
    for (const s of this.sources.values()) s.stale = true;
  }

  /** Drops every hold (blur, scene change, pointer cancel storms). */
  releaseAll(): void {
    this.sources.clear();
    this.edges.clear();
    this.taps.clear();
  }

  held(a: Action): boolean {
    for (const s of this.sources.values()) if (!s.stale && s.actions.has(a)) return true;
    return false;
  }

  /** Marks the start of an update frame (called once per game step). */
  beginFrame(): void {
    this.frame++;
    for (const [a, f] of this.taps) if (this.frame - f > 1) this.taps.delete(a);
  }

  /**
   * A press stays fresh for EDGE_TTL_MS, and in any case until the first
   * update after it: a long frame (slow device, a heavy first paint) must
   * not swallow a key press.
   */
  private fresh(e: { t: number; frame: number }): boolean {
    return this.now() - e.t <= EDGE_TTL_MS || this.frame - e.frame <= 1;
  }

  /** True once per press. */
  consume(a: Action): boolean {
    const e = this.edges.get(a);
    if (e === undefined) return false;
    this.edges.delete(a);
    return this.fresh(e);
  }

  /** Peeks at a pending press without consuming it. */
  peek(a: Action): boolean {
    const e = this.edges.get(a);
    return e !== undefined && this.fresh(e);
  }

  /**
   * Horizontal direction. A quick tap that went down and up between two
   * updates (slow frames) still counts for the next update, so a short press
   * always turns Gorti around.
   */
  axisX(): number {
    const dir = (a: Action): boolean => this.held(a) || this.taps.has(a);
    return (dir('right') ? 1 : 0) - (dir('left') ? 1 : 0);
  }

  /** Depth direction: up walks away from the viewer (−1), down toward them (+1). */
  axisY(): number {
    const dir = (a: Action): boolean => this.held(a) || this.taps.has(a);
    return (dir('down') ? 1 : 0) - (dir('up') ? 1 : 0);
  }

  /** Source-level API shared by keyboard and touch controls. */
  sourceDown(id: string, actions: readonly Action[]): void {
    const prev = this.sources.get(id);
    if (prev && !prev.stale) {
      // Same source, maybe different actions (sliding finger on the d-pad).
      for (const a of actions) {
        if (!prev.actions.has(a)) {
          if (!this.held(a)) this.edges.set(a, { t: this.now(), frame: this.frame });
          prev.actions.add(a);
        }
      }
      for (const a of [...prev.actions]) if (!actions.includes(a)) prev.actions.delete(a);
      return;
    }
    if (prev && prev.stale) {
      // Key repeat of a stale hold: stays ignored.
      return;
    }
    const src: Source = { actions: new Set(), stale: false, frame: this.frame };
    for (const a of actions) {
      if (!this.held(a)) this.edges.set(a, { t: this.now(), frame: this.frame });
      src.actions.add(a);
    }
    this.sources.set(id, src);
  }

  sourceUp(id: string): void {
    const src = this.sources.get(id);
    if (src && !src.stale && src.frame === this.frame) {
      for (const a of src.actions) if (a === 'left' || a === 'right') this.taps.set(a, this.frame);
    }
    this.sources.delete(id);
  }

  sourceCount(): number {
    return this.sources.size;
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (isEditable(e.target)) return;
    const actions = actionsForKey(e.code, e.key);
    for (const fn of this.listeners) {
      if (fn(e, actions)) {
        e.preventDefault();
        return;
      }
    }
    if (actions.length === 0) return;
    const ctx = this.context;
    if (ctx === 'menu') {
      // DOM buttons keep native Enter/Space activation; arrows never scroll.
      if (e.code.startsWith('Arrow')) e.preventDefault();
      return;
    }
    if (ctx === 'none') return;
    e.preventDefault();
    if (e.repeat) return;
    this.sourceDown('key:' + e.code, actions);
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    this.sourceUp('key:' + e.code);
  };

  private onBlur = (): void => {
    this.releaseAll();
    for (const fn of this.blurListeners) fn();
  };

  private onVisibility = (): void => {
    if (document.visibilityState === 'hidden') this.onBlur();
  };
}
