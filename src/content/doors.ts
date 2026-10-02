import * as Phaser from 'phaser';
import type { WorldScene } from '../engine/scenes/WorldScene';
import type { RoomScript } from './scripts/types';
import type { SolidRt } from '../engine/world/RoomRuntime';
import type { PartArt } from '../render/2d/rig/rigTypes';
import { Press } from '../paper/press';
import { Doorway, doorJobs, type DoorArt } from '../render/2d/fx/doorway';
import { DOORS, type DoorSpec, type Opener } from './doorSpecs';

// The doorways of the room being played (the registry, what each room's
// doors are and what opens them, is doorSpecs.ts): printed when the room
// starts, then moved every frame after the stage has set the eye.

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
    if ('when' in o) return () => room.isOn({ when: o.when });
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
