import { ColorEnum } from "./constants";
import { Dimensions, Color } from './types';


const makeDots = (ctx: CanvasRenderingContext2D, { rows, cols }: Dimensions, color: Color) => {
  ctx.fillStyle = color;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.beginPath();
      ctx.arc(x + 0.5, y + 0.5, 0.03, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  }
};

const makeGrid = (ctx: CanvasRenderingContext2D, { rows, cols }: Dimensions, color: Color) => {
  ctx.beginPath();
  for (let i = 0; i < cols; i++) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, rows);
  }

  for (let i = 0; i < rows; i++) {
    ctx.moveTo(0, i);
    ctx.lineTo(cols, i);
  }

  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();
};

export const prepareCanvas = (canvasEl: HTMLCanvasElement, { rows, cols }: Dimensions, ratio = 35) => {
  const width = ratio * cols;

  canvasEl.setAttribute('width', String(width));
  canvasEl.setAttribute('height', String(ratio * rows));

  const ctx = canvasEl.getContext('2d');

  ctx.save();
  ctx.scale(ratio, ratio);
  ctx.lineWidth = 1 / ratio;
};

export const createBGCanvas = (canvasEl: HTMLCanvasElement, dimensions: Dimensions) => {
  prepareCanvas(canvasEl, dimensions);

  const { rows, cols } = dimensions;
  const ctx = canvasEl.getContext('2d');
  ctx.fillStyle = ColorEnum.DARK_GRAY;
  // ctx.fillStyle = '#a3b6ac';
  ctx.fillRect(0, 0, cols, rows);

  makeDots(ctx, dimensions, '#ff820170');
  // makeGrid(ctx, dimensions, 'rgba(0, 0, 0, 0.4)');

  return canvasEl;
};

export const figureCanvas = (parentEl: Element, dimensions: Dimensions) => {
  const canvasEl: HTMLCanvasElement = parentEl.querySelector('canvas.shape');
  prepareCanvas(canvasEl, dimensions);

  return canvasEl;
};

export const stacksCanvas = (parentEl: Element, dimensions) => {
  const canvasEl: HTMLCanvasElement = parentEl.querySelector('canvas.stacks');
  prepareCanvas(canvasEl, dimensions);

  return canvasEl;
};