// Logical composition space.
export const VIEW_W = 1280;
export const VIEW_H = 720;

/** Jumping is off: the story rooms are walked on one floor; the jump key does nothing and the touch Zıpla button stays hidden. */
export const JUMPING = false;

// Movement envelope (world units / seconds). Tuned by playtesting; every
// compulsory jump in the rooms stays well inside these numbers.
export const GRAVITY = 1400;
export const MAX_FALL = 920;

export interface MoveTuning {
  speed: number;
  accel: number;
  decel: number;
  airAccel: number;
  airDecel: number;
  jumpVel: number;
  jumpCut: number;
}

export const ROOT_MOVE: MoveTuning = {
  speed: 235,
  accel: 1900,
  decel: 2300,
  airAccel: 1350,
  airDecel: 900,
  jumpVel: 640, // apex ≈ 146 px
  jumpCut: 0.45,
};

export const HUMAN_MOVE: MoveTuning = {
  speed: 178,
  accel: 1150,
  decel: 1700,
  airAccel: 800,
  airDecel: 600,
  jumpVel: 530, // apex ≈ 100 px
  jumpCut: 0.5,
};

export const COWARD_MOVE: MoveTuning = {
  speed: 150,
  accel: 1000,
  decel: 1500,
  airAccel: 700,
  airDecel: 600,
  jumpVel: 540,
  jumpCut: 0.5,
};

export const MECH_MOVE: MoveTuning = {
  speed: 190,
  accel: 3600, // brief starts, precise stops
  decel: 5200,
  airAccel: 1200,
  airDecel: 1200,
  jumpVel: 560,
  jumpCut: 0.5,
};

export const SUIT_MOVE: MoveTuning = {
  speed: 88,
  accel: 500,
  decel: 900,
  airAccel: 300,
  airDecel: 300,
  jumpVel: 0,
  jumpCut: 1,
};

export const COYOTE_MS = 110;
export const JUMP_BUFFER_MS = 130;

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
