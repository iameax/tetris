import Matrix from './Matrix';
import {Angle, Color} from './constants'


const SHAPES: Matrix<number>[] = [
  new Matrix([
    [1, 1],
    [1, 1],
  ]),
  new Matrix([
    [1],
    [1],
    [1],
    [1],
  ]),
  new Matrix([
    [1, 1, 0],
    [0, 1, 1],
  ]),
  new Matrix([
    [0, 1, 1],
    [1, 1, 0],
  ]),
  new Matrix([
    [0, 1, 0],
    [1, 1, 1],
  ]),
  new Matrix([
    [1, 0],
    [1, 0],
    [1, 1],
  ]),
  new Matrix([
    [0, 1],
    [0, 1],
    [1, 1],
  ]),
];

class Figure {
  private coords: Matrix<number>;

  constructor(coords: Matrix<number>, angle: Angle = Angle.D_0) {
    this.coords = coords;

    if (angle !== Angle.D_0) {
      this.rotate(angle);
    }
  }
  
  public rotate(angle: Angle = Angle.D_90) {
    const rotateTimes = ((angle + 360) % 360) / 90;
    for (let i = 0; i < rotateTimes; i++) {
      this._rotate();
    }
  }
  
  public getCoords() {
    return this.coords;
  }

  public clone() {
    return new Figure(this.coords.clone())
  }

  private _rotate() {
    const { rows, cols } = this.coords.dimensions();

    const newCoords = Matrix.create({ rows: cols, cols: rows });

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const newY = x;
        const newX = rows - y - 1;

        newCoords.set(newY, newX, this.coords.get(y, x));
      }
    }

    this.coords = newCoords;
  }
}

class FigureGenerator {
  static next() {
    const index = Math.floor(Math.random() * SHAPES.length);
    const figure = new Figure(SHAPES[index], Angle.D_0);
    
    return figure;
  }
}

export default Figure;
export { FigureGenerator };
