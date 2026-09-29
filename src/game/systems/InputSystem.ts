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

const CODE_MAP: Record<string, Action[]> = {
  ArrowLeft: ['left', 'note1'],
  ArrowRight: ['right', 'note3'],
  ArrowDown: ['down', 'note2'],
  ArrowUp: ['up'],
  KeyA: ['left', 'note1'],
  KeyD: ['right', 'note3'],
  KeyS: ['down', 'note2'],
  KeyW: ['up'],
  Space: ['jump'],
  KeyE: ['action'],
  KeyQ: ['focus'],
  KeyR: ['form'],
  KeyF: ['song'],
  Escape: ['pause'],
  KeyM: ['journal'],
  Enter: ['confirm'],
  NumpadEnter: ['confirm'],
};

// Letter keys are matched by the produced character first so that the
// on-screen labels (A, D, E, Q…) stay true on non-QWERTY layouts.
const KEY_MAP: Record<string, Action[]> = {
  a: ['left', 'note1'],
  d: ['right', 'note3'],
  s: ['down', 'note2'],
  w: ['up'],
  e: ['action'],
  q: ['focus'],
  r: ['form'],
  f: ['song'],
  m: ['journal'],
};

const EDGE_TTL_MS = 150;

interface Source {
  actions: Set<Action>;
  /** Held since before the last context change: ignored until released. */
  stale: boolean;
}

export function actionsForKey(code: string, key: string): Action[] {
  const k = key.length === 1 ? key.toLocaleLowerCase('en-US') : '';
  if (k && KEY_MAP[k]) return KEY_MAP[k]!;
  return CODE_MAP[code] ?? [];
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
  private edges = new Map<Action, number>();
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
    for (const s of this.sources.values()) s.stale = true;
  }

  /** Drops every hold (blur, scene change, pointer cancel storms). */
  releaseAll(): void {
    this.sources.clear();
    this.edges.clear();
  }

  held(a: Action): boolean {
    for (const s of this.sources.values()) if (!s.stale && s.actions.has(a)) return true;
    return false;
  }

  /** True once per press. */
  consume(a: Action): boolean {
    const t = this.edges.get(a);
    if (t === undefined) return false;
    this.edges.delete(a);
    return this.now() - t <= EDGE_TTL_MS;
  }

  /** Peeks at a pending press without consuming it. */
  peek(a: Action): boolean {
    const t = this.edges.get(a);
    return t !== undefined && this.now() - t <= EDGE_TTL_MS;
  }

  axisX(): number {
    return (this.held('right') ? 1 : 0) - (this.held('left') ? 1 : 0);
  }

  /** Source-level API shared by keyboard and touch controls. */
  sourceDown(id: string, actions: readonly Action[]): void {
    const prev = this.sources.get(id);
    if (prev && !prev.stale) {
      // Same source, maybe different actions (sliding finger on the d-pad).
      for (const a of actions) {
        if (!prev.actions.has(a)) {
          if (!this.held(a)) this.edges.set(a, this.now());
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
    const src: Source = { actions: new Set(), stale: false };
    for (const a of actions) {
      if (!this.held(a)) this.edges.set(a, this.now());
      src.actions.add(a);
    }
    this.sources.set(id, src);
  }

  sourceUp(id: string): void {
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
