// The story text's shape: what each file in src/content/text may hold, and
// a check that reads a file as written and keeps what is good. A bad entry
// is replaced by a default and reported, with its file and key; a good file
// passes unchanged. The game (text.ts), `npm run kd -- check` and the tests
// all use it. No dependencies: it runs in the browser too.

export interface TextProblem {
  /** The file, as the user knows it (e.g. "captions.json"). */
  file: string;
  /** Where in the file: "r03enter", "moon.1.who", "rooms.r01.sun.mood". */
  key: string;
  message: string;
  /** 'error': the entry was replaced by a default; 'warn': it was kept, but should be looked at. */
  level: 'error' | 'warn';
}

export interface Checked<T> {
  value: T;
  problems: TextProblem[];
}

/** What a missing or broken line shows. */
export const MISSING = '…';

/** A line of dialogue as the game shows it (the same shape as the dialogue box's `Line`). */
export interface TextLine {
  who?: string;
  text: string;
  whisper?: boolean;
}

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
/** The entries of a file's object, without its "$schema". */
const entries = (o: Obj): [string, unknown][] => Object.entries(o).filter(([k]) => k !== '$schema');
const at = (...parts: (string | number)[]): string => parts.filter((p) => p !== '').join('.');

class Report {
  readonly problems: TextProblem[] = [];
  constructor(readonly file: string) {}
  error(key: string, message: string): void {
    this.problems.push({ file: this.file, key, message, level: 'error' });
  }
  warn(key: string, message: string): void {
    this.problems.push({ file: this.file, key, message, level: 'warn' });
  }
}

/** The file's top object; anything else is reported and read as empty. */
function top(raw: unknown, r: Report): Obj {
  if (isObj(raw)) return raw;
  r.error('', 'dosya bir nesne olmalı: { "anahtar": … }');
  return {};
}

function unknownKeys(o: Obj, known: readonly string[], r: Report, where: string): void {
  for (const k of Object.keys(o)) if (k !== '$schema' && !known.includes(k)) r.warn(at(where, k), `bilinmeyen alan "${k}" (yok sayıldı)`);
}

/** A string or the default, reported. */
function text(v: unknown, r: Report, key: string, fallback = MISSING): string {
  if (isText(v)) return v;
  r.error(key, v === undefined ? 'eksik' : 'boş olmayan bir yazı olmalı');
  return fallback;
}

// ------------------------------------------------------------------ names

/** Every name the code speaks under (the cast in the dialogue scenes and the people in the rooms). */
export const NAME_KEYS = [
  'gorti', 'babyMoon', 'oldMoon', 'sun', 'horse', 'coward', 'forms', 'voice', 'one', 'two', 'three',
  'mech', 'suit', 'moonMan', 'sunMan', 'baldMan', 'child', 'youth', 'warrior',
] as const;
export type NameKey = (typeof NAME_KEYS)[number];

/** names.json: who is called what. A missing name shows its key. */
export function checkNames(raw: unknown, file = 'names.json'): Checked<Record<NameKey, string> & Record<string, string>> {
  const r = new Report(file);
  const o = top(raw, r);
  const out: Record<string, string> = {};
  for (const [k, v] of entries(o)) out[k] = text(v, r, k, k);
  for (const k of NAME_KEYS) if (!(k in out)) out[k] = text(undefined, r, k, k);
  const seen = new Map<string, string>();
  for (const [k, v] of Object.entries(out)) {
    const prev = seen.get(v);
    if (prev) r.warn(k, `"${v}" adı ${prev} için de kullanılıyor; konuşma balonları ikisini ayıramaz`);
    else seen.set(v, k);
  }
  return { value: out as Record<NameKey, string> & Record<string, string>, problems: r.problems };
}

// --------------------------------------------------------------- captions

/** captions.json: the narration under the picture, by key. */
export function checkCaptions(raw: unknown, file = 'captions.json', required: readonly string[] = []): Checked<Record<string, string>> {
  const r = new Report(file);
  const o = top(raw, r);
  const out: Record<string, string> = {};
  for (const [k, v] of entries(o)) out[k] = text(v, r, k);
  for (const k of required) if (!(k in out)) out[k] = text(undefined, r, k);
  return { value: out, problems: r.problems };
}

// --------------------------------------------------------------- dialogue

/**
 * One line: `who` is a key of names.json (or a name as written), `text`
 * what is said, `whisper` a dashed balloon. No `who`: the narrator's box.
 */
