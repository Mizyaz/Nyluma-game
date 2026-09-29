import { P } from '../palette';
import { cel, glow, line, poly, smooth, taper, type Pt } from '../svg';
import type { PartArt } from '../rigTypes';

// Hazard artwork: crystal thorns, memory wisps, root lashes, cracks, shards.

const tr = (pts: readonly Pt[], ox: number, oy: number): Pt[] => pts.map(([x, y]) => [x + ox, y + oy]);

function thorns(key: string, unstable: boolean): PartArt {
  const w = 44;
  const h = 40;
  const c = unstable
    ? { fill: '#b17be6', shade: P.violetDark, light: P.vein }
    : { fill: P.crystalBlue, shade: P.crystalBlueDark, light: P.crystalBlueLight };
  const spike = (bx: number, hh: number, lean: number, wd: number): string => {
    const pts: Pt[] = [[bx - wd, h], [bx + lean * hh - 1, h - hh], [bx + wd, h]];
    const facet: Pt[] = [[bx + lean * hh - 1, h - hh], [bx + wd, h], [bx + 1, h]];
    return cel(poly(pts), { fill: c.fill, shade: c.shade, light: c.light, sx: 0, sy: 0, hx: 1.5, hy: 1.2, shadeD: poly(facet), stroke: 2.6 });
  };
  let s = '';
  if (unstable) s += glow(w / 2, h - 12, 20, P.violet, 0.35);
  s += spike(12, 24, -0.25, 6);
  s += spike(33, 22, 0.3, 6);
  s += spike(22, 36, 0.05, 7.5);
  if (unstable) s += line(`M${16} ${h - 8}l4 -6l3 4l4 -7`, P.vein, 1.3, 0.9);
  return { key, w, h, px: w / 2, py: h, body: s, scale: 2 };
}

function wisp(): PartArt {
  const w = 56;
  const h = 64;
  const o = (pts: Pt[]): Pt[] => tr(pts, 0, 0);
  let s = glow(28, 28, 26, P.vein, 0.5);
  s += cel(smooth(o([[28, 6], [42, 14], [46, 30], [38, 44], [34, 58], [28, 50], [22, 60], [18, 46], [10, 32], [14, 14]])), {
    fill: '#e3d2ff', shade: '#b69be6', light: '#f7f0ff', sx: 3, sy: 3, hx: 1.5, hy: 1.5, stroke: 2.6, opacity: 0.92,
    over: `<path d="M21 26q3-3 6 0M31 26q3-3 6 0" fill="none" stroke="${P.ink}" stroke-width="1.6" stroke-linecap="round"/><path d="M25 35q4 3 8 0" fill="none" stroke="${P.ink}" stroke-width="1.4" stroke-linecap="round"/>`,
  });
  return { key: 'hz.wisp', w, h, px: 28, py: 30, body: s, scale: 2 };
}

function lash(): PartArt {
  const w = 60;
  const h = 170;
  let s = cel(taper([[30, 170], [26, 130], [34, 90], [24, 50], [32, 20], [40, 6]], 20, 3), {
    fill: P.bark, shade: P.barkDark, light: P.barkLight, sx: 3, sy: 0, hx: 1.5, hy: 0, stroke: 3,
    over: line('M28 150q4-30 -2-60q-4-30 6-60', P.violet, 1.6, 0.9),
  });
  s += cel(taper([[27, 110], [14, 98], [8, 86]], 5, 1.5), { fill: P.bark, shade: P.barkDark, sx: 1, sy: 0, stroke: 2 });
  s += cel(taper([[31, 70], [44, 60], [50, 48]], 5, 1.5), { fill: P.bark, shade: P.barkDark, sx: 1, sy: 0, stroke: 2 });
  return { key: 'hz.lash', w, h, px: 30, py: 170, body: s, scale: 1.5 };
}

function crack(): PartArt {
  const w = 90;
  const h = 18;
  let s = glow(45, 9, 30, P.violet, 0.5);
  s += `<path d="M6 10l14-3l10 5l12-6l12 5l14-4l14 4" fill="none" stroke="${P.ink}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<path d="M6 10l14-3l10 5l12-6l12 5l14-4l14 4" fill="none" stroke="${P.vein}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  return { key: 'hz.crack', w, h, px: 45, py: 12, body: s, scale: 1.5 };
}

function shard(): PartArt {
  const w = 30;
  const h = 64;
  const s = cel(poly([[15, 62], [4, 30], [10, 4], [22, 2], [27, 30]]), {
    fill: P.crystalTeal, shade: P.crystalTealDark, light: P.crystalTealLight, sx: 0, sy: 0, hx: 1.5, hy: 1.5,
    shadeD: poly([[15, 62], [22, 2], [27, 30]]), stroke: 2.6,
  });
  return { key: 'hz.shard', w, h, px: 15, py: 60, body: s, scale: 2 };
}

export function hazardParts(): PartArt[] {
  return [thorns('hz.thorns', false), thorns('hz.thorns.unstable', true), wisp(), lash(), crack(), shard()];
}
