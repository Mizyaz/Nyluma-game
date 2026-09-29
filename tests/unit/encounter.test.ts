import { describe, expect, it } from 'vitest';
import { SUN_TUNING, sunNext, sunStart, type SunState } from '../../src/game/data/encounters';

describe('Sun encounter phases', () => {
  it('starts according to saved phase flags', () => {
    expect(sunStart({ p1: false, p2: false, done: false }).phase).toBe('intro');
    expect(sunStart({ p1: true, p2: false, done: false }).phase).toBe('p2');
    expect(sunStart({ p1: true, p2: true, done: false }).phase).toBe('p3');
    expect(sunStart({ p1: true, p2: true, done: true }).phase).toBe('done');
  });

  it('advances only through legal events', () => {
    let s: SunState = sunStart({ p1: false, p2: false, done: false });
    s = sunNext(s, 'flower');
    expect(s.phase).toBe('intro');
    s = sunNext(s, 'introDone');
    expect(s.phase).toBe('p1');
    s = sunNext(s, 'hit');
    expect(s.phase).toBe('p1');
    for (let i = 0; i < SUN_TUNING.flowersNeeded; i++) s = sunNext(s, 'flower');
    expect(s.phase).toBe('p2');
    s = sunNext(s, 'flower');
    expect(s.flowers).toBe(SUN_TUNING.flowersNeeded);
    for (let i = 0; i < SUN_TUNING.currentsNeeded; i++) s = sunNext(s, 'current');
    expect(s.phase).toBe('p3');
    s = sunNext(s, 'hit');
    s = sunNext(s, 'respawn');
    expect(s.hits).toBe(0);
    for (let i = 0; i < SUN_TUNING.hitsNeeded; i++) s = sunNext(s, 'hit');
    expect(s.phase).toBe('collapse');
    s = sunNext(s, 'hit');
    expect(s.phase).toBe('collapse');
    s = sunNext(s, 'collapseDone');
    expect(s.phase).toBe('done');
    expect(sunNext(s, 'introDone')).toBe(s);
  });
});
