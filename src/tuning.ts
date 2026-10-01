// ============================================================================
//  TUNING — every number worth changing by hand, in one place.
// ============================================================================
//
// Change a value here, save, and the dev server reloads the game: the engine,
// the touch controls and the tests all read their numbers from this file.
// Nothing else needs editing. (docs/HANDOFF.md, "Tuning", says what each
// part does.)
//
// Units: the game world is in world px (1280 × 720 is the composed view; an
// actor is about 130–200 px tall) and seconds; the touch controls are in CSS
// px as measured on a phone 390 px wide, scaled for other screens.
//
//   JUMP     how jumping feels: on/off, gravity, coyote time, buffering,
//            squash, dust, sound, the shadow
//   BODIES   each body's walking and jumping (speeds, take-off speed, cut)
//   KEYS     the keyboard bindings
//   GAMEPAD  the gamepad bindings and its stick's dead zone
//   TOUCH    the on-screen controls: sizes, positions, dead zones, haptics

import type { Action } from './engine/systems/InputSystem';

// ---------------------------------------------------------------- jumping

export const JUMP = {
  /** Jumping on or off. Off: Space does nothing and the touch Zıpla button stays hidden. */
  enabled: true,
  /** Gravity on every body (world px/s²) and the fastest fall (world px/s). */
  gravity: 1400,
  maxFall: 920,
  /** A jump pressed this long after walking off an edge still jumps (ms). */
  coyoteMs: 110,
  /** A jump pressed this long before landing jumps as soon as he lands (ms). */
  bufferMs: 130,
  /** Inspecting or Rezonans pressed in the air happens on landing if he lands within this long (ms). */
  actionBufferMs: 260,
  /**
   * Squash and stretch (1 = none). Take-off: the body snaps down to
   * `takeoffSquash` and springs up with `takeoffKick`. Landing: it gives by
   * `landSquash` + `landSquashHard` × how hard the landing was.
   */
  takeoffSquash: 0.86,
  takeoffKick: 6,
  landSquash: 0.06,
  landSquashHard: 0.14,
  /** Puffs of dust at take-off and on landing (landing adds more for harder falls). */
  takeoffDust: 4,
  landDust: 6,
  /** Sound volumes (0..1) of the take-off hop and the landing thud. */
  hopVolume: 0.8,
  landVolume: 0.75,
  /** His shadow on the floor shrinks to `shadowMin` of its size and fades out by this height (world px). */
  shadowFade: 320,
  shadowMin: 0.55,
} as const;

// ---------------------------------------------------------------- bodies

/** How a body walks and jumps (world px and seconds). */
export interface MoveTuning {
  /** Top walking speed. */
  speed: number;
  /** Speeding up and slowing down on the ground. */
  accel: number;
  decel: number;
  /** Steering in the air. */
  airAccel: number;
  airDecel: number;
  /** Take-off speed (0: this body cannot jump). Apex height = jumpVel² / (2 × gravity). */
  jumpVel: number;
  /** Letting go of jump early keeps this share of the rising speed (lower: shorter hops). */
  jumpCut: number;
  /** Pitch of the hop sound (1 = as recorded; lower is heavier). */
  hopPitch: number;
}

/**
 * Every body Gorti plays. `root` is his own body (the child, the youth and
 * the warrior: the life stage follows the room), `human` the Sivaslı amca
 * (Moon head, Sun head or bald), then the inner forms.
 */
export const BODIES = {
  root: { speed: 235, accel: 1900, decel: 2300, airAccel: 1350, airDecel: 900, jumpVel: 640, jumpCut: 0.45, hopPitch: 1.12 }, // apex ≈ 146 px
  human: { speed: 178, accel: 1150, decel: 1700, airAccel: 800, airDecel: 600, jumpVel: 530, jumpCut: 0.5, hopPitch: 0.86 }, // apex ≈ 100 px
  coward: { speed: 150, accel: 1000, decel: 1500, airAccel: 700, airDecel: 600, jumpVel: 540, jumpCut: 0.5, hopPitch: 1.2 }, // apex ≈ 104 px
  mech: { speed: 190, accel: 3600, decel: 5200, airAccel: 1200, airDecel: 1200, jumpVel: 560, jumpCut: 0.5, hopPitch: 0.72 }, // apex ≈ 112 px
  suit: { speed: 88, accel: 500, decel: 900, airAccel: 300, airDecel: 300, jumpVel: 0, jumpCut: 1, hopPitch: 1 }, // the suit cannot jump
} as const satisfies Record<string, MoveTuning>;

// ---------------------------------------------------------------- keyboard

/**
 * Keys by their physical place (KeyboardEvent.code). A key may do several
 * things: the arrows also sing the whale notes in a song.
 */
