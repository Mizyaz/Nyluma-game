import type { WallDoorArt } from './art/doors/wallArt';
import { paperDoor } from './art/doors/paperDoor';
import { rootDoor } from './art/doors/rootDoor';
import { treeDoor } from './art/doors/treeDoor';
import { moonGate } from './art/doors/moonGate';
import { sunDoor } from './art/doors/sunDoor';
import { formDoor } from './art/doors/formDoor';
import { moonDoor, stoneGate } from './art/doors/crystalGate';
import { blockDoor } from './art/doors/blockDoor';
import { hedgeArch } from './art/doors/hedgeArch';
import { hillDoor } from './art/doors/hillDoor';
import { officeDoor } from './art/doors/officeDoor';

// Every way on gets a doorway true to its room, cut into a wall of the
// paper box (src/paper/walls.ts draws the walls, src/content/doors.ts runs
// the doors). A way out of a room is cut into the room's right side wall
// (every exit is at the room's right end); a gate in the middle of a room
// stands in a wall across the room at the gate's x. A door only dresses an
// exit or a gate: the exit's box, its condition and where it leads stay in
// the room's file; the door reads the condition to know whether it stands
// open.

/** What keeps a door shut: an exit's condition, a gate (a solid) that stands until its condition, a condition of its own (a script opens it), or nothing. */
export type Opener = { exit: string } | { solid: string } | { when: string } | 'always';

export interface DoorSpec {
  /** Its name (for the probe and the tests). */
  id: string;
  art: () => WallDoorArt;
  /** The wall it is cut into: the room's right side wall (a way out), or a wall standing across the room (a gate). */
  wall: 'side' | 'cross';
  /** A wall across the room: where it stands (the middle of the gate it stands for). */
  x?: number;
  open: Opener;
  /** How near Gorti counts (world px from the wall): wide awake within `near`, asleep beyond `far`. */
  near?: number;
  far?: number;
  /** The solids the door stands for (a gate, the stone over it): their bodies stay (a shut gate keeps the way shut), their own plain drawings are not shown. */
  hides?: readonly string[];
}

/** The doors of each room. */
export const DOORS: Readonly<Record<string, readonly DoorSpec[]>> = {
  r01: [{ id: 'r01.tunnel', art: paperDoor, wall: 'side', open: { exit: 'tunnel' } }],
  r02: [{ id: 'r02.mouth', art: rootDoor, wall: 'side', open: { solid: 'roots' } }],
  r04: [{ id: 'r04.tree', art: treeDoor, wall: 'side', open: { exit: 'east' } }],
  r05: [
    { id: 'r05.stones', art: stoneGate, wall: 'cross', x: 2525, open: { solid: 'gate' }, hides: ['gate', 'lintel'] },
    { id: 'r05.moon', art: moonGate, wall: 'side', open: { exit: 'east' } },
  ],
  r08: [{ id: 'r08.stage', art: sunDoor, wall: 'side', open: { exit: 'east' } }],
  b01: [
    { id: 'b01.form', art: formDoor, wall: 'cross', x: 1500, open: { solid: 'gate:kapi' }, hides: ['gate:kapi'] },
    { id: 'b01.hedge', art: hedgeArch, wall: 'side', open: { exit: 'exit:b02' } },
  ],
  b02: [
    { id: 'b02.moon', art: moonDoor, wall: 'cross', x: 1450, open: { solid: 'gate:gece' }, hides: ['gate:gece'] },
    { id: 'b02.hill', art: hillDoor, wall: 'side', open: { exit: 'exit:b03' } },
  ],
  b03: [{ id: 'b03.blocks', art: blockDoor, wall: 'side', open: { exit: 'exit:b04' } }],
  // The script opens it as Gorti comes (it sets r12.door).
  r12: [{ id: 'r12.office', art: officeDoor, wall: 'cross', x: 1610, open: { when: 'r12.door' } }],
};
