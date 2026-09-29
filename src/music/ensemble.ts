import type { Instrument } from './instrument';
import { Piano } from './piano';
import { Room } from './room';
import { HIGH_STRINGS, LOW_STRINGS, Strings } from './strings';
import type { Bar, InstrumentId } from './types';

/** Makes an instrument; `room` hands out the ensemble's shared reverb. */
type Maker = (ctx: BaseAudioContext, room: () => Room) => Instrument;

/** The instruments generated music can call for. */
const MAKERS: Record<InstrumentId, Maker> = {
  // The piano keeps its own room (its sound is tuned with it).
  piano: (ctx) => new Piano(ctx),
  'low-strings': (ctx, room) => new Strings(ctx, LOW_STRINGS, room()),
  'high-strings': (ctx, room) => new Strings(ctx, HIGH_STRINGS, room()),
};

/**
 * The instruments one piece plays on. Each is made the first time a note
 * asks for it, so a piano piece builds only a piano; all of them play into
 * one output, and string sections share one room.
 */
export class Ensemble {
  readonly output: GainNode;
  private readonly parts = new Map<InstrumentId, Instrument>();
  private room: Room | null = null;

  constructor(private readonly ctx: BaseAudioContext) {
    this.output = ctx.createGain();
  }

  /**
   * Schedules a bar that starts at context time `at`. Notes starting at or
   * after `until` are left out.
   */
  play(bar: Bar, at: number, until = Infinity): void {
    for (const e of bar.notes) {
      if (at + e.t >= until) continue;
      this.part(e.inst ?? 'piano').note(at + e.t, e.midi, e.vel, at + e.off, e.art);
    }
  }

  /** Notes played so far by all instruments. */
  get struck(): number {
    let n = 0;
    for (const p of this.parts.values()) n += p.struck;
    return n;
  }

  /** Disconnects everything once the sound has faded. */
  dispose(): void {
    for (const p of this.parts.values()) p.dispose();
    this.room?.dispose();
    this.output.disconnect();
  }

  private part(id: InstrumentId): Instrument {
    let p = this.parts.get(id);
    if (!p) {
      p = MAKERS[id](this.ctx, () => this.sharedRoom());
      p.output.connect(this.output);
      this.parts.set(id, p);
    }
    return p;
  }

  private sharedRoom(): Room {
    if (!this.room) {
      this.room = new Room(this.ctx, 1);
      this.room.output.connect(this.output);
    }
    return this.room;
  }
}
