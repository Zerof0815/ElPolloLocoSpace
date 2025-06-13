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
      Math.floor(Math.random() * 300),
      Math.floor(Math.random() * 380),
      100,
      100,
      0.3
    )
    ],
    [],
);