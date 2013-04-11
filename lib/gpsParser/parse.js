/* jslint node: true */
'use strict';

function parseNMEATime(time, date) {
  if ( date ) {
    return '20' + date.slice(4,6) +'-'+ date.slice(2,4) +'-'+ date.slice(0,2) + 'T' + time.slice(0,2)+':'+time.slice(2,4)+':'+time.slice(4) + 'Z';
  } else {
    return (new Date().toISOString()).slice(0,11) + time.slice(0,2)+':'+time.slice(2,4)+':'+time.slice(4) + 'Z';
  }
}


var parse = {
  'GP': {
    // Geographic position, latitude / longitude
    'GLL': function(data) {
      if ( data.length === 7 ) {
        return {
          type: 'gll',
          time: parseNMEATime(data[5]),
          latitude: (+data[1].slice(0,2) + data[1].slice(2) / 60 ) * (data[2] === 'N' ? 1 : -1),
          longitude: (+data[3].slice(0,3) + data[3].slice(3) / 60 ) * (data[4] === 'E' ? 1 : -1),
          valid: data[6] === 'A' ? true : false,
          raw: data.toString()
        };
      } else {
        return {
          type: 'gll',
          latitude: (+data[1].slice(0,2) + data[1].slice(2) / 60 ) * (data[2] === 'N' ? 1 : -1),
          longitude: (+data[3].slice(0,3) + data[3].slice(3) / 60 ) * (data[4] === 'E' ? 1 : -1),
          raw: data.toString()
        };
      }
    },

    // Recommended minimum specific GPS/Transit data
    'RMC': function(data) {
      return {
        type: 'rmc',
        time: parseNMEATime(data[1], data[9]),
        timeSystem: new Date().toISOString(),
        dataStatus: data[2],
        latitude: (+data[3].slice(0,2) + data[3].slice(2) / 60 ) * (data[4] === 'N' ? 1 : -1),
        longitude: (+data[5].slice(0,3) + data[5].slice(3) / 60 ) * (data[6] === 'E' ? 1 : -1),
        speed: +data[7],
        track: +data[8],
        magVar: +data[10] * (data[11] === 'E' ? 1 : -1),
        raw: data.toString()
      };
    },

    // Track Made Good and Ground Speed
    'VTG': function(data) {
      return {
        type: 'vtg',
        timeSystem: new Date().toISOString(),
        track: +data[1],
        speedKTS: +data[5],
        speedKMH: +data[7],
        raw: data.toString()
      };
    },

    // Global Positioning System Fix Data
    'GGA': function(data) {
      return {
        type: 'gga',
        time: parseNMEATime(data[1]),
        latitude: (+data[2].slice(0,2) + data[2].slice(2) / 60 ) * (data[3] === 'N' ? 1 : -1),
        longitude: (+data[4].slice(0,3) + data[4].slice(3) / 60 ) * (data[5] === 'E' ? 1 : -1),
        quality: +data[6],
        numberOfSatellites: +data[7],
        hdop: +data[8],
        altitude: +data[9],
        geoidalSeparation: +data[11],
        timeSinceDiffUpdate: +data[13],
        diffRefStationID: data[14],
        raw: data.toString()
      };
    },

    // GPS DOP and Active Satellites
    'GSA': function(data) {
      var activeSats = data.slice(3,15).filter(function(d) {
        return d && d !== '' && d !== null;
      });
      return {
        type: 'gsa',
        timeSystem: new Date().toISOString(),
        mode: data[1] === 'A' ? 'automatic' : data[1] === 'M' ? 'manual' : '',
        fixType: +data[2],
        pdop: +data[15],
        hdop: +data[16],
        vdop: +data[17],
        activeSatellites: activeSats,
        raw: data.toString()
      };
    },

    // GPS Satellites in View
    'GSV': function(data) {
      var satellites = [];
      for (var i = 4; i < 19; i+=4) {
        if ( data[i] && data[i] !== '' && data[i] !== null ) {
          var sat = {
            prn: +data[i],
            elevation: +data[i+1],
            azimuth: +data[i+2],
            snr: +data[i+3]
          };
          satellites.push(sat);
        }
      }

      return {
        type: 'gsv',
        timeSystem: new Date().toISOString(),
        numberOfMessages: +data[1],
        messageNumber: +data[2],
        numberOfSatellites: +data[3],
        satellites: satellites,
        raw: data.toString()
      };
    }
  },
  'PMTK': {
    '000': {
    }
  }
};

module.exports = parse;
