import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it, vi } from 'vitest';
import story from '../../src/content/chapters/chapters.json';
import {
  checkCaptions,
  checkDialogue,
  checkDocuments,
  checkMemories,
  checkNames,
  checkPaintings,
  checkSky,
  DEFAULT_LOOK,
  linesOf,
  lookOf,
  MISSING,
  NAME_KEYS,
  type SkyText,
} from '../../src/content/text/check';
import { auditText, syntaxProblem, TEXT_FILES, textSyntax, textUse } from '../../src/content/text/audit';
import { CAPTIONS, DIALOGUE, NAMES, skyLines, skyLook, SKY_TEXT, TEXT_PROBLEMS } from '../../src/content/text/text';
import * as legacy from '../../src/content/data/dialogue.tr';
import { ROOM_IDS } from '../../src/engine/state/types';

const ROOT = join(__dirname, '../..');
const TEXT = join(ROOT, 'src/content/text');
const json = (f: string): Record<string, unknown> => JSON.parse(readFileSync(join(TEXT, f), 'utf8')) as Record<string, unknown>;
const chapters = story.chapters.map((c) => c.id);
const rooms = [...ROOM_IDS, ...story.chapters.flatMap((c) => c.rooms)];

describe('the story text as written', () => {
  it('loads without a single problem', () => {
    expect(TEXT_PROBLEMS).toEqual([]);
  });

  it('passes the full check: every key the code asks for is there, every page is real', () => {
    expect(auditText({ dir: TEXT, srcDir: join(ROOT, 'src'), root: ROOT, chapters, rooms })).toEqual([]);
  });

  it('keeps the old names for it, with the same content', () => {
    expect(legacy.NAMES).toBe(NAMES);
    expect(legacy.CAPTIONS).toBe(CAPTIONS);
    expect(legacy.DIALOGUE).toBe(DIALOGUE);
    expect(NAMES.sun).toBe(json('names.json').sun);
    expect(CAPTIONS.intro1).toBe(json('captions.json').intro1);
    // A speaker's key becomes the name the dialogue box shows.
    expect(DIALOGUE.sun!.map((l) => l.who)).toEqual([NAMES.gorti, NAMES.gorti, NAMES.sun]);
    expect(DIALOGUE.moon![1]).toEqual({ who: NAMES.babyMoon, text: expect.any(String), whisper: true });
    // What Gorti inspects in r01 reads from the same table.
    expect(DIALOGUE.eyeleaf![0]!.text).toMatch(/göz/);
  });

  it('gives every room of chapters I and II a look of its own for both faces', () => {
    const pages = story.chapters.filter((c) => c.number <= 2).flatMap((c) => c.rooms.map((r) => [r, c.id] as const));
    for (const who of ['sun', 'moon'] as const) {
      const looks = pages.map(([r, c]) => JSON.stringify(skyLook(who, r, c)));
      expect(new Set(looks).size, who).toBe(pages.length);
    }
  });

  it('gives every chapter a feel of its own', () => {
    const feel = (c: string): string => JSON.stringify([skyLook('sun', null, c), skyLook('moon', null, c)]);
    expect(new Set(chapters.map(feel)).size).toBe(chapters.length);
  });

  it('has at least three lines for each face on every page', () => {
    for (const c of story.chapters) {
      for (const r of c.rooms) {
        for (const who of ['sun', 'moon'] as const) expect(skyLines(who, r, c.id).length, `${r} ${who}`).toBeGreaterThanOrEqual(3);
      }
    }
  });
});

