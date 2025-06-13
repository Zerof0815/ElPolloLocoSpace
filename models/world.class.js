class World {
  character = new Character();
  background = level1.background;
  enemies = level1.enemies;
  enboss = new Endboss(ENDBOSS.WALK[0], 500, 500, 3, ENDBOSS.WALK);
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
    this.spawnChickensInInterval();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fromArrayAddToMap(this.background);
    this.addToMap(this.character);
    this.fromArrayAddToMap(this.enemies);
    this.addToMap(this.enboss);

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
    movableObjectInArray.forEach((object) => {
      this.addToMap(object);
    });
  }

  spawnChickensInInterval() {
    setInterval(() => {
      const randomChicken = Math.random() < 0.5;
      const y = Math.floor(Math.random() * 400);

      const newChicken = randomChicken
        ? new Chicken(CHICKEN_IMAGES.SMALL[0], 50, 50, 3, CHICKEN_IMAGES.SMALL)
        : new Chicken(CHICKEN_IMAGES.NORMAL[0], 75, 75, 3, CHICKEN_IMAGES.NORMAL);

      newChicken.y = y;
      this.enemies.push(newChicken);
    }, 2000);
  }
}