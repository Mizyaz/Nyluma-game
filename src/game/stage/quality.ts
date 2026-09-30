// How much picture the device affords, and keeping to it: a tier chosen
// from the GPU at start (or `?q=high|mid|low`), then a governor that lowers
// the render resolution while frames come too slowly, drops to the next
// tier when that is not enough, and slowly climbs back when there is room.

export type TierName = 'high' | 'mid' | 'low';

export interface Tier {
  name: TierName;
  /** Cap on device pixels per CSS pixel. */
  dprCap: number;
  /** Cap on the drawing buffer's pixel count. */
  maxPixels: number;
  /** Key light shadow map size. */
  shadow: number;
  /** Scene multisampling (0 = none). */
  samples: number;
  /** Depth-of-field samples (0 = no focus blur). */
  dof: number;
  /** The stage lamps cast shadows too. */
  spotShadows: boolean;
  /** Frames per second to keep. */
  target: number;
}

export const TIERS: Record<TierName, Tier> = {
  high: { name: 'high', dprCap: 1.5, maxPixels: 2.6e6, shadow: 2048, samples: 4, dof: 32, spotShadows: false, target: 58 },
  mid: { name: 'mid', dprCap: 1.3, maxPixels: 1.25e6, shadow: 1024, samples: 4, dof: 12, spotShadows: false, target: 30 },
  low: { name: 'low', dprCap: 1, maxPixels: 0.7e6, shadow: 1024, samples: 0, dof: 0, spotShadows: false, target: 28 },
};

const WEAK_GPU = /swiftshader|llvmpipe|software|mali-[34]|mali-t[67]|adreno \(tm\) [34]\d\d|powervr sgx|intel\(r\) hd graphics [234]/i;

/** A starting tier from what the device says about itself. */
export function pickTier(gpu: string, touch: boolean, forced: string | null): Tier {
  if (forced === 'high' || forced === 'mid' || forced === 'low') return TIERS[forced];
  if (WEAK_GPU.test(gpu)) return TIERS.low;
  return touch ? TIERS.mid : TIERS.high;
}

export function lower(t: Tier): Tier | null {
  return t.name === 'high' ? TIERS.mid : t.name === 'mid' ? TIERS.low : null;
}

/**
 * Watches the frame rate over windows of ~1.5 s and answers with a new
 * resolution scale, or a request to drop a tier.
 */
export class Governor {
  /** Multiplies the pixel ratio (0.5 … 1). */
  scale = 1;
  private t = 0;
  private frames = 0;
  private good = 0;
  /** Frames per second over the last window. */
  fps = 0;

  constructor(
    public tier: Tier,
    private readonly enabled: boolean,
  ) {}

  /** Feeds one frame's real duration (ms). Returns 'scale' | 'tier' when something should change. */
  sample(ms: number, visible: boolean): 'scale' | 'tier' | null {
    if (!visible || ms > 250) return null;
    this.t += ms;
    this.frames++;
    if (this.t < 1500) return null;
    this.fps = (this.frames * 1000) / this.t;
    this.t = 0;
    this.frames = 0;
    if (!this.enabled) return null;
    const target = this.tier.target;
    if (this.fps < target * 0.88) {
      this.good = 0;
      if (this.scale > 0.56) {
        this.scale = Math.max(0.55, this.scale - 0.12);
        return 'scale';
      }
      const next = lower(this.tier);
      if (next) {
        this.tier = next;
        this.scale = 0.85;
        return 'tier';
      }
      return null;
    }
    if (this.fps > target * 0.97 && this.scale < 1) {
      // Room to spare for a while: a little more resolution.
      if (++this.good >= 4) {
        this.good = 0;
        this.scale = Math.min(1, this.scale + 0.06);
        return 'scale';
      }
    }
    return null;
  }
}
