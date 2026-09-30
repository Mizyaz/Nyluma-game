// kd — the chapter builder's tool. Rooms are JSON files; this checks them,
// lists what they can use, makes new ones and takes pictures of them.
//
//   npm run kd -- check                      every chapter and room file, cross-checked
//   npm run kd -- list [what]                rooms, chapters, cast, props, themes, grounds, music, abilities
//   npm run kd -- new <id> --chapter <c> [--title "…"] [--theme hill] [--width 2000]
//   npm run kd -- show <room>                what a room file does, in words
//   npm run kd -- schema                     writes the JSON Schemas editors use for help
//   npm run kd -- shot <room> [x …]          screenshots (starts the dev server) into shots/

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { SOLID_STYLES, THEME_IDS } from '../src/content/data/roomTypes';
import { MUSIC_CUES } from '../src/music/types';
import { ABILITIES } from '../src/engine/state/types';
import { CAST, SPEAKERS } from '../src/content/characters/cast';
import { allParts } from '../src/content/art/manifest';
import { checkStory, walkActions } from '../src/engine/content/compile';
import { RoomSchema, StorySchema, schemaProblems, type ActionJson, type RoomJson, type StoryJson } from '../src/engine/content/schema';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CHAPTERS = join(ROOT, 'src/content/chapters');
const ROOM_DIR = join(CHAPTERS, 'rooms');
const STORY_FILE = join(CHAPTERS, 'chapters.json');
const BUILT_IN_DIR = join(ROOT, 'src/content/rooms');

const readJson = (f: string): unknown => JSON.parse(readFileSync(f, 'utf8'));
const writeJson = (f: string, v: unknown): void => writeFileSync(f, JSON.stringify(v, null, 2) + '\n');

function args(): { cmd: string; pos: string[]; opt: Record<string, string> } {
  const [cmd = 'help', ...rest] = process.argv.slice(2);
  const pos: string[] = [];
  const opt: Record<string, string> = {};
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i]!;
    if (a.startsWith('--')) opt[a.slice(2)] = rest[++i] ?? '';
    else pos.push(a);
  }
  return { cmd, pos, opt };
}

function builtInRooms(): string[] {
  return readdirSync(BUILT_IN_DIR)
    .map((f) => /^(r\d+)\.ts$/.exec(f)?.[1])
    .filter((x): x is string => !!x)
    .sort();
}

function roomFiles(): { file: string; data: unknown }[] {
  return readdirSync(ROOM_DIR)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ file: f, data: readJson(join(ROOM_DIR, f)) }));
}

function propKeys(): string[] {
  return [...new Set(allParts().map((p) => p.key))].filter((k) => k.startsWith('prop.')).sort();
}

// ------------------------------------------------------------------ check

function check(): number {
  const problems: string[] = [];
  const warnings: string[] = [];
  const storyRaw = readJson(STORY_FILE);
  problems.push(...schemaProblems(StorySchema, storyRaw, 'chapters.json'));
  const rooms: RoomJson[] = [];
  for (const { file, data } of roomFiles()) {
    const p = schemaProblems(RoomSchema, data, `rooms/${file}`);
    problems.push(...p);
    if (p.length) continue;
    const r = data as RoomJson;
    if (`${r.id}.json` !== file) problems.push(`rooms/${file}: id "${r.id}" should match the file name`);
    rooms.push(r);
  }
  if (!problems.length) problems.push(...checkStory(storyRaw as StoryJson, rooms, builtInRooms()));
  const props = new Set(allParts().map((p) => p.key));
  const speakers = new Set(SPEAKERS);
  for (const r of rooms) {
    const at = `room ${r.id}`;
    for (const p of r.props ?? []) if (!props.has(p.key)) problems.push(`${at}: no drawing "${p.key}" (npm run kd -- list props)`);
    for (const b of r.breakables ?? []) if (b.key && !props.has(b.key)) problems.push(`${at} breakable ${b.id}: no drawing "${b.key}"`);
    for (const n of r.npcs ?? []) if (!CAST[n.who]) problems.push(`${at} npc ${n.id}: "${n.who}" is not in the cast (npm run kd -- list cast)`);
    const lines = (list: readonly ActionJson[]): void =>
      walkActions(list, (a) => {
        if ('say' in a) for (const l of a.say) if (l.who && !speakers.has(l.who)) warnings.push(`${at}: speaker "${l.who}" has no name of its own (shown as written)`);
      });
    lines(r.enter ?? []);
    for (const n of r.npcs ?? []) {
      lines([{ say: n.talk }, ...(n.again ? [{ say: n.again }] : []), ...(n.then ?? [])]);
    }
    for (const t of r.triggers ?? []) lines(t.do);
    for (const g of r.gates ?? []) if (g.x < 60 || g.x > r.width - 60) problems.push(`${at} gate ${g.id}: x ${g.x} is too close to the edge`);
    for (const n of r.npcs ?? []) if (Math.abs(n.x - r.spawn.x) < 120) warnings.push(`${at} npc ${n.id}: stands on the spawn point`);
  }
  for (const w of warnings) console.log(`  uyarı  ${w}`);
  for (const p of problems) console.log(`  HATA   ${p}`);
  const story = storyRaw as StoryJson;
  console.log(problems.length ? `\n${problems.length} hata.` : `Tamam: ${story.chapters.length} bölüm, ${rooms.length} oda dosyası, ${builtInRooms().length} TS oda.`);
  return problems.length ? 1 : 0;
}

