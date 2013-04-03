var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var Transform = require('stream').Transform;

function OBDInterface(device, options, streamOptions) {
  if (!(this instanceof OBDInterface)) {
    return new OBDInterface(device, options, streamOptions);
  }

  Transform.call(this, streamOptions);

  options = options || {};

  this._open = false;

  // Open

  this.port = new SerialPort(device, {
    baudrate: 38400,
    parser: serialport.parsers.readline('>')
  }, options.openImmediately || true);

  // *** Handle upstream events *** //

  var _this = this;
  this.port.on('open', function() {
    _this._open = true;
    _this._setup();

    // This really has to be changed, it’s an awful thing to do:
    setTimeout(function() {
      _this.emit('open');
    }, 1000);

  });

  this.port.on('close', function() {
    _this._open = false;
    _this.emit('close');
  });

  // this.port.once('error', function(err) {
  //   _this.emit('error', err);
  // });
}

OBDInterface.prototype = Object.create(
  Transform.prototype, {
    constructor: {
      value: OBDInterface
    }
  }
);

OBDInterface.prototype._setup = function() {
  this.write('ATZ\r');
  this.write('ATE0\r');
  this.write('ATS0\r');
  this.write('ATL0\r');
  this.write('ATH0\r');
  this.write('ATAT2\r');
};

OBDInterface.prototype._transform = function(chunk, encoding, done) {

  if ( this._open ) {

    this.port.write(chunk);

    var _this = this;
    this.port.once('data', function(data) {

      if ( data ) {
        _this.push(data);
      } else {
        _this.push('');
      }
      done();

    });

  } else {

    this.push('not ready');
    done();

  }
};

module.exports = OBDInterface;
