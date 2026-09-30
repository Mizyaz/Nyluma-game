import * as THREE from 'three';
import { mulberry32 } from './mesh';

// The grey textures a figure's surfaces wear over their vertex colours: the
// grain of coloured pencil on skin, bark with its dark wavy furrows, sawn
// planks, and a leaf's midrib and veins. They average about 0.83 (the body
// shader scales them by 1.2), so a surface keeps its colour on the whole.

const MEAN = 212;
type Ctx = CanvasRenderingContext2D;

function canvas(w: number, h: number, fill: number): [HTMLCanvasElement, Ctx] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = `rgb(${fill},${fill},${fill})`;
  g.fillRect(0, 0, w, h);
  return [c, g];
}

/** Scales the picture's tone so its mean is MEAN (the shader's neutral). */
function normalise(c: HTMLCanvasElement): void {
  const g = c.getContext('2d')!;
  const img = g.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) sum += d[i]!;
  const k = MEAN / (sum / (d.length / 4));
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.min(255, Math.round(d[i]! * k));
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
  }
  g.putImageData(img, 0, 0);
}

/** Draws `f` nine times, shifted by the tile, so strokes wrap across its edges. */
function wrapped(g: Ctx, w: number, h: number, f: () => void): void {
  for (const dx of [-w, 0, w]) {
    for (const dy of [-h, 0, h]) {
      g.save();
      g.translate(dx, dy);
      f();
      g.restore();
    }
  }
}

/** A tapering stroke along a polyline (widest in the middle). */
function taperStroke(g: Ctx, pts: readonly [number, number][], w: number, tone: string): void {
  const n = pts.length;
  if (n < 2) return;
  const left: [number, number][] = [];
  const right: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)]!;
    const b = pts[Math.min(n - 1, i + 1)]!;
    let tx = b[0] - a[0];
    let ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    tx /= l;
    ty /= l;
    const u = i / (n - 1);
    const half = (w / 2) * Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), 0.6) + 0.35;
    const p = pts[i]!;
    left.push([p[0] - ty * half, p[1] + tx * half]);
    right.push([p[0] + ty * half, p[1] - tx * half]);
  }
  g.beginPath();
  g.moveTo(left[0]![0], left[0]![1]);
  for (const p of left) g.lineTo(p[0], p[1]);
  for (let i = right.length - 1; i >= 0; i--) g.lineTo(right[i]![0], right[i]![1]);
  g.closePath();
  g.fillStyle = tone;
  g.fill();
}

/** Coloured-pencil grain: short diagonal hatching, light and dark. */
export function skinCanvas(): HTMLCanvasElement {
  const S = 256;
  const [c, g] = canvas(S, S, 214);
  const r = mulberry32(0x5a9e);
  wrapped(g, S, S, () => {
    const rr = mulberry32(0x5a9e1);
    for (let i = 0; i < 1500; i++) {
      const x = rr() * S;
      const y = rr() * S;
      const len = 5 + rr() * 12;
      const dark = rr() < 0.5;
      g.strokeStyle = dark ? `rgba(40,36,48,${0.05 + rr() * 0.07})` : `rgba(255,253,246,${0.08 + rr() * 0.1})`;
      g.lineWidth = 0.8 + rr() * 1.3;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + len * 0.62, y - len * 0.78);
      g.stroke();
    }
  });
  // Soft mottling, as a pencil lays colour unevenly.
  for (let i = 0; i < 18; i++) {
    const x = r() * S;
    const y = r() * S;
    const rad = 20 + r() * 40;
    wrapped(g, S, S, () => {
      const gr = g.createRadialGradient(x, y, 0, x, y, rad);
      const a = 0.05 + r() * 0.04;
      const tone = r() < 0.5 ? `0,0,0` : `255,255,255`;
      gr.addColorStop(0, `rgba(${tone},${a})`);
      gr.addColorStop(1, `rgba(${tone},0)`);
      g.fillStyle = gr;
      g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    });
  }
  normalise(c);
  return c;
}

