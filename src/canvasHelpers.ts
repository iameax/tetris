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

export const createBGCanvas = (canvasEl: HTMLCanvasElement, dimensions: Dimensions) => {
  const ctx = canvasEl.getContext('2d');
  const scaleRatio = canvasEl.width / dimensions.cols;

  ctx.save();
  ctx.scale(scaleRatio, scaleRatio);
  ctx.lineWidth = 1 / scaleRatio;

  const { rows, cols } = dimensions;
  ctx.fillStyle = '#a3b6ac';
  ctx.fillRect(0, 0, cols, rows);

  makeDots(ctx, dimensions, 'black');

  return canvasEl;
};