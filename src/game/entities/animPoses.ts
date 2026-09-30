import type { Angles } from '../art/fk';

// Procedural pose library for the humanoid cutout rigs. A pose is a set of
// local joint angles (radians) plus joint offsets. Limbs hang down at 0; a
// forward leg/arm swing is negative. Upright parts (torso, head) lean
// forward with positive angles.

export type HumanoidStyle = 'root' | 'human' | 'coward' | 'mech' | 'suit';

export interface PoseOut {
  angles: Angles;
  offsets: Record<string, { x: number; y: number }>;
  /** Shape variants for joints that have them (e.g. eyeN: 'happy'). */
  frames?: Record<string, string>;
  /** Per-joint scale (e.g. a blink squashes the eye). */
  scales?: Record<string, { x: number; y: number }>;
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
  /** The form's take-off speed (scales the air poses). */
  jv?: number;
  /** 0..1 how hard the last landing was. */
  impact?: number;
  /** 0..1 progress for one-shot poses. */
  k?: number;
  /** Momentary emotion layered over the animation (drives the brows). */
  emote?: Emote;
  /** 0..1 strength of the emote (fades out). */
  emoteK?: number;
  /** 0..1 how closed the eyes are (blinks). */
  blink?: number;
  /** Extra head turn (radians, negative looks up). */
  look?: number;
  /** Seconds spent standing still (idle actions). */
  idleT?: number;
  /** 0 upright … 1 lying on the back (the rig is turned by the player). */
  lie?: number;
}

export type Emote = 'surprise' | 'pain' | 'joy' | 'anger' | 'talk' | 'listen' | 'relief' | 'worry' | 'effort' | 'shout';

/** Brow state: raise (px, negative = up), knit (rad, + = angry, - = sad), asym (px on the near brow). */
interface BrowSet {
  raise: number;
  knit: number;
  asym: number;
}

const EMOTES: Record<Emote, (t: number) => BrowSet> = {
  surprise: () => ({ raise: -6.5, knit: -0.2, asym: -1.5 }),
  pain: (t) => ({ raise: 2.2, knit: -0.62 + 0.06 * S(t * 30), asym: 1.2 }),
  joy: (t) => ({ raise: -4.5 - 1.5 * Math.abs(S(t * 9)), knit: -0.3, asym: 0 }),
  anger: () => ({ raise: 2.5, knit: 0.8, asym: 0 }),
  talk: (t) => ({ raise: -2.2 * Math.abs(S(t * 8.5)), knit: 0.14 * S(t * 3.7), asym: -1.2 * Math.max(0, S(t * 2.3)) }),
  listen: (t) => ({ raise: -2.6, knit: -0.14, asym: -1.6 * Math.max(0, S(t * 0.8)) }),
  relief: () => ({ raise: -3, knit: -0.38, asym: 0 }),
  worry: (t) => ({ raise: -1.5, knit: -0.55 + 0.05 * S(t * 6), asym: 0.8 }),
  effort: (t) => ({ raise: 2, knit: 0.55 + 0.05 * S(t * 20), asym: 0 }),
  shout: (t) => ({ raise: 2.4, knit: 0.8 + 0.06 * S(t * 26), asym: 0 }),
};

