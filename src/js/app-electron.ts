import * as PIXI from '../../node_modules/phaser-ce/build/custom/pixi.js';
import * as p2 from '../../node_modules/phaser-ce/build/custom/p2.js';
(<any>window).window.PIXI = PIXI;
(<any>window).window.p2 = p2;
import * as Phaser from 'phaser-ce';
(<any>window).window.Phaser = Phaser;
import Config from './config';
import './lib/phaser-plugin-isometric.min.js';
import * as states from './states';


class SimpleGame {
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game(Config.width, Config.height, Phaser.AUTO, "content", this);

    Object.keys(states).forEach(state => this.game.state.add(state, states[state]));
    // this.game.state.add(Boot);

    this.game.state.start('Boot');
  }
}

window.onload = () => new SimpleGame();
