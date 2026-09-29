import type { Angles } from '../art/fk';

// Procedural pose library for the humanoid cutout rigs. A pose is a set of
// local joint angles (radians) plus joint offsets. Limbs hang down at 0; a
// forward leg/arm swing is negative. Upright parts (torso, head) lean
// forward with positive angles.

export type HumanoidStyle = 'root' | 'human' | 'coward' | 'mech' | 'suit';

export interface PoseOut {
  angles: Angles;
  offsets: Record<string, { x: number; y: number }>;
  /** Whole-rig offset and squash/stretch. */
  x?: number;
  y?: number;
  sx?: number;
  sy?: number;
}

export interface PoseParams {
  /** Walk phase in radians (advances with distance travelled). */
  phase?: number;
  /** 0..1 speed relative to the form's run speed. */
  speed?: number;
  /** Vertical velocity for air poses. */
  vy?: number;
  /** 0..1 progress for one-shot poses. */
  k?: number;
}

const S = Math.sin;
const C = Math.cos;

function base(): PoseOut {
  return { angles: {}, offsets: {} };
}

export function styleOf(rigId: string): HumanoidStyle {
  if (rigId.includes('human')) return 'human';
  if (rigId.includes('suit')) return 'suit';
  if (rigId.includes('coward')) return 'coward';
  if (rigId.includes('mech')) return 'mech';
  return 'root';
}

interface StyleK {
  stride: number;
  knee: number;
  arm: number;
  bob: number;
  lean: number;
  kneeBase: number;
  torsoBase: number;
  headBase: number;
}

const STYLE: Record<HumanoidStyle, StyleK> = {
  root: { stride: 0.62, knee: 1.05, arm: 0.55, bob: 3, lean: 0.12, kneeBase: 0.05, torsoBase: 0.02, headBase: 0 },
  human: { stride: 0.42, knee: 0.8, arm: 0.35, bob: 1.6, lean: 0.06, kneeBase: 0.08, torsoBase: -0.03, headBase: 0.05 },
  coward: { stride: 0.38, knee: 0.8, arm: 0.1, bob: 1.5, lean: 0.1, kneeBase: 0.55, torsoBase: 0.16, headBase: 0.18 },
  mech: { stride: 0.5, knee: 0.9, arm: 0.3, bob: 1.2, lean: 0.04, kneeBase: 0.12, torsoBase: 0, headBase: 0 },
  suit: { stride: 0.3, knee: 0.6, arm: 0.12, bob: 1.2, lean: 0.05, kneeBase: 0.1, torsoBase: 0.2, headBase: 0.28 },
};

function stanceBase(p: PoseOut, st: HumanoidStyle, t: number): void {
  const k = STYLE[st];
  const a = p.angles;
  a.torso = k.torsoBase;
  a.head = k.headBase;
  a.legR = -k.kneeBase * 0.6;
  a.shinR = k.kneeBase;
  a.legL = -k.kneeBase * 0.6 + 0.04;
  a.shinL = k.kneeBase;
  a.footR = -(a.legR + a.shinR);
  a.footL = -(a.legL + a.shinL);
  a.armR = -0.08;
  a.foreR = -0.18;
  a.armL = 0.1;
  a.foreL = -0.12;
  p.offsets.hips = { x: 0, y: k.kneeBase * 10 };
  if (st === 'coward') holdTorch(p, t);
  if (st === 'suit') {
    a.armR = 0.05;
    a.armL = 0.12;
    a.foreR = -0.08 + 0.035 * S(t * 31);
    a.foreL = -0.06 + 0.035 * S(t * 27 + 1);
  }
}

function holdTorch(p: PoseOut, t: number): void {
  const a = p.angles;
  const shake = 0.04 * S(t * 23) + 0.025 * S(t * 37);
  a.armR = -0.95 + shake;
  a.foreR = -0.95 - shake;
  a.armL = -0.75 + shake;
  a.foreL = -1.15;
}

