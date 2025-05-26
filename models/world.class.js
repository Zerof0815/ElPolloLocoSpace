class World {
  background = [
    new Background(
      "../assets/img/5_background/Blue Version/layered/blue-back.png",
      0,
      0,
      720,
      480
    ),
    new Background(
      "../assets/img/5_background/Blue Version/layered/prop-planet-big.png",
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 481),
      100,
      100
    ),
    new Background(
      "../assets/img/5_background/Blue Version/layered/asteroid-2.png",
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 481),
      50,
      50
    ),
    new Background(
      "../assets/img/5_background/Blue Version/layered/asteroid-2.png",
      Math.floor(Math.random() * 721),
      Math.floor(Math.random() * 481),
      25,
      25
    ),
  ];
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
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