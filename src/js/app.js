import * as states from './states/index.js';
import Config from './config.js';

const width = Config.width;
const height = Config.height;

const GAME = new Phaser.Game(width, height, Phaser.CANVAS, 'content', null, false, true);

Object.keys(states).forEach(state => GAME.state.add(state, states[state]));
// GAME.state.add(Boot);

GAME.state.start('Boot');
