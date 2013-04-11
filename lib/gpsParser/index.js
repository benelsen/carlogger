/* jslint node: true */
'use strict';

var Transform = require('stream').Transform;

var parse = require('./parse');

function GPSParser(options, streamOptions) {
  if (!(this instanceof GPSParser)) {
    return new GPSParser(options, streamOptions);
  }

  Transform.call(this, streamOptions);

  options = options || {};

  this._gpgsvCache = [];
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

  var res = {
    source: 'gps'
  };

  if ( data[0].slice(0,2) === 'GP' ) {
    res = parse.GP[data[0].slice(2)](data);

    if ( res.type === 'gsv' ) {

      if ( res.messageNumber === res.numberOfMessages ) {
        this._gpgsvCache.push(res);

        // var satellites = this._gpgsvCache.reduce(function(sats, msg) {
        //   return sats.concat( msg.satellites );
        // }, []);

        res = {
          type:               'gsv',
          time:               res.time,
          numberOfSatellites: res.numberOfSatellites,
          satellites:         this._gpgsvCache.reduce(function(sats, msg) { return sats.concat( msg.satellites ); }, []),
          raw:                this._gpgsvCache.reduce(function(sats, msg) { return sats.concat( msg.raw ); }, [])
        };

        this._gpgsvCache = [];

      } else {
        this._gpgsvCache.push(res);
        res = '';
      }

    }

  } else {
    res.type = 'unknown';
    res.raw = str;
  }

  try {
    this.push( JSON.stringify(res) );
  } catch (err) {
    this.emit('error', err);
    // this.push('');
  }

  done();
};

module.exports = GPSParser;
