import Figure from './Figure';


export default class FigureBox {
  private el;
  private figure;

  constructor(el) {
    this.el = el;
  }

  setFigure(figure: Figure) {
    this.figure = figure;
    this.render();
  }

  private render() {

  }
}