/** What the brows do during each animation: big, readable reactions. */
function browsFor(anim: string, t: number, prm: PoseParams, st: HumanoidStyle): BrowSet {
  let b: BrowSet = { raise: 0, knit: 0, asym: 0 };
  switch (anim) {
    case 'idle': {
      // Alive at rest: brief lifts and a quizzical twitch now and then.
      const lift = Math.max(0, S(t * 0.9) - 0.82) * 22;
      const twitch = Math.max(0, S(t * 0.37 + 1) - 0.9) * 26;
      b = { raise: -lift, knit: 0.04 * S(t * 0.5), asym: -twitch };
      if (st === 'suit') b = { raise: 1.4, knit: -0.32, asym: 0 };
      const act = idleAction(prm.idleT ?? 0, st);
      if (act) {
        const e = act.env;
        const to: BrowSet =
          act.kind === 'look'
            ? { raise: -4, knit: -0.15, asym: -2 }
            : act.kind === 'stretch'
              ? { raise: -2, knit: -0.3, asym: 0 }
              : act.kind === 'hum'
                ? { raise: -3 - 1.2 * Math.abs(S(t * 3.4)), knit: -0.25, asym: 0 }
                : { raise: -1, knit: 0.3, asym: -3.2 };
        b = { raise: b.raise + (to.raise - b.raise) * e, knit: b.knit + (to.knit - b.knit) * e, asym: b.asym + (to.asym - b.asym) * e };
      }
      break;
    }
    case 'dance':
      b = { raise: -5 - 1.5 * Math.abs(S(t * 8)), knit: -0.3, asym: 0 };
      break;
    case 'conjure':
      b = { raise: -5, knit: -0.28, asym: -1 };
      break;
    case 'stomp':
      b = t < 0.26 ? { raise: 1.5, knit: 0.55, asym: 0 } : { raise: 2.8, knit: 0.75, asym: 0 };
      break;
    case 'walk':
      b = { raise: 0, knit: st === 'suit' ? -0.3 : 0.1, asym: 0 };
      break;
    case 'run':
      b = { raise: 0.8, knit: 0.3, asym: 0 };
      break;
    case 'push':
      b = EMOTES.effort(t);
      break;
    case 'crouch':
    case 'takeoff':
      b = { raise: 1.4, knit: 0.42, asym: 0 };
      break;
    case 'rise':
      b = { raise: -5, knit: -0.12, asym: -1.2 };
      break;
    case 'apex':
      // Weightless for a moment: delight.
      b = { raise: -6 - 1 * Math.abs(S(t * 7)), knit: -0.28, asym: -1.8 };
      break;
    case 'fall': {
      const f = Math.min(1, Math.max(0, (prm.vy ?? 300) / 700));
      b = { raise: -3.5 - 3 * f, knit: -0.35 * f, asym: -1.5 * f };
      break;
    }
    case 'land': {
      const u = Math.min(1, prm.k ?? t / 0.28);
      const i = 0.4 + 0.6 * (prm.impact ?? 0.5);
      b = { raise: 3 * i * (1 - u), knit: 0.6 * i * (1 - u), asym: 0 };
      break;
    }
    case 'interact':
      b = { raise: -3, knit: -0.08, asym: -2.6 };
      break;
    case 'reach':
    case 'pull':
      b = { raise: 1, knit: 0.45, asym: 0 };
      break;
    case 'song':
      b = { raise: -2.4 - 1.4 * S(t * 3.2), knit: -0.2, asym: 1 * S(t * 1.6) };
      break;
    case 'breath':
      b = { raise: 1.6, knit: 0.36 + 0.05 * S(t * 5), asym: 0 };
      break;
    case 'transform':
      b = { raise: -5.5, knit: -0.35 + 0.18 * S(t * 18), asym: -1 };
      break;
    case 'hurt':
      b = EMOTES.pain(t);
      break;
    case 'collapse':
      b = { raise: 1.8, knit: -0.55, asym: 0 };
      break;
    case 'kneel':
    case 'sit':
      b = { raise: 0.6, knit: -0.45, asym: 0 };
      break;
    case 'shout':
      b = EMOTES.anger(t);
      break;
    case 'ride':
      b = { raise: -3 - 1 * S(t * 7), knit: 0.12, asym: 0 };
      break;
    case 'point':
      b = { raise: 0.8, knit: 0.55, asym: 0 };
      break;
    case 'look':
      b = { raise: -3.5, knit: -0.12, asym: -3 };
      break;
    case 'getup': {
      const u = prm.k ?? 0;
      b = u > 0.7 ? EMOTES.effort(t) : { raise: -2, knit: -0.15, asym: -1 };
      break;
    }
    case 'sleep': {
      // Peaceful; a yawn lifts the brows.
      const y = prm.k ?? 0;
      b = { raise: 0.8 - 5 * y, knit: -0.18 - 0.2 * y, asym: 0 };
      break;
    }
    default:
      break;
  }
  // The torch-bearer is afraid by default; the mechanical form is set hard.
  if (st === 'coward') b = { raise: b.raise - 1.2, knit: b.knit - 0.32, asym: b.asym };
  if (st === 'mech') b = { raise: b.raise + 0.6, knit: b.knit + 0.18, asym: b.asym };
  const k = Math.max(0, Math.min(1, prm.emoteK ?? 0));
  if (prm.emote && k > 0) {
    const e = EMOTES[prm.emote](t);
    b = { raise: b.raise + (e.raise - b.raise) * k, knit: b.knit + (e.knit - b.knit) * k, asym: b.asym + (e.asym - b.asym) * k };
  }
  return b;
}