// ------------------------------------------------------------------- list

function list(what = 'rooms'): number {
  const story = readJson(STORY_FILE) as StoryJson;
  const files = new Set(roomFiles().map((f) => (f.data as RoomJson).id));
  const out: Record<string, () => string[]> = {
    chapters: () => story.chapters.map((c) => `${c.id}  ${c.number}. ${c.title}  (Ay: ${c.sky.moon}, Güneş: ${c.sky.sun})  ${c.rooms.join(' ')}`),
    rooms: () => story.chapters.flatMap((c) => c.rooms.map((r) => `${r.padEnd(6)} ${c.id}  ${files.has(r) ? 'json' : 'ts  '}`)),
    cast: () => Object.entries(CAST).map(([k, v]) => `${k.padEnd(10)} ${v.name}`),
    speakers: () => [...SPEAKERS],
    props: propKeys,
    themes: () => [...THEME_IDS],
    grounds: () => [...SOLID_STYLES],
    music: () => ['none', ...MUSIC_CUES],
    abilities: () => [...ABILITIES],
  };
  const f = out[what];
  if (!f) {
    console.log(`list: ${Object.keys(out).join(', ')}`);
    return 1;
  }
  console.log(f().join('\n'));
  return 0;
}

// -------------------------------------------------------------------- new

function newRoom(id: string | undefined, opt: Record<string, string>): number {
  if (!id || !/^[a-z][a-zA-Z0-9_]*$/.test(id)) {
    console.log('new <id> --chapter <c> [--title "…"] [--theme hill] [--width 2000]');
    return 1;
  }
  const file = join(ROOM_DIR, `${id}.json`);
  const story = readJson(STORY_FILE) as StoryJson & { $schema?: string };
  if (existsSync(file) || story.chapters.some((c) => c.rooms.includes(id))) {
    console.log(`"${id}" zaten var.`);
    return 1;
  }
  const chId = opt.chapter ?? story.chapters.at(-1)!.id;
  let ch = story.chapters.find((c) => c.id === chId);
  if (!ch) {
    ch = { id: chId, number: Math.max(...story.chapters.map((c) => c.number)) + 1, title: opt['chapter-title'] ?? 'Yeni Bölüm', sky: { moon: 'baby', sun: 'calm' }, rooms: [] };
    story.chapters.push(ch);
    console.log(`Yeni bölüm: ${ch.id} (${ch.number}. ${ch.title})`);
  }
  const theme = (opt.theme ?? 'hill') as RoomJson['theme'];
  if (!THEME_IDS.includes(theme)) {
    console.log(`theme: ${THEME_IDS.join(', ')}`);
    return 1;
  }
  const room: RoomJson = {
    $schema: '../room.schema.json',
    id,
    chapter: ch.id,
    title: opt.title ?? 'Boş Oda',
    theme,
    width: Number(opt.width ?? 2000),
    spawn: { x: 220, facing: 1 },
    props: [],
    npcs: [],
    gates: [],
    triggers: [],
    exits: [],
  };
  // The chapter's last room file leads here, if it led nowhere.
  const prev = ch.rooms.at(-1);
  const prevFile = prev ? join(ROOM_DIR, `${prev}.json`) : '';
  if (prev && existsSync(prevFile)) {
    const p = readJson(prevFile) as RoomJson;
    if (!p.exits?.length) {
      p.exits = [{ to: id }];
      writeJson(prevFile, p);
      console.log(`${prev} → ${id} çıkışı eklendi.`);
    }
  }
  ch.rooms.push(id);
  writeJson(file, room);
  writeJson(STORY_FILE, story);
  console.log(`Yazıldı: src/content/chapters/rooms/${id}.json  (npm run dev → ?room=${id})`);
  return 0;
}

// ------------------------------------------------------------------- show

