// Development-only prop sheet (not part of the production build).
// Query params: only=<substr,substr> filter, zoom=<n> crisp enlargement,
// maxh=<px> height cap (default 400), bg=<css color> cell background,
// plat=0 hides the simulated branch platforms of the crystal tree.
import { propParts } from '../content/art/props';
import { svgMarkup } from '../render/2d/TextureFactory';

const params = new URLSearchParams(location.search);
const only = params.get('only')?.split(',').filter(Boolean) ?? [];
const zoom = Number(params.get('zoom') ?? '1');
const maxH = Number(params.get('maxh') ?? '400');
const bg = params.get('bg');
const showPlat = params.get('plat') !== '0';

/** Walkable surfaces the art must line up with: [x0, x1, y] in image px. */
const SURFACES: Record<string, [number, number, number][]> = {
  'prop.bed': [[17, 233, 38]],
  'prop.blocks': [[7, 65, 64], [65, 123, 64], [37, 95, 6]],
  'prop.chest': [[7, 153, 4]],
  'prop.log': [[15, 145, 26]],
  'prop.dormbed': [[10, 180, 10]],
};
/** Branch platforms drawn by the game over the crystal tree (24 px thick). */
const TREE_LOW: [number, number, number][] = [
  [120, 270, 828],
  [310, 470, 718],
  [100, 260, 608],
];
const TREE_HIGH: [number, number, number][] = [
  [320, 480, 498],
  [110, 270, 388],
  [330, 490, 278],
  [120, 280, 168],
  [340, 520, 58],
];
const PLATFORMS: Record<string, [number, number, number][]> = {
  'prop.crystaltree': TREE_LOW,
  'prop.crystaltree.bloom': [...TREE_LOW, ...TREE_HIGH],
};

const EXPECTED = `bed blocks toywhale marks fourteen window chest toyhorse lamp rootdoor rootdoor.open fossil coil fossilroot
crystals.teal crystals.blue crystals.orange pool.poison crystaltree crystaltree.bloom star log mempool tree bush plate
plate.down shrine stone knot knot.calm river reflectpool dormbed station clock console gear keyoutline lock officedoor
officedoor.open bench coatrack table chair anchor site node node.lit memory lantern lantern.lit flowernode
flowernode.open current`
  .split(/\s+/)
  .map((k) => `prop.${k}`);

const grid = document.getElementById('grid')!;
const status = document.getElementById('status')!;
const t0 = performance.now();
const parts = propParts();
const t1 = performance.now();

const keys = parts.map((p) => p.key);
// Fingerprint of every body (FNV-1a) to confirm refactors leave the art unchanged.
let fp = 2166136261;
for (const p of parts) for (let i = 0; i < p.body.length; i++) fp = Math.imul(fp ^ p.body.charCodeAt(i), 16777619);
const fingerprint = (fp >>> 0).toString(16);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
const missing = EXPECTED.filter((k) => !keys.includes(k));
const extra = keys.filter((k) => !EXPECTED.includes(k));
if (dupes.length) console.error('duplicate prop keys', dupes.join(', '));
if (missing.length) console.error('missing prop keys', missing.join(', '));
if (extra.length) console.error('unexpected prop keys', extra.join(', '));
for (const p of parts) {
  if (p.w > 2040 || p.h > 2040) console.error('prop too large', p.key);
  if (p.scale !== 1) console.error('prop scale must be 1', p.key);
}

function mark(stage: HTMLElement, cls: string, x: number, y: number, w = 0, h = 0): void {
  const el = document.createElement('div');
  el.className = cls;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  if (w) el.style.width = `${w}px`;
  if (h) el.style.height = `${h}px`;
  stage.appendChild(el);
}

const shown = parts.filter((p) => !only.length || only.some((o) => p.key.includes(o)));
let totalBytes = 0;
const timings: [string, number][] = [];
const loads = shown.map(
  (p) =>
    new Promise<void>((resolve) => {
      const d = Math.min(zoom, maxH / p.h);
      const raster = (p.scale ?? 1) * Math.max(1, d);
      const svg = svgMarkup(p, raster);
      totalBytes += svg.length;
      const fig = document.createElement('figure');
      if (bg) fig.style.background = bg;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const img = new Image();
      img.width = Math.round(p.w * d);
      img.height = Math.round(p.h * d);
      img.onload = () => {
        // Time the raster pass the atlas builder performs (drawImage of the SVG).
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.ceil(p.w * (p.scale ?? 1)));
        c.height = Math.max(1, Math.ceil(p.h * (p.scale ?? 1)));
        const t = performance.now();
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        timings.push([p.key, performance.now() - t]);
        resolve();
      };
      img.onerror = () => {
        console.error('bad svg', p.key);
        resolve();
      };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      stage.appendChild(img);
      if (showPlat) for (const [x0, x1, y] of PLATFORMS[p.key] ?? []) mark(stage, 'plat', x0 * d, y * d, (x1 - x0) * d, 24 * d);
      for (const [x0, x1, y] of SURFACES[p.key] ?? []) mark(stage, 'surf', x0 * d, y * d, (x1 - x0) * d);
      mark(stage, 'cross', p.px * d, p.py * d);
      fig.appendChild(stage);
      const cap = document.createElement('figcaption');
      cap.textContent = `${p.key} ${p.w}×${p.h}${d !== 1 ? ` @${d.toFixed(2)}` : ''} ${(svg.length / 1024).toFixed(0)}k`;
      fig.appendChild(cap);
      grid.appendChild(fig);
    }),
);

void Promise.all(loads).then(() => {
  const slow = timings
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k, ms]) => `${k} ${ms.toFixed(0)}ms`)
    .join(', ');
  status.textContent = `${shown.length}/${parts.length} props, generated in ${(t1 - t0).toFixed(0)} ms, ${(totalBytes / 1024).toFixed(0)} KiB SVG, missing: ${missing.length ? missing.join(' ') : 'none'}; slowest raster: ${slow}; fingerprint ${fingerprint}`;
  document.body.dataset.ready = '1';
});
