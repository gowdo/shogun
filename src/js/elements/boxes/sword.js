import { Shape } from './shape.js';

export class Sword extends Shape {
  constructor(game, group) {
    super(game, group);
    this.shape.beginFill(0xFFFFFF);
    this.shape.lineStyle(4, 0xFFFFFF, 1);
    this.shape.moveTo(0, 0);
    this.shape.lineTo(0, -53);

    // this.shape.alpha = 0;
    this.shape.endFill();

    this.points = this.shape.graphicsData[0].shape.points;
  }
}
