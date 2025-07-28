class ButtonController {
  constructor(canvas, buttons, world) {
    this.canvas = canvas;
    this.buttons = buttons;
    this.world = world;

    this.registerHoverEffect();
    this.registerClickEvents();
  }

  registerHoverEffect() {
    this.canvas.addEventListener("mousemove", (event) => {
      const { x, y } = this.getPointerPosition(event);
      const isHovering = this.buttons.some((btn) => btn.isHovered(x, y));
      this.canvas.style.cursor = isHovering ? "pointer" : "default";
    });
  }

  registerClickEvents() {
    const handleClick = (event) => {
      const { x, y } = this.getPointerPosition(event);
      this.buttons.forEach((btn) => btn.handleClick(x, y));
    };

    this.canvas.addEventListener("click", handleClick);
    this.canvas.addEventListener("touchstart", handleClick);
  }

  getPointerPosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    const isTouch = event.touches && event.touches.length > 0;

    const clientX = isTouch ? event.touches[0].clientX : event.clientX;
    const clientY = isTouch ? event.touches[0].clientY : event.clientY;

    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }
}
