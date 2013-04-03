var mode01 = require('./mode01');

var Transform = require('stream').Transform;

function splitBytes(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i+=2) {
    bytes.push( str.substr(i,2) );
  }
  return bytes;
}

function OBDParser(options, streamOptions) {
  if (!(this instanceof OBDParser)) {
    return new OBDParser(options, streamOptions);
  }

  Transform.call(this, streamOptions);

  options = options || {};

  this.mode01 = mode01;
}

OBDParser.prototype = Object.create(
  Transform.prototype, {
    constructor: {
      value: OBDParser
    }
  }
);

OBDParser.prototype._transform = function(chunk, encoding, done) {

  var str = chunk.toString();
  str = str.charCodeAt(0) === 13 ? str.slice(1) : str;

  var res = {};
  res.time = Date.now();

  var bytes = splitBytes( str );

  if ( bytes[0] === '41' ) {

    var pid  = bytes[1],
        data = bytes.slice(2);

    res.mode = '01';
    res.type = mode01[pid].name;
    res.value = mode01[pid].parse(data);

  } else if ( bytes[0] === 'OK' ) {
    res.mode = 'AT';
    res.type = 'OK';
    res.value = 'OK';

  } else if ( bytes[0] === 'AT' ) {
    res.mode = 'AT';
    res.type = str.slice(2);
    res.value = 'command';

  } else if ( str === 'NO DATA' ) {
    res.mode = 'error';
    res.type = 'nodata';
    res.value = 'NO DATA';

  } else {
    res.mode = 'error';
    res.type = 'unknown';
    res.value = '';

  }

  res.raw = str.trim();

  try {
    this.push(JSON.stringify(res)+'\r');
  } catch (err) {
    this.emit('error', err);
    this.push('');
  }

  done();
};

module.exports = OBDParser;
