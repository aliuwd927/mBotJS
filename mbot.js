const five = require("johnny-five");
/*
Left Motor Pin: 6, Dir: 7
Right Motor Pin: 5, Dir:4
Sonar Sensor Pin 10
Sonar Controller: "HCSR04"

*/

const board = new five.Board({ port: "COM4" });

const left_motor_max_speed = 150;
const right_motor_max_speed = 140;
const stdin = process.stdin;
stdin.setRawMode(true);

let left_motor,
  right_motor = null;

//Led pin 13 middle blue light.
//When board is on, blue light flashes.
board.on("ready", () => {
  console.log("Hello World");
  //Constant blue light on.
  const led = new five.Led(13);
  led.on();

  left_motor = new five.Motors([6, 7]);
  right_motor = new five.Motors([5, 4]);
});

stdin.on("keypress", (chunk, key) => {
  if (key) {
    switch (key.name) {
      case "up":
        left_motor.reverse(left_motor_max_speed);
        right_motor.forward(right_motor_max_speed);
        break;
      case "down":
        right_motor.reverse(right_motor_max_speed);
        left_motor.forward(left_motor_max_speed);
        break;
      case "left":
        left_motor.forward(left_motor_max_speed);
        right_motor.forward(right_motor_max_speed);
        break;
      case "right":
        right_motor.reverse(right_motor_max_speed);
        left_motor.reverse(left_motor_max_speed);
        break;
      case "space":
        left_motor.stop();
        right_motor.stop();
        break;
    }
  }
});
