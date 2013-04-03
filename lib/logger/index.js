var Transform = require('stream').Transform;

function Logger(options, streamOptions) {
  if (!(this instanceof Logger)) {
    return new Logger(options, streamOptions);
  }

  Transform.call(this, streamOptions);

  options = options || {};
}

Logger.prototype = Object.create(
  Transform.prototype, {
    constructor: {
      value: Logger
    }
  }
);

Logger.prototype._transform = function(chunk, encoding, done) {
  if ( chunk ) {
    this.push(chunk.toString());
  } else {
    this.push('');
  }
  return done();
};

module.exports = Logger;
