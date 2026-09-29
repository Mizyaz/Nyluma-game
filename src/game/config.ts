import * as Phaser from 'phaser';
import { GRAVITY, VIEW_H, VIEW_W } from './constants';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { WorldScene } from './scenes/WorldScene';
import { EndingScene } from './scenes/EndingScene';

export function gameConfig(parent: HTMLElement, forceCanvas: boolean): Phaser.Types.Core.GameConfig {
  return {
    type: forceCanvas ? Phaser.CANVAS : Phaser.AUTO,
    parent,
    width: VIEW_W,
    height: VIEW_H,
    backgroundColor: '#0f0d18',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
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
    scene: [BootScene, MenuScene, WorldScene, EndingScene],
  };
}
