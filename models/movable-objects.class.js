class MovableObject {
  x;
  y;
  img;
  height;
  width;
  imageCache = [];
  currentImage = 0;
  speed;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImagesIntoCache(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {
    console.log("move right");
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 30);
  }
}