import { Angle, Direction } from './constants';
import { Shape, Color } from './types';
import Matrix from './Matrix';


type State = {
  color: Color;
  position: { x: number; y: number };
  shape: Shape;
}

export default class Figure {
  public position;
  public shape: Shape;
  public color;

  constructor({ position, shape, color }: State) {
    this.position = position;
    this.shape = shape;
    this.color = color;
  }

  public move(direction: Direction) {
    const newPosition = { ...this.position };

    switch (direction) {
      case Direction.DOWN: {
        newPosition.y++;
        break;
      }
      case Direction.LEFT: {
        newPosition.x--;
        break;
      }
      case Direction.RIGHT: {
        newPosition.x++;
        break;
      }
    }

    return new Figure({ ...this, position: newPosition });
  }

  // todo can't rotate close to walls
  public rotate(angle: Angle = Angle.D_90) {
    const currentCols = this.shape.cols;
    const newShape = this.rotateShape(angle);
    const newCols = newShape.cols;

    const delta = (currentCols - newCols) / 2;
    const newPosition = { ...this.position };
    newPosition.x += delta > 0 ? Math.ceil(delta) : Math.floor(delta);

    return new Figure({ ...this, position: newPosition, shape: newShape });
  }

  public rotateShape(angle: Angle = Angle.D_90): Shape {
    const rotateTimes = ((angle + 360) % 360) / 90;
    let result = this.shape;

    for (let i = 0; i < rotateTimes; i++) {
      result = this._rotateShape(result);
    }

    return result;
  }

  private _rotateShape(shape): Shape {
    const { rows, cols } = shape.dimensions;

    const newShape: Matrix<number> = Matrix.create({ rows: cols, cols: rows });

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const newY = x;
        const newX = rows - y - 1;

        newShape.set(newY, newX, this.shape.get(y, x));
      }
    }

    return newShape;
  }
}