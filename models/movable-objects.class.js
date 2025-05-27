class MovableObject {
    x;
    y;
    img;
    height;
    width;
    imageCache = [];

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log("move right");
    }

    moveLeft() {

    }
}