import { describe, expect, it } from 'vitest';
import { humanoidPose, idleAction } from '../../src/render/2d/rig/animPoses';
import { allParts, allRigs } from '../../src/content/art/manifest';
import { RIG_COWARD } from '../../src/content/characters/forms';
import {
  humanRigFor,
  RIG_GORTI_CHILD,
  RIG_GORTI_HUMAN,
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
    for (const rig of [RIG_GORTI_CHILD, RIG_GORTI_YOUTH, RIG_GORTI_WARRIOR, RIG_GORTI_HUMAN, RIG_GORTI_HUMAN_SUN, RIG_GORTI_SUIT, RIG_COWARD]) {
      const eye = rig.joints.find((j) => j.id === 'eyeN')!.part!;
      const mouth = rig.joints.find((j) => j.id === 'mouth')!.part!;
      for (const v of ['happy', 'sad', 'shut']) expect(keys.has(`${eye}.${v}`), `${rig.id} ${eye}.${v}`).toBe(true);
      for (const v of ['smile', 'open', 'grin', 'grit', 'frown']) expect(keys.has(`${mouth}.${v}`), `${rig.id} ${mouth}.${v}`).toBe(true);
    }
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
