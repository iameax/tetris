import Matrix from './Matrix';


export enum Angle {
  D_0 = 0,
  D_90 = 90,
  D_180 = 180,
  D_270 = 270,
}

export enum ColorEnum {
  NONE = 'transparent',
  BLACK = '#000',
  DARK_GRAY = '#343333',
  RED = '#ff3b47',
  BLUE = 'blue',
  GREEN = 'green',
}

export enum Sound {
  ROTATE = 'rotate',
  BLOCK = 'block',
  LAND = 'land',
  COLLAPSE = 'collapse',
  PAUSE = 'pause',
  GAMEOVER = 'gameover',
}

export const FIGURE_COLORS = ['#673ab7', '#e91e63', '#ff5722', '#4caf50'];

export enum Direction {
  LEFT,
  RIGHT,
  DOWN,
}

export enum KeyCode {
  SPACE = 'Space',
  ESC = 'Escape',
  ENTER = 'Enter',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_DOWN = 'ArrowDown',
  ARROW_UP = 'ArrowUp',
  P = 'KeyP',
  M = 'KeyM',
}

export enum Control {
  POWER = 'power',
  RESET = 'reset',
  PAUSE = 'pause',
  MUTE = 'mute',
  ARROW_UP = 'arrow-up',
  ARROW_RIGHT = 'arrow-right',
  ARROW_LEFT = 'arrow-left',
  ARROW_DOWN = 'arrow-down',
  ACTION = 'action',
  RGB = 'theme',
}

export const SHAPES: Matrix<number>[] = [
  new Matrix([
    [1, 1],
    [1, 1],
  ]),
  new Matrix([
    [1],
    [1],
    [1],
    [1],
  ]),
  new Matrix([
    [1, 1, 0],
    [0, 1, 1],
  ]),
  new Matrix([
    [0, 1, 1],
    [1, 1, 0],
  ]),
  new Matrix([
    [0, 1, 0],
    [1, 1, 1],
  ]),
  new Matrix([
    [1, 0],
    [1, 0],
    [1, 1],
  ]),
  new Matrix([
    [0, 1],
    [0, 1],
    [1, 1],
  ]),
];

export const SELECTORS = {};
