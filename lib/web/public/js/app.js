/*global io: true, $: true */
'use strict';
var app = {};

app.socket = io.connect();

app.status = {
  sys: 'disconnected',
  log: 'disconnected',
  gps: 'disconnected',
  obd: 'disconnected',
  update: 0
};

// Setup
app.setup = function() {
  app.disconnected();
  app.log.disconnected();
  app.gps.disconnected();
  app.obd.disconnected();
  app.getStatus();
};

app.connected = function() {
  app.sys = 'connected';
  $('.js-sys-status').attr('class', 'label js-sys-status label-success');
};

app.disconnected = function() {
  app.sys = 'disconnected';
  $('.js-sys-status').attr('class', 'label js-sys-status label-danger');
};

app.getStatus = function() {
  app.socket.emit('status');
};

app.setStatus = function(data) {
  app.connected();

  app.status.update = Date.now();

  app.status.log = data.log;
  app.status.gps = data.gps;
  app.status.obd = data.obd;

  app.log[app.status.log]();
  app.gps[app.status.gps]();
  app.obd[app.status.obd]();
};

// Events

app.socket.on('status', app.setStatus);
app.socket.on('connected', app.connected);
app.socket.on('disconnected', app.disconnected);

setInterval(function() {
  if( Date.now() - app.status.update > 30000 ) {
    app.disconnected();
  }
}, 20000);

// *** LOG ***
app.log = {
};

// Requests
app.log.start = function() {
  console.log('sent', 'log.start');
  app.socket.emit('log.start');
};

app.log.stop = function() {
  console.log('sent', 'log.stop');
  app.socket.emit('log.stop');
};

app.log.pause = function() {
  console.log('sent', 'log.pause');
  app.socket.emit('log.pause');
};

app.log.resume = function() {
  console.log('sent', 'log.resume');
  app.socket.emit('log.resume');
};

// Actions
app.log.started = function() {
  app.status.log = 'started';

  $('.js-log-status').attr('class', 'label js-log-status label-success');

  $('.js-log-start').addClass('hide').addClass('disabled'); // hidden
  $('.js-log-stop').removeClass('hide').removeClass('disabled'); // shown
  $('.js-log-resume').addClass('hide').addClass('disabled'); // hidden
  $('.js-log-pause').removeClass('hide').removeClass('disabled'); // shown
};

app.log.stopped = function() {
  app.status.log = 'stopped';

  $('.js-log-status').attr('class', 'label js-log-status label-danger');

  $('.js-log-start').removeClass('hide').removeClass('disabled'); // shown
  $('.js-log-stop').removeClass('hide').addClass('disabled'); // shown
  $('.js-log-resume').addClass('hide').addClass('disabled'); // hidden
  $('.js-log-pause').addClass('hide').addClass('disabled'); // hidden
};

app.log.resumed = app.log.started;

app.log.paused = function() {
  app.status.log = 'paused';

  $('.js-log-status').attr('class', 'label js-log-status label-warning');

  $('.js-log-start').addClass('hide').addClass('disabled'); // shown
  $('.js-log-stop').removeClass('hide').removeClass('disabled'); // shown
  $('.js-log-resume').removeClass('hide').removeClass('disabled'); // hidden
  $('.js-log-pause').addClass('hide').addClass('disabled'); // hidden
};

app.log.disconnected = function() {
  app.status.log = 'disconnected';

  $('.js-log-status').attr('class', 'label js-log-status label-danger');

  $('.js-log-start').removeClass('hide').addClass('disabled');
  $('.js-log-stop').removeClass('hide').addClass('disabled');
  $('.js-log-resume').addClass('hide').addClass('disabled');
  $('.js-log-pause').addClass('hide').addClass('disabled');
};

// Events
app.socket.on('log.started', app.log.started);
app.socket.on('log.stopped', app.log.stopped);
app.socket.on('log.resumed', app.log.resumed);
app.socket.on('log.paused', app.log.paused);

// UI
$('.js-log-start').click(app.log.start);
$('.js-log-stop').click(app.log.stop);
$('.js-log-pause').click(app.log.pause);
$('.js-log-resume').click(app.log.resume);

// *** GPS ***

app.gps = {
  last: {}
};

// Requests
app.gps.connect = function() {
  app.socket.emit('gps.connect');
};

app.gps.disconnect = function() {
  app.socket.emit('gps.disconnect');
};

app.gps.setDevice = function(dev) {
  app.socket.emit('gps.set', {device: dev});
};

