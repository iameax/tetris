import FigureController from './FigureController';
import Figure, {FigureGenerator} from './Figure';
import {Field} from './Field';
import FigureBox from './FigureBox';
import InfoPanel from './InfoPanel';
import {ColorEnum, Dimensions, Direction, KeyCode, Sound, SOUND_SOURCES} from './constants';
import Stacks from './Stacks';
import {createBGCanvas, figureCanvas, nextFigureCanvas, stacksCanvas} from "./canvasHelpers";


export type GameState = {
  level?: number,
  score?: number,
}

export default class Game {
  private el: Element;
  private state: GameState;
  private dimensions: Dimensions;

  private board: FigureController;
  private stacks: Stacks;
  private infoPanel: InfoPanel;

  private audios;

  private keyListeners = {
    [KeyCode.ENTER]: () => this.start(),
    [KeyCode.ESC]: () => this.end(),
    [KeyCode.SPACE]: () => {
      if (this.board.tryRotate()) {
        this.playSound(Sound.ROTATE);
      }
    },
    [KeyCode.ARROW_LEFT]: () => this.board.tryMove(Direction.LEFT),
    [KeyCode.ARROW_RIGHT]: () => this.board.tryMove(Direction.RIGHT),
    [KeyCode.ARROW_DOWN]: () => {
      this.board.drop();
      this.playSound(Sound.DROP);
    },
    [KeyCode.P]: () => this.board.togglePause(),
  };

  private nextFigure: Figure;

  constructor(el: Element, dimensions: Dimensions, state: GameState = {level: 5, score: 0}) {
    this.el = el;
    this.state = state;
    this.dimensions = dimensions;

    this.audios = new Map();
    for (const srcKey in SOUND_SOURCES) {
      const src = SOUND_SOURCES[srcKey];
      this.audios.set(srcKey, new Audio(src));
    }

    createBGCanvas(this.el, this.dimensions);

    this.stacks = new Stacks({
      field: new Field(stacksCanvas(this.el, this.dimensions), dimensions),
      listeners: {
        onCollapse: (lines: number) => {
          this.infoPanel.updateState(({score}) => ({score: Math.floor(score + (lines ** 2 * 10) * Math.sqrt(this.state.level))}));
          this.playSound(Sound.COLLAPSE);
        },
      }
    });

    this.board = new FigureController({
      field: new Field(figureCanvas(this.el, this.dimensions), dimensions),
      stacks: this.stacks,
      speed: this.state.level,
      listeners: {
        onLand: () => this.next(),
      }
    });

    this.infoPanel = new InfoPanel(el.querySelector('#info'), new Field(nextFigureCanvas(this.el, this.dimensions), {
      rows: 5,
      cols: 5
    }), {
      level: this.state.level,
      score: 0,
      nextFigure: null,
    });

    this.addEventListeners();

    this.start();
  }

  start() {
    this.nextFigure = FigureGenerator.next();
    this.next();
  }

  end() {
    this.board.clear();
    this.stacks.clear();
  }

  private next(): void {
    const success = this.board.addFigure(this.nextFigure);

    if (!success) {
      this.playSound(Sound.GAMEOVER);
    } else {
      this.nextFigure = FigureGenerator.next();
      this.infoPanel.updateState(() => ({nextFigure: this.nextFigure}));
    }
  }

  private addEventListeners() {
    document.addEventListener('keydown', (e: any) => this.onKeyDown(e.keyCode));
    // this.el.querySelector('#start-btn').addEventListener('click', () => this.start());
  }

  private onKeyDown(keyCode) {
    const listener = this.keyListeners[keyCode];

    if (listener) {
      listener();
    }
  }

  private playSound(sound: Sound) {
    const audio = this.audios.get(sound);
    audio.currentTime = 0;
    audio.play();
  }
}