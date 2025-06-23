class DrawableObject {
  imageCache = {};
  currentImage = 0;
  img;

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
}