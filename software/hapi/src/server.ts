/// <reference path="../typings.d.ts" />
import {IPlugin} from "./libs/plugins/interfaces";
import Configurations from "./configs/configurations";
import * as Hapi from "hapi";
import Routes from "./routes";
const fs = require('fs');
const path = require('path');
var Gpio = require('onoff').Gpio;
var led = new Gpio(14, 'out');
var button = new Gpio(4, 'in', 'both');

button.watch(function (err, value) {
  if (err) {
    throw err;
  }

  if (value) {
    console.log("button pressed");
  } else {
    console.log("button released");
  }
  led.writeSync(value);
});

process.on('SIGINT', function () {
  led.unexport();
  button.unexport();
});

var port = process.env.port || Configurations.Server.port;
var server = new Hapi.Server();

server.connection({ port: port });

//  Setup Hapi Plugins
const pluginsPath = __dirname + '/libs/plugins/';
const plugins = fs.readdirSync(pluginsPath).filter(file => fs.statSync(path.join(pluginsPath, file)).isDirectory());

plugins.forEach((pluginName: string) => {
    var plugin: IPlugin = (require("./libs/plugins/" + pluginName)).default();      
    console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
    plugin.register(server);
});

//Register Routes
Routes(server);

server.start(function() {
    console.log('Server running at:', server.info.uri);
});
