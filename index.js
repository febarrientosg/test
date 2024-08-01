let touchInteractions = [];
let gestureCount = 0;
let gestureEndTime = 0;
let isMoving = false;
const GESTURE_INTERVAL = 500; // Time in milliseconds for gesture separation
const FONT_SIZE = 20;
const TEXT_COLOR = 255;
const LINE_COLOR = 255;
const LINE_WEIGHT = 20; // Increased line thickness
const CURVE_TIGHTNESS = 0.1; // Control the curvature of the lines

// Visibility controls
const SHOW_TOUCH_COUNTER = true;
const SHOW_GESTURE_TIMER = true;
const SHOW_INTERACTION_DATA = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textSize(FONT_SIZE);
  fill(TEXT_COLOR);
}

function draw() {
  background(0);
  drawInteractions();
  if (SHOW_TOUCH_COUNTER) {
    displayInteractionCounter();
  }
  if (SHOW_GESTURE_TIMER) {
    displayGestureTimer();
  }
  if (SHOW_INTERACTION_DATA) {
    displayInteractionData();
  }
}

function drawInteractions() {
  stroke(LINE_COLOR);
  strokeWeight(LINE_WEIGHT); // Set line thickness
  noFill();
  curveTightness(CURVE_TIGHTNESS); // Set the curve tightness

  for (let interaction of touchInteractions) {
    for (let finger of interaction) {
      if (finger.length === 1) {
        let touchPoint = finger[0];
        line(touchPoint.x, touchPoint.y, touchPoint.x, touchPoint.y);
      } else {
        beginShape();
        let firstPoint = finger[0];
        let lastPoint = finger[finger.length - 1];

        // Starting with the first point to provide curve context
        curveVertex(firstPoint.x, firstPoint.y);

        for (let touchPoint of finger) {
          curveVertex(touchPoint.x, touchPoint.y);
        }

        // Ending with the last point to complete the curve
        curveVertex(lastPoint.x, lastPoint.y);
        endShape();
      }
    }
  }
}

function displayInteractionCounter() {
  fill(TEXT_COLOR);
  noStroke();
  text("Touch Interactions: " + gestureCount, 10, 30);
}

function displayGestureTimer() {
  fill(TEXT_COLOR);
  noStroke();
  let timeLeft;
  if (isMoving) {
    text("Time left: —", 10, height - 30);
  } else {
    timeLeft = max(0, GESTURE_INTERVAL - (millis() - gestureEndTime));
    text("Time left: " + nf(timeLeft / 1000, 1, 1) + "s", 10, height - 30);

    if (timeLeft <= 0 && gestureCount > 0) {
      // Reset for the new gesture
      touchInteractions = [];
      gestureCount = 0;
    }
  }
}

function displayInteractionData() {
  fill(TEXT_COLOR);
  noStroke();
  let yOffset = 60; // Starting y position for touch interaction data
  for (let i = 0; i < touchInteractions.length; i++) {
    let interaction = touchInteractions[i];
    for (let j = 0; j < interaction.length; j++) {
      let finger = interaction[j];
      let start = finger[0];
      let end = finger[finger.length - 1];
      text(`TI ${i + 1} [`, 10, yOffset);
      text(`s: ${start.x}, ${start.y}`, 40, yOffset + 20);
      text(`e: ${end.x}, ${end.y}`, 40, yOffset + 40);
      text("]", 10, yOffset + 60);
      yOffset += 80; // Increment y position for next interaction
    }
  }
}

function touchStarted() {
  // Initialize new interactions for each finger
  let newInteraction = [];
  for (let i = 0; i < touches.length; i++) {
    newInteraction.push([{ id: touches[i].id, x: touches[i].x, y: touches[i].y }]);
  }
  if (newInteraction.length > 0) {
    touchInteractions.push(newInteraction);
    gestureCount += newInteraction.length;
    gestureEndTime = millis(); // Record the time at which the touch starts
  }
}

function touchMoved() {
  isMoving = true;
  if (touchInteractions.length > 0) {
    let currentInteraction = touchInteractions[touchInteractions.length - 1];
    for (let i = 0; i < touches.length; i++) {
      let point = { id: touches[i].id, x: touches[i].x, y: touches[i].y };
      // Find the finger interaction to update
      let fingerInteraction = currentInteraction.find(
        (interaction) => interaction[0].id === point.id
      );
      if (fingerInteraction) {
        fingerInteraction.push(point);
      }
    }
  }
}

function touchEnded() {
  isMoving = false;
  gestureEndTime = millis(); // Update the end time when the touch ends
}
