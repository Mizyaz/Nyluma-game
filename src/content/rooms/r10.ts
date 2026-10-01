import type { RoomDef } from '../data/roomTypes';

// Chapter IV — the inner dormitory: torch and reversed memories. One floor:
// its two gaps close as the beds slide into bridges (the stations' story)
// before Gorti gets there.
export const R10: RoomDef = {
  id: 'r10',
  chapter: 4,
  title: 'Meşale ve Ters Anılar',
  width: 3200,
  height: 1000,
  theme: 'dorm',
  music: 'inner',
  player: 'coward',
  killY: 1060,
  checkpoints: [
    { id: 'r10_start', x: 150, y: 820, facing: 1, silent: true },
    { id: 'r10_s1', x: 1300, y: 820 },
    { id: 'r10_s2', x: 2200, y: 820 },
  ],
  solids: [
    { x: 0, y: 820, w: 1000, h: 180, style: 'floor' },
    { x: 1200, y: 820, w: 700, h: 180, style: 'floor' },
    { x: 2100, y: 820, w: 1100, h: 180, style: 'floor' },
    { id: 'bridge1', x: 990, y: 820, w: 220, h: 26, style: 'bed', grow: true, when: 'r10.s1' },
    { id: 'bridge2', x: 1890, y: 820, w: 220, h: 26, style: 'bed', grow: true, when: 'r10.s2' },
  ],
  exits: [],
  props: [
    { key: 'prop.dormbed', x: 375, y: 822, depth: -10 },
    { key: 'prop.dormbed', x: 1475, y: 822, depth: -10, flipX: true },
    { key: 'prop.dormbed', x: 2375, y: 822, depth: -10 },
    { key: 'prop.station', x: 760, y: 822, depth: -5 },
    { key: 'prop.station', x: 1650, y: 822, depth: -5 },
    { key: 'prop.station', x: 2500, y: 822, depth: -5 },
    { key: 'prop.clock', x: 1600, y: 300, depth: -60, oy: 0.5, scale: 1.3 },
    { key: 'prop.clock', x: 500, y: 250, depth: -65, oy: 0.5, scale: 0.7 },
    { key: 'prop.clock', x: 2800, y: 280, depth: -65, oy: 0.5, scale: 0.8 },
  ],
};
