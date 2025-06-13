class World {
  character = new Character();
  background = level1.background;
  enemies = [];
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
    this.spawnChickensInInterval(this);
    this.spawnAsteroids(this);
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fromArrayAddToMap(this.background);
    this.fromArrayAddToMap(this.enemies);
    this.addToMap(this.character);
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

  spawnChickensInInterval(world) {
    function spawnChicken() {
      if (isTabActive) {
        const isSmall = Math.random() < 0.5;
        const y = Math.floor(Math.random() * (world.canvas.height - 75));

        const newChicken = isSmall
          ? new Chicken(CHICKEN_IMAGES.SMALL[0], 50, 50, 3, CHICKEN_IMAGES.SMALL)
          : new Chicken(CHICKEN_IMAGES.NORMAL[0], 75, 75, 3, CHICKEN_IMAGES.NORMAL);

        newChicken.y = y;
        world.enemies.push(newChicken);

        setTimeout(() => {
          const index = world.enemies.indexOf(newChicken);
          if (index > -1) {
            world.enemies.splice(index, 1);
          }
        }, 15000);
      }
      setTimeout(spawnChicken, 3000);
    }

    spawnChicken();
  }

spawnAsteroids(world) {
  function spawnRock() {
    if (isTabActive) {
      const rock = new Asteroid(
        ASTEROIDS.ROCK,
        Math.floor(Math.random() * 400) + 800,
        Math.floor(Math.random() * 380),
        50,
        50,
        1.5
      );
      world.background.push(rock);

      setTimeout(() => {
        const index = world.background.indexOf(rock);
        if (index > -1) {
          world.background.splice(index, 1);
        }
      }, 20000);
    }
    setTimeout(spawnRock, 5000);
  }

  function spawnPlanet() {
      if (isTabActive) {
        const planet = new Asteroid(
          ASTEROIDS.PLANET,
          800,
          Math.floor(Math.random() * 380),
          100,
          100,
          0.3
        );
        world.background.push(planet);

        setTimeout(() => {
          const index = world.background.indexOf(planet);
          if (index > -1) {
            world.background.splice(index, 1);
          }
        }, 180000);
      }
      setTimeout(spawnPlanet, 60000);
    }

    spawnRock();
    spawnPlanet();
  }
}