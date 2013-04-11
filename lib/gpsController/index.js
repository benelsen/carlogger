/* jslint node: true */
'use strict';

var Writable = require('stream').Writable;

var GPSInterface  = require('../gpsInterface'),
    GPSParser     = require('../gpsParser');

function GPS(options) {
  if (!(this instanceof GPS)) {
    return new GPS(options);
  }

  var streamOptions = {};

  Writable.call(this, streamOptions);

  options = options || {};

  this.parser = new GPSParser();
  this.inter  = new GPSInterface({
    device: options.device,
    baudrate: options.baudrate
  });

  this.inter.pipe(this.parser).pipe(this);

  var _this = this;
  this.inter.on('connected', function() {
    _this.emit('connected');
  });

  this.inter.on('disconnected', function() {
    _this.emit('disconnected');
  });

  this.inter.on('error', function(err) {
    _this.emit('error', err);
  });
}

GPS.prototype = Object.create(
  Writable.prototype, {
    constructor: {
      value: GPS
    }
  }
);

/**
 * Connect to the serial port
 */
GPS.prototype.connect = function() {
  this.inter.connect();
};

/**
 * Disconnect (close) the serial port
 */
GPS.prototype.disconnect = function() {
  this.inter.disconnect();
};

/**
 * Restart the GPS module
 * @param {String} type   The desired type of restart:
 *                        hot, warm, cold, full
 */
GPS.prototype.restart = function(type) {
  switch (type) {
    case 'hot':
      this.send('PMTK101');
      break;
    case 'warm':
      this.send('PMTK102');
      break;
    case 'cold':
      this.send('PMTK103');
      break;
    case 'full':
      this.send('PMTK104');
      break;
    default:
      return false;
  }
};

/**
 * Set the baudrate of the GPS module
 * Do not use this as autoreconnect is not yet implemented!
 * @param {number}  rate            The baudrate to set the module to
 * @param {boolean} autoreconnect   Automatically reconnect
 */
GPS.prototype.setBaudRate = function(rate, autoreconnect) {
  var supported = [4800, 9600, 14400, 19200, 38400, 57600, 115200];
  if ( !rate || supported.indexOf(+rate) < 0 ) return false;

  if ( autoreconnect ) {
    console.warn('autoreconnect is not implemented');
  }

  this.send('PMTK251,' + rate );
};

/**
 * Set the update rate (interval)
 * @param {number} rate  Update rate in ms (milliseconds)
 */
GPS.prototype.setUpdateRate = function(rate) {
  var supported = [100,10000];
  if ( !rate || +rate < supported[0] || +rate > supported[0] ) return false;

  this.send('220,' + rate );
};

/**
 * Set which NMEA sentences the module should be emmiting
 * @param {object} sentences Object as described:
 *                           example:
 *                           {
 *                             gll: false,
 *                             rmc: 1,
 *                             vtg: 0,
 *                             gga: true,
 *                             gsa: 5,
 *                             gsv: 5,
 *                             chn: 2
 *                           }
 */
GPS.prototype.setSentences = function(s) {
  if ( !s || typeof cmd !== 'object' ) return false;

  var nmeaOutput = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  nmeaOutput[0]  = +s.gll > 0 ? +s.gll <= 5 ? +s.gll.toFixed(0) : 5 : 0;
  nmeaOutput[1]  = +s.rmc > 0 ? +s.rmc <= 5 ? +s.rmc.toFixed(0) : 5 : 0;
  nmeaOutput[2]  = +s.vtg > 0 ? +s.vtg <= 5 ? +s.vtg.toFixed(0) : 5 : 0;
  nmeaOutput[3]  = +s.gga > 0 ? +s.gga <= 5 ? +s.gga.toFixed(0) : 5 : 0;
  nmeaOutput[4]  = +s.gsa > 0 ? +s.gsa <= 5 ? +s.gsa.toFixed(0) : 5 : 0;
  nmeaOutput[5]  = +s.gsv > 0 ? +s.gsv <= 5 ? +s.gsv.toFixed(0) : 5 : 0;
  nmeaOutput[18] = +s.chn > 0 ? +s.chn <= 5 ? +s.chn.toFixed(0) : 5 : 0;

  this.send('PMTK314,' + nmeaOutput.join(',') );
};

/**
 * Send a command to the GPS module
 * This method calculates the checksum and adds leading/trailung chars
 * @param  {String} cmd   The command as specified in the module’s
 *                        documentation w/o leading '$' and checksum.
 */
GPS.prototype.send = function(cmd) {
  if ( !cmd || typeof cmd !== 'string' ) return false;

  var checksum = this._calcChecksum(cmd);

  this._send( '$' + cmd + '*' + checksum );
};

/**
 * @private
 */
GPS.prototype._send = function(cmd) {
  this.inter.write(cmd);
};

/**
 * @private
 */
GPS.prototype._calcChecksum = function(cmd) {

  var checksum = cmd.split('').reduce(function(sum, character) {
    return sum ^ character.charCodeAt(0);
  }, 0);

  // Convert to hex
  checksum = checksum.toString(16).toUpperCase();

  // pad
  checksum = ('00' + checksum).slice(-2);

  return checksum;
};

/**
 * @private
 */
GPS.prototype._write = function(chunk, encoding, done) {
  var data = JSON.parse(chunk);
  this.emit(data.type, data);
  this.emit('all', data);

  done();
};

module.exports = GPS;
