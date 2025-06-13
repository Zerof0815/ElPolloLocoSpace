const level1 = new Level(
    [
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
    )
    ],
    [],
);