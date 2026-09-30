import type { PartArt, RigDef } from '../../render/2d/rig/rigTypes';
import { softPastelMarkup } from '../../render/2d/palette';
import {
  gortiParts,
  RIG_GORTI_CHILD,
  RIG_GORTI_HUMAN,
  RIG_GORTI_HUMAN_SUN,
  RIG_GORTI_SUIT,
  RIG_GORTI_WARRIOR,
  RIG_GORTI_YOUTH,
} from '../characters/gorti';
import { formParts, RIG_COWARD, RIG_MECH } from '../characters/forms';
import { horseParts, RIG_HORSE } from '../characters/horse';
import { creatureParts } from '../characters/creatures';
import { propParts } from './props';
import { painting1Parts } from './painting1';
import { whaleParts } from '../characters/whales';

let partsCache: PartArt[] | null = null;

/** Every rasterized part/sprite of the game (characters, creatures, props). */
export function allParts(): PartArt[] {
  if (partsCache) return partsCache;
  // The characters in softer pastels than the scenery around them.
  const soft = (parts: PartArt[]): PartArt[] => parts.map((p) => ({ ...p, body: softPastelMarkup(p.body) }));
  partsCache = [...soft(gortiParts()), ...soft(formParts()), ...soft(horseParts()), ...creatureParts(), ...propParts()];
  // Whales (sperm, blue, bowhead): the jump platforms and the whale memory.
  partsCache.push(...whaleParts());
  // The 14th Room as the first painting shows it (chapter I).
  partsCache.push(...painting1Parts());
  const seen = new Set<string>();
  for (const p of partsCache) {
    if (seen.has(p.key)) throw new Error(`Duplicate art key ${p.key}`);
    seen.add(p.key);
  }
  return partsCache;
}

export function allRigs(): RigDef[] {
  return [RIG_GORTI_CHILD, RIG_GORTI_YOUTH, RIG_GORTI_WARRIOR, RIG_GORTI_HUMAN, RIG_GORTI_HUMAN_SUN, RIG_GORTI_SUIT, RIG_COWARD, RIG_MECH, RIG_HORSE];
}
