import React, { RefObject } from 'react';
import { Angle, Control, Direction, FIGURE_COLORS, Sound } from '../common/constants';
import Figure from '../common/Figure';
import Stacks from './Stacks';
import { Shape } from '../common/types';
import { arrayRandom } from '../common/utils';
import Background from './Background';
import CanvasGrid from '../CanvasGrid/CanvasGrid';
import Matrix from '../common/Matrix';


interface Props {
  nextShape: Shape;
  level: number;
  onShapeChange: () => void;
  onCollapse: (lines: number) => void;
  onGameOver: () => void;
  addHandlers: (handlers: {}) => void;
  playSound: (sound: Sound) => void;
  pause?: boolean;
}

interface State {
  figure: Figure;
  stacks: Stacks;
}

const DIMENSIONS = { rows: 20, cols: 10 };

export default class Playground extends React.PureComponent<Props, State> {
  private figure: Figure;
  private stacks: Matrix<number>;

  private isRunning = false;
  private rafId;

  private gridRef: RefObject<CanvasGrid>;

  constructor(props: Props) {
    super(props);

    this.stacks = Matrix.create(DIMENSIONS);
    this.figure = Playground.createFigure(props.nextShape);
    this.gridRef = React.createRef();

    this.props.addHandlers({
      [Control.ACTION]: () => {
        if (this.isRunning) {
          this.tryRotate();
        }
      },
      [Control.ARROW_LEFT]: () => {
        if (this.isRunning) {
          this.tryMove(Direction.LEFT);
        }
      },
      [Control.ARROW_RIGHT]: () => {
        if (this.isRunning) {
          this.tryMove(Direction.RIGHT);
        }
      },
      [Control.ARROW_DOWN]: () => {
        if (this.isRunning) {
          this.drop();
        }
      },
    });
  }

  componentDidMount(): void {
    this.start();
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (prevProps.pause !== this.props.pause) {
      if (this.props.pause) {
        this.stop();
      } else if (this.figure) {
        this.start();
      }
    }
  }

  componentWillUnmount(): void {
    this.stop();
  }

  private setFigure(figure) {
    this.figure = figure;
  }

  private setStacks(stacks) {
    this.stacks = stacks;
  }

  private start() {
    let lastTime = 0;

    const render = (time = 0) => {
      if (!this.isRunning) {
        return;
      }

      if (time - lastTime > 1000 / this.props.level) {
        const succeed = this.tryMove(Direction.DOWN);

        if (!succeed) {
          this.land();
        }
        lastTime = time;
      }

      this.paintGrid();
      this.rafId = requestAnimationFrame(render);
    };

    this.isRunning = true;
    requestAnimationFrame(render);
  }

  private stop() {
    cancelAnimationFrame(this.rafId);
    this.isRunning = false;
  }

  private paintGrid() {
    this.gridRef.current.clear();
    this.gridRef.current.paint(this.stacks);
    this.gridRef.current.paint(this.figure.shape, this.figure.position);
  }

  // ACTIONS
  public drop() {
    while (this.tryMove(Direction.DOWN)) {}
    this.land();
    this.props.playSound(Sound.LAND);
  }

  public tryMove(direction: Direction): boolean {
    const nextFigure = this.figure.move(direction);

    if (this.isFit(this.stacks, nextFigure)) {
      this.setFigure(nextFigure);
      return true;
    }

    return false;
  }

  public tryRotate() {
    const nextFigure = this.figure.rotate(Angle.D_90);

    if (this.isFit(this.stacks, nextFigure)) {
      this.setFigure(nextFigure);
      this.props.playSound(Sound.ROTATE);
      return true;
    }

    return false;
  }

  private land() {
    const { stacks, figure } = this;

    let newStacks = this.addFigure(stacks, figure);
    this.setStacks(newStacks);

    newStacks = this.collapse(newStacks);

    const newFigure = Playground.createFigure(this.props.nextShape);
    if (!this.isFit(newStacks, newFigure)) {
      return this.gameOver();
    }

    this.setFigure(newFigure);
    this.props.onShapeChange();
  }

  private gameOver() {
    this.props.playSound(Sound.GAMEOVER);
    this.stop();
    this.props.onGameOver();
  }

  public addFigure(stacks, figure: Figure) {
    const newStacks = stacks.clone();

    const { shape, position, color } = figure;

    for (let y = 0; y < shape.rows; y++) {
      for (let x = 0; x < shape.cols; x++) {
        if (shape.get(y, x)) {
          newStacks.set(position.y + y, position.x + x, color);
        }
      }
    }

    return newStacks;
  }

  // todo refactor
  public collapse(stacks) {
    const { rows, cols } = stacks.dimensions;
    const newStacks = stacks.clone();

    let lines = 0;

    const isFilled = values => values.every((val) => !!val);
    const emptyRow = () => Array(cols).fill(null);

    for (let row = 0; row < rows; row++) {
      const values = stacks.getRow(row);

      if (isFilled(values)) {
        lines++;

        this.collapseRow(stacks, row);
        newStacks.deleteRow(row);
        newStacks.addRow(emptyRow());
      }
    }

    if (lines > 0) {
      this.props.onCollapse(lines);
    }

    return newStacks;
  }

  // todo refactor
  collapseRow(stacks, row) {
    const values = stacks.getRow(row);
    const emptyRow = values.map(() => null);

    stacks.setRow(row, emptyRow);
    this.setStacks(stacks);

    setTimeout(() => {
      stacks.setRow(row, values);
      this.setStacks(stacks);
    }, 100);
    setTimeout(() => {
      stacks.setRow(row, emptyRow);
      this.setStacks(stacks);
    }, 200);
    setTimeout(() => {
      stacks.deleteRow(row);
      stacks.addRow(emptyRow);
      this.setStacks(stacks);
    }, 300);
  }

  // UTILS
  static createFigure(shape: Shape): Figure {
    const { cols: fieldCols } = DIMENSIONS;

    const offsetX = Math.floor(fieldCols / 2) - Math.floor(shape.cols / 2);
    const offsetY = -shape.rows + 1;
    const randomColor = arrayRandom(FIGURE_COLORS);

    return new Figure({ shape, position: { x: offsetX, y: offsetY }, color: randomColor });
  }

  public isFit(stacks, figure: Figure): boolean {
    const { shape, position } = figure;

    const { rows: fieldRows, cols: fieldCols } = stacks.dimensions;

    for (let y = 0; y < shape.rows; y++) {
      for (let x = 0; x < shape.cols; x++) {
        const [nextX, nextY] = [position.x + x, position.y + y];

        if (nextX < 0 || (nextX > fieldCols - 1) || (nextY > fieldRows - 1)) {
          return false;
        }

        if (nextY < 0) {
          continue;
        }

        const currentValue = stacks.get(nextY, nextX);
        if (shape.get(y, x) && currentValue) {
          return false;
        }
      }
    }

    return true;
  }

  public render() {
    return (
      <div id="playground">
        <Background
          scale={22}
          dimensions={DIMENSIONS}
        />
        <CanvasGrid
          ref={this.gridRef}
          className={'board'}
          scale={22}
          dimensions={DIMENSIONS}
        />
      </div>
    );
  }
}