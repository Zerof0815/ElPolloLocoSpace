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
  looserScreen = new EndGameScreen(
    canvas.width,
    canvas.height,
    END_SCREEN.GAME_OVER
  );
  homeButton = new GameButton(310, 15, GAME_BUTTONS.HOME, () => {
    window.location.href = "index.html";
  });
  restartButton = new GameButton(390, 15, GAME_BUTTONS.RESTART, () => {
    this.endAudio(this.backgroundMusic);
    restartGame();
  });
  soundButton = new GameButton(470, 15, GAME_BUTTONS.SOUND, () => {
    this.isMuted = !this.isMuted;
    localStorage.setItem("isMuted", this.isMuted ? "true" : "false");

    this.isGameMuted();
  });
  bottles = [];
  chickenScore = 0;
  backgroundMusic;
  bossRoar;
  bossMusic;
  looseSound;
  winSound;
  ctx;
  keyboard;
  isPlayerDead = false;
  isEndbossDead = false;
  isMuted = false;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.checkLocalStorageIfMuted();
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
    this.bossRoar = new Audio("assets/audio/bossRoar.mp3");
    this.bossRoar.volume = 0.1;
    this.bossMusic = new Audio("assets/audio/bossFight.mp3");
    this.bossMusic.loop = true;
    this.bossMusic.volume = 0.1;
    this.looseSound = new Audio("assets/audio/loose.mp3");
    this.winSound = new Audio("assets/audio/winning.mp3");
    this.winSound.volume = 0.1;
    if (!this.isMuted) this.startBackgroundMusic();
    this.buttonMouseHover(this.canvas);
    this.buttonClick(this.canvas);
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.fromArrayAddToMap(this.background);
    this.drawCollideables();
    this.endboss.drawExplosions(this.ctx);
    this.drawUI();
    this.drawbuttons();

    //constantly execute draw()
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  drawbuttons() {
    this.addToMap(this.homeButton);
    this.addToMap(this.restartButton);
    this.addToMap(this.soundButton);
  }

  drawCollideables() {
    this.fromArrayAddToMap(this.enemies);
    this.addToMap(this.character);
    this.addToMap(this.endboss);
    this.fromArrayAddToMap(this.asteroids);
    this.fromArrayAddToMap(this.bottles);
  }

  drawUI() {
    this.addToMap(this.healthBar);
    if (this.endboss.isMoving) this.addToMap(this.bossHealthBar);
    this.chickenCounter.drawIcon(this.ctx);
    if (this.isEndbossDead) this.addToMap(this.winnerScreen);
    if (this.character.characterLifes <= 0)
      this.addToMap(this.looserScreen);
  }

  addToMap(movableObject) {
    this.ctx.save();

    let centerX = movableObject.x + movableObject.width / 2;
    let centerY = movableObject.y + movableObject.height / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(movableObject.angle || 0);

    this.ctx.drawImage(...this.movableObjectData(movableObject));

    this.ctx.restore();
  }

  movableObjectData(movableObject) {
    return [
      movableObject.img,
      -movableObject.width / 2,
      -movableObject.height / 2,
      movableObject.width,
      movableObject.height,
    ];
  }

  fromArrayAddToMap(movableObjectInArray) {
    movableObjectInArray.forEach((object) => {
      if (object.update) {
        object.update();
      }
      this.addToMap(object);
    });
  }

  handleCharacterCollision() {
    if (this.character.collisionCooldown || this.isEndbossDead) {
      return false;
    }

    this.character.collisionCooldown = true;
    this.processCharacterHit();
    this.updateHealthBar();
    this.checkCharacterDeath();
    this.resetCollisionCooldown();

    return true;
  }

  processCharacterHit() {
    this.character.characterGetsHit();
    this.character.characterLifes--;
  }

  updateHealthBar() {
    const percentLife =
      (this.character.characterLifes / this.character.maxLifes) * 100;
    this.healthBar.setPercentage(percentLife);
  }

  checkCharacterDeath() {
    if (this.character.characterLifes <= 0 && !this.character.isDead) {
      this.endAudio(this.backgroundMusic);
      setTimeout(() => {
        this.playAudio(this.looseSound);
      }, 2000);
      this.character.triggerDeath();
    }
  }

  resetCollisionCooldown() {
    setTimeout(() => {
      this.character.collisionCooldown = false;
    }, 1000);
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
    this.handleChickenHit(enemy);
    this.handleBottleBreak(bottle);
  }

  handleChickenHit(enemy) {
    if (enemy.chickenLifes > 0 || enemy.isDead) return;

    enemy.isDead = true;
    enemy.deathAnimation();
    this.updateChickenScore();
    this.removeEnemyAfterDelay(enemy);
  }

  updateChickenScore() {
    if (this.chickenScore <= 9) {
      this.chickenScore++;
      this.chickenCounter.increment();
    }
  }

  removeEnemyAfterDelay(enemy) {
    setTimeout(() => {
      const index = this.enemies.indexOf(enemy);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }, 1000);
  }

  handleBottleBreak(bottle) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex < 0) return;

    if (!this.isMuted) bottle.breakSound();

    bottle.breakAnimation(() => {
      this.bottles.splice(bottleIndex, 1);
    });
  }

  handleBottleAsteroidHit(bottle, asteroid) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex > -1) {
      if (!this.isMuted) bottle.breakSound();
      bottle.breakAnimation(() => {
        this.bottles.splice(bottleIndex, 1);
      });
    }
  }

  handleBottleBossHit(bottle) {
    this.handleBossHit();
    this.handleBossBottleBreak(bottle);
  }

  handleBossHit() {
    if (this.endboss.isDead || !this.endboss.isAttackAble) return;

    this.endboss.endbossLifes--;
    this.updateBossHealthBar();

    if (this.endboss.endbossLifes <= 0) {
      this.handleBossDeath();
    }
  }

  updateBossHealthBar() {
    const percentLife =
      (this.endboss.endbossLifes / this.endboss.endbossMaxLifes) * 100;
    this.bossHealthBar.setPercentage(percentLife);
  }

  handleBossDeath() {
    this.endAudio(this.bossMusic);
    this.playAudio(this.winSound);
    this.endboss.deathAnimation();
    this.isEndbossDead = true;
  }

  handleBossBottleBreak(bottle) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex < 0) return;

    bottle.breakAnimation(() => {
      if (!this.isMuted) bottle.breakSound();
      this.bottles.splice(bottleIndex, 1);
    });
  }

  checkBottleHits() {
    this.bottles.forEach((bottle) => {
      this.checkBottleEnemyHits(bottle);
      this.checkBottleAsteroidHits(bottle);
      this.checkBottleBossHit(bottle);
    });
  }

  checkBottleEnemyHits(bottle) {
    this.enemies.forEach((enemy) => {
      const validHit =
        !bottle.isBreaking &&
        bottle.isColliding(enemy) &&
        enemy.chickenLifes >= 1;

      if (validHit) {
        enemy.chickenLifes--;
        this.handleBottleChickenHit(bottle, enemy);
      }
    });
  }

  checkBottleAsteroidHits(bottle) {
    this.asteroids.forEach((asteroid) => {
      if (!bottle.isBreaking && bottle.isColliding(asteroid)) {
        this.handleBottleAsteroidHit(bottle, asteroid);
      }
    });
  }

  checkBottleBossHit(bottle) {
    if (!bottle.isBreaking && bottle.isColliding(this.endboss)) {
      this.handleBottleBossHit(bottle);
    }
  }

  spawnChicken(world) {
    if (this.chickenScore <= 9) {
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
      800,
      Math.floor(Math.random() * 380),
      100,
      100,
      0.3
    );
    world.background.push(planet);

    this.deleteObjectAfterTimeout(planet, world.background, 180000);

    setTimeout(() => this.spawnPlanet(world), 60000);
  }

  deleteObjectAfterTimeout(object, collection, timeout) {
    setTimeout(() => {
      const index = collection.indexOf(object);
      if (index > -1) {
        collection.splice(index, 1);
      }
    }, timeout);
  }

  spawnAsteroids(world) {
    this.spawnRock(world);
    this.spawnPlanet(world);
  }

  spawnBossChicken(bossX, bossY) {
    const mouthPos = this.calculateMouthPosition(bossX, bossY);
    const targetPos = this.getCharacterCenter();

    const baseAngle = this.calculateAngle(mouthPos, targetPos);
    const angles = this.calculateSpreadAngles(baseAngle);

    angles.forEach((angle) => this.spawnAndScheduleChicken(mouthPos, angle));
  }

  calculateMouthPosition(bossX, bossY) {
    return {
      x: bossX - 280,
      y: bossY - 100,
    };
  }

  getCharacterCenter() {
    return {
      x: this.character.x + this.character.width / 2,
      y: this.character.y + this.character.height / 2,
    };
  }

  calculateAngle(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.atan2(dy, dx);
  }

  calculateSpreadAngles(baseAngle) {
    const spread = Math.PI / 12;
    return [baseAngle, baseAngle - spread, baseAngle + spread];
  }

  spawnAndScheduleChicken(position, angle) {
    const chicken = new SpitChicken(position.x, position.y, angle);
    this.enemies.push(chicken);

    setTimeout(() => {
      const index = this.enemies.indexOf(chicken);
      if (index > -1) this.enemies.splice(index, 1);
    }, 15000);
  }

  checkChickenScoreForEndboss() {
    setInterval(() => {
      if (this.chickenScore >= 10 && !this.endboss.isMoving) {
        this.endAudio(this.backgroundMusic);
        this.playAudio(this.bossRoar);
        if (!this.isMuted) this.startBossMusic();
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

      this.createUserInteractionHandler(resolve, timeout);
    });
  }

  createUserInteractionHandler(resolve, timeout) {
    const handler = () => {
      clearTimeout(timeout);
      this.removeUserInteractionListeners(handler);
      setTimeout(resolve, 10);
    };
    this.addUserInteractionListeners(handler);
  }

  addUserInteractionListeners(handler) {
    document.addEventListener("keydown", handler);
    document.addEventListener("click", handler);
    document.addEventListener("touchstart", handler);
  }

  removeUserInteractionListeners(handler) {
    document.removeEventListener("keydown", handler);
    document.removeEventListener("click", handler);
    document.removeEventListener("touchstart", handler);
  }

  async startBackgroundMusic() {
    try {
      await this.soundIsReady();
      this.backgroundMusic.play();
    } catch (e) {
      console.info("Error playing sound");
    }
  }

  endAudio(sound) {
    sound.pause();
  }

  playAudio(sound) {
    if (this.isMuted) return;
    sound.play();
  }

  startBossMusic() {
    setTimeout(() => {
      this.bossMusic.play();
    }, 3000);
  }

  buttonMouseHover(canvas) {
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const isHovering = [
        this.homeButton,
        this.restartButton,
        this.soundButton,
      ].some((btn) => btn.isHovered(mouseX, mouseY));

      this.canvas.style.cursor = isHovering ? "pointer" : "default";
    });
  }

  buttonClick(canvas) {
    const handleClick = (event) => {
      const { x, y } = this.getPointerPosition(event);

      this.homeButton.handleClick(x, y);
      this.restartButton.handleClick(x, y);
      this.soundButton.handleClick(x, y);
    };

    canvas.addEventListener("click", handleClick);

    canvas.addEventListener("touchstart", (event) => {
      handleClick(event);
    });
  }

  getPointerPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const isTouch = event.touches && event.touches.length > 0;

    const clientX = isTouch ? event.touches[0].clientX : event.clientX;
    const clientY = isTouch ? event.touches[0].clientY : event.clientY;

    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  }

  isGameMuted() {
    if (this.isMuted) {
      this.muteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.NO_SOUND);
    } else {
      this.unmuteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.SOUND);
    }
  }

  muteAllSounds() {
    const sounds = [
      this.backgroundMusic,
      this.bossRoar,
      this.bossMusic,
      this.looseSound,
      this.winSound,
    ];

    sounds.forEach((sound) => {
      if (sound) {
        sound.pause();
        sound.muted = true;
      }
    });
  }

  unmuteAllSounds() {
    const sounds = [
      this.backgroundMusic,
      this.bossRoar,
      this.bossMusic,
      this.looseSound,
      this.winSound,
    ];

    sounds.forEach((sound) => {
      if (sound) {
        sound.muted = false;
      }
    });

    this.musicHandler();
  }

  musicHandler() {
    if (this.isEndbossDead) {
      return;
    } else if (this.endboss?.isMoving) {
      if (this.bossMusic && this.bossMusic.paused) {
        this.bossMusic.play();
      }
    } else {
      if (this.backgroundMusic && this.backgroundMusic.paused) {
        this.backgroundMusic.play();
      }
    }
  }

  checkLocalStorageIfMuted() {
    const savedMute = localStorage.getItem("isMuted");
    this.isMuted = savedMute === "true";

    if (this.isMuted) {
      this.muteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.NO_SOUND);
    } else {
      this.unmuteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.SOUND);
    }
  }
}