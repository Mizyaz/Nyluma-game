// A full check of the story text, for `npm run kd -- check` and the tests
// (Node only: it reads the files). Each file is read as written, so a
// syntax error is reported with its line, then checked as the game checks
// it (check.ts); then the code is read for the keys it asks for, so a line
// the code needs that a file lacks is reported with its file and key.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  checkCaptions,
  checkDialogue,
  checkDocuments,
  checkMemories,
  checkNames,
  checkPaintings,
  checkSky,
  type TextProblem,
} from './check';

/** The text files, in the order they are checked. */
export const TEXT_FILES = ['names.json', 'captions.json', 'dialogue.json', 'inspect.json', 'memories.json', 'paintings.json', 'documents.json', 'sky.json'] as const;
export type TextFile = (typeof TEXT_FILES)[number];

/** Where a JSON.parse error is, in words: "satır 4, sütun 12". */
export function syntaxProblem(file: string, src: string, err: unknown): TextProblem {
  const msg = err instanceof Error ? err.message : String(err);
  let line = 0;
  let col = 0;
  const lc = /line (\d+) column (\d+)/.exec(msg);
  const pos = /position (\d+)/.exec(msg);
  if (lc) {
    line = Number(lc[1]);
    col = Number(lc[2]);
  } else if (pos) {
    const before = src.slice(0, Number(pos[1])).split('\n');
    line = before.length;
    col = before[before.length - 1]!.length + 1;
  }
  const where = line ? `satır ${line}, sütun ${col}` : 'dosyada';
  return { file, key: '', message: `JSON yazım hatası (${where}): ${msg}. Sık rastlananlar: eksik ya da fazla virgül, kapanmamış tırnak, düz tırnak yerine “ ”.`, level: 'error' };
}

/** The text files that are missing or not JSON at all (the game cannot load them). */
export function textSyntax(dir: string): TextProblem[] {
  const out: TextProblem[] = [];
  for (const file of TEXT_FILES) {
    let src: string;
    try {
      src = readFileSync(join(dir, file), 'utf8');
    } catch {
      out.push({ file, key: '', message: 'dosya yok', level: 'error' });
      continue;
    }
    try {
      JSON.parse(src);
    } catch (e) {
      out.push(syntaxProblem(file, src, e));
    }
  }
  return out;
}

/** What the code asks for, by table: key → the files that ask. */
export interface TextUse {
  CAPTIONS: Map<string, string[]>;
  DIALOGUE: Map<string, string[]>;
  NAMES: Map<string, string[]>;
}

function tsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out.push(...tsFiles(p));
    else if (f.endsWith('.ts')) out.push(p);
  }
  return out;
}

/**
 * The keys the game's code reads from the text tables: `CAPTIONS.x`,
 * `DIALOGUE.x`, `DIALOGUE['x']`, `NAMES.x`, and the ids r01 inspects
 * (`INSPECTABLE`, read as `DIALOGUE[id]`).
 */
