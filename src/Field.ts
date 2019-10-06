import tinycolor from 'tinycolor2';
import Matrix from './Matrix'
import {color, Color, Dimensions} from './constants';
import Figure from './Figure';
import PlacedFigure from './PlacedFigure';


export interface IField {
  setState(state: Matrix<color>);
  getState(): Matrix<color>;
  fillCoords(coords: Matrix<number>, position, value: color);
  clearCoords(coords: Matrix<number>, position);
  render(clear?: boolean);
  clear();
  dimensions(): Dimensions;
}

class Field implements IField {
  ctx: CanvasRenderingContext2D;

  private state: Matrix<color>;

  constructor(canvas: HTMLCanvasElement, dimensions: Dimensions) {
    this.ctx = canvas.getContext('2d');
    this.state = Matrix.create(dimensions);
  }

  public setState(state: Matrix<color>) {
    this.state = state;
  }

  public getState(): Matrix<color> {
    return this.state;
  }

  public fillCoords(coords: Matrix<number>, position: { x: number, y: number }, value: color) {
    const { rows, cols } = coords.dimensions();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (coords.get(y, x)) {
          this.state.set(position.y + y, position.x + x, value);
        }
      }
    }
  }

  public clearCoords(coords: Matrix<number>, position) {
    this.fillCoords(coords, position, null);
  }

  public render(clear: boolean = false) {
    const entries = this.state.entries();

    for (const [{ x, y }, color] of entries) {
      if (color) {
        this.fillCell(x, y, color);
      } else {
        this.clearCell(x, y);
      }
    }
  }

  public dimensions() {
    return this.state.dimensions();
  }
  
  public clear() {
    this.state.clear();
    const { rows, cols } = this.state.dimensions();
    this.ctx.clearRect(0, 0, cols, rows);
  }

  private fillCell(x, y, color) {
    this.ctx.fillStyle = color;

    // this.ctx.globalCompositeOperation = 'source-over';

    // this.ctx.fillRect(x, y, 1, 1);
    this.ctx.fillRect(x + 0.025, y + 0.025, 0.925, 0.925);
    // this.ctx.globalCompositeOperation = 'screen';
    this.ctx.fillStyle = tinycolor(color).lighten(5).toString();
    this.ctx.fillRect(x + 0.15, y + 0.15, 0.7, 0.7);
  }

  private clearCell(x, y) {
    this.ctx.clearRect(x, y, 1, 1);
  }
}

export {Field};
