const five = require("johnny-five");
const board = new five.Board({ port: "COM4" });

console.log("Board waiting for connection...");

let max_speed_l = 150;
let max_speed_r = 140;
let minDistance = 0.5;
let maxDistance = 3;

// set up the input
const stdin = process.stdin;
stdin.setRawMode(true);

let l_motor,
  r_motor = null;

function allStop() {
  l_motor.stop();
  r_motor.stop();
}

function forward() {
  l_motor.reverse(max_speed_l);
  r_motor.forward(max_speed_r);
}

function reverse() {
  r_motor.reverse(max_speed_r);
  l_motor.forward(max_speed_l);
}

function left() {
  l_motor.forward(max_speed_l);
  r_motor.forward(max_speed_r);
}

function right() {
  r_motor.reverse(max_speed_r);
  l_motor.reverse(max_speed_l);
}

board.on("ready", function (err) {
  if (err) {
    console.log(err);
    return;
  }

  l_motor = new five.Motor({ pins: { pwm: 6, dir: 7 } });
  r_motor = new five.Motor({ pins: { pwm: 5, dir: 4 } });

  console.log("Board Connected, Ready to use...");

  sonarSensor();
});

function sonarSensor() {
  const proximity = new five.Proximity({
    freq: 50,
    controller: "HCSR04",
    pin: 10,
  });

  proximity.on("data", () => {
    console.log("inches: ", proximity.in);
    console.log("centimeter: ", proximity.cm);
    console.log("id: ", proximity.id);
  });

  proximity.within([minDistance, maxDistance], "inches", () => {
    allStop();
    reverse();
  });
}

stdin.on("keypress", function (chunk, key) {
  // process the keypresses

  if (key) {
    switch (key.name) {
      case "up":
        forward();
        break;
      case "down":
        reverse();
        break;
      case "left":
        left();
        break;
      case "right":
        right();
        break;
      case "space":
        allStop();
        break;
    }
  }
});
