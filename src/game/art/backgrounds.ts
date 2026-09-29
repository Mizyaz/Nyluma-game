import { P, mix } from './palette';
import { Rng } from './svg';
import { CRYSTAL_COLORS, type TerrainPalette } from './terrain';
import type { ThemeId } from '../data/roomTypes';

// Parallax layer painters. Layers are flat, low-contrast silhouettes so the
// saturated characters and interactive objects read first.

export interface LayerInfo {
  /** Height of the layer canvas and the band where the "horizon" sits. */
  h: number;
  w: number;
  horizon: number;
}

export interface LayerSpec {
  scroll: number;
  /** Raster resolution (0.5 for far, soft layers). */
  res: number;
  draw: (ctx: CanvasRenderingContext2D, info: LayerInfo, rng: Rng) => void;
}

export type Ambient = 'dust' | 'sparkle' | 'wind' | 'petals' | 'embers' | 'drips' | 'none';

export interface ThemeDef {
  sky: [string, string];
  layers: LayerSpec[];
  terrain: TerrainPalette;
  ambient: Ambient;
  /** Horizon position as a fraction of the view height (surface themes). */
  horizon: number;
}

function gradientSky(ctx: CanvasRenderingContext2D, w: number, h: number, top: string, bottom: string): void {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

function hills(ctx: CanvasRenderingContext2D, w: number, h: number, baseY: number, amp: number, color: string, rng: Rng, freq = 1): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, h);
  const k1 = rng.range(0, 6);
  const k2 = rng.range(0, 6);
  for (let x = 0; x <= w + 20; x += 20) {
    const y =
      baseY -
      amp * (0.55 + 0.45 * Math.sin((x / 520) * freq + k1)) -
      amp * 0.35 * Math.sin((x / 190) * freq + k2) * Math.sin(x / 900 + k1);
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();
}

function tree(ctx: CanvasRenderingContext2D, x: number, baseY: number, hgt: number, color: string, rng: Rng, crown: string, ink?: string): void {
  const trunkW = hgt * 0.06;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - trunkW, baseY);
  ctx.quadraticCurveTo(x - trunkW * 0.5, baseY - hgt * 0.5, x - trunkW * 0.3, baseY - hgt * 0.7);
  ctx.lineTo(x + trunkW * 0.3, baseY - hgt * 0.7);
  ctx.quadraticCurveTo(x + trunkW * 0.5, baseY - hgt * 0.5, x + trunkW, baseY);
  ctx.closePath();
  ctx.fill();
  // Branching arms
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const by = baseY - hgt * rng.range(0.35, 0.7);
    const dir = rng.chance(0.5) ? 1 : -1;
    ctx.lineWidth = trunkW * rng.range(0.3, 0.6);
    ctx.beginPath();
    ctx.moveTo(x, by);
    ctx.quadraticCurveTo(x + dir * hgt * 0.12, by - hgt * 0.05, x + dir * hgt * rng.range(0.18, 0.3), by - hgt * rng.range(0.12, 0.22));
    ctx.stroke();
  }
  // Crown: clustered blobs
  ctx.fillStyle = crown;
  const blobs = 7;
  for (let i = 0; i < blobs; i++) {
    const a = (i / blobs) * Math.PI * 2;
    const r = hgt * rng.range(0.13, 0.2);
    const cx = x + Math.cos(a) * hgt * 0.18;
    const cy = baseY - hgt * 0.78 + Math.sin(a) * hgt * 0.12;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  if (ink) {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
  }
}

function pine(ctx: CanvasRenderingContext2D, x: number, baseY: number, hgt: number, color: string, rng: Rng): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, baseY - hgt);
  const tiers = 5;
  for (let i = 1; i <= tiers; i++) {
    const t = i / tiers;
    const ww = hgt * 0.22 * t + rng.range(-3, 3);
    ctx.lineTo(x + ww, baseY - hgt + hgt * t * 0.9);
    ctx.lineTo(x + ww * 0.45, baseY - hgt + hgt * t * 0.9 - 4);
  }
  ctx.lineTo(x + hgt * 0.03, baseY);
  ctx.lineTo(x - hgt * 0.03, baseY);
  for (let i = tiers; i >= 1; i--) {
    const t = i / tiers;
    const ww = hgt * 0.22 * t + rng.range(-3, 3);
    ctx.lineTo(x - ww * 0.45, baseY - hgt + hgt * t * 0.9 - 4);
    ctx.lineTo(x - ww, baseY - hgt + hgt * t * 0.9);
  }
  ctx.closePath();
  ctx.fill();
}

