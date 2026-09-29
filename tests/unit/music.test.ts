import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Composer } from '../../src/music/composer';
import { ALLOWED_LICENSES, checkLibrary, tracksFor } from '../../src/music/library';
import { MOODS } from '../../src/music/moods';
import { chordPcs, pc } from '../../src/music/theory';
import { MUSIC_CUES, type Bar, type Mood } from '../../src/music/types';
import { ROOMS } from '../../src/game/data/rooms';

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

  for (const cue of MUSIC_CUES) {
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
    for (const cue of MUSIC_CUES) {
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

  it('keeps only licenses that allow use in the game', () => {
    expect(Object.keys(ALLOWED_LICENSES).sort()).toEqual(['CC-BY-3.0', 'CC-BY-4.0', 'CC0-1.0', 'PDM-1.0']);
  });

  it('the repository library (music/) is valid', () => {
    const json: unknown = JSON.parse(readFileSync('music/tracks.json', 'utf8'));
    const r = checkLibrary(json, (p) => existsSync(join('music', p)));
    expect(r.errors).toEqual([]);
  });
});
