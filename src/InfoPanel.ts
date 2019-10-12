import Matrix from './Matrix';
import CanvasBoard from './CanvasBoard';
import { Shape } from './types';


export type InfoState = {
  level: number;
  score: number;
  nextShape?: Matrix<number>;
}

export default class InfoPanel {
  private state: InfoState;
  private nextShape: Shape;
  private board: CanvasBoard;

  private el: Element;
  private levelEl: Element;
  private scoreEl: Element;

  constructor(el, state: InfoState) {
    this.levelEl = el.querySelector('#level');
    this.scoreEl = el.querySelector('#score');
    this.state = state;
    
    this.board = new CanvasBoard(el.querySelector('canvas.next-shape'), {
      rows: 4,
      cols: 4
    });

    this.render();
  }

  updateState(updater) {
    this.state = { ...this.state, ...updater(this.state) };
    this.render();
  }

  render() {
    const { level, score, nextShape } = this.state;

    this.levelEl.innerHTML = String(level);
    this.scoreEl.innerHTML = String(score);

    if (nextShape) {
      const { rows: shapeRows, cols: shapeCols } = nextShape.dimensions;
      const { rows: boardRows, cols: boardCols } = this.board.dimensions;

      const offsetX = Math.ceil(boardCols / 2) - Math.ceil(shapeCols / 2);
      const offsetY = Math.ceil(boardRows / 2) - Math.ceil(shapeRows / 2);

      this.board.clear();
      this.board.fillMatrix(nextShape, 'brown', { x: offsetX, y: offsetY });
    }
  }
}