function stars(ctx: CanvasRenderingContext2D, w: number, h: number, n: number, rng: Rng, color = '#e6e9f3'): void {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, h);
    const r = rng.range(0.6, 1.8);
    ctx.globalAlpha = rng.range(0.25, 0.8);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function rootCurtain(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, rng: Rng, density: number, fromTop = true): void {
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  const n = Math.floor((w / 1000) * density);
  for (let i = 0; i < n; i++) {
    let x = rng.range(0, w);
    let y = fromTop ? rng.range(-40, h * 0.2) : rng.range(h * 0.3, h);
    const len = rng.range(h * 0.2, h * 0.7);
    ctx.lineWidth = rng.range(4, 16);
    ctx.beginPath();
    ctx.moveTo(x, y);
    const steps = 5;
    for (let k = 0; k < steps; k++) {
      const nx = x + rng.range(-40, 40);
      const ny = y + len / steps;
      ctx.quadraticCurveTo(x + rng.range(-30, 30), (y + ny) / 2, nx, ny);
      x = nx;
      y = ny;
      ctx.lineWidth *= 0.8;
    }
    ctx.stroke();
  }
}

function strata(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[], rng: Rng): void {
  let y = rng.range(40, 120);
  let i = 0;
  while (y < h) {
    const th = rng.range(60, 160);
    ctx.fillStyle = colors[i % colors.length]!;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= w + 40; x += 40) ctx.lineTo(x, y + Math.sin(x / 260 + i) * 14 + rng.range(-3, 3));
    ctx.lineTo(w, y + th);
    for (let x = w; x >= -40; x -= 40) ctx.lineTo(x, y + th + Math.sin(x / 300 + i * 2) * 12);
    ctx.closePath();
    ctx.fill();
    y += th + rng.range(30, 90);
    i++;
  }
}

