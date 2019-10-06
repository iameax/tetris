import FigureBox from './FigureBox';
import Figure from './Figure';
import {IField} from "./Field";
import {ColorEnum} from "./constants";


export type InfoState = {
  level: number,
  score: number,
  nextFigure?: Figure,
}

export default class InfoPanel {
  private state: InfoState;
  private nextFigure: Figure;
  private field: IField;

  private el: Element;
  private levelEl: Element;
  private scoreEl: Element;

  constructor(el, field: IField, state: InfoState) {
    this.levelEl = el.querySelector('#level');
    this.scoreEl = el.querySelector('#score');
    this.state = state;
    this.field = field;

    this.render();
  }

  updateState(updater) {
    this.state = { ...this.state, ...updater(this.state) };
    this.render();
  }

  render() {
    const { level, score, nextFigure } = this.state;

    this.levelEl.innerHTML = String(level);
    this.scoreEl.innerHTML = String(score);

    if (nextFigure) {
      const { rows: figureRows, cols: figureCols } = nextFigure.getCoords().dimensions();
      const { cols: fieldCols } = this.field.dimensions();

      const offsetX = Math.floor(fieldCols / 2) - Math.floor(figureCols / 2);
      const offsetY = 0;

      this.field.clear();
      this.field.fillCoords(nextFigure.getCoords(), { x: offsetX, y: offsetY }, 'brown');
      this.field.render();
    }
  }
}