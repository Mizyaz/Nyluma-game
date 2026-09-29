import { MUSIC_CUES, type Track } from './types';

// The music library: recorded pieces in music/tracks/ (or streamed from an
// online library), each listed in music/tracks.json with its license, and a
// license note per piece in music/licenses/<id>.txt. The build refuses a
// piece without an allowed license or without its license note, so nothing
// ships without its paperwork. See music/README.md.

/**
 * Licenses a piece may carry. Public-domain dedications need no credit;
 * "BY" licenses require the credit the game shows under Credits.
 */
export const ALLOWED_LICENSES: Record<string, { name: string; credit: boolean }> = {
  'CC0-1.0': { name: 'CC0 1.0 (kamu malı adanışı)', credit: false },
  'PDM-1.0': { name: 'Public Domain Mark 1.0 (kamu malı)', credit: false },
  'CC-BY-4.0': { name: 'Creative Commons Atıf 4.0', credit: true },
  'CC-BY-3.0': { name: 'Creative Commons Atıf 3.0', credit: true },
};

export const AUDIO_EXTENSIONS = ['.mp3', '.ogg', '.oga', '.m4a', '.wav', '.flac', '.opus'];

export interface LibraryCheck {
  tracks: Track[];
  errors: string[];
}

/**
 * Checks a parsed tracks.json. `exists(path)` answers whether a file exists
 * inside the library folder (paths like "tracks/x.mp3", "licenses/x.txt").
 */
export function checkLibrary(json: unknown, exists: (path: string) => boolean): LibraryCheck {
  const errors: string[] = [];
  const tracks: Track[] = [];
  const list = (json as { tracks?: unknown } | null)?.tracks;
  if (!Array.isArray(list)) return { tracks, errors: ['tracks.json: "tracks" listesi yok'] };
  const ids = new Set<string>();
  list.forEach((raw: unknown, i) => {
    const t = raw as Partial<Track>;
    const before = errors.length;
    const at = `tracks[${i}]${typeof t?.id === 'string' ? ` (${t.id})` : ''}`;
    const bad = (msg: string): void => {
      errors.push(`${at}: ${msg}`);
    };
    if (!t || typeof t !== 'object') return bad('nesne değil');
    if (typeof t.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(t.id)) return bad('id küçük harf, rakam ve tire olmalı');
    if (ids.has(t.id)) return bad('aynı id iki kez');
    ids.add(t.id);
    for (const k of ['title', 'artist', 'source'] as const) if (typeof t[k] !== 'string' || !t[k]) bad(`"${k}" eksik`);
    if (typeof t.license !== 'string' || !(t.license in ALLOWED_LICENSES)) bad(`lisans "${String(t.license)}" izinli değil (izinli: ${Object.keys(ALLOWED_LICENSES).join(', ')})`);
    if (!exists(`licenses/${t.id}.txt`)) bad(`lisans notu yok: music/licenses/${t.id}.txt`);
    if (typeof t.file === 'string') {
      if (t.file.includes('..') || t.file.startsWith('/')) bad('"file" kütüphane klasörünün içinde olmalı');
      else if (!AUDIO_EXTENSIONS.some((e) => t.file!.toLowerCase().endsWith(e))) bad(`"file" bir ses dosyası olmalı (${AUDIO_EXTENSIONS.join(', ')})`);
      else if (!exists(t.file)) bad(`ses dosyası yok: music/${t.file}`);
    } else if (typeof t.url === 'string') {
      if (!/^https:\/\//.test(t.url)) bad('"url" https:// ile başlamalı');
    } else bad('"file" ya da "url" gerekli');
    if (!Array.isArray(t.cues) || t.cues.length === 0) bad('"cues" listesi gerekli');
    else for (const c of t.cues) if (c !== '*' && !(MUSIC_CUES as readonly string[]).includes(c)) bad(`bilinmeyen cue "${String(c)}" (bilinenler: *, ${MUSIC_CUES.join(', ')})`);
    if (t.volume !== undefined && (typeof t.volume !== 'number' || t.volume < 0 || t.volume > 1.5)) bad('"volume" 0 ile 1.5 arasında olmalı');
    if (errors.length === before) {
      tracks.push({
        id: t.id,
        title: t.title!,
        artist: t.artist!,
        license: t.license!,
        source: t.source!,
        cues: t.cues!,
        ...(t.file ? { file: t.file } : { url: t.url! }),
        ...(t.volume !== undefined ? { volume: t.volume } : {}),
      });
    }
  });
  return { tracks, errors };
}

/**
 * Loads the library the build shipped next to the game (music/tracks.json).
 * Any failure (offline, file:// or a missing file) means an empty library:
 * the generated piano plays instead.
 */
export async function loadLibrary(base = 'music/'): Promise<Track[]> {
  try {
    const res = await fetch(`${base}tracks.json`, { cache: 'no-cache' });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    // The build already refused files it could not find; trust the list.
    return checkLibrary(json, () => true).tracks;
  } catch {
    return [];
  }
}

/** Address of a track relative to the page. */
export function trackUrl(t: Track, base = 'music/'): string {
  return t.url ?? `${base}${t.file ?? ''}`;
}

/**
 * Cues that "*" does not cover: a scene's mood (the dialogue scenes'
 * 'tension') needs a piece chosen for it, or the generated strings play.
 */
const NAMED_ONLY: readonly string[] = ['tension'];

/** The pieces that may play for a cue: those naming it first, then "any". */
export function tracksFor(tracks: readonly Track[], cue: string): Track[] {
  const named = tracks.filter((t) => t.cues.includes(cue));
  return named.length || NAMED_ONLY.includes(cue) ? named : tracks.filter((t) => t.cues.includes('*'));
}
