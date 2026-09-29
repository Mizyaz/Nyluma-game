import type { Articulation } from './types';

/**
 * Something that plays notes into the audio graph: the piano, a string
 * section, or any instrument added later. Times are audio-context seconds.
 */
export interface Instrument {
  /** Everything the instrument plays passes through here. */
  readonly output: AudioNode;
  /** Notes played so far (for tests and diagnostics). */
  readonly struck: number;
  /**
   * Plays `midi` from `t` until `off` at velocity 0..1. Instruments that
   * know articulations use `art`; others ignore it.
   */
  note(t: number, midi: number, vel: number, off: number, art?: Articulation): void;
  /** Disconnects the instrument once its sound has faded. */
  dispose(): void;
}
