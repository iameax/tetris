import { Color, Dimensions } from './types';
import Matrix from './Matrix';
import { colorLighten } from './utils';


/**
 *
 */
export default class CanvasBoard {
  public dimensions: Dimensions;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas, scale, dimensions: Dimensions) {
    this.ctx = canvas.getContext('2d');
    this.ctx.scale(scale, scale);
    this.ctx.lineWidth = 2 / scale;
    this.dimensions = dimensions;
  }

  public fillMatrix(matrix: Matrix<any>, color, offset: { x: number; y: number } = { x: 0, y: 0 }) {
    const { x: offsetX, y: offsetY } = offset;

    for (let y = 0; y < matrix.rows; y++) {
      for (let x = 0; x < matrix.cols; x++) {
        if (matrix.get(y, x)) {
          this.fillCell(offsetX + x, offsetY + y, color);
        }
      }
    }
  }

  render(matrix: Matrix<Color>) {
    this.clear();

    for (let y = 0; y < matrix.rows; y++) {
      for (let x = 0; x < matrix.cols; x++) {
        if (matrix.get(y, x)) {
          this.fillCell(x, y, matrix.get(y, x));
        }
      }
    }
  }

  public fillCell(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 0.025, y + 0.025, 0.925, 0.925);
    this.ctx.fillStyle = colorLighten(color, 0.1);
    this.ctx.fillRect(x + 0.15, y + 0.15, 0.7, 0.7);
  }

  private fillBWCell(x, y) {
    this.ctx.fillStyle = '#333';
    this.ctx.strokeStyle = '#333';
    this.ctx.beginPath();
    this.ctx.rect(x + 0.025, y + 0.025, 0.925, 0.925);
    this.ctx.closePath();
    this.ctx.stroke();

    // this.ctx.fillRect(x + 0.025, y + 0.025, 0.925, 0.925);
    // this.ctx.fillStyle = colorLighten('#333', 0.1);
    this.ctx.fillRect(x + 0.15, y + 0.15, 0.7, 0.7);
  }

  private clearCell(x, y) {
    this.ctx.clearRect(x, y, 1, 1);
  }

  public clear() {
    const { rows, cols } = this.dimensions;
    this.ctx.clearRect(0, 0, cols, rows);
  }
}