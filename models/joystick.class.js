class Joystick {
  constructor(containerId, stickId, keyboard) {
    this.joystick = document.getElementById(containerId);
    this.stick = document.getElementById(stickId);
    this.keyboard = keyboard;

    this.dragging = false;
    this.maxDistance = 50;

    this.joystick.addEventListener("touchstart", (e) => this.start(e), false);
    this.joystick.addEventListener("touchmove", (e) => this.move(e), false);
    this.joystick.addEventListener("touchend", (e) => this.end(e), false);

    this.joystick.addEventListener("mousedown", (e) => this.start(e), false);
    window.addEventListener("mousemove", (e) => this.move(e), false);
    window.addEventListener("mouseup", (e) => this.end(e), false);
  }

  /**
   * Starts joystick interaction and stores the touch identifier (if applicable).
   * @param {TouchEvent | MouseEvent} e - The input event that triggered the start.
   */
  start(e) {
    this.dragging = true;
    //save for multible fingers on touchscreen
    if (e && e.changedTouches) {
      this.touchId = e.changedTouches[0].identifier;
    }
  }

  /**
   * Handles movement of the joystick, updating the visual stick position
   * and directional input states.
   * @param {TouchEvent | MouseEvent} e - The input event that triggered the movement.
   */
  move(e) {
    if (!this.dragging) return;

    const { clientX, clientY } = this.getClientCoordinates(e);
    if (clientX === null || clientY === null) return;

    const { x, y } = this.calculateStickPosition(clientX, clientY);
    this.updateStickTransform(x, y);
    this.updateDirectionStates(x, y);
  }

  /**
   * Extracts clientX and clientY from either a mouse or matching touch event.
   * @param {TouchEvent | MouseEvent} e - The input event.
   * @returns {{clientX: number|null, clientY: number|null}} The coordinates or null if touch not found.
   */
  getClientCoordinates(e) {
    if (e.touches) {
      const touch = Array.from(e.touches).find(
        (t) => t.identifier === this.touchId
      );
      if (!touch) return { clientX: null, clientY: null };
      return { clientX: touch.clientX, clientY: touch.clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }

  /**
   * Calculates the new stick position within the max distance from the center.
   * @param {number} clientX - The current pointer x-position.
   * @param {number} clientY - The current pointer y-position.
   * @returns {{x: number, y: number}} New x and y offsets for the stick.
   */
  calculateStickPosition(clientX, clientY) {
    const rect = this.joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const distance = Math.min(this.maxDistance, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);

    return {
      x: distance * Math.cos(angle),
      y: distance * Math.sin(angle),
    };
  }

  /**
   * Updates the visual position of the joystick stick element using CSS transform.
   * @param {number} x - Offset x from center.
   * @param {number} y - Offset y from center.
   */
  updateStickTransform(x, y) {
    this.stick.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
  }

  /**
   * Updates the directional state flags (UP, DOWN, LEFT, RIGHT) on the keyboard object
   * based on joystick movement.
   * @param {number} x - Offset x from center.
   * @param {number} y - Offset y from center.
   */
  updateDirectionStates(x, y) {
    const normalizedX = x / this.maxDistance;
    const normalizedY = y / this.maxDistance;

    this.keyboard.UP = normalizedY < -0.3;
    this.keyboard.DOWN = normalizedY > 0.3;
    this.keyboard.LEFT = normalizedX < -0.3;
    this.keyboard.RIGHT = normalizedX > 0.3;
  }

  /**
   * Ends the joystick interaction, resets visual stick position,
   * and clears directional input flags.
   * @param {TouchEvent | MouseEvent} e - The input event that ended the interaction.
   */
  end(e) {
    this.dragging = false;
    this.stick.style.transform = `translate(-50%, -50%)`;

    this.keyboard.UP = false;
    this.keyboard.DOWN = false;
    this.keyboard.LEFT = false;
    this.keyboard.RIGHT = false;
  }
}