export function checkLine(v: unknown, names: Readonly<Record<string, string>>, r: Report, key: string): TextLine {
  if (typeof v === 'string' && isText(v)) return { text: v };
  if (!isObj(v)) {
    r.error(key, 'bir satır { "who": …, "text": "…" } olmalı');
    return { text: MISSING };
  }
  unknownKeys(v, ['who', 'text', 'whisper'], r, key);
  const line: TextLine = { text: text(v.text, r, at(key, 'text')) };
  if (v.who !== undefined) {
    if (!isText(v.who)) r.error(at(key, 'who'), 'konuşanın adı (names.json\'daki anahtar) olmalı; anlatıcı için "who" yazmayın');
    else if (names[v.who] !== undefined) line.who = names[v.who];
    else {
      if (!Object.values(names).includes(v.who)) r.warn(at(key, 'who'), `"${v.who}" names.json'da yok (yazıldığı gibi gösterilir)`);
      line.who = v.who;
    }
  }
  if (v.whisper !== undefined) {
    if (typeof v.whisper !== 'boolean') r.error(at(key, 'whisper'), 'true ya da false olmalı');
    else if (v.whisper) line.whisper = true;
  }
  return line;
}

/** dialogue.json and inspect.json: lists of lines, by key. */
export function checkDialogue(raw: unknown, names: Readonly<Record<string, string>>, file = 'dialogue.json', required: readonly string[] = []): Checked<Record<string, TextLine[]>> {
  const r = new Report(file);
  const o = top(raw, r);
  const out: Record<string, TextLine[]> = {};
  for (const [k, v] of entries(o)) {
    if (!Array.isArray(v) || !v.length) {
      r.error(k, 'en az bir satırlık bir liste olmalı: [ { "text": "…" } ]');
      out[k] = [{ text: MISSING }];
      continue;
    }
    out[k] = v.map((l, i) => checkLine(l, names, r, at(k, i)));
  }
  for (const k of required) {
    if (k in out) continue;
    r.error(k, 'eksik');
    out[k] = [{ text: MISSING }];
  }
  return { value: out, problems: r.problems };
}

// --------------------------------------------------------------- memories

export interface MemoryText {
  title: string;
  text: string;
}

export interface WardStation {
  title: string;
  fragments: string[];
}

export interface MemoriesText {
  /** The eight memories Gorti finds (m1 … m8). */
  found: Record<string, MemoryText>;
  /** The memories that run backwards in the ward (r10). */
  reversed: { caption: string; stations: Record<string, WardStation> };
}

export const MEMORY_KEYS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'] as const;
export const STATION_KEYS = ['st1', 'st2', 'st3'] as const;

/** memories.json. */
export function checkMemories(raw: unknown, file = 'memories.json'): Checked<MemoriesText> {
  const r = new Report(file);
  const o = top(raw, r);
  unknownKeys(o, ['found', 'reversed'], r, '');
  const found: Record<string, MemoryText> = {};
  const fo: Obj = isObj(o.found) ? o.found : (r.error('found', 'anıların nesnesi olmalı: { "m1": { "title": …, "text": … } }'), {});
  for (const k of MEMORY_KEYS) {
    const m = fo[k];
    if (!isObj(m)) {
      r.error(at('found', k), m === undefined ? 'eksik' : '{ "title": …, "text": … } olmalı');
      found[k] = { title: MISSING, text: MISSING };
      continue;
    }
    unknownKeys(m, ['title', 'text'], r, at('found', k));
    found[k] = { title: text(m.title, r, at('found', k, 'title')), text: text(m.text, r, at('found', k, 'text')) };
  }
  for (const k of Object.keys(fo)) if (!(MEMORY_KEYS as readonly string[]).includes(k)) r.warn(at('found', k), 'oyunda böyle bir anı yok (yok sayıldı)');
  const ro: Obj = isObj(o.reversed) ? o.reversed : (r.error('reversed', '{ "caption": …, "stations": … } olmalı'), {});
  unknownKeys(ro, ['caption', 'stations'], r, 'reversed');
  const so: Obj = isObj(ro.stations) ? ro.stations : (r.error('reversed.stations', 'durakların nesnesi olmalı'), {});
  const stations: Record<string, WardStation> = {};
  for (const k of STATION_KEYS) {
    const s = so[k];
    const key = at('reversed.stations', k);
    if (!isObj(s)) {
      r.error(key, s === undefined ? 'eksik' : '{ "title": …, "fragments": [ … ] } olmalı');
      stations[k] = { title: MISSING, fragments: [MISSING] };
      continue;
    }
    unknownKeys(s, ['title', 'fragments'], r, key);
    const frags = Array.isArray(s.fragments) && s.fragments.length ? s.fragments.map((f, i) => text(f, r, at(key, 'fragments', i))) : (r.error(at(key, 'fragments'), 'en az bir parçalık bir liste olmalı'), [MISSING]);
    stations[k] = { title: text(s.title, r, at(key, 'title')), fragments: frags };
  }
  return { value: { found, reversed: { caption: text(ro.caption, r, 'reversed.caption'), stations } }, problems: r.problems };
}

