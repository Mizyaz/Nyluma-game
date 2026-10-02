import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import { Rng, type Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { archBand, at, leafArt, r2 } from './wallKit';
import { glowDisc } from './doorKit';

// r12, "Boş Masa": a wall of the office runs across the corridor, the same
// wall as the room's own: plaster over a panelled wainscot, a rail, a
// skirting. In it the office door, a door of the Committee, frosted glass
// in a painted frame; a clock over it, a ticket machine beside it with a
// ticket put out. As Gorti comes a light comes on behind the glass; when
// the script opens the way the door slides away into the wall, a warm lamp
// light falls through, and the draft blows papers out over the floor.

const C = {
  plaster: '#d9d0cf',
  plasterB: '#cfc5c6',
  panel: '#c9c3cf',
  panelDeep: '#b3acbb',
  rail: '#a8a0b0',
  skirt: '#9a6a5a',
  door: '#c8bfae',
  doorDeep: '#a99f8c',
  glass: '#e3edf2',
  frame: '#8f7f72',
  brass: '#d8c070',
};

const HOLE: Hole = { z0: -172, z1: 28, spring: 222, rise: 14 };

function face(): FaceArt {
  const f = { u0: -300, u1: 110, h: 560 };
  const h = HOLE;
  const W = f.u1 - f.u0;
  const P = (u: number, v: number): Pt => at(f, u, v);
  const y = (v: number): number => f.h - v;
  let s = `<rect x="0" y="0" width="${W}" height="${f.h}" fill="${C.plaster}"/>`;
  // Plaster panels with mouldings over the rail.
  for (let x = 14; x < W - 40; x += 128) s += `<rect x="${x}" y="${y(520)}" width="100" height="${520 - 190}" rx="4" fill="${C.plasterB}" stroke="${darkOf(C.plaster, 0.16)}" stroke-width="2"/><rect x="${x + 5}" y="${y(515)}" width="90" height="${520 - 200}" rx="3" fill="none" stroke="${lightOf(C.plaster, 0.5)}" stroke-width="1.2"/>`;
  // The wainscot: boards and their grooves, the rail over them, the skirting under.
  s += `<rect x="0" y="${y(160)}" width="${W}" height="160" fill="${C.panel}"/>`;
  for (let x = 0; x < W; x += 22) s += `<path d="M${x} ${y(160)}L${x} ${y(18)}" stroke="${C.panelDeep}" stroke-width="1.4"/><path d="M${x + 2} ${y(160)}L${x + 2} ${y(18)}" stroke="${lightOf(C.panel, 0.4)}" stroke-width="0.8"/>`;
  s += comic(`M0 ${y(172)}L${W} ${y(172)}L${W} ${y(158)}L0 ${y(158)}Z`, C.rail, { line: LINE.small, rim: [1.6, -0.8], glint: [-0.8, 0.8] });
  s += comic(`M0 ${y(20)}L${W} ${y(20)}L${W} ${f.h + 2}L0 ${f.h + 2}Z`, C.skirt, { line: LINE.small, rim: [1.6, -0.8], glint: [-0.8, 0.8] });
  // The door's painted frame (casing) and its head.
  s += archBand(h, f, 0, 14, C.frame);
  // The clock over it.
  {
    const [x, cy] = P((h.z0 + h.z1) / 2, h.spring + h.rise + 70);
    s += comic(`M${r2(x - 24)} ${r2(cy)}a24 24 0 1 0 48 0a24 24 0 1 0 -48 0Z`, '#3d3a4a', { line: LINE.small, rim: [2, -1.4], glint: [-1, 1] });
    s += `<circle cx="${r2(x)}" cy="${r2(cy)}" r="19" fill="#f4f0e6"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      s += ink(`M${r2(x + Math.cos(a) * 15)} ${r2(cy + Math.sin(a) * 15)}L${r2(x + Math.cos(a) * 18)} ${r2(cy + Math.sin(a) * 18)}`, 1.2, '#3d3a4a');
    }
    s += ink(`M${r2(x)} ${r2(cy)}L${r2(x)} ${r2(cy - 13)}M${r2(x)} ${r2(cy)}L${r2(x + 8)} ${r2(cy + 4)}`, 1.8, '#3d3a4a');
  }
  // The ticket machine on the wall by the near jamb, a ticket put out.
  {
    const [x, ty] = P(h.z1 + 26, 170);
    s += comic(`M${r2(x)} ${r2(ty)}L${r2(x + 34)} ${r2(ty)}L${r2(x + 34)} ${r2(ty + 50)}L${r2(x)} ${r2(ty + 50)}Z`, '#e07a6a', { line: LINE.small, rim: [2.4, -1.4], glint: [-1, 1] });
    s += `<rect x="${r2(x + 6)}" y="${r2(ty + 8)}" width="22" height="10" rx="2" fill="#3d3a4a"/><circle cx="${r2(x + 17)}" cy="${r2(ty + 30)}" r="4" fill="#ffd36b" stroke="${lineFor('#ffd36b')}" stroke-width="0.6"/>`;
    s += comic(`M${r2(x + 8)} ${r2(ty + 44)}L${r2(x + 26)} ${r2(ty + 44)}L${r2(x + 27)} ${r2(ty + 66)}L${r2(x + 9)} ${r2(ty + 64)}Z`, '#fffaf0', { line: LINE.fine, rim: [1, -0.6] });
  }
  // A light switch by the far jamb.
  {
    const [x, ty] = P(h.z0 - 26, 130);
    s += `<rect x="${r2(x - 8)}" y="${r2(ty)}" width="16" height="22" rx="2" fill="#f4f0e6" stroke="${lineFor('#f4f0e6')}" stroke-width="0.8"/><rect x="${r2(x - 3)}" y="${r2(ty + 6)}" width="6" height="10" rx="1" fill="#d8d2c4"/>`;
  }
  return { ...f, body: s };
}

/** The office door: a painted frame, two panels, frosted glass over them, a brass pull. */
function leaf(): FaceArt {
  const h = HOLE;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  let body = `<rect x="0" y="0" width="${r2(W)}" height="${r2(H)}" fill="${C.door}"/>`;
  const panel = (x: number, y: number, w: number, hh: number): string => comic(`M${x} ${y}L${x + w} ${y}L${x + w} ${y + hh}L${x} ${y + hh}Z`, lightOf(C.door, 0.06), { line: LINE.fine, rim: [2, -1.2], glint: [-0.8, 0.8] });
  body += panel(22, H - 96, W / 2 - 30, 76) + panel(W / 2 + 8, H - 96, W / 2 - 30, 76);
  // The frosted glass, a light coming on behind it.
  body += `<rect x="22" y="22" width="${r2(W - 44)}" height="${r2(H - 140)}" rx="3" fill="${C.glass}" stroke="${C.frame}" stroke-width="4"/>`;
  body += glowDisc(W / 2, (H - 140) / 2 + 22, 70, '#fff6d8', 0.6);
  const rng = new Rng(4);
  for (let i = 0; i < 40; i++) body += `<circle cx="${r2(rng.range(26, W - 26))}" cy="${r2(rng.range(26, H - 122))}" r="${r2(rng.range(0.6, 1.6))}" fill="#ffffff" opacity="0.7"/>`;
  body += ink(`M30 34L56 60M44 30L74 60`, 1.4, '#ffffff', 0.7);
  // It slides away into the wall (toward the far jamb): a long brass pull at its leading edge.
  body += `<rect x="${r2(W - 30)}" y="${r2(H - 150)}" width="10" height="70" rx="4" fill="${darkOf(C.brass, 0.1)}" stroke="${lineFor(C.brass)}" stroke-width="0.8"/>`;
  body += comic(`M${r2(W - 28)} ${r2(H - 146)}L${r2(W - 22)} ${r2(H - 146)}L${r2(W - 22)} ${r2(H - 84)}L${r2(W - 28)} ${r2(H - 84)}Z`, C.brass, { line: LINE.fine, rim: [1.2, -0.8], glint: [-0.8, 0.8] });
  return leafArt(h, C.door, body);
}

export function officeDoor(): WallDoorArt {
  return {
    wall: { color: C.plaster, edge: '#f2ece1', half: 12, end: 100 },
    hole: HOLE,
    face: face(),
    leaf: { kind: 'slide', hinge: 'far', color: C.door, back: C.doorDeep, art: leaf(), shut: 0, open: 1 },
    light: { color: '#ffe8b0', radius: 320, intensity: 0.9, y: 140 },
    glow: '#fff3d0',
    sounds: { wake: ['click', 0.3, 1.5], open: [['noteHigh', 0.3, 1.0], ['paper', 0.35, 1.0]], shut: ['door', 0.35, 1] },
    openMs: 800,
    life: { kind: 'confetti', colors: ['#fffaf0', '#f4efe2', '#e8f0f8'], rate: 1.2 },
    flat: { wall: C.plaster, frame: C.frame },
  };
}
