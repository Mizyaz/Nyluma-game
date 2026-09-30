import { describe, expect, it } from 'vitest';
import { humanoidPose, idleAction } from '../../src/render/2d/rig/animPoses';
import { SMASH } from '../../src/render/2d/rig/actionPoses';
import { orderJoints, solve } from '../../src/render/2d/rig/fk';
import { cycleOf, profileOf } from '../../src/render/2d/rig/poseKit';
import type { RigDef } from '../../src/render/2d/rig/rigTypes';
import { allParts, allRigs } from '../../src/content/art/manifest';
import { RIG_COWARD, RIG_MECH } from '../../src/content/characters/forms';
import {
  humanRigFor,
  RIG_GORTI_CHILD,
  RIG_GORTI_HUMAN,
  RIG_GORTI_HUMAN_BALD,
  RIG_GORTI_HUMAN_SUN,
  RIG_GORTI_SUIT,
  RIG_GORTI_WARRIOR,
  RIG_GORTI_YOUTH,
  rootRigFor,
} from '../../src/content/characters/gorti';

const hipsY = (p: ReturnType<typeof humanoidPose>): number => p.offsets.hips?.y ?? 0;

describe('jump animation', () => {
  it('goes through crouch, push-off, tuck, reach and landing', () => {
    const crouch = humanoidPose('gorti.root', 'crouch', 0);
    expect(crouch.angles.shinR!).toBeGreaterThan(1);
    expect(hipsY(crouch)).toBeGreaterThan(10);

    const takeoff = humanoidPose('gorti.root', 'takeoff', 0);
    expect(Math.abs(takeoff.angles.shinR!)).toBeLessThan(0.3);
    expect(takeoff.angles.armR!).toBeLessThan(-2);

    // Knees come up while the climb slows down.
    const early = humanoidPose('gorti.root', 'rise', 0, { vy: -600, jv: 640 });
    const late = humanoidPose('gorti.root', 'rise', 0, { vy: -150, jv: 640 });
    expect(late.angles.shinR!).toBeGreaterThan(early.angles.shinR!);

    const apex = humanoidPose('gorti.root', 'apex', 0);
    expect(apex.angles.shinR!).toBeGreaterThan(1.4);
    expect(apex.angles.legR!).toBeLessThan(-1);

    const fall = humanoidPose('gorti.root', 'fall', 0, { vy: 700 });
    expect(fall.angles.shinR!).toBeLessThan(0.5);
    expect(fall.angles.armR!).toBeLessThan(-2);
  });

  it('lands deeper the harder the drop, and straightens up again', () => {
    const soft = humanoidPose('gorti.human', 'land', 0, { k: 0, impact: 0 });
    const hard = humanoidPose('gorti.human', 'land', 0, { k: 0, impact: 1 });
    const done = humanoidPose('gorti.human', 'land', 0, { k: 1, impact: 1 });
    expect(hipsY(hard)).toBeGreaterThan(hipsY(soft));
    expect(hipsY(done)).toBeLessThan(hipsY(soft));
  });
});

