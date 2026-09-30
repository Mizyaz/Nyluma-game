import { hex, P } from '../palette';
import type { ThemeId } from '../../../content/data/roomTypes';
import { GEM_HUES, nearestGemHue, type GemHue } from './gemArt';

// How the gem tunnel looks behind each room theme (no Phaser here, so the
// table is unit-tested).

export interface WarpLook {
  /** Gems in the whole tunnel (its sprite budget). */
  count: number;
  /** Gems per square frame. */
  perRing?: number;
  /** Gem size multiplier. */
  size?: number;
  /** Opacity of the ribs: painted lines along the sides of each frame, under its gems (0 = none). */
  ribs?: number;
  /** Wide brushed bands instead of thin ribs (full-screen tunnels). */
  brushed?: boolean;
  /**
   * A brief full-screen effect (the transition): in the Canvas renderer it
   * keeps more detail than a background, which runs all the time.
   */
  brief?: boolean;
  alpha: number;
  /** Tube lengths per second (1 = a frame comes from the vanishing point to the viewer in a second). */
  speed: number;
  /** Crystal colours of tinted effects (footstep crystals). */
  colors: number[];
  /** Pastel hues the gems are painted in (default: the ones nearest to `colors`). */
  hues?: readonly GemHue[];
  /** Paper colour behind the full-screen tunnel (the transition's veil). */
  paper?: number;
}

const CRYSTALS = [hex(P.crystalBlue), hex(P.crystalTeal), hex(P.crystalOrange), hex(P.violet)];

/**
 * Background tunnel per theme: stronger underground, fainter outdoors.
 * Four frames of twelve gems; hues repeat to weigh them. `colors` stay the
 * crystal colours the footstep crystals are tinted with.
 */
export function warpLook(theme: ThemeId): WarpLook {
  const base = { count: 48, perRing: 12, size: 1, ribs: 0.9 };
  switch (theme) {
    case 'nursery':
    case 'roots':
    case 'chamber':
      return { ...base, alpha: 0.18, speed: 0.06, colors: CRYSTALS, hues: ['lilac', 'lilac', 'sky', 'mint', 'peach', 'pink', 'sage', 'periwinkle'], paper: 0xf2ecf6 };
    case 'surface':
    case 'hill':
    case 'forest':
      return { ...base, alpha: 0.14, speed: 0.045, colors: [hex(P.crystalBlue), hex(P.violet), hex('#d7b3ff')], hues: ['sky', 'sky', 'periwinkle', 'lilac', 'mint', 'mint', 'pink', 'peach', 'sage'], paper: 0xeef0f8 };
    case 'ride':
      return { ...base, alpha: 0.18, speed: 0.12, colors: [hex(P.crystalOrange), hex('#f3b6c9'), hex(P.crystalTeal)], hues: ['peach', 'peach', 'pink', 'butter', 'mint', 'lilac', 'sky', 'sage'], paper: 0xfbefe9 };
    case 'sun':
      return { ...base, alpha: 0.16, speed: 0.05, colors: [hex(P.crystalOrange), hex('#f0c46a'), hex(P.violet)], hues: ['peach', 'peach', 'butter', 'butter', 'pink', 'lilac', 'sage'], paper: 0xfcf2e4 };
    case 'clearing':
      return { ...base, alpha: 0.14, speed: 0.04, colors: [hex('#c7ccde'), hex(P.crystalTeal)], hues: ['mint', 'mint', 'sky', 'sage', 'periwinkle', 'butter', 'pink'], paper: 0xeef5f1 };
    case 'dorm':
      return { ...base, alpha: 0.17, speed: 0.05, colors: [hex(P.crystalOrange), hex(P.crystalTeal), hex('#f0b458')], hues: ['peach', 'peach', 'butter', 'mint', 'pink', 'sage', 'lilac'], paper: 0xfaf0e6 };
    case 'mech':
      return { ...base, alpha: 0.17, speed: 0.06, colors: [hex('#9aa3b8'), hex(P.crystalBlue), hex(P.violet)], hues: ['sky', 'sky', 'periwinkle', 'lilac', 'mint', 'pink', 'sage'], paper: 0xeceff6 };
    case 'office':
      return { ...base, count: 36, alpha: 0.1, speed: 0.03, colors: [hex('#c9c1b0'), hex(P.violet)], hues: ['lilac', 'butter', 'sage', 'periwinkle', 'peach', 'mint'], paper: 0xf3efe8 };
    default:
      return { ...base, alpha: 0.16, speed: 0.05, colors: CRYSTALS };
  }
}

/** The pastel hues a look paints its gems in: its own, else the ones nearest to its colours. */
export function huesOf(look: WarpLook): readonly GemHue[] {
  if (look.hues?.length) return look.hues;
  const near = [...new Set(look.colors.map(nearestGemHue))];
  return near.length > 1 ? near : GEM_HUES;
}