export function textUse(srcDir: string, root = srcDir): TextUse {
  const use: TextUse = { CAPTIONS: new Map(), DIALOGUE: new Map(), NAMES: new Map() };
  const add = (t: keyof TextUse, k: string, f: string): void => {
    const l = use[t].get(k) ?? [];
    if (!l.includes(f)) l.push(f);
    use[t].set(k, l);
  };
  const textDir = join(srcDir, 'content', 'text');
  for (const file of tsFiles(srcDir)) {
    if (file.startsWith(textDir)) continue;
    const src = readFileSync(file, 'utf8');
    const f = relative(root, file);
    for (const m of src.matchAll(/\b(CAPTIONS|DIALOGUE|NAMES)(?:\.([A-Za-z_$][\w$]*)|\[\s*'([^']+)'\s*\]|\[\s*"([^"]+)"\s*\])/g)) {
      add(m[1] as keyof TextUse, (m[2] ?? m[3] ?? m[4])!, f);
    }
    for (const m of src.matchAll(/\bINSPECTABLE\s*=\s*new Set\(\s*\[([^\]]*)\]/g)) {
      for (const k of m[1]!.matchAll(/'([^']+)'|"([^"]+)"/g)) add('DIALOGUE', (k[1] ?? k[2])!, f);
    }
  }
  return use;
}

export interface AuditOptions {
  /** src/content/text */
  dir: string;
  /** src, read for the keys the code asks for (skipped when absent). */
  srcDir?: string;
  /** What paths are shown relative to. */
  root?: string;
  /** The chapters and rooms the game has (for sky.json's pages). */
  chapters?: readonly string[];
  rooms?: readonly string[];
}

/** Every problem in the story text: broken entries, missing keys, unknown pages. */
export function auditText(o: AuditOptions): TextProblem[] {
  const problems: TextProblem[] = [];
  const raw: Partial<Record<TextFile, unknown>> = {};
  for (const file of TEXT_FILES) {
    let src: string;
    try {
      src = readFileSync(join(o.dir, file), 'utf8');
    } catch {
      problems.push({ file, key: '', message: 'dosya yok', level: 'error' });
      continue;
    }
    try {
      raw[file] = JSON.parse(src);
    } catch (e) {
      problems.push(syntaxProblem(file, src, e));
    }
  }
  const keep = <T>(file: TextFile, f: (v: unknown) => { value: T; problems: TextProblem[] }): T | null => {
    if (!(file in raw)) return null;
    const r = f(raw[file]);
    problems.push(...r.problems);
    return r.value;
  };
  const names = keep('names.json', (v) => checkNames(v)) ?? {};
  const captions = keep('captions.json', (v) => checkCaptions(v));
  const dialogue = keep('dialogue.json', (v) => checkDialogue(v, names, 'dialogue.json'));
  const inspect = keep('inspect.json', (v) => checkDialogue(v, names, 'inspect.json'));
  keep('memories.json', (v) => checkMemories(v));
  keep('paintings.json', (v) => checkPaintings(v));
  keep('documents.json', (v) => checkDocuments(v));
  keep('sky.json', (v) => checkSky(v, 'sky.json', { chapters: o.chapters, rooms: o.rooms }));
  if (dialogue && inspect) {
    for (const k of Object.keys(inspect)) {
      if (k in dialogue) problems.push({ file: 'dialogue.json', key: k, message: 'inspect.json\'da da var; oyun dialogue.json\'dakini gösterir', level: 'warn' });
    }
  }
  if (!o.srcDir) return problems;
  const use = textUse(o.srcDir, o.root ?? o.srcDir);
  const asked = (files: string[]): string => `kod bu anahtarı istiyor (${files.join(', ')}) ama dosyada yok`;
  if (captions) {
    for (const [k, files] of use.CAPTIONS) if (!(k in captions)) problems.push({ file: 'captions.json', key: k, message: asked(files), level: 'error' });
    for (const k of Object.keys(captions)) if (!use.CAPTIONS.has(k)) problems.push({ file: 'captions.json', key: k, message: 'kod bu anlatımı hiç istemiyor (oyunda görünmez)', level: 'warn' });
  }
  if (dialogue && inspect) {
    for (const [k, files] of use.DIALOGUE) if (!(k in dialogue) && !(k in inspect)) problems.push({ file: 'dialogue.json', key: k, message: asked(files), level: 'error' });
    for (const [file, table] of [['dialogue.json', dialogue], ['inspect.json', inspect]] as const) {
      for (const k of Object.keys(table)) if (!use.DIALOGUE.has(k)) problems.push({ file, key: k, message: 'kod bu konuşmayı hiç istemiyor (oyunda görünmez)', level: 'warn' });
    }
  }
  if ('names.json' in raw) {
    for (const [k, files] of use.NAMES) if (!(k in names)) problems.push({ file: 'names.json', key: k, message: asked(files), level: 'error' });
  }
  return problems;
}

/** A problem as kd prints it: "captions.json › r03enter: eksik". */
export function describeProblem(p: TextProblem): string {
  return `src/content/text/${p.file}${p.key ? ` › ${p.key}` : ''}: ${p.message}`;
}
