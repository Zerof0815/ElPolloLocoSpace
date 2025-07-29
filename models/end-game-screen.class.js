class EndGameScreen extends DrawableObject {
  x;
  y;
  height = 207 / 2;
  width = 987 / 2;
  winOrLoseImg;

  /**
   * Creates an end-game screen (win or lose) and centers it on the canvas.
   *
   * @constructor
   * @param {number} canvasWidth - Width of the canvas.
   * @param {number} canvasHeight - Height of the canvas.
   * @param {string} winOrLoseImg - Image path for the win or lose screen.
   */
  constructor(canvasWidth, canvasHeight, winOrLoseImg) {
    super();
    this.x = (canvasWidth - this.width) / 2;
    this.y = (canvasHeight - this.height) / 2;
    this.loadImage(winOrLoseImg);
  }
}