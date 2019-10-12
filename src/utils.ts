import { AUDIOS, FIGURE_COLORS, SHAPES } from './constants';
import Matrix from './Matrix';
import { Color } from './types';

const Color = require('color');


const arrayRandom = <T>(array: T[]): T => {
  const index = Math.floor(Math.random() * array.length);

  return array[index];
};

export const randomColor = (): Color => arrayRandom(FIGURE_COLORS);

export const randomShape = (): Matrix<number> => arrayRandom(SHAPES);

// noinspection TypeScriptValidateJSTypes
export const colorLighten = (color: Color, amount: number) => Color(color).lighten(amount).string();

export const playAudio = (type: string) => {
  const audio: HTMLAudioElement = AUDIOS[type];

  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
};