import Matrix from './Matrix';
import { Control } from './constants';
import { Sound } from '../../oldsrc/constants';


export type Dimensions = {
  rows: number;
  cols: number;
}

export type Color = string;

export type Shape = Matrix<number>;

export type ControlHandler = () => void;

export interface ControlManager {
  trigger: (control: Control) => void;
  addHandler: (control: Control, handler: ControlHandler) => void;
  addHandlers: (handlers: {}) => void;
}

export interface SoundPlayer {
  play: (sound: Sound) => void;
}