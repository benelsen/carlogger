/* jslint node: true */
'use strict';

var mode01 = require('./mode01');

var Transform = require('stream').Transform;

function splitBytes(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i+=2) {
    bytes.push( str.substr(i,2) );
  }
  return bytes;
}

function OBDParser(options) {
  if (!(this instanceof OBDParser)) {
    return new OBDParser(options);
  }

  var streamOptions = {};

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

  var data = JSON.parse(chunk);

  data.req = data.req.trim();
  data.res = data.res.trim();

  if ( /[\n\r]/.test(data.res) ) {
    var lastIndexn = data.res.lastIndexOf('\n'),
        lastIndexr = data.res.lastIndexOf('\r'),
        i = lastIndexn > lastIndexr ? lastIndexn : lastIndexr;

    data.res = data.res.slice(i+1);
  }

  var resBytes = splitBytes( data.res ),
      reqBytes = splitBytes( data.req );

  var res = {
    time:   new Date(),
    source: 'obd',
    query:  data.req,
    mode:   reqBytes[0],
    raw:    data.res
  };

  if ( resBytes[0] === '41' ) {

    var pid = resBytes[1],
        name = mode01[pid].name,
        value = mode01[pid].parse( resBytes.slice(2) );

    res.type  = name;
    res.value = value;
    res[name] = value;

  } else if ( resBytes[0] === 'OK' ) {
    res.type = 'OK';
    res.value = 'OK';

  } else if ( data.res === 'NO DATA' ) {
    res.type = 'nodata';
    res.value = 'NO DATA';

  } else {
    res.type = 'unknown';
    res.value = data.res;

  }

  try {
    var json = JSON.stringify(res);
    // console.log(json);
    this.push( json );
  } catch (err) {
    this.emit('error', err);
  }

  done();
};

module.exports = OBDParser;
