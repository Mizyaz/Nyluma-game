// Development-only preview of the page turns and the chapter pages (not part
// of the production build). The clock is stepped by hand: kdSeek(seconds).
//   dev/transitions.html?mode=room|chapter&ch=1..6&dir=1|-1&reduced=1&portrait=1
import '../styles.css';
import { Clock, Leaf, type Rect } from '../ui/PageTurn';
import { Motes, Spark } from '../ui/PageBits';
import { ChapterPage } from '../ui/ChapterPage';
import { h } from '../ui/dom';

(window as unknown as { __kdManualClock: boolean }).__kdManualClock = true;
const q = new URLSearchParams(location.search);
const mode = q.get('mode') ?? 'room';
const dir = (q.get('dir') === '-1' ? -1 : 1) as 1 | -1;
const reduced = q.get('reduced') === '1';
const chapter = Number(q.get('ch') ?? 1);
const W = window.innerWidth;
const H = window.innerHeight;
const portrait = H > W * 0.9;
const stage = document.getElementById('stage')!;
const game = document.getElementById('game')!;
// The game view: the whole window, or a 16:9 band under a HUD band (portrait).
const view: Rect = portrait ? { x: 0, y: 60, w: W, h: Math.round((W * 9) / 16) } : { x: 0, y: 0, w: W, h: H };
Object.assign(game.style, { left: `${view.x}px`, top: `${view.y}px`, width: `${view.w}px`, height: `${view.h}px` });
if (portrait) document.getElementById('app')!.classList.add('portrait');

/** A made-up room: a wall, a floor, a window, a few cards (dpr 1). */
function room(seed: number, w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  const wall = seed ? '#c9c3d6' : '#f1e8d2';
  g.fillStyle = wall;
  g.fillRect(0, 0, w, h);
  g.fillStyle = seed ? '#e7e0cf' : '#efe6d6';
  g.fillRect(0, h * 0.64, w, h * 0.36);
  g.strokeStyle = '#5b4f66';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(0, h * 0.64);
  g.lineTo(w, h * 0.64);
  g.stroke();
  const cards = seed ? ['#a693c4', '#8fbfb4', '#f0b2cf'] : ['#97a3dc', '#f3e08e', '#e98a7a', '#9cc47a'];
  cards.forEach((col, i) => {
    const x = w * (0.12 + i * 0.22);
    g.fillStyle = col;
    g.strokeStyle = '#4f4557';
    g.beginPath();
    g.roundRect(x, h * 0.3 - i * 8, w * 0.13, h * 0.34 + i * 8, 14);
    g.fill();
    g.stroke();
  });
  g.fillStyle = '#4f4557';
  g.font = `bold ${Math.round(h * 0.08)}px sans-serif`;
  g.fillText(seed ? 'YENİ ODA' : 'ESKİ ODA', w * 0.08, h * 0.16);
  g.fillStyle = '#e46aa8';
  g.beginPath();
  g.arc(w * 0.7, h * 0.5, h * 0.04, 0, Math.PI * 2);
  g.fill();
  return c;
}

const next = room(1, view.w, view.h);
game.append(next);
const clock = new Clock();
const layer = h('div', { class: 'pt passive' });
stage.append(layer);
const shot = room(0, view.w, view.h);
const face = { x: view.x + view.w * 0.7, y: view.y + view.h * 0.5 };
let page: ChapterPage | null = null;
if (mode === 'chapter') {
  page = new ChapterPage(clock, layer, chapter, { w: W, h: H }, view, reduced);
} else {
  const under = h('div', { class: 'pt-under' });
  under.style.cssText = `left:${view.x}px;top:${view.y}px;width:${view.w}px;height:${view.h}px`;
  layer.append(under);
  clock.after(0.5, () => clock.play(under, [{ opacity: 1 }, { opacity: 0 }], { duration: 160 }));
}
const leaf = new Leaf(clock, layer, view, shot, dir, reduced);
if (reduced) leaf.fade(260);
else {
  leaf.lift(320);
  const motes = new Motes(clock, layer, view);
  motes.puff(0.04, dir > 0 ? 0.97 : 0.03, 8, dir);
  const spark = new Spark(clock, layer, face, Math.min(view.w, view.h));
  spark.rise(dir);
  if (mode === 'chapter') {
    page?.reveal(dir, 0.42);
    clock.after(0.32, () => {
      leaf.turn(820);
      spark.fade(0.5);
    });
    clock.after(2.15, () => page?.open(860));
  } else {
    clock.after(0.5, () => {
      leaf.turn(820);
      motes.puff(0.3, 0.5, 6, dir);
      spark.home({ x: view.x + view.w * 0.3, y: view.y + view.h * 0.55 }, 0.75, () => undefined);
    });
  }
}
if (reduced && page) {
  page.reveal(dir, 0);
  clock.after(1.5, () => page?.fade(300));
}
(window as unknown as { kdSeek: (t: number) => void }).kdSeek = (t: number) => {
  // Steps through every frame up to t (timers fire in order).
  const now = clock.t;
  for (let s = now; s < t; s = Math.min(t, s + 1 / 60)) clock.tick(Math.min(t, s + 1 / 60));
  clock.tick(t);
};
document.body.dataset.ready = '1';
