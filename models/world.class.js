class World {
  character = new Character();
  background = level1.background;
  enemies = level1.enemies;
  canvas;
  ctx;
  keyboard;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.character.shoot();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fromArrayAddToMap(this.background);
    this.addToMap(this.character);
    this.fromArrayAddToMap(this.enemies);

    //constantly execute draw()
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(movableObject) {
    this.ctx.save();

    let centerX = movableObject.x + movableObject.width / 2;
    let centerY = movableObject.y + movableObject.height / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(movableObject.angle || 0);

    this.ctx.drawImage(
      movableObject.img,
      -movableObject.width / 2,
      -movableObject.height / 2,
      movableObject.width,
      movableObject.height
    );

    this.ctx.restore();
  }

  fromArrayAddToMap(movableObjectInArray) {
    movableObjectInArray.forEach((enemy) => {
      this.addToMap(enemy);
    });
  }
}