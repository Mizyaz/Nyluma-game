import { describe, expect, it } from 'vitest';
import { actionsForKey, InputSystem, type PadLike } from '../../src/engine/systems/InputSystem';

describe('input contexts', () => {
  const mk = (): { i: InputSystem; t: { now: number } } => {
    const t = { now: 0 };
    return { i: new InputSystem(() => t.now), t };
  };

  it('consumes a press exactly once', () => {
    const { i } = mk();
    i.setContext('gameplay');
    i.sourceDown('key:Space', ['jump']);
    expect(i.consume('jump')).toBe(true);
    expect(i.consume('jump')).toBe(false);
    expect(i.held('jump')).toBe(true);
    i.sourceUp('key:Space');
    expect(i.held('jump')).toBe(false);
  });

  it('ignores holds carried across a context change until released', () => {
    const { i } = mk();
    i.setContext('gameplay');
    i.sourceDown('key:KeyE', ['action']);
    i.pushContext('dialogue');
    expect(i.consume('action')).toBe(false);
    expect(i.held('action')).toBe(false);
    i.sourceDown('key:KeyE', ['action']);
    expect(i.consume('action')).toBe(false);
    i.sourceUp('key:KeyE');
    i.sourceDown('key:KeyE', ['action']);
    expect(i.consume('action')).toBe(true);
  });

  it('counts a direction tapped between two updates for the next update only', () => {
    const { i } = mk();
    i.setContext('gameplay');
    i.beginFrame();
    i.sourceDown('key:KeyD', ['right']);
    i.sourceUp('key:KeyD');
    expect(i.held('right')).toBe(false);
    i.beginFrame();
    expect(i.axisX()).toBe(1);
    i.beginFrame();
    expect(i.axisX()).toBe(0);
    // A hold that an update already saw ends normally on release.
    i.sourceDown('key:KeyA', ['left']);
    i.beginFrame();
    expect(i.axisX()).toBe(-1);
    i.sourceUp('key:KeyA');
    expect(i.axisX()).toBe(0);
  });

  it('expires stale presses', () => {
    const { i, t } = mk();
    i.setContext('gameplay');
    i.sourceDown('key:KeyE', ['action']);
    i.beginFrame();
    i.beginFrame();
    t.now = 1000;
    expect(i.consume('action')).toBe(false);
  });

  it('keeps a press alive through one long frame', () => {
    const { i, t } = mk();
    i.setContext('puzzle');
    i.sourceDown('key:KeyE', ['action']);
    t.now = 2500; // the next update arrives very late (slow first paint)
    i.beginFrame();
    expect(i.consume('action')).toBe(true);
  });

  it('supports simultaneous touch pointers and sliding on the pad', () => {
    const { i } = mk();
    i.setContext('gameplay');
    i.sourceDown('touch:pad:1', ['left']);
    i.sourceDown('touch:jump:2', ['jump']);
    expect(i.axisX()).toBe(-1);
    expect(i.consume('jump')).toBe(true);
    i.sourceDown('touch:pad:1', ['right']);
    expect(i.axisX()).toBe(1);
    expect(i.held('left')).toBe(false);
    i.sourceUp('touch:pad:1');
    i.sourceUp('touch:jump:2');
    expect(i.sourceCount()).toBe(0);
  });

  it('releases everything on blur', () => {
    const { i } = mk();
    i.setContext('gameplay');
    i.sourceDown('key:KeyD', ['right']);
    i.sourceDown('touch:jump:3', ['jump']);
    i.releaseAll();
    expect(i.axisX()).toBe(0);
    expect(i.sourceCount()).toBe(0);
  });

  it('maps letters by character and specials by code', () => {
    expect(actionsForKey('KeyQ', 'q')).toEqual(['focus']);
    expect(actionsForKey('KeyA', 'q')).toEqual(['focus']);
    expect(actionsForKey('Space', ' ')).toEqual(['jump']);
    expect(actionsForKey('ArrowLeft', 'ArrowLeft')).toEqual(['left', 'note1']);
  });

  it('keeps a context stack', () => {
    const { i } = mk();
    i.setContext('gameplay');
    i.pushContext('cutscene');
    i.pushContext('dialogue');
    expect(i.context).toBe('dialogue');
    i.popContext('dialogue');
    expect(i.context).toBe('cutscene');
    i.popContext('cutscene');
    expect(i.context).toBe('gameplay');
    i.popContext();
    expect(i.context).toBe('gameplay');
  });
});

describe('gamepad', () => {
  /** A standard-layout pad with these buttons down and the sticks at `axes`. */
  const pad = (down: number[] = [], axes: number[] = [0, 0, 0, 0]): PadLike => ({
    index: 0,
    connected: true,
    buttons: Array.from({ length: 17 }, (_, k) => ({ pressed: down.includes(k), value: down.includes(k) ? 1 : 0 })),
    axes,
  });
  const mk = (): { i: InputSystem; pads: (PadLike | null)[] } => {
    const pads: (PadLike | null)[] = [];
    return { i: new InputSystem(() => 0, () => pads), pads };
  };

  it('jumps with the south button, once per press, like Space', () => {
    const { i, pads } = mk();
    i.setContext('gameplay');
    pads[0] = pad([0]);
    i.beginFrame();
    expect(i.consume('jump')).toBe(true);
    expect(i.held('jump')).toBe(true);
    i.beginFrame();
    expect(i.consume('jump')).toBe(false);
    pads[0] = pad();
    i.beginFrame();
    expect(i.held('jump')).toBe(false);
    expect(i.sourceCount()).toBe(0);
  });

  it('walks with the left stick past its dead zone, in depth past a firmer one, and with the d-pad', () => {
    const { i, pads } = mk();
    i.setContext('gameplay');
    pads[0] = pad([], [0.2, 0.2]);
    i.beginFrame();
    expect([i.axisX(), i.axisY()]).toEqual([0, 0]);
    pads[0] = pad([], [-0.8, 0.4]);
    i.beginFrame();
    expect([i.axisX(), i.axisY()]).toEqual([-1, 0]);
    pads[0] = pad([], [0, -0.9]);
    i.beginFrame();
    expect([i.axisX(), i.axisY()]).toEqual([0, -1]);
    pads[0] = pad([15]);
    i.beginFrame();
    expect(i.axisX()).toBe(1);
    // Unplugged mid-walk: nothing stays held.
    pads.length = 0;
    i.beginFrame();
    expect(i.axisX()).toBe(0);
    expect(i.sourceCount()).toBe(0);
  });

  it('goes to the menus first: south is Enter, east is Escape, and nothing is held in the game', () => {
    const { i, pads } = mk();
    i.setContext('menu');
    const keys: string[] = [];
    i.onKey((e) => {
      keys.push(e.key);
      return true;
    });
    pads[0] = pad([0]);
    i.beginFrame();
    pads[0] = pad([1]);
    i.beginFrame();
    expect(keys).toEqual(['Enter', 'Escape']);
    expect(i.sourceCount()).toBe(0);
  });

  it('does nothing while the hands are off (a page turning)', () => {
    const { i, pads } = mk();
    i.setContext('none');
    pads[0] = pad([0], [1, 0]);
    i.beginFrame();
    expect(i.consume('jump')).toBe(false);
    expect(i.axisX()).toBe(0);
  });
});
