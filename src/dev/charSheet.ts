// Development-only character sheet (not part of the production build): rigs
// drawn from the game's own parts, with the pencil grain and the darker far
// side as the atlas bakes them, posed by the game's pose functions.
//
// URL parameters:
//   rigs=gorti.human,gorti.root.child      one row per rig (default: every humanoid)
//   cols=idle,walk@speed=0.6,laugh@k=0.3   one column per pose ("anim@key=value;key=value")
//        walk*8@speed=0.6                   an 8-frame strip: walk/run/push step the phase
//                                          over one cycle, other anims step k (and t = k·T)
//   zoom=2.5  w=200  h=330                 scale and cell size
//   head=1                                 frame the head up close
//   facing=1|-1|both                       (default 1)
//   ticks=92                               ground ticks moving with the travel of a
//                                          cycle of that length (px): a planted foot stays on its tick
//   bg=#efe8dc                             cell colour
import { allParts, allRigs } from '../content/art/manifest';
import { drawOrder, isNear, orderJoints, solve } from '../render/2d/rig/fk';
import { poseFor, type PoseParams } from '../render/2d/rig/animPoses';
import { horsePose } from '../render/2d/rig/horsePoses';
import type { PartArt, RigDef } from '../render/2d/rig/rigTypes';
import { applyGrain } from '../render/2d/TextureFactory';

const q = new URLSearchParams(location.search);
const zoom = Number(q.get('zoom') ?? 2.5);
const head = q.get('head') === '1';
const cw = Number(q.get('w') ?? (head ? 220 : 200));
const ch = Number(q.get('h') ?? (head ? 220 : 330));
const facingQ = q.get('facing') ?? '1';
const facings: (1 | -1)[] = facingQ === 'both' ? [1, -1] : facingQ === '-1' ? [-1] : [1];
const ticks = Number(q.get('ticks') ?? 0);
const bg = q.get('bg');
if (bg) document.documentElement.style.setProperty('--bg', bg);

const rigs = allRigs().filter((r) => r.id !== 'horse');
const only = q.get('rigs')?.split(',');
const shown: RigDef[] = only ? only.map((id) => allRigs().find((r) => r.id === id)!).filter(Boolean) : rigs;

interface Col {
  anim: string;
  prm: PoseParams & { t?: number; T?: number };
  label: string;
}

const CYCLE = new Set(['walk', 'run', 'push']);

function parseCols(spec: string): Col[] {
  const out: Col[] = [];
  for (const item of spec.split(',').filter(Boolean)) {
    const [head0, q0 = ''] = item.split('@');
    const prm: Record<string, number | string> = {};
    for (const kv of q0.split(';').filter(Boolean)) {
      const [k, v = ''] = kv.split('=');
      prm[k!] = Number.isNaN(Number(v)) ? v : Number(v);
    }
    const [anim, nStr] = head0!.split('*');
    const n = Number(nStr ?? 0);
    if (n > 1) {
      for (let i = 0; i < n; i++) {
        const p = { ...prm } as Col['prm'];
        if (CYCLE.has(anim!)) {
          p.phase = (i / n) * Math.PI * 2 + (typeof prm.phase === 'number' ? prm.phase : 0);
          out.push({ anim: anim!, prm: p, label: `${anim} ${Math.round((i / n) * 360)}°` });
        } else {
          const k = i / (n - 1);
          const T = typeof prm.T === 'number' ? prm.T : 1;
          p.k = k;
          p.t = k * T;
          out.push({ anim: anim!, prm: p, label: `${anim} k${k.toFixed(2)}` });
        }
      }
    } else out.push({ anim: anim!, prm: prm as Col['prm'], label: item });
  }
  return out;
}

const cols = parseCols(q.get('cols') ?? 'idle,walk@speed=0.6,idle@emote=joy;emoteK=1');

// ------------------------------------------------------------ parts

const byKey = new Map(allParts().map((p) => [p.key, p]));
const near = new Map<string, HTMLCanvasElement>();
const far = new Map<string, HTMLCanvasElement>();

function loadSvg(p: PartArt, scale: number): Promise<HTMLImageElement> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(p.w * scale)}" height="${Math.ceil(p.h * scale)}" viewBox="0 0 ${p.w} ${p.h}">${p.body}</svg>`;
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => {
      console.error('bad svg', p.key);
      res(img);
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}