describe('the loader', () => {
  it('answers a key a file lacks with a default line, and warns while developing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const t = DIALOGUE as Record<string, unknown>;
    expect(t.noSuchScene).toEqual([{ text: MISSING }]);
    expect((CAPTIONS as Record<string, string>).noSuchCaption).toBe(MISSING);
    expect('noSuchScene' in DIALOGUE).toBe(false);
    expect(Object.keys(DIALOGUE)).not.toContain('noSuchScene');
    if (import.meta.env?.DEV) expect(warn).toHaveBeenCalledWith('[metin] dialogue.json › noSuchScene: kod bu anahtarı istiyor ama dosyada yok');
    warn.mockRestore();
  });

  it('is not mistaken for a promise or a mock by what only probes it', () => {
    const t = DIALOGUE as Record<string, unknown>;
    expect(t.then).toBeUndefined();
    expect(t.toJSON).toBeUndefined();
    expect(JSON.parse(JSON.stringify(CAPTIONS)).intro1).toBe(CAPTIONS.intro1);
  });
});

describe('the checks', () => {
  it('names: a missing or empty name shows its key; two people may not share a name', () => {
    const r = checkNames({ gorti: 'Gorti', sun: '', horse: 'Gorti' });
    expect(r.value.sun).toBe('sun');
    expect(r.value.babyMoon).toBe('babyMoon');
    expect(r.problems).toContainEqual({ file: 'names.json', key: 'sun', message: expect.any(String), level: 'error' });
    expect(r.problems).toContainEqual({ file: 'names.json', key: 'babyMoon', message: 'eksik', level: 'error' });
    expect(r.problems.some((p) => p.key === 'horse' && p.level === 'warn')).toBe(true);
    expect(Object.keys(r.value)).toEqual(expect.arrayContaining([...NAME_KEYS]));
  });

  it('captions: a caption that is not words becomes "…"', () => {
    const r = checkCaptions({ a: 'Bir.', b: 3, c: '  ' }, 'captions.json', ['a', 'd']);
    expect(r.value).toEqual({ a: 'Bir.', b: MISSING, c: MISSING, d: MISSING });
    expect(r.problems.map((p) => p.key)).toEqual(['b', 'c', 'd']);
    expect(r.problems.every((p) => p.file === 'captions.json' && p.level === 'error')).toBe(true);
  });

  it('dialogue: each broken line is replaced, the rest kept; unknown speakers are kept as written', () => {
    const names = { gorti: 'Gorti', sun: 'Güneş' };
    const r = checkDialogue(
      {
        $schema: './dialogue.schema.json',
        ok: [{ who: 'gorti', text: 'Merhaba.' }, 'Anlatıcı.', { who: 'Güneş', text: 'Öhö.', whisper: true }],
        stranger: [{ who: 'ayi', text: 'Hırr.' }],
        broken: [{ who: 'sun' }, 5, { text: 'Evet.', whisper: 'yes', color: 'red' }],
        empty: [],
        notAList: 'Merhaba',
      },
      names,
    );
    expect(r.value.ok).toEqual([{ who: 'Gorti', text: 'Merhaba.' }, { text: 'Anlatıcı.' }, { who: 'Güneş', text: 'Öhö.', whisper: true }]);
    expect(r.value.stranger).toEqual([{ who: 'ayi', text: 'Hırr.' }]);
    expect(r.value.broken).toEqual([{ who: 'Güneş', text: MISSING }, { text: MISSING }, { text: 'Evet.' }]);
    expect(r.value.empty).toEqual([{ text: MISSING }]);
    expect(r.value.notAList).toEqual([{ text: MISSING }]);
    expect(r.value).not.toHaveProperty('$schema');
    const at = (key: string): string | undefined => r.problems.find((p) => p.key === key)?.level;
    expect(at('stranger.0.who')).toBe('warn');
    expect(at('broken.0.text')).toBe('error');
    expect(at('broken.1')).toBe('error');
    expect(at('broken.2.whisper')).toBe('error');
    expect(at('broken.2.color')).toBe('warn');
    expect(at('empty')).toBe('error');
    expect(at('notAList')).toBe('error');
  });

  it('memories, paintings and documents: every part the game shows has a default', () => {
    const m = checkMemories({ found: { m1: { title: 'Bir', text: 'İki' }, m9: {} }, reversed: { caption: 'Geri', stations: { st1: { title: 'A', fragments: [] } } } });
    expect(m.value.found.m1).toEqual({ title: 'Bir', text: 'İki' });
    expect(m.value.found.m2).toEqual({ title: MISSING, text: MISSING });
    expect(m.value.reversed.stations.st1).toEqual({ title: 'A', fragments: [MISSING] });
    expect(m.value.reversed.stations.st3).toEqual({ title: MISSING, fragments: [MISSING] });
    expect(m.problems.map((p) => p.key)).toEqual(expect.arrayContaining(['found.m2', 'found.m9', 'reversed.stations.st1.fragments', 'reversed.stations.st2']));

    const p = checkPaintings({ line: 'Baktı.', paintings: { moon: { title: 'Ay', caption: 3 } } });
    expect(p.value.paintings.moon).toEqual({ title: 'Ay', caption: MISSING });
    expect(p.value.paintings.stranger).toEqual({ title: MISSING, caption: MISSING });

    const d = checkDocuments({ portraits: { title: 'T', note: 'N' }, russian: { lines: [{ ru: 'да' }] }, clause: { title: 'C', articles: 'Madde', signature: 'S' } });
    expect(d.value.russian.lines).toEqual([{ ru: 'да', tr: MISSING }]);
    expect(d.value.clause.articles).toEqual([MISSING]);
    expect(d.value.final).toEqual({ title: MISSING, lines: [MISSING], stamp: MISSING });
    expect(d.problems.map((x) => x.key)).toEqual(expect.arrayContaining(['russian.lines.0.tr', 'clause.articles', 'final']));
  });

  it('sky: wrong moods and places are dropped, numbers are held in range, unknown pages reported', () => {
    const r = checkSky(
      {
        default: { sun: { mood: 'calm', lines: ['Bir.', { text: 'İki.', answer: 'Üç.' }, { answer: 'x' }, 7, ''] }, moon: { mood: 'happy' } },
        chapters: { c1: { sun: { tilt: 90, size: 0.2 } }, c9: { moon: {} } },
        rooms: { r01: { moon: { wear: ['nightcap', 'hat', 'nightcap'], place: 'middle' } }, r99: { sun: { mood: 'proud' } } },
      },
      'sky.json',
      { chapters: ['c1'], rooms: ['r01'] },
    );
    expect(r.value.default.sun!.lines).toEqual([{ text: 'Bir.' }, { text: 'İki.', answer: 'Üç.' }]);
    expect(r.value.default.moon!.mood).toBeUndefined();
    expect(r.value.chapters.c1!.sun).toEqual({ tilt: 25, size: 0.7 });
    expect(r.value.rooms.r01!.moon).toEqual({ wear: ['nightcap'] });
    const at = (key: string): string | undefined => r.problems.find((p) => p.key === key)?.level;
    expect(at('default.moon.mood')).toBe('error');
    expect(at('default.sun.lines.2.text')).toBe('error');
    expect(at('default.sun.lines.3')).toBe('error');
    expect(at('chapters.c1.sun.tilt')).toBe('warn');
    expect(at('chapters.c9')).toBe('warn');
    expect(at('rooms.r01.moon.wear.1')).toBe('warn');
    expect(at('rooms.r01.moon.place')).toBe('error');
    expect(at('rooms.r99')).toBe('warn');
    expect(checkSky({}).problems).toContainEqual({ file: 'sky.json', key: 'default', message: 'eksik', level: 'error' });
  });
});

