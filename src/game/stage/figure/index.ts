import { Figure } from './figure';
import { buildGorti, type FigureModel } from './gorti';

// The 3D figures the stage can stand in for 2D rigs, by rig id.
const BUILDERS: Record<string, () => FigureModel> = { 'gorti.root.child': buildGorti };
const models = new Map<string, FigureModel>();

export function hasFigure(id: string): boolean {
  return id in BUILDERS;
}

/** A new figure for the rig (its model built once and shared), or null. */
export function makeFigure(id: string): Figure | null {
  const build = BUILDERS[id];
  if (!build) return null;
  let model = models.get(id);
  if (!model) {
    model = build();
    models.set(id, model);
  }
  return new Figure(model);
}

export { Figure };
export type { FigureModel };
