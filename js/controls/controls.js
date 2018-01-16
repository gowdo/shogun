export class Controller {
  constructor(game, player, hitBox, viewBox, targetBox) {
    this.game = game;
    this.player = player;
    this.hitBox = hitBox;
    this.targetBox = targetBox;
    this.viewBox = viewBox;
    this.boundsBoxA;
    this.boundsBoxB;
    this.pad1 = this.game.input.gamepad.pad1;
    this.game.input.gamepad.start();
    this.game.input.gamepad.setDeadZones(0.05);
  }

  update() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    let UP = false;
    let RIGHT = false;
    let DOWN = false;
    let LEFT = false;
    let UP_RIGHT = false;
    let DOWN_RIGHT = false;
    let UP_LEFT = false;
    let DOWN_LEFT = false;

    let Y_VALUE = 0;
    let X_VALUE = 0;


    // keyboard
    UP = this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
    DOWN = this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);
    LEFT = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    RIGHT = this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);

    // gamepad
    if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)) {
      LEFT = true;
    } else if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)) {
      RIGHT = true;
    }

    if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)) {
      UP = true;
    } else if (this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)) {
      DOWN = true;
    }

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

    let stickUsed = (X_VALUE !== 0 || Y_VALUE !== 0);

    const speed = 100;
    const MULTIPLIER = 1.2;
    const HIT_RADIUS = 50;
    const TARGET_RADIUS = 100;

    const aimLock = this.pad1.isDown((Phaser.Gamepad.XBOX360_LEFT_BUMPER));

    if (aimLock === false) {

      if (stickUsed) {
        const newPoints = rotate(0, 0, X_VALUE, Y_VALUE, 45);
        this.player.body.velocity.x = newPoints[0] * speed;
        this.player.body.velocity.y = newPoints[1] * speed;
        // console.log(newPoints[0], newPoints[1]);
      } else {

        if (UP && RIGHT) {
          UP = false;
          RIGHT = false;
          UP_RIGHT = true;
        }

        if (UP && LEFT) {
          UP = false;
          LEFT = false;
          UP_LEFT = true;
        }

        if (DOWN && RIGHT) {
          DOWN = false;
          RIGHT = false;
          DOWN_RIGHT = true;
        }

        if (DOWN && LEFT) {
          DOWN = false;
          LEFT = false;
          DOWN_LEFT = true;
        }

        // dpad checks
        if (UP) {
          this.player.body.velocity.y = -speed;
          this.player.body.velocity.x = -speed;
        } else if (DOWN) {
          this.player.body.velocity.y = speed;
          this.player.body.velocity.x = speed;
        } else if (RIGHT) {
          this.player.body.velocity.x = speed;
          this.player.body.velocity.y = -speed;
        } else if (LEFT) {
          this.player.body.velocity.x = -speed;
          this.player.body.velocity.y = speed;
        } else if (DOWN_RIGHT) {
          this.player.body.velocity.x = (speed * MULTIPLIER);
          // this.player.body.velocity.x = speed*MULTIPLIER;
          this.player.body.velocity.y = 0;
        } else if (DOWN_LEFT) {
          // this.player.body.velocity.y = speed*MULTIPLIER;
          this.player.body.velocity.y = (speed * MULTIPLIER);
          this.player.body.velocity.x = 0;
        } else if (UP_LEFT) {
          // this.player.body.velocity.x = -speed*MULTIPLIER;
          this.player.body.velocity.x = -(speed * MULTIPLIER);
          this.player.body.velocity.y = 0;

        } else if (UP_RIGHT) {
          // this.player.body.velocity.y = -speed*MULTIPLIER;
          this.player.body.velocity.y = -(speed * MULTIPLIER);
          this.player.body.velocity.x = 0;
        } else {
          this.player.body.velocity.x = 0;
          this.player.body.velocity.y = 0;
        }
      }

      const angle = getAngleDeg(X_VALUE, -Y_VALUE);
      const hitBoxPos = { x: 0, y: 0 };
      const targetBoxPos = { x: 0, y: 0 };
      // const viewBoxPos = { x: 0, y: 0 };

      if (UP || (angle < 30 || angle > 330)) {
        this.player.animations.play('N');
      }
      else if (UP_RIGHT || (angle < 60)) {
        this.player.animations.play('NE');
      }
      else if (RIGHT || (angle < 120)) {
        this.player.animations.play('E');
      }
      else if (DOWN_RIGHT || (angle < 150)) {
        this.player.animations.play('SE');
      }
      else if (DOWN || (angle < 210)) {
        this.player.animations.play('S');
      }
      else if (DOWN_LEFT || (angle < 240)) {
        this.player.animations.play('SW');
      }
      else if (LEFT || (angle < 300)) {
        this.player.animations.play('W');
      }
      else if (UP_LEFT || (angle < 330)) {
        this.player.animations.play('NW');
      }
      else {
        this.player.animations.stop();
      }

      this.player.body.velocity.y = this.player.body.velocity.y * 1.5;
      this.player.body.velocity.x = this.player.body.velocity.x * 1.5;

      /*
      const direction = this.player.animations.currentAnim.name;
      // console.log(direction);
      if (direction === 'N') {
        // hitBoxPos.x = -50;
        // hitBoxPos.y = -30;
        // targetBoxPos.x = 30;
        // targetBoxPos.y = -100;
      } else if(direction === 'NE') {
        // hitBoxPos.x = -20;
        // hitBoxPos.y = -30;
        // targetBoxPos.x = -20;
        // targetBoxPos.y = -30;
      } else if(direction === 'E') {
        // hitBoxPos.x = 0;
        // hitBoxPos.y = 0;
        // targetBoxPos.x = 160;
        // targetBoxPos.y = -12;
      } else if(direction === 'SE') {
        // hitBoxPos.x = -20;
        // hitBoxPos.y = 30;
        // targetBoxPos.x = -20;
        // targetBoxPos.y = 30;
      } else if(direction === 'S') {
        // hitBoxPos.x = -50;
        // hitBoxPos.y = 30;
        // targetBoxPos.x = 30;
        // targetBoxPos.y = 90;
      } else if(direction === 'SW') {
        // hitBoxPos.x = -80;
        // hitBoxPos.y = 30;
        // targetBoxPos.x = -80;
        // targetBoxPos.y = 30;
      } else if(direction === 'W') {
        // hitBoxPos.x = -100;
        // hitBoxPos.y = -0;
        // targetBoxPos.x = -100;
        // targetBoxPos.y = -12;
      } else if(direction === 'NW') {
        // hitBoxPos.x = -80;
        // hitBoxPos.y = -30;
        // targetBoxPos.x = -80;
        // targetBoxPos.y = -30;
      }
      */

      const hitScaler = HIT_RADIUS / Math.sqrt((X_VALUE * X_VALUE) + (Y_VALUE * Y_VALUE));
      const targetScaler = TARGET_RADIUS / Math.sqrt((X_VALUE * X_VALUE) + (Y_VALUE * Y_VALUE));

      this.targetBox.x = this.player.position.x + targetScaler * X_VALUE;
      this.targetBox.y = this.player.position.y + targetScaler * Y_VALUE;
      this.hitBox.x = this.player.position.x + hitScaler * X_VALUE;
      this.hitBox.y = this.player.position.y + hitScaler * Y_VALUE;

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
        // this.hitBox.x = this.player.position.x + hitBoxPos.x;
        // this.hitBox.y = this.player.position.y + hitBoxPos.y;
        this.drawHitBoundsBoxes();
      } else {
        this.hitBox.x = -100000;
        this.hitBox.y = 0;
      }

      // this.viewBox.x = this.player.position.x + viewBoxPos.x - 40;
      // this.viewBox.y = this.player.position.y + viewBoxPos.y + 30;
    } else {

      const newPoints = rotate(0, 0, X_VALUE, Y_VALUE, 45);
      this.player.body.velocity.x = newPoints[0] * speed;
      this.player.body.velocity.y = newPoints[1] * speed;
      // console.log(newPoints[0], newPoints[1]);
      const o = this.player.position.x - this.targetBox.x;
      const a = this.player.position.y - this.targetBox.y;

      const angleRad = Math.atan(o / a);
      const angDeg = angleRad * 180 / Math.PI;
      // console.log(angDeg);
      const angle = getAngleDeg(-o, a);
      // console.log(angle);
      if (UP || (angle < 30 || angle > 330)) {
        this.player.animations.play('N');
      }
      else if (UP_RIGHT || (angle < 60)) {
        this.player.animations.play('NE');
      }
      else if (RIGHT || (angle < 120)) {
        this.player.animations.play('E');
      }
      else if (DOWN_RIGHT || (angle < 150)) {
        this.player.animations.play('SE');
      }
      else if (DOWN || (angle < 210)) {
        this.player.animations.play('S');
      }
      else if (DOWN_LEFT || (angle < 240)) {
        this.player.animations.play('SW');
      }
      else if (LEFT || (angle < 300)) {
        this.player.animations.play('W');
      }
      else if (UP_LEFT || (angle < 330)) {
        this.player.animations.play('NW');
      }
      else {
        this.player.animations.stop();
      }

      const hitScaler = HIT_RADIUS / Math.sqrt((o * o) + (a * a));
      this.hitBox.x = this.player.position.x + hitScaler * -o;
      this.hitBox.y = this.player.position.y + hitScaler * -a;

      if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
        this.drawHitBoundsBoxes();
      } else {
        this.hitBox.x = -100000;
        this.hitBox.y = 0;
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
          if (this.boundsBoxA !== undefined && this.boundsBoxB !== undefined) {
            this.boundsBoxA.kill();
            this.boundsBoxB.kill();
          }
          this.boundsBoxA = drawBoundsBox(this.game, boundsA);
          this.boundsBoxB = drawBoundsBox(this.game, boundsB);
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

function drawBoundsBox(game, bounds) {
  const hitBox = game.add.graphics(0, 0);
  hitBox.anchor.set(0);
  // hitBox.cameraOffset.x = 200;
  // debugger
  // hitBox = this.game.add.isoSprite(100, 100, 0, 'hitBox', 0, obstacleGroup);

  // set a fill and line style
  // hitBox.beginFill(0xFF3300);
  hitBox.lineStyle(1, 0x0000FF);

  // // draw a shape
  hitBox.moveTo(bounds.x, bounds.y);
  hitBox.lineTo(bounds.right, bounds.y);
  hitBox.lineTo(bounds.right, bounds.bottom);
  hitBox.lineTo(bounds.x, bounds.bottom);
  hitBox.lineTo(bounds.x, bounds.y);

  return hitBox;
}
