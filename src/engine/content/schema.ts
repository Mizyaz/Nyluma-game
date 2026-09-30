// The content files' schema: what a chapter list (chapters.json) and a room
// file (content/chapters/rooms/*.json) may say, with the help text an editor
// shows while one is written (the JSON Schemas `npm run kd -- schema`
// writes next to them). The game imports only the types (types.ts); the
// schema itself runs in `kd check` and the tests.

import { z } from 'zod';
import { SOLID_STYLES, THEME_IDS } from '../../content/data/roomTypes';
import { MUSIC_CUES } from '../../music/types';
import { ABILITIES, PLAYER_KINDS } from '../state/types';

const id = z.string().regex(/^[a-z][a-zA-Z0-9_]*$/, 'küçük harfle başlayan bir ad (harf, rakam, _)');
const cond = z.string().describe('Koşul: bayrak adı, "form:human", "room:b01"; ! değil, & ve, | veya, ( ). Örnek: "b01.told & !form:root"');
const px = z.number().describe('Dünya pikseli');

export const SkySchema = z
  .object({
    moon: z.enum(['baby', 'old', 'none']).optional().describe('Sol üstteki Ay: bebek, yaşlı ya da hiç'),
    sun: z.enum(['calm', 'laugh', 'none']).optional().describe('Sağ üstteki Güneş: sakin, gülüyor ya da hiç'),
  })
  .strict();

export const LineSchema = z
  .object({
    who: z.string().optional().describe('Konuşan: kadrodan biri (kd list cast) ya da gorti, sun, moon...; yoksa anlatıcı kutusu'),
    text: z.string().min(1).describe('Söylenen söz'),
    whisper: z.boolean().optional().describe('Fısıltı (kesik çizgili balon)'),
  })
  .strict();

const FORMS = ['root', 'human'] as const;

/** Something that happens; a list of these runs in order. */
export type ActionJson =
  | { say: z.infer<typeof LineSchema>[] }
  | { flag: string }
  | { unflag: string }
  | { form: (typeof FORMS)[number] }
  | { unlock: (typeof ABILITIES)[number] }
  | { sky: z.infer<typeof SkySchema> }
  | { go: string }
  | { word: string }
  | { wait: number }
  | { if: string; then?: ActionJson[]; else?: ActionJson[] };

export const ActionSchema: z.ZodType<ActionJson> = z.lazy(() =>
  z.union([
    z.object({ say: z.array(LineSchema).min(1).describe('Konuşma balonları, sırayla') }).strict(),
    z.object({ flag: z.string().describe('Bayrak koy (kalıcı, kayda geçer)') }).strict(),
    z.object({ unflag: z.string().describe('Bayrağı kaldır') }).strict(),
    z.object({ form: z.enum(FORMS).describe('Gorti bu forma dönüşür') }).strict(),
    z.object({ unlock: z.enum(ABILITIES).describe('Yetenek aç (form = R ile dönüşme)') }).strict(),
    z.object({ sky: SkySchema.describe('Ay ve Güneş değişir (oda yeniden yüklenene dek)') }).strict(),
    z.object({ go: z.string().describe('Bu odaya geç') }).strict(),
    z.object({ word: z.string().max(12).describe('Gorti\'nin üstünde çizgi roman sesi, ör. "OLDU!"') }).strict(),
    z.object({ wait: z.number().min(0).max(10000).describe('Bekle (ms)') }).strict(),
    z
      .object({
        if: cond,
        then: z.array(ActionSchema).optional(),
        else: z.array(ActionSchema).optional(),
      })
      .strict(),
  ]),
);

export const PropSchema = z
  .object({
    key: z.string().describe('Çizim adı (kd list props), ör. "prop.tree"'),
    x: px,
    y: px.optional().describe('Taban çizgisi (varsayılan: yerde)'),
    scale: z.number().positive().optional(),
    depth: z.number().optional().describe('Derinlik: eksi = daha arkada (px)'),
    flip: z.boolean().optional().describe('Yatay çevir'),
    when: cond.optional(),
    unless: cond.optional(),
  })
  .strict();

export const NpcSchema = z
  .object({
    id,
    who: z.string().describe('Kadrodan biri (kd list cast)'),
    x: px,
    facing: z.union([z.literal(1), z.literal(-1)]).optional().describe('1 sağa, -1 sola bakar'),
    when: cond.optional().describe('Bu koşul tutarken odada durur'),
    talk: z.array(LineSchema).min(1).describe('Gorti ilk konuştuğunda söyledikleri'),
    again: z.array(LineSchema).optional().describe('Sonraki konuşmalarda (varsayılan: talk\'un son satırı)'),
    then: z.array(ActionSchema).optional().describe('İlk konuşmadan sonra olanlar'),
  })
  .strict();

