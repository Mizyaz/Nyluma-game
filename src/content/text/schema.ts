// The story text files' help for editors: `npm run kd -- schema` writes
// these as the *.schema.json files the text files name in their "$schema",
// so an editor such as VS Code explains each field and offers its choices
// while a line is written. The game never imports this file (it checks the
// text with check.ts, which needs nothing); only kd does.

import { z } from 'zod';
import { MOODS, NAME_KEYS, PLACES, SIZE_RANGE, TILT_MAX, WEARS, MEMORY_KEYS, PAINTING_KEYS, STATION_KEYS } from './check';

const schemaRef = z.string().optional().describe('Bu dosyanın yardım şeması; dokunmayın');
const words = z.string().min(1);

const NAME_HELP: Record<(typeof NAME_KEYS)[number], string> = {
  gorti: 'Gorti, oyunun kahramanı',
  babyMoon: 'Bebek Ay (I., II. ve VI. bölümler)',
  oldMoon: 'Yaşlı Ay (III. bölümden sonra)',
  sun: 'Güneş',
  horse: 'Mor at',
  coward: 'Korkak form',
  forms: 'Formlar, hep bir ağızdan',
  voice: 'Kimin olduğu bilinmeyen bir ses',
  one: 'Kalabalıktan biri',
  two: 'Kalabalıktan bir başkası',
  three: 'Kalabalıktan bir üçüncüsü',
  mech: 'Mekanik form',
  suit: 'Takım elbiseli adam',
  moonMan: 'Ay başlı adam',
  sunMan: 'Güneş başlı adam',
  baldMan: 'Sivaslı amca',
  child: 'Gorti, çocukken',
  youth: 'Gorti, gençken',
  warrior: 'Gorti, savaşçıyken',
};

export const NamesSchema = z
  .object({
    $schema: schemaRef,
    ...Object.fromEntries(NAME_KEYS.map((k) => [k, words.describe(`${NAME_HELP[k]}: konuşma balonunda ve kartta görünen ad`)])),
  })
  .catchall(words.describe('Bir ad; konuşmalarda "who" ile bu anahtar yazılır'))
  .describe('Kim ne diye anılıyor. Konuşmalardaki "who" bu dosyanın anahtarlarıdır (gorti, sun, babyMoon...).');

export const CaptionsSchema = z
  .object({ $schema: schemaRef })
  .catchall(words.describe('Resmin altında beliren anlatım. Anahtarı değiştirmeyin: kod onu bu adla ister.'))
  .describe('Anlatımlar: ekranın altındaki tek satırlık yazılar.');

export const LineSchema = z.union([
  words.describe('Anlatıcının sözü (kimse konuşmuyor)'),
  z
    .object({
      who: z.string().optional().describe('Konuşan: names.json\'daki anahtar (gorti, sun, babyMoon, oldMoon...); yazılmazsa anlatıcı'),
      text: words.describe('Söylenen söz'),
      whisper: z.boolean().optional().describe('true: fısıltı (kesik çizgili balon)'),
    })
    .strict(),
]);

export const DialogueSchema = z
  .object({ $schema: schemaRef })
  .catchall(z.array(LineSchema).min(1).describe('Bir konuşma: satırlar sırayla gösterilir. Anahtarı değiştirmeyin.'))
  .describe('Konuşmalar ve incelemeler, anahtarlarıyla.');

const memory = z.object({ title: words.describe('Anının adı (Anılar menüsünde)'), text: words.describe('Anının metni') }).strict();
const station = z
  .object({
    title: words.describe('Durağın adı; anlatımda başta söylenir'),
    fragments: z.array(words).min(1).describe('Anının parçaları, olduğu sırayla; oyun onları tersten söyler'),
  })
  .strict();

export const MemoriesSchema = z
  .object({
    $schema: schemaRef,
    found: z
      .object(Object.fromEntries(MEMORY_KEYS.map((k) => [k, memory])))
      .strict()
      .describe('Gorti\'nin bulduğu sekiz anı (m1 … m8)'),
    reversed: z
      .object({
        caption: words.describe('Anı tersine dönerken söylenen söz, ör. "Geriye doğru"'),
        stations: z.object(Object.fromEntries(STATION_KEYS.map((k) => [k, station]))).strict(),
      })
      .strict()
      .describe('İç Koğuş\'ta (r10) geriye akan anılar'),
  })
  .strict();