describe('a page’s Sun and Moon', () => {
  const sky: SkyText = {
    default: { sun: { mood: 'calm', lines: [{ text: 'd1' }, { text: 'd2' }, { text: 'd3' }] }, moon: {} },
    chapters: { c1: { sun: { mood: 'curious', wear: ['scarf'], tilt: 5, lines: [{ text: 'c1' }] } } },
    rooms: {
      r01: { sun: { size: 1.2, lines: [{ text: 'r1' }, { text: 'd1' }] } },
      r02: { sun: { wear: [] } },
    },
  };

  it('takes each field from the room, else its chapter, else the default', () => {
    expect(lookOf(sky, 'sun', 'r01', 'c1')).toEqual({ mood: 'curious', wear: ['scarf'], tilt: 5, size: 1.2, place: 'corner' });
    expect(lookOf(sky, 'sun', 'r02', 'c1').wear).toEqual([]);
    expect(lookOf(sky, 'sun', 'nowhere', null)).toEqual({ ...DEFAULT_LOOK, mood: 'calm' });
    expect(lookOf(sky, 'moon', 'r01', 'c1')).toEqual(DEFAULT_LOOK);
  });

  it('says the room’s lines first, topped up to three without repeats, never nothing', () => {
    expect(linesOf(sky, 'sun', 'r01', 'c1').map((l) => l.text)).toEqual(['r1', 'd1', 'c1']);
    expect(linesOf(sky, 'sun', 'r02', 'c1').map((l) => l.text)).toEqual(['c1', 'd1', 'd2', 'd3']);
    expect(linesOf(sky, 'moon', 'r01', 'c1')).toEqual([{ text: MISSING }]);
  });

  it('reads the game’s own sky.json the same way', () => {
    expect(skyLook('moon', 'r01', 'c1')).toEqual(lookOf(SKY_TEXT, 'moon', 'r01', 'c1'));
    expect(skyLook('moon', 'r01', 'c1').wear).toContain('nightcap');
  });
});

