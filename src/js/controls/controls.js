// const pp = require('polygon-overlap');
// require('../../node_modules/polygon-overlap/index.js');

import { rotate, getAngleDeg, middlePoint } from '../utils/isometric_utils.js';

export class Controller {
  constructor(game, player, hitBox, viewBox, targetBox, bloodGroup) {
    this.game = game;
    this.player = player;
    this.hitBox = hitBox;
    this.viewBox = viewBox;
    this.targetBox = targetBox;
    this.bloodGroup = bloodGroup;
    this.boundsBoxA;
    this.boundsBoxB;
    this.targetObj = null;
    this.lockedTargetObj = null;
    this.pad1 = this.game.input.gamepad.pad1;
    this.game.input.gamepad.start();
    this.game.input.gamepad.setDeadZones(0.05);
    this.buttonADownId = 0;

    // this.pad1.addCallbacks(this, {
    //   onConnect: () => {
    //     this.buttonA = this.pad1.getButton(Phaser.Gamepad.XBOX360_A);
    //   }
    // });
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
    this.player.body.velocity.x = newPoints.x * SPEED;
    this.player.body.velocity.y = newPoints.y * SPEED;

    const aimLock = this.pad1.isDown(Phaser.Gamepad.XBOX360_LEFT_BUMPER);
    const moving = (X_VALUE !== 0 || Y_VALUE !== 0);

    let X = X_VALUE;
    let Y = Y_VALUE;

    if (aimLock) {
      X = -(this.player.position.x - this.targetBox.x());
      Y = -(this.player.position.y - this.targetBox.y());
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

    if (moving) {

      const HYP = Math.sqrt((X * X) + (Y * Y));
      const hitScaler = HIT_RADIUS / HYP;
      this.hitBox.setX(this.player.position.x + hitScaler * X);
      this.hitBox.setY(this.player.position.y + hitScaler * Y);

      this.viewBox.setX(this.player.position.x);
      this.viewBox.setY(this.player.position.y);
      this.viewBox.setAngle(angle);

      if (aimLock === false) {
        // if no aim lock, move the targetBox
        const targetScaler = TARGET_RADIUS / HYP;
        this.targetBox.setX(this.player.position.x + targetScaler * X);
        this.targetBox.setY(this.player.position.y + targetScaler * Y);
      }
    }

    if (aimLock && this.targetObj !== null) {
      this.lockedTargetObj = this.targetObj;
      this.targetBox.setX(this.targetObj.position.x);
      this.targetBox.setY(this.targetObj.position.y);
    } else {
      this.lockedTargetObj = null;
    }

    this.drawTargetBoundsBoxes();

    this.targetBox.setVisible(aimLock && this.targetObj !== null);

    if (this.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
      const buttonA = this.pad1.getButton(Phaser.Gamepad.XBOX360_A);
      if (this.buttonADownId !== buttonA.timeDown) {
        // don't register the hit if the timeDown timestamp is the same as the
        // same as the last one.
        // i.e. only register one hit per button press.
        this.buttonADownId = buttonA.timeDown;
        this.hitBox.setVisible(true);

        const objectHit = this.drawHitBoundsBox();
        if (objectHit) {
          // console.log(`${objectHit.key} hit`);
          objectHit.hitCount++;
          // this.drawBlood({ x: objectHit.x, y: objectHit.y }, 30, 5, 80);
          this.spray(objectHit);
          objectHit.isBleeding = true;
          objectHit.bleedingCounter = 500;

          if (objectHit.hitCount === objectHit.hitCountLimit) {
            objectHit.destroy();
            this.targetObj = null;
            this.lockedTargetObj === null;
          }
        }
      }
    } else {
      this.hitBox.setVisible(false);
      this.buttonADownId = 0;
    }

    const rocks = this.game.world.children[4].children;
    for (let i = 0; i < rocks.length; i++) {
      const rock = rocks[i];
      if (rock.key === 'rock') {
        if (rock.isBleeding) {
          const oldPos = rock.previousPosition.x * rock.previousPosition.y;
          const newPos = rock.position.x * rock.position.y;
          if (oldPos !== newPos) {
            rock.bleedingCounter--;
            if (rock.bleedingCounter) {
              // this.drawBlood({ x: rock.x, y: rock.y }, 1.2, 3, 20);
            } else {
              rock.isBleeding = false;
            }
          }
        }
      }
    }
  }

  drawTargetBoundsBoxes() {
    this.targetObj = null;

    let tempTargetObj = null;
    let targetBounds = null;

    if (this.lockedTargetObj === null) {
      // if there is no locked target, find the targetable object
      const targets = this.game.world.children[4].children;
      const playerX = this.player.position.x;
      const playerY = this.player.position.y;
      let closestTargetDistance = Number.MAX_SAFE_INTEGER;

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (target.key === 'rock' && target.key !== 'characterAnim') {
          const offsetXB = target.width / 2;
          const offsetYB = target.height / 2;
          const boundsB = {
            x: target.position.x - offsetXB,
            y: target.position.y - offsetYB,
            height: target.height,
            width: target.width,
            right: target.position.x + target.width - offsetXB,
            bottom: target.position.y + target.height - offsetYB
          };

          if (this.viewBox.inView(boundsB)) {
            const xDiff = (target.position.x > playerX) ? target.position.x - playerX : playerX - target.position.x;
            const yDiff = (target.position.y > playerY) ? target.position.y - playerY : playerY - target.position.y;
            const diff = xDiff + yDiff;
            if (diff < closestTargetDistance) {
              closestTargetDistance = diff;
              tempTargetObj = target;
              targetBounds = boundsB;
            }
          }
        }
      }
    } else {
      // else reselect the target
      tempTargetObj = this.lockedTargetObj;
      const offsetXB = tempTargetObj.width / 2;
      const offsetYB = tempTargetObj.height / 2;
      targetBounds = {
        x: tempTargetObj.position.x - offsetXB,
        y: tempTargetObj.position.y - offsetYB,
        height: tempTargetObj.height,
        width: tempTargetObj.width,
        right: tempTargetObj.position.x + tempTargetObj.width - offsetXB,
        bottom: tempTargetObj.position.y + tempTargetObj.height - offsetYB
      };
    }

    if (this.boundsBoxB !== undefined) {
      this.boundsBoxB.kill();
    }
    if (targetBounds !== null) {
      this.boundsBoxB = drawBoundsBox(this.game, targetBounds, 0xFFFFFF);
    }

    this.targetObj = tempTargetObj;

    if (this.targetObj ===  null) {
      if (this.boundsBoxA !== undefined) {
        this.boundsBoxA.kill();
      }
      if (this.boundsBoxB !== undefined) {
        this.boundsBoxB.kill();
      }
    }
  }

