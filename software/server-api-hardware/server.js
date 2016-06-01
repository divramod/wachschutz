var Gpio = require('onoff').Gpio;
var led = new Gpio(14, 'out');
var button = new Gpio(4, 'in', 'both');

console.log("started");
//button.watch(function (err, value) {
  //if (err) {
    //throw err;
  //}

  //led.writeSync(value);
//});

//process.on('SIGINT', function () {
  //led.unexport();
  //button.unexport();
//});