/**
 * The brow tilts (knit: inner end down = anger/effort, up = pain/sadness),
 * rises and drops. The root head is small and crowned with branches, so its
 * brow travels less vertically and leans harder instead.
 */
function applyBrows(p: PoseOut, b: BrowSet, st: HumanoidStyle): void {
  const lift = st === 'root' ? 0.45 : st === 'mech' ? 0.6 : 1;
  const lean = st === 'root' ? 1.35 : st === 'mech' ? 0.95 : 1.15;
  p.angles.browN = b.knit * lean;
  p.offsets.browN = { x: b.knit * 1.4, y: (b.raise + b.asym * 0.6) * lift };
}

const S = Math.sin;
const C = Math.cos;
const easeOut = (x: number): number => 1 - (1 - x) * (1 - x);
const smooth01 = (e0: number, e1: number, x: number): number => {
  const u = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return u * u * (3 - 2 * u);
};

// ------------------------------------------------------------ idle actions

type IdleKind = 'look' | 'stretch' | 'hum' | 'scratch';
const IDLE_START = 3.5;
const IDLE_CYCLE = 8;

/** Standing still for a while, Gorti does something now and then. */
export function idleAction(idleT: number, st: HumanoidStyle): { kind: IdleKind; u: number; env: number } | null {
  if (idleT < IDLE_START || st === 'suit') return null;
  const since = idleT - IDLE_START;
  const n = Math.floor(since / IDLE_CYCLE);
  const kinds: IdleKind[] = st === 'coward' ? ['look'] : st === 'mech' ? ['look', 'stretch'] : ['look', 'stretch', 'hum', 'scratch'];
  const kind = kinds[n % kinds.length]!;
  const dur = kind === 'hum' ? 3.4 : kind === 'stretch' ? 2.6 : 2.8;
  const local = since - n * IDLE_CYCLE;
  if (local > dur) return null;
  const u = local / dur;
  return { kind, u, env: smooth01(0, 0.2, u) * (1 - smooth01(0.8, 1, u)) };
}

/** The standing-still time at which an idle action begins (to start one now). */
export function idleStartFor(kind: IdleKind, st: HumanoidStyle): number {
  const kinds: IdleKind[] = st === 'coward' ? ['look'] : st === 'mech' ? ['look', 'stretch'] : ['look', 'stretch', 'hum', 'scratch'];
  const i = Math.max(0, kinds.indexOf(kind));
  return IDLE_START + i * IDLE_CYCLE;
}

export type { IdleKind };

function blendTo(p: PoseOut, target: Record<string, number>, k: number): void {
  for (const [id, v] of Object.entries(target)) {
    const cur = p.angles[id] ?? 0;
    p.angles[id] = cur + (v - cur) * k;
  }
}

