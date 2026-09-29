import type { MusicCue } from '../../music/types';
import type { FormId, Note, PlayerKind, RoomId } from '../state/types';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Optional flag gates shared by most room elements. */
export interface Gate {
  /** Present only while this flag is set. */
  when?: string;
  /** Removed once this flag is set. */
  unless?: string;
}

export type SolidStyle =
  | 'soil'
  | 'root'
  | 'crystal'
  | 'wood'
  | 'stone'
  | 'moss'
  | 'floor'
  | 'metal'
  | 'bed'
  | 'office'
  | 'none';

export interface SolidDef extends Rect, Gate {
  id?: string;
  style: SolidStyle;
  oneWay?: boolean;
  /** Revealed and made solid only by focus (breath). */
  latent?: boolean;
  /** Grown by an event: drawn with a growth tween when its gate opens. */
  grow?: boolean;
  /** Skip drawing (collision only, e.g. a wall outside the camera). */
  hidden?: boolean;
}

export interface CheckpointDef {
  id: string;
  x: number;
  /** Ground level (feet) at the checkpoint. */
  y: number;
  facing?: 1 | -1;
  /** Invisible checkpoints are saved silently (room entries, set pieces). */
  silent?: boolean;
}

export interface AnchorDef extends Gate {
  id: string;
  x: number;
  y: number;
  /** Validated landing point (feet). */
  land: { x: number; y: number };
}

export interface BudDef extends Gate {
  id: string;
  x: number;
  y: number;
  bridge: Rect;
}

export interface SongNodeDef extends Gate {
  id: string;
  x: number;
  y: number;
  pattern: Note[];
}

export interface SiteDef extends Gate {
  id: string;
  x: number;
  y: number;
}

export interface InteractDef extends Gate {
  id: string;
  x: number;
  y: number;
  r?: number;
  prompt: string;
}

export interface MemoryPickupDef {
  id: string;
  x: number;
  y: number;
}


export interface ExitDef extends Rect, Gate {
  id: string;
  to: RoomId;
}

export interface TriggerDef extends Rect, Gate {
  id: string;
}

export interface PropDef extends Gate {
  key: string;
  x: number;
  y: number;
  scale?: number;
  depth?: number;
  flipX?: boolean;
  alpha?: number;
  angle?: number;
  /** Parallax scroll factor for decorative background props. */
  scroll?: number;
  /** Origin; defaults to bottom-centre so props stand on the ground. */
  ox?: number;
  oy?: number;
}

export type ThemeId =
  | 'nursery'
  | 'roots'
  | 'chamber'
  | 'surface'
  | 'hill'
  | 'forest'
  | 'ride'
  | 'sun'
  | 'clearing'
  | 'dorm'
  | 'mech'
  | 'office';

export type MusicId = MusicCue | 'none';

export interface RoomDef {
  id: RoomId;
  chapter: 1 | 2 | 3 | 4 | 5;
  title: string;
  width: number;
  height: number;
  theme: ThemeId;
  music: MusicId;
  player: PlayerKind;
  /** Form forced when the room is entered from its first checkpoint. */
  entryForm?: FormId;
  checkpoints: CheckpointDef[];
  solids: SolidDef[];
  anchors?: AnchorDef[];
  buds?: BudDef[];
  songNodes?: SongNodeDef[];
  sites?: SiteDef[];
  interacts?: InteractDef[];
  memories?: MemoryPickupDef[];
  exits: ExitDef[];
  triggers?: TriggerDef[];
  props?: PropDef[];
  killY?: number;
  /** Camera zoom (default CAMERA_ZOOM); arenas and the ride show more. */
  zoom?: number;
}
