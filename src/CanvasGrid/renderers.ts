import { Color } from '../common/types';
import { colorLighten } from '../common/utils';


export type CellRenderer<T> = (ctx: CanvasRenderingContext2D, x: number, y: number, value: T) => void;

export const bwCellRenderer = (ctx: CanvasRenderingContext2D, x, y, value: number) => {
  if (!value) {
    return;
  }

  ctx.fillStyle = '#333';
  ctx.strokeStyle = '#333';
  ctx.beginPath();
  ctx.rect(x + 0.025, y + 0.025, 0.925, 0.925);
  ctx.closePath();
  ctx.stroke();
  ctx.fillRect(x + 0.15, y + 0.15, 0.7, 0.7);
};

export const coloredCellRenderer = (ctx: CanvasRenderingContext2D, x, y, value: Color) => {
  if (!value) {
    return;
  }
  
  ctx.fillStyle = value;
  ctx.fillRect(x + 0.025, y + 0.025, 0.925, 0.925);
  ctx.fillStyle = colorLighten(value, 0.1);
  ctx.fillRect(x + 0.15, y + 0.15, 0.7, 0.7);
};