export const KEYS: Readonly<Record<string, readonly Action[]>> = {
  ArrowLeft: ['left', 'note1'],
  ArrowRight: ['right', 'note3'],
  ArrowDown: ['down', 'note2'],
  ArrowUp: ['up'],
  KeyA: ['left', 'note1'],
  KeyD: ['right', 'note3'],
  KeyS: ['down', 'note2'],
  KeyW: ['up'],
  Space: ['jump'],
  KeyE: ['action'],
  KeyQ: ['focus'],
  KeyR: ['form'],
  KeyF: ['song'],
  Escape: ['pause'],
  KeyM: ['journal'],
  Enter: ['confirm'],
  NumpadEnter: ['confirm'],
};

/**
 * Letter keys by the character they type, checked first, so the on-screen
 * names (A, D, E, Q…) stay true on other keyboard layouts.
 */
export const LETTERS: Readonly<Record<string, readonly Action[]>> = {
  a: ['left', 'note1'],
  d: ['right', 'note3'],
  s: ['down', 'note2'],
  w: ['up'],
  e: ['action'],
  q: ['focus'],
  r: ['form'],
  f: ['song'],
  m: ['journal'],
};

// ---------------------------------------------------------------- gamepad

/**
 * A gamepad in the browser's standard layout. Buttons by index: 0 south (A
 * / ✕), 1 east (B / ○), 2 west (X / □), 3 north (Y / △), 4–5 shoulders,
 * 8 back/select, 9 start, 12–15 the d-pad (up, down, left, right).
 */
export const GAMEPAD = {
  buttons: {
    0: ['jump'],
    1: ['action'],
    2: ['action'],
    3: ['form'],
    5: ['focus'],
    8: ['journal'],
    9: ['pause'],
    12: ['up'],
    13: ['down', 'note2'],
    14: ['left', 'note1'],
    15: ['right', 'note3'],
  } as Readonly<Record<number, readonly Action[]>>,
  /** The left stick walks; below this tilt (0..1) it does nothing. */
  deadZone: 0.35,
  /** Tilting up or down walks in depth past this tilt (a little more than walking needs). */
  depthZone: 0.5,
} as const;

// ---------------------------------------------------------------- touch

/**
 * The on-screen controls (touch devices only). Sizes are CSS px on a phone
 * 390 px wide; other screens scale them by their short side over `ref`,
 * kept between `minScale` and `maxScale`. Every target stays at least 44 px.
 *
 * Left thumb: the walking stick (a round paper dial with a knob). Right
 * thumb: the jump button, the action button (Rezonans / İncele) on an arc
 * beside it, and the contextual chips (Biçim, Şarkı, Nefes) further along
 * the arc. `hand: 'left'` (or the setting) mirrors it all.
 */
export const TOUCH = {
  ref: 390,
  minScale: 0.82,
  maxScale: 1.3,
  /** Sideways (landscape) everything is this much smaller: the controls lie over the picture. */
  landscape: 0.9,
  /** The smallest a target may get (CSS px). */
  minTarget: 44,

  /** The walking stick. */
  stick: {
    /** Diameter of the dial, and of the knob as a share of it. */
    size: 138,
    knob: 0.44,
    /** How far the knob may travel from the middle, as a share of the dial's radius. */
    travel: 0.5,
    /** The touch area reaches this far beyond the dial (share of its radius): a forgiving thumb. */
    slop: 0.18,
    /**
     * Dead zones, as shares of the dial's radius from its middle: a thumb
     * walks left or right past `walkOn` (and stops again under `walkOff`),
     * and in depth past `depthOn` (under `depthOff` it stops). Depth needs
     * a firmer push, so walking along never drifts into the room by mistake.
     */
    walkOn: 0.26,
    walkOff: 0.18,
    depthOn: 0.5,
    depthOff: 0.38,
  },

  /** Button diameters. */
  jump: 96,
  action: 76,
  chip: 58,

  /** Room left at the screen's edges (on top of the safe areas). */
  side: 18,
  bottom: 20,
  /** Upright, the controls keep this far below the game view's bottom (room for the subtitles). */
  clearBelowView: 128,

  /**
   * The right thumb's arc around the jump button: gap between buttons, and
   * angles in degrees (0 = toward the screen's middle, 90 = straight up).
   * The action button comes first, then the chips in order: Biçim, Şarkı, Nefes.
   */
  gap: 10,
  arc: {
    upright: { action: 52, chips: [112, 152, 186] },
    sideways: { action: 36, chips: [98, 140, 182] },
  },

  /** Light haptic ticks (ms; 0 = off), never more often than `minGapMs`. Off with reduced motion. */
  haptics: { press: 8, turn: 5, minGapMs: 70 },

  /** Which thumb holds the stick by default ('right' hand: stick on the left). The settings can mirror it. */
  hand: 'right' as 'right' | 'left',
};
