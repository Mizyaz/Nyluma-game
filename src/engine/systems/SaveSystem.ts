import { emptyProfile, normalizeProfile, normalizeProgress, normalizeSettings } from '../state/GameState';
import { DEFAULT_SETTINGS, type Profile, type Progress, type Settings } from '../state/types';

export const SAVE_KEY = 'kristaller-dunyasi:save';
export const SETTINGS_KEY = 'kristaller-dunyasi:settings';
export const SAVE_SCHEMA = 1;

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type SaveStatus = 'ok' | 'empty' | 'corrupt' | 'unavailable';

export interface LoadedSave {
  status: SaveStatus;
  progress: Progress | null;
  profile: Profile;
}

/** Finds usable localStorage, or null when the browser blocks it. */
export function detectStorage(): StorageLike | null {
  try {
    const s = globalThis.localStorage;
    if (!s) return null;
    const probe = '__kd_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

/**
 * Versioned JSON persistence. Every storage call is guarded: when storage is
 * missing or throws, the session keeps running and `available` turns false.
 */
export class SaveSystem {
  private storage: StorageLike | null;
  available: boolean;
  /** Set when a write failed during this session. */
  writeFailed = false;

  constructor(storage: StorageLike | null) {
    this.storage = storage;
    this.available = storage !== null;
  }

  private read(key: string): string | null {
    if (!this.storage) return null;
    try {
      return this.storage.getItem(key);
    } catch {
      this.available = false;
      return null;
    }
  }

  private write(key: string, value: string): boolean {
    if (!this.storage) return false;
    try {
      this.storage.setItem(key, value);
      return true;
    } catch {
      this.writeFailed = true;
      return false;
    }
  }

  load(): LoadedSave {
    if (!this.storage) return { status: 'unavailable', progress: null, profile: emptyProfile() };
    const text = this.read(SAVE_KEY);
    if (text === null) return { status: this.available ? 'empty' : 'unavailable', progress: null, profile: emptyProfile() };
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { status: 'corrupt', progress: null, profile: emptyProfile() };
    }
    if (typeof parsed !== 'object' || parsed === null || (parsed as { schema?: unknown }).schema !== SAVE_SCHEMA) {
      return { status: 'corrupt', progress: null, profile: emptyProfile() };
    }
    const data = parsed as { progress?: unknown; profile?: unknown };
    const profile = normalizeProfile(data.profile);
    const progress = data.progress === null || data.progress === undefined ? null : normalizeProgress(data.progress);
    if (data.progress && !progress) return { status: 'corrupt', progress: null, profile };
    return { status: progress ? 'ok' : 'empty', progress, profile };
  }

  save(progress: Progress | null, profile: Profile): boolean {
    const payload = JSON.stringify({ schema: SAVE_SCHEMA, savedAt: Date.now(), progress, profile });
    return this.write(SAVE_KEY, payload);
  }

  hasValidSave(): boolean {
    return this.load().status === 'ok';
  }

  loadSettings(): Settings {
    const text = this.read(SETTINGS_KEY);
    if (text === null) return { ...DEFAULT_SETTINGS };
    try {
      const parsed = JSON.parse(text) as unknown;
      if (typeof parsed === 'object' && parsed !== null && (parsed as { schema?: unknown }).schema === SAVE_SCHEMA) {
        return normalizeSettings((parsed as { settings?: unknown }).settings);
      }
    } catch {
      // fall through to defaults
    }
    return { ...DEFAULT_SETTINGS };
  }

  saveSettings(settings: Settings): boolean {
    return this.write(SETTINGS_KEY, JSON.stringify({ schema: SAVE_SCHEMA, settings }));
  }

  /** Removes progress and profile (journal, unlocks). Settings stay. */
  resetAll(): boolean {
    if (!this.storage) return false;
    try {
      this.storage.removeItem(SAVE_KEY);
      return true;
    } catch {
      this.writeFailed = true;
      return false;
    }
  }
}
