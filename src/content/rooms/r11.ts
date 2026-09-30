import type { RoomDef } from '../data/roomTypes';

// Chapter IV — key and lock: the mechanical form opens the way by itself.
export const R11: RoomDef = {
  id: 'r11',
  chapter: 4,
  title: 'Anahtar ve Kilit',
  width: 2800,
  height: 1000,
  theme: 'mech',
  music: 'inner',
  player: 'mech',
  checkpoints: [
    { id: 'r11_start', x: 150, y: 820, facing: 1, silent: true },
    { id: 'r11_m1', x: 1150, y: 820 },
    { id: 'r11_m2', x: 2000, y: 560 },
  ],
  solids: [
    { x: 0, y: 820, w: 1900, h: 180, style: 'metal' },
    { x: 1900, y: 560, w: 900, h: 440, style: 'metal' },
    { id: 'wall1', x: 1000, y: 380, w: 70, h: 440, style: 'metal', unless: 'r11.m1' },
    { x: 1000, y: 0, w: 70, h: 380, style: 'metal' },
    { x: 420, y: 740, w: 100, h: 80, style: 'metal' },
    { x: 560, y: 640, w: 160, h: 24, style: 'metal', oneWay: true },
    { id: 'step1', x: 1740, y: 740, w: 100, h: 24, style: 'metal', oneWay: true, grow: true, when: 'r11.m2' },
    { id: 'step2', x: 1810, y: 650, w: 80, h: 24, style: 'metal', oneWay: true, grow: true, when: 'r11.m2' },
  ],
  memories: [{ id: 'm8', x: 645, y: 640 }],
  exits: [],
  props: [
    { key: 'prop.console', x: 900, y: 822, depth: -5 },
    { key: 'prop.gear', x: 300, y: 400, depth: -60, oy: 0.5 },
    { key: 'prop.gear', x: 1500, y: 300, depth: -60, oy: 0.5, scale: 1.4 },
    { key: 'prop.gear', x: 2300, y: 250, depth: -60, oy: 0.5, scale: 0.8 },
  ],
};