export const GateSchema = z
  .object({
    id,
    x: px,
    open: cond.describe('Kapı bu koşul tutunca açılır, ör. "form:human"'),
    look: z.enum(SOLID_STYLES).optional().describe('Görünüş (varsayılan stone)'),
    h: z.number().positive().optional().describe('Yükseklik (varsayılan 260)'),
    hint: z.string().optional().describe('Kapalıyken Gorti yaklaşınca çıkan ipucu'),
  })
  .strict();

export const TriggerSchema = z
  .object({
    id,
    x: px,
    w: z.number().positive().optional().describe('Genişlik (varsayılan 80)'),
    repeat: z.boolean().optional().describe('Her ziyarette çalışır (varsayılan: oyun boyunca bir kez)'),
    when: cond.optional(),
    do: z.array(ActionSchema).min(1).describe('Gorti buraya girince olanlar'),
  })
  .strict();

export const ExitSchema = z
  .object({
    to: z.string().describe('Gidilen oda'),
    side: z.enum(['left', 'right']).optional().describe('Hangi kenarda (varsayılan right)'),
    x: px.optional(),
    when: cond.optional().describe('Bu koşul tutunca açılır'),
  })
  .strict();

export const RoomSchema = z
  .object({
    $schema: z.string().optional(),
    id: id.describe('Oda adı (dosya adıyla aynı)'),
    chapter: z.string().describe('Bölüm (chapters.json\'daki id)'),
    title: z.string().min(1).describe('Odanın adı'),
    theme: z.enum(THEME_IDS).describe('Görünüş: gökyüzü, uzak katmanlar, ışık'),
    music: z.enum(['none', ...MUSIC_CUES]).optional().describe('Müzik (varsayılan none)'),
    width: z.number().min(640).max(12000).describe('Genişlik (px); ekran 1280'),
    height: z.number().min(720).max(3000).optional().describe('Yükseklik (varsayılan 900)'),
    floor: z.number().optional().describe('Yer çizgisi y (varsayılan height - 180)'),
    ground: z.enum(SOLID_STYLES).optional().describe('Yerin görünüşü (varsayılan soil)'),
    player: z.enum(PLAYER_KINDS).optional().describe('Oynanan beden (varsayılan gorti)'),
    form: z.enum(FORMS).optional().describe('Girişte Gorti\'nin formu'),
    spawn: z.object({ x: px, facing: z.union([z.literal(1), z.literal(-1)]).optional() }).strict().describe('Başlangıç yeri'),
    sky: SkySchema.optional().describe('Bölümün Ay/Güneş\'ini bu odada değiştirir'),
    enter: z.array(ActionSchema).optional().describe('Odaya ilk girişte bir kez olanlar'),
    props: z.array(PropSchema).optional().describe('Dekor'),
    npcs: z.array(NpcSchema).optional().describe('Konuşulabilen karakterler'),
    gates: z.array(GateSchema).optional().describe('Koşul tutana dek kapalı duran kapılar'),
    triggers: z.array(TriggerSchema).optional().describe('Gorti girince çalışan şeritler'),
    exits: z.array(ExitSchema).optional().describe('Çıkışlar'),
    memories: z.array(z.object({ id: z.string(), x: px }).strict()).optional().describe('Toplanan anılar'),
  })
  .strict();

export const ChapterSchema = z
  .object({
    id: id.describe('Bölüm adı, ör. "c6"'),
    number: z.number().int().positive().describe('Bölüm numarası (menüde Romen rakamı)'),
    title: z.string().min(1),
    sky: z.object({ moon: SkySchema.shape.moon.unwrap(), sun: SkySchema.shape.sun.unwrap() }).strict().describe('Bu bölümde Ay ve Güneş'),
    rooms: z.array(z.string()).min(1).describe('Odalar, hikâye sırasıyla'),
  })
  .strict();

export const StorySchema = z
  .object({
    $schema: z.string().optional(),
    chapters: z.array(ChapterSchema).min(1),
  })
  .strict();

export type SkyJson = z.infer<typeof SkySchema>;
export type LineJson = z.infer<typeof LineSchema>;
export type PropJson = z.infer<typeof PropSchema>;
export type NpcJson = z.infer<typeof NpcSchema>;
export type GateJson = z.infer<typeof GateSchema>;
export type TriggerJson = z.infer<typeof TriggerSchema>;
export type ExitJson = z.infer<typeof ExitSchema>;
export type RoomJson = z.infer<typeof RoomSchema>;
export type ChapterJson = z.infer<typeof ChapterSchema>;
export type StoryJson = z.infer<typeof StorySchema>;

/** Readable problems in a file (empty when it is valid). */
export function schemaProblems(schema: z.ZodType, data: unknown, where: string): string[] {
  const r = schema.safeParse(data);
  if (r.success) return [];
  return r.error.issues.map((i) => `${where}${i.path.length ? ' › ' + i.path.join('.') : ''}: ${i.message}`);
}
