import * as states from './states/index.js';
// import 'p2';
// import 'pixi.js';
// global.PIXI = require('pixi.js');
// global.p2 = require('p2');
// global.Phaser = require('phaser');
// import 'phaser';
// require('./phaser-plugin-isometric.min');
// import 'phaser';
// import 'phaser-plugin-isometric';
// const Preload = require('./states');
// const Boot = require('./states/boot').Boot;

const width = window.innerWidth;
const height = window.innerHeight;

// const GAME = new Phaser.Game(800, 1000, Phaser.AUTO);
const GAME = new Phaser.Game(width, height, Phaser.CANVAS, 'test', null, false, true);

Object.keys(states).forEach(state => GAME.state.add(state, states[state]));
// GAME.state.add(Boot);

GAME.state.start('Boot');
const gg = function(){};

export {gg};
