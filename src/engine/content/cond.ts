// Conditions in content files: when a prop shows, a gate stands, a trigger
// fires. A tiny language, parsed once and evaluated against the game's state
// (pure, no Phaser):
//
//   bloom                 the story flag `bloom` is set (a bare word is a flag)
//   flag:bloom            the same, spelled out
//   form:human            Gorti is in the human form
//   room:r03              the current room is r03
//   sky:moon              the Moon is out (sky:sun, sky:none): Gorti's kahkaha swaps them
//   !flag:bloom           not
//   a & b, a | b, (a | b) & c   and binds tighter than or
//
// Empty or missing conditions always hold.

export type Cond =
  | { k: 'flag'; name: string }
  | { k: 'form'; name: string }
  | { k: 'room'; name: string }
  | { k: 'sky'; name: string }
  | { k: 'not'; c: Cond }
  | { k: 'and'; cs: Cond[] }
  | { k: 'or'; cs: Cond[] }
  | { k: 'true' };

export interface CondCtx {
  has(flag: string): boolean;
  form: string;
  room: string;
  /** Which one shines: 'sun', 'moon' or 'none' (default). */
  sky?: string;
}

const ATOM = /^[A-Za-z0-9_.:-]+/;

export class CondError extends Error {}

export function parseCond(src: string | undefined): Cond {
  const s = (src ?? '').trim();
  if (!s) return { k: 'true' };
  let i = 0;
  const ws = (): void => {
    while (i < s.length && s[i] === ' ') i++;
  };
  const fail = (msg: string): never => {
    throw new CondError(`${msg} at ${i} in "${s}"`);
  };
  const or = (): Cond => {
    const cs = [and()];
    for (ws(); s[i] === '|'; ws()) {
      i++;
      cs.push(and());
    }
    return cs.length === 1 ? cs[0]! : { k: 'or', cs };
  };
  const and = (): Cond => {
    const cs = [unary()];
    for (ws(); s[i] === '&'; ws()) {
      i++;
      cs.push(unary());
    }
    return cs.length === 1 ? cs[0]! : { k: 'and', cs };
  };
  const unary = (): Cond => {
    ws();
    if (s[i] === '!') {
      i++;
      return { k: 'not', c: unary() };
    }
    if (s[i] === '(') {
      i++;
      const c = or();
      ws();
      if (s[i] !== ')') fail('expected )');
      i++;
      return c;
    }
    const m = ATOM.exec(s.slice(i));
    if (!m) return fail('expected a flag, form:, room: or sky:');
    i += m[0].length;
    const [kind, ...rest] = m[0].split(':');
    const name = rest.join(':');
    if (!rest.length) return { k: 'flag', name: kind! };
    if (!name) return fail(`empty name after ${kind}:`);
    if (kind === 'flag' || kind === 'form' || kind === 'room' || kind === 'sky') return { k: kind, name };
    // A flag whose own name holds a colon.
    return { k: 'flag', name: m[0] };
  };
  const c = or();
  ws();
  if (i < s.length) fail('unexpected text');
  return c;
}

const cache = new Map<string, Cond>();

/** Whether `c` holds (strings are parsed once and cached). */
export function evalCond(c: Cond | string | undefined, ctx: CondCtx): boolean {
  if (c === undefined || typeof c === 'string') {
    const key = c ?? '';
    let parsed = cache.get(key);
    if (!parsed) {
      parsed = parseCond(key);
      cache.set(key, parsed);
    }
    c = parsed;
  }
  switch (c.k) {
    case 'true':
      return true;
    case 'flag':
      return ctx.has(c.name);
    case 'form':
      return ctx.form === c.name;
    case 'room':
      return ctx.room === c.name;
    case 'sky':
      return (ctx.sky ?? 'none') === c.name;
    case 'not':
      return !evalCond(c.c, ctx);
    case 'and':
      return c.cs.every((x) => evalCond(x, ctx));
    case 'or':
      return c.cs.some((x) => evalCond(x, ctx));
  }
}

/** Every flag a condition mentions (for validation and tools). */
export function condFlags(c: Cond | string | undefined): string[] {
  const p = typeof c === 'string' || c === undefined ? parseCond(c) : c;
  switch (p.k) {
    case 'flag':
      return [p.name];
    case 'not':
      return condFlags(p.c);
    case 'and':
    case 'or':
      return p.cs.flatMap((x) => condFlags(x));
    default:
      return [];
  }
}
