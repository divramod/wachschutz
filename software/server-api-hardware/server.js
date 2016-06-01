var Gpio = require('onoff').Gpio;
var led = new Gpio(14, 'out');
var button = new Gpio(4, 'in', 'both');

button.watch(function (err, value) {
  if (err) {
    throw err;
  }
  console.log("button pressed with value: ", value);
  led.writeSync(value);
});

process.on('SIGINT', function () {
  led.unexport();
  button.unexport();
});
