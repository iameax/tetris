import Matrix from './Matrix'
import Figure from './Figure';
import {Field, IField} from './Field';
import {Angle, Color, Direction} from './constants';
import PlacedFigure from './PlacedFigure';
import Stacks from './Stacks';
import {randomColor} from "./utils";


type Config = {
  speed: number,
  field: Field,
  stacks: Stacks,
  listeners: {
    onLand: () => void,
  }
}

export default class FigureController {
  private field: Field;
  private stacks: Stacks;

  private speed;
  private placedFigure: PlacedFigure;

  private listeners;

  private isRunning = false;
  private moveInterval;

  constructor({
    speed = 1,
    field,
    stacks,
    listeners,
  }: Config) {
    this.speed = speed;
    this.field = field;
    this.stacks = stacks;
    this.listeners = listeners;
  }

  public addFigure(figure: Figure) {
    this.placedFigure = this.createBoardFigure(figure);

    if (this.stacks.isFit(this.placedFigure)) {
      this.render(this.placedFigure);
      this.start();
      return true;
    }

    return false;
  }

  // MOVES
  public drop() {
    let isMoved;

    do {
      isMoved = this.tryMove(Direction.DOWN);
    } while (isMoved);
  }

  public tryMove(direction: Direction): boolean {
    const nextFigure = this.placedFigure.move(direction);

    if (this.stacks.isFit(nextFigure)) {
      this.render(nextFigure);
      this.placedFigure = nextFigure;
      return true;
    }

    return false;
  }

  public tryRotate() {
    const nextFigure = this.placedFigure.rotate(Angle.D_90);

    if (this.stacks.isFit(nextFigure)) {
      this.render(nextFigure);
      return true;
    }

    return false;
  }

  //
  public togglePause() {
    if (this.isRunning) {
      this.stop();
    } else if (this.placedFigure) {
      this.start();
    }
  }

  public clear() {
    this.field.clear();
    this.stop();
    this.placedFigure = null;
  }

  // PRIVATE
  private start() {
    this.moveInterval = setInterval(() => {
      if (!this.tryMove(Direction.DOWN)) {
        this.stop();
        this.land();
      }
    }, 500 / Math.sqrt(this.speed));

    this.isRunning = true;
  }

  private stop() {
    clearInterval(this.moveInterval);
    this.moveInterval = null;
    this.isRunning = false;
  }

  private render(placedFigure: PlacedFigure) {
    const [currentBoardFigure, nextBoardFigure] = [this.placedFigure, placedFigure];

    if (currentBoardFigure) {
      const { figure, position } = currentBoardFigure.getState();
      this.field.clearCoords(figure.getCoords(), position);
    }

    if (nextBoardFigure) {
      const { figure, position, color } = nextBoardFigure.getState();
      this.field.fillCoords(figure.getCoords(), position, color);
    }

    this.field.render();

    // ? shouldn't be here
    this.placedFigure = placedFigure;
  }

  private land() {
    this.stacks.addFigure(this.placedFigure);
    this.clear();
    this.listeners.onLand();
  }

  // UTILS
  private createBoardFigure(figure: Figure): PlacedFigure {
    const { rows: figureRows, cols: figureCols } = figure.getCoords().dimensions();
    const { cols: fieldCols } = this.field.dimensions();

    const offsetX = Math.floor(fieldCols / 2) - Math.floor(figureCols / 2);
    const offsetY = -figureRows + 1;

    return new PlacedFigure({ figure, position: {x: offsetX, y: offsetY}, color: randomColor() });
  }
}