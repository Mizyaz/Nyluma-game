// Development-only sheet for the memory journal vignettes, the memory station
// fragments and the dialogue portraits (not part of the production build).
// Query params: ?only=memory,portrait:sun (sections or kind:key) &zoom=2
import {
  FRAGMENT_KEYS,
  MEMORY_ART_KEYS,
  PORTRAIT_KEYS,
  fragmentArtUrl,
  memoryArtUrl,
  portraitUrl,
} from '../content/art/memoryArt';

interface Section {
  kind: string;
  title: string;
  keys: string[];
  url: (key: string) => string;
  width: number;
  /** Extra small rendition to judge readability at in-game sizes. */
  small: number;
  round: boolean;
}

const params = new URLSearchParams(location.search);
const zoom = Number(params.get('zoom') ?? '1') || 1;
const only = (params.get('only') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const UNKNOWN = '__unknown__';
const sections: Section[] = [
  { kind: 'memory', title: 'memoryArtUrl — 320×200', keys: [...MEMORY_ART_KEYS, UNKNOWN], url: memoryArtUrl, width: 480, small: 0, round: false },
  { kind: 'fragment', title: 'fragmentArtUrl — 200×150', keys: [...FRAGMENT_KEYS, UNKNOWN], url: fragmentArtUrl, width: 220, small: 110, round: false },
  { kind: 'portrait', title: 'portraitUrl — 160×160', keys: [...PORTRAIT_KEYS, UNKNOWN], url: portraitUrl, width: 160, small: 64, round: true },
];

function wanted(kind: string, key: string): boolean {
  if (only.length === 0) return true;
  return only.includes(kind) || only.includes(`${kind}:${key}`);
}

const sheet = document.getElementById('sheet')!;
const loads: Promise<void>[] = [];

function image(src: string, label: string, width: number): HTMLImageElement {
  const img = new Image();
  loads.push(
    new Promise<void>((res) => {
      img.addEventListener('load', () => res());
      img.addEventListener('error', () => {
        console.error('memory art failed to load:', label);
        res();
      });
    }),
  );
  img.alt = label;
  img.style.width = `${width}px`;
  img.src = src;
  return img;
}

for (const sec of sections) {
  const keys = sec.keys.filter((k) => wanted(sec.kind, k));
  if (keys.length === 0) continue;
  const h2 = document.createElement('h2');
  h2.textContent = sec.title;
  const grid = document.createElement('div');
  grid.className = 'grid';
  for (const key of keys) {
    const label = key === UNKNOWN ? '(unknown key)' : key;
    const src = sec.url(key);
    const fig = document.createElement('figure');
    const pair = document.createElement('div');
    pair.className = 'pair';
    const w = sec.width * zoom;
    if (sec.round) {
      const big = document.createElement('div');
      big.className = 'circle';
      big.style.width = big.style.height = `${w}px`;
      big.appendChild(image(src, `${sec.kind}:${label}`, w));
      pair.appendChild(big);
      const small = document.createElement('div');
      small.className = 'circle small';
      small.appendChild(image(src, `${sec.kind}:${label} (small)`, sec.small));
      pair.appendChild(small);
    } else {
      pair.appendChild(image(src, `${sec.kind}:${label}`, w));
      if (sec.small && zoom === 1) pair.appendChild(image(src, `${sec.kind}:${label} (small)`, sec.small));
    }
    fig.appendChild(pair);
    const cap = document.createElement('figcaption');
    cap.textContent = label;
    fig.appendChild(cap);
    grid.appendChild(fig);
  }
  sheet.append(h2, grid);
}

void Promise.all(loads).then(() => {
  document.body.dataset.ready = '1';
});
