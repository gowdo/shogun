
const SIZE = 1024;

export class Boot extends Phaser.State {

  // preload() {
  //   this.game.stage.backgroundColor = '#000';
  //   this.load.image('loaderBg', 'img/loader-bg.png');
  //   this.load.image('loaderBar', 'img/loader-bar.png');
  // }

  // create() {
  //   this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  //   this.scale.pageAlignHorizontally = true;
  //   this.scale.pageAlignVertically = true;

  //   this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //   this.state.start('Preload');
  // }

  preload() {
    this.game.load.image('cactus1', 'img/tiles/obstacle1.png');
    this.game.load.image('cactus2', 'img/tiles/obstacle2.png');
    this.game.load.image('rock', 'img/tiles/obstacle3.png');

    this.game.load.image('gold', 'img/tiles/find1_gold.png');
    this.game.load.image('revolver', 'img/tiles/find2_revolver.png');
    this.game.load.image('badge', 'img/tiles/find3_badge.png');
    this.game.load.image('skull', 'img/tiles/find4_skull.png');

    this.game.load.image('exit', 'img/tiles/exit.png');
    this.game.load.image('tile', 'img/tiles/ground_tile.png');

    this.game.load.image('grass1', 'img/tiles/ground_tile_grass1.png');
    this.game.load.image('grass2', 'img/tiles/ground_tile_grass2.png');
    this.game.load.image('grass3', 'img/tiles/ground_tile_grass3.png');

    this.game.load.image('mine', 'img/cube_triple.png');
    this.game.load.image('hitBox', 'img/cube.png');
    // this.game.load.image('mine', 'img/tiles/mine.png');

    this.game.load.image('E', 'img/controls/E.png');
    this.game.load.image('N', 'img/controls/N.png');
    this.game.load.image('NE', 'img/controls/NE.png');
    this.game.load.image('NW', 'img/controls/NW.png');
    this.game.load.image('S', 'img/controls/S.png');
    this.game.load.image('SE', 'img/controls/SE.png');
    this.game.load.image('SW', 'img/controls/SW.png');
    this.game.load.image('W', 'img/controls/W.png');

    // this.game.load.spritesheet('characterAnim', 'img/tiles/characterAnim.png', 70, 74);
    this.game.load.spritesheet('characterAnim', 'img/tiles/walk_00000.png', 70, 144);
  }

  create() {
    this.game.time.advancedTiming = true;

    // Add the Isometric plug-in to Phaser
    this.game.plugins.add(new Phaser.Plugin.Isometric(this.game));

    // Set the world size
    this.game.world.setBounds(0, 0, SIZE * 2, SIZE);

    // Start the physical system
    this.game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);

    // set the middle of the world in the middle of the screen
    this.game.iso.anchor.setTo(0.5, 0);
    // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // this.scale.pageAlignHorizontally = true;
    // this.scale.pageAlignVertically = true;

    // this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.state.start('Play');
  }

}
