import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Composer } from '../../src/music/composer';
import { SCORES, composeCue } from '../../src/music/cues';
import { ALLOWED_LICENSES, checkLibrary, tracksFor } from '../../src/music/library';
import { MOODS, STRING_MOODS } from '../../src/music/moods';
import { StringComposer } from '../../src/music/stringComposer';
import { chordPcs, pc } from '../../src/music/theory';
import { MUSIC_CUES, PIANO_CUES, STRING_CUES, type Bar, type Mood, type NoteEvent, type SectionKind } from '../../src/music/types';
import { ROOMS } from '../../src/game/data/rooms';
import { AudioSystem } from '../../src/game/systems/AudioSystem';

function write(mood: Mood, seed: number, bars: number): Bar[] {
  const c = new Composer(mood, seed);
  return Array.from({ length: bars }, () => c.next());
}

/** In the key, allowing the raised leading tone over V in harmonic minor. */
function fitsKey(mood: Mood, midi: number, degree: number): boolean {
  const rel = pc(midi - mood.tonic);
  return mood.scale.includes(rel) || (!!mood.raiseLeading && degree === 4 && rel === 11);
}

describe('music: composer', () => {
  const FORM_BARS = 8 + 8 + 8 + 8 + 2;

  for (const cue of PIANO_CUES) {
    const mood = MOODS[cue];

    it(`${cue}: bars keep time, stay in key and in register`, () => {
      const beat = 60 / mood.bpm;
      for (const bar of write(mood, 7, FORM_BARS * 2)) {
        expect(bar.len).toBeGreaterThanOrEqual(mood.beats * beat - 1e-9);
        expect(bar.len).toBeLessThanOrEqual(mood.beats * beat * 1.08 + 1e-9);
        for (const n of bar.notes) {
          expect(n.t).toBeGreaterThanOrEqual(0);
          expect(n.t).toBeLessThan(bar.len);
          expect(n.off).toBeGreaterThan(n.t);
          expect(n.vel).toBeGreaterThan(0);
          expect(n.vel).toBeLessThanOrEqual(1);
          expect(fitsKey(mood, n.midi, bar.degree), `${cue} ${n.midi} over degree ${bar.degree}`).toBe(true);
          if (n.hand === 'L') {
            expect(n.midi).toBeGreaterThanOrEqual(mood.lhLow - 3);
            expect(n.midi).toBeLessThanOrEqual(mood.lhLow + 14 + 19);
          } else if (n.midi < 84) {
            // Melody (sparkle notes sit above 84 on purpose).
            expect(n.midi).toBeGreaterThanOrEqual(mood.melody[0]);
            expect(n.midi).toBeLessThanOrEqual(mood.melody[1] + 1);
          }
        }
      }
    });

    it(`${cue}: melody lands on chord tones on strong beats`, () => {
      const beat = 60 / mood.bpm;
      let strong = 0;
      for (const bar of write(mood, 11, FORM_BARS)) {
        const chord = chordPcs(mood.tonic, mood.scale, bar.degree, mood.raiseLeading);
        const stretch = bar.len / (mood.beats * beat);
        for (const n of bar.notes) {
          if (n.hand !== 'R' || n.midi >= 84) continue;
          const b = n.t / (beat * stretch);
          const onStrong = b < 0.05 || (mood.beats === 4 && Math.abs(b - 2) < 0.05);
          if (!onStrong) continue;
          strong++;
          expect(chord, `${cue}: ${n.midi} at beat ${b.toFixed(2)} over degree ${bar.degree}`).toContain(pc(n.midi));
        }
      }
      expect(strong).toBeGreaterThan(8);
    });
  }

  it('colours chords only with major ninths (no minor-ninth clash in the left hand)', () => {
    for (const cue of PIANO_CUES) {
      const mood = MOODS[cue];
      for (const bar of write(mood, 9, 68)) {
        const root = chordPcs(mood.tonic, mood.scale, bar.degree, mood.raiseLeading)[0]!;
        for (const n of bar.notes) if (n.hand === 'L') expect(pc(n.midi - root), `${cue} degree ${bar.degree}`).not.toBe(1);
      }
    }
  });

  it('follows the form A A2 B A3 interlude and closes with the cadence', () => {
    const mood = MOODS.menu;
    const bars = write(mood, 3, FORM_BARS + 1);
    const kinds = bars.map((b) => b.section);
    expect(kinds.slice(0, 8).every((k) => k === 'A')).toBe(true);
    expect(kinds.slice(8, 16).every((k) => k === 'A2')).toBe(true);
    expect(kinds.slice(16, 24).every((k) => k === 'B')).toBe(true);
    expect(kinds.slice(24, 32).every((k) => k === 'A3')).toBe(true);
    expect(kinds.slice(32, 34)).toEqual(['interlude', 'interlude']);
    expect(kinds[34]).toBe('A');
    expect([bars[30]!.degree, bars[31]!.degree]).toEqual([4, 0]);
    expect([write(MOODS.roots, 3, 32)[30]!.degree, write(MOODS.roots, 3, 32)[31]!.degree]).toEqual([6, 0]);
    // The interlude is accompaniment (plus music-box sparkle) only.
    for (const b of bars.slice(32, 34)) expect(b.notes.filter((n) => n.hand === 'R' && n.midi < 84)).toEqual([]);
  });

  it('restates its opening motif (the melody has a theme, not only random notes)', () => {
    const bars = write(MOODS.menu, 5, 4);
    const rhythm = (b: Bar): string => b.notes.filter((n) => n.hand === 'R' && n.midi < 84).map((n) => (n.t / b.len).toFixed(1)).join(',');
    expect(rhythm(bars[2]!)).toBe(rhythm(bars[0]!));
    expect(rhythm(bars[3]!)).toBe(rhythm(bars[1]!));
  });

  it('is deterministic for a seed and varies across seeds', () => {
    const a = JSON.stringify(write(MOODS.forest, 42, 40));
    expect(JSON.stringify(write(MOODS.forest, 42, 40))).toBe(a);
    expect(JSON.stringify(write(MOODS.forest, 43, 40))).not.toBe(a);
  });

  it('gives every room a cue the music module knows', () => {
    for (const r of Object.values(ROOMS)) expect([...MUSIC_CUES, 'none']).toContain(r.music);
  });
});

