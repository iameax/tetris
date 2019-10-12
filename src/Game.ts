import Playground from './Playground';
import InfoPanel from './InfoPanel';
import { KeyCode, AudioType } from './constants';
import { playAudio, randomShape } from './utils';
import Matrix from './Matrix';


export type GameState = {
  level: number;
  score: number;
}

export default class Game {
  private el: Element;
  private state: GameState;

  private playground: Playground;
  private infoPanel: InfoPanel;

  private POINTS_PER_LEVEL = 100;

  private keyListeners = {
    [KeyCode.ENTER]: () => this.start(),
    [KeyCode.ESC]: () => this.end(),
  };

  private nextShape: Matrix<number>;

  constructor(el: Element, state: GameState = { level: 1, score: 0 }) {
    this.el = el;
    this.state = state;

    this.playground = new Playground(el.querySelector('#playground'), {
      dimensions: { rows: 17, cols: 10 },
      speed: this.state.level,
      listeners: {
        onCollapse: (lines: number) => this.addPoints(lines),
        onLand: () => this.next(),
      }
    });

    this.infoPanel = new InfoPanel(el.querySelector('#info'), {
      level: this.state.level,
      score: 0,
      nextShape: null,
    });

    this.addEventListeners();
  }

  start() {
    this.nextShape = randomShape();
    this.next();
  }

  end() {
    this.playground.clear();
  }

  private next(): void {
    const success = this.playground.addShape(this.nextShape);

    if (!success) {
      playAudio(AudioType.GAMEOVER);
    } else {
      this.nextShape = randomShape();
      this.infoPanel.updateState(() => ({ nextShape: this.nextShape }));
    }
  }

  private addPoints(collapsedLines: number): void {
    if (collapsedLines <= 0) {
      return;
    }

    const points = collapsedLines ** 2 * 10 * Math.floor(Math.sqrt(this.state.level));
    this.state.score = this.state.score + points;
    const newLevel = Math.floor(this.state.score / this.POINTS_PER_LEVEL);

    if (newLevel > this.state.level) {
      this.state.level = newLevel;
    }

    this.playground.setSpeed(this.state.level);
    this.infoPanel.updateState(() => ({ level: this.state.level, score: this.state.score }));
  }

  private addEventListeners() {
    document.addEventListener('keydown', (e: any) => {
      const listener = this.keyListeners[e.keyCode];

      if (listener) {
        listener();
      }
    });
  }
}