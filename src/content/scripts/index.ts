import type { RoomId } from '../../engine/state/types';
import type { WorldScene } from '../../engine/scenes/WorldScene';
import type { RoomScript, ScriptFactory } from './types';
import { roomSpec } from '../data/rooms';
import { ContentScript } from '../../engine/content/ContentScript';
import { r01 } from './r01';
import { r02 } from './r02';
import { r03 } from './r03';
import { r04 } from './r04';
import { r05 } from './r05';
import { r06 } from './r06';
import { r07 } from './r07';
import { r08 } from './r08';
import { r09 } from './r09';
import { r10 } from './r10';
import { r11 } from './r11';
import { r12 } from './r12';

const EMPTY: ScriptFactory = () => ({ setup() {} });

const SCRIPTS: Partial<Record<RoomId, ScriptFactory>> = {
  r01,
  r02,
  r03,
  r04,
  r05,
  r06,
  r07,
  r08,
  r09,
  r10,
  r11,
  r12,
};

/** A room's behaviour: its TypeScript script, or what its room file says. */
export function createScript(id: RoomId, w: WorldScene): RoomScript {
  const spec = roomSpec(id);
  if (spec) return new ContentScript(w, spec);
  return (SCRIPTS[id] ?? EMPTY)(w);
}
