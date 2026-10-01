import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { checkLibrary } from './src/music/library';

/** Ships the third-party license notices next to the game. */
function notices(): Plugin {
  return {
    name: 'third-party-notices',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'THIRD_PARTY_NOTICES.md', source: readFileSync('THIRD_PARTY_NOTICES.md', 'utf8') });
    },
  };
}

const MUSIC_DIR = 'music';
const MUSIC_TYPES: Record<string, string> = {
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.flac': 'audio/flac',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * Ships the music library (music/): tracks.json, the audio files it lists
 * and each piece's license note. The build fails when a piece lacks an
 * allowed license or its note in music/licenses/, so nothing ships without
 * its paperwork. The dev server serves the folder as it is.
 */
function musicLibrary(): Plugin {
  return {
    name: 'music-library',
    configureServer(server) {
      server.middlewares.use('/music/', (req, res, next) => {
        const rel = normalize(decodeURIComponent((req.url ?? '').split('?')[0] ?? '')).replace(/^[/\\]+/, '');
        const file = join(MUSIC_DIR, rel);
        if (rel.startsWith('..') || !existsSync(file) || !statSync(file).isFile()) return next();
        res.setHeader('Content-Type', MUSIC_TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream');
        res.end(readFileSync(file));
      });
    },
    generateBundle() {
      const json: unknown = JSON.parse(readFileSync(join(MUSIC_DIR, 'tracks.json'), 'utf8'));
      const lib = checkLibrary(json, (p) => existsSync(join(MUSIC_DIR, p)));
      if (lib.errors.length) this.error(`music/tracks.json:\n  ${lib.errors.join('\n  ')}`);
      this.emitFile({ type: 'asset', fileName: 'music/tracks.json', source: `${JSON.stringify({ tracks: lib.tracks }, null, 2)}\n` });
      for (const t of lib.tracks) {
        if (t.file) this.emitFile({ type: 'asset', fileName: `music/${t.file}`, source: readFileSync(join(MUSIC_DIR, t.file)) });
        this.emitFile({ type: 'asset', fileName: `music/licenses/${t.id}.txt`, source: readFileSync(join(MUSIC_DIR, 'licenses', `${t.id}.txt`)) });
      }
    },
  };
}

// Route-free static game: relative base works at a domain root and in a
// repository sub-path (GitHub Pages project sites) alike.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [notices(), musicLibrary()],
  define: {
    // The e2e build exposes a read-only state probe for browser tests.
    // Production builds compile it away entirely.
    __E2E__: JSON.stringify(mode === 'e2e'),
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1600,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  server: {
    host: true,
  },
}));