describe('kd check on the text', () => {
  const dir = mkdtempSync(join(tmpdir(), 'kd-text-'));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));
  const copy = (): void => {
    for (const f of TEXT_FILES) writeFileSync(join(dir, 'text', f), readFileSync(join(TEXT, f)));
  };
  mkdirSync(join(dir, 'text'));
  mkdirSync(join(dir, 'src', 'content', 'scripts'), { recursive: true });

  it('finds where a file is not JSON', () => {
    copy();
    writeFileSync(join(dir, 'text', 'captions.json'), '{\n  "a": "Bir",\n  "b": "İki"\n  "c": "Üç"\n}\n');
    const p = textSyntax(join(dir, 'text'));
    expect(p).toHaveLength(1);
    expect(p[0]).toMatchObject({ file: 'captions.json', level: 'error' });
    expect(p[0]!.message).toMatch(/satır 4/);
    expect(syntaxProblem('x.json', 'ab\ncd', new SyntaxError('Unexpected token in JSON at position 4')).message).toMatch(/satır 2, sütun 2/);
  });

  it('names the file and key the code asks for that a file lacks', () => {
    copy();
    writeFileSync(join(dir, 'src', 'content', 'scripts', 'r99.ts'), "cs.caption(CAPTIONS.noSuch);\nvoid DIALOGUE['nope'];\nNAMES.ghost;\nconst INSPECTABLE = new Set(['toywhale', 'lamp']);\n");
    const use = textUse(join(dir, 'src'), dir);
    expect(use.CAPTIONS.get('noSuch')).toEqual(['src/content/scripts/r99.ts']);
    expect([...use.DIALOGUE.keys()]).toEqual(['nope', 'toywhale', 'lamp']);
    const problems = auditText({ dir: join(dir, 'text'), srcDir: join(dir, 'src'), root: dir }).filter((p) => p.level === 'error');
    expect(problems.map((p) => `${p.file} ${p.key}`)).toEqual(['captions.json noSuch', 'dialogue.json nope', 'dialogue.json lamp', 'names.json ghost']);
  });

  it('reports a broken entry with its file and key', () => {
    copy();
    const sky = json('sky.json') as { rooms: Record<string, { sun: Record<string, unknown> }> };
    sky.rooms.r03!.sun.mood = 'angry';
    writeFileSync(join(dir, 'text', 'sky.json'), JSON.stringify(sky));
    const errors = auditText({ dir: join(dir, 'text') }).filter((p) => p.level === 'error');
    expect(errors).toEqual([{ file: 'sky.json', key: 'rooms.r03.sun.mood', message: expect.stringContaining('angry'), level: 'error' }]);
  });
});