describe('walking and running', () => {
  const rigs: RigDef[] = [RIG_GORTI_CHILD, RIG_GORTI_YOUTH, RIG_GORTI_WARRIOR, RIG_GORTI_HUMAN, RIG_GORTI_HUMAN_BALD, RIG_GORTI_SUIT, RIG_COWARD, RIG_MECH];
  /** The heel and ball of a foot's sole (root frame). */
  const sole = (rig: RigDef, s: ReturnType<typeof solve>, side: 'R' | 'L') => {
    const prof = profileOf(rig.id);
    const f = s.get(`foot${side}`)!;
    const at = (u: number): [number, number] => [f.x + u * Math.cos(f.rot) - prof.sole! * Math.sin(f.rot), f.y + u * Math.sin(f.rot) + prof.sole! * Math.cos(f.rot)];
    return { heel: at(prof.heel!), ball: at(prof.ball!) };
  };

  it('keeps a planted foot still on the ground: no sliding, no sinking', () => {
    for (const rig of rigs) {
      const cycle = cycleOf(rig.id, profileOf(rig.id));
      for (const speed of [0.4, 0.75, 1]) {
        // Where each touching point of each foot first touched the ground.
        const pinned = new Map<string, number>();
        let worst = 0;
        let deepest = 0;
        const N = 360;
        for (let i = 0; i <= N; i++) {
          const phase = (i / N) * Math.PI * 4;
          const travel = (phase / (Math.PI * 2)) * cycle;
          const p = humanoidPose(rig.id, 'walk', 0, { phase, speed });
          const s = solve(orderJoints(rig), p.angles, p.offsets);
          for (const side of ['R', 'L'] as const) {
            const pts = sole(rig, s, side);
            for (const k of ['heel', 'ball'] as const) {
              const [x, y] = pts[k];
              deepest = Math.max(deepest, y);
              const key = side + k;
              if (y > -0.35) {
                const wx = x + travel;
                if (!pinned.has(key)) pinned.set(key, wx);
                worst = Math.max(worst, Math.abs(wx - pinned.get(key)!));
              } else pinned.delete(key);
            }
          }
        }
        expect(worst, `${rig.id} at ${speed}: slide`).toBeLessThan(0.3);
        expect(deepest, `${rig.id} at ${speed}: below the ground`).toBeLessThan(0.35);
      }
    }
  });

  it('strikes with the heel as the footfall sounds, pushes off the ball, bends the knees', () => {
    for (const rig of rigs) {
      // Player sounds a footfall as the phase passes π/2 (right) and 3π/2 (left).
      const strike = humanoidPose(rig.id, 'walk', 0, { phase: Math.PI / 2 + 0.02, speed: 1 });
      const s = solve(orderJoints(rig), strike.angles, strike.offsets);
      const r = sole(rig, s, 'R');
      expect(r.heel[1], `${rig.id} heel down`).toBeGreaterThan(-0.4);
      expect(r.heel[0], `${rig.id} ahead`).toBeGreaterThan(s.get('legR')!.x);
      // Down: the knee of the planted leg bends to take the weight.
      const down = humanoidPose(rig.id, 'walk', 0, { phase: Math.PI / 2 + 0.6, speed: 1 });
      expect(down.angles.shinR!, rig.id).toBeGreaterThan(0.12);
      // Passing: the swinging knee is well bent.
      const pass = humanoidPose(rig.id, 'walk', 0, { phase: Math.PI * 1.1, speed: 1 });
      expect(pass.angles.shinL!, rig.id).toBeGreaterThan(0.6);
    }
  });
});

