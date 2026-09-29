export const ROOM_IDS = [
  'r01', 'r02', 'r03', 'r04', 'r05', 'r06',
  'r07', 'r08', 'r09', 'r10', 'r11', 'r12',
] as const;
export type RoomId = (typeof ROOM_IDS)[number];

export type FormId = 'root' | 'human';
export type PlayerKind = 'gorti' | 'horse' | 'coward' | 'mech' | 'suit';
export type Ability = 'pulse' | 'reach' | 'song' | 'focus' | 'form';
export const ABILITIES: readonly Ability[] = ['pulse', 'reach', 'song', 'focus', 'form'];
export type Note = 'low' | 'mid' | 'high';
export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';
export type TouchMode = 'auto' | 'on' | 'off';

export function isRoomId(v: unknown): v is RoomId {
  return typeof v === 'string' && (ROOM_IDS as readonly string[]).includes(v);
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
  focusToggle: boolean;
  storyAssist: boolean;
  touch: TouchMode;
}

export const DEFAULT_SETTINGS: Settings = {
  master: 0.8,
  music: 0.6,
  sfx: 0.8,
  reducedMotion: false,
  screenShake: true,
  textSpeed: 'normal',
  focusToggle: false,
  storyAssist: false,
  touch: 'auto',
};
