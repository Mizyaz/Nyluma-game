// Development-only sheet for the creature / celestial / crowd artwork (not
// part of the production build). Rasterizes every part like the game does
// and assembles the multi-part creatures at their attachment offsets.
// Query params: ?zoom=2 (part grid zoom multiplier) &only=whale,sun (key prefixes)
import { creatureParts } from '../game/art/characters/creatures';
import { rasterizeSvg, svgMarkup } from '../game/art/TextureFactory';
import type { PartArt } from '../game/art/rigTypes';

const params = new URLSearchParams(location.search);
const zoomMul = Number(params.get('zoom') ?? '1') || 1;
const only = (params.get('only') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const parts = creatureParts();
const byKey = new Map<string, PartArt>(parts.map((p) => [p.key, p]));
const imgs = new Map<string, HTMLImageElement>();

function gridZoom(p: PartArt): number {
  const m = Math.max(p.w, p.h);
  return (m <= 50 ? 3 : m <= 130 ? 2 : 1) * zoomMul;
}

async function loadAll(): Promise<void> {
  const seen = new Set<string>();
  for (const p of parts) {
    if (seen.has(p.key)) console.error('duplicate key', p.key);
    seen.add(p.key);
  }
  await Promise.all(
    parts.map(async (p) => {
      try {
        imgs.set(p.key, await rasterizeSvg(svgMarkup(p, p.scale ?? 2)));
      } catch (e) {
        console.error('failed to rasterize', p.key, e);
      }
    }),
  );
}

function partGrid(): void {
  const grid = document.getElementById('parts')!;
  for (const p of parts) {
    if (only.length && !only.some((o) => p.key.startsWith(o))) continue;
    const img = imgs.get(p.key);
    if (!img) continue;
    const z = gridZoom(p);
    const fig = document.createElement('figure');
    const wrap = document.createElement('div');
    wrap.className = 'wrap';
    // The decoded image itself (its blob URL is already revoked, so no clone).
    const el = img;
    el.style.width = `${p.w * z}px`;
    el.style.height = `${p.h * z}px`;
    wrap.appendChild(el);
    const cross = document.createElement('div');
    cross.className = 'cross';
    cross.style.left = `${p.px * z}px`;
    cross.style.top = `${p.py * z}px`;
    wrap.appendChild(cross);
    fig.appendChild(wrap);
    const cap = document.createElement('figcaption');
    cap.innerHTML = `${p.key}<br><small>${p.w}×${p.h} · pivot (${p.px},${p.py}) · ×${p.scale ?? 2}</small>`;
    fig.appendChild(cap);
    grid.appendChild(fig);
  }
}

// ------------------------------------------------------------ assemblies

interface Piece {
  key: string;
  /** Offset of this piece's pivot from the root pivot (root frame). */
  x: number;
  y: number;
  rot?: number;
}

function drawPiece(ctx: CanvasRenderingContext2D, pc: Piece): void {
  const p = byKey.get(pc.key);
  const img = imgs.get(pc.key);
  if (!p || !img) {
    console.error('missing part', pc.key);
    return;
  }
  ctx.save();
  ctx.translate(pc.x, pc.y);
  ctx.rotate(pc.rot ?? 0);
  ctx.drawImage(img, -p.px, -p.py, p.w, p.h);
  ctx.restore();
}

function assembly(title: string, w: number, h: number, z: number, rootX: number, rootY: number, pieces: Piece[]): void {
  if (only.length && !pieces.some((pc) => only.some((o) => pc.key.startsWith(o)))) return;
  const c = document.createElement('canvas');
  const dpr = 2;
  c.width = Math.ceil(w * z * dpr);
  c.height = Math.ceil(h * z * dpr);
  c.style.width = `${w * z}px`;
  c.style.height = `${h * z}px`;
  const ctx = c.getContext('2d')!;
  ctx.scale(z * dpr, z * dpr);
  ctx.translate(rootX, rootY);
  for (const pc of pieces) drawPiece(ctx, pc);
  // Root pivot marker.
  ctx.strokeStyle = '#ff2a2a';
  ctx.lineWidth = 1 / z;
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo(4, 0);
  ctx.moveTo(0, -4);
  ctx.lineTo(0, 4);
  ctx.stroke();
  const fig = document.createElement('figure');
  fig.appendChild(c);
  const cap = document.createElement('figcaption');
  cap.textContent = title;
  fig.appendChild(cap);
  document.getElementById('assembled')!.appendChild(fig);
}

function sunRays(): Piece[] {
  // As in Celestial: 24 spikes at radius 128, every fourth one bent.
  const out: Piece[] = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    out.push({ key: i % 4 === 1 ? 'sun.ray.broken' : 'sun.ray', x: Math.cos(a) * 128, y: Math.sin(a) * 128, rot: a + Math.PI / 2 });
  }
  return out;
}

