function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(0); // Set background to black
  fill(255); // Set shapes to white

  let touchCount = touches.length;

  if (touchCount === 1) {
    // One touch point: Draw a circle
    ellipse(touches[0].x, touches[0].y, 50, 50);
  } else if (touchCount === 2) {
    // Two touch points: Draw a square
    for (let i = 0; i < 2; i++) {
      rectMode(CENTER);
      rect(touches[i].x, touches[i].y, 50, 50);
    }
  } else if (touchCount >= 3) {
    // Three or more touch points: Draw a triangle
    for (let i = 0; i < touchCount; i++) {
      let side = 50;
      let h = side * (sqrt(3) / 2);
      triangle(
        touches[i].x,
        touches[i].y - h / 2,
        touches[i].x - side / 2,
        touches[i].y + h / 2,
        touches[i].x + side / 2,
        touches[i].y + h / 2
      );
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
