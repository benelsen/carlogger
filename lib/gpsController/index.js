var Writeable = require('stream').Writeable;

var GPSInterface  = require('../gpsInterface'),
    GPSParser     = require('../gpsParser');


function GPS(options, streamOptions) {
  if (!(this instanceof GPS)) {
    return new GPS(options, streamOptions);
  }

  Writeable.call(this, streamOptions);

  options = options || {};

  this.parser = new GPSParser();
  this.inter  = new GPSInterface(options.device);

  this.inter.pipe(this.parser).pipe(this);

  var _this = this;
  this.inter.on('open', function() {
    _this.emit('open');
  });
}

GPS.prototype = Object.create(
  Writeable.prototype, {
    constructor: {
      value: GPS
    }
  }
);

GPS.prototype.sendCommand = function(cmd) {
  this.inter.write(cmd+'\r\n');
};

GPS.prototype._write = function(chunk, encoding, done) {
  var data = JSON.parse(chunk);

  this.emit(data.type, data);

  done();
};

module.exports = GPS;
