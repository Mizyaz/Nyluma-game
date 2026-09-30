// Development-only art sheet (not part of the production build).
import { allParts, allRigs } from '../content/art/manifest';
import { drawOrder, isNear, orderJoints, solve } from '../render/2d/rig/fk';
import { poseFor, type PoseParams } from '../render/2d/rig/animPoses';
import { horsePose } from '../render/2d/rig/horsePoses';

const partsEl = document.getElementById('parts')!;
const rigsEl = document.getElementById('rigs')!;
const imgs = new Map<string, HTMLImageElement>();
const parts = allParts();

async function load(): Promise<void> {
  await Promise.all(
    parts.map(
      (p) =>
        new Promise<void>((res) => {
          const scale = p.scale ?? 2;
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(p.w * scale)}" height="${Math.ceil(p.h * scale)}" viewBox="0 0 ${p.w} ${p.h}">${p.body}</svg>`;
          const img = new Image();
          img.onload = () => res();
          img.onerror = () => {
            console.error('bad svg', p.key);
            res();
          };
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
          imgs.set(p.key, img);
          const fig = document.createElement('figure');
          img.style.width = p.w * 2 + 'px';
          fig.appendChild(img);
          const cap = document.createElement('figcaption');
          cap.textContent = p.key;
          fig.appendChild(cap);
          partsEl.appendChild(fig);
        }),
    ),
  );
}

function drawRig(rigId: string, anim: string, t: number, facing: 1 | -1, zoomIn = 2.5, prm: PoseParams = {}): HTMLCanvasElement {
  const rig = allRigs().find((r) => r.id === rigId)!;
  const c = document.createElement('canvas');
  let zoom = zoomIn;
  const wide = rigId === 'horse';
  // head=1 frames the head up close (with a large zoom).
  const q = new URLSearchParams(location.search);
  const head = q.get('head') === '1';
  c.width = wide ? 440 : head ? 180 : 220;
  c.height = head ? 180 : 360;
  const ctx = c.getContext('2d')!;
  ctx.translate(wide ? 200 : head ? 70 : 110, head ? 150 + zoomIn * 88 : 330);
  if (wide) zoom = 1.15;
  ctx.scale(zoom * facing, zoom);
  const ordered = orderJoints(rig);
  const pose = rig.id === 'horse' ? horsePose(anim === 'walk' ? 'gallop' : anim, t) : poseFor(rig.id, anim, t, prm);
  const solved = solve(ordered, pose.angles, pose.offsets);
  for (const j of drawOrder(ordered, facing)) {
    const s = solved.get(j.id)!;
    // Shape variants (eyes, mouth) and per-joint scale, as in RigView.
    const v = pose.frames?.[j.id];
    const key = v && imgs.has(`${j.part!}.${v}`) ? `${j.part!}.${v}` : j.part!;
    const p = parts.find((pp) => pp.key === key)!;
    const img = imgs.get(key)!;
    const sc = pose.scales?.[j.id];
    ctx.save();
    ctx.translate(s.x + (pose.x ?? 0), s.y + (pose.y ?? 0));
    ctx.rotate(s.rot);
    if (sc) ctx.scale(sc.x, sc.y);
    if (j.additive) ctx.globalCompositeOperation = 'lighter';
    if (!isNear(j, facing)) ctx.filter = 'brightness(0.72)';
    ctx.drawImage(img, -p.px, -p.py, p.w, p.h);
    ctx.restore();
  }
  ctx.strokeStyle = '#f00';
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(30, 0);
  ctx.stroke();
  return c;
}

void load().then(() => {
  const params = new URLSearchParams(location.search);
  // anims=idle,fall@vy=700,land@k=0.1;impact=1,idle@emote=joy;emoteK=1
  const anims = (params.get('anims') ?? 'idle,walk,rise,fall,reach,song,breath,push').split(',');
  const only = params.get('rigs')?.split(',');
  const zoom = Number(params.get('zoom') ?? 2.5);
  const both = params.get('both') !== '0';
  for (const rig of allRigs().filter((r) => !only || only.includes(r.id))) {
    const row = document.createElement('div');
    row.innerHTML = `<div>${rig.id}</div>`;
    for (const spec of anims) {
      const [a, q = ''] = spec.split('@');
      const prm: Record<string, number | string> = {};
      for (const kv of q.split(';').filter(Boolean)) {
        const [k, val = ''] = kv.split('=');
        prm[k!] = Number.isNaN(Number(val)) ? val : Number(val);
      }
      const t = typeof prm.t === 'number' ? prm.t : 0;
      for (const f of both ? ([1, -1] as const) : ([1] as const)) row.appendChild(drawRig(rig.id, a!, f === 1 ? t : t + 0.35, f, zoom, prm as PoseParams));
    }
    rigsEl.appendChild(row);
  }
  document.body.dataset.ready = '1';
});
