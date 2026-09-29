import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CAST_IDS, CAST_NAMES, type CastId } from '../../src/game/cinematics/castNames';
import { voiceOf } from '../../src/game/cinematics/voice';
import { DIALOGUE } from '../../src/game/data/dialogue.tr';

const SCRIPTS = join(__dirname, '../../src/game/rooms/scripts');

const sources = readdirSync(SCRIPTS)
  .filter((f) => f.endsWith('.ts'))
  .map((file) => ({ file, src: readFileSync(join(SCRIPTS, file), 'utf8') }));

/** Every `cs.talk(DIALOGUE.<key>…, [cast])` in the room scripts. */
function talks(): { file: string; key: string; cast: string[] }[] {
  const out: { file: string; key: string; cast: string[] }[] = [];
  for (const { file, src } of sources) {
    for (const m of src.matchAll(/\.talk\(\s*\[?\s*DIALOGUE\.(\w+)[^;]*?,\s*\[([^\]]*)\]\s*\)/g)) {
      out.push({ file, key: m[1]!, cast: [...m[2]!.matchAll(/'(\w+)'/g)].map((c) => c[1]!) });
    }
  }
  return out;
}

describe('face-animated dialogue scenes', () => {
  it('gives every cast member a distinct speaking name', () => {
    const names = CAST_IDS.map((id) => CAST_NAMES[id]);
    for (const n of names) expect(n.length).toBeGreaterThan(0);
    expect(new Set(names).size).toBe(names.length);
  });

  it('is used in the rooms, only with known cast members', () => {
    const all = talks();
    // Every call was understood (none written in a shape the check misses).
    const calls = sources.reduce((n, s) => n + (s.src.match(/\.talk\(/g) ?? []).length, 0);
    expect(all.length).toBe(calls);
    expect(all.length).toBeGreaterThanOrEqual(15);
    for (const t of all) {
      expect(t.cast.length, `${t.file}: ${t.key}`).toBeGreaterThan(0);
      expect(t.cast.length, `${t.file}: ${t.key}`).toBeLessThanOrEqual(3);
      for (const id of t.cast) expect(CAST_IDS as readonly string[], `${t.file}: ${t.key}`).toContain(id);
    }
  });

  it('frames everyone who speaks in a scene', () => {
    for (const t of talks()) {
      const lines = DIALOGUE[t.key];
      expect(lines, `${t.file}: DIALOGUE.${t.key}`).toBeDefined();
      const names = t.cast.map((id) => CAST_NAMES[id as CastId]);
      for (const l of lines!) if (l.who) expect(names, `${t.file}: "${l.text}"`).toContain(l.who);
    }
  });

  it('reads how a line sounds', () => {
    expect(voiceOf(null)).toBe('say');
    expect(voiceOf({ who: 'Gorti', text: 'Yalanlar!' })).toBe('shout');
    expect(voiceOf({ who: 'Gorti', text: 'Yalanlar! ' })).toBe('shout');
    expect(voiceOf({ who: 'Gorti', text: 'Buradayım.' })).toBe('say');
    expect(voiceOf({ who: 'Ulu Ay', text: 'Sus!', whisper: true })).toBe('whisper');
  });
});
