import { Shape } from './shape.js';

export class TargetBox extends Shape {
  constructor(game) {
    super(game);
    this.shape.beginFill(0xFFFFFF, 1);
    this.shape.drawCircle(0, 0, 10);
    this.shape.endFill();

    this.points = this.shape.graphicsData[0].shape.points;
  }
}
