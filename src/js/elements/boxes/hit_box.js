import { Shape } from './shape.js';

export class HitBox extends Shape {
  constructor(game, group) {
    super(game, group);
    this.shape.beginFill(0x0000FF, 1);
    this.shape.drawCircle(0, 0, 10);
    this.shape.endFill();

    this.points = this.shape.graphicsData[0].shape.points;
  }
}
