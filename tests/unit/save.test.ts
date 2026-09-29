import { describe, expect, it } from 'vitest';
import { SAVE_KEY, SETTINGS_KEY, SaveSystem, type StorageLike } from '../../src/game/systems/SaveSystem';
import { chapterStartProgress, emptyProfile, newProgress } from '../../src/game/state/GameState';
import { DEFAULT_SETTINGS } from '../../src/game/state/types';

class MemStorage implements StorageLike {
  map = new Map<string, string>();
  failWrites = false;
  getItem(k: string): string | null {
    return this.map.has(k) ? this.map.get(k)! : null;
  }
  setItem(k: string, v: string): void {
    if (this.failWrites) throw new Error('QuotaExceededError');
    this.map.set(k, v);
  }
  removeItem(k: string): void {
    this.map.delete(k);
  }
}

describe('SaveSystem', () => {
  it('round-trips progress and profile', () => {
    const st = new MemStorage();
    const s = new SaveSystem(st);
    const p = { ...chapterStartProgress(3), flags: ['r07.enter', 'cp:r07_mid1'], checkpoint: 'r07_mid1', playMs: 1234 };
    const prof = { memories: ['m1', 'm6'], endingSeen: false, chaptersReached: [1, 2, 3] };
    expect(s.save(p, prof)).toBe(true);
    const back = new SaveSystem(st).load();
    expect(back.status).toBe('ok');
    expect(back.progress).toEqual(p);
    expect(back.profile).toEqual(prof);
  });

  it('reports an empty save as empty and keeps New Game possible', () => {
    const s = new SaveSystem(new MemStorage());
    const r = s.load();
    expect(r.status).toBe('empty');
    expect(r.progress).toBeNull();
    expect(r.profile).toEqual(emptyProfile());
    expect(s.hasValidSave()).toBe(false);
  });

  it('recovers from corrupt JSON', () => {
    const st = new MemStorage();
    st.map.set(SAVE_KEY, '{"schema":1,"progress":');
    const r = new SaveSystem(st).load();
    expect(r.status).toBe('corrupt');
    expect(r.progress).toBeNull();
  });

  it('treats unknown schemas as unreadable without throwing', () => {
    const st = new MemStorage();
    st.map.set(SAVE_KEY, JSON.stringify({ schema: 99, progress: newProgress() }));
    expect(new SaveSystem(st).load().status).toBe('corrupt');
    st.map.set(SAVE_KEY, JSON.stringify({ progress: newProgress() }));
    expect(new SaveSystem(st).load().status).toBe('corrupt');
    st.map.set(SAVE_KEY, JSON.stringify({ schema: 1, progress: { room: 'r99' } }));
    expect(new SaveSystem(st).load().status).toBe('corrupt');
  });

  it('keeps the session playable when storage is unavailable', () => {
    const s = new SaveSystem(null);
    expect(s.available).toBe(false);
    expect(s.load().status).toBe('unavailable');
    expect(s.save(newProgress(), emptyProfile())).toBe(false);
    expect(s.loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(s.saveSettings(DEFAULT_SETTINGS)).toBe(false);
    expect(s.resetAll()).toBe(false);
  });

  it('survives storage that throws on write and read', () => {
    const st = new MemStorage();
    st.failWrites = true;
    const s = new SaveSystem(st);
    expect(s.save(newProgress(), emptyProfile())).toBe(false);
    expect(s.writeFailed).toBe(true);
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('SecurityError');
      },
      removeItem: () => {
        throw new Error('SecurityError');
      },
    };
    const s2 = new SaveSystem(throwing);
    expect(() => s2.load()).not.toThrow();
    expect(s2.load().progress).toBeNull();
    expect(s2.save(newProgress(), emptyProfile())).toBe(false);
  });

  it('normalizes and persists settings separately from progress', () => {
    const st = new MemStorage();
    const s = new SaveSystem(st);
    s.saveSettings({ ...DEFAULT_SETTINGS, music: 0.25, textSpeed: 'instant', touch: 'on', reducedMotion: true });
    expect(st.map.has(SETTINGS_KEY)).toBe(true);
    const back = new SaveSystem(st).loadSettings();
    expect(back.music).toBe(0.25);
    expect(back.textSpeed).toBe('instant');
    expect(back.touch).toBe('on');
    expect(back.reducedMotion).toBe(true);
    st.map.set(SETTINGS_KEY, JSON.stringify({ schema: 1, settings: { master: 7, sfx: -2, textSpeed: 'warp', reducedMotion: 'yes' } }));
    const odd = new SaveSystem(st).loadSettings();
    expect(odd.master).toBe(1);
    expect(odd.sfx).toBe(0);
    expect(odd.textSpeed).toBe('normal');
    expect(odd.reducedMotion).toBe(false);
  });

  it('reset clears progress and profile but not settings', () => {
    const st = new MemStorage();
    const s = new SaveSystem(st);
    s.save(newProgress(), { memories: ['m1'], endingSeen: true, chaptersReached: [1, 2, 3, 4, 5] });
    s.saveSettings({ ...DEFAULT_SETTINGS, sfx: 0.1 });
    expect(s.resetAll()).toBe(true);
    expect(s.load().status).toBe('empty');
    expect(s.loadSettings().sfx).toBe(0.1);
  });
});
