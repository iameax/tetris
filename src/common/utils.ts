import { SHAPES } from './constants';
import Matrix from './Matrix';
import { Color } from './types';


const Color = require('color');


export const arrayRandom = <T>(array: T[]): T => {
  const index = Math.floor(Math.random() * array.length);

  return array[index];
};

export const randomShape = (): Matrix<number> => arrayRandom(SHAPES);

// noinspection TypeScriptValidateJSTypes
export const colorLighten = (color: Color, amount: number) => Color(color).lighten(amount).string();

export const mapValues = (values, fn) => {
  const newValues = {};

  for (const key in values) {
    newValues[key] = fn(values[key], key);
  }

  return newValues;
};