// -------------------------------------------------------------- paintings

export const PAINTING_KEYS = ['stranger', 'moon', 'youth', 'warrior'] as const;

export interface PaintingsText {
  /** What Gorti feels in front of every painting. */
  line: string;
  paintings: Record<string, { title: string; caption: string }>;
}

/** paintings.json. */
export function checkPaintings(raw: unknown, file = 'paintings.json'): Checked<PaintingsText> {
  const r = new Report(file);
  const o = top(raw, r);
  unknownKeys(o, ['line', 'paintings'], r, '');
  const po: Obj = isObj(o.paintings) ? o.paintings : (r.error('paintings', 'tabloların nesnesi olmalı'), {});
  const paintings: Record<string, { title: string; caption: string }> = {};
  for (const k of PAINTING_KEYS) {
    const p = po[k];
    if (!isObj(p)) {
      r.error(at('paintings', k), p === undefined ? 'eksik' : '{ "title": …, "caption": … } olmalı');
      paintings[k] = { title: MISSING, caption: MISSING };
      continue;
    }
    unknownKeys(p, ['title', 'caption'], r, at('paintings', k));
    paintings[k] = { title: text(p.title, r, at('paintings', k, 'title')), caption: text(p.caption, r, at('paintings', k, 'caption')) };
  }
  for (const k of Object.keys(po)) if (!(PAINTING_KEYS as readonly string[]).includes(k)) r.warn(at('paintings', k), 'oyunda böyle bir tablo yok (yok sayıldı)');
  return { value: { line: text(o.line, r, 'line'), paintings }, problems: r.problems };
}

// -------------------------------------------------------------- documents

export interface DocumentsText {
  portraits: { title: string; note: string };
  russian: { lines: { ru: string; tr: string }[] };
  clause: { title: string; articles: string[]; signature: string };
  final: { title: string; lines: string[]; stamp: string };
}

/** documents.json: the papers on the empty table (r12). */
export function checkDocuments(raw: unknown, file = 'documents.json'): Checked<DocumentsText> {
  const r = new Report(file);
  const o = top(raw, r);
  unknownKeys(o, ['portraits', 'russian', 'clause', 'final'], r, '');
  const part = (k: string, fields: readonly string[]): Obj => {
    const v = o[k];
    if (isObj(v)) {
      unknownKeys(v, fields, r, k);
      return v;
    }
    r.error(k, v === undefined ? 'eksik' : 'bir nesne olmalı');
    return {};
  };
  const list = (v: unknown, key: string): string[] =>
    Array.isArray(v) && v.length ? v.map((s, i) => text(s, r, at(key, i))) : (r.error(key, 'en az bir satırlık bir liste olmalı'), [MISSING]);
  const p = part('portraits', ['title', 'note']);
  const ru = part('russian', ['lines']);
  const c = part('clause', ['title', 'articles', 'signature']);
  const f = part('final', ['title', 'lines', 'stamp']);
  const ruLines = Array.isArray(ru.lines) && ru.lines.length
    ? ru.lines.map((l, i) => {
        const key = at('russian.lines', i);
        if (!isObj(l)) {
          r.error(key, '{ "ru": …, "tr": … } olmalı');
          return { ru: MISSING, tr: MISSING };
        }
        unknownKeys(l, ['ru', 'tr'], r, key);
        return { ru: text(l.ru, r, at(key, 'ru')), tr: text(l.tr, r, at(key, 'tr')) };
      })
    : (r.error('russian.lines', 'en az bir satırlık bir liste olmalı'), [{ ru: MISSING, tr: MISSING }]);
  return {
    value: {
      portraits: { title: text(p.title, r, 'portraits.title'), note: text(p.note, r, 'portraits.note') },
      russian: { lines: ruLines },
      clause: { title: text(c.title, r, 'clause.title'), articles: list(c.articles, 'clause.articles'), signature: text(c.signature, r, 'clause.signature') },
      final: { title: text(f.title, r, 'final.title'), lines: list(f.lines, 'final.lines'), stamp: text(f.stamp, r, 'final.stamp') },
    },
    problems: r.problems,
  };
}

// -------------------------------------------------------------------- sky

