/* jslint node: true */
'use strict';

var _ = require('underscore'),
    PassThrough = require('stream').PassThrough;

var OBDInterface  = require('../obdInterface'),
    OBDParser     = require('../obdParser'),
    Sequence      = require('./sequence');

function OBD(options) {
  if (!(this instanceof OBD)) {
    return new OBD(options);
  }

  var streamOptions = {
    objectMode: true,
    encodung: 'utf8'
  };

  PassThrough.call(this, streamOptions);

  options = options || {};

  this.input = new PassThrough({
    highWaterMark: 16,
    objectMode: true,
    encodung: 'utf8'
  });

  this.parser = new OBDParser();
  this.inter  = new OBDInterface({
    device: options.device
  });

  var _this = this;
  this.inter.on('connected', function() {
    _this.parser.pipe(_this);
    _this.inter.pipe(_this.parser);
    _this.input.pipe(_this.inter);

    _this.emit('connected');
  });

  this.inter.on('disconnected', function() {
    _this.input.unpipe();
    _this.inter.unpipe();
    _this.parser.unpipe(_this);

    _this.emit('disconnected');
  });

  this.inter.on('drain', function() {
    _this.emit('drain');
  });

  this.inter.on('error', function(err) {
    _this.emit('error', err);
  });

  this.parser.on('error', function(err) {
    _this.emit('error', err);
  });
}

OBD.prototype = Object.create(
  PassThrough.prototype, {
    constructor: {
      value: OBD
    }
  }
);

OBD.prototype.connect = function() {
  this.inter.connect();
};

OBD.prototype.disconnect = function() {
  this.inter.disconnect();
};

OBD.prototype.queryByPID = function(pid) {
  this.inter.write(pid);
};

OBD.prototype.queryByName = function(name, mode) {
  mode = mode || '01';

  // Lookup PID
  var pid = _.find( this.parser.mode01, function(obj) {
    return obj.name === name;
  }).pid;

  this.inter.write(mode + pid);
};

OBD.prototype.getSupport = function() {
  return false;
  // obd.queryByPID('0100');
  // obd.queryByPID('0120');
  // obd.queryByPID('0140');
  // obd.queryByPID('0160');
  // obd.queryByPID('0180');
  // obd.queryByPID('01A0');
  // obd.queryByPID('01C0');
  // obd.queryByPID('01E0');
};

OBD.prototype.initSequence = function(seq) {
  this.sequence = new Sequence(seq);
};

OBD.prototype.startSequence = function() {
  this.sequence.pipe(this.input);
};

OBD.prototype.stopSequence = function() {
  this.sequence.unpipe(this.input);
};

module.exports = OBD;