/**
 * Bark: dark wavy furrows running along the limb (the texture's v), some
 * forked, with pale ridges beside them. u goes round the limb.
 */
export function barkCanvas(): HTMLCanvasElement {
  const S = 256;
  const [c, g] = canvas(S, S, 226);
  const r = mulberry32(0xba4c);
  // Pale streaks: the ridges between furrows.
  wrapped(g, S, S, () => {
    const rr = mulberry32(0xba4c1);
    for (let i = 0; i < 90; i++) {
      const x = rr() * S;
      const y = rr() * S;
      const len = 30 + rr() * 80;
      g.strokeStyle = `rgba(255,250,240,${0.1 + rr() * 0.12})`;
      g.lineWidth = 2 + rr() * 4;
      g.beginPath();
      g.moveTo(x, y);
      g.bezierCurveTo(x + 6 * (rr() - 0.5), y + len / 3, x + 6 * (rr() - 0.5), y + (2 * len) / 3, x + 4 * (rr() - 0.5), y + len);
      g.stroke();
    }
    // Fine grain.
    for (let i = 0; i < 700; i++) {
      const x = rr() * S;
      const y = rr() * S;
      g.strokeStyle = rr() < 0.6 ? `rgba(40,30,24,${0.05 + rr() * 0.08})` : `rgba(255,250,240,${0.06 + rr() * 0.08})`;
      g.lineWidth = 0.7 + rr() * 1;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (rr() - 0.5) * 2, y + 6 + rr() * 14);
      g.stroke();
    }
  });
  // The furrows: long wavy dark strokes with soft shoulders.
  const furrows: { pts: [number, number][]; w: number }[] = [];
  const cols = 5;
  for (let k = 0; k < cols; k++) {
    let y = r() * S;
    const x0 = ((k + 0.2 + r() * 0.6) / cols) * S;
    for (let seg = 0; seg < 2; seg++) {
      const len = 70 + r() * 70;
      const amp = 3 + r() * 5;
      const wl = 30 + r() * 30;
      const ph = r() * 6.28;
      const pts: [number, number][] = [];
      for (let i = 0; i <= 16; i++) {
        const yy = y + (len * i) / 16;
        pts.push([x0 + amp * Math.sin((yy / wl) * 6.28 + ph) + (r() - 0.5) * 1.5, yy]);
      }
      furrows.push({ pts, w: 5 + r() * 3 });
      // A fork off the furrow now and then.
      if (r() < 0.55) {
        const at = pts[5 + Math.floor(r() * 6)]!;
        const dir = r() < 0.5 ? -1 : 1;
        const fl = 20 + r() * 25;
        const fork: [number, number][] = [];
        for (let i = 0; i <= 8; i++) fork.push([at[0] + dir * (i / 8) * fl * 0.45 + Math.sin(i) * 0.6, at[1] + (i / 8) * fl]);
        furrows.push({ pts: fork, w: 3.5 + r() * 2 });
      }
      y += len + 20 + r() * 40;
    }
  }
  wrapped(g, S, S, () => {
    for (const f of furrows) {
      g.filter = 'blur(2.2px)';
      taperStroke(g, f.pts, f.w * 2.1, 'rgba(70,52,40,0.55)');
      g.filter = 'blur(0.6px)';
      taperStroke(g, f.pts, f.w, 'rgb(24,18,16)');
      g.filter = 'none';
    }
  });
  normalise(c);
  return c;
}

