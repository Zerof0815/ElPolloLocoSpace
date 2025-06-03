class World {
  background = [
    new Background(
      BACKGROUND,
      0,
      0,
      720,
      480
    ),
    new Asteroid(
      ASTEROIDS.PLANET,
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 380),
      100,
      100,
      0.3
    ),
    new Asteroid(
      ASTEROIDS.ROCK,
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 380),
      50,
      50,
      1.5
    ),
    new Asteroid(
      ASTEROIDS.ROCK,
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 380),
      25,
      25,
      1.5
    ),
  ];
  character = new Character();
  enemies = [
    new Chicken(CHICKEN_IMAGES.NORMAL[0], 75, 75, 3, CHICKEN_IMAGES.NORMAL),
    new Chicken(CHICKEN_IMAGES.NORMAL[0], 75, 75, 3, CHICKEN_IMAGES.NORMAL),
    new Chicken(CHICKEN_IMAGES.NORMAL[0], 75, 75, 3, CHICKEN_IMAGES.NORMAL),
    new Chicken(CHICKEN_IMAGES.SMALL[0], 50, 50, 4, CHICKEN_IMAGES.SMALL),
    new Chicken(CHICKEN_IMAGES.SMALL[0], 50, 50, 4, CHICKEN_IMAGES.SMALL),
  ];
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