/** How a face feels on a page. */
export const MOODS = ['calm', 'sleepy', 'curious', 'worried', 'delighted', 'grumpy', 'proud', 'teary'] as const;
export type Mood = (typeof MOODS)[number];
/** Small hand-drawn things a face can wear or have about it. */
export const WEARS = ['nightcap', 'bandage', 'freckles', 'scarf', 'crown', 'sweat', 'flowers', 'zzz', 'notes'] as const;
export type Wear = (typeof WEARS)[number];
/** Where a face sits in its corner. */
export const PLACES = ['corner', 'peek', 'high', 'low', 'inward'] as const;
export type Place = (typeof PLACES)[number];

/** Something the Sun or the Moon says when held, and what Gorti answers (if anything). */
export interface SkyLine {
  text: string;
  answer?: string;
}

/** A face's look on a page, as written (any field may be left to the chapter's or the default). */
export interface FaceLookJson {
  mood?: Mood;
  wear?: Wear[];
  tilt?: number;
  size?: number;
  place?: Place;
  lines?: SkyLine[];
}

export interface SkyPage {
  sun?: FaceLookJson;
  moon?: FaceLookJson;
}

export interface SkyText {
  default: SkyPage;
  chapters: Record<string, SkyPage>;
  rooms: Record<string, SkyPage>;
}

export const TILT_MAX = 25;
export const SIZE_RANGE = [0.7, 1.4] as const;

function checkSkyLine(v: unknown, r: Report, key: string): SkyLine | null {
  if (typeof v === 'string') return isText(v) ? { text: v } : (r.error(key, 'boş bir söz'), null);
  if (!isObj(v)) {
    r.error(key, 'bir söz ("…") ya da { "text": "…", "answer": "…" } olmalı');
    return null;
  }
  unknownKeys(v, ['text', 'answer'], r, key);
  if (!isText(v.text)) {
    r.error(at(key, 'text'), v.text === undefined ? 'eksik' : 'boş olmayan bir yazı olmalı');
    return null;
  }
  const line: SkyLine = { text: v.text };
  if (v.answer !== undefined) {
    if (isText(v.answer)) line.answer = v.answer;
    else r.error(at(key, 'answer'), 'Gorti\'nin cevabı boş olmayan bir yazı olmalı (cevap yoksa alanı silin)');
  }
  return line;
}

function checkFace(v: unknown, r: Report, key: string): FaceLookJson | undefined {
  if (v === undefined) return undefined;
  if (!isObj(v)) {
    r.error(key, 'bir nesne olmalı: { "mood": …, "wear": [ … ], "lines": [ … ] }');
    return undefined;
  }
  unknownKeys(v, ['mood', 'wear', 'tilt', 'size', 'place', 'lines'], r, key);
  const out: FaceLookJson = {};
  if (v.mood !== undefined) {
    if ((MOODS as readonly unknown[]).includes(v.mood)) out.mood = v.mood as Mood;
    else r.error(at(key, 'mood'), `"${String(v.mood)}" diye bir ruh hali yok (${MOODS.join(', ')})`);
  }
  if (v.wear !== undefined) {
    if (!Array.isArray(v.wear)) r.error(at(key, 'wear'), `bir liste olmalı, ör. ["nightcap"] (${WEARS.join(', ')})`);
    else {
      out.wear = [];
      v.wear.forEach((w, i) => {
        if ((WEARS as readonly unknown[]).includes(w)) {
          if (!out.wear!.includes(w as Wear)) out.wear!.push(w as Wear);
        } else r.warn(at(key, 'wear', i), `"${String(w)}" diye bir şey yok (${WEARS.join(', ')}); yok sayıldı`);
      });
    }
  }
  if (v.tilt !== undefined) {
    if (typeof v.tilt !== 'number' || !Number.isFinite(v.tilt)) r.error(at(key, 'tilt'), 'derece olarak bir sayı olmalı (sola eksi, sağa artı)');
    else {
      out.tilt = Math.max(-TILT_MAX, Math.min(TILT_MAX, v.tilt));
      if (out.tilt !== v.tilt) r.warn(at(key, 'tilt'), `en çok ±${TILT_MAX} derece (${out.tilt} alındı)`);
    }
  }
  if (v.size !== undefined) {
    if (typeof v.size !== 'number' || !Number.isFinite(v.size)) r.error(at(key, 'size'), `bir sayı olmalı (${SIZE_RANGE[0]} … ${SIZE_RANGE[1]})`);
    else {
      out.size = Math.max(SIZE_RANGE[0], Math.min(SIZE_RANGE[1], v.size));
      if (out.size !== v.size) r.warn(at(key, 'size'), `${SIZE_RANGE[0]} ile ${SIZE_RANGE[1]} arasında olmalı (${out.size} alındı)`);
    }
  }
  if (v.place !== undefined) {
    if ((PLACES as readonly unknown[]).includes(v.place)) out.place = v.place as Place;
    else r.error(at(key, 'place'), `"${String(v.place)}" diye bir yer yok (${PLACES.join(', ')})`);
  }
  if (v.lines !== undefined) {
    if (!Array.isArray(v.lines)) r.error(at(key, 'lines'), 'sözlerin listesi olmalı: [ "…", { "text": "…", "answer": "…" } ]');
    else out.lines = v.lines.map((l, i) => checkSkyLine(l, r, at(key, 'lines', i))).filter((l): l is SkyLine => l !== null);
  }
  return out;
}

