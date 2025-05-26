class Chicken extends MovableObject {
  x = 550;
  y = Math.floor(Math.random() * 400) + 10;
  height = 75;
  width = 50;

  constructor() {
    super().loadImage(
      "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
  }
}