function say(a: ActionJson, pad: string): string[] {
  if ('say' in a) return a.say.map((l) => `${pad}${l.who ?? 'anlatıcı'}: “${l.text}”`);
  if ('if' in a)
    return [`${pad}eğer ${a.if}:`, ...(a.then ?? []).flatMap((b) => say(b, pad + '  ')), ...(a.else ? [`${pad}değilse:`, ...a.else.flatMap((b) => say(b, pad + '  '))] : [])];
  const [k, v] = Object.entries(a)[0]!;
  return [`${pad}${k} ${typeof v === 'object' ? JSON.stringify(v) : v}`];
}

function show(id: string | undefined): number {
  const f = join(ROOM_DIR, `${id}.json`);
  if (!id || !existsSync(f)) {
    console.log('show <room file id>');
    return 1;
  }
  const r = readJson(f) as RoomJson;
  const o: string[] = [`${r.id} — ${r.title}  (${r.chapter}, ${r.theme}, ${r.width} px, giriş x ${r.spawn.x}${r.form ? `, form ${r.form}` : ''})`];
  if (r.enter?.length) o.push('Girişte:', ...r.enter.flatMap((a) => say(a, '  ')));
  for (const n of r.npcs ?? []) {
    o.push(`NPC ${n.id} (${n.who}) x ${n.x}${n.when ? ` [${n.when}]` : ''}:`, ...n.talk.flatMap((l) => say({ say: [l] }, '  ')));
    if (n.then?.length) o.push('  sonra:', ...n.then.flatMap((a) => say(a, '    ')));
  }
  for (const g of r.gates ?? []) o.push(`Kapı ${g.id} x ${g.x}: açılır ⇐ ${g.open}${g.hint ? `  (ipucu: ${g.hint})` : ''}`);
  for (const t of r.triggers ?? []) o.push(`Tetik ${t.id} x ${t.x}${t.when ? ` [${t.when}]` : ''}${t.repeat ? ' (her seferinde)' : ''}:`, ...t.do.flatMap((a) => say(a, '  ')));
  for (const b of r.breakables ?? []) o.push(`Yıkılır ${b.id} (${b.key ?? 'prop.blocks'}) x ${b.x}${b.needs ? ` ⇐ ${b.needs}` : ''}  → bayrak ${r.id}.${b.id}.broken`);
  for (const e of r.exits ?? []) o.push(`Çıkış → ${e.to}${e.when ? ` ⇐ ${e.when}` : ''}`);
  console.log(o.join('\n'));
  return 0;
}

// ----------------------------------------------------------------- schema

function schema(): number {
  const opts = { io: 'input', unrepresentable: 'any' } as const;
  writeJson(join(CHAPTERS, 'room.schema.json'), z.toJSONSchema(RoomSchema, opts));
  writeJson(join(CHAPTERS, 'chapters.schema.json'), z.toJSONSchema(StorySchema, opts));
  console.log('Yazıldı: src/content/chapters/room.schema.json, chapters.schema.json');
  return 0;
}

// ------------------------------------------------------------------- shot

async function shot(id: string | undefined, xs: string[]): Promise<number> {
  if (!id) {
    console.log('shot <room> [x …]');
    return 1;
  }
  const { createServer } = await import('vite');
  const { chromium } = await import('@playwright/test');
  const server = await createServer({ root: ROOT, logLevel: 'error', server: { port: Number(process.env.KD_PORT ?? 5310), host: '127.0.0.1' } });
  await server.listen();
  const url = server.resolvedUrls?.local[0] ?? 'http://127.0.0.1:5310/';
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const out = join(ROOT, 'shots');
  mkdirSync(out, { recursive: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    page.on('pageerror', (e) => console.log('  sayfa hatası:', e.message));
    await page.goto(`${url}?room=${id}`);
    await page.waitForFunction((r) => (window as unknown as { __kd?: { state(): { room: string } } }).__kd?.state()?.room === r, id, { timeout: 120000 });
    await page.waitForTimeout(2500);
    for (const x of xs.length ? xs : ['']) {
      if (x) await page.evaluate((v) => (window as unknown as { __kd: { tp(x: number): void } }).__kd.tp(v), Number(x));
      await page.waitForTimeout(1600);
      const f = join(out, `${id}${x ? '-' + x : ''}.png`);
      await page.screenshot({ path: f });
      console.log(`  ${f}`);
    }
  } finally {
    await browser.close();
    await server.close();
  }
  return 0;
}

// ------------------------------------------------------------------- main

const { cmd, pos, opt } = args();
const run: Record<string, () => number | Promise<number>> = {
  check,
  list: () => list(pos[0]),
  new: () => newRoom(pos[0], opt),
  show: () => show(pos[0]),
  schema,
  shot: () => shot(pos[0], pos.slice(1)),
};
const f = run[cmd];
if (!f) {
  console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).slice(0, 9).map((l) => l.slice(3)).join('\n'));
  process.exit(cmd === 'help' ? 0 : 1);
}
process.exit(await f());
