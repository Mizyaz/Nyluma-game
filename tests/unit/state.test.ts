import { describe, expect, it } from 'vitest';
import {
  chapterStartProgress,
  CHAPTER_START,
  impliedAbilities,
  newProgress,
  normalizeProfile,
  normalizeProgress,
  Quest,
} from '../../src/engine/state/GameState';
import { ROOMS } from '../../src/content/data/rooms';

describe('progress normalization', () => {
  it('rejects unusable structures', () => {
    expect(normalizeProgress(null)).toBeNull();
    expect(normalizeProgress('r01')).toBeNull();
    expect(normalizeProgress({ room: 'nowhere' })).toBeNull();
  });

  it('repairs an unknown checkpoint to the room entry', () => {
    const p = normalizeProgress({ room: 'r05', checkpoint: 'r05_moon_bridge' })!;
    expect(p.checkpoint).toBe('r05_start');
  });

  it('adds abilities the story guarantees for the room', () => {
    const p = normalizeProgress({ room: 'r06', checkpoint: 'r06_k1', abilities: [] })!;
    expect(p.abilities).toEqual(expect.arrayContaining(['pulse', 'reach', 'song', 'focus', 'form']));
    const early = normalizeProgress({ room: 'r02', checkpoint: 'r02_node', flags: ['r02.song'] })!;
    expect(early.abilities).toContain('song');
    expect(early.abilities).not.toContain('focus');
  });

  it('never restores a form that is not yet unlocked', () => {
    const p = normalizeProgress({ room: 'r03', checkpoint: 'r03_tree', form: 'human' })!;
    expect(p.form).toBe('root');
    const q = normalizeProgress({ room: 'r05', checkpoint: 'r05_gate', form: 'human' })!;
    expect(q.form).toBe('human');
  });

  it('applies a room entry form when restoring at its first checkpoint', () => {
    const p = normalizeProgress({ room: 'r06', checkpoint: 'r06_start', form: 'root' })!;
    expect(p.form).toBe('human');
    const q = normalizeProgress({ room: 'r09', checkpoint: 'r09_start', form: 'human' })!;
    expect(q.form).toBe('root');
  });

  it('drops malformed flags and duplicates', () => {
    const p = normalizeProgress({ room: 'r01', checkpoint: 'r01_start', flags: ['a', 'a', 3, '', null, 'b'] })!;
    expect(p.flags).toEqual(['a', 'b']);
  });

  it('builds a valid start for every chapter', () => {
    for (const ch of [1, 2, 3, 4, 5]) {
      const p = chapterStartProgress(ch);
      expect(p.room).toBe(CHAPTER_START[ch]);
      expect(normalizeProgress(p)).toEqual(p);
    }
    expect(newProgress().room).toBe('r01');
  });

  it('implies abilities monotonically along the story', () => {
    const order = Object.keys(ROOMS) as (keyof typeof ROOMS)[];
    let prev = 0;
    for (const r of order) {
      const n = impliedAbilities(r, new Set()).length;
      expect(n).toBeGreaterThanOrEqual(prev);
      prev = n;
    }
  });

  it('normalizes the profile', () => {
    const prof = normalizeProfile({ memories: ['m1', 'm1', 'm9', 'm8'], endingSeen: true, chaptersReached: [2, 'x', 9] });
    expect(prof.memories).toEqual(['m1', 'm8']);
    expect(prof.chaptersReached).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('Quest idempotency', () => {
  const quest = (): Quest => new Quest(newProgress(), { memories: [], endingSeen: false, chaptersReached: [1] });

  it('sets a flag only once', () => {
    const q = quest();
    let events = 0;
    q.onChange(() => events++);
    expect(q.set('r01.door')).toBe(true);
    expect(q.set('r01.door')).toBe(false);
    expect(q.progress.flags.filter((f) => f === 'r01.door')).toHaveLength(1);
    expect(events).toBe(1);
  });

  it('collects each memory once and ignores unknown ids', () => {
    const q = quest();
    expect(q.collectMemory('m3')).toBe(true);
    expect(q.collectMemory('m3')).toBe(false);
    expect(q.collectMemory('m42')).toBe(false);
    expect(q.profile.memories).toEqual(['m3']);
  });

  it('only accepts known checkpoints and marks chapters', () => {
    const q = quest();
    expect(q.setCheckpoint('r04', 'nope')).toBe(false);
    expect(q.setCheckpoint('r04', 'r04_focus')).toBe(true);
    expect(q.setCheckpoint('r04', 'r04_focus')).toBe(false);
    expect(q.profile.chaptersReached).toContain(2);
  });

  it('grants abilities once, keeps canonical order', () => {
    const q = quest();
    expect(q.grant('focus')).toBe(true);
    expect(q.grant('focus')).toBe(false);
    q.grant('reach');
    expect(q.progress.abilities).toEqual(['pulse', 'reach', 'focus']);
  });

  it('marks the ending once and unlocks every chapter', () => {
    const q = quest();
    expect(q.markEnding()).toBe(true);
    expect(q.markEnding()).toBe(false);
    expect(q.profile.chaptersReached).toEqual([1, 2, 3, 4, 5]);
  });
});
