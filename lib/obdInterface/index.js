/* jslint node: true */
'use strict';

var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var Duplex = require('stream').Duplex;

function OBDInterface(options) {
  if (!(this instanceof OBDInterface)) {
    return new OBDInterface(options);
  }

  var streamOptions = {
    highWaterMark: 16,
    objectMode: true,
    encodung: 'utf8'
  };

  Duplex.call(this, streamOptions);

  options = options || {};

  // Open

  this.port = new SerialPort(options.device, {
    baudrate: 38400,
    parser: parser()
  }, false);

  // Cache

  this._cache = [];

  this._waitFor = false;
  this._discard = true;
  this._open = false;
  this._closing = false;

  // *** Handle serial port events *** //

  var _this = this;

  this.on('connected', function() {
    _this._open = true;
  });

  this.on('disconnected', function() {
    _this._open = false;
  });

  this.on('idle', function() {
  });

  // this.connect();
}

OBDInterface.prototype = Object.create(
  Duplex.prototype, {
    constructor: {
      value: OBDInterface
    }
  }
);

OBDInterface.prototype._setupListeners = function() {

  var _this = this;

  this.port.removeAllListeners();

  this.port.on('open', function() {
    _this._setup();

    _this._connecting = false;

    _this._cache = [];
    if ( _this._reconnectIV ) clearInterval(_this._reconnectIV);

    _this.emit('idle');
  });

  this.port.on('close', function() {
    _this.emit('disconnected');
    _this._discard = true;

    if ( !_this._closing ) {
      _this.reconnect();
    } else {
      _this._closing = false;
    }
  });

  this.port.on('end', function() {
    // _this.emit('end');
  });

  this.port.on('error', function(err) {
    _this.emit('error', err);

    if ( err && err.toString().indexOf('Cannot open') > -1 ) {
      _this._connecting = false;
    }

  });

  this.port.on('data', function(chunk) {
    if ( !chunk ) return _this.emit('idle');

    if ( chunk.toString() === '>' ) {

      if ( _this._waitFor && _this._waitFor === _this._cache[0] ) {
        _this._waitFor = false;
        _this._cache = [];
        _this._first = true;
        _this.emit('connected');
        _this.emit('idle');
        return;
      }

      var data = {
        req: _this._cache[0],
        res: _this._cache.slice(1).join('')
      };

      _this._cache = [];

      if ( _this._open ) _this.push( JSON.stringify( data ) );
      _this.emit('idle');

    } else {
      _this._cache.push( chunk );
    }

  });

};

OBDInterface.prototype.connect = function() {
  if ( this._connecting ) return;
  this._connecting = true;

  this._setupListeners();
  this.port.open();
};

OBDInterface.prototype.disconnect = function() {
  this._closing = true;
  this.port.close();
};

OBDInterface.prototype.reconnect = function() {
  var _this = this;
  this._reconnectIV = setInterval(function() {
    _this.connect();
  }, 2000);
};

OBDInterface.prototype._setup = function() {
  this.write('SETUP_INIT');
  this.write('ATZ');            // Reset
  this.write('ATL1');           // Line Feed
  this.write('ATS0');           // Spaces
  this.write('ATE1');           // Echo
  this.write('ATH0');           // Headers
  this.write('ATAT2');          // Adaptive Timing 2
  this.write('SETUP_COMPLETE');
};

OBDInterface.prototype._read = function() {
};

OBDInterface.prototype._write = function(chunk, encoding, done) {

  if ( !chunk ) return done();

  if ( chunk.toString() === 'SETUP_INIT' ) {
    this._discard = false;
    done();
    return;
  }

  if ( this._discard ) return done();

  if ( this._first ) {
    this._first = false;
    this.port.write( chunk.toString() + '\r' );
    done();
    return;
  }

  var _this = this;
  this.once('idle', function() {

    if ( chunk.toString() === 'SETUP_COMPLETE' ) {
      chunk = 'ATI';
      _this._waitFor = 'ATI';
    }

    _this.port.write( chunk.toString() + '\r' );
    done();
  });


};

function parser() {
  return function (emitter, buffer) {

    if ( !buffer ) return;

    var delimiter = /[\n\r]/g;
    var parts = buffer.toString().split(delimiter);

    parts = parts.map( function(part) {
      return part.trim();
    });

    parts = parts.filter( function(part) {
      return part.length > 0;
    });

    parts.forEach( function(part) {
      emitter.emit('data', part);
    });
  };
}

module.exports = OBDInterface;
