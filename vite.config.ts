import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';

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

// Route-free static game: relative base works at a domain root and in a
// repository sub-path (GitHub Pages project sites) alike.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [notices()],
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
