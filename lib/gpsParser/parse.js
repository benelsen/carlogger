var parse = {
  'GP': {
    // Geographic position, latitude / longitude
    'GLL': function(data) {
      return {
        type: '',
        raw: data.toString()
      };
    },

    // Recommended minimum specific GPS/Transit data
    'RMC': function(data) {
      return {
        type: '',
        raw: data.toString()
      };
    },

    // Track Made Good and Ground Speed
    'VTG': function(data) {
      return {
        type: '',
        raw: data.toString()
      };
    },

    // Global Positioning System Fix Data
    'GGA': function(data) {
      return {
        type: 'gga',
        time: (new Date().toISOString()).slice(0,11) + data[1] + 'Z',
        latitude: data[2] * (data[3] === 'N' ? 1 : -1),
        longitude: data[4] * (data[5] === 'N' ? 1 : -1),
        quality: data[6],
        numberOfSatellites: data[7],
        hdop: data[8],
        altitude: data[9],
        geoidalSeparation: data[11],
        timeSinceDiffUpdate: data[13],
        diffRefStationID: data[14],
        raw: data.toString()
      };
    },

    // GPS DOP and Active Satellites
    'GSA': function(data) {
      return {
        type: '',
        raw: data.toString()
      };
    },

    // GPS Satellites in View
    'GSV': function(data) {
      return {
        type: '',
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
