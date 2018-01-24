import { rotate } from '../../utils/isometric_utils.js';
import { overlap } from '../../utils/polygon_overlap.js';
import { Shape } from './shape.js';

export class ViewBox extends Shape {
  constructor(game, group) {
    super(game, group);
    this.shape.beginFill(0xFFFFFF);
    this.shape.lineStyle(0, 0xffd900, 1);
    this.shape.moveTo(0, 0);
    this.shape.lineTo(100, -600);
    this.shape.lineTo(-100, -600);
    this.shape.lineTo(0, 0);
    this.shape.alpha = 0;
    this.shape.endFill();

    this.points = this.shape.graphicsData[0].shape.points;
  }

  inView(targetBounds) {
    const b1 = [];
    for (let i = 0; i < this.points.length; i+=2) {
      const p = rotate(0,0, this.points[i], this.points[i+1], this.shape.angle);
      b1.push([
        -p[0] + this.shape.position.x,
        p[1] + this.shape.position.y
      ]);
    }

    const b2 = [
      [targetBounds.x, targetBounds.y],
      [targetBounds.right, targetBounds.y],
      [targetBounds.right, targetBounds.bottom],
      [targetBounds.x, targetBounds.bottom],
    ];
    return overlap(b1, b2);
  }
}
