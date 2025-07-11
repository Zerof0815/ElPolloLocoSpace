class Joystick {
  constructor(containerId, stickId, keyboard) {
    this.joystick = document.getElementById(containerId);
    this.stick = document.getElementById(stickId);
    this.keyboard = keyboard;

    this.dragging = false;
    this.maxDistance = 50;

    this.joystick.addEventListener("touchstart", () => this.start(), false);
    this.joystick.addEventListener("touchmove", (e) => this.move(e), false);
    this.joystick.addEventListener("touchend", () => this.end(), false);

    this.joystick.addEventListener("mousedown", () => this.start(), false);
    window.addEventListener("mousemove", (e) => this.move(e), false);
    window.addEventListener("mouseup", () => this.end(), false);
  }

  start() {
    this.dragging = true;
  }

  move(e) {
    if (!this.dragging) return;

    const rect = this.joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let clientX, clientY;

    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const distance = Math.min(this.maxDistance, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);

    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);

    this.stick.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;

    const normalizedX = x / this.maxDistance;
    const normalizedY = y / this.maxDistance;

    this.keyboard.UP = normalizedY < -0.3;
    this.keyboard.DOWN = normalizedY > 0.3;
    this.keyboard.LEFT = normalizedX < -0.3;
    this.keyboard.RIGHT = normalizedX > 0.3;
  }

  end() {
    this.dragging = false;
    this.stick.style.transform = `translate(-50%, -50%)`;

    this.keyboard.UP = false;
    this.keyboard.DOWN = false;
    this.keyboard.LEFT = false;
    this.keyboard.RIGHT = false;
  }
}
