/* jslint node: true */
'use strict';

var DEBUG = false;

var gpio  = require('gpio');

// Load Config

var config = JSON.parse( require('fs').readFileSync(__dirname + '/config.json', 'utf8') );

var server = require(__dirname + '/lib/web');

var GPS = require(__dirname + '/lib/gpsController'),
    OBD = require(__dirname + '/lib/obdController'),
    Logger = require(__dirname + '/lib/logger');

// Status

var status = {
  log: 'stopped',
  gps: 'disconnected',
  obd: 'disconnected'
};

// Instances

var gps = new GPS(config.gps),
    obd = new OBD(config.obd),
    log = new Logger();

// GPS

gps.on('connected', function() {
  server.io.sockets.emit('gps.connected');
  status.gps = 'connected';
});

gps.on('disconnected', function() {
  server.io.sockets.emit('gps.disconnected');
  status.gps = 'disconnected';
});

// GPS EVENTS
gps.on('all', function(data) {

  if ( !data.source ) data.source = 'gps';
  if ( !data.time )   data.time   = new Date();

  // console.log('gps update');

  // Send to clients
  server.io.sockets.emit('gps.update', data);

  // log log log
  try {
    log.write( JSON.stringify(data) );
  } catch (err) {
    console.error(err);
    syslog(err);
  }

});

gps.on('error', function(err) {
  console.error('gps error:', err);
  syslog(err);
});

// OBD

var seq = [ '0104','010C','010D','0110','0104','010C','010D','0105','0104','010C','010D',
            '0110','0104','010C','010D','010A','0104','010C','010D','0110','0104','010C',
            '010D','010B','0104','010C','010D','0110','0104','010C','010D','010F' ];

obd.initSequence(seq);

var lastCylce = 0,
    cycleTime = 0;

// OBD EVENTS
obd.on('readable', function() {

  var raw = obd.read(),
      data = JSON.parse( raw );

  if ( !data.source ) data.source = 'obd';
  if ( !data.time )   data.time   = new Date();

  // console.log('obd update', data);

  // Send to clients
  server.io.sockets.emit('obd.update', data);

  // log log log
  try {
    log.write( JSON.stringify(data) );
  } catch (err) {
    console.error(err);
    syslog(err);
  }

  // for debugging purpose
  if ( DEBUG ) {
    cycleTime = Date.now() - lastCylce;
    lastCylce = Date.now();
    console.info(cycleTime, 'ms');
  }

});

obd.on('connected', function() {
  server.io.sockets.emit('obd.connected');
  console.warn('obd connected');
  status.obd = 'connected';
  obd.startSequence();
});

obd.on('disconnected', function() {
  server.io.sockets.emit('obd.disconnected');
  console.warn('obd disconnected');
  status.obd = 'disconnected';
  obd.stopSequence();
});

obd.on('error', function(err) {
  console.error('obd error:', err);
  syslog(err);
});

// LOG

log.on('started', function() {
  status.log = 'started';
  server.io.sockets.emit('log.started');
});

log.on('stopped', function() {
  status.log = 'stopped';
  server.io.sockets.emit('log.stopped');
});

log.on('resumed', function() {
  status.log = 'started';
  server.io.sockets.emit('log.resumed');
});

log.on('paused', function() {
  status.log = 'paused';
  server.io.sockets.emit('log.paused');
});

// WEB

server.io.sockets.on('connection', function (socket) {

  server.io.sockets.emit('connected');
  server.io.sockets.emit('status', status);

  socket.on('log.start', function() {
    log.start();
  });

  socket.on('log.stop', function() {
    log.stop();
  });

  socket.on('log.resume', function() {
    log.resume();
  });

  socket.on('log.pause', function() {
    log.pause();
  });

  socket.on('obd.connect', function() {
    obd.connect();
  });

  socket.on('obd.disconnect', function() {
    obd.disconnect();
  });

  socket.on('gps.connect', function() {
    gps.connect();
  });

  socket.on('gps.disconnect', function() {
    gps.disconnect();
  });

});

setInterval(function() {
  server.io.sockets.emit('status', status);
}, 2500);

setInterval(function() {
  console.info(status);
}, 10000);

// GPIO

var gpsLED = gpio.export(4, {
  direction: 'out',
  ready: function() {

    setInterval(function() {

      // console.log('gps led', gpsLED.value);

      gpsLED.set(0);

      setTimeout(function() {
        if ( status.gps === 'connected' ) { gpsLED.set(); }
      }, 100);

    }, 1000);

  }
});

var obdLED = gpio.export(17, {
  direction: 'out',
  ready: function() {

    setInterval(function() {

      // console.log('obd led', obdLED.value);

      obdLED.set(0);

      setTimeout(function() {
        if ( status.obd === 'connected' ) { obdLED.set(); }
      }, 100);

    }, 1000);

  }
});

var logLED = gpio.export(22, {
  direction: 'out',
  ready: function() {

    setInterval(function() {

      // console.log('log led', logLED.value);

      logLED.set(0);

      setTimeout(function() {
        if ( status.log === 'started' ) { logLED.set(); }
      }, 100);

    }, 1000);

  }
});

function syslog(err) {

  var data = {
    source: 'sys',
    time: new Date(),
    error: err.toString()
  };

  try {
    log.write( JSON.stringify(data) );
  } catch (err) {
    console.error(err);
  }
}


// Catch uncaught Exceptions
process.on('uncaughtException', function(err) {
  console.error('Caught exception: ' + err);
  syslog(err);
});