function applyIdle(p: PoseOut, act: { kind: IdleKind; u: number; env: number }, t: number, st: HumanoidStyle): void {
  const a = p.angles;
  const e = act.env;
  switch (act.kind) {
    case 'look': {
      // Looks up and around, curious.
      a.head = (a.head ?? 0) - 0.3 * e + 0.1 * e * S(act.u * Math.PI * 3);
      a.torso = (a.torso ?? 0) - 0.05 * e;
      p.offsets.eyeN = { x: 0.5 * e * S(act.u * Math.PI * 3), y: -0.8 * e };
      break;
    }
    case 'stretch': {
      // Arms high, up on the toes, a yawn.
      const arms: Record<string, number> = st === 'coward' ? {} : { armR: -2.9, foreR: -0.12, armL: -2.75, foreL: -0.2 };
      blendTo(p, { ...arms, torso: -0.16, head: -0.4, footR: 0.35, footL: 0.3 }, e);
      p.offsets.hips = { x: 0, y: (p.offsets.hips?.y ?? 0) - 3 * e };
      break;
    }
    case 'hum': {
      // Sways to a tune only Gorti hears.
      const w = S(t * 3.4);
      a.torso = (a.torso ?? 0) + 0.07 * w * e;
      a.head = (a.head ?? 0) + 0.12 * S(t * 3.4 + 0.6) * e;
      if (st !== 'coward') {
        a.armR = (a.armR ?? 0) + 0.18 * w * e;
        a.armL = (a.armL ?? 0) - 0.18 * w * e;
      }
      p.offsets.hips = { x: 0, y: (p.offsets.hips?.y ?? 0) + 1.4 * Math.abs(w) * e };
      break;
    }
    case 'scratch': {
      // Puzzled: a hand goes up to scratch the head.
      blendTo(p, { armR: -2.55, foreR: -2.3 + 0.14 * S(t * 24), head: 0.16, torso: 0.04 }, e);
      break;
    }
  }
}

// ------------------------------------------------------------ face

/** Eye shape and size, mouth shape and size. */
interface Face {
  eye: string;
  ex: number;
  ey: number;
  mouth: string;
  ms: number;
}

