import type { RoomId } from '../../engine/state/types';
import { MEMORY_TEXT } from '../text/text';

// Eight optional illustrated memory fragments (≤ 60 words each). They enrich
// remembered lives, animals and places without explaining the mysteries.
// Their titles and texts are in src/content/text/memories.json.

const T = MEMORY_TEXT.found;

export interface MemoryDef {
  id: string;
  room: RoomId;
  title: string;
  text: string;
  /** Illustration key in art/memoryArt.ts */
  art: string;
}

export const MEMORIES: MemoryDef[] = [
  {
    id: 'm1',
    room: 'r02',
    title: T.m1!.title,
    text: T.m1!.text,
    art: 'well',
  },
  {
    id: 'm2',
    room: 'r03',
    title: T.m2!.title,
    text: T.m2!.text,
    art: 'toywhale',
  },
  {
    id: 'm3',
    room: 'r04',
    title: T.m3!.title,
    text: T.m3!.text,
    art: 'raccoon',
  },
  {
    id: 'm4',
    room: 'r05',
    title: T.m4!.title,
    text: T.m4!.text,
    art: 'tea',
  },
  {
    id: 'm5',
    room: 'r06',
    title: T.m5!.title,
    text: T.m5!.text,
    art: 'whales',
  },
  {
    id: 'm6',
    room: 'r07',
    title: T.m6!.title,
    text: T.m6!.text,
    art: 'ice',
  },
  {
    id: 'm7',
    room: 'r09',
    title: T.m7!.title,
    text: T.m7!.text,
    art: 'nest',
  },
  {
    id: 'm8',
    room: 'r11',
    title: T.m8!.title,
    text: T.m8!.text,
    art: 'door',
  },
];

export const MEMORY_IDS: readonly string[] = MEMORIES.map((m) => m.id);

export function memoryDef(id: string): MemoryDef | undefined {
  return MEMORIES.find((m) => m.id === id);
}
