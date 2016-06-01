var Gpio = require('onoff').Gpio;
console.log("hello world");
var led = new Gpio(14, 'out');
var button = new Gpio(4, 'in', 'both');

button.watch(function(err, value) {
  led.writeSync(value);
});
