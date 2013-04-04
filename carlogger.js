var fs = require('fs');

var GPS = require('./lib/gpsController'),
    OBD = require('./lib/obdController');

var gpsLog = fs.WriteStream('gps.log', {flags: 'a+'}),
    obdLog = fs.WriteStream('obd.log', {flags: 'a+'});

var gps = new GPS({
  device: '/dev/ttyAMA0',
  baudrate: 57600
});

var obd = new OBD({
  device: '/dev/ttys008'
});

// GPS EVENTS
gps.on('all', function(data) {
  console.log(data.toString());
  gpsLog.write(data);
});

var seq = [ '0104','010C','010D','0110','0104','010C','010D','0105','0104','010C','010D','0110','0104','010C','010D','010A','0104','010C','010D','0110','0104','010C','010D','010B','0104','010C','010D','0110','0104','010C','010D','010F' ];

var isOpen = false;

// OBD EVENTS
obd.on('readable', function() {
  var data = obd.read();
  console.log(data.toString());
  obdLog.write(data);

  if ( isOpen ) {
    var pid = seq.shift();
    obd.queryByPID(pid);
    seq.push(pid);
  }
});

obd.on('end', function() {
  console.log('end?');
});

obd.on('open', function() {
  console.log('obd open');
  isOpen = true;
  obd.queryByPID('0100');
  obd.queryByPID('0120');
  obd.queryByPID('0140');
  obd.queryByPID('0160');
  obd.queryByPID('0180');
  obd.queryByPID('01A0');
  obd.queryByPID('01C0');
  obd.queryByPID('01E0');
});

