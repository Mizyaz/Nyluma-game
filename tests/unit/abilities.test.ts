import { describe, expect, it } from 'vitest';
import { FocusMeter, pickReachTarget, segmentHitsRect } from '../../src/game/systems/AbilitySystem';
import { FOCUS_MAX_S } from '../../src/game/constants';

describe('focus meter', () => {
  it('drains only while active and recharges after a short delay', () => {
    const f = new FocusMeter();
    expect(f.step(0.1, true, true, false)).toBe('start');
    for (let i = 0; i < 10; i++) f.step(0.1, true, true, false);
    expect(f.value).toBeCloseTo(FOCUS_MAX_S - 1.1, 5);
    expect(f.step(0.1, false, true, false)).toBe('stop');
    const low = f.value;
    f.step(0.1, false, true, false);
    expect(f.value).toBeCloseTo(low, 5);
    for (let i = 0; i < 40; i++) f.step(0.1, false, true, false);
    expect(f.value).toBe(FOCUS_MAX_S);
  });

  it('stops when empty and cannot restart until partly refilled', () => {
    const f = new FocusMeter();
    let stopped = false;
    for (let i = 0; i < 40; i++) if (f.step(0.1, true, true, false) === 'stop') stopped = true;
    expect(stopped).toBe(true);
    expect(f.active).toBe(false);
    expect(f.step(0.1, true, true, false)).toBeNull();
  });

  it('does not activate when disabled (menus, dialogue)', () => {
    const f = new FocusMeter();
    expect(f.step(0.5, true, false, false)).toBeNull();
    expect(f.value).toBe(FOCUS_MAX_S);
  });
});

describe('root reach targeting', () => {
  const chest = { x: 100, y: 100 };
  it('picks the nearest anchor in the facing direction and range', () => {
    const t = pickReachTarget(chest, 1, [
      { id: 'far', x: 330, y: 100 },
      { id: 'near', x: 250, y: 60 },
      { id: 'behind', x: 20, y: 100 },
    ], []);
    expect(t?.id).toBe('near');
    expect(pickReachTarget(chest, -1, [{ id: 'behind', x: 20, y: 100 }], [])?.id).toBe('behind');
    expect(pickReachTarget(chest, 1, [{ id: 'far', x: 400, y: 100 }], [])).toBeNull();
  });

  it('rejects anchors behind solid geometry', () => {
    const wall = { x: 150, y: 0, w: 20, h: 300 };
    expect(pickReachTarget(chest, 1, [{ id: 'a', x: 250, y: 100 }], [wall])).toBeNull();
    expect(segmentHitsRect(0, 0, 10, 10, { x: 20, y: 20, w: 5, h: 5 })).toBe(false);
    expect(segmentHitsRect(0, 0, 30, 30, { x: 10, y: 10, w: 10, h: 10 })).toBe(true);
  });
});
