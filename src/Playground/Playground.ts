import { Angle, AudioType, Direction, KeyCode } from '../constants';
import Figure from '../Figure';
import Stacks from './Stacks';
import { Dimensions, Shape } from '../types';
import { playAudio, randomColor } from '../utils';
import CanvasBoard from '../CanvasBoard';
import { createBGCanvas } from '../canvasHelpers';


class PlaygroundView {
  private board: CanvasBoard;
  private rafId = null;

  constructor(el, dimensions, handlers) {
    createBGCanvas(el.querySelector('canvas.bg'), dimensions);
    this.board = new CanvasBoard(el.querySelector('canvas.board'), 35, dimensions);

    this.addEventListeners({
      [KeyCode.SPACE]: () => handlers.onRotate(),
      [KeyCode.ARROW_LEFT]: () => handlers.onMoveLeft(),
      [KeyCode.ARROW_RIGHT]: () => handlers.onMoveRight(),
      [KeyCode.ARROW_DOWN]: () => handlers.onDrop(),
      [KeyCode.P]: () => handlers.onPause(),
    });
  }

  public render(stacks: Stacks, figure: Figure) {
    this.clear();
    this.board.render(stacks.data);
    this.board.fillMatrix(figure.shape, figure.color, figure.position);
  }

  public clear() {
    this.board.clear();
  }

  private addEventListeners(keyListeners) {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      const listener = keyListeners[e.code];
      if (listener) {
        listener();
      }
    });
  }
}

export default class Playground {
  private DROP_INTERVAL = 1000;

  private stacks: Stacks;
  private figure: Figure;

  private dimensions: Dimensions;
  private speed;

  private listeners;

  private isRunning = false;
  private rafId;

  private view: PlaygroundView;

  constructor(el, {
    speed = 1,
    dimensions,
    listeners,
  }) {
    this.speed = speed;
    this.dimensions = dimensions;
    this.listeners = listeners;

    this.view = new PlaygroundView(el, dimensions, {
      onRotate: () => this.tryRotate(),
      onMoveLeft: () => this.tryMove(Direction.LEFT),
      onMoveRight: () => this.tryMove(Direction.RIGHT),
      onDrop: () => {
        while(this.tryMove(Direction.DOWN)) {}
      },
      onPause: () => this.togglePause(),
    });

    this.stacks = new Stacks(dimensions);
  }

  public addShape(shape: Shape) {
    const figure = this.createFigure(shape);

    if (this.stacks.isFit(figure)) {
      this.figure = figure;

      if (!this.isRunning) {
        this.start();
      }

      return true;
    }

    this.stop();
    return false;
  }

  public setSpeed(speed: number) {
    this.speed = speed;
  }

  private start() {
    let lastTime = 0;

    const render = (time = 0) => {
      if (!this.isRunning) {
        return;
      }

      if (time - lastTime > 1000 / this.speed) {
        const succeed = this.tryMove(Direction.DOWN);

        if (!succeed) {
          this.land();
        }
        lastTime = time;
      }

      this.view.render(this.stacks, this.figure);
      this.rafId = requestAnimationFrame(render);
    };

    this.isRunning = true;
    render();
  }

  private stop() {
    cancelAnimationFrame(this.rafId);
    this.isRunning = false;
  }

  // MOVES
  /*public drop() {
    let isMoved;

    do {
      isMoved = this.tryMove(Direction.DOWN);
    } while (isMoved);
  }*/

  public tryMove(direction: Direction): boolean {
    const nextFigure = this.figure.move(direction);

    if (this.stacks.isFit(nextFigure)) {
      this.figure = nextFigure;
      return true;
    }

    return false;
  }

  public tryRotate() {
    const nextFigure = this.figure.rotate(Angle.D_90);

    if (this.stacks.isFit(nextFigure)) {
      this.figure = nextFigure;
      playAudio(AudioType.ROTATE);
      return true;
    }

    return false;
  }

  //
  public togglePause() {
    if (this.isRunning) {
      this.stop();
    } else if (this.figure) {
      this.start();
    }
  }

  public clear() {
    this.view.clear();
    this.stop();
    this.figure = null;
  }

  private land() {
    this.stacks.addFigure(this.figure);
    const collapsedLines = this.stacks.collapse();

    this.listeners.onLand();

    if (collapsedLines > 0) {
      this.listeners.onCollapse(collapsedLines);
    }
  }

  // UTILS
  private createFigure(shape: Shape): Figure {
    const { cols: fieldCols } = this.dimensions;

    const offsetX = Math.floor(fieldCols / 2) - Math.floor(shape.cols / 2);
    const offsetY = -shape.rows + 1;

    return new Figure({ shape, position: { x: offsetX, y: offsetY }, color: randomColor() });
  }
}