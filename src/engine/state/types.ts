import story from '../../content/chapters/chapters.json';

/** Every room, in story order (src/content/chapters/chapters.json). */
export const ROOM_IDS: readonly string[] = story.chapters.flatMap((c) => c.rooms);
/** A room's id: one of the TypeScript rooms or a room file. */
export type RoomId = string;

export type FormId = 'root' | 'human';
export const PLAYER_KINDS = ['gorti', 'horse', 'coward', 'mech', 'suit'] as const;
export type PlayerKind = (typeof PLAYER_KINDS)[number];
export type Ability = 'pulse' | 'reach' | 'song' | 'focus' | 'form';
export const ABILITIES: readonly Ability[] = ['pulse', 'reach', 'song', 'focus', 'form'];
export type Note = 'low' | 'mid' | 'high';
export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';
export type TouchMode = 'auto' | 'on' | 'off';

export function isRoomId(v: unknown): v is RoomId {
  return typeof v === 'string' && ROOM_IDS.includes(v);
}

export function isFormId(v: unknown): v is FormId {
  return v === 'root' || v === 'human';
}

export function isAbility(v: unknown): v is Ability {
  return typeof v === 'string' && (ABILITIES as readonly string[]).includes(v);
}

/** One playthrough's position in the story. */
export interface Progress {
  room: RoomId;
  checkpoint: string;
  flags: string[];
  abilities: Ability[];
  form: FormId;
  playMs: number;
}

/** Survives New Game: the journal, unlocked chapters and ending status. */
export interface Profile {
  memories: string[];
  endingSeen: boolean;
  chaptersReached: number[];
}

export interface Settings {
  master: number;
  music: number;
  sfx: number;
  reducedMotion: boolean;
  screenShake: boolean;
  textSpeed: TextSpeed;
  touch: TouchMode;
}

export const DEFAULT_SETTINGS: Settings = {
  master: 0.8,
  music: 0.6,
  sfx: 0.8,
  reducedMotion: false,
  screenShake: true,
  textSpeed: 'normal',
  touch: 'auto',
};
