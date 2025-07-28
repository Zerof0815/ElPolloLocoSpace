class SpawnManager {
  spawnChicken(world) {
    if (world.chickenScore <= 9) {
      const isSmall = Math.random() < 0.5;
      const y = Math.floor(Math.random() * (world.canvas.height - 125) + 50);

      const newChicken = this.createChicken(isSmall);
      newChicken.y = y;
      world.enemies.push(newChicken);

      this.deleteObjectAfterTimeout(newChicken, world.enemies, 15000);

      setTimeout(() => this.spawnChicken(world), 3000);
    }
  }

  createChicken(isSmall) {
    if (isSmall) {
      return new Chicken(
        CHICKEN_IMAGES.SMALL[0],
        50,
        50,
        4,
        CHICKEN_IMAGES.SMALL,
        1,
        CHICKEN_IMAGES.SMALL_DEAD
      );
    } else {
      return new Chicken(
        CHICKEN_IMAGES.NORMAL[0],
        75,
        75,
        3,
        CHICKEN_IMAGES.NORMAL,
        2,
        CHICKEN_IMAGES.NORMAL_DEAD
      );
    }
  }

  spawnRock(world) {
    const rock = new Asteroid(
      ASTEROIDS.ROCK,
      Math.floor(Math.random() * 400) + 800,
      Math.floor(Math.random() * 380),
      50,
      50,
      1.5
    );
    world.asteroids.push(rock);

    this.deleteObjectAfterTimeout(rock, world.asteroids, 30000);

    setTimeout(() => this.spawnRock(world), 5000);
  }

  spawnPlanet(world) {
    const planet = new Asteroid(
      ASTEROIDS.PLANET,
      720,
      Math.floor(Math.random() * 380),
      100,
      100,
      0.3
    );
    world.planets.push(planet);

    this.deleteObjectAfterTimeout(planet, world.planets, 180000);

    setTimeout(() => this.spawnPlanet(world), 60000);
  }

  deleteObjectAfterTimeout(obj, array, timeout) {
    setTimeout(() => {
      const index = array.indexOf(obj);
      if (index > -1) {
        array.splice(index, 1);
      }
    }, timeout);
  }
}