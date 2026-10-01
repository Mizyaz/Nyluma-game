import { app } from '../App';
import { mixColor, type Mood, type PaperLight } from '../../paper/light';
import type { PaperStage } from '../../paper/stage';
import type { SkyScene } from './SkyScene';

// The Sun and the Moon are the room's own lamps. Each hangs before the torn
// front on the line from the eye through its face on screen, so its light
// comes from where the face shows. The one that is out lights the room and
// throws the figures' shadows (Gorti's kahkaha swings them to the other
// side); the other only glows. They shine with their faces: they breathe,
// blink, laugh and talk. Under the Sun the room's air warms and lifts; under
// the Moon it turns cold blue and darker. A daylight mood takes none of it.

/** How far before the actors' plane the lamps hang (world px; the box's front is at about 170). */
const LAMP_Z = 300;
/** Each lamp at full strength: its colour, strength and reach (world px). */
const LAMP: Record<'sun' | 'baby' | 'old', { color: number; intensity: number; radius: number }> = {
  sun: { color: 0xffcf7a, intensity: 1.15, radius: 1800 },
  baby: { color: 0xd4caff, intensity: 0.85, radius: 1700 },
  old: { color: 0xa9bdff, intensity: 0.8, radius: 1700 },
};
/** A lamp's strength while the other one is out (it never goes dark). */
const LOW = 0.12;
/** How far `shining` goes with neither out (the room's light is then shared). */
const EVEN = 0.39;
/**
 * The room's air under each, all the way out: the colour the ambient and
 * the fog lean to (and how far), the ambient's strength, and how much of
 * the mood's key light is left (the one that is out takes its place).
 */
const AIR = {
  sun: { color: 0xffd8a4, fog: 0x5b4462, mix: 0.32, ambient: 1.12, key: 0.35 },
  moon: { color: 0x6676d2, fog: 0x232c5e, mix: 0.42, ambient: 0.76, key: 0.3 },
};

type Shine = NonNullable<ReturnType<SkyScene['shining']>>;

export class SkyLamps {
  private readonly sun: PaperLight;
  private readonly moon: PaperLight;
  private sunAt: { x: number; y: number } | null = null;
  private moonAt: { x: number; y: number } | null = null;
  /** The room's mood as it was made, and the copy the sky changes. */
  private base!: Mood;
  private mood!: Mood;

  constructor(
    private readonly paper: PaperStage,
    private readonly sky: () => SkyScene | null,
  ) {
    const l = paper.lighting;
    this.rebase(l.mood);
    this.sun = l.add({ x: 0, y: 0, z: LAMP_Z, color: LAMP.sun.color, radius: LAMP.sun.radius, intensity: 0, follow: () => this.sunAt });
    this.moon = l.add({ x: 0, y: 0, z: LAMP_Z, color: LAMP.baby.color, radius: LAMP.baby.radius, intensity: 0, follow: () => this.moonAt });
  }

  /** Once a frame, after the eye has moved. */
  update(): void {
    const l = this.paper.lighting;
    if (l.mood !== this.mood) this.rebase(l.mood);
    const sky = this.sky();
    const day = this.base.ambient >= 0.9;
    const sun = sky && !day ? sky.shining('sun') : null;
    const moon = sky && !day ? sky.shining('moon') : null;
    this.sunAt = this.hang(this.sun, sun);
    this.moonAt = this.hang(this.moon, moon);
    this.air(out(sun), out(moon));
  }

  /** Puts a lamp behind its face and sets how bright it is; null hides it. */
  private hang(lamp: PaperLight, at: Shine | null): { x: number; y: number } | null {
    if (!at) return null;
    const look = LAMP[at.kind];
    // The face's own flicker, gentler for those who asked for less motion.
    const glow = app.settings.reducedMotion ? 1 + (at.glow - 1) * 0.25 : at.glow;
    lamp.color = look.color;
    lamp.radius = look.radius;
    lamp.intensity = look.intensity * (LOW + (1 - LOW) * at.out) * glow;
    return this.paper.lens.unproject(at.x, at.y, LAMP_Z);
  }

  /** The room's air leans to the one that is out (0 … 1 for each). */
  private air(sun: number, moon: number): void {
    const b = this.base;
    const m = this.mood;
    m.ambient = b.ambient * (1 + (AIR.sun.ambient - 1) * sun + (AIR.moon.ambient - 1) * moon);
    m.ambientColor = mixColor(mixColor(b.ambientColor, AIR.sun.color, AIR.sun.mix * sun), AIR.moon.color, AIR.moon.mix * moon);
    m.fog.color = mixColor(mixColor(b.fog.color, AIR.sun.fog, AIR.sun.mix * sun), AIR.moon.fog, AIR.moon.mix * moon);
    if (m.key && b.key) m.key.intensity = b.key.intensity * Math.max(0, 1 - (1 - AIR.sun.key) * sun - (1 - AIR.moon.key) * moon);
  }

  /** Takes a mood the room was given as the one the sky now changes (a copy: moods are shared). */
  private rebase(mood: Mood): void {
    this.base = mood;
    this.mood = { ...mood, fog: { ...mood.fog }, key: mood.key && { ...mood.key } };
    this.paper.lighting.mood = this.mood;
  }

  destroy(): void {
    this.paper.lighting.remove(this.sun);
    this.paper.lighting.remove(this.moon);
    this.paper.lighting.mood = this.base;
  }
}

/** How far a face is out beyond sharing the sky (0 … 1). */
function out(s: Shine | null): number {
  return s ? Math.min(1, Math.max(0, (s.out - EVEN) / (1 - EVEN))) : 0;
}