describe('music: string ensemble (tension)', () => {
  const FORM_BARS = 8 + 8 + 8 + 8 + 2;
  const mood = STRING_MOODS.tension;
  const beat = 60 / mood.bpm;
  const writeStrings = (seed: number, bars: number): Bar[] => {
    const c = new StringComposer(mood, seed);
    return Array.from({ length: bars }, () => c.next());
  };
  const chordOf = (b: Bar): number[] => chordPcs(mood.tonic, mood.scale, b.degree, mood.raiseLeading);
  const low = (b: Bar): NoteEvent[] => b.notes.filter((n) => n.inst === 'low-strings');
  const high = (b: Bar): NoteEvent[] => b.notes.filter((n) => n.inst === 'high-strings');
  const mean = (v: number[]): number => v.reduce((a, x) => a + x, 0) / v.length;

  it('is dark: D phrygian (minor with a lowered second) in 4/4', () => {
    expect(pc(mood.tonic)).toBe(2);
    expect([...mood.scale]).toEqual([0, 1, 3, 5, 7, 8, 10]);
    expect(mood.beats).toBe(4);
  });

  for (const seed of [1, 7, 99]) {
    it(`seed ${seed}: bars keep time, stay in the scale, each section in its register`, () => {
      for (const bar of writeStrings(seed, FORM_BARS * 2)) {
        expect(bar.len).toBeGreaterThanOrEqual(mood.beats * beat - 1e-9);
        expect(bar.len).toBeLessThanOrEqual(mood.beats * beat * 1.08 + 1e-9);
        for (const n of bar.notes) {
          expect(n.t).toBeGreaterThanOrEqual(0);
          expect(n.t).toBeLessThan(bar.len);
          expect(n.off).toBeGreaterThan(n.t);
          expect(n.vel).toBeGreaterThan(0);
          expect(n.vel).toBeLessThanOrEqual(1);
          expect(mood.scale, `${n.midi}`).toContain(pc(n.midi - mood.tonic));
          if (n.inst === 'low-strings') {
            expect(n.hand).toBe('L');
            expect(n.midi).toBeGreaterThanOrEqual(mood.low[0]);
            expect(n.midi).toBeLessThanOrEqual(mood.low[1]);
          } else {
            expect(n.inst).toBe('high-strings');
            expect(n.hand).toBe('R');
            expect(n.midi).toBeGreaterThanOrEqual(mood.high[0]);
            expect(n.midi).toBeLessThanOrEqual(mood.high[1]);
          }
        }
      }
    });
  }

  it('both sections play in every bar: a relentless low pulse under the violins', () => {
    for (const bar of writeStrings(3, FORM_BARS * 2)) {
      expect(high(bar).length, bar.section).toBeGreaterThan(0);
      const onsets = [...new Set(low(bar).map((n) => n.t))].sort((a, b) => a - b);
      expect(onsets[0]).toBe(0);
      if (bar.section === 'interlude') {
        expect(onsets.length).toBeGreaterThanOrEqual(4);
        continue;
      }
      // Never more than an eighth note between strokes.
      const eighth = bar.len / (mood.beats * 2);
      for (let k = 1; k < onsets.length; k++) expect(onsets[k]! - onsets[k - 1]!).toBeLessThanOrEqual(eighth + 0.01);
      expect(bar.len - onsets[onsets.length - 1]!).toBeLessThanOrEqual(eighth + 0.01);
    }
  });

  it('the low strings play the chord root, basses and cellos an octave apart', () => {
    for (const bar of writeStrings(5, FORM_BARS * 2)) {
      const root = chordOf(bar)[0]!;
      for (const n of low(bar)) expect(pc(n.midi), `degree ${bar.degree}`).toBe(root);
      const pitches = [...new Set(low(bar).map((n) => n.midi))].sort((a, b) => a - b);
      expect(pitches).toHaveLength(2);
      expect(pitches[1]! - pitches[0]!).toBe(12);
    }
  });

  it('the line climbs higher in the bridge than in the opening', () => {
    for (const seed of [1, 2, 3, 4]) {
      const bars = writeStrings(seed, FORM_BARS);
      const top = (k: SectionKind): number => Math.max(...bars.filter((b) => b.section === k).flatMap((b) => high(b).map((n) => n.midi)));
      expect(top('B')).toBeGreaterThan(top('A'));
    }
  });

  it('lands on chord tones on strong beats and resolves every held dissonance a step down', () => {
    let suspensions = 0;
    for (const seed of [2, 8, 21]) {
      const bars = writeStrings(seed, FORM_BARS * 2);
      bars.forEach((bar, k) => {
        const chord = chordOf(bar);
        const stretch = bar.len / (mood.beats * beat);
        for (const n of high(bar)) {
          const b = n.t / (beat * stretch);
          if (b < 0.05 || Math.abs(b - 2) < 0.05) expect(chord, `bar ${k}: ${n.midi} at beat ${b.toFixed(2)}`).toContain(pc(n.midi));
        }
        const next = bars[k + 1];
        if (!next) return;
        const nextChord = chordOf(next);
        for (const n of high(bar)) {
          if (n.off <= bar.len + 0.15 || nextChord.includes(pc(n.midi))) continue;
          // A suspension: prepared as a chord tone, held into a chord it clashes
          // with, then a step down onto one of that chord's tones before it lets go.
          suspensions++;
          expect(chord, `bar ${k}: ${n.midi} prepared`).toContain(pc(n.midi));
          const held = n.off - bar.len;
          const r = high(next).find((x) => x.t > 0.1 && x.t <= held && n.midi - x.midi >= 1 && n.midi - x.midi <= 2 && nextChord.includes(pc(x.midi)));
          expect(r, `bar ${k}: ${n.midi} held into degree ${next.degree}`).toBeDefined();
        }
      });
    }
    expect(suspensions).toBeGreaterThan(10);
  });

  it('uses its articulations: ostinato pulse, legato lines, tremolo inner voices, marcato hits', () => {
    const bars = writeStrings(4, FORM_BARS);
    expect([...new Set(bars.flatMap((b) => b.notes.map((n) => n.art)))].sort()).toEqual(['legato', 'marcato', 'ostinato', 'tremolo']);
    for (const b of bars) for (const n of low(b)) expect(['ostinato', 'marcato']).toContain(n.art);
    // The whole ensemble strikes as the piece starts (a scene opens), when the
    // bridge arrives and on the cadence.
    const hit = (b: Bar): boolean => ['low-strings', 'high-strings'].every((inst) => b.notes.some((n) => n.inst === inst && n.art === 'marcato' && n.t < 0.01));
    expect(hit(bars[0]!)).toBe(true);
    expect(hit(bars[16]!)).toBe(true);
    expect(hit(bars[31]!)).toBe(true);
  });

  it('follows the form and closes with the phrygian cadence bII → i', () => {
    const bars = writeStrings(6, FORM_BARS + 1);
    const kinds = bars.map((b) => b.section);
    expect(kinds).toEqual([...Array<string>(8).fill('A'), ...Array<string>(8).fill('A2'), ...Array<string>(8).fill('B'), ...Array<string>(8).fill('A3'), 'interlude', 'interlude', 'A']);
    expect([bars[30]!.degree, bars[31]!.degree]).toEqual([1, 0]);
    // The interlude breathes: the pulse and a high tremolo, no line.
    for (const b of bars.slice(32, 34)) expect(high(b).every((n) => n.art === 'tremolo')).toBe(true);
  });

  it('swells: each section grows toward its end, and the bridge is louder than the opening', () => {
    for (const seed of [1, 2, 3]) {
      const bars = writeStrings(seed, FORM_BARS);
      const part = (k: SectionKind): Bar[] => bars.filter((b) => b.section === k);
      const pulse = (bs: Bar[]): number => mean(bs.flatMap((b) => low(b).filter((n) => n.art === 'ostinato').map((n) => n.vel)));
      const all = (bs: Bar[]): number => mean(bs.flatMap((b) => b.notes.map((n) => n.vel)));
      for (const k of ['A', 'A2', 'B', 'A3'] as const) {
        const sec = part(k);
        expect(pulse(sec.slice(-2)), k).toBeGreaterThan(pulse(sec.slice(0, 2)));
        expect(all(sec.slice(-2)), k).toBeGreaterThan(all(sec.slice(0, 2)));
      }
      expect(all(part('B'))).toBeGreaterThan(all(part('A')));
    }
  });

  it('is deterministic for a seed, varies across seeds and from one cycle to the next', () => {
    const a = JSON.stringify(writeStrings(42, 40));
    expect(JSON.stringify(writeStrings(42, 40))).toBe(a);
    expect(JSON.stringify(writeStrings(43, 40))).not.toBe(a);
    const two = writeStrings(42, FORM_BARS * 2);
    const line = (bars: Bar[]): string => bars.flatMap((b) => high(b).filter((n) => n.art === 'legato').map((n) => n.midi)).join(',');
    expect(line(two.slice(FORM_BARS))).not.toBe(line(two.slice(0, FORM_BARS)));
  });
});

