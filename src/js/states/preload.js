const SIZE = 1024;

export class Preload extends Phaser.State {

  preload() {

    this.game.load.image('cactus1', 'images/tiles/obstacle1.png');
    this.game.load.image('cactus2', 'images/tiles/obstacle2.png');
    this.game.load.image('rock', 'images/tiles/obstacle3.png');

    this.game.load.image('gold', 'images/tiles/find1_gold.png');
    this.game.load.image('revolver', 'images/tiles/find2_revolver.png');
    this.game.load.image('badge', 'images/tiles/find3_badge.png');
    this.game.load.image('skull', 'images/tiles/find4_skull.png');

    this.game.load.image('exit', 'images/tiles/exit.png');
    this.game.load.image('tile', 'images/tiles/ground_tile.png');

    this.game.load.image('grass1', 'images/tiles/ground_tile_grass1.png');
    this.game.load.image('grass2', 'images/tiles/ground_tile_grass2.png');
    this.game.load.image('grass3', 'images/tiles/ground_tile_grass3.png');

    this.game.load.image('mine', 'images/cube_triple.png');
    // this.game.load.image('mine', 'images/tiles/mine.png');

    this.game.load.image('E', 'images/controls/E.png');
    this.game.load.image('N', 'images/controls/N.png');
    this.game.load.image('NE', 'images/controls/NE.png');
    this.game.load.image('NW', 'images/controls/NW.png');
    this.game.load.image('S', 'images/controls/S.png');
    this.game.load.image('SE', 'images/controls/SE.png');
    this.game.load.image('SW', 'images/controls/SW.png');
    this.game.load.image('W', 'images/controls/W.png');

    this.game.load.spritesheet('characterAnim', 'images/tiles/characterAnim.png', 70, 74);

    this.game.time.advancedTiming = true;

    // Add the Isometric plug-in to Phaser
    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));

    // Set the world size
    this.game.world.setBounds(0, 0, SIZE * 2, SIZE);

    // Start the physical system
    this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

    // set the middle of the world in the middle of the screen
    this.game.iso.anchor.setTo(0.5, 0);

  }

  create() {
    // this.state.start('Menu');
  }

}
