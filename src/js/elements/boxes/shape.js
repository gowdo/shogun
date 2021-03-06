export class Shape {
  constructor(game, group) {
    this.game = game;
    this.shape = this.game.add.graphics(0, 0);
    this.shape.anchor.set(0.5);
    if (group) {
      group.add(this.shape);
    }
  }

  x() {
    return this.shape.x;
  }

  y() {
    return this.shape.y;
  }

  width() {
    return this.shape.width;
  }

  height() {
    return this.shape.height;
  }

  right() {
    return this.shape.x + this.shape.width;
  }

  bottom() {
    return this.shape.y + this.shape.height;
  }

  isVisible() {
    return this.shape.visible;
  }

  angle() {
    return this.shape.angle;
  }

  setX(x) {
    this.shape.x = x;
  }

  setY(y) {
    this.shape.y = y;
  }

  setAngle(angle) {
    this.shape.angle = angle;
  }

  setVisible(visible) {
    this.shape.visible = visible;
  }
}
