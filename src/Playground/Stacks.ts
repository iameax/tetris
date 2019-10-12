import Figure from '../Figure';
import Matrix from '../Matrix';
import { Color, Dimensions } from '../types';


export default class Stacks {
  public data: Matrix<Color>;

  constructor(dimensions: Dimensions) {
    this.data = Matrix.create(dimensions);
  }

  public addFigure(figure: Figure) {
    const { shape, position, color } = figure;

    for (let y = 0; y < shape.rows; y++) {
      for (let x = 0; x < shape.cols; x++) {
        if (shape.get(y, x)) {
          this.data.set(position.y + y, position.x + x, color);
        }
      }
    }
  }

  public clear() {
    this.data.clear();
  }

  public isFit(figure: Figure): boolean {
    const { shape, position } = figure;

    const { rows: fieldRows, cols: fieldCols } = this.data;

    for (let y = 0; y < shape.rows; y++) {
      for (let x = 0; x < shape.cols; x++) {
        const [nextX, nextY] = [position.x + x, position.y + y];

        if (nextX < 0 || (nextX > fieldCols - 1) || (nextY > fieldRows - 1)) {
          return false;
        }

        if (nextY < 0) {
          continue;
        }

        const currentValue = this.data.get(nextY, nextX);
        if (shape.get(y, x) && currentValue) {
          return false;
        }
      }
    }

    return true;
  }

  public collapse() {
    const { rows } = this.data.dimensions;
    let lines = 0;

    for (let row = 0; row < rows; row++) {
      const values = this.data.getRow(row);
      const isFilled = this.data.getRow(row).every((val) => !!val);

      if (isFilled) {
        lines++;


        // TODO change
        this.data.setRow(row, values.map(() => '#fafafa'));
        setTimeout(() => this.data.setRow(row, values), 100);
        setTimeout(() => this.data.setRow(row, values.map(() => '#fafafa')), 150);
        setTimeout(() => this.data.setRow(row, values.map(() => null)), 200);
        setTimeout(() => {
          this.data.array.splice(row, 1);
          this.data.array.unshift(values.map(() => null));
        }, 250);
      }
    }

    return lines;
  }
}