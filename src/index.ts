import Game from './Game';
import './style.css';


const gameRoot = document.querySelector('#game');
const game = new Game(gameRoot, { cols: 10, rows: 17}, { level: 5 });
