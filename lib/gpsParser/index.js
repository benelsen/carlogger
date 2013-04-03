var Transform = require('stream').Transform;

var parse = require('./parse');

function GPSParser(options, streamOptions) {
  if (!(this instanceof GPSParser)) {
    return new GPSParser(options, streamOptions);
  }

  Transform.call(this, streamOptions);

  options = options || {};
}

GPSParser.prototype = Object.create(
  Transform.prototype, {
    constructor: {
      value: GPSParser
    }
  }
);

GPSParser.prototype._transform = function(chunk, encoding, done) {
  var str = chunk.toString().trim().slice(1,-3);

  var data = str.split(',');

  var res = {};

  if ( data[0].slice(0,1) === 'GP') {
    res = parse['GP'][data[0].slice(2)](data);
  }

  this.push(res);
  done();
};

module.exports = GPSParser;
