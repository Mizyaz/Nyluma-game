import type { PoseOut, PoseParams } from './animPoses';

// Horse poses. Legs hang down at angle 0; forward swing is negative.
// The gallop is a four-beat cycle: hind-left, hind-right, fore-left,
// fore-right, each with its own phase offset.

export const GALLOP_OFFSETS = { huL: 0, huR: 0.12, fuL: 0.38, fuR: 0.5 } as const;

export function horsePose(anim: string, t: number, prm: PoseParams = {}): PoseOut {
  const p: PoseOut = { angles: {}, offsets: {} };
  const a = p.angles;
  switch (anim) {
    case 'gallop': {
      const ph = prm.phase ?? t * 2.4;
      const leg = (upper: 'fuR' | 'fuL' | 'huR' | 'huL', lower: 'flR' | 'flL' | 'hlR' | 'hlL', off: number, front: boolean): void => {
        const q = (ph + off) * Math.PI * 2;
        const s = Math.sin(q);
        const c = Math.cos(q);
        if (front) {
          a[upper] = -0.55 * s;
          a[lower] = 0.9 * Math.max(0, c) + 0.05;
        } else {
          a[upper] = -0.5 * s + 0.1;
          a[lower] = -0.7 * Math.max(0, c) - 0.05;
        }
      };
      leg('huL', 'hlL', GALLOP_OFFSETS.huL, false);
      leg('huR', 'hlR', GALLOP_OFFSETS.huR, false);
      leg('fuL', 'flL', GALLOP_OFFSETS.fuL, true);
      leg('fuR', 'flR', GALLOP_OFFSETS.fuR, true);
      const q = ph * Math.PI * 2;
      a.body = 0.05 * Math.sin(q + 0.6);
      p.offsets.body = { x: 0, y: -5 * Math.abs(Math.sin(q)) };
      a.neck = -0.08 * Math.sin(q + 1.2);
      a.head = 0.06 * Math.sin(q + 1.8);
      a.tail = 0.25 + 0.15 * Math.sin(q * 2);
      break;
    }
    case 'jump': {
      a.fuR = -0.9;
      a.flR = 1.5;
      a.fuL = -0.75;
      a.flL = 1.35;
      a.huR = 0.6;
      a.hlR = -0.3;
      a.huL = 0.5;
      a.hlL = -0.2;
      a.body = -0.12;
      a.neck = 0.1;
      a.tail = 0.5;
      break;
    }
    case 'land': {
      a.fuR = -0.35;
      a.flR = 0.05;
      a.fuL = -0.2;
      a.flL = 0.1;
      a.huR = 0.3;
      a.hlR = -0.3;
      a.huL = 0.2;
      a.hlL = -0.2;
      a.body = 0.1;
      p.offsets.body = { x: 0, y: 6 };
      a.tail = 0.4;
      break;
    }
    case 'rear': {
      a.body = -0.55;
      a.fuR = -1.3;
      a.flR = 1.6;
      a.fuL = -1.0;
      a.flL = 1.7;
      a.huR = 0.55;
      a.huL = 0.45;
      a.hlR = -0.1;
      a.hlL = -0.1;
      a.neck = -0.25;
      a.head = 0.3 + 0.08 * Math.sin(t * 9);
      a.tail = 0.7;
      p.offsets.body = { x: -24, y: -8 };
      break;
    }
    case 'kneel': {
      a.fuR = -0.2;
      a.flR = 2.3;
      a.fuL = -0.1;
      a.flL = 2.2;
      a.huR = -0.5;
      a.hlR = 1.2;
      a.huL = -0.4;
      a.hlL = 1.1;
      a.body = 0.05;
      a.neck = 0.35;
      a.head = 0.2;
      p.offsets.body = { x: 0, y: 44 };
      a.tail = 0.1;
      break;
    }
    case 'emerge':
    case 'idle':
    default: {
      const b = Math.sin(t * 1.8);
      a.body = 0.01 * b;
      p.offsets.body = { x: 0, y: 1.2 * b };
      a.neck = 0.04 * Math.sin(t * 0.9);
      a.head = 0.05 * Math.sin(t * 1.3 + 1);
      a.tail = 0.1 + 0.08 * Math.sin(t * 1.1);
      a.fuR = -0.04;
      a.fuL = 0.05;
      a.huR = 0.06;
      a.huL = -0.03;
      if (anim === 'emerge') a.neck = -0.3 + 0.1 * Math.sin(t * 6);
      break;
    }
  }
  return p;
}
