import { BODIES, JUMP, type MoveTuning } from '../tuning';

// Logical composition space.
export const VIEW_W = 1280;
export const VIEW_H = 720;

// Jumping and each body's movement are tuned in src/tuning.ts (JUMP, BODIES).
export type { MoveTuning };
/** Jumping is on: Space, the touch Zıpla button and a gamepad's south button jump (no room needs a jump). */
export const JUMPING: boolean = JUMP.enabled;
export const GRAVITY = JUMP.gravity;
export const MAX_FALL = JUMP.maxFall;
export const ROOT_MOVE: MoveTuning = BODIES.root;
export const HUMAN_MOVE: MoveTuning = BODIES.human;
export const COWARD_MOVE: MoveTuning = BODIES.coward;
export const MECH_MOVE: MoveTuning = BODIES.mech;
export const SUIT_MOVE: MoveTuning = BODIES.suit;
export const COYOTE_MS = JUMP.coyoteMs;
export const JUMP_BUFFER_MS = JUMP.bufferMs;

// Shared navigation hull (all Gorti forms). Smaller than the drawn silhouette.
export const HULL_W = 34;
export const HULL_H = 84;

export const REACH_RANGE = 240;
export const PULSE_RADIUS = 115;
export const PULSE_WINDUP_MS = 120;

export const FOCUS_MAX_S = 3;
export const FOCUS_RECHARGE_DELAY_S = 0.3;
export const FOCUS_RECHARGE_RATE = 1.1; // seconds of focus regained per second
export const LATENT_GRACE_S = 0.4;

export const HINT_DELAY_MS = 40000;

// Depth bands.
export const DEPTH = {
  sky: -1000,
  far: -900,
  mid: -800,
  near: -700,
  backProps: -100,
  terrain: 0,
  props: 10,
  interact: 20,
  actors: 30,
  player: 40,
  fx: 50,
  front: 60,
  fg: 80,
  overlay: 100,
} as const;

/** Default camera zoom: Gorti fills more of the screen. */
export const CAMERA_ZOOM = 1.5;
