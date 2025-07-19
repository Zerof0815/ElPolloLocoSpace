class EndGameScreen extends DrawableObject {
  x;
  y;
  height = 207 / 2;
  width = 987 / 2;
  winOrLoseImg;

  constructor(canvasWidth, canvasHeight, winOrLoseImg) {
    super();
    this.x = (canvasWidth - this.width) / 2;
    this.y = (canvasHeight - this.height) / 2;
    this.loadImage(winOrLoseImg);
  }
}