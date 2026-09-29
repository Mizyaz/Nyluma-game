// Development-only art sheet (not part of the production build).
import { allParts, allRigs } from '../game/art/manifest';
import { drawOrder, isNear, orderJoints, solve } from '../game/art/fk';
import { poseFor } from '../game/entities/animPoses';
import { horsePose } from '../game/entities/horsePoses';

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

function drawRig(rigId: string, anim: string, t: number, facing: 1 | -1, zoomIn = 2.5): HTMLCanvasElement {
  const rig = allRigs().find((r) => r.id === rigId)!;
  const c = document.createElement('canvas');
  let zoom = zoomIn;
  const wide = rigId === 'horse';
  c.width = wide ? 440 : 220;
  c.height = 360;
  const ctx = c.getContext('2d')!;
  ctx.translate(wide ? 200 : 110, 330);
  if (wide) zoom = 1.15;
  ctx.scale(zoom * facing, zoom);
  const ordered = orderJoints(rig);
  const pose = rig.id === 'horse' ? horsePose(anim === 'walk' ? 'gallop' : anim, t) : poseFor(rig.id, anim, t);
  const solved = solve(ordered, pose.angles, pose.offsets);
  for (const j of drawOrder(ordered, facing)) {
    const s = solved.get(j.id)!;
    const p = parts.find((pp) => pp.key === j.part)!;
    const img = imgs.get(j.part!)!;
    ctx.save();
    ctx.translate(s.x + (pose.x ?? 0), s.y + (pose.y ?? 0));
    ctx.rotate(s.rot);
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
  const anims = (params.get('anims') ?? 'idle,walk,rise,fall,reach,song,breath,push').split(',');
  const only = params.get('rigs')?.split(',');
  for (const rig of allRigs().filter((r) => !only || only.includes(r.id))) {
    const row = document.createElement('div');
    row.innerHTML = `<div>${rig.id}</div>`;
    for (const a of anims) {
      for (const t of [0, 0.35]) row.appendChild(drawRig(rig.id, a, t, t === 0 ? 1 : -1));
    }
    rigsEl.appendChild(row);
  }
  document.body.dataset.ready = '1';
});
