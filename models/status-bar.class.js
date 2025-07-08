class StatusBar extends DrawableObject {
  x;
  y;
  height;
  width;
  percentage = 100;
  healthBarImg;

  constructor(x, y, height, width, healthBarImg) {
    super().loadImagesIntoCache(healthBarImg);
    this.healthBarImg = healthBarImg;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.setPercentage(100);
  }

  setPercentage(percentage) {
    this.percentage = percentage;
    let index = Math.floor(this.percentage / 20);
    index = Math.min(index, this.healthBarImg.length - 1);
    const path = this.healthBarImg[index];
    this.img = this.imageCache[path];
  }
}