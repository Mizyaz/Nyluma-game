import * as Phaser from 'phaser';
import type { WorldScene } from '../engine/scenes/WorldScene';
import type { RoomScript } from './scripts/types';
import type { SolidRt } from '../engine/world/RoomRuntime';
import type { PartArt } from '../render/2d/rig/rigTypes';
import { Press } from '../paper/press';
import { Doorway, doorJobs, type DoorArt } from '../render/2d/fx/doorway';
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

// Every way on gets a doorway true to its room (src/render/2d/fx/doorway.ts
// draws and moves them). A door only dresses an exit or a gate: the exit's
// box, its condition and where it leads stay in the room's file; the door
// reads the condition to know whether it stands open.

/** What keeps a door shut: an exit's condition, a gate (a solid) that stands until its condition, or nothing. */
type Opener = { exit: string } | { solid: string } | 'always';

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
};

/** Every door art is drawn once (it is the same every time). */
const arts = new Map<() => DoorArt, DoorArt>();
function artOf(make: () => DoorArt): DoorArt {
  let a = arts.get(make);
  if (!a) {
    a = make();
    arts.set(make, a);
  }
  return a;
}

/** A room's doors: printed when it starts, then moved every frame after the eye is set. */
export class RoomDoors {
  private press: Press | null = null;
  private readonly doors: { spec: DoorSpec; door: Doorway }[] = [];
  /** The gates the doors stand for (their plain drawings are not shown). */
  private hidden: SolidRt[] = [];
  private alive = true;
  private last = 0;

  constructor(private readonly w: WorldScene) {}

  setup(): void {
    const specs = DOORS[this.w.def.id] ?? [];
    if (specs.length === 0) return;
    const w = this.w;
    const paper = w.paper;
    const made = specs.map((spec) => ({ spec, art: artOf(spec.art), z: spec.z ?? -30 }));
    this.hidden = specs.flatMap((spec) => w.room.solids.filter((s) => spec.hides !== undefined && s.def.id === spec.hides));
    const lookup = new Map<string, PartArt>();
    for (const m of made) for (const p of m.art.parts) lookup.set(p.key, p);
    const press = new Press(w.textures, (k) => lookup.get(k));
    this.press = press;
    const jobs = made.flatMap((m) => doorJobs(paper, m.art, m.z));
    void press.print(jobs).then(() => {
      if (!this.alive) {
        press.destroy();
        return;
      }
      for (const m of made) {
        const door = new Doorway(paper, press, m.art, {
          x: m.spec.x,
          floor: paper.spec.floor,
          z: m.z,
          isOpen: this.opener(m.spec.open),
          near: m.spec.near,
          far: m.spec.far,
        });
        this.doors.push({ spec: m.spec, door });
      }
    });
    this.last = performance.now();
    // After the stage has set the eye for the frame (it listens first).
    w.events.on(Phaser.Scenes.Events.PRE_RENDER, this.frame, this);
  }

  /** Whether the door stands open now. */
  private opener(o: Opener): () => boolean {
    const room = this.w.room;
    if (o === 'always') return () => true;
    if ('exit' in o) {
      const exit = room.exits.find((e) => e.def.id === o.exit);
      return exit ? () => room.isOn(exit.def) : () => true;
    }
    const solid = room.solids.find((s) => s.def.id === o.solid);
    return solid ? () => !room.isOn(solid.def) : () => true;
  }

  private frame(): void {
    const now = performance.now();
    const dt = Math.min(100, now - this.last);
    this.last = now;
    // The gate's body still stands while it is shut; the door shows it.
    for (const solid of this.hidden) for (const img of solid.images) if (img.visible) img.setVisible(false);
    if (this.doors.length === 0) return;
    const w = this.w;
    const x = w.player ? w.player.x : null;
    for (const d of this.doors) d.door.update(dt, x, w.paused);
    w.probeExtra.doors = this.doors.map((d) => ({ id: d.spec.id, ...d.door.state }));
  }

  destroy(): void {
    this.alive = false;
    this.w.events.off(Phaser.Scenes.Events.PRE_RENDER, this.frame, this);
    for (const d of this.doors) d.door.destroy();
    this.doors.length = 0;
    this.press?.destroy();
    this.press = null;
  }
}

/** Adds a room's doors to its script (set up after it, torn down with it). */
export function withDoors(script: RoomScript, w: WorldScene): RoomScript {
  if (!(DOORS[w.def.id]?.length ?? 0)) return script;
  const doors = new RoomDoors(w);
  const setup = script.setup.bind(script);
  const destroy = script.destroy?.bind(script);
  script.setup = () => {
    setup();
    doors.setup();
  };
  script.destroy = () => {
    destroy?.();
    doors.destroy();
  };
  return script;
}