/** Sawn planks: long fine grain along v, a few knots. */
export function plankCanvas(): HTMLCanvasElement {
  const S = 256;
  const [c, g] = canvas(S, S, 220);
  const r = mulberry32(0x91a4);
  wrapped(g, S, S, () => {
    const rr = mulberry32(0x91a41);
    for (let i = 0; i < 160; i++) {
      const x = rr() * S;
      const y = rr() * S;
      const len = 40 + rr() * 140;
      const dark = rr() < 0.65;
      g.strokeStyle = dark ? `rgba(46,34,26,${0.1 + rr() * 0.18})` : `rgba(255,250,238,${0.12 + rr() * 0.14})`;
      g.lineWidth = 0.8 + rr() * (dark ? 1.6 : 2.4);
      g.beginPath();
      g.moveTo(x, y);
      g.bezierCurveTo(x + (rr() - 0.5) * 4, y + len / 3, x + (rr() - 0.5) * 4, y + (2 * len) / 3, x + (rr() - 0.5) * 3, y + len);
      g.stroke();
    }
  });
  // Knots: grain rings around a dark heart.
  for (let i = 0; i < 3; i++) {
    const x = r() * S;
    const y = r() * S;
    const rx = 5 + r() * 5;
    const ry = rx * (1.8 + r());
    wrapped(g, S, S, () => {
      for (let k = 3; k >= 1; k--) {
        g.strokeStyle = `rgba(52,38,28,${0.14 + 0.08 * (3 - k)})`;
        g.lineWidth = 1.3;
        g.beginPath();
        g.ellipse(x, y, rx * (0.6 + k * 0.45), ry * (0.6 + k * 0.45), 0, 0, Math.PI * 2);
        g.stroke();
      }
      g.fillStyle = 'rgba(40,28,20,0.55)';
      g.beginPath();
      g.ellipse(x, y, rx * 0.55, ry * 0.5, 0, 0, Math.PI * 2);
      g.fill();
    });
  }
  normalise(c);
  return c;
}

/** A leaf seen flat, its length along u: dark midrib, paired veins, a paler blade. */
export function leafCanvas(): HTMLCanvasElement {
  const W = 256;
  const H = 128;
  const [c, g] = canvas(W, H, 222);
  const mid = H / 2;
  // Paler toward the midrib, darker at the rim.
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, 'rgba(0,0,0,0.16)');
  gr.addColorStop(0.42, 'rgba(255,255,255,0.14)');
  gr.addColorStop(0.58, 'rgba(255,255,255,0.1)');
  gr.addColorStop(1, 'rgba(0,0,0,0.2)');
  g.fillStyle = gr;
  g.fillRect(0, 0, W, H);
  g.lineCap = 'round';
  for (let i = 1; i < 7; i++) {
    const x = (i / 7.4) * W;
    for (const s of [-1, 1]) {
      g.strokeStyle = 'rgba(38,48,30,0.45)';
      g.lineWidth = 2.2;
      g.beginPath();
      g.moveTo(x, mid);
      g.quadraticCurveTo(x + 16, mid + s * 22, x + 34, mid + s * 46);
      g.stroke();
    }
  }
  g.strokeStyle = 'rgb(30,38,24)';
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(4, mid);
  g.quadraticCurveTo(W * 0.5, mid - 3, W - 8, mid);
  g.stroke();
  g.strokeStyle = 'rgba(255,255,240,0.35)';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(10, mid - 5);
  g.quadraticCurveTo(W * 0.5, mid - 8, W - 20, mid - 4);
  g.stroke();
  normalise(c);
  return c;
}

export interface FigureTextures {
  skin: THREE.Texture;
  bark: THREE.Texture;
  plank: THREE.Texture;
  leaf: THREE.Texture;
}

let shared: FigureTextures | null = null;

function tex(c: HTMLCanvasElement, repeat: boolean): THREE.Texture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = t.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.anisotropy = 4;
  return t;
}

/** The textures every figure shares (made once). */
export function figureTextures(): FigureTextures {
  shared ??= {
    skin: tex(skinCanvas(), true),
    bark: tex(barkCanvas(), true),
    plank: tex(plankCanvas(), true),
    leaf: tex(leafCanvas(), false),
  };
  return shared;
}
