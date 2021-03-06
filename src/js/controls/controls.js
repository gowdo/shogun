// const pp = require('polygon-overlap');
// require('../../node_modules/polygon-overlap/index.js');

import { rotate, getAngleDeg } from '../utils/isometric_utils.js';
import { Blood } from './blood.js';

export class Controller {
  constructor(game, player, hitBox, viewBox, targetBox, bloodGroup, sword) {
    this.game = game;
    this.player = player;
    this.hitBox = hitBox;
    this.viewBox = viewBox;
    this.targetBox = targetBox;
    this.sword = sword;
    this.boundsBoxA;
    this.boundsBoxB;
    this.targetObj = null;
    this.lockedTargetObj = null;
    this.pad1 = this.game.input.gamepad.pad1;
    this.game.input.gamepad.start();
    this.game.input.gamepad.setDeadZones(0.05);
    this.hitButtonDownId = 0;
    this.hitDuration = 0;
    this.dodgeButtonDownId = 0;
    this.dodgeDuration = 0;

    this.blood = new Blood(game, player, bloodGroup);
  }

  update() {
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    let Y_VALUE = 0;
    let X_VALUE = 0;

    if (this.pad1.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_X) < -0.01) {
      X_VALUE = this.pad1.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_X);
    } else if (this.pad1.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_X) > 0.01) {
      X_VALUE = this.pad1.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_X);
    }

    if (this.pad1.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_Y) < -0.01) {
      Y_VALUE = this.pad1.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_Y);
    } else if (this.pad1.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_Y) > 0.01) {
      Y_VALUE = this.pad1.axis(Phaser.Gamepad.PS3XC_STICK_LEFT_Y);
    }

    const aimLock = this.pad1.isDown(Phaser.Gamepad.XBOX360_LEFT_BUMPER);

    const SPEED = 170;
    const HIT_RADIUS = 50;
    const TARGET_RADIUS = 100;
    const TOTAL_HIT_DURATION = 6;
    let speedBonus = 1;
    if (this.dodgeDuration !== 0) {
      this.dodgeDuration--;
      if (aimLock) {
        speedBonus += 5;
      }
    }

    // move player
    const newPoints = rotate(0, 0, X_VALUE, Y_VALUE, 45);
    this.player.body.velocity.x = newPoints.x * (SPEED * speedBonus);
    this.player.body.velocity.y = newPoints.y * (SPEED * speedBonus);

    let X = X_VALUE;
    let Y = Y_VALUE;

    if (aimLock) {
      X = -(this.player.position.x - this.targetBox.x());
      Y = -(this.player.position.y - this.targetBox.y());
    }

    const isMoving = (X_VALUE !== 0 || Y_VALUE !== 0);
    const angle = getAngleDeg(X, -Y);

    this.sword.setVisible(false);
    if (this.hitDuration !== 0) {
      this.hitDuration--;
      this.swingSword(this.hitDuration, TOTAL_HIT_DURATION, angle);
    }

    if (isMoving) {
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
      } else {
        this.player.animations.stop();
      }

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
    } else {
      this.player.animations.stop();
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

    // hit button pressed
    if (this.pad1.isDown(Phaser.Gamepad.PS3XC_X)) {
      const hitButton = this.pad1.getButton(Phaser.Gamepad.PS3XC_X);
      if (this.hitButtonDownId !== hitButton.timeDown) {
        // don't register the hit if the timeDown timestamp is the same as the
        // same as the last one.
        // i.e. only register one hit per button press.
        this.hitButtonDownId = hitButton.timeDown;
        this.hitDuration = TOTAL_HIT_DURATION;
        this.hitBox.setVisible(true);

        const objectHit = this.drawHitBoundsBox();
        if (objectHit) {
          // console.log(`${objectHit.key} hit`);
          objectHit.hitCount++;
          // this.blood.drawBlood({ x: objectHit.x, y: objectHit.y }, 30, 5, 80);
          this.blood.spray(objectHit);
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
      this.hitButtonDownId = 0;
    }

    // dodge button pressed
    if (this.pad1.isDown(Phaser.Gamepad.PS3XC_CIRCLE)) {
      const dodgeButton = this.pad1.getButton(Phaser.Gamepad.PS3XC_CIRCLE);
      if (this.dodgeButtonDownId !== dodgeButton.timeDown) {
        this.dodgeButtonDownId = dodgeButton.timeDown;
        this.dodgeDuration = 3;
      }
    } else {
      this.dodgeButtonDownId = 0;
    }


    // this.blood.bleedMovingCharacters();
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
          // this.boundsBoxA = drawBoundsBox(this.game, boundsA, 0x0000FF);
          this.boundsBoxB = drawBoundsBox(this.game, boundsB, 0x0000FF);
          return target;
        }
      }
    }
  }

  swingSword(hitDuration, totalHitDuration) {
    const HALF_SWING_RANGE = -45;
    const swingAngle = ((HALF_SWING_RANGE * 2) / totalHitDuration) * (totalHitDuration - hitDuration) - (HALF_SWING_RANGE + HALF_SWING_RANGE / totalHitDuration);
    // console.log(hitDuration, totalHitDuration, this.viewBox.angle(), swingAngle);
    this.sword.setVisible(true);
    this.sword.setX(this.player.position.x);
    this.sword.setY(this.player.position.y);

    this.sword.setAngle(this.viewBox.angle() + swingAngle);
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

