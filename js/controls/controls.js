export class Controller {
  constructor(game, player, hitBox, viewBox, targetBox) {
    this.game = game;
    this.player = player;
    this.hitBox = hitBox;
    this.targetBox = targetBox;
    this.viewBox = viewBox;
    this.boundsBoxA;
    this.boundsBoxB;
    this.targetObj = null;
    this.pad1 = this.game.input.gamepad.pad1;
    this.game.input.gamepad.start();
    this.game.input.gamepad.setDeadZones(0.05);
  }

  update() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    let Y_VALUE = 0;
    let X_VALUE = 0;

    if (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.01) {
      X_VALUE = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    } else if (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.01) {
      X_VALUE = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
    }

    if (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.01) {
      Y_VALUE = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    } else if (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.01) {
      Y_VALUE = this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
    }


    const SPEED = 170;
    const HIT_RADIUS = 50;
    const TARGET_RADIUS = 100;

    // move player
    const newPoints = rotate(0, 0, X_VALUE, Y_VALUE, 45);
    this.player.body.velocity.x = newPoints[0] * SPEED;
    this.player.body.velocity.y = newPoints[1] * SPEED;

    const aimLock = this.pad1.isDown(Phaser.Gamepad.XBOX360_LEFT_BUMPER);
    const stickUsed = (X_VALUE !== 0 || Y_VALUE !== 0);

    let X = X_VALUE;
    let Y = Y_VALUE;

    if (aimLock) {
      X = -(this.player.position.x - this.targetBox.x);
      Y = -(this.player.position.y - this.targetBox.y);
    }

    const angle = getAngleDeg(X, -Y);

    if (angle < 30 || angle > 330) {
      this.player.animations.play('N');
    }
    else if (angle < 60) {
      this.player.animations.play('NE');
    }
    else if (angle < 120) {
      this.player.animations.play('E');
    }
    else if (angle < 150) {
      this.player.animations.play('SE');
    }
    else if (angle < 210) {
      this.player.animations.play('S');
    }
    else if (angle < 240) {
      this.player.animations.play('SW');
    }
    else if (angle < 300) {
      this.player.animations.play('W');
    }
    else if (angle < 330) {
      this.player.animations.play('NW');
    }
    else {
      this.player.animations.stop();
    }

    if (stickUsed) {

      const HYP = Math.sqrt((X * X) + (Y * Y));
      const hitScaler = HIT_RADIUS / HYP;
      this.hitBox.x = this.player.position.x + hitScaler * X;
      this.hitBox.y = this.player.position.y + hitScaler * Y;

      if (aimLock === false) {
        // if no aim lock, move the targetBox
        const targetScaler = TARGET_RADIUS / HYP;
        this.targetBox.x = this.player.position.x + targetScaler * X;
        this.targetBox.y = this.player.position.y + targetScaler * Y;
      }
    }

    if (aimLock && this.targetObj !== null) {
      this.targetBox.x = this.targetObj.position.x;
      this.targetBox.y = this.targetObj.position.y;
    }

    this.drawTargetBoundsBoxes();

    if (this.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
      this.hitBox.visible = true;
      this.drawHitBoundsBoxes();
    } else {
      this.hitBox.visible = false;
    }
  }

  drawTargetBoundsBoxes() {
    this.targetObj = null;
    const offsetYA = this.hitBox.height / 2;
    const boundsA = {
      x: this.targetBox.x - offsetYA,
      y: this.targetBox.y - offsetYA,
      height: this.targetBox.height,
      width: this.targetBox.width,
      right: this.targetBox.x + this.targetBox.width - offsetYA,
      bottom: this.targetBox.y + this.targetBox.height - offsetYA
    };

    this.game.world.children[3].children.forEach((obj) => {
      if (obj.key !== 'characterAnim') {
        const offsetXB = obj.width / 2;
        const offsetYB = obj.height / 2;
        const boundsB = {
          x: obj.position.x - offsetXB,
          y: obj.position.y - offsetYB,
          height: obj.height,
          width: obj.width,
          right: obj.position.x + obj.width - offsetXB,
          bottom: obj.position.y + obj.height - offsetYB
        };
        if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
          if (this.boundsBoxB !== undefined) {
            this.boundsBoxB.kill();
          }
          this.boundsBoxB = drawBoundsBox(this.game, boundsB, 0xFFFFFF);
          this.targetObj = obj;
        }
      }
    });
    if (this.targetObj ===  null) {
      if (this.boundsBoxA !== undefined) {
        this.boundsBoxA.kill();
      }
      if (this.boundsBoxB !== undefined) {
        this.boundsBoxB.kill();
      }
    }
  }

  drawHitBoundsBoxes() {
    const offsetYA = this.hitBox.height / 2;
    const boundsA = {
      x: this.hitBox.x - offsetYA,
      y: this.hitBox.y - offsetYA,
      height: this.hitBox.height,
      width: this.hitBox.width,
      right: this.hitBox.x + this.hitBox.width - offsetYA,
      bottom: this.hitBox.y + this.hitBox.height - offsetYA,
      type: 22
    };
    // console.log('a', boundsA);
    this.game.world.children[3].children.forEach((tree) => {
      if (tree.key !== 'characterAnim') {
        const offsetXB = tree.width / 2;
        const offsetYB = tree.height / 2;
        const boundsB = {
          x: tree.position.x - offsetXB,
          y: tree.position.y - offsetYB,
          height: tree.height,
          width: tree.width,
          right: tree.position.x + tree.width - offsetXB,
          bottom: tree.position.y + tree.height - offsetYB,
          type: 22
        };
        // console.log('b', boundsB);
        // console.log('b', this.game.world.children[3].children[0].position);
        if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
          if (this.boundsBoxA !== undefined) {
            this.boundsBoxA.kill();
          }
          if (this.boundsBoxB !== undefined) {
            this.boundsBoxB.kill();
          }
          this.boundsBoxA = drawBoundsBox(this.game, boundsA, 0x0000FF);
          this.boundsBoxB = drawBoundsBox(this.game, boundsB, 0x0000FF);
          console.log(`${tree.key} hit`);
        }
      }
    });
  }
}

function rotate(cx, cy, x, y, angle) {
  const radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
  return [nx, ny];
}

function getAngleDeg(x, y) {
  const angleRad = Math.atan(x / y);
  const angDeg = angleRad * 180 / Math.PI;
  if (y <= 0) {
    return 180 + angDeg;
  } else if (x <= 0) {
    return 360 + angDeg;
  } else {
    return angDeg;
  }
}

function drawBoundsBox(game, bounds, color) {
  const hitBox = game.add.graphics(0, 0);
  hitBox.anchor.set(0);
  // hitBox.cameraOffset.x = 200;
  // debugger
  // hitBox = this.game.add.isoSprite(100, 100, 0, 'hitBox', 0, obstacleGroup);

  // set a fill and line style
  // hitBox.beginFill(0xFF3300);
  hitBox.lineStyle(1, color);

  // // draw a shape
  hitBox.moveTo(bounds.x, bounds.y);
  hitBox.lineTo(bounds.right, bounds.y);
  hitBox.lineTo(bounds.right, bounds.bottom);
  hitBox.lineTo(bounds.x, bounds.bottom);
  hitBox.lineTo(bounds.x, bounds.y);

  return hitBox;
}
