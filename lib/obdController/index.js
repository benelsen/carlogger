var stream = require('stream'),
    _ = require('underscore');

var Transform = stream.Transform,
    PassThrough = stream.PassThrough,
    Writeable;

var OBDInterface  = require('../obdInterface'),
    OBDParser     = require('../obdParser');

function OBD(options, streamOptions) {
  if (!(this instanceof OBD)) {
    return new OBD(options, streamOptions);
  }

  Transform.call(this, streamOptions);

  options = options || {};

  this.input = new PassThrough();

  this.parser = new OBDParser();
  this.inter  = new OBDInterface(options.device);

  this.input.pipe(this.inter).pipe(this.parser).pipe(this);

  var _this = this;
  this.inter.on('open', function() {
    _this.emit('open');
  });
}

OBD.prototype = Object.create(
  Transform.prototype, {
    constructor: {
      value: OBD
    }
  }
);

OBD.prototype.queryByPID = function(pid) {
  this.inter.write(pid+'\r');
};

OBD.prototype.queryByName = function(name, mode) {
  mode = mode || '01';

  // Lookup PID
  var pid = _.find( this.parser.mode01, function(obj) {
    return obj.name === name;
  }).pid;

  this.inter.write(mode + pid +'\r');
};

OBD.prototype._transform = function(chunk, encoding, done) {
  if ( chunk ) {
    this.push(chunk);
  } else {
    this.push('');
  }
  done();
};

module.exports = OBD;