export function humanoidPose(rigId: string, anim: string, t: number, prm: PoseParams = {}): PoseOut {
  const st = styleOf(rigId);
  const k = STYLE[st];
  const p = base();
  const a = p.angles;
  stanceBase(p, st, t);
  switch (anim) {
    case 'idle': {
      const b = S(t * 2.1);
      p.offsets.torso = { x: 0, y: -0.6 - 0.6 * b };
      a.head = (a.head ?? 0) + 0.03 * S(t * 1.3);
      a.armR = (a.armR ?? 0) + 0.04 * b;
      a.armL = (a.armL ?? 0) + 0.04 * b;
      if (st === 'root') a.head = (a.head ?? 0) + 0.02 * S(t * 0.7);
      if (st === 'suit') p.offsets.torso = { x: 0, y: -0.3 * b };
      break;
    }
    case 'walk':
    case 'run':
    case 'push': {
      const ph = prm.phase ?? t * 8;
      const sp = Math.min(1, Math.max(0.25, prm.speed ?? 1));
      const stride = k.stride * (0.55 + 0.45 * sp);
      const legR = -stride * S(ph);
      const legL = stride * S(ph);
      const kneeR = k.kneeBase + k.knee * Math.pow(Math.max(0, C(ph)), 1.4) * sp;
      const kneeL = k.kneeBase + k.knee * Math.pow(Math.max(0, -C(ph)), 1.4) * sp;
      a.legR = legR - k.kneeBase * 0.5;
      a.legL = legL - k.kneeBase * 0.5;
      a.shinR = kneeR;
      a.shinL = kneeL;
      a.footR = -(a.legR + a.shinR) * 0.85 + (S(ph) < 0 ? -0.25 * -S(ph) : 0);
      a.footL = -(a.legL + a.shinL) * 0.85 + (S(ph) > 0 ? -0.25 * S(ph) : 0);
      const bob = k.bob * (0.5 + 0.5 * sp);
      p.offsets.hips = { x: 0, y: k.kneeBase * 10 + bob * (0.5 - 0.5 * C(2 * ph)) };
      a.torso = k.torsoBase + k.lean * sp;
      a.head = k.headBase - a.torso * 0.5 + 0.03 * S(2 * ph);
      if (st !== 'coward') {
        const lag = 0.35;
        a.armR = k.arm * sp * S(ph - lag) + 0.05;
        a.armL = -k.arm * sp * S(ph - lag) + 0.1;
        a.foreR = -0.25 - 0.2 * sp * Math.max(0, -S(ph - lag));
        a.foreL = -0.25 - 0.2 * sp * Math.max(0, S(ph - lag));
      }
      if (st === 'human') {
        // Settling shoulders/belly after each step.
        p.offsets.torso = { x: 0, y: 1.1 * Math.max(0, S(2 * ph + 0.6)) };
      }
      if (st === 'mech') {
        a.armR = 0.18 * S(Math.round(ph * 2) / 2);
        a.armL = -0.18 * S(Math.round(ph * 2) / 2);
      }
      if (st === 'suit') {
        a.foreR = -0.08 + 0.035 * S(t * 31);
        a.foreL = -0.06 + 0.035 * S(t * 27 + 1);
      }
      if (anim === 'push') {
        a.torso = 0.5;
        a.head = -0.25;
        a.armR = -1.35;
        a.foreR = -0.25;
        a.armL = -1.25;
        a.foreL = -0.3;
      }
      break;
    }
    case 'rise': {
      a.legR = -0.75;
      a.shinR = 1.05;
      a.legL = -0.15;
      a.shinL = 0.55;
      a.footR = -0.3;
      a.footL = -0.35;
      a.torso = k.torsoBase + 0.08;
      a.head = k.headBase - 0.12;
      if (st !== 'coward') {
        a.armR = 0.55;
        a.foreR = -0.2;
        a.armL = 0.75;
        a.foreL = -0.15;
      }
      p.sy = 1.04;
      p.sx = 0.97;
      break;
    }
    case 'fall': {
      const f = Math.min(1, Math.max(0, (prm.vy ?? 300) / 600));
      a.legR = -0.35 - 0.1 * f;
      a.shinR = 0.4;
      a.legL = 0.15;
      a.shinL = 0.3;
      a.footR = -0.1;
      a.footL = -0.35;
      a.torso = k.torsoBase - 0.02;
      a.head = k.headBase - 0.15;
      if (st !== 'coward') {
        a.armR = -1.9 - 0.4 * f;
        a.foreR = -0.35;
        a.armL = -2.2 - 0.3 * f;
        a.foreL = -0.3;
      }
      break;
    }
    case 'land': {
      const s = 1 - Math.min(1, prm.k ?? 0);
      a.legR = -0.55 * s;
      a.shinR = 1.0 * s + k.kneeBase;
      a.legL = -0.45 * s;
      a.shinL = 0.95 * s + k.kneeBase;
      a.footR = -(a.legR + a.shinR);
      a.footL = -(a.legL + a.shinL);
      p.offsets.hips = { x: 0, y: 9 * s + k.kneeBase * 10 };
      a.torso = k.torsoBase + 0.25 * s;
      a.head = k.headBase - 0.15 * s;
      if (st !== 'coward') {
        a.armR = -0.5 * s;
        a.armL = -0.3 * s;
      }
      p.sx = 1 + 0.05 * s;
      p.sy = 1 - 0.05 * s;
      break;
    }
    case 'interact': {
      a.armR = -1.25;
      a.foreR = -0.35;
      a.torso = k.torsoBase + 0.12;
      a.head = k.headBase + 0.12;
      break;
    }
    case 'reach': {
      a.armR = -1.62;
      a.foreR = 0.05;
      a.armL = 0.55;
      a.foreL = -0.2;
      a.torso = 0.22;
      a.head = -0.12;
      a.legR = -0.35;
      a.shinR = 0.35;
      a.legL = 0.35;
      a.shinL = 0.2;
      break;
    }
    case 'pull': {
      a.armR = -2.3;
      a.foreR = -0.2;
      a.armL = -2.0;
      a.foreL = -0.3;
      a.legR = -0.5;
      a.shinR = 0.9;
      a.legL = -0.1;
      a.shinL = 0.8;
      a.torso = 0.18;
      break;
    }
    case 'song': {
      const pulse = S(t * 5.5);
      a.torso = -0.12 - 0.03 * pulse;
      a.head = -0.35;
      a.armR = -0.95 - 0.12 * pulse;
      a.foreR = -0.4;
      a.armL = 0.8 + 0.12 * pulse;
      a.foreL = -0.4;
      p.offsets.torso = { x: 0, y: -1.2 * (0.5 + 0.5 * pulse) };
      break;
    }
    case 'breath': {
      a.torso = k.torsoBase - 0.06;
      a.head = k.headBase + 0.12;
      a.armR = 0.28;
      a.foreR = -0.55;
      a.armL = 0.34;
      a.foreL = -0.55;
      p.offsets.torso = { x: 0, y: -2 };
      p.offsets.armR = { x: 0, y: -1.5 };
      p.offsets.armL = { x: 0, y: -1.5 };
      if (st === 'coward') holdTorch(p, t);
      break;
    }
    case 'transform': {
      const j = S(t * 22);
      a.torso = -0.2 + 0.05 * j;
      a.head = -0.45;
      a.armR = -2.1 + 0.15 * j;
      a.foreR = -0.3;
      a.armL = 2.1 - 0.15 * j;
      a.foreL = 0.3;
      a.legR = -0.25;
      a.legL = 0.25;
      a.shinR = 0.2;
      a.shinL = 0.2;
      break;
    }
    case 'hurt': {
      a.torso = -0.32;
      a.head = -0.35;
      a.armR = -1.5;
      a.foreR = -0.5;
      a.armL = -1.9;
      a.foreL = -0.4;
      a.legR = -0.35;
      a.shinR = 0.45;
      a.legL = 0.25;
      a.shinL = 0.2;
      break;
    }
    case 'collapse': {
      const c = Math.min(1, prm.k ?? 1);
      a.torso = 1.15 * c;
      a.head = 0.5 * c;
      a.legR = -1.25 * c;
      a.shinR = 2.0 * c;
      a.legL = -1.05 * c;
      a.shinL = 2.1 * c;
      a.footR = -(a.legR + a.shinR);
      a.footL = -(a.legL + a.shinL);
      a.armR = -0.3 * c;
      a.armL = -0.5 * c;
      p.offsets.hips = { x: 0, y: 26 * c };
      break;
    }
    case 'kneel':
    case 'sit': {
      a.legR = -1.45;
      a.shinR = 1.55;
      a.footR = -0.1;
      a.legL = 0.1;
      a.shinL = 1.65;
      a.footL = -1.75;
      p.offsets.hips = { x: 0, y: 17 };
      a.torso = 0.05;
      a.head = 0.25;
      a.armR = -0.3;
      a.foreR = -0.9;
      a.armL = -0.2;
      a.foreL = -0.8;
      break;
    }
    case 'shout': {
      const q = S(t * 30) * 0.03;
      a.torso = -0.28 + q;
      a.head = -0.42;
      a.armR = 0.65;
      a.foreR = 0.1;
      a.armL = 0.8;
      a.foreL = 0.15;
      a.legR = -0.3;
      a.shinR = 0.2;
      a.legL = 0.35;
      a.shinL = 0.1;
      break;
    }
    case 'ride': {
      a.legR = -1.25;
      a.shinR = 1.45;
      a.footR = -0.3;
      a.legL = -1.2;
      a.shinL = 1.4;
      a.footL = -0.3;
      a.torso = 0.18 + 0.04 * Math.sin(t * 9);
      a.head = -0.18;
      a.armR = -0.95;
      a.foreR = -0.55;
      a.armL = -0.85;
      a.foreL = -0.6;
      p.offsets.hips = { x: 0, y: 0 };
      break;
    }
    case 'point': {
      a.armR = -1.9;
      a.foreR = -0.05;
      a.torso = -0.05;
      a.head = -0.25;
      break;
    }
    case 'look': {
      a.head = -0.35;
      a.torso = -0.06;
      break;
    }
    case 'torchUp': {
      a.armR = -2.7;
      a.foreR = -0.2;
      a.armL = -2.55;
      a.foreL = -0.3;
      a.torso = -0.1;
      a.head = -0.4;
      break;
    }
    default:
      break;
  }
  if (st === 'coward') {
    // The oversized torch stays upright whatever the arms do.
    a.torch = -((a.torso ?? 0) + (a.armR ?? 0) + (a.foreR ?? 0)) + (anim === 'torchUp' ? 0 : 0.12);
    a.flame = 0.05 * Math.sin(t * 17);
  }
  return p;
}

export function poseFor(rigId: string, anim: string, t: number, prm: PoseParams = {}): PoseOut {
  return humanoidPose(rigId, anim, t, prm);
}