/** What the black eyes and the mouth do in each animation and emotion. */
function faceFor(anim: string, t: number, prm: PoseParams, st: HumanoidStyle, idle: ReturnType<typeof idleAction>): Face {
  const f: Face = { eye: '', ex: 1, ey: 1, mouth: '', ms: 1 };
  switch (anim) {
    case 'idle':
      if (idle && idle.env > 0.3) {
        if (idle.kind === 'stretch') {
          f.eye = 'shut';
          f.mouth = 'open';
          f.ms = 1.3;
        } else if (idle.kind === 'hum') {
          f.eye = 'happy';
          f.mouth = 'smile';
        } else if (idle.kind === 'look') {
          f.ex = 1.12;
          f.ey = 1.15;
        } else f.mouth = 'frown';
      }
      break;
    case 'run':
      f.mouth = 'open';
      f.ms = 0.8;
      break;
    case 'push':
    case 'pull':
    case 'reach':
      f.ey = 0.55;
      f.mouth = 'grit';
      break;
    case 'crouch':
    case 'takeoff':
      f.ey = 0.7;
      f.mouth = 'grit';
      break;
    case 'rise':
      f.ex = 1.1;
      f.ey = 1.15;
      f.mouth = 'open';
      f.ms = 0.85;
      break;
    case 'apex':
      f.eye = 'happy';
      f.mouth = 'grin';
      break;
    case 'fall': {
      const k = Math.min(1, Math.max(0, (prm.vy ?? 300) / 700));
      f.ex = 1 + 0.25 * k;
      f.ey = 1 + 0.35 * k;
      f.mouth = k > 0.35 ? 'open' : '';
      f.ms = 0.8 + 0.5 * k;
      break;
    }
    case 'land':
      if ((prm.impact ?? 0) > 0.5 && (prm.k ?? 1) < 0.55) {
        f.eye = 'shut';
        f.mouth = 'grit';
      } else f.ey = 0.8;
      break;
    case 'interact':
    case 'look':
      f.ex = 1.1;
      f.ey = 1.15;
      f.mouth = 'open';
      f.ms = 0.6;
      break;
    case 'song':
      f.eye = 'happy';
      f.mouth = 'open';
      f.ms = 0.7 + 0.3 * Math.abs(S(t * 5.5));
      break;
    case 'breath':
      f.ey = 0.45;
      break;
    case 'transform':
      f.ex = 1.3;
      f.ey = 1.4;
      f.mouth = 'open';
      f.ms = 1.2;
      break;
    case 'collapse':
      f.eye = 'shut';
      f.mouth = 'frown';
      break;
    case 'kneel':
    case 'sit':
      f.eye = 'sad';
      f.mouth = 'frown';
      break;
    case 'shout':
      f.ey = 0.75;
      f.mouth = 'open';
      f.ms = 1.55 + 0.1 * S(t * 30);
      break;
    case 'ride':
      f.mouth = 'grin';
      break;
    case 'dance':
    case 'conjure':
      f.eye = 'happy';
      f.mouth = 'grin';
      break;
    case 'stomp':
      f.ey = 0.55;
      f.mouth = 'grit';
      break;
    case 'torchUp':
      f.ey = 1.1;
      f.mouth = 'open';
      f.ms = 0.6;
      break;
    case 'sleep': {
      // Lids shut (a script can open them through `blink`); a slow breath
      // through the mouth, or a big yawn (`k`).
      const y = prm.k ?? 0;
      f.eye = (prm.blink ?? 1) > 0.97 ? 'shut' : '';
      f.mouth = 'open';
      f.ms = y > 0.04 ? 0.55 + 1.15 * y : 0.32 + 0.07 * S(t * 1.35);
      break;
    }
    default:
      break;
  }
  // The suited Gorti is worn out; the torch-bearer is afraid.
  if (st === 'suit' && !f.eye) {
    f.eye = 'sad';
    if (!f.mouth) f.mouth = 'frown';
  }
  if (st === 'coward') {
    if (!f.eye && f.ex === 1) {
      f.ex = 1.08;
      f.ey = 1.12;
    }
    if (!f.mouth) {
      f.mouth = 'frown';
      f.ms = 1 + 0.08 * S(t * 41);
    }
  }
  const k = Math.max(0, Math.min(1, prm.emoteK ?? 0));
  if (prm.emote && k > 0.3) {
    switch (prm.emote) {
      case 'joy':
        f.eye = 'happy';
        f.mouth = 'grin';
        break;
      case 'surprise':
        f.eye = '';
        f.ex = 1.25;
        f.ey = 1.35;
        f.mouth = 'open';
        f.ms = 1.1;
        break;
      case 'pain':
        f.eye = 'shut';
        f.mouth = 'grit';
        break;
      case 'anger':
        f.ey = 0.7;
        f.mouth = 'grit';
        break;
      case 'talk':
        // Lips move with the typing text.
        f.mouth = S(t * 17) > -0.2 || S(t * 6.3) > 0.7 ? 'open' : '';
        f.ms = 0.55 + 0.45 * Math.abs(S(t * 9));
        break;
      case 'listen':
        f.mouth = '';
        break;
      case 'relief':
        f.eye = 'happy';
        f.mouth = 'smile';
        break;
      case 'worry':
        f.eye = 'sad';
        f.mouth = 'frown';
        break;
      case 'effort':
        f.eye = '';
        f.ey = 0.5;
        f.mouth = 'grit';
        break;
      case 'shout':
        f.eye = '';
        f.ey = 0.8;
        f.mouth = 'open';
        f.ms = 1.55 + 0.12 * S(t * 28);
        break;
    }
  }
  return f;
}

