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

  // Open

  this.port = new SerialPort(options.device, {
    baudrate: options.baudrate,
    parser: serialport.parsers.readline('\r\n')
  }, options.openImmediately || true);

  this.port.on('data', function(data) {
    _this.push(data);
  });

  // *** Handle upstream events *** //

  var _this = this;
  this.port.on('open', function() {
    _this._open = true;
    _this.emit('open');
    // _this._setup();

    // This really has to be changed, it’s an awful thing to do:
    // setTimeout(function() {
    //   _this.emit('open');
    // }, 1000);

  });

  this.port.on('close', function() {
    _this._open = false;
    _this.emit('close');
  });

}

GPSInterface.prototype = Object.create(
  Duplex.prototype, {
    constructor: {
      value: GPSInterface
    }
  }
);

GPSInterface.prototype._read = function() {
  return true;
};

GPSInterface.prototype._write = function(chunk, encoding, done) {
  console.log(chunk.toString());
  this.port.write(chunk.toString()+'\r\n');
  done();
};

module.exports = GPSInterface;
