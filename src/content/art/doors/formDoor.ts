import type { Hole } from '../../../paper/opening';
import { darkOf, lightOf, LINE, lineFor } from '../../../render/2d/style';
import { comic, ink } from '../../characters/kit';
import type { Pt } from '../../../render/2d/svg';
import type { FaceArt, WallDoorArt } from './wallArt';
import { archBand, at, hedge, leafArt, r2 } from './wallKit';
import { face as faceOf, glowDisc } from './doorKit';

// b01, "Form Kapısı": the garden is shut across by a tall clipped hedge,
// and in it a wooden garden door that opens only for the human form. Over
// it hangs its sign, a little carved figure of a person; on its near post
// a carved doorman's head dozes under his bowler hat. The leaf has a round
// window of painted glass, the sunny day it keeps in there. When Gorti is
// human the door slides away into the hedge, and petals of that day drift
// out; change back and it slides shut again.

const C = {
  leaf: ['#7c9a7a', '#6d8a6c', '#8aa688', '#76946f'],
  deep: '#3e5248',
  wood: '#c8a27e',
  woodDeep: '#a8825f',
  post: '#b8916c',
  sign: '#e9d3b0',
  glass: '#bfe3f2',
  sun: '#ffd36b',
  hill: '#a8d08c',
};

const HOLE: Hole = { z0: -172, z1: 28, spring: 170, rise: 72 };

function face(): FaceArt {
  const f = { u0: -300, u1: 110, h: 560 };
  const h = HOLE;
  const P = (u: number, v: number): Pt => at(f, u, v);
  let s = hedge(f, { leaf: C.leaf, deep: C.deep, flowers: ['#f7c6d9', '#fff3b0'], seed: 23 });
  // The door's wooden frame: two posts and a round head.
  s += archBand(h, f, 0, 16, C.post);
  for (const z of [h.z0 - 16, h.z1]) {
    const [x0, y0] = P(z, h.spring);
    s += comic(`M${r2(x0)} ${r2(y0)}L${r2(x0 + 16)} ${r2(y0)}L${r2(x0 + 16)} ${f.h}L${r2(x0)} ${f.h}Z`, C.post, { line: LINE.small, rim: [3, -1], glint: [-1, 1], hatch: 2.4, hatchWidth: 0.5 });
  }
  // The sign over it: a carved person, arms open.
  {
    const [x, y] = P((h.z0 + h.z1) / 2, h.spring + h.rise + 44);
    s += ink(`M${r2(x - 16)} ${r2(y + 26)}L${r2(x - 12)} ${r2(y - 22)}M${r2(x + 16)} ${r2(y + 26)}L${r2(x + 12)} ${r2(y - 22)}`, 1.4, '#6a5a4a');
    s += comic(`M${r2(x - 26)} ${r2(y - 22)}L${r2(x + 26)} ${r2(y - 22)}L${r2(x + 26)} ${r2(y + 22)}L${r2(x - 26)} ${r2(y + 22)}Z`, C.sign, { line: LINE.small, rim: [2.4, -1.4], glint: [-1, 1] });
    s += glowDisc(x, y, 22, '#fff3c8', 0.5);
    s += `<circle cx="${r2(x)}" cy="${r2(y - 10)}" r="5" fill="#8a6a4a"/>`;
    s += ink(`M${r2(x)} ${r2(y - 4)}L${r2(x)} ${r2(y + 8)}M${r2(x - 9)} ${r2(y - 2)}L${r2(x)} ${r2(y + 1)}L${r2(x + 9)} ${r2(y - 2)}M${r2(x - 6)} ${r2(y + 16)}L${r2(x)} ${r2(y + 8)}L${r2(x + 6)} ${r2(y + 16)}`, 2.6, '#8a6a4a');
  }
  // The doorman: a carved head on the near post, asleep under his bowler.
  {
    const [x, y] = P(h.z1 + 8, h.spring - 20);
    s += comic(`M${r2(x - 13)} ${r2(y)}a13 15 0 1 0 26 0a13 15 0 1 0 -26 0Z`, '#d8b48e', { line: LINE.small, rim: [2.4, -1.4], glint: [-1, 1] });
    s += faceOf(x, y + 2, 10, '#6a4a3a', false, { cheeks: '#f0a6a0', mouth: 'none' });
    s += ink(`M${r2(x - 6)} ${r2(y + 9)}Q${r2(x)} ${r2(y + 6)} ${r2(x + 6)} ${r2(y + 9)}`, 1.4, '#6a4a3a');
    s += comic(`M${r2(x - 18)} ${r2(y - 11)}L${r2(x + 18)} ${r2(y - 11)}L${r2(x + 14)} ${r2(y - 15)}Q${r2(x + 13)} ${r2(y - 30)} ${r2(x)} ${r2(y - 30)}Q${r2(x - 13)} ${r2(y - 30)} ${r2(x - 14)} ${r2(y - 15)}Z`, '#5a5470', { line: LINE.small, rim: [2, -1], glint: [-1, 1] });
  }
  return { ...f, body: s };
}

