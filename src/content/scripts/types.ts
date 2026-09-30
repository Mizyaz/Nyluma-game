import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { Note } from '../../engine/state/types';

export interface ExtraInteract {
  id: string;
  x: number;
  y: number;
  r: number;
  prompt: string;
}

/** Per-room behaviour. State must be rebuilt from quest flags in `setup`. */
export interface RoomScript {
  setup(): void;
  onTrigger?(id: string): void;
  /** Return true when handled. */
  onInteract?(id: string): boolean;
  onSong?(nodeId: string): void;
  onSongNote?(nodeId: string, note: Note, demo: boolean): void;
  onFixed?(dt: number): void;
  onUpdate?(dtMs: number, time: number): void;
  onRespawn?(): void;
  onFocusChange?(active: boolean): void;
  /** Called when a resonance pulse fires (for scripted targets). */
  onPulse?(x: number, y: number, r: number): boolean;
  extraInteracts?(): ExtraInteract[];
  /** Whether a resonance pulse is useful right now (prompt display). */
  pulseRelevant?(): boolean;
  /** Whether the room currently wants the focus prompt shown. */
  focusRelevant?(): boolean;
  /** True while the room uses Esc itself (e.g. to leave a console). */
  capturesPause?(): boolean;
  destroy?(): void;
}

export type ScriptFactory = (w: WorldScene) => RoomScript;
