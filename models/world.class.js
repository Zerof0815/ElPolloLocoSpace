class World {
  background = [
    new Background(
      "../assets/img/5_background/Blue Version/layered/blue-back.png",
      0,
      0,
      720,
      480
    ),
    new Asteroid(
      "../assets/img/5_background/Blue Version/layered/prop-planet-big.png",
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 380),
      100,
      100,
      0.3
    ),
    new Asteroid(
      "../assets/img/5_background/Blue Version/layered/asteroid-2.png",
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 380),
      50,
      50,
      1.5
    ),
    new Asteroid(
      "../assets/img/5_background/Blue Version/layered/asteroid-2.png",
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 380),
      25,
      25,
      1.5
    ),
  ];
  character = new Character();
  enemies = [
    new Chicken(
      "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
      75,
      75
    ),
    new Chicken(
      "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
      75,
      75
    ),
    new Chicken(
      "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
      75,
      75
    ),
    new Chicken("../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png", 50, 50),
    new Chicken("../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png", 50, 50)
  ];
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
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
    this.ctx.drawImage(
      movableObject.img,
      movableObject.x,
      movableObject.y,
      movableObject.width,
      movableObject.height
    );
  }

  fromArrayAddToMap(movableObjectInArray) {
    movableObjectInArray.forEach((enemy) => {
      this.addToMap(enemy);
    });
  }
}