/** The leaf: boards, braces, a round window of painted glass (a sunny day), an iron pull. */
function leaf(): FaceArt {
  const h = HOLE;
  const W = h.z1 - h.z0;
  const H = h.spring + h.rise;
  let body = '';
  for (let i = 0; i < 7; i++) {
    const x = (i * W) / 7;
    body += `<rect x="${r2(x)}" y="0" width="${r2(W / 7)}" height="${r2(H)}" fill="${i % 2 ? C.wood : lightOf(C.wood, 0.06)}"/>`;
    body += `<path d="M${r2(x + 0.5)} 0L${r2(x + 0.5)} ${r2(H)}" stroke="${darkOf(C.wood, 0.25)}" stroke-width="1"/>`;
  }
  // Braces: two rails and a diagonal.
  for (const v of [36, 150]) body += comic(`M2 ${r2(H - v - 8)}L${r2(W - 2)} ${r2(H - v - 8)}L${r2(W - 2)} ${r2(H - v + 8)}L2 ${r2(H - v + 8)}Z`, C.woodDeep, { line: LINE.fine, rim: [1.6, -0.8] });
  body += comic(`M8 ${r2(H - 44)}L${r2(W - 18)} ${r2(H - 142)}L${r2(W - 6)} ${r2(H - 138)}L18 ${r2(H - 40)}Z`, C.woodDeep, { line: LINE.fine, rim: [1.6, -0.8] });
  // The round window of painted glass.
  const wx = W / 2;
  const wy = H - 196;
  body += `<circle cx="${r2(wx)}" cy="${r2(wy)}" r="26" fill="${C.glass}" stroke="${C.woodDeep}" stroke-width="5"/>`;
  body += `<circle cx="${r2(wx + 8)}" cy="${r2(wy - 8)}" r="8" fill="${C.sun}" stroke="${lineFor(C.sun)}" stroke-width="0.8"/>`;
  body += `<path d="M${r2(wx - 24)} ${r2(wy + 10)}Q${r2(wx)} ${r2(wy)} ${r2(wx + 24)} ${r2(wy + 8)}L${r2(wx + 18)} ${r2(wy + 18)}Q${r2(wx)} ${r2(wy + 26)} ${r2(wx - 18)} ${r2(wy + 18)}Z" fill="${C.hill}"/>`;
  body += ink(`M${r2(wx - 26)} ${r2(wy)}L${r2(wx + 26)} ${r2(wy)}M${r2(wx)} ${r2(wy - 26)}L${r2(wx)} ${r2(wy + 26)}`, 2, C.woodDeep);
  // It slides away into the hedge (toward the far post): an iron pull at its leading edge.
  body += comic(`M${r2(W - 34)} ${r2(H - 128)}L${r2(W - 22)} ${r2(H - 128)}L${r2(W - 22)} ${r2(H - 76)}L${r2(W - 34)} ${r2(H - 76)}Z`, '#d8c070', { line: LINE.small, rim: [1.4, -0.8], glint: [-0.8, 0.8], over: ink(`M${r2(W - 28)} ${r2(H - 120)}V${r2(H - 84)}`, 2.4, '#8f7a3a') });
  return leafArt(h, C.wood, body);
}

export function formDoor(): WallDoorArt {
  return {
    wall: { color: C.leaf[1], edge: '#e8eadf', half: 12, end: 100 },
    hole: HOLE,
    face: face(),
    leaf: { kind: 'slide', hinge: 'far', color: C.wood, back: C.woodDeep, art: leaf(), shut: 0, open: 1 },
    light: { color: '#ffe9b8', radius: 320, intensity: 0.85, y: 120 },
    glow: '#fff0c8',
    sounds: { wake: ['click', 0.25, 0.7], open: [['door', 0.45, 1.05], ['songOk', 0.3, 1.25]], shut: ['door', 0.4, 0.85] },
    openMs: 1100,
    life: { kind: 'petals', colors: ['#f7c6d9', '#ffe3ef', '#fff3b0'], rate: 1.2 },
    flat: { wall: C.leaf[1], frame: C.post },
  };
}