function assemblies(): void {
  const whale = (fin: number, fluke: number): Piece[] => [
    { key: 'whale.fluke', x: -190, y: -3, rot: fluke },
    { key: 'whale.body', x: 0, y: 0 },
    { key: 'whale.fin', x: 45, y: 28, rot: fin },
  ];
  assembly('whale (rest)', 540, 170, 1.2, 310, 85, whale(0, 0));
  assembly('whale (fin +0.35, fluke -0.3)', 540, 170, 1.2, 310, 85, whale(0.35, -0.3));

  const sparrow = (r: number): Piece[] => [{ key: 'sparrow.body', x: 0, y: 0 }, { key: 'sparrow.wing', x: -6, y: -14, rot: r }];
  assembly('sparrow (rest)', 80, 60, 3, 42, 42, sparrow(0));
  assembly('sparrow (wing +0.9 / up)', 80, 60, 3, 42, 42, sparrow(0.9));

  const birds: [string, number, number][] = [['bird.a', -2, -5], ['bird.b', -2, -5], ['bird.c', -1, -4]];
  for (const [k, x, y] of birds) {
    assembly(`${k} (rest)`, 50, 36, 4, 28, 18, [{ key: k, x: 0, y: 0 }, { key: `${k}.wing`, x, y }]);
    assembly(`${k} (wing up)`, 50, 36, 4, 28, 18, [{ key: k, x: 0, y: 0 }, { key: `${k}.wing`, x, y, rot: 0.9 }]);
  }

  const fish: [string, number][] = [['fish.a', -20], ['fish.b', -19], ['fish.c', -17]];
  for (const [k, x] of fish) {
    assembly(`${k} (rest)`, 64, 34, 4, 36, 17, [{ key: `${k}.tail`, x, y: 0 }, { key: k, x: 0, y: 0 }]);
    assembly(`${k} (tail 0.4)`, 64, 34, 4, 36, 17, [{ key: `${k}.tail`, x, y: 0, rot: 0.4 }, { key: k, x: 0, y: 0 }]);
  }

  assembly('moon.baby (eye + mouth)', 280, 280, 1.2, 140, 140, [
    { key: 'moon.baby', x: 0, y: 0 },
    { key: 'moon.baby.eye', x: -68, y: -12 },
    { key: 'moon.baby.mouth', x: -34, y: 46 },
  ]);
  assembly('moon.baby (lid)', 280, 280, 1.2, 140, 140, [
    { key: 'moon.baby', x: 0, y: 0 },
    { key: 'moon.baby.eye', x: -68, y: -12 },
    { key: 'moon.baby.lid', x: -68, y: -12 },
    { key: 'moon.baby.mouth', x: -34, y: 46 },
  ]);
  assembly('moon.old (eye + laugh)', 320, 320, 1.1, 160, 160, [
    { key: 'moon.old', x: 0, y: 0 },
    { key: 'moon.old.eye', x: -88, y: -26 },
    { key: 'moon.old.mouth.laugh', x: -46, y: 46 },
  ]);
  assembly('moon.old (lid + closed mouth)', 320, 320, 1.1, 160, 160, [
    { key: 'moon.old', x: 0, y: 0 },
    { key: 'moon.old.eye', x: -88, y: -26 },
    { key: 'moon.old.lid', x: -88, y: -26 },
    { key: 'moon.old.mouth', x: -46, y: 46 },
  ]);
  assembly('sun (eyes + open mouth)', 480, 480, 0.9, 240, 240, [
    ...sunRays(),
    { key: 'sun.disk', x: 0, y: 0 },
    { key: 'sun.eye', x: -46, y: -18 },
    { key: 'sun.eye', x: 46, y: -18 },
    { key: 'sun.mouth.open', x: 0, y: 54 },
  ]);
  assembly('sun (lids + closed mouth)', 480, 480, 0.9, 240, 240, [
    ...sunRays(),
    { key: 'sun.disk', x: 0, y: 0 },
    { key: 'sun.eye', x: -46, y: -18 },
    { key: 'sun.eye', x: 46, y: -18 },
    { key: 'sun.lid', x: -46, y: -18 },
    { key: 'sun.lid', x: 46, y: -18 },
    { key: 'sun.mouth', x: 0, y: 54 },
  ]);
  assembly('committee', 250, 210, 1.6, 60, 200, [
    { key: 'attendee.sit', x: 0, y: 0 },
    { key: 'attendee.stand', x: 100, y: 0 },
    { key: 'attendee.sit', x: 160, y: 0 },
  ]);
  assembly('crowd forms + raccoons', 330, 150, 1.6, 40, 140, [
    { key: 'raccoon.shadow', x: 240, y: 0 },
    { key: 'raccoon.shadow', x: 270, y: -6 },
    { key: 'form.shadow', x: 0, y: 0 },
    { key: 'form.point', x: 60, y: 0 },
    { key: 'raccoon.sit', x: 160, y: 0 },
    { key: 'raccoon.sniff', x: 230, y: 0 },
  ]);
  assembly('giant legs + finger + drips', 560, 580, 0.8, 200, 570, [
    { key: 'giant.legs', x: 0, y: 0 },
    { key: 'giant.finger', x: 300, y: 0 },
    { key: 'giant.drip', x: 290, y: -300 },
    { key: 'giant.drip', x: 310, y: -250 },
  ]);
}

void loadAll()
  .then(() => {
    assemblies();
    partGrid();
  })
  .catch((e: unknown) => console.error('creature preview failed', e))
  .finally(() => {
    document.body.dataset.ready = '1';
  });