async function raster(p: PartArt): Promise<void> {
  const scale = p.scale ?? 2;
  const img = await loadSvg(p, scale);
  const w = Math.max(1, Math.ceil(p.w * scale));
  const h = Math.max(1, Math.ceil(p.h * scale));
  const mk = (dark: boolean): HTMLCanvasElement => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0, w, h);
    if (dark) {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'rgba(29, 27, 30, 0.2)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
    }
    if (p.grain ?? !p.additive) applyGrain(ctx, 0, 0, w, h, { scale });
    return c;
  };
  near.set(p.key, mk(false));
  if (p.far) far.set(p.key, mk(true));
}

async function loadFor(list: RigDef[]): Promise<void> {
  const want = new Set<string>();
  for (const r of list) {
    for (const j of r.joints) {
      if (!j.part) continue;
      for (const k of byKey.keys()) if (k === j.part || k.startsWith(j.part + '.')) want.add(k);
    }
  }
  await Promise.all([...want].map((k) => raster(byKey.get(k)!)));
}

// ------------------------------------------------------------ drawing

function drawCell(rig: RigDef, col: Col, facing: 1 | -1): HTMLCanvasElement {
  const c = document.createElement('canvas');
  const dpr = 1;
  c.width = cw * dpr;
  c.height = ch * dpr;
  c.style.width = `${cw}px`;
  const ctx = c.getContext('2d')!;
  const ordered = orderJoints(rig);
  const t = col.prm.t ?? 0;
  const pose = rig.id === 'horse' ? horsePose(col.anim, t) : poseFor(rig.id, col.anim, t, col.prm);
  const solved = solve(ordered, pose.angles, pose.offsets);
  let ox = cw / 2;
  let oy = ch - 22;
  if (head) {
    const hj = solved.get('head');
    const hx = (hj?.x ?? 0) * facing;
    const hy = (hj?.y ?? -80) - Number(q.get('hy') ?? 30);
    ox = cw / 2 - hx * zoom;
    oy = ch / 2 - hy * zoom;
  }
  ctx.save();
  ctx.translate(ox, oy);
  // Ground line and travel ticks.
  if (!head) {
    ctx.strokeStyle = 'rgba(80,60,90,0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-cw, 0);
    ctx.lineTo(cw, 0);
    ctx.stroke();
    if (ticks > 0 && typeof col.prm.phase === 'number') {
      const dist = (col.prm.phase / (Math.PI * 2)) * ticks;
      ctx.fillStyle = 'rgba(80,60,90,0.6)';
      for (let x = -400; x <= 400; x += 10) {
        const sx = (x - (dist % 10)) * zoom;
        if (Math.abs(sx) > cw) continue;
        ctx.fillRect(sx - 0.5, 1, 1, x % 50 === 0 ? 7 : 4);
      }
    }
  }
  ctx.scale(zoom * facing, zoom);
  // The whole-rig squash (as RigView applies it).
  ctx.scale(pose.sx ?? 1, pose.sy ?? 1);
  for (const j of drawOrder(ordered, facing)) {
    const s = solved.get(j.id)!;
    const v = pose.frames?.[j.id];
    const key = v && near.has(`${j.part!}.${v}`) ? `${j.part!}.${v}` : j.part!;
    const p = byKey.get(key);
    if (!p) continue;
    const img = (!isNear(j, facing) && !v ? far.get(key) : undefined) ?? near.get(key)!;
    const sc = pose.scales?.[j.id];
    ctx.save();
    ctx.translate(s.x + (pose.x ?? 0), s.y + (pose.y ?? 0));
    ctx.rotate(s.rot);
    if (sc) ctx.scale(sc.x, sc.y);
    if (j.additive) ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(img, -p.px, -p.py, p.w, p.h);
    ctx.restore();
  }
  ctx.restore();
  return c;
}

void (async () => {
  await loadFor(shown);
  const sheet = document.getElementById('sheet')!;
  for (const rig of shown) {
    const row = document.createElement('div');
    row.className = 'row';
    const lab = document.createElement('div');
    lab.className = 'label';
    lab.textContent = rig.id;
    row.appendChild(lab);
    for (const col of cols) {
      for (const f of facings) {
        const fig = document.createElement('figure');
        fig.appendChild(drawCell(rig, col, f));
        const cap = document.createElement('figcaption');
        cap.textContent = col.label;
        fig.appendChild(cap);
        row.appendChild(fig);
      }
    }
    sheet.appendChild(row);
  }
  document.body.dataset.ready = '1';
})();
