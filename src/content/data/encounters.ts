// The Sun encounter as a small pure state machine (unit-tested). Timing
// values are in seconds at standard difficulty; story assist scales them.

export type SunPhase = 'intro' | 'p1' | 'p2' | 'p3' | 'collapse' | 'done';

export interface SunState {
  phase: SunPhase;
  flowers: number;
  currents: number;
  hits: number;
}

export type SunEvent = 'introDone' | 'flower' | 'current' | 'hit' | 'collapseDone' | 'respawn';

export const SUN_TUNING = {
  flowersNeeded: 2,
  currentsNeeded: 3,
  hitsNeeded: 3,
  sweepSpeed: 280,
  sweepGap: 2.2,
  telegraph: 1.1,
  openingEvery: 2,
  openingWindow: 3.5,
  gatherTime: 0.6,
} as const;

export function sunStart(flags: { p1: boolean; p2: boolean; done: boolean }): SunState {
  if (flags.done) return { phase: 'done', flowers: 2, currents: 3, hits: 3 };
  if (flags.p2) return { phase: 'p3', flowers: 2, currents: 3, hits: 0 };
  if (flags.p1) return { phase: 'p2', flowers: 2, currents: 0, hits: 0 };
  return { phase: 'intro', flowers: 0, currents: 0, hits: 0 };
}

/** Legal transitions only; anything else leaves the state unchanged. */
export function sunNext(s: SunState, ev: SunEvent): SunState {
  switch (s.phase) {
    case 'intro':
      return ev === 'introDone' ? { ...s, phase: 'p1' } : s;
    case 'p1':
      if (ev !== 'flower') return s;
      return s.flowers + 1 >= SUN_TUNING.flowersNeeded ? { ...s, flowers: SUN_TUNING.flowersNeeded, phase: 'p2' } : { ...s, flowers: s.flowers + 1 };
    case 'p2':
      if (ev !== 'current') return s;
      return s.currents + 1 >= SUN_TUNING.currentsNeeded ? { ...s, currents: SUN_TUNING.currentsNeeded, phase: 'p3' } : { ...s, currents: s.currents + 1 };
    case 'p3':
      if (ev === 'respawn') return { ...s, hits: 0 };
      if (ev !== 'hit') return s;
      return s.hits + 1 >= SUN_TUNING.hitsNeeded ? { ...s, hits: SUN_TUNING.hitsNeeded, phase: 'collapse' } : { ...s, hits: s.hits + 1 };
    case 'collapse':
      return ev === 'collapseDone' ? { ...s, phase: 'done' } : s;
    case 'done':
      return s;
  }
}
