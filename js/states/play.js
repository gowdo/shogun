import { Controller } from '../controls/controls.js';
const width = window.innerWidth;
// const height = window.innerHeight;

let obstacleGroup;
let player;
let marker, marker2, marker3, marker4, itemGroup;
let floorGroup;
let exitMarker;
let hitBox;

let grassGroup;

let itemsTxt, endTxt;
let txt = '';
let finalTxt = '';

let currentItemCount = 0; // starting number of collected items
const totalItemCount = 4; // total number of items to be collected

let check;
const SIZE = 1024;

let controller;

export class Play extends Phaser.State {

  create() {

    // set the Background color of our game
    this.game.stage.backgroundColor = '0xde6712';

    // create groups for different tiles
    floorGroup = this.game.add.group();
    itemGroup = this.game.add.group();
    grassGroup = this.game.add.group();
    obstacleGroup = this.game.add.group();

    // set the gravity in our game
    this.game.physics.isoArcade.gravity.setTo(0, 0, -500);

    // create the floor tiles
    let floorTile;
    for (let xt = SIZE; xt > 0; xt -= 35) {
      for (let yt = SIZE; yt > 0; yt -= 35) {
        floorTile = this.game.add.isoSprite(xt, yt, 0, 'tile', 0, floorGroup);
        floorTile.anchor.set(0.5);

      }
    }

    // create the grass tiles randomly
    let grassTile;
    for (let xt = SIZE; xt > 0; xt -= 35) {
      for (let yt = SIZE; yt > 0; yt -= 35) {

        const rnd = rndNum(20);

        if (rnd == 0) {
          grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass1', 0, grassGroup);
          grassTile.anchor.set(0.5);
        }
        else if (rnd == 1) {
          grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass2', 0, grassGroup);
          grassTile.anchor.set(0.5);
        }
        else if (rnd == 2) {
          grassTile = this.game.add.isoSprite(xt, yt, 0, 'grass3', 0, grassGroup);
          grassTile.anchor.set(0.5);
        }
      }
    }

    // create an immovable cactus tile and randomly choose one of two graphical cactus representations
    let cactus1;
    for (let xt = SIZE; xt > 0; xt -= 400) {
      for (let yt = SIZE; yt > 0; yt -= 400) {

        const rnd = rndNum(1);

        if (rnd == 0) {
          cactus1 = this.game.add.isoSprite(xt, yt, 0, 'cactus1', 0, obstacleGroup);
        }
        else {
          cactus1 = this.game.add.isoSprite(xt, yt, 0, 'cactus2', 0, obstacleGroup);
        }

        cactus1.anchor.set(0.5);

        // Let the physics engine do its job on this tile type
        this.game.physics.isoArcade.enable(cactus1);

        // This will prevent our physic bodies from going out of the screen
        cactus1.body.collideWorldBounds = true;

        // Make the cactus body immovable
        cactus1.body.immovable = true;
      }
    }


    let rock;
    for (let xt = SIZE; xt > 0; xt -= 400) {
      for (let yt = SIZE; yt > 0; yt -= 400) {

        rock = this.game.add.isoSprite(xt + 80, yt + 80, 0, 'rock', 0, obstacleGroup);
        rock.anchor.set(0.5);

        // Let the physics engine do its job on this tile type
        this.game.physics.isoArcade.enable(rock);

        // This will prevent our physic bodies from going out of the screen
        rock.body.collideWorldBounds = true;

        // set the physics bounce amount on each axis  (X, Y, Z)
        rock.body.bounce.set(0.2, 0.2, 0);

        // set the slow down rate on each axis (X, Y, Z)
        rock.body.drag.set(100, 100, 0);
      }
    }

    // create a mine object which will be our ending point in the game
    const mine = this.game.add.isoSprite(400, 400, 0, 'mine', 300, obstacleGroup);
    mine.anchor.set(0.5);

    this.game.physics.isoArcade.enable(mine);
    mine.body.collideWorldBounds = true;
    // mine.body.immovable = true;
    mine.body.setSize(105, 38, 38, -18, 14, 0);

    // create collectible items
    marker = this.game.add.isoSprite(rndNum(800), rndNum(800), 0, 'gold', 0, itemGroup);
    this.game.physics.isoArcade.enable(marker);
    marker.body.collideWorldBounds = true;
    marker.anchor.set(0.5);

    marker2 = this.game.add.isoSprite(rndNum(800), rndNum(800), 0, 'revolver', 0, itemGroup);
    this.game.physics.isoArcade.enable(marker2);
    marker2.body.collideWorldBounds = true;
    marker2.anchor.set(0.5);

    marker3 = this.game.add.isoSprite(rndNum(800), rndNum(800), 0, 'badge', 0, itemGroup);
    this.game.physics.isoArcade.enable(marker3);
    marker3.body.collideWorldBounds = true;
    marker3.anchor.set(0.5);

    marker4 = this.game.add.isoSprite(rndNum(800), rndNum(800), 0, 'skull', 0, itemGroup);
    this.game.physics.isoArcade.enable(marker4);
    marker4.body.collideWorldBounds = true;
    marker4.anchor.set(0.5);

    // create the exit marker next to the mine object
    exitMarker = this.game.add.isoSprite(830, 194, 0, 'exit', 0, itemGroup);
    this.game.physics.isoArcade.enable(exitMarker);
    exitMarker.body.collideWorldBounds = true;
    exitMarker.anchor.set(0.5);
    exitMarker.alpha = 0.5;


    // create the collected item text
    itemsTxt = this.game.add.text(100, 8, txt, {
      font: '16px Arial',
      fill: '#FFFFFF',
      align: 'center'
    });

    itemsTxt.fixedToCamera = true;

    // create the information text field about the status of the game
    endTxt = this.game.add.text(0, 8, finalTxt, {
      font: '18px Arial',
      fill: '#FFFF00',
      align: 'center'
    });

    endTxt.fixedToCamera = true;
    endTxt.anchor.x = Math.round(endTxt.width * 0.5) / endTxt.width;
    endTxt.cameraOffset.x = (width / 3) * 2;

    // update both text fields
    updateText();
    updateEndText();

    // Create the player
    player = this.game.add.isoSprite(350, 280, 0, 'characterAnim', 0, obstacleGroup);

    player.animations.add('S', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    player.animations.add('SW', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    player.animations.add('W', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
    player.animations.add('NW', [24, 25, 26, 27, 28, 29, 30, 31], 10, true);
    player.animations.add('N', [32, 33, 34, 35, 36, 37, 38, 39], 10, true);
    player.animations.add('NE', [40, 41, 42, 43, 44, 45, 46, 47], 10, true);
    player.animations.add('E', [48, 49, 50, 51, 52, 53, 54, 55], 10, true);
    player.animations.add('SE', [56, 57, 58, 59, 60, 61, 62, 63], 10, true);

    player.alpha = 0.6;
    player.anchor.set(0.5);

    const hitBox = this.game.add.graphics(0, 0);
    // hitBox.anchor.set(0.5);
    // hitBox.beginFill(0xFF3300);
    // hitBox.lineStyle(0, 0xffd900, 1);
    // hitBox.moveTo(...convertIsoArray(0, 0));
    // hitBox.lineTo(...convertIsoArray(50, 0));
    // hitBox.lineTo(...convertIsoArray(50, 50));
    // hitBox.lineTo(...convertIsoArray(0, 50));
    // hitBox.lineTo(...convertIsoArray(0, 0));
    // hitBox.endFill();
    hitBox.beginFill(0x0000FF, 1);
    hitBox.drawCircle(0, 0, 10);

    const viewBox = this.game.add.graphics(0, 0);
    viewBox.anchor.set(0.5);
    viewBox.beginFill(0xFFFFFF);
    viewBox.lineStyle(0, 0xffd900, 1);
    // viewBox.moveTo(...convertIsoArray(0, 0));
    // viewBox.lineTo(...convertIsoArray(200, -40));
    // viewBox.lineTo(...convertIsoArray(200, 40));
    // viewBox.lineTo(...convertIsoArray(0, 0));
    viewBox.moveTo(0, 0);
    viewBox.lineTo(100, -600);
    viewBox.lineTo(-100, -600);
    viewBox.lineTo(0, 0);
    viewBox.alpha = 0;

    viewBox.endFill();

    const targetBox = this.game.add.graphics(0, 0);
    // targetBox.anchor.set(0.5);
    // targetBox.beginFill(0xFFFFFF);
    // targetBox.lineStyle(0, 0xffd900, 1);
    // targetBox.moveTo(...convertIsoArray(0, 0));
    // targetBox.lineTo(...convertIsoArray(10, 0));
    // targetBox.lineTo(...convertIsoArray(10, 10));
    // targetBox.lineTo(...convertIsoArray(0, 10));
    // targetBox.lineTo(...convertIsoArray(0, 0));
    // targetBox.endFill();
    targetBox.beginFill(0xFFFFFF, 1);
    targetBox.drawCircle(0, 0, 10);

    // this.game.physics.isoArcade.enable(hitBox);
    // hitBox.body.collideWorldBounds = true;
    // hitBox.anchor.set(0.5);
    // hitBox.body.immovable = true;

    controller = new Controller(this.game, player, hitBox, viewBox, targetBox);

    // enable physics on the player
    this.game.physics.isoArcade.enable(player);
    player.body.collideWorldBounds = true;

    this.game.camera.follow(player);
  }

  update() {
    controller.update();

    this.game.physics.isoArcade.collide(obstacleGroup);

    this.game.physics.isoArcade.overlap(marker, hitBox, (e) => {
      e.destroy();
      addItem();
    });

    // this.game.physics.isoArcade.overlap(marker2, player, (e) => {
    //   e.destroy();
    //   addItem();
    // });

    // this.game.physics.isoArcade.overlap(marker3, player, (e) => {
    //   e.destroy();
    //   addItem();
    // });

    // this.game.physics.isoArcade.overlap(marker4, player, (e) => {
    //   e.destroy();
    //   addItem();
    // });

    // check = this.game.physics.isoArcade.overlap(exitMarker, player, () => {
    //   if (currentItemCount >= totalItemCount) {
    //     updateEndText(2);
    //   }
    //   else {
    //     updateEndText(1);
    //   }
    // });

    endTxt.visible = check;

    this.game.iso.topologicalSort(obstacleGroup, 2);
  }

  render() {
    // obstacleGroup.forEach((tile) => {
    //   this.game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false);
    // });
  }
}

// generate random number
function rndNum(num) {
  return Math.round(Math.random() * num);
}
// add the collected item
function addItem() {
  currentItemCount++;
  updateText();
}

// update the item text field
function updateText() {
  txt = 'ITEMS: ' + currentItemCount + '/' + totalItemCount;
  itemsTxt.setText(txt);
}

// update the end text field
function updateEndText(_t) {
  switch (_t) {
  case 0:
    finalTxt = '';
    break;

  case 1:
    finalTxt = 'YOU MUST FIND ALL THE ITEMS!!!';
    break;

  case 2:
    finalTxt = 'YOU FOUND ALL THE ITEMS!!! :)';
    break;
  }

  endTxt.setText(finalTxt);
}

function rotateXY(latitude, longitude) {
  // return { x: 180 - longitude, y: latitude + 90 };
  return { x: longitude, y: latitude};
}

function convertIso(x, y) {
  const m = Math.sin(Math.PI / 6);
  return {
    x: (x * m - y * m),
    y: (x + y)
  };
}

function convertIsoArray(x1, y1) {
  const { x, y } = convertIso(x1, y1);
  const r = rotateXY(x, y);
  return [r.x, r.y];
}
