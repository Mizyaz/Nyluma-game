import { ROOMS, roomDef } from '../../content/data/rooms';
import { MEMORY_IDS } from '../../content/data/memories';
import {
  ABILITIES,
  DEFAULT_SETTINGS,
  isAbility,
  isFormId,
  isRoomId,
  ROOM_IDS,
  type Ability,
  type FormId,
  type Profile,
  type Progress,
  type RoomId,
  type Settings,
} from './types';

export const CHAPTER_START: Record<number, RoomId> = {
  1: 'r01',
  2: 'r04',
  3: 'r07',
  4: 'r09',
  5: 'r12',
};

export const CHAPTER_TITLES: Record<number, string> = {
  1: '14. Oda',
  2: 'Yüzey ve Yalanlar',
  3: 'Mor At ve Güneş',
  4: 'İç Koğuş',
  5: 'Hak Aktarımı',
};

export function chapterOf(room: RoomId): number {
  return roomDef(room).chapter;
}

export function roomIndex(room: RoomId): number {
  return ROOM_IDS.indexOf(room);
}

/** Abilities the story guarantees at the start of a room, plus ones implied by flags. */
export function impliedAbilities(room: RoomId, flags: ReadonlySet<string>): Ability[] {
  const idx = roomIndex(room);
  const out = new Set<Ability>(['pulse']);
  if (idx >= roomIndex('r03') || flags.has('r02.reach')) out.add('reach');
  if (idx >= roomIndex('r03') || flags.has('r02.song')) out.add('song');
  if (idx >= roomIndex('r04') || flags.has('r03.focus')) out.add('focus');
  if (idx >= roomIndex('r05') || flags.has('r04.transformed')) out.add('form');
  return ABILITIES.filter((a) => out.has(a));
}

/** Form a room's player must have when entering from its first checkpoint. */
export function entryForm(room: RoomId, current: FormId, abilities: readonly Ability[]): FormId {
  const def = roomDef(room);
  if (def.entryForm) return def.entryForm;
  if (!abilities.includes('form')) return 'root';
  return current;
}

export function newProgress(): Progress {
  return startProgressAt('r01');
}

export function startProgressAt(room: RoomId): Progress {
  const def = roomDef(room);
  const abilities = impliedAbilities(room, new Set());
  return {
    room,
    checkpoint: def.checkpoints[0]!.id,
    flags: [],
    abilities,
    form: def.entryForm ?? 'root',
    playMs: 0,
  };
}

