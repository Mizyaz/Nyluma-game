import * as Phaser from 'phaser';
import { GRAVITY } from './constants';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { WorldScene } from './scenes/WorldScene';
import { SkyScene } from './scenes/SkyScene';
import { EndingScene } from './scenes/EndingScene';
import { WarpScene } from './scenes/WarpScene';
import { CinemaScene } from './scenes/CinemaScene';
import { deviceSize } from '../paper/screen';

/**
 * The canvas has one pixel per device pixel (see paper/screen.ts): the game
 * size is the box's size in device px and the scale manager shows it at
 * 1/dpr, so the browser never stretches the picture.
 */
export function gameConfig(parent: HTMLElement, forceCanvas: boolean): Phaser.Types.Core.GameConfig {
  const r = parent.getBoundingClientRect();
  const size = deviceSize(r.width || window.innerWidth, r.height || window.innerHeight);
  return {
    type: forceCanvas ? Phaser.CANVAS : Phaser.AUTO,
    parent,
    width: size.w,
    height: size.h,
    backgroundColor: '#0f0d18',
    scale: {
      mode: Phaser.Scale.NONE,
      zoom: 1 / size.dpr,
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: true,
      mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
      powerPreference: 'high-performance',
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: GRAVITY },
        fps: 60,
        fixedStep: true,
        debug: false,
        tileBias: 24,
        overlapBias: 8,
      },
    },
    input: {
      keyboard: false,
      mouse: true,
      touch: true,
      gamepad: false,
    },
    fps: {
      target: 60,
      smoothStep: true,
      // Short post-resume cooldown: slow devices would otherwise run the
      // simulation in slow motion for ~120 frames after every focus change.
      panicMax: 12,
    },
    disableContextMenu: true,
    banner: false,
    audio: { noAudio: true },
    scene: [BootScene, MenuScene, WorldScene, SkyScene, EndingScene, WarpScene, CinemaScene],
  };
}