function glowDots(ctx: CanvasRenderingContext2D, w: number, h: number, n: number, rng: Rng, colors: string[], rMax = 26): void {
  for (let i = 0; i < n; i++) {
    const x = rng.range(0, w);
    const y = rng.range(0, h);
    const r = rng.range(8, rMax);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const col = rng.pick(colors);
    g.addColorStop(0, col);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = rng.range(0.15, 0.35);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  ctx.globalAlpha = 1;
}

function embeddedCrystals(ctx: CanvasRenderingContext2D, w: number, h: number, n: number, rng: Rng, alpha: number): void {
  ctx.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const x = rng.range(0, w);
    const y = rng.range(20, h);
    const hh = rng.range(14, 40);
    const col = rng.pick([CRYSTAL_COLORS.blue, CRYSTAL_COLORS.teal, CRYSTAL_COLORS.orange, CRYSTAL_COLORS.teal]);
    ctx.fillStyle = col.fill;
    ctx.beginPath();
    const lean = rng.range(-0.4, 0.4);
    ctx.moveTo(x - hh * 0.17, y);
    ctx.lineTo(x + lean * hh, y - hh);
    ctx.lineTo(x + hh * 0.17, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = col.shade;
    ctx.beginPath();
    ctx.moveTo(x + lean * hh, y - hh);
    ctx.lineTo(x + hh * 0.17, y);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function fossilWhale(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + 160 * s, y - 50 * s, x + 340 * s, y);
  ctx.stroke();
  for (let i = 1; i < 12; i++) {
    const t = i / 12;
    const px = x + 340 * s * t;
    const py = y - Math.sin(t * Math.PI) * 26 * s;
    ctx.lineWidth = 3 * s;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + 10 * s, py + 20 * s, px - 4 * s, py + 38 * s * Math.sin(t * Math.PI + 0.3));
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.ellipse(x - 30 * s, y + 4 * s, 34 * s, 16 * s, -0.1, 0, Math.PI * 2);
  ctx.stroke();
}

// ------------------------------------------------------------------ themes

const underground = (tint: string, glow: string[]): LayerSpec[] => [
  {
    scroll: 0.15,
    res: 0.5,
    draw: (ctx, { w, h }, rng) => {
      gradientSky(ctx, w, h, mix('#16131f', tint, 0.15), mix('#211c2e', tint, 0.2));
      strata(ctx, w, h, [mix('#1c1827', tint, 0.1), mix('#221d31', tint, 0.12)], rng);
      glowDots(ctx, w, h, Math.floor(w / 90), rng, glow, 40);
      fossilWhale(ctx, w * rng.range(0.2, 0.6), h * rng.range(0.3, 0.6), 0.9, 'rgba(199,204,222,0.07)');
    },
  },
  {
    scroll: 0.4,
    res: 0.5,
    draw: (ctx, { w, h }, rng) => {
      rootCurtain(ctx, w, h, 'rgba(60,48,70,0.55)', rng, 16);
      embeddedCrystals(ctx, w, h, Math.floor(w / 70), rng, 0.35);
    },
  },
  {
    scroll: 0.7,
    res: 1,
    draw: (ctx, { w, h }, rng) => {
      rootCurtain(ctx, w, h * 0.7, 'rgba(41,38,56,0.9)', rng, 6);
    },
  },
];

const nightSurface = (hillA: string, hillB: string, treeC: string): LayerSpec[] => [
  {
    scroll: 0.05,
    res: 0.5,
    draw: (ctx, { w, h, horizon }, rng) => {
      gradientSky(ctx, w, h, '#141a33', '#2f3c5a');
      stars(ctx, w, horizon, Math.floor(w / 6), rng);
      glowDots(ctx, w, horizon, 6, rng, ['#9cc0ee', '#d7b3ff'], 120);
      hills(ctx, w, h, horizon + 40, 120, hillA, rng, 0.6);
    },
  },
  {
    scroll: 0.3,
    res: 0.5,
    draw: (ctx, { w, h, horizon }, rng) => {
      hills(ctx, w, h, horizon + 110, 90, hillB, rng, 1.2);
      for (let x = rng.range(0, 80); x < w; x += rng.range(40, 110)) pine(ctx, x, horizon + 120 + rng.range(-20, 20), rng.range(70, 140), hillB, rng);
    },
  },
  {
    scroll: 0.6,
    res: 1,
    draw: (ctx, { w, h, horizon }, rng) => {
      for (let x = rng.range(0, 200); x < w; x += rng.range(160, 360)) {
        tree(ctx, x, horizon + 300, rng.range(260, 420), treeC, rng, mix(treeC, '#3f6b5e', 0.25));
      }
      hills(ctx, w, h, horizon + 320, 40, treeC, rng, 2);
    },
  },
];

const THEMES: Record<ThemeId, ThemeDef> = {
  nursery: {
    sky: ['#1b1726', '#241e30'],
    layers: [
      {
        scroll: 0.2,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          gradientSky(ctx, w, h, '#18141f', '#221b2b');
          strata(ctx, w, h, ['#1d1826', '#211b2b'], rng);
          embeddedCrystals(ctx, w, h, Math.floor(w / 80), rng, 0.25);
        },
      },
    ],
    terrain: { soil: { base: '#3b3348', shade: '#2a2437', light: '#4a4058', top: '#4d4360', topShade: '#3b3349' } },
    ambient: 'dust',
    horizon: 0.6,
  },
  roots: {
    sky: ['#15121d', '#1f1a2b'],
    layers: underground('#2b2445', ['#53BFAF', '#548CD6', '#9459D8']),
    terrain: {},
    ambient: 'dust',
    horizon: 0.6,
  },
  chamber: {
    sky: ['#141120', '#1c1830'],
    layers: underground('#233052', ['#53BFAF', '#9cc0ee', '#D7B3FF']),
    terrain: { soil: { base: '#343452', shade: '#262641', light: '#454567', top: '#474466', topShade: '#36344f' } },
    ambient: 'sparkle',
    horizon: 0.6,
  },
  surface: {
    sky: ['#141a33', '#2f3c5a'],
    layers: nightSurface('#243048', '#1d2740', '#182033'),
    terrain: { moss: { base: '#342f40', shade: '#262130', top: '#35584f', topShade: '#264039' } },
    ambient: 'wind',
    horizon: 0.55,
  },
  hill: {
    sky: ['#161a30', '#35405e'],
    layers: nightSurface('#28314a', '#20283e', '#1a2134'),
    terrain: { moss: { base: '#353043', shade: '#272233', top: '#3a5d52', topShade: '#294339' } },
    ambient: 'wind',
    horizon: 0.5,
  },
  forest: {
    sky: ['#161733', '#2d2f55'],
    layers: nightSurface('#262a4a', '#1f2340', '#191c33'),
    terrain: { moss: { base: '#332c42', shade: '#251f32', top: '#3d5a58', topShade: '#2b413f' } },
    ambient: 'petals',
    horizon: 0.5,
  },
  ride: {
    sky: ['#3b3252', '#c9875f'],
    layers: [
      {
        scroll: 0.03,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          gradientSky(ctx, w, h, '#3b3252', '#d39a66');
          stars(ctx, w, horizon * 0.5, Math.floor(w / 18), rng, '#f0e0d0');
          hills(ctx, w, h, horizon + 30, 140, '#6a4d63', rng, 0.5);
        },
      },
      {
        scroll: 0.12,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          hills(ctx, w, h, horizon + 110, 80, '#4e3a55', rng, 1);
          for (let x = rng.range(0, 80); x < w; x += rng.range(50, 130)) pine(ctx, x, horizon + 120 + rng.range(-15, 15), rng.range(60, 120), '#4e3a55', rng);
        },
      },
      {
        scroll: 0.35,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          for (let x = rng.range(0, 200); x < w; x += rng.range(220, 420)) tree(ctx, x, horizon + 260, rng.range(220, 340), '#3a2a42', rng, '#43324c');
          hills(ctx, w, h, horizon + 270, 30, '#3a2a42', rng, 2);
        },
      },
    ],
    terrain: { moss: { base: '#3d2f45', shade: '#2d2234', light: '#4d3d55', top: '#5a6b4a', topShade: '#3f4d36' } },
    ambient: 'petals',
    horizon: 0.5,
  },
  sun: {
    sky: ['#5a3d5c', '#d9a35a'],
    layers: [
      {
        scroll: 0.1,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          gradientSky(ctx, w, h, '#4a3450', '#d9a35a');
          glowDots(ctx, w, horizon, 5, rng, ['#f0d38e'], 200);
          hills(ctx, w, h, horizon + 170, 70, '#6d4a5c', rng, 0.7);
        },
      },
      {
        scroll: 0.35,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          // A low canopy that frames the arena at the sides; the centre stays
          // open for the Sun and dips lowest where it will sink.
          const base = h * 0.84;
          for (let x = -60; x < w + 60; x += rng.range(70, 120)) {
            const side = Math.abs(x - w / 2) / (w / 2);
            const hgt = 90 + 260 * Math.pow(side, 1.6) + rng.range(-20, 20);
            tree(ctx, x, base + 20, hgt, '#3b2840', rng, '#46304a');
          }
          hills(ctx, w, h, base + 10, 22, '#3b2840', rng, 2);
        },
      },
    ],
    terrain: { moss: { base: '#40304a', shade: '#2f2238', top: '#6a6a45', topShade: '#4d4d33' } },
    ambient: 'embers',
    horizon: 0.45,
  },
  clearing: {
    sky: ['#56606c', '#9aa39a'],
    layers: [
      {
        scroll: 0.06,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          gradientSky(ctx, w, h, '#4b5563', '#a3aa9c');
          glowDots(ctx, w, horizon, 4, rng, ['#e8dcca'], 180);
          hills(ctx, w, h, horizon + 60, 100, '#707a78', rng, 0.6);
        },
      },
      {
        scroll: 0.25,
        res: 0.5,
        draw: (ctx, { w, h, horizon }, rng) => {
          hills(ctx, w, h, horizon + 150, 40, '#5f6a68', rng, 1);
          // River band with a bright reflection strip.
          ctx.fillStyle = '#6f8a96';
          ctx.fillRect(0, horizon + 150, w, 60);
          ctx.fillStyle = 'rgba(232,220,202,0.35)';
          for (let x = 0; x < w; x += rng.range(30, 80)) ctx.fillRect(x, horizon + 160 + rng.range(0, 40), rng.range(20, 70), 3);
          for (let x = rng.range(0, 80); x < w; x += rng.range(60, 140)) pine(ctx, x, horizon + 152, rng.range(60, 120), '#55605e', rng);
        },
      },
      {
        scroll: 0.55,
        res: 1,
        draw: (ctx, { w, h, horizon }, rng) => {
          for (let x = rng.range(0, 200); x < w; x += rng.range(200, 380)) tree(ctx, x, horizon + 330, rng.range(280, 420), '#3f4847', rng, '#4b5654');
          hills(ctx, w, h, horizon + 330, 30, '#3f4847', rng, 2);
        },
      },
    ],
    terrain: { moss: { base: '#3e3a44', shade: '#2e2a33', top: '#58705f', topShade: '#3f5346' } },
    ambient: 'dust',
    horizon: 0.45,
  },
  dorm: {
    sky: ['#231c1f', '#2e2426'],
    layers: [
      {
        scroll: 0.2,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          gradientSky(ctx, w, h, '#1f191b', '#2c2224');
          // Tall arched windows with nothing behind them.
          for (let x = rng.range(60, 200); x < w; x += rng.range(260, 380)) {
            ctx.fillStyle = '#3a2f2c';
            ctx.beginPath();
            ctx.moveTo(x, h * 0.75);
            ctx.lineTo(x, h * 0.3);
            ctx.arc(x + 50, h * 0.3, 50, Math.PI, 0);
            ctx.lineTo(x + 100, h * 0.75);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgba(232,220,202,0.08)';
            ctx.fillRect(x + 10, h * 0.32, 80, h * 0.4);
          }
          rootCurtain(ctx, w, h, 'rgba(70,52,48,0.6)', rng, 12);
        },
      },
      {
        scroll: 0.45,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          // Suspended clock faces.
          for (let x = rng.range(100, 300); x < w; x += rng.range(300, 520)) {
            const y = rng.range(h * 0.12, h * 0.45);
            const r = rng.range(26, 60);
            ctx.strokeStyle = 'rgba(70,52,48,0.7)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, y - r);
            ctx.stroke();
            ctx.fillStyle = 'rgba(216,206,186,0.16)';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(216,206,186,0.25)';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - r * 0.7);
            ctx.moveTo(x, y);
            ctx.lineTo(x + r * 0.45, y + r * 0.2);
            ctx.stroke();
          }
        },
      },
    ],
    terrain: { floor: { base: '#5b4234', shade: '#443126', light: '#735745', top: '#6e5140', topShade: '#56402f' } },
    ambient: 'drips',
    horizon: 0.6,
  },
  mech: {
    sky: ['#1a1d26', '#262b36'],
    layers: [
      {
        scroll: 0.2,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          gradientSky(ctx, w, h, '#171a22', '#252a35');
          for (let i = 0; i < w / 180; i++) {
            const x = rng.range(0, w);
            const y = rng.range(0, h);
            const r = rng.range(30, 110);
            ctx.strokeStyle = 'rgba(114,122,140,0.14)';
            ctx.lineWidth = r * 0.18;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.lineWidth = r * 0.12;
            for (let k = 0; k < 8; k++) {
              const a = (k / 8) * Math.PI * 2;
              ctx.beginPath();
              ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
              ctx.lineTo(x + Math.cos(a) * r * 1.25, y + Math.sin(a) * r * 1.25);
              ctx.stroke();
            }
          }
        },
      },
      {
        scroll: 0.5,
        res: 0.5,
        draw: (ctx, { w, h }, rng) => {
          rootCurtain(ctx, w, h, 'rgba(51,56,68,0.8)', rng, 8);
          ctx.strokeStyle = 'rgba(213,204,184,0.12)';
          ctx.lineWidth = 3;
          for (let x = rng.range(0, 200); x < w; x += rng.range(150, 300)) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + rng.range(-40, 40), h);
            ctx.stroke();
          }
        },
      },
    ],
    terrain: {},
    ambient: 'dust',
    horizon: 0.6,
  },
  office: {
    sky: ['#3c3a36', '#4a4640'],
    layers: [
      {
        scroll: 0.85,
        res: 1,
        draw: (ctx, { w, h }, rng) => {
          gradientSky(ctx, w, h, '#57534b', '#6a655b');
          // Wall panels, baseboard and pale window light.
          ctx.fillStyle = '#625e55';
          for (let x = 0; x < w; x += 240) ctx.fillRect(x + 6, h * 0.18, 228, h * 0.62);
          ctx.fillStyle = '#4a463f';
          ctx.fillRect(0, h * 0.8, w, 14);
          for (let x = rng.range(200, 500); x < w; x += rng.range(700, 900)) {
            ctx.fillStyle = 'rgba(216,206,186,0.18)';
            ctx.fillRect(x, h * 0.25, 150, 200);
            ctx.strokeStyle = 'rgba(25,23,40,0.4)';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, h * 0.25, 150, 200);
            ctx.beginPath();
            ctx.moveTo(x + 75, h * 0.25);
            ctx.lineTo(x + 75, h * 0.25 + 200);
            ctx.stroke();
          }
        },
      },
    ],
    terrain: {},
    ambient: 'dust',
    horizon: 0.6,
  },
};

export function themeDef(id: ThemeId): ThemeDef {
  return THEMES[id];
}

export { P };