export function chapterStartProgress(chapter: number): Progress {
  const room = CHAPTER_START[chapter] ?? 'r01';
  return startProgressAt(room);
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out: string[] = [];
  for (const item of v) {
    if (typeof item === 'string' && item.length > 0 && item.length < 80 && !out.includes(item)) out.push(item);
  }
  return out;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * Validates a parsed progress object. Returns null when the structure is
 * unusable; repairs recoverable fields (unknown checkpoint, stray flags,
 * missing abilities, illegal form).
 */
export function normalizeProgress(raw: unknown): Progress | null {
  if (!isRecord(raw)) return null;
  if (!isRoomId(raw.room)) return null;
  const room = raw.room;
  const def = roomDef(room);
  const checkpoint =
    typeof raw.checkpoint === 'string' && def.checkpoints.some((c) => c.id === raw.checkpoint)
      ? raw.checkpoint
      : def.checkpoints[0]!.id;
  const flags = asStringArray(raw.flags);
  const flagSet = new Set(flags);
  const abilities = new Set<Ability>(impliedAbilities(room, flagSet));
  for (const a of asStringArray(raw.abilities)) if (isAbility(a)) abilities.add(a);
  const abilityList = ABILITIES.filter((a) => abilities.has(a));
  let form: FormId = isFormId(raw.form) ? raw.form : 'root';
  if (!abilityList.includes('form')) form = 'root';
  // Entering at a room's first checkpoint always applies the room's entry form.
  if (checkpoint === def.checkpoints[0]!.id && def.entryForm) form = def.entryForm;
  const playMs = typeof raw.playMs === 'number' && Number.isFinite(raw.playMs) && raw.playMs >= 0 ? raw.playMs : 0;
  return { room, checkpoint, flags, abilities: abilityList, form, playMs };
}

export function emptyProfile(): Profile {
  return { memories: [], endingSeen: false, chaptersReached: [1] };
}

export function normalizeProfile(raw: unknown): Profile {
  if (!isRecord(raw)) return emptyProfile();
  const memories = asStringArray(raw.memories).filter((m) => MEMORY_IDS.includes(m));
  const endingSeen = raw.endingSeen === true;
  const chapters = new Set<number>([1]);
  if (Array.isArray(raw.chaptersReached)) {
    for (const c of raw.chaptersReached) if (typeof c === 'number' && Number.isInteger(c) && c >= 1 && c <= 5) chapters.add(c);
  }
  if (endingSeen) for (let c = 1; c <= 5; c++) chapters.add(c);
  return { memories, endingSeen, chaptersReached: [...chapters].sort((a, b) => a - b) };
}

function clamp01(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : fallback;
}

function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

export function normalizeSettings(raw: unknown): Settings {
  const d = DEFAULT_SETTINGS;
  if (!isRecord(raw)) return { ...d };
  const textSpeed =
    raw.textSpeed === 'slow' || raw.textSpeed === 'normal' || raw.textSpeed === 'fast' || raw.textSpeed === 'instant'
      ? raw.textSpeed
      : d.textSpeed;
  const touch = raw.touch === 'auto' || raw.touch === 'on' || raw.touch === 'off' ? raw.touch : d.touch;
  return {
    master: clamp01(raw.master, d.master),
    music: clamp01(raw.music, d.music),
    sfx: clamp01(raw.sfx, d.sfx),
    reducedMotion: bool(raw.reducedMotion, d.reducedMotion),
    screenShake: bool(raw.screenShake, d.screenShake),
    textSpeed,
    touch,
  };
}

export type QuestListener = (kind: 'flag' | 'ability' | 'memory' | 'checkpoint' | 'form', id: string) => void;

/**
 * Runtime quest state. Every mutator is idempotent and reports whether it
 * changed anything, so triggers can safely run more than once.
 */
export class Quest {
  progress: Progress;
  profile: Profile;
  private flagSet: Set<string>;
  private listeners = new Set<QuestListener>();

  constructor(progress: Progress, profile: Profile) {
    this.progress = { ...progress, flags: [...progress.flags], abilities: [...progress.abilities] };
    this.profile = { ...profile, memories: [...profile.memories], chaptersReached: [...profile.chaptersReached] };
    this.flagSet = new Set(this.progress.flags);
    this.markChapter(chapterOf(this.progress.room));
  }

  onChange(fn: QuestListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(kind: Parameters<QuestListener>[0], id: string): void {
    for (const fn of this.listeners) fn(kind, id);
  }

  has(flag: string): boolean {
    return this.flagSet.has(flag);
  }

  /** Sets a flag. Returns true only the first time. */
  set(flag: string): boolean {
    if (this.flagSet.has(flag)) return false;
    this.flagSet.add(flag);
    this.progress.flags.push(flag);
    this.emit('flag', flag);
    return true;
  }

  hasAbility(a: Ability): boolean {
    return this.progress.abilities.includes(a);
  }

  grant(a: Ability): boolean {
    if (this.hasAbility(a)) return false;
    this.progress.abilities = ABILITIES.filter((x) => x === a || this.progress.abilities.includes(x));
    this.emit('ability', a);
    return true;
  }

  hasMemory(id: string): boolean {
    return this.profile.memories.includes(id);
  }

  collectMemory(id: string): boolean {
    if (!MEMORY_IDS.includes(id) || this.hasMemory(id)) return false;
    this.profile.memories.push(id);
    this.emit('memory', id);
    return true;
  }

  setForm(form: FormId): void {
    if (this.progress.form === form) return;
    this.progress.form = form;
    this.emit('form', form);
  }

  /** Moves the respawn point. Returns true if it changed. */
  setCheckpoint(room: RoomId, checkpoint: string): boolean {
    const def = roomDef(room);
    if (!def.checkpoints.some((c) => c.id === checkpoint)) return false;
    if (this.progress.room === room && this.progress.checkpoint === checkpoint) return false;
    this.progress.room = room;
    this.progress.checkpoint = checkpoint;
    this.markChapter(def.chapter);
    this.emit('checkpoint', checkpoint);
    return true;
  }

  markChapter(chapter: number): void {
    if (!this.profile.chaptersReached.includes(chapter)) {
      this.profile.chaptersReached = [...this.profile.chaptersReached, chapter].sort((a, b) => a - b);
    }
  }

  markEnding(): boolean {
    if (this.profile.endingSeen) return false;
    this.profile.endingSeen = true;
    for (let c = 1; c <= 5; c++) this.markChapter(c);
    return true;
  }
}

export { ROOMS };