describe('acting poses: laugh, kahkaha, smash', () => {
  const rigs: RigDef[] = [RIG_GORTI_HUMAN_BALD, RIG_GORTI_HUMAN, RIG_GORTI_SUIT, RIG_GORTI_CHILD, RIG_GORTI_YOUTH, RIG_GORTI_WARRIOR, RIG_COWARD];
  const at = (rig: RigDef, anim: string, t: number, prm = {}) => {
    const p = humanoidPose(rig.id, anim, t, prm);
    return { p, s: solve(orderJoints(rig), p.angles, p.offsets) };
  };
  /** Where a hand's palm is (root frame). */
  const palm = (rig: RigDef, s: ReturnType<typeof solve>, side: 'R' | 'L'): [number, number] => {
    const f = s.get(`fore${side}`)!;
    const len = profileOf(rig.id).hand * 0.82;
    return [f.x - Math.sin(f.rot) * len, f.y + Math.cos(f.rot) * len];
  };

  it('keeps the feet on the ground while laughing', () => {
    for (const rig of rigs) {
      for (const anim of ['laugh', 'kahkaha']) {
        for (const t of [0.4, 0.73, 1.1]) {
          const { s } = at(rig, anim, t);
          for (const f of ['footR', 'footL']) {
            const y = s.get(f)!.y;
            expect(y, `${rig.id} ${anim} ${f}`).toBeLessThan(-4);
            expect(y, `${rig.id} ${anim} ${f}`).toBeGreaterThan(-9);
          }
        }
      }
    }
  });

  it('holds the belly with both hands, the head thrown back', () => {
    for (const rig of [RIG_GORTI_HUMAN_BALD, RIG_GORTI_CHILD, RIG_GORTI_YOUTH, RIG_GORTI_WARRIOR]) {
      const { p, s } = at(rig, 'laugh', 0.9);
      const torso = s.get('torso')!;
      const [bx, by] = profileOf(rig.id).belly!;
      const belly: [number, number] = [torso.x + bx * Math.cos(torso.rot) - by * Math.sin(torso.rot), torso.y + bx * Math.sin(torso.rot) + by * Math.cos(torso.rot)];
      for (const side of ['R', 'L'] as const) {
        const [hx, hy] = palm(rig, s, side);
        expect(Math.hypot(hx - belly[0], hy - belly[1]), `${rig.id} ${side}`).toBeLessThan(8);
      }
      expect(p.angles.head!).toBeLessThan(-0.25);
      expect(p.frames?.mouth).toBe('laugh');
      expect(p.frames?.eyeN).toBe('happy');
    }
  });

  it('bounces with every "ha" and eases in and out on k', () => {
    const ys = [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.18, 0.21].map((t) => hipsY(humanoidPose('gorti.human.bald', 'laugh', 1 + t)));
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(1.2);
    const rest = humanoidPose('gorti.human.bald', 'idle', 0);
    const start = humanoidPose('gorti.human.bald', 'laugh', 0.5, { k: 0 });
    expect(start.angles.armR).toBeCloseTo(rest.angles.armR!, 5);
    expect(start.angles.torso).toBeCloseTo(rest.angles.torso!, 5);
  });

  it('throws an arm up in the roaring laugh, leaning back', () => {
    for (const rig of rigs) {
      const { p, s } = at(rig, 'kahkaha', 1);
      const [, hy] = palm(rig, s, 'R');
      expect(hy, rig.id).toBeLessThan(s.get('armR')!.y - 10);
      expect(p.angles.torso!).toBeLessThan(-0.1);
    }
  });

  it('smashes: wind-up, a blow over the top, impact, recovery', () => {
    for (const rig of rigs) {
      const L = profileOf(rig.id).thigh + profileOf(rig.id).shin;
      // Wound up: the fist cocked behind and above the shoulder, a knee up.
      const w = at(rig, 'smash', 0, { k: 0.4 });
      const [wx, wy] = palm(rig, w.s, 'R');
      expect(wx, rig.id).toBeLessThan(w.s.get('armR')!.x);
      expect(wy, rig.id).toBeLessThan(w.s.get('armR')!.y);
      expect(w.s.get('footR')!.y, rig.id).toBeLessThan(-L * 0.3);
      // The blow swings forward over the top, never back through the legs.
      let last = -Infinity;
      for (let k = 0.42; k <= SMASH.impact + 1e-9; k += 0.01) {
        const a = humanoidPose(rig.id, 'smash', 0, { k }).angles.armR!;
        expect(a).toBeGreaterThanOrEqual(last - 1e-9);
        last = a;
      }
      // Impact: low, the fist hammered down in front, both feet down, squashed.
      const h = at(rig, 'smash', 0, { k: SMASH.impact + 0.02 });
      const [hx, hy] = palm(rig, h.s, 'R');
      expect(hx, rig.id).toBeGreaterThan(h.s.get('armR')!.x + 8);
      expect(hy, rig.id).toBeGreaterThan(h.s.get('armR')!.y + 8);
      expect(hipsY(h.p) - hipsY(w.p), rig.id).toBeGreaterThan(L * 0.2);
      for (const f of ['footR', 'footL']) expect(h.s.get(f)!.y, `${rig.id} ${f}`).toBeGreaterThan(-12);
      expect(h.p.sy!).toBeLessThan(0.95);
      // Recovered: back in the stance.
      const end = humanoidPose(rig.id, 'smash', 0, { k: 1 });
      const rest = humanoidPose(rig.id, 'idle', 0);
      for (const id of ['torso', 'armR', 'foreR', 'armL', 'foreL']) expect(end.angles[id], `${rig.id} ${id}`).toBeCloseTo(rest.angles[id]!, 3);
    }
    // Played on time it is the same move.
    const byT = humanoidPose('gorti.human.bald', 'smash', SMASH.dur * 0.3);
    const byK = humanoidPose('gorti.human.bald', 'smash', 0, { k: 0.3 });
    expect(byT.angles).toEqual(byK.angles);
  });
});

describe('faces', () => {
  it('shows emotions with the eyes and the mouth', () => {
    const joy = humanoidPose('gorti.root', 'idle', 0, { emote: 'joy', emoteK: 1 });
    expect(joy.frames?.eyeN).toBe('happy');
    expect(joy.frames?.mouth).toBe('grin');
    const surprise = humanoidPose('gorti.root', 'idle', 0, { emote: 'surprise', emoteK: 1 });
    expect(surprise.scales?.eyeN?.x).toBeGreaterThan(1.2);
    expect(surprise.frames?.mouth).toBe('open');
    const worry = humanoidPose('gorti.human', 'idle', 0, { emote: 'worry', emoteK: 1 });
    expect(worry.frames?.eyeN).toBe('sad');
  });

  it('blinks, and the suited Gorti looks worn out', () => {
    const blink = humanoidPose('gorti.root', 'idle', 0, { blink: 1 });
    expect(blink.scales?.eyeN?.y).toBeLessThan(0.2);
    const suit = humanoidPose('gorti.suit', 'idle', 0);
    expect(suit.frames?.eyeN).toBe('sad');
    expect(suit.frames?.mouth).toBe('frown');
  });

  it('is happy at the top of a jump and wide-eyed in a long drop', () => {
    expect(humanoidPose('gorti.root', 'apex', 0).frames?.eyeN).toBe('happy');
    const drop = humanoidPose('gorti.root', 'fall', 0, { vy: 700 });
    expect(drop.scales?.eyeN?.y).toBeGreaterThan(1.2);
    expect(drop.frames?.mouth).toBe('open');
  });
});

