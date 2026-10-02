// Development-only page (dev/loading.html, not part of the production build):
// holds the loading screen on screen, which the game only flashes.
//   (no query)   the progress runs 0→100% (?secs=, default 7) in uneven steps,
//                holds the ta-da, closes, and starts again
//   ?p=0.42      comes up to that progress and holds it (?p=1: the ta-da)
//   ?err=1       fails at 40%, as BootScene does when the drawings fail
//   ?rm=1        the game's reduced-motion setting
// window.__loading drives it from a test: set(p, label?), close(), restart().
import '../styles.css';
import { LoadingView } from '../ui/LoadingView';

const q = new URLSearchParams(location.search);
const GROW = 'Kristaller büyüyor…';
const stage = document.getElementById('stage')!;
if (q.has('rm')) document.documentElement.classList.add('reduced-motion');

/** Lays the stage over the window, as UI.sync does. */
function fit(): void {
  const W = window.innerWidth;
  const H = window.innerHeight;
  Object.assign(stage.style, { left: '0px', top: '0px', width: `${W}px`, height: `${H}px` });
  document.documentElement.style.setProperty('--s', Math.min(1.4, Math.max(0.5, Math.min(W / 1280, H / 720))).toFixed(3));
}
fit();
window.addEventListener('resize', fit);

let view = new LoadingView(stage);
let timer = 0;

/** Comes up to `to` in uneven steps over `secs`, then calls `done`. */
function run(to: number, secs: number, done: () => void): void {
  const t0 = performance.now();
  const step = (): void => {
    const p = Math.min(to, ((performance.now() - t0) / (secs * 1000)) * to);
    view.set(p, GROW);
    timer = p < to ? window.setTimeout(step, 30 + Math.random() * 90) : 0;
    if (!timer) done();
  };
  view.set(0, GROW);
  timer = window.setTimeout(step, 250);
}

function restart(): void {
  window.clearTimeout(timer);
  view.close();
  window.setTimeout(() => {
    view = new LoadingView(stage);
    start();
  }, 500);
}

function start(): void {
  const secs = Number(q.get('secs') ?? 7);
  if (q.has('err')) run(0.4, secs * 0.4, () => view.set(1, 'Çizimler yüklenemedi. Sayfayı yenilemeyi deneyin.'));
  else if (q.has('p')) run(Number(q.get('p')), Math.max(0.6, secs * Number(q.get('p'))), () => undefined);
  else run(1, secs, () => (timer = window.setTimeout(restart, 3200)));
}
start();

(window as unknown as { __loading: unknown }).__loading = {
  set: (p: number, label = GROW) => {
    window.clearTimeout(timer);
    view.set(p, label);
  },
  close: () => view.close(),
  restart,
};