describe('music: cues', () => {
  it('every cue has generated music; the dialogue cue is played by the strings', () => {
    expect(MUSIC_CUES).toContain('tension');
    expect([...PIANO_CUES, ...STRING_CUES].sort()).toEqual([...MUSIC_CUES].sort());
    for (const cue of PIANO_CUES) expect(SCORES[cue].source).toBe('piano');
    for (const cue of STRING_CUES) expect(SCORES[cue].source).toBe('strings');
    for (const n of composeCue('tension', 1).next().notes) expect(n.inst).toMatch(/strings$/);
  });

  it('piano cues are written exactly as before, and their notes default to the piano', () => {
    for (const cue of PIANO_CUES) {
      const a = composeCue(cue, 5);
      const b = new Composer(MOODS[cue], 5);
      for (let i = 0; i < 36; i++) {
        const bar = a.next();
        expect(bar).toEqual(b.next());
        for (const n of bar.notes) expect([n.inst, n.art]).toEqual([undefined, undefined]);
      }
    }
  });
});

describe('music: library', () => {
  const good = {
    id: 'calm-piano',
    title: 'Calm',
    artist: 'Someone',
    file: 'tracks/calm-piano.mp3',
    license: 'CC0-1.0',
    source: 'the page it came from',
    cues: ['menu'],
  };
  const files = new Set(['tracks/calm-piano.mp3', 'licenses/calm-piano.txt']);
  const exists = (p: string): boolean => files.has(p);

  it('accepts a complete entry', () => {
    expect(checkLibrary({ tracks: [good] }, exists)).toEqual({ tracks: [good], errors: [] });
  });

  it('refuses entries without an allowed license, a license note, a file or known cues', () => {
    const cases: [Record<string, unknown>, RegExp][] = [
      [{ license: 'CC-BY-NC-4.0' }, /izinli değil/],
      [{ id: 'other' }, /lisans notu yok/],
      [{ file: 'tracks/missing.mp3' }, /ses dosyası yok/],
      [{ file: '../secret.mp3' }, /içinde olmalı/],
      [{ file: 'tracks/calm-piano.txt' }, /ses dosyası olmalı/],
      [{ file: undefined, url: 'http://example.invalid/a.mp3' }, /https/],
      [{ cues: ['boss'] }, /bilinmeyen cue/],
      [{ cues: [] }, /cues/],
      [{ title: '' }, /title/],
      [{ volume: 3 }, /volume/],
    ];
    for (const [patch, msg] of cases) {
      const r = checkLibrary({ tracks: [{ ...good, ...patch }] }, exists);
      expect(r.tracks, JSON.stringify(patch)).toEqual([]);
      expect(r.errors.join(' '), JSON.stringify(patch)).toMatch(msg);
    }
    expect(checkLibrary({ tracks: [good, good] }, exists).errors.join(' ')).toMatch(/iki kez/);
    expect(checkLibrary({}, exists).errors).toHaveLength(1);
  });

  it('picks pieces named for a cue before pieces for any cue', () => {
    const any = { ...good, id: 'any', cues: ['*'] };
    expect(tracksFor([good, any], 'menu').map((t) => t.id)).toEqual(['calm-piano']);
    expect(tracksFor([good, any], 'sun').map((t) => t.id)).toEqual(['any']);
    expect(tracksFor([good], 'sun')).toEqual([]);
  });

  it('knows the dialogue cue: a piece may name "tension", but "*" does not stand in for it', () => {
    const tense = { ...good, cues: ['tension'] };
    expect(checkLibrary({ tracks: [tense] }, exists)).toEqual({ tracks: [tense], errors: [] });
    const any = { ...good, id: 'any', cues: ['*'] };
    expect(tracksFor([any], 'tension')).toEqual([]);
    expect(tracksFor([any, tense], 'tension').map((t) => t.id)).toEqual(['calm-piano']);
    expect(tracksFor([any, tense], 'roots').map((t) => t.id)).toEqual(['any']);
  });

  it('keeps only licenses that allow use in the game', () => {
    expect(Object.keys(ALLOWED_LICENSES).sort()).toEqual(['CC-BY-3.0', 'CC-BY-4.0', 'CC0-1.0', 'PDM-1.0']);
  });

  it('the repository library (music/) is valid', () => {
    const json: unknown = JSON.parse(readFileSync('music/tracks.json', 'utf8'));
    const r = checkLibrary(json, (p) => existsSync(join('music', p)));
    expect(r.errors).toEqual([]);
  });
});

