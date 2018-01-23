import 'pixi';
import 'p2';
import 'phaser';
import 'phaserIsometric';
import * as states from './states/index.js';

const width = window.innerWidth;
const height = window.innerHeight;

// const GAME = new Phaser.Game(800, 1000, Phaser.AUTO);
const GAME = new Phaser.Game(width, height, Phaser.CANVAS, 'test', null, false, true);

Object.keys(states).forEach(state => GAME.state.add(state, states[state]));
// GAME.state.add(Boot);

GAME.state.start('Boot');
