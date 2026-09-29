import type { PartArt, RigDef } from './rigTypes';
import { gortiParts, RIG_GORTI_HUMAN, RIG_GORTI_ROOT, RIG_GORTI_SUIT } from './characters/gorti';
import { formParts, RIG_COWARD, RIG_MECH } from './characters/forms';
import { horseParts, RIG_HORSE } from './characters/horse';
import { creatureParts } from './characters/creatures';
import { propParts } from './props';

let partsCache: PartArt[] | null = null;

/** Every rasterized part/sprite of the game (characters, creatures, props). */
export function allParts(): PartArt[] {
  if (partsCache) return partsCache;
  partsCache = [...gortiParts(), ...formParts(), ...horseParts(), ...creatureParts(), ...propParts()];
  const seen = new Set<string>();
  for (const p of partsCache) {
    if (seen.has(p.key)) throw new Error(`Duplicate art key ${p.key}`);
    seen.add(p.key);
  }
  return partsCache;
}

export function allRigs(): RigDef[] {
  return [RIG_GORTI_ROOT, RIG_GORTI_HUMAN, RIG_GORTI_SUIT, RIG_COWARD, RIG_MECH, RIG_HORSE];
}
