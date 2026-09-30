import type { MusicCue } from '../../music/types';
import type { WhaleSpecies } from '../characters/whales';
import type { FormId, Note, PlayerKind, RoomId } from '../../engine/state/types';

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
  /** A paper box's floor (the 14th Room): no boards, a few pencil creases. */
  | 'paper'
  | 'none';

/**
 * A whale platform's part in a set piece (a lift, a spiral, a bridge): the
 * room picks what the width-based planner would otherwise choose, and how the
 * whale arrives when its gate opens.
 */
export interface WhaleDef {
  species?: WhaleSpecies;
  /** +1: head to the right. Whales of a formation face along its path. */
  facing?: 1 | -1;
  /** Drawn behind the room's props (the far side of a tree trunk it circles). */
  behind?: boolean;
  /** Revealed in play: comes from this offset to its place (px)… */
  from?: readonly [number, number];
  /** …taking this long (s)… */
  time?: number;
  /** …after this delay (s): a formation arrives one after the other. */
  delay?: number;
  /** Settling into place (default) or drifting the whole way, gently at both ends (carried on a wind). */
  ease?: 'out' | 'inOut';
  /** Calls as it arrives and when landed on, at this pitch (below 1 deep, above 1 high). */
  call?: number;
}

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
  /** Whale platforms (drawn root/wood jumps): a set piece's choices. */
  whale?: WhaleDef;
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
  /**
   * Depth in the 3D paper diorama (world px): 0 is the plane the actors
   * walk on, negative is further back, positive toward the viewer. The prop
   * then stands at its world position and size at that depth, and its
   * scroll factor is not used in 3D. Without it, the depth comes from
   * `scroll` (parallax) or `depth` (the DEPTH band). The flat game ignores
   * it. Entries between -60 and -900 also set the depth of the box's back
   * (a painted back wall lines up with the box's floor and side walls).
   */
  z?: number;
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