function checkPage(v: unknown, r: Report, key: string): SkyPage {
  if (!isObj(v)) {
    r.error(key, 'bir nesne olmalı: { "sun": { … }, "moon": { … } }');
    return {};
  }
  unknownKeys(v, ['sun', 'moon'], r, key);
  const page: SkyPage = {};
  const sun = checkFace(v.sun, r, at(key, 'sun'));
  const moon = checkFace(v.moon, r, at(key, 'moon'));
  if (sun) page.sun = sun;
  if (moon) page.moon = moon;
  return page;
}

/**
 * sky.json: the Sun's and the Moon's look and sayings, by default, by
 * chapter and by room. `chapters` and `rooms` name the pages the game has
 * (unknown ones are reported and kept: a room may still be on its way).
 */
export function checkSky(raw: unknown, file = 'sky.json', known: { chapters?: readonly string[]; rooms?: readonly string[] } = {}): Checked<SkyText> {
  const r = new Report(file);
  const o = top(raw, r);
  unknownKeys(o, ['default', 'chapters', 'rooms'], r, '');
  const def: SkyPage = o.default === undefined ? (r.error('default', 'eksik'), {}) : checkPage(o.default, r, 'default');
  const pages = (k: 'chapters' | 'rooms', ids: readonly string[] | undefined): Record<string, SkyPage> => {
    const v = o[k];
    if (v === undefined) return {};
    if (!isObj(v)) {
      r.error(k, 'sayfaların nesnesi olmalı: { "r01": { … } }');
      return {};
    }
    const out: Record<string, SkyPage> = {};
    for (const [id, page] of Object.entries(v)) {
      if (ids && !ids.includes(id)) r.warn(at(k, id), k === 'rooms' ? `"${id}" diye bir oda yok` : `"${id}" diye bir bölüm yok`);
      out[id] = checkPage(page, r, at(k, id));
    }
    return out;
  };
  return { value: { default: def, chapters: pages('chapters', known.chapters), rooms: pages('rooms', known.rooms) }, problems: r.problems };
}

/** A face's look on a page, every field settled. */
export interface FaceLook {
  mood: Mood;
  wear: readonly Wear[];
  tilt: number;
  size: number;
  place: Place;
}

export const DEFAULT_LOOK: FaceLook = { mood: 'calm', wear: [], tilt: 0, size: 1, place: 'corner' };

/**
 * The look of `who` on a room's page: each field from the room, else its
 * chapter, else the default.
 */
export function lookOf(sky: SkyText, who: 'sun' | 'moon', room: string | null, chapter: string | null): FaceLook {
  const chain = [room ? sky.rooms[room]?.[who] : undefined, chapter ? sky.chapters[chapter]?.[who] : undefined, sky.default[who]];
  const pick = <K extends keyof FaceLook>(k: K): FaceLook[K] => {
    for (const f of chain) {
      const v = f?.[k as keyof FaceLookJson];
      if (v !== undefined) return v as FaceLook[K];
    }
    return DEFAULT_LOOK[k];
  };
  return { mood: pick('mood'), wear: pick('wear'), tilt: pick('tilt'), size: pick('size'), place: pick('place') };
}

/**
 * What `who` may say on a room's page: the room's lines, topped up from
 * its chapter's and then the default ones while there are fewer than three
 * (so a line need never come twice in a row). Never empty.
 */
export function linesOf(sky: SkyText, who: 'sun' | 'moon', room: string | null, chapter: string | null): SkyLine[] {
  const out: SkyLine[] = [];
  for (const f of [room ? sky.rooms[room]?.[who] : undefined, chapter ? sky.chapters[chapter]?.[who] : undefined, sky.default[who]]) {
    if (out.length >= 3) break;
    for (const l of f?.lines ?? []) if (!out.some((o) => o.text === l.text)) out.push(l);
  }
  return out.length ? out : [{ text: MISSING }];
}