function applyFace(p: PoseOut, f: Face, prm: PoseParams): void {
  const open = f.eye === '' || f.eye === 'sad';
  const blink = open ? Math.min(1, Math.max(0, prm.blink ?? 0)) : 0;
  p.frames = { ...(p.frames ?? {}), eyeN: f.eye, mouth: f.mouth };
  p.scales = {
    ...(p.scales ?? {}),
    eyeN: { x: f.ex, y: Math.max(0.08, f.ey * (1 - 0.9 * blink)) },
    mouth: { x: f.ms, y: f.ms },
  };
}

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
  root: { stride: 0.66, knee: 1.1, arm: 0.7, bob: 4.4, lean: 0.13, kneeBase: 0.06, torsoBase: 0.02, headBase: 0 },
  human: { stride: 0.46, knee: 0.85, arm: 0.45, bob: 2.6, lean: 0.07, kneeBase: 0.09, torsoBase: -0.03, headBase: 0.05 },
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
      const act = idleAction(prm.idleT ?? 0, st);
      if (act) applyIdle(p, act, t, st);
      break;
    }
    case 'dance': {
      // A happy little dance in the colour storm.
      const q = t * 8;
      a.legR = -0.22 + 0.16 * S(q);
      a.shinR = 0.35 + 0.25 * Math.max(0, S(q));
      a.legL = 0.05 - 0.16 * S(q);
      a.shinL = 0.35 + 0.25 * Math.max(0, -S(q));
      a.footR = -(a.legR + a.shinR);
      a.footL = -(a.legL + a.shinL);
      p.offsets.hips = { x: 0, y: k.kneeBase * 10 + 3.5 * Math.abs(S(q)) };
      a.torso = k.torsoBase + 0.09 * S(q / 2);
      a.head = k.headBase - 0.18 + 0.14 * S(q / 2 + 0.7);
      if (st !== 'coward') {
        a.armR = -2.55 + 0.4 * S(q);
        a.foreR = -0.35 + 0.25 * S(q + 1);
        a.armL = -2.35 - 0.4 * S(q + 0.8);
        a.foreL = -0.3 + 0.25 * S(q + 2);
      }
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
    case 'crouch': {
      // The instant before leaving the ground (snapped at take-off, then the
      // joints spring open into 'takeoff').
      a.legR = -0.8;
      a.shinR = 1.45;
      a.legL = -0.62;
      a.shinL = 1.35;
      a.footR = -(a.legR + a.shinR);
      a.footL = -(a.legL + a.shinL);
      p.offsets.hips = { x: 0, y: 14 + k.kneeBase * 10 };
      a.torso = k.torsoBase + 0.4;
      a.head = k.headBase - 0.22;
      if (st !== 'coward') {
        a.armR = 0.9;
        a.foreR = -0.25;
        a.armL = 0.75;
        a.foreL = -0.2;
      }
      break;
    }
    case 'takeoff': {
      // Push-off: legs straighten and trail, toes point, arms swing up.
      a.legR = 0.1;
      a.shinR = 0.12;
      a.legL = 0.32;
      a.shinL = 0.3;
      a.footR = -(a.legR + a.shinR) + 0.75;
      a.footL = -(a.legL + a.shinL) + 0.85;
      p.offsets.hips = { x: 0, y: -2 };
      a.torso = k.torsoBase - 0.02;
      a.head = k.headBase - 0.25;
      if (st !== 'coward') {
        a.armR = -2.4;
        a.foreR = -0.25;
        a.armL = -2.1;
        a.foreL = -0.35;
      }
      break;
    }
    case 'rise': {
      // The knees come up as the climb slows down.
      const u = Math.min(1, Math.max(0, -(prm.vy ?? -300) / Math.max(1, prm.jv ?? 600)));
      const tuck = 1 - u;
      a.legR = -0.5 - 0.65 * tuck;
      a.shinR = 0.55 + 1.0 * tuck;
      a.legL = 0.2 - 0.5 * tuck;
      a.shinL = 0.5 + 0.95 * tuck;
      a.footR = -(a.legR + a.shinR) + 0.55;
      a.footL = -(a.legL + a.shinL) + 0.6;
      a.torso = k.torsoBase + 0.03;
      a.head = k.headBase - 0.2 + 0.06 * tuck;
      if (st !== 'coward') {
        a.armR = -2.3 + 0.55 * tuck;
        a.foreR = -0.3 - 0.25 * tuck;
        a.armL = -2.0 + 0.9 * tuck;
        a.foreL = -0.3;
      }
      break;
    }
    case 'apex': {
      // Weightless for a moment: knees tucked, arms open like wings.
      const fl = S(t * 7);
      a.legR = -1.2;
      a.shinR = 1.7;
      a.legL = -0.78;
      a.shinL = 1.8;
      a.footR = -(a.legR + a.shinR) + 0.45;
      a.footL = -(a.legL + a.shinL) + 0.5;
      p.offsets.hips = { x: 0, y: -3 };
      a.torso = k.torsoBase - 0.06;
      a.head = k.headBase - 0.3;
      if (st !== 'coward') {
        a.armR = -1.95 - 0.1 * fl;
        a.foreR = -0.45;
        a.armL = 1.9 + 0.1 * fl;
        a.foreL = 0.45;
      }
      if (st === 'mech') {
        a.armR = -1.5;
        a.armL = 1.2;
        a.foreR = -0.2;
        a.foreL = 0.2;
      }
      break;
    }
    case 'fall': {
      // Legs reach for the ground; the faster the drop, the higher the arms.
      const f = Math.min(1, Math.max(0, (prm.vy ?? 300) / 700));
      const fl = f * S(t * 15);
      a.legR = -0.3 - 0.15 * f;
      a.shinR = 0.5 - 0.2 * f;
      a.legL = 0.12;
      a.shinL = 0.45 - 0.15 * f;
      a.footR = -(a.legR + a.shinR) * 0.6 - 0.1;
      a.footL = -(a.legL + a.shinL) * 0.6 + 0.15;
      a.torso = k.torsoBase - 0.03 - 0.05 * f;
      a.head = k.headBase - 0.18 - 0.12 * f;
      if (st !== 'coward') {
        a.armR = -1.7 - 0.6 * f + 0.22 * fl;
        a.foreR = -0.35 - 0.2 * f;
        a.armL = -2.0 - 0.5 * f - 0.22 * fl;
        a.foreL = -0.3;
      }
      if (st === 'mech') {
        a.armR = -1.3;
        a.armL = -1.1;
      }
      break;
    }
    case 'land': {
      // Knees absorb the drop; the harder the landing, the deeper.
      const d = (0.35 + 0.65 * Math.min(1, prm.impact ?? 0.5)) * (1 - easeOut(Math.min(1, prm.k ?? 0)));
      a.legR = -0.72 * d;
      a.shinR = 1.35 * d + k.kneeBase;
      a.legL = -0.6 * d;
      a.shinL = 1.3 * d + k.kneeBase;
      a.footR = -(a.legR + a.shinR);
      a.footL = -(a.legL + a.shinL);
      p.offsets.hips = { x: 0, y: 15 * d + k.kneeBase * 10 };
      a.torso = k.torsoBase + 0.45 * d;
      a.head = k.headBase - 0.28 * d;
      if (st !== 'coward') {
        a.armR = -0.95 * d;
        a.foreR = -0.2 - 0.5 * d;
        a.armL = -0.65 * d;
        a.foreL = -0.2 - 0.4 * d;
      }
      break;
    }
    case 'conjure': {
      // Arms open forward and up, palms to the sky: the flowers come.
      const u = Math.min(1, t / 0.25);
      a.armR = -0.3 - 1.7 * u;
      a.foreR = -0.5 * u;
      a.armL = -0.2 - 1.4 * u;
      a.foreL = -0.45 * u;
      a.torso = k.torsoBase - 0.12 * u;
      a.head = k.headBase - 0.22 * u;
      a.legR = -0.12;
      a.shinR = 0.18 + k.kneeBase;
      a.legL = 0.1;
      a.shinL = 0.12 + k.kneeBase;
      a.footR = -(a.legR + a.shinR);
      a.footL = -(a.legL + a.shinL);
      break;
    }
    case 'stomp': {
      // One knee comes up, then the foot slams down.
      if (t < 0.26) {
        const u = Math.min(1, t / 0.2);
        a.legR = -1.3 * u;
        a.shinR = 1.45 * u + k.kneeBase;
        a.footR = -(a.legR + a.shinR) + 0.2;
        a.legL = 0.05;
        a.shinL = 0.15 + k.kneeBase;
        a.footL = -(a.legL + a.shinL);
        a.torso = k.torsoBase - 0.1 * u;
        a.head = k.headBase - 0.2 * u;
        a.armR = -2.3 * u;
        a.foreR = -0.4 * u;
        a.armL = -2.0 * u;
        a.foreL = -0.3 * u;
      } else {
        const u = Math.min(1, (t - 0.26) / 0.08);
        a.legR = -0.35 * (1 - u) - 0.05;
        a.shinR = 0.35 * (1 - u) + 0.45;
        a.footR = -(a.legR + a.shinR);
        a.legL = -0.2;
        a.shinL = 0.55;
        a.footL = -(a.legL + a.shinL);
        p.offsets.hips = { x: 0, y: 9 + k.kneeBase * 10 };
        a.torso = k.torsoBase + 0.32;
        a.head = k.headBase - 0.15;
        a.armR = -0.6;
        a.foreR = -0.9;
        a.armL = -0.35;
        a.foreL = -0.8;
      }
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
    case 'sleep': {
      // Lying on his back (the rig is turned by the player): legs long and
      // loose, a hand on the chest rising with slow breaths, head sunk
      // into the pillow.
      const br = 0.5 + 0.5 * S(t * 1.35);
      a.legR = 0.04;
      a.shinR = 0.1;
      a.footR = -0.35;
      a.legL = -0.05;
      a.shinL = 0.14;
      a.footL = -0.28;
      p.offsets.hips = { x: 0, y: 0 };
      a.torso = -0.04;
      p.offsets.torso = { x: 1.1 * br, y: 0 };
      a.head = -0.2 + 0.03 * br + 0.18 * (prm.k ?? 0);
      a.armR = -0.12 - 0.04 * br;
      a.foreR = -2.25;
      a.armL = 0.16;
      a.foreL = -0.3;
      break;
    }
    case 'getup': {
      // Getting out of bed, in three beats of `k` (the player turns the rig
      // about the hips with `lie`): sit up with the legs kept flat on the
      // mattress, swing the lower legs over the edge, then stand.
      const u = prm.k ?? 0;
      const lie = prm.lie ?? 0;
      const sit = smooth01(0, 0.45, u);
      const drop = smooth01(0.45, 0.7, u);
      const stand = smooth01(0.7, 1, u);
      const flat = -(1 - lie) * Math.PI * 0.5;
      const thigh = (flat + (-1.45 - flat) * drop) * (1 - stand);
      const shin = (0.05 + 1.5 * drop) * (1 - stand) + 0.06 * stand;
      a.legR = thigh;
      a.legL = thigh + 0.08 * (1 - stand);
      a.shinR = shin;
      a.shinL = shin + 0.05 * drop * (1 - stand);
      a.footR = -0.3 * (1 - stand) - (a.legR + a.shinR) * stand;
      a.footL = -0.25 * (1 - stand) - (a.legL + a.shinL) * stand;
      // Leaning forward to rise, then upright.
      const push = Math.sin(Math.PI * stand);
      a.torso = -0.05 + 0.2 * sit + 0.35 * push - 0.15 * stand;
      a.head = -0.1 + 0.08 * sit - 0.12 * push;
      // Hands behind on the mattress while sitting up, on the knees at the
      // edge, swinging forward to stand.
      a.armR = 0.45 * (1 - drop) * (1 - stand) - 0.5 * drop * (1 - stand) - 0.55 * push;
      a.foreR = -0.2 - 0.9 * drop * (1 - stand) - 0.3 * push;
      a.armL = 0.35 * (1 - drop) * (1 - stand) - 0.4 * drop * (1 - stand) - 0.45 * push;
      a.foreL = -0.2 - 0.8 * drop * (1 - stand) - 0.3 * push;
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
  if (prm.look) {
    a.head = (a.head ?? 0) + prm.look;
    const e = p.offsets.eyeN ?? { x: 0, y: 0 };
    p.offsets.eyeN = { x: e.x, y: e.y + prm.look * 2.4 };
  }
  const idle = anim === 'idle' ? idleAction(prm.idleT ?? 0, st) : null;
  applyFace(p, faceFor(anim, t, prm, st, idle), prm);
  applyBrows(p, browsFor(anim, t, prm, st), st);
  return p;
}

export function poseFor(rigId: string, anim: string, t: number, prm: PoseParams = {}): PoseOut {
  return humanoidPose(rigId, anim, t, prm);
}
