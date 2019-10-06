import PlacedFigure from './PlacedFigure';
import {IField} from './Field';
import Matrix from './Matrix';
import {color, ColorEnum} from './constants';
import {listeners} from 'cluster';


type Config = {
  field: IField,
  state?: Matrix<color>,
  listeners: {
    onCollapse: (lines: number) => void,
  }
}

export default class Stacks {
  private field: IField;
  private listeners: { onCollapse: (lines: number) => void };

  constructor({ field, listeners }: Config) {
    this.field = field;
    this.listeners = listeners;
  }

  public addFigure(placedFigure: PlacedFigure) {
    const { figure, position, color } = placedFigure.getState();
    this.field.fillCoords(figure.getCoords(), position, color);
    this.render();
    this.collapse();
  }

  public clear() {
    this.field.clear();
  }

  public isFit(figure: PlacedFigure): boolean {
    const coords = figure.getCoords();
    const { position } = figure.getState();

    const { rows: figureRows, cols: figureCols } = coords.dimensions();
    const { rows: fieldRows, cols: fieldCols } = this.field.dimensions();

    for (let y = 0; y < figureRows; y++) {
      for (let x = 0; x < figureCols; x++) {
        const [nextX, nextY] = [position.x + x, position.y + y];

        if (nextX < 0 || (nextX > fieldCols - 1) || (nextY > fieldRows - 1)) {
          return false;
        }

        if (nextY < 0) {
          continue;
        }

        const currentValue = this.field.getState().get(nextY, nextX);
        if (coords.get(y, x) && currentValue) {
          return false;
        }
      }
    }

    return true;
  }

  private render() {
    this.field.render();
  }

  private collapse() {
    const state = this.field.getState();
    const { rows, cols } = state.dimensions();
    let lines = 0;

    for (let row = 0; row < rows; row++) {
      const isFilled = state.getRow(row).every((val) => !!val);

      if (isFilled) {
        lines++;

        // clear line
        for (let i = 0; i < cols; i++) {
          state.set(row, i, null);
        }

        this.shift(row);
      }
    }

    if (lines > 0) {
      this.render();
      this.listeners.onCollapse(lines);
    }
  }

  // todo optimize?
  private shift(row: number) {
    const state = this.field.getState();
    const { rows, cols } = state.dimensions();

    for (let r = row; r > 0; r--) {
      const currentRowValues = state.getRow(r);

      state.setRow(r, state.getRow(r - 1));
      state.setRow(r - 1, currentRowValues);
    }
  }
}