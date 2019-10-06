import Figure from "./Figure";

export enum Angle {
  D_0 = 0,
  D_90 = 90,
  D_180 = 180,
  D_270 = 270,
}

export type color = string;

export enum Color {
  NONE = 'transparent',
  BLACK = '#000',
  DARK_GRAY = '#343333',
  RED = '#ff3b47',
  BLUE = 'blue',
  GREEN = 'green',
}

export const FIGURE_COLORS = ['#673ab7', '#e91e63', '#ff5722', '#4caf50'];

export enum Direction {
  LEFT,
  RIGHT,
  DOWN,
}

export enum KeyCode {
  SPACE = 32,
  ESC = 27,
  ENTER = 13,
  ARROW_LEFT = 37,
  ARROW_RIGHT = 39,
  ARROW_DOWN = 40,
  P = 80,
}

export type Dimensions = {
  rows: number,
  cols: number,
}

export enum Sound {
  ROTATE = 'rotate',
  BLOCK = 'block',
  DROP = 'drop',
  COLLAPSE = 'collapse',
  PAUSE = 'pause',
  GAMEOVER = 'gameover',
}

export const SOUND_SOURCES = {
  [Sound.ROTATE]: './sounds/block-rotate.mp3',
  [Sound.BLOCK]: './sounds/force-hit.mp3',
  [Sound.DROP]: './sounds/slow-hit.mp3',
  [Sound.COLLAPSE]: './sounds/whoosh.mp3',
  [Sound.PAUSE]: './sounds/pause.mp3',
  [Sound.GAMEOVER]: './sounds/gameover.mp3',
};

export const SELECTORS = {};
