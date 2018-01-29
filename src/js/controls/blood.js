import { rotate } from '../utils/isometric_utils.js';

export class Blood {
  constructor(game, player, bloodGroup) {
    this.game = game;
    this.player = player;
    this.bloodGroup = bloodGroup;
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
    const NUMBER_OF_SPLATS = 600;
    if (this.bloodGroup.children.length > NUMBER_OF_SPLATS) {
      const diff = this.bloodGroup.children.length - NUMBER_OF_SPLATS;
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
    const SPLAT_GROUP_SPREAD = 1.5;
    const NUMBER_OF_SPAT_GROUPS = 3;
    let count = 0;

    const splat = () => {
      if (count < NUMBER_OF_SPAT_GROUPS) {
        setTimeout(() => {
          const splatGroupPos = {
            x: target.position.x + (this.player.position.x - target.position.x) * (((1 / NUMBER_OF_SPAT_GROUPS) * count ) * SPLAT_GROUP_SPREAD),
            y: target.position.y + (this.player.position.y - target.position.y) * (((1 / NUMBER_OF_SPAT_GROUPS) * count ) * SPLAT_GROUP_SPREAD)
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

  bleedMovingCharacters() {
    const characters = this.game.world.children[4].children;
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      if (char.key === 'rock') {
        if (char.isBleeding) {
          const oldPos = char.previousPosition.x * char.previousPosition.y;
          const newPos = char.position.x * char.position.y;
          if (oldPos !== newPos) {
            char.bleedingCounter--;
            if (char.bleedingCounter) {
              this.drawBlood({ x: char.x, y: char.y }, 1.2, 3, 20);
            } else {
              char.isBleeding = false;
            }
          }
        }
      }
    }
  }
}
