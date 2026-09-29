import { Rng } from './rng';

// The room the instruments play in: a generated impulse response played
// through a convolver. The impulse is computed once per audio context and
// length, then shared by every room made from it.

/**
 * A room's echo as an impulse response: a few early reflections, then a dense
 * tail that decays over `seconds` and darkens as it fades.
 */
export function roomImpulse(c: BaseAudioContext, seconds: number): AudioBuffer {
  const rate = c.sampleRate;
  const len = Math.floor(rate * seconds);
  const b = c.createBuffer(2, len, rate);
  const pre = 0.014;
  for (let ch = 0; ch < 2; ch++) {
    const d = b.getChannelData(ch);
    const rng = new Rng(ch === 0 ? 0x1234 : 0x9876);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / rate - pre;
      if (t < 0) continue;
      const env = Math.exp(-t / 0.42);
      const a = 0.07 + 0.55 * Math.exp(-t / 0.5);
      lp += a * (rng.next() * 2 - 1 - lp);
      d[i] = lp * env;
    }
    for (let r = 0; r < 6; r++) {
      const i = Math.floor((pre + 0.006 + r * 0.011 + rng.next() * 0.006) * rate);
      if (i < len) d[i] = d[i]! + (0.55 - r * 0.07) * (rng.next() < 0.5 ? -1 : 1);
    }
  }
  return b;
}

const impulses = new WeakMap<BaseAudioContext, Map<number, AudioBuffer>>();

/** The impulse for `seconds`, computed once per context. */
function sharedImpulse(c: BaseAudioContext, seconds: number): AudioBuffer {
  let byLength = impulses.get(c);
  if (!byLength) impulses.set(c, (byLength = new Map()));
  let b = byLength.get(seconds);
  if (!b) byLength.set(seconds, (b = roomImpulse(c, seconds)));
  return b;
}

/** Reverb: connect a send to `input`; `output` carries the echo alone. */
export class Room {
  readonly input: ConvolverNode;
  readonly output: GainNode;

  constructor(c: BaseAudioContext, level: number, seconds = 2.6) {
    this.input = c.createConvolver();
    this.input.buffer = sharedImpulse(c, seconds);
    this.output = c.createGain();
    this.output.gain.value = level;
    this.input.connect(this.output);
  }

  dispose(): void {
    this.input.disconnect();
    this.output.disconnect();
  }
}
