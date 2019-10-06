import Figure from './Figure';
import {Angle, color, ColorEnum, Direction} from './constants';


type State = {
  color: color,
  position: { x: number, y: number },
  figure: Figure,
}

export default class PlacedFigure {
  private state: State;

  constructor(state: State) {
    this.state = { ...state };
  }

  public move(direction: Direction) {
    const { position } = this.state;
    let newPosition = { ...position };

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

    return new PlacedFigure({ ...this.state, position: newPosition });
  }

  // todo can't rotate close to walls
  public rotate(angle: Angle = Angle.D_90) {
    const newFigure = this.state.figure.clone();

    const { cols: currentCols } = newFigure.getCoords().dimensions();
    newFigure.rotate(angle);
    const { cols: newCols } = newFigure.getCoords().dimensions();

    const delta = (currentCols - newCols) / 2;
    const newPosition = { ...this.state.position };
    newPosition.x += delta > 0 ? Math.ceil(delta) : Math.floor(delta);

    return new PlacedFigure({ ...this.state, position: newPosition, figure: newFigure });
  }

  public getState() {
    return this.state;
  }

  public getCoords() {
    return this.state.figure.getCoords();
  }
}