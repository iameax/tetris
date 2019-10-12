import Game from './Game';
import './style.css';


const gameRoot = document.querySelector('#game');
const game = new Game(gameRoot, { level: 2, score: 0 });
game.start();