export const PaintingsSchema = z
  .object({
    $schema: schemaRef,
    line: words.describe('Her tablonun önünde Gorti\'nin hissettiği'),
    paintings: z
      .object(Object.fromEntries(PAINTING_KEYS.map((k) => [k, z.object({ title: words.describe('Tablonun adı'), caption: words.describe('Tablonun altındaki yazı') }).strict()])))
      .strict(),
  })
  .strict();

export const DocumentsSchema = z
  .object({
    $schema: schemaRef,
    portraits: z.object({ title: words, note: words }).strict().describe('Görüntüler sayfası'),
    russian: z
      .object({ lines: z.array(z.object({ ru: words.describe('Rusça satır'), tr: words.describe('Altındaki Türkçe karşılığı') }).strict()).min(1) })
      .strict()
      .describe('Rusça sözleşme'),
    clause: z.object({ title: words, articles: z.array(words).min(1).describe('Maddeler, sırayla'), signature: words }).strict().describe('Hak aktarımı anlaşması'),
    final: z.object({ title: words, lines: z.array(words).min(1), stamp: words.describe('Damga') }).strict().describe('Son sayfa'),
  })
  .strict()
  .describe('Boş Masa\'daki (r12) kâğıtlar');

const skyLine = z.union([
  words.describe('Basılı tutunca söylediği söz'),
  z.object({ text: words.describe('Söylediği söz'), answer: words.optional().describe('Gorti\'nin cevabı (bazen söylenir)') }).strict(),
]);

const face = z
  .object({
    mood: z.enum(MOODS).optional().describe('Ruh hali: calm sakin, sleepy uykulu, curious meraklı, worried endişeli, delighted neşeli, grumpy huysuz, proud gururlu, teary ağlamaklı'),
    wear: z
      .array(z.enum(WEARS))
      .optional()
      .describe('Üstündekiler: nightcap takke, bandage yara bandı, freckles çil, scarf atkı, crown kristal taç, sweat ter damlası, flowers çiçekler, zzz uyku, notes notalar; [] hepsini kaldırır'),
    tilt: z.number().min(-TILT_MAX).max(TILT_MAX).optional().describe('Başının eğikliği, derece (sola eksi, sağa artı)'),
    size: z.number().min(SIZE_RANGE[0]).max(SIZE_RANGE[1]).optional().describe('Boyu: 1 olağan'),
    place: z.enum(PLACES).optional().describe('Köşedeki yeri: corner köşede, peek kenardan bakıyor, high yukarıda, low aşağıda, inward içeri doğru'),
    lines: z.array(skyLine).optional().describe('Basılı tutunca söyledikleri; üçten azsa bölümün ve varsayılanın sözleriyle tamamlanır'),
  })
  .strict();

const page = z.object({ sun: face.optional().describe('Güneş'), moon: face.optional().describe('Ay') }).strict();

export const SkyTextSchema = z
  .object({
    $schema: schemaRef,
    default: page.describe('Her sayfada, aksi söylenmedikçe'),
    chapters: z.record(z.string(), page).optional().describe('Bölüme göre (c1 … c6); varsayılanın üstüne yazar'),
    rooms: z.record(z.string(), page).optional().describe('Odaya göre (r01, b02...); bölümün üstüne yazar'),
  })
  .strict()
  .describe('Güneş ve Ay: her sayfadaki hâlleri ve basılı tutunca söyledikleri');

/** Each text file's schema, by the schema file it names. */
export const TEXT_SCHEMAS: Record<string, z.ZodType> = {
  'names.schema.json': NamesSchema,
  'captions.schema.json': CaptionsSchema,
  'dialogue.schema.json': DialogueSchema,
  'memories.schema.json': MemoriesSchema,
  'paintings.schema.json': PaintingsSchema,
  'documents.schema.json': DocumentsSchema,
  'sky.schema.json': SkyTextSchema,
};