// Actions
app.gps.connected = function() {
  app.status.gps = 'connected';
  $('.js-gps-status').attr('class', 'label js-gps-status label-success');
  $('.js-gps-connect').addClass('disabled');
  $('.js-gps-disconnect').removeClass('disabled');
};

app.gps.disconnected = function() {
  app.status.gps = 'disconnected';
  $('.js-gps-status').attr('class', 'label js-gps-status label-danger');
  $('.js-gps-connect').removeClass('disabled');
  $('.js-gps-disconnect').addClass('disabled');
};

// Updates
app.gps.update = function(data) {
  if ( data.type === 'rmc' && data.dataStatus === 'A' ) {
    $('.data.gps td.lat').text( data.latitude.toFixed(5)  + '°' );
    $('.data.gps td.lon').text( data.longitude.toFixed(5)  + '°' );
    $('.data.gps td.spd').text( (data.speed / 1.852).toFixed(2) + ' km/h' );
    $('.data.gps td.crs').text( data.track.toFixed(2) + '°' );
  } else if ( data.type === 'gga' && +data.quality > 0 ) {
    $('.data.gps td.alt').text( data.altitude.toFixed(3)  + ' m' );
    $('.data.gps td.hdop').text( data.hdop.toFixed(2) );
    $('.data.gps td.sats').text( data.numberOfSatellites );
  }
  // console.log(data);
};

// Events
app.socket.on('gps.connected', app.gps.connected);
app.socket.on('gps.disconnected', app.gps.disconnected);
app.socket.on('gps.update', app.gps.update);

// UI
$('.js-gps-connect').click(app.gps.connect);
$('.js-gps-disconnect').click(app.gps.disconnect);

// *** OBD ***
app.obd = {
  last: {}
};

// Requests
app.obd.connect = function() {
  app.socket.emit('obd.connect');
};

app.obd.disconnect = function() {
  app.socket.emit('obd.disconnect');
};

app.obd.setDevice = function(dev) {
  app.socket.emit('obd.set', {device: dev});
};

// Actions
app.obd.connected = function() {
  app.status.obd = 'connected';
  $('.js-obd-status').attr('class', 'label js-obd-status label-success');
  $('.js-obd-connect').addClass('disabled');
  $('.js-obd-disconnect').removeClass('disabled');
};

app.obd.disconnected = function() {
  app.status.obd = 'disconnected';
  $('.js-obd-status').attr('class', 'label js-obd-status label-danger');
  $('.js-obd-connect').removeClass('disabled');
  $('.js-obd-disconnect').addClass('disabled');
};

// Updates
app.obd.update = function(data) {

  app.obd.last[data.type] = data.value;

  if ( data.type === 'speed' ) {
    $('.data.obd td.spd').text( data.value.toFixed(1)  + ' km/h' );

  } else if ( data.type === 'rpm' ) {
    $('.data.obd td.rpm').text( data.value.toFixed(0) );

  } else if ( data.type === 'load' ) {
    $('.data.obd td.load').text( data.value.toFixed(2) + ' %' );

  } else if ( data.type === 'coolantTemp' ) {
    $('.data.obd td.coolantTemp').text( data.value.toFixed(0) + ' °C' );

  } else if ( data.type === 'intakeTemp' ) {
    $('.data.obd td.intakeTemp').text( data.value.toFixed(0) + ' °C' );

  } else if ( data.type === 'intakeManAbsPress' ) {
    $('.data.obd td.intakeManAbsPress').text( data.value.toFixed(0) + ' kPa');

  } else if ( data.type === 'fuelPress' ) {
    $('.data.obd td.fuelPress').text( data.value.toFixed(0) + ' kPa');

  } else if ( data.type === 'maf' ) {
    $('.data.obd td.maf').text( data.value.toFixed(2) + ' g/s');

    var eco = 0;

    if ( app.obd.last.speed ) {
      eco = app.obd.last.maf * (1/14.7) * (1/832.5) * (1/app.obd.last.speed) * 3600 * 100;
    }

    $('.data.obd td.eco').text( eco.toFixed(2) + ' L/100km');

  }
  // console.log(data);
};

// Events
app.socket.on('obd.connected', app.obd.connected);
app.socket.on('obd.disconnected', app.obd.disconnected);
app.socket.on('obd.update', app.obd.update);

// UI
$('.js-obd-connect').click(app.obd.connect);
$('.js-obd-disconnect').click(app.obd.disconnect);

app.setup();
