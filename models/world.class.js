class World {
  canvas;
  character = new Character();
  background = level1.background;
  enemies = [];
  asteroids = [];
  planets = [];
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
  homeButton = GameButton.createHomeButton();
  restartButton = GameButton.createRestartButton(this);
  soundButton = GameButton.createSoundButton(this);
  bottles = [];
  chickenScore = 0;
  ctx;
  keyboard;
  isPlayerDead = false;
  isEndbossDead = false;
  isMuted = false;

  /**
   * Initializes the game world, setting up all objects, characters, audio, and event handlers.
   *
   * @constructor
   * @param {HTMLCanvasElement} canvas - The main canvas element.
   * @param {Object} keyboard - The keyboard input controller.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.checkLocalStorageIfMuted();
    this.endboss.world = this;
    this.draw();
    this.character.world = this;
    this.character.shoot();
    this.spawnManager = new SpawnManager();
    this.startSpawning();
    this.checkCollisions();
    this.checkChickenScoreForEndboss();
    this.loadAudio();
    if (!this.isMuted) this.startBackgroundMusic();
    this.buttonController = new ButtonController(
      this.canvas,
      [this.homeButton, this.restartButton, this.soundButton],
      this
    );
  }

  /**
   * Clears the canvas and redraws the entire game scene, including
   * background, UI, characters, enemies, and buttons.
   * Continuously calls itself using requestAnimationFrame for smooth animation.
   */
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

  /**
   * Loads and configures all audio elements used in the game, including
   * background music, boss music, and sound effects.
   */
  loadAudio() {
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
  }

  /**
   * Draws the home, restart, and sound buttons on the canvas.
   */
  drawbuttons() {
    this.addToMap(this.homeButton);
    this.addToMap(this.restartButton);
    this.addToMap(this.soundButton);
  }

  /**
   * Draws all objects that can collide, including planets, enemies,
   * character, endboss, asteroids, and bottles.
   */
  drawCollideables() {
    this.fromArrayAddToMap(this.planets);
    this.fromArrayAddToMap(this.enemies);
    this.addToMap(this.character);
    this.addToMap(this.endboss);
    this.fromArrayAddToMap(this.asteroids);
    this.fromArrayAddToMap(this.bottles);
  }

  /**
   * Draws the game UI elements such as health bars, chicken counter, winner screen, and
   * loser screen based on game state.
   */
  drawUI() {
    this.addToMap(this.healthBar);
    if (this.endboss.isMoving) this.addToMap(this.bossHealthBar);
    this.chickenCounter.drawIcon(this.ctx);
    if (this.isEndbossDead) this.addToMap(this.winnerScreen);
    if (this.character.characterLifes <= 0) this.addToMap(this.looserScreen);
  }

  /**
   * Adds a movable object to the canvas, applying translation and
   * rotation based on the object's position and angle.
   * @param {Object} movableObject - The object to be drawn, expected to have
   * x, y, width, height, and optionally angle properties.
   */
  addToMap(movableObject) {
    this.ctx.save();

    let centerX = movableObject.x + movableObject.width / 2;
    let centerY = movableObject.y + movableObject.height / 2;

    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(movableObject.angle || 0);

    this.ctx.drawImage(...this.movableObjectData(movableObject));

    this.ctx.restore();
  }

  /**
   * Returns the parameters needed for ctx.drawImage to draw the movable object centered at (0,0).
   * @param {Object} movableObject - The object to get image data from.
   * @returns {Array} Array containing image, x-offset, y-offset, width, and height for drawing.
   */
  movableObjectData(movableObject) {
    return [
      movableObject.img,
      -movableObject.width / 2,
      -movableObject.height / 2,
      movableObject.width,
      movableObject.height,
    ];
  }

  /**
   * Iterates over an array of movable objects, calls their update method if it exists,
   * and draws each on the canvas.
   * @param {Array<Object>} movableObjectInArray - Array of movable objects to update and draw.
   */
  fromArrayAddToMap(movableObjectInArray) {
    movableObjectInArray.forEach((object) => {
      if (object.update) {
        object.update();
      }
      this.addToMap(object);
    });
  }

  /**
   * Filters an array of objects to check for collisions with the character and updates enemy states accordingly.
   * @param {Array<Object>} objectArray - Array of objects to check collisions against the character.
   * @returns {Array<Object>} Filtered array of objects after handling collisions and deaths.
   */
  checkObjectCollisions(objectArray) {
    return objectArray.filter((object) => {
      if (object.isDead) return true;

      if (this.character.isColliding(object)) {
        return !this.character.handleCollision(this);
      }

      return true;
    });
  }

  /**
   * Sets up repeated collision checks between the character and enemies, asteroids,
   * and bottles at 30 times per second.
   * Updates arrays based on collisions and character state.
   */
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

  /**
   * Handles the event when a bottle hits a chicken by processing the chicken hit and breaking the bottle.
   * @param {Object} bottle - The bottle object involved in the collision.
   * @param {Object} enemy - The chicken enemy object involved in the collision.
   */
  handleBottleChickenHit(bottle, enemy) {
    this.handleChickenHit(enemy);
    this.handleBottleBreak(bottle);
  }

  /**
   * Marks an enemy chicken as dead, triggers its death animation, updates the chicken score, and schedules its removal.
   * @param {Object} enemy - The chicken enemy to be marked dead.
   */
  handleChickenHit(enemy) {
    if (enemy.chickenLifes > 0 || enemy.isDead) return;

    enemy.isDead = true;
    enemy.deathAnimation();
    this.updateChickenScore();
    this.removeEnemyAfterDelay(enemy);
  }

  /**
   * Increments the player's chicken score and updates the chicken counter UI, if the score is 9 or less.
   */
  updateChickenScore() {
    if (this.chickenScore <= 9) {
      this.chickenScore++;
      this.chickenCounter.increment();
    }
  }

  /**
   * Removes the given enemy from the enemies array after a 1 second delay.
   * @param {Object} enemy - The enemy object to remove.
   */
  removeEnemyAfterDelay(enemy) {
    setTimeout(() => {
      const index = this.enemies.indexOf(enemy);
      if (index > -1) {
        this.enemies.splice(index, 1);
      }
    }, 1000);
  }

  /**
   * Handles the breaking of a bottle: plays break sound, animates breaking, and removes it from the bottles array.
   * @param {Object} bottle - The bottle object to break.
   */
  handleBottleBreak(bottle) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex < 0) return;

    if (!this.isMuted) bottle.breakSound();

    bottle.breakAnimation(() => {
      this.bottles.splice(bottleIndex, 1);
    });
  }

  /**
   * Handles a bottle hitting an asteroid: plays break sound, animates breaking, and removes the bottle.
   * @param {Object} bottle - The bottle object involved in the collision.
   * @param {Object} asteroid - The asteroid object involved in the collision.
   */
  handleBottleAsteroidHit(bottle, asteroid) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex > -1) {
      if (!this.isMuted) bottle.breakSound();
      bottle.breakAnimation(() => {
        this.bottles.splice(bottleIndex, 1);
      });
    }
  }

  /**
   * Handles a bottle hitting the boss by registering the hit and breaking the bottle.
   * @param {Object} bottle - The bottle object that hit the boss.
   */
  handleBottleBossHit(bottle) {
    this.handleBossHit();
    this.handleBossBottleBreak(bottle);
  }

  /**
   * Processes a hit on the endboss: reduces life, updates health bar, and handles death if life reaches zero.
   */
  handleBossHit() {
    if (this.endboss.isDead || !this.endboss.isAttackAble) return;

    this.endboss.endbossLifes--;
    this.updateBossHealthBar();

    if (this.endboss.endbossLifes <= 0) {
      this.handleBossDeath();
    }
  }

  /**
   * Updates the boss health bar UI based on the current percentage of boss life remaining.
   */
  updateBossHealthBar() {
    const percentLife =
      (this.endboss.endbossLifes / this.endboss.endbossMaxLifes) * 100;
    this.bossHealthBar.setPercentage(percentLife);
  }

  /**
   * Handles the death of the boss: stops boss music, plays winning sound, triggers death animation, and sets boss as dead.
   */
  handleBossDeath() {
    this.endAudio(this.bossMusic);
    this.playAudio(this.winSound);
    this.endboss.deathAnimation();
    this.isEndbossDead = true;
  }

  /**
   * Handles breaking of a bottle that hit the boss: animates breaking, plays sound if not muted, and removes bottle from array.
   * @param {Object} bottle - The bottle object to break.
   */
  handleBossBottleBreak(bottle) {
    const bottleIndex = this.bottles.indexOf(bottle);
    if (bottleIndex < 0) return;

    bottle.breakAnimation(() => {
      if (!this.isMuted) bottle.breakSound();
      this.bottles.splice(bottleIndex, 1);
    });
  }

  /**
   * Checks collisions between all bottles and enemies, asteroids, and the boss.
   * Calls appropriate handlers when collisions occur.
   */
  checkBottleHits() {
    this.bottles.forEach((bottle) => {
      this.checkBottleEnemyHits(bottle);
      this.checkBottleAsteroidHits(bottle);
      this.checkBottleBossHit(bottle);
    });
  }

  /**
   * Checks if a given bottle hits any enemies and handles the hit accordingly.
   * @param {Object} bottle - The bottle to check collisions for.
   */
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

  /**
   * Checks if a given bottle hits any asteroids and handles the collision.
   * @param {Object} bottle - The bottle to check collisions for.
   */
  checkBottleAsteroidHits(bottle) {
    this.asteroids.forEach((asteroid) => {
      if (!bottle.isBreaking && bottle.isColliding(asteroid)) {
        this.handleBottleAsteroidHit(bottle, asteroid);
      }
    });
  }

  /**
   * Checks if a given bottle hits the boss and handles the collision.
   * @param {Object} bottle - The bottle to check collisions for.
   */
  checkBottleBossHit(bottle) {
    if (!bottle.isBreaking && bottle.isColliding(this.endboss)) {
      this.handleBottleBossHit(bottle);
    }
  }

  /**
   * Starts spawning game entities: chickens, rocks, and planets.
   */
  startSpawning() {
    this.spawnManager.spawnChicken(this);
    this.spawnManager.spawnRock(this);
    this.spawnManager.spawnPlanet(this);
  }

  /**
   * Checks periodically if the chicken score is high enough to trigger the boss phase.
   * Starts boss music and movement when conditions are met.
   */
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

  /**
   * Pauses and resets the background music.
   */
  stopBackgroundMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  /**
   * Starts/resumes the background music.
   */
  startBackgroundMusic() {
    this.backgroundMusic.play();
  }

  /**
   * Pauses the given audio object.
   * @param {HTMLAudioElement} sound - The audio element to pause.
   */
  endAudio(sound) {
    sound.pause();
  }

  /**
   * Plays the given audio object if the game is not muted.
   * @param {HTMLAudioElement} sound - The audio element to play.
   */
  playAudio(sound) {
    if (this.isMuted) return;
    sound.play();
  }

  /**
   * Starts the boss music after a delay.
   */
  startBossMusic() {
    setTimeout(() => {
      this.bossMusic.play();
    }, 3000);
  }

  /**
   * Toggles game mute state and updates the sound button image.
   */
  isGameMuted() {
    if (this.isMuted) {
      this.muteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.NO_SOUND);
    } else {
      this.unmuteAllSounds();
      this.soundButton.loadImage(GAME_BUTTONS.SOUND);
    }
  }

  /**
   * Mutes and pauses all major game audio tracks.
   */
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

  /**
   * Unmutes all major game audio tracks and resumes appropriate music based on game state.
   */
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

  /**
   * Determines which music to play based on the current game state:
   * - If the endboss is active, plays boss music.
   * - Otherwise, plays background music.
   * Does not play any music if the endboss is already dead.
   */
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

  /**
   * Loads the mute state from local storage and applies it.
   * Also updates the sound button image based on mute status.
   */
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