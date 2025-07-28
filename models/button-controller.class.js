class ButtonController {
  constructor(canvas, buttons, world) {
    this.canvas = canvas;
    this.buttons = buttons;
    this.world = world;

    this.registerHoverEffect();
    this.registerClickEvents();
  }

  /**
   * Registers a mousemove listener to update the cursor style
   * when hovering over interactive buttons on the canvas.
   */
  registerHoverEffect() {
    this.canvas.addEventListener("mousemove", (event) => {
      const { x, y } = this.getPointerPosition(event);
      const isHovering = this.buttons.some((btn) => btn.isHovered(x, y));
      this.canvas.style.cursor = isHovering ? "pointer" : "default";
    });
  }

  /**
   * Registers click and touchstart events to trigger button click handlers
   * based on pointer position.
   */
  registerClickEvents() {
    const handleClick = (event) => {
      const { x, y } = this.getPointerPosition(event);
      this.buttons.forEach((btn) => btn.handleClick(x, y));
    };

    this.canvas.addEventListener("click", handleClick);
    this.canvas.addEventListener("touchstart", handleClick);
  }

  /**
   * Calculates the pointer position (mouse or touch) relative to the canvas coordinates,
   * taking canvas scaling into account.
   * @param {MouseEvent | TouchEvent} event - The event triggered by user interaction.
   * @returns {{x: number, y: number}} Scaled x and y coordinates within the canvas.
   */

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