describe('music: scene override (AudioSystem)', () => {
  // The AudioSystem only needs event hooks from the page to be built.
  const system = (): AudioSystem => {
    const hooks = { addEventListener: (): void => undefined, removeEventListener: (): void => undefined };
    vi.stubGlobal('document', { ...hooks, visibilityState: 'visible' });
    vi.stubGlobal('window', hooks);
    return new AudioSystem();
  };
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('plays the override over the room cue, remembers room changes, then returns to the room cue', () => {
    const audio = system();
    const plays: [string, number | undefined][] = [];
    const player = {
      play: (cue: string, fade?: number): void => void plays.push([cue, fade]),
      state: () => ({ cue: plays[plays.length - 1]?.[0] ?? 'none', source: 'piano', track: null, bars: 0, notes: 0 }),
    };
    (audio as unknown as { player: typeof player }).player = player;
    audio.music('roots');
    audio.setMusicOverride('tension');
    audio.setMusicOverride('tension');
    // A room change during the dialogue is only remembered.
    audio.music('forest');
    expect(audio.currentMusic()).toBe('forest');
    expect(audio.musicState().cue).toBe('tension');
    audio.setMusicOverride(null);
    audio.setMusicOverride(null);
    expect(plays).toEqual([
      ['roots', undefined],
      ['tension', 0.8],
      ['forest', 0.8],
    ]);
    expect(audio.musicState().cue).toBe('forest');
  });

  it('before sound is unlocked, reports the cue that will play', () => {
    const audio = system();
    audio.music('sun');
    audio.setMusicOverride('tension');
    expect(audio.musicState()).toMatchObject({ cue: 'tension', source: 'none' });
    expect(audio.currentMusic()).toBe('sun');
    audio.setMusicOverride(null);
    expect(audio.musicState().cue).toBe('sun');
  });
});
