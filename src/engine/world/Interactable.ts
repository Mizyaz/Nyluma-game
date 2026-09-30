import type { WorldScene } from '../scenes/WorldScene';

/**
 * Something in a room that Gorti can inspect with the action button and
 * that handles the inspection itself (paintings, for example). Room data
 * interacts and script interacts keep working as before; features are an
 * addition for self-contained objects.
 */
export interface Interactable {
  readonly id: string;
  /** Feet-level point where the prompt shows, and its reach. */
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly prompt: string;
  /** What Gorti looks at when he passes by (defaults to the prompt point). */
  readonly lookAt?: { x: number; y: number };
  isActive(): boolean;
  interact(world: WorldScene): void;
  destroy(): void;
}
