import { CHAPTER_TITLES, normalizeProgress, startProgressAt } from '../../engine/state/GameState';
import type { Progress } from '../../engine/state/types';
import { ROOM_IDS, type RoomId } from '../../engine/state/types';
import { ROOMS } from './rooms';
import type { RoomDef } from './roomTypes';

/**
 * While the game is being shaped, everything is open from the start: every
 * chapter, every memory, and a list of all scenes to jump into (Bölümler →
 * Tüm sahneler). Set to false to make them unlock by playing again.
 */
export const OPEN_ALL = true;

/** A place in the story to start from: a room's checkpoint. */
export interface SceneEntry {
  id: string;
  chapter: number;
  room: RoomId;
  checkpoint: string;
  /** "r05 · Hatırlanan Bir Hayatın Ağırlığı — Tepe (Ulu Ay)" */
  label: string;
  flags?: readonly string[];
  form?: string;
}

/** Readable names for the checkpoints' last word. */
const CHECKPOINT_NAMES: Record<string, string> = {
  start: 'Başlangıç',
  door: 'Kapı',
  node: 'Düğüm',
  climb: 'Tırmanış',
  upper: 'Üst kat',
  top: 'Tepe',
  pool: 'Havuz',
  focus: 'Odak',
  tree: 'Ağaç (Ay ve Güneş)',
  canopy: 'Ağacın tacı',
  after: 'Sonrası',
  elevated: 'Yükselti',
  gate: 'Geçit',
  hill: 'Tepe (Ulu Ay)',
  knots: 'Düğümler',
  k1: 'Düğüm 1',
  k2: 'Düğüm 2',
  horse: 'Mor At',
  mid1: 'Yolculuk 1',
  mid2: 'Yolculuk 2',
  end: 'Son',
  p2: 'İkinci evre',
  p3: 'Üçüncü evre',
  mid: 'Orta',
  s1: 'Sahne 1',
  s2: 'Sahne 2',
  m1: 'Mekanizma 1',
  m2: 'Mekanizma 2',
  room: 'Oda',
};

/** Story facts a checkpoint needs so its room does not replay what came before. */
const SETUP: Record<string, { flags?: readonly string[]; form?: string }> = {
  // On the whale spiral the tree has bloomed (the spiral is its bloom).
  r03_canopy: { flags: ['r03.moon', 'r03.sun', 'r03.star', 'r03.bloom'] },
  r06_knots: { flags: ['r06.shout'], form: 'root' },
  r12_room: { flags: ['r12.intercut', 'r12.door'] },
};

/** Every checkpoint of every room, in story order. */
export const SCENES: readonly SceneEntry[] = ROOM_IDS.flatMap((room) => {
  const def = ROOMS[room] as RoomDef;
  return def.checkpoints.map((c) => {
    const word = c.id.slice(room.length + 1);
    return {
      id: c.id,
      chapter: def.chapter,
      room,
      checkpoint: c.id,
      label: `${room} · ${def.title} — ${CHECKPOINT_NAMES[word] ?? word}`,
      ...SETUP[c.id],
    };
  });
});

export function chapterTitle(chapter: number): string {
  return CHAPTER_TITLES[chapter] ?? '';
}

/** The progress that starts a scene. */
export function sceneProgress(s: SceneEntry): Progress {
  const base = startProgressAt(s.room);
  return normalizeProgress({ ...base, checkpoint: s.checkpoint, flags: [...(s.flags ?? [])], form: s.form ?? base.form }) ?? base;
}
