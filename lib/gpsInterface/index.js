/* jslint node: true */
'use strict';

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var Duplex = require('stream').Duplex;

function GPSInterface(options, streamOptions) {
  if (!(this instanceof GPSInterface)) {
    return new GPSInterface(options, streamOptions);
  }

  Duplex.call(this, streamOptions);

  options = options || {};

  this._open = false;
  this._closing = false;

  // Open

  this.port = new SerialPort(options.device, {
    baudrate: (+options.baudrate),
    parser: serialport.parsers.readline('\r\n')
  }, false);

  this.port.on('data', function(data) {
    _this.push(data);
  });

  // *** Handle serial port events *** //

  var _this = this;
  this.port.on('open', function() {
    _this._open = true;
    _this.emit('connected');
  });

  this.port.on('close', function() {
    _this._open = false;

    if ( _this._closing ) {
      _this._closing = false;

    } else {
      _this.reconnect();
    }

    _this.emit('disconnected');
  });

  this.port.on('error', function(err) {
    _this.emit('error', err);
  });

  // this.connect();
}

GPSInterface.prototype = Object.create(
  Duplex.prototype, {
    constructor: {
      value: GPSInterface
    }
  }
);

GPSInterface.prototype.connect = function() {
  this.port.open();
};

GPSInterface.prototype.disconnect = function() {
  this._closing = true;
  this.port.close();
};

GPSInterface.prototype.reconnect = function() {
  this.reconnectInterval = setInterval(function() {

    if ( this._open ) {
      this.connect();
    } else {
      clearInterval(this.reconnectInterval);
    }

  }, 1000);
};

GPSInterface.prototype._read = function() {
  return true;
};

GPSInterface.prototype._write = function(chunk, encoding, done) {
  this.port.write(chunk.toString()+'\r\n');
  done();
};

module.exports = GPSInterface;
