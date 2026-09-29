import type { RoomDef } from '../roomTypes';

// Chapter V — the empty table.
export const R12: RoomDef = {
  id: 'r12',
  chapter: 5,
  title: 'Boş Masa',
  width: 2700,
  height: 800,
  theme: 'office',
  music: 'final',
  player: 'suit',
  checkpoints: [
    { id: 'r12_start', x: 150, y: 680, facing: 1, silent: true },
    { id: 'r12_room', x: 1760, y: 680, silent: true },
  ],
  solids: [
    { x: 0, y: 680, w: 2700, h: 120, style: 'office' },
  ],
  // Reading the papers is up to the player; the last page turns by itself
  // at the end of the table.
  interacts: [
    { id: 'portraits', x: 1990, y: 680, r: 70, prompt: 'Belgeyi incele', when: 'r12.door', unless: 'r12.sold' },
    { id: 'russian', x: 2150, y: 680, r: 70, prompt: 'Belgeyi incele', when: 'r12.door', unless: 'r12.sold' },
    { id: 'clause', x: 2310, y: 680, r: 70, prompt: 'Belgeyi incele', when: 'r12.door', unless: 'r12.sold' },
  ],
  exits: [],
  props: [
    { key: 'prop.officedoor', x: 1610, y: 682, depth: -8, unless: 'r12.door' },
    { key: 'prop.officedoor.open', x: 1610, y: 682, depth: -8, when: 'r12.door' },
    { key: 'prop.bench', x: 600, y: 682, depth: -10 },
    { key: 'prop.coatrack', x: 1100, y: 682, depth: -10 },
    { key: 'prop.table', x: 2150, y: 682, depth: 5 },
  ],
};