  drawHitBoundsBox() {
    const offsetYA = this.hitBox.height() / 2;
    const boundsA = {
      x: this.hitBox.x() - offsetYA,
      y: this.hitBox.y() - offsetYA,
      height: this.hitBox.height(),
      width: this.hitBox.width(),
      right: this.hitBox.right() - offsetYA,
      bottom: this.hitBox.bottom() - offsetYA,
      type: 22
    };

    const targets = this.game.world.children[4].children;
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      if (target.key === 'rock' && target.key !== 'characterAnim') {
        const offsetXB = target.width / 2;
        const offsetYB = target.height / 2;
        const boundsB = {
          x: target.position.x - offsetXB,
          y: target.position.y - offsetYB,
          height: target.height,
          width: target.width,
          right: target.position.x + target.width - offsetXB,
          bottom: target.position.y + target.height - offsetYB,
          type: 22
        };
        if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
          if (this.boundsBoxA !== undefined) {
            this.boundsBoxA.kill();
          }
          if (this.boundsBoxB !== undefined) {
            this.boundsBoxB.kill();
          }
          this.boundsBoxA = drawBoundsBox(this.game, boundsA, 0x0000FF);
          this.boundsBoxB = drawBoundsBox(this.game, boundsB, 0x0000FF);
          return target;
        }
      }
    }
  }

  drawBlood(pos, dropCount, maxDropSize, spread) {
    let count = Math.ceil(dropCount * Math.random());

    const splat = () => {
      count--;
      if (count) {
        setTimeout(() => {
          const x = pos.x -  (Math.random() * spread) + spread / 2;
          const y = pos.y - (Math.random() * spread) + spread / 2;
          const r = Math.random() * maxDropSize;
          const drop = this.game.add.graphics(x, y);
          drop.anchor.set(0);
          drop.beginFill(0xB90000, 1);
          drop.drawEllipse(0, 0, r * 2, r);
          drop.endFill();
          this.bloodGroup.add(drop);
          splat();
        }, 5);
      } else {
        this.cleanUpBlood();
      }
    };
    splat();
  }

  cleanUpBlood() {
    const numberOfSplats = 800;
    if (this.bloodGroup.children.length > numberOfSplats) {
      const diff = this.bloodGroup.children.length - numberOfSplats;
      for (let i = 0; i < diff; i++) {
        const splat = this.bloodGroup.children[i];
        splat.alpha -= 0.01;
        if (splat.alpha < 0.1) {
          splat.kill();
        }
      }
    }
    for (let i = this.bloodGroup.children.length-1; i > 0; i--) {
      if (this.bloodGroup.children[i].alive === false) {
        this.bloodGroup.children.splice(i, 1);
      }
    }
  }

  spray(target) {
    const splatGroupSpread = 1.5;
    const numberOfSpatGroups = 3;
    let count = 0;

    const splat = () => {
      if (count < numberOfSpatGroups) {
        setTimeout(() => {
          const splatGroupPos = {
            x: target.position.x + (this.player.position.x - target.position.x) * (((1 / numberOfSpatGroups) * count ) * splatGroupSpread),
            y: target.position.y + (this.player.position.y - target.position.y) * (((1 / numberOfSpatGroups) * count ) * splatGroupSpread)
          };
          const newPoints = rotate(target.position.x, target.position.y, splatGroupPos.x, splatGroupPos.y, -45);
          if (count === 1) {
            this.drawBlood({x: target.position.x , y: target.position.y}, 10, 5, 40);
          }
          this.drawBlood(newPoints, (10 * count), (3 / count) * 2, (count * 20));
          splat();
        }, 10);
        count++;
      }
    };
    splat();
  }
}

function drawBoundsBox(game, bounds, color) {
  const hitBox = game.add.graphics(0, 0);
  hitBox.anchor.set(0);
  hitBox.lineStyle(1, color);
  hitBox.moveTo(bounds.x, bounds.y);
  hitBox.lineTo(bounds.right, bounds.y);
  hitBox.lineTo(bounds.right, bounds.bottom);
  hitBox.lineTo(bounds.x, bounds.bottom);
  hitBox.lineTo(bounds.x, bounds.y);

  return hitBox;
}

