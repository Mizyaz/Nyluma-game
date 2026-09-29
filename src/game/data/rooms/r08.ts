import type { RoomDef } from '../roomTypes';

// Chapter III — the Sun encounter (single-screen arena).
export const R08: RoomDef = {
  id: 'r08',
  chapter: 3,
  title: 'Güneş',
  width: 1280,
  height: 720,
  theme: 'sun',
  music: 'sun',
  player: 'gorti',
  entryForm: 'human',
  zoom: 1,
  checkpoints: [
    { id: 'r08_start', x: 110, y: 640, facing: 1, silent: true },
    { id: 'r08_p2', x: 640, y: 640, silent: true },
    { id: 'r08_p3', x: 640, y: 640, silent: true },
    { id: 'r08_end', x: 900, y: 640, silent: true },
  ],
  solids: [
    { x: 0, y: 640, w: 1280, h: 80, style: 'moss' },
  ],
  exits: [{ id: 'east', x: 1240, y: 400, w: 40, h: 240, to: 'r09', when: 'r08.done' }],
  props: [],
};
