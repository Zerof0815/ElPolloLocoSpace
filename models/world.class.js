class World {
  canvas;
  character = new Character();
  background = level1.background;
  enemies = [];
  asteroids = [];
  endboss = new Endboss(ENDBOSS.WALK[0], 500, 582, 3, ENDBOSS.WALK);
  healthBar = new StatusBar(10, -10, 158 / 2.5, 595 / 2.5, STATUS_BAR.HEALTH);
  bossHealthBar = new StatusBar(
    210,
    400,
    158 / 2,
    595 / 2,
    STATUS_BAR.BOSS_HEALTH
  );
  chickenCounter = new Counter(550, 7, 50, 50, STATUS_BAR.CHICKEN_COUNTER);
  winnerScreen = new EndGameScreen(canvas.width, canvas.height, END_SCREEN.WIN);
  looserScreen = new EndGameScreen(canvas.width, canvas.height, END_SCREEN.GAME_OVER);
  bottles = [];
  chickenScore = 0;
  backgroundMusic;
  ctx;
  keyboard;
  isPlayerDead = false;
  isEndbossDead = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.endboss.world = this;
    this.draw();
    this.setWorld();
    this.character.shoot();
    this.spawnChicken(this);
    this.spawnAsteroids(this);
    this.checkCollisions();
    this.checkChickenScoreForEndboss();
    this.backgroundMusic = new Audio("assets/audio/backgroundAudio.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.1;
    this.startBackgroundMusic();
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fromArrayAddToMap(this.background);
    this.fromArrayAddToMap(this.enemies);
    this.addToMap(this.character);
    this.addToMap(this.endboss);
    this.fromArrayAddToMap(this.asteroids);
    this.fromArrayAddToMap(this.bottles);
    this.endboss.drawExplosions(this.ctx);
    this.addToMap(this.healthBar);
    if (this.endboss.isMoving === true) this.addToMap(this.bossHealthBar);
    this.chickenCounter.drawIcon(this.ctx);
    if (this.isEndbossDead === true) this.addToMap(this.winnerScreen);
    if (this.character.characterLifes <= 0 === true) this.addToMap(this.looserScreen);

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
    // shows hitbox
    // this.drawRectangleForObject(movableObject);
  }

  fromArrayAddToMap(movableObjectInArray) {
    movableObjectInArray.forEach((object) => {
      if (object.update) {
        object.update();
      }
      this.addToMap(object);
    });
  }

  drawRectangleForObject(movableObject) {
    let offset = movableObject.objectCollisionOffset || {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };

    const x = movableObject.x + offset.left;
    const y = movableObject.y + offset.top;
    const width = movableObject.width - offset.left - offset.right;
    const height = movableObject.height - offset.top - offset.bottom;

    this.ctx.beginPath();
    this.ctx.lineWidth = "1";
    this.ctx.strokeStyle = "blue";
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
  }

  handleCharacterCollision() {
    if (!this.character.collisionCooldown) {
      this.character.collisionCooldown = true;

      this.character.characterGetsHit();
      this.character.characterLifes--;

      const percentLife =
        (this.character.characterLifes / this.character.maxLifes) * 100;
      this.healthBar.setPercentage(percentLife);

      if (this.character.characterLifes <= 0 && !this.character.isDead) {
        this.character.triggerDeath();
      }

      setTimeout(() => {
        this.character.collisionCooldown = false;
      }, 1000);

      return true;
    }

    return false;
  }

  checkObjectCollisions(objectArray) {
    return objectArray.filter((object) => {
      if (object.isDead) return true;

      if (this.character.isColliding(object)) {
        return !this.handleCharacterCollision();
      }
      return true;
    });
  }

  checkCollisions() {
    setInterval(() => {
      if (this.character.isDead) return;
      this.enemies = this.checkObjectCollisions(this.enemies);
    }, 1000 / 30);

    setInterval(() => {
      if (this.character.isDead) return;
      this.asteroids = this.checkObjectCollisions(this.asteroids);
    }, 1000 / 30);

    setInterval(() => {
      if (this.character.isDead) return;
      this.checkBottleHits();
    }, 1000 / 30);
  }

  handleBottleChickenHit(bottle, enemy) {
    if (enemy.chickenLifes <= 0 && !enemy.isDead) {
      enemy.isDead = true;
      enemy.deathAnimation();
      if (this.chickenScore <= 9) {
        this.chickenScore++;
        this.chickenCounter.increment();
      }

      setTimeout(() => {
        const index = this.enemies.indexOf(enemy);
        if (index > -1) {
          this.enemies.splice(index, 1);
        }
      }, 1000);
    }

    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex > -1) {
      bottle.breakSound();
      bottle.breakAnimation(() => {
        this.bottles.splice(bottleIndex, 1);
      });
    }
  }

  handleBottleAsteroidHit(bottle, asteroid) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex > -1) {
      bottle.breakSound();
      bottle.breakAnimation(() => {
        this.bottles.splice(bottleIndex, 1);
      });
    }
  }

  handleBottleBossHit(bottle) {
    if (!this.endboss.isDead && this.endboss.isAttackAble) {
      this.endboss.endbossLifes--;

      const percentLife =
        (this.endboss.endbossLifes / this.endboss.endbossMaxLifes) * 100;
      this.bossHealthBar.setPercentage(percentLife);

      if (this.endboss.endbossLifes <= 0) {
        this.endboss.deathAnimation();
        this.isEndbossDead = true;
      }
    }

    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex > -1) {
      bottle.breakAnimation(() => {
        bottle.breakSound();
        this.bottles.splice(bottleIndex, 1);
      });
    }
  }

  checkBottleHits() {
    this.bottles.forEach((bottle) => {
      this.enemies.forEach((enemy) => {
        if (
          !bottle.isBreaking &&
          bottle.isColliding(enemy) &&
          enemy.chickenLifes >= 1
        ) {
          enemy.chickenLifes--;
          this.handleBottleChickenHit(bottle, enemy);
        }
      });

      this.asteroids.forEach((asteroid) => {
        if (!bottle.isBreaking && bottle.isColliding(asteroid)) {
          this.handleBottleAsteroidHit(bottle, asteroid);
        }
      });

      if (!bottle.isBreaking && bottle.isColliding(this.endboss)) {
        this.handleBottleBossHit(bottle);
      }
    });
  }

  spawnChicken(world) {
    if (this.chickenScore <= 9) {
      const isSmall = Math.random() < 0.5;
      const y = Math.floor(Math.random() * (world.canvas.height - 125) + 50);

      const newChicken = this.createChicken(isSmall);
      newChicken.y = y;
      world.enemies.push(newChicken);

      setTimeout(() => {
        const index = world.enemies.indexOf(newChicken);
        if (index > -1) {
          world.enemies.splice(index, 1);
        }
      }, 15000);

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

    setTimeout(() => {
      const index = world.background.indexOf(rock);
      if (index > -1) {
        world.background.splice(index, 1);
      }
    }, 30000);

    setTimeout(() => this.spawnRock(world), 5000);
  }

  spawnPlanet(world) {
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

    setTimeout(() => this.spawnPlanet(world), 60000);
  }

  spawnAsteroids(world) {
    this.spawnRock(world);
    this.spawnPlanet(world);
  }

  spawnBossChicken(bossX, bossY) {
    const mouthX = bossX - 280;
    const mouthY = bossY - 100;

    const targetX = this.character.x + this.character.width / 2;
    const targetY = this.character.y + this.character.height / 2;

    const dx = targetX - mouthX;
    const dy = targetY - mouthY;
    const angle = Math.atan2(dy, dx);

    const angles = [angle, angle - Math.PI / 12, angle + Math.PI / 12];

    angles.forEach((a) => {
      const chicken = new SpitChicken(mouthX, mouthY, a);
      this.enemies.push(chicken);

      setTimeout(() => {
        const index = this.enemies.indexOf(chicken);
        if (index > -1) {
          this.enemies.splice(index, 1);
        }
      }, 15000);
    });
  }

  checkChickenScoreForEndboss() {
    setInterval(() => {
      if (this.chickenScore >= 10 && !this.endboss.isMoving) {
        this.endboss.startMoving();
      }
    }, 500);
  }

  stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  soundIsReady() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject("User did not interact. Sound cannot be played.");
      }, 1000 * 30);

      const handler = () => {
        clearTimeout(timeout);
        document.removeEventListener("keydown", handler);
        document.removeEventListener("click", handler);
        document.removeEventListener("touchstart", handler);
        setTimeout(resolve, 10);
      };

      document.addEventListener("keydown", handler);
      document.addEventListener("click", handler);
      document.addEventListener("touchstart", handler);
    });
  }

  async startBackgroundMusic() {
    try {
      await this.soundIsReady();
      this.backgroundMusic.play();
    } catch (e) {
      console.info("Error playing sound");
    }
  }
}