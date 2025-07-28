class SpawnManager {
  /**
   * Spawns a chicken enemy if the chicken score is 9 or less.
   * Creates either a small or normal chicken, sets its position, adds it to the world,
   * and schedules its removal and subsequent spawns.
   * @param {Object} world - The game world object containing game state and entities.
   */
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

  /**
   * Creates a new chicken instance with properties based on size.
   * @param {boolean} isSmall - Whether the chicken should be small or normal size.
   * @returns {Chicken} The newly created Chicken object.
   */
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

  /**
   * Spawns a rock asteroid at a random position off-screen to the right,
   * adds it to the world, schedules its removal, and schedules the next spawn.
   * @param {Object} world - The game world object.
   */
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

  /**
   * Spawns a planet asteroid at a fixed horizontal position and random vertical position,
   * adds it to the world, schedules its removal, and schedules the next spawn.
   * @param {Object} world - The game world object.
   */
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

  /**
   * Removes an object from a specified array after a delay.
   * @param {Object} obj - The object to remove.
   * @param {Array} array - The array from which to remove the object.
   * @param {number} timeout - Time in milliseconds to wait before removing the object.
   */
  deleteObjectAfterTimeout(obj, array, timeout) {
    setTimeout(() => {
      const index = array.indexOf(obj);
      if (index > -1) {
        array.splice(index, 1);
      }
    }, timeout);
  }
}