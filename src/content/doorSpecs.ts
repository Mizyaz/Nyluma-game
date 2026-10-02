import type { DoorArt } from '../render/2d/fx/doorway';
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
import { rootArch } from './art/doors/rootArch';
import { officeDoor } from './art/doors/officeDoor';

// Every way on gets a doorway true to its room (src/render/2d/fx/doorway.ts
// draws and moves them). A door only dresses an exit or a gate: the exit's
// box, its condition and where it leads stay in the room's file; the door
// reads the condition to know whether it stands open.

/** What keeps a door shut: an exit's condition, a gate (a solid) that stands until its condition, a condition of its own (a script opens it), or nothing. */
export type Opener = { exit: string } | { solid: string } | { when: string } | 'always';

export interface DoorSpec {
  /** Its name (for the probe and the tests). */
  id: string;
  art: () => DoorArt;
  /** The foot's x, and the frame's depth (default just behind the actors' plane). */
  x: number;
  z?: number;
  open: Opener;
  /** How near Gorti counts (world px). */
  near?: number;
  far?: number;
  /** A gate the door stands for: its body stays (and keeps the way shut), its own plain drawing is not shown. */
  hides?: string;
}

/** The doors of each room. */
export const DOORS: Readonly<Record<string, readonly DoorSpec[]>> = {
  r01: [
    { id: 'r01.tunnel', art: paperDoor, x: 2085, open: { exit: 'tunnel' } },
    // The root gate the way on runs through, and the tunnel it opens on (it never shuts).
    { id: 'r01.roots', art: rootArch, x: 1735, z: 0, open: 'always' },
  ],
  r02: [{ id: 'r02.mouth', art: rootDoor, x: 1532, open: { solid: 'roots' } }],
  r04: [{ id: 'r04.tree', art: treeDoor, x: 3392, open: { exit: 'east' } }],
  r05: [
    { id: 'r05.stones', art: stoneGate, x: 2525, z: 0, open: { solid: 'gate' }, hides: 'gate' },
    { id: 'r05.moon', art: moonGate, x: 3842, open: { exit: 'east' } },
  ],
  r08: [{ id: 'r08.stage', art: sunDoor, x: 1188, open: { exit: 'east' } }],
  b01: [
    { id: 'b01.form', art: formDoor, x: 1500, z: 0, open: { solid: 'gate:kapi' }, hides: 'gate:kapi' },
    { id: 'b01.hedge', art: hedgeArch, x: 2516, open: { exit: 'exit:b02' } },
  ],
  b02: [
    { id: 'b02.moon', art: moonDoor, x: 1450, z: 0, open: { solid: 'gate:gece' }, hides: 'gate:gece' },
    { id: 'b02.hill', art: hillDoor, x: 2312, open: { exit: 'exit:b03' } },
  ],
  b03: [{ id: 'b03.blocks', art: blockDoor, x: 1822, open: { exit: 'exit:b04' } }],
  // The script opens it as Gorti comes (it sets r12.door).
  r12: [{ id: 'r12.office', art: officeDoor, x: 1610, z: 0, open: { when: 'r12.door' } }],
};
