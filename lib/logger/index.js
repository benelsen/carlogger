/* jslint node: true */
'use strict';

var Writable = require('stream').Writable,
    fs = require('fs');

function Logger(options) {
  if (!(this instanceof Logger)) {
    return new Logger(options);
  }

  var streamOptions = {
    decodeStrings: false
  };

  Writable.call(this, streamOptions);

  options = options || {};

  this.status = 'stopped';

  var logOptions = {
    flags: 'a',
    encoding: 'utf8',
    mode: '0777'
  };

  var logs = {};

  logs.gps = {
    stream: fs.WriteStream(__dirname + '/../../logs/gps.log', logOptions),
    open: false
  };
  logs.gps.stream.on('open', function() {
    logs.gps.open = true;
  });

  logs.gpsRaw = {
    stream: fs.WriteStream(__dirname + '/../../logs/gps-raw.log', logOptions),
    open: false
  };
  logs.gpsRaw.stream.on('open', function() {
    logs.gpsRaw.open = true;
  });

  logs.obd = {
    stream: fs.WriteStream(__dirname + '/../../logs/obd.log', logOptions),
    open: false
  };
  logs.obd.stream.on('open', function() {
    logs.obd.open = true;
  });

  logs.obdRaw = {
    stream: fs.WriteStream(__dirname + '/../../logs/obd-raw.log', logOptions),
    open: false
  };
  logs.obdRaw.stream.on('open', function() {
    logs.obdRaw.open = true;
  });

  logs.sys = {
    stream: fs.WriteStream(__dirname + '/../../logs/sys.log', logOptions),
    open: false
  };
  logs.sys.stream.on('open', function() {
    logs.sys.open = true;
  });

  this.logs = logs;

}

Logger.prototype = Object.create(
  Writable.prototype, {
    constructor: {
      value: Logger
    }
  }
);

Logger.prototype.newLog = function() {
  // this.emit('newLog');
};

Logger.prototype.start = function() {
  this.status = 'started';
  this.emit('started');
};

Logger.prototype.stop = function() {
  this.status = 'stopped';
  this.emit('stopped');
};

Logger.prototype.resume = function() {
  this.status = 'started';
  this.emit('resumed');
};

Logger.prototype.pause = function() {
  this.status = 'paused';
  this.emit('paused');
};

Logger.prototype.compile = function() {
};

Logger.prototype._write = function(chunk, encoding, done) {

  // console.log('LOG:', chunk.toString());

  if ( chunk && chunk.toString() && chunk.toString().length > 0 ) {

    var csv,
        data = JSON.parse( chunk.toString() );

    if ( this.status !== 'started' && data.source !== 'sys' ) return done();

    if ( data.source === 'gps' ) {
      this.logs.gps.stream.write( chunk + '\n' );
      csv = data.time + ';' + data.raw.toString().replace(/[\r\n]/g, ' ');
      this.logs.gpsRaw.stream.write( csv + '\n' );

    } else if ( data.source === 'obd' ) {
      this.logs.obd.stream.write( chunk + '\n' );
      csv = data.time + ';' + data.query.toString() + ';' + data.raw.toString().replace(/[\r\n]/g, ' ');
      this.logs.obdRaw.stream.write( csv + '\n' );

    } else {
      this.logs.sys.stream.write( chunk + '\n' );
    }

  }

  done();
};

module.exports = Logger;