describe('idle actions', () => {
  it('start after standing still for a while and take turns', () => {
    expect(idleAction(2, 'root')).toBeNull();
    expect(idleAction(4.9, 'root')?.kind).toBe('look');
    expect(idleAction(12.8, 'root')?.kind).toBe('stretch');
    expect(idleAction(21.2, 'root')?.kind).toBe('hum');
    expect(idleAction(28.9, 'root')?.kind).toBe('scratch');
    // A rest between actions.
    expect(idleAction(10, 'root')).toBeNull();
    expect(idleAction(12.8, 'coward')?.kind).toBe('look');
    expect(idleAction(12.8, 'suit')).toBeNull();
  });
});

describe('rig parts', () => {
  const keys = new Set(allParts().map((p) => p.key));

  it('draws every joint of every rig from existing art', () => {
    const missing: string[] = [];
    for (const r of allRigs()) for (const j of r.joints) if (j.part && !keys.has(j.part)) missing.push(`${r.id}:${j.part}`);
    expect(missing).toEqual([]);
  });

  it('gives Gorti and the torch-bearer every eye and mouth shape', () => {
    for (const rig of [RIG_GORTI_CHILD, RIG_GORTI_YOUTH, RIG_GORTI_WARRIOR, RIG_GORTI_HUMAN, RIG_GORTI_HUMAN_SUN, RIG_GORTI_HUMAN_BALD, RIG_GORTI_SUIT, RIG_COWARD]) {
      const eye = rig.joints.find((j) => j.id === 'eyeN')!.part!;
      const mouth = rig.joints.find((j) => j.id === 'mouth')!.part!;
      for (const v of ['happy', 'sad', 'shut']) expect(keys.has(`${eye}.${v}`), `${rig.id} ${eye}.${v}`).toBe(true);
      for (const v of ['smile', 'open', 'grin', 'grit', 'frown', 'laugh']) expect(keys.has(`${mouth}.${v}`), `${rig.id} ${mouth}.${v}`).toBe(true);
    }
  });

  it('puts the three Sivaslı heads on one body, so they swap', () => {
    const body = (r: typeof RIG_GORTI_HUMAN): string[] =>
      r.joints.filter((j) => j.parent === null || !['head', 'eyeN', 'browN', 'browF', 'mouth'].includes(j.parent ?? '') && !['eyeN', 'browN', 'browF', 'mouth'].includes(j.id)).map((j) => `${j.id}:${j.parent}:${j.x},${j.y}:${j.id === 'head' ? '' : j.part}`);
    expect(body(RIG_GORTI_HUMAN_BALD)).toEqual(body(RIG_GORTI_HUMAN));
    expect(body(RIG_GORTI_HUMAN_SUN)).toEqual(body(RIG_GORTI_HUMAN));
    const bald = humanoidPose(RIG_GORTI_HUMAN_BALD.id, 'idle', 0, { emote: 'laugh', emoteK: 1 });
    expect(bald.frames?.mouth).toBe('laugh');
    expect(bald.frames?.eyeN).toBe('happy');
    // Lidded eyes close on their shut shape in a blink.
    expect(humanoidPose(RIG_GORTI_HUMAN_BALD.id, 'idle', 0, { blink: 1 }).frames?.eyeN).toBe('shut');
  });

  it('lets the youth\'s branch tendrils sway on springs', () => {
    const hair = RIG_GORTI_YOUTH.joints.filter((j) => j.id.startsWith('hair'));
    expect(hair).toHaveLength(5);
    for (const j of hair) {
      expect(j.parent).toBe('head');
      expect(j.spring?.k).toBeGreaterThan(0);
    }
  });
});

describe('Gorti grows up and his head follows the sky', () => {
  it('picks the body of the life stage and the Sun or Moon head per room', () => {
    expect(rootRigFor('r01')).toBe(RIG_GORTI_CHILD);
    expect(rootRigFor('r05')).toBe(RIG_GORTI_YOUTH);
    expect(rootRigFor('r09')).toBe(RIG_GORTI_WARRIOR);
    expect(humanRigFor('r06')).toBe(RIG_GORTI_HUMAN);
    expect(humanRigFor('r07')).toBe(RIG_GORTI_HUMAN_SUN);
    expect(humanRigFor('r08')).toBe(RIG_GORTI_HUMAN_SUN);
  });
});
