import Game from './Game';
import './style.scss';


const gameRoot = document.querySelector('#gamepad');
const game = new Game(gameRoot, { level: 2, score: 0 });
game.start();
