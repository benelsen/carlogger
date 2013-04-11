/* jslint node: true */
'use strict';

var parse = {
  '00': {
    name: 'supportPID0120',
    pid: '00',
    desc: 'PIDs supported [01 - 20]',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '01': {
    name: 'monitorStatus',
    pid: '01',
    desc: 'Monitor status since DTCs cleared',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },
  '02': {
    name: 'freezeDTC',
    pid: '02',
    desc: 'Freeze DTC',
    parse: function() {} //
  },
  '03': {
    name: 'fuelSystemStatus',
    pid: '03',
    desc: 'Fuel system status',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '04': {
    name: 'load',
    pid: '04',
    desc: 'Calculated engine load value',
    parse: function(d) {
      return parseInt(d[0], 16) * 100/255;
    }
  },
  '05': {
    name: 'coolantTemp',
    pid: '05',
    desc: 'Engine coolant temperature',
    parse: function(d) {
      return parseInt(d[0], 16) - 40;
    }
  },

  '06': {
    name: 'fuelTrimBank1ShortTerm',
    pid: '06',
    desc: 'Short term fuel % trim — Bank 1',
    parse: function(d) {
      return ( parseInt(d[0], 16) - 128 ) * 100/128;
    }
  },
  '07': {
    name: 'fuelTrimBank1LongTerm',
    pid: '07',
    desc: 'Long term fuel % trim — Bank 1',
    parse: function(d) {
      return ( parseInt(d[0], 16) - 128 ) * 100/128;
    }
  },
  '08': {
    name: 'fuelTrimBank2ShortTerm',
    pid: '08',
    desc: 'Short term fuel % trim — Bank 2',
    parse: function(d) {
      return ( parseInt(d[0], 16) - 128 ) * 100/128;
    }
  },
  '09': {
    name: 'fuelTrimBank2LongTerm',
    pid: '09',
    desc: 'Long term fuel % trim — Bank 2',
    parse: function(d) {
      return ( parseInt(d[0], 16) - 128 ) * 100/128;
    }
  },

  '0A': {
    name: 'fuelPress',
    pid: '0A',
    desc: 'Fuel pressure',
    parse: function(d) {
      return parseInt(d[0], 16) * 3;
    }
  },
  '0B': {
    name: 'intakeManAbsPress',
    pid: '0B',
    desc: 'Intake manifold absolute pressure',
    parse: function(d) {
      return parseInt(d[0], 16);
    }
  },
  '0C': {
    name: 'rpm',
    pid: '0C',
    desc: 'Engine RPM',
    parse: function(d) {
      return ( (parseInt(d[0], 16) * 256) + parseInt(d[1], 16) ) / 4;
    }
  },
  '0D': {
    name: 'speed',
    pid: '0D',
    desc: 'Vehicle speed',
    parse: function(d) {
      return parseInt(d[0], 16);
    }
  },
  '0E': {
    name: 'timing',
    pid: '0E',
    desc: 'Timing advance',
    parse: function(d) {
      return parseInt(d[0], 16)/2 - 64;
    }
  },
  '0F': {
    name: 'intakeTemp',
    pid: '0F',
    desc: 'Intake air temperature',
    parse: function(d) {
      return parseInt(d[0], 16) - 40;
    }
  },

  '10': {
    name: 'maf',
    pid: '10',
    desc: 'MAF air flow rate',
    parse: function(d) {
      return ( (parseInt(d[0], 16) * 256) + parseInt(d[1], 16) ) / 100;
    }
  },
  '11': {
    name: 'throttle',
    pid: '11',
    desc: 'Throttle position',
    parse: function(d) {
      return parseInt(d[0], 16) * 100/255;
    }
  },
  '12': {
    name: 'cmdSecAirStatus',
    pid: '12',
    desc: 'Commanded secondary air status',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '13': {
    name: 'oxygenSensors',
    pid: '13',
    desc: 'Oxygen sensors present',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '14': {
    name: 'bank1Sensor1',
    pid: '14',
    desc: 'Bank 1, Sensor 1: Oxygen sensor voltage, Short term fuel trim',
    parse: function(d) {
      return {
        oxygenSensorVoltage: parseInt(d[0], 16) / 200,
        fuelTrimShortTerm: (parseInt(d[1], 16) - 128) * 100/128
      };
    }
  },
  '15': {
    name: 'bank1Sensor2',
    pid: '15',
    desc: 'Bank 1, Sensor 2: Oxygen sensor voltage, Short term fuel trim',
    parse: function(d) {
      return {
        oxygenSensorVoltage: parseInt(d[0], 16) / 200,
        fuelTrimShortTerm: (parseInt(d[1], 16) - 128) * 100/128
      };
    }
  },
  '16': {
    name: 'bank1Sensor3',
    pid: '16',
    desc: 'Bank 1, Sensor 3: Oxygen sensor voltage, Short term fuel trim',
    parse: function(d) {
      return {
        oxygenSensorVoltage: parseInt(d[0], 16) / 200,
        fuelTrimShortTerm: (parseInt(d[1], 16) - 128) * 100/128
      };
    }
  },
  '17': {
    name: 'bank1Sensor4',
    pid: '17',
    desc: 'Bank 1, Sensor 4: Oxygen sensor voltage, Short term fuel trim',
    parse: function(d) {
      return {
        oxygenSensorVoltage: parseInt(d[0], 16) / 200,
        fuelTrimShortTerm: (parseInt(d[1], 16) - 128) * 100/128
      };
    }
  },

  '18': {
    name: 'bank2Sensor1',
    pid: '18',
    desc: 'Bank 2, Sensor 1: Oxygen sensor voltage, Short term fuel trim',
    parse: function(d) {
      return {
        oxygenSensorVoltage: parseInt(d[0], 16) / 200,
        fuelTrimShortTerm: (parseInt(d[1], 16) - 128) * 100/128
      };
    }
  },
  '19': {
    name: 'bank2Sensor2',
    pid: '19',
    desc: 'Bank 2, Sensor 2: Oxygen sensor voltage, Short term fuel trim',
    parse: function(d) {
      return {
        oxygenSensorVoltage: parseInt(d[0], 16) / 200,
        fuelTrimShortTerm: (parseInt(d[1], 16) - 128) * 100/128
      };
    }
  },
  '1A': {
    name: 'bank2Sensor3',
    pid: '1A',
    desc: 'Bank 2, Sensor 3: Oxygen sensor voltage, Short term fuel trim',
    parse: function(d) {
      return {
        oxygenSensorVoltage: parseInt(d[0], 16) / 200,
        fuelTrimShortTerm: (parseInt(d[1], 16) - 128) * 100/128
      };
    }
  },
  '1B': {
    name: 'bank2Sensor4',
    pid: '1B',
    desc: 'Bank 2, Sensor 4: Oxygen sensor voltage, Short term fuel trim',
    parse: function(d) {
      return {
        oxygenSensorVoltage: parseInt(d[0], 16) / 200,
        fuelTrimShortTerm: (parseInt(d[1], 16) - 128) * 100/128
      };
    }
  },

  '1C': {
    name: 'obdStandard',
    pid: '1C',
    desc: 'OBD standards this vehicle conforms to',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '1D': {
    name: 'oxygenSensors2',
    pid: '1D',
    desc: 'Oxygen sensors present',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '1E': {
    name: 'auxInputStatus',
    pid: '1E',
    desc: 'Auxiliary input status',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '1F': {
    name: 'runtimeEngine',
    pid: '1F',
    desc: 'Run time since engine start',
    parse: function(d) {
      return (parseInt(d[0], 16) * 256) + parseInt(d[1], 16);
    }
  },

  '20': {
    name: 'supportPID2140',
    pid: '20',
    desc: 'PIDs supported [21 - 40]',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '21': {
    name: 'distanceWithMIL',
    pid: '21',
    desc: 'Distance traveled with malfunction indicator lamp (MIL) on',
    parse: function(d) {
      return (parseInt(d[0], 16) * 256) + parseInt(d[1], 16);
    }
  },

  '22': {
    name: 'fuelRailPressRelative',
    pid: '22',
    desc: 'Fuel Rail Pressure (relative to manifold vacuum)',
    parse: function(d) {
      return ( (parseInt(d[0], 16) * 256) + parseInt(d[1], 16) ) * 0.079;
    }
  },
  '23': {
    name: 'fuelRailPress',
    pid: '23',
    desc: 'Fuel Rail Pressure (diesel, or gasoline direct inject)',
    parse: function(d) {
      return ( (parseInt(d[0], 16) * 256) + parseInt(d[1], 16) ) * 10;
    }
  },

  '24': {
    name: 'o2S1WRlambda',
    pid: '24',
    desc: 'O2S1_WR_lambda(1): Equivalence Ratio, Voltage',
    parse: function(d) {
      return {
        eqRatio: ((parseInt(d[0], 16)*256)+parseInt(d[1], 16))*2/65535,
        voltage: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))*8/65535
      };
    }
  },
  '25': {
    name: 'o2S2WRlambda',
    pid: '25',
    desc: 'O2S2_WR_lambda(1): Equivalence Ratio, Voltage',
    parse: function(d) {
      return {
        eqRatio: ((parseInt(d[0], 16)*256)+parseInt(d[1], 16))*2/65535,
        voltage: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))*8/65535
      };
    }
  },
  '26': {
    name: 'o2S3WRlambda',
    pid: '26',
    desc: 'O2S3_WR_lambda(1): Equivalence Ratio, Voltage',
    parse: function(d) {
      return {
        eqRatio: ((parseInt(d[0], 16)*256)+parseInt(d[1], 16))*2/65535,
        voltage: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))*8/65535
      };
    }
  },
  '27': {
    name: 'o2S4WRlambda',
    pid: '27',
    desc: 'O2S4_WR_lambda(1): Equivalence Ratio, Voltage',
    parse: function(d) {
      return {
        eqRatio: ((parseInt(d[0], 16)*256)+parseInt(d[1], 16))*2/65535,
        voltage: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))*8/65535
      };
    }
  },
  '28': {
    name: 'o2S5WRlambda',
    pid: '28',
    desc: 'O2S5_WR_lambda(1): Equivalence Ratio, Voltage',
    parse: function(d) {
      return {
        eqRatio: ((parseInt(d[0], 16)*256)+parseInt(d[1], 16))*2/65535,
        voltage: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))*8/65535
      };
    }
  },
  '29': {
    name: 'o2S6WRlambda',
    pid: '29',
    desc: 'O2S6_WR_lambda(1): Equivalence Ratio, Voltage',
    parse: function(d) {
      return {
        eqRatio: ((parseInt(d[0], 16)*256)+parseInt(d[1], 16))*2/65535,
        voltage: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))*8/65535
      };
    }
  },
  '2A': {
    name: 'o2S7WRlambda',
    pid: '2A',
    desc: 'O2S7_WR_lambda(1): Equivalence Ratio, Voltage',
    parse: function(d) {
      return {
        eqRatio: ((parseInt(d[0], 16)*256)+parseInt(d[1], 16))*2/65535,
        voltage: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))*8/65535
      };
    }
  },
  '2B': {
    name: 'o2S8WRlambda',
    pid: '2B',
    desc: 'O2S8_WR_lambda(1): Equivalence Ratio, Voltage',
    parse: function(d) {
      return {
        eqRatio: ((parseInt(d[0], 16)*256)+parseInt(d[1], 16))*2/65535,
        voltage: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))*8/65535
      };
    }
  },

  '2C': {
    name: 'cmdEGR',
    pid: '2C',
    desc: 'Commanded EGR',
    parse: function(d) {
      return parseInt(d[0], 16) * 100/255;
    }
  },
  '2D': {
    name: 'errorEGR',
    pid: '2D',
    desc: 'EGR Error',
    parse: function(d) {
      return (parseInt(d[0], 16) - 128) * 100/128;
    }
  },
  '2E': {
    name: 'cmdEvapPurge',
    pid: '2E',
    desc: 'Commanded evaporative purge',
    parse: function(d) {
      return parseInt(d[0], 16) * 100/255;
    }
  },
  '2F': {
    name: 'fuelLevelInput',
    pid: '2F',
    desc: 'Fuel Level Input',
    parse: function(d) {
      return parseInt(d[0], 16) * 100/255;
    }
  },

  '30': {
    name: 'warmupsSinceCleared',
    pid: '30',
    desc: 'Number of warm-ups since codes cleared',
    parse: function(d) {
      return parseInt(d[0], 16);
    }
  },
  '31': {
    name: 'distanceSinceCleared',
    pid: '31',
    desc: 'Distance traveled since codes cleared',
    parse: function(d) {
      return (parseInt(d[0], 16) * 256) + parseInt(d[1], 16);
    }
  },
  '32': {
    name: 'evapSysVaporPress',
    pid: '32',
    desc: 'Evap. System Vapor Pressure',
    parse: function(d) {
      var a = parseInt(d[0], 16);
      a = a < 128 ? a : a - 256;
      var b = parseInt(d[1], 16);
      b = b < 128 ? b : b - 256;
      return ( (a*256)+b )/4;
    }
  },
  '33': {
    name: 'baro',
    pid: '33',
    desc: 'Barometric pressure',
    parse: function(d) {
      return parseInt(d[0], 16);
    }
  },

  '34': {
    name: 'o2S1WRlambda2',
    pid: '34',
    desc: 'O2S1_WR_lambda(1): Equivalence Ratio, Current',
    parse: function(d) {
      return {
        eqRatio: ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 32768,
        current: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))/256 - 128
      };
    }
  },
  '35': {
    name: 'o2S2WRlambda2',
    pid: '35',
    desc: 'O2S2_WR_lambda(1): Equivalence Ratio, Current',
    parse: function(d) {
      return {
        eqRatio: ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 32768,
        current: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))/256 - 128
      };
    }
  },
  '36': {
    name: 'o2S3WRlambda2',
    pid: '36',
    desc: 'O2S3_WR_lambda(1): Equivalence Ratio, Current',
    parse: function(d) {
      return {
        eqRatio: ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 32768,
        current: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))/256 - 128
      };
    }
  },
  '37': {
    name: 'o2S4WRlambda2',
    pid: '37',
    desc: 'O2S4_WR_lambda(1): Equivalence Ratio, Current',
    parse: function(d) {
      return {
        eqRatio: ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 32768,
        current: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))/256 - 128
      };
    }
  },
  '38': {
    name: 'o2S5WRlambda2',
    pid: '38',
    desc: 'O2S5_WR_lambda(1): Equivalence Ratio, Current',
    parse: function(d) {
      return {
        eqRatio: ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 32768,
        current: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))/256 - 128
      };
    }
  },
  '39': {
    name: 'o2S6WRlambda2',
    pid: '39',
    desc: 'O2S6_WR_lambda(1): Equivalence Ratio, Current',
    parse: function(d) {
      return {
        eqRatio: ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 32768,
        current: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))/256 - 128
      };
    }
  },
  '3A': {
    name: 'o2S7WRlambda2',
    pid: '3A',
    desc: 'O2S7_WR_lambda(1): Equivalence Ratio, Current',
    parse: function(d) {
      return {
        eqRatio: ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 32768,
        current: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))/256 - 128
      };
    }
  },
  '3B': {
    name: 'o2S8WRlambda2',
    pid: '3B',
    desc: 'O2S8_WR_lambda(1): Equivalence Ratio, Current',
    parse: function(d) {
      return {
        eqRatio: ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 32768,
        current: ((parseInt(d[2], 16)*256)+parseInt(d[3], 16))/256 - 128
      };
    }
  },

  '3C': {
    name: 'catTempBank1Sensor1',
    pid: '3C',
    desc: 'Catalyst Temperature Bank 1, Sensor 1',
    parse: function(d) {
      return ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 10 - 40;
    }
  },
  '3D': {
    name: 'catTempBank2Sensor1',
    pid: '3D',
    desc: 'Catalyst Temperature Bank 2, Sensor 1',
    parse: function(d) {
      return ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 10 - 40;
    }
  },
  '3E': {
    name: 'catTempBank1Sensor2',
    pid: '3E',
    desc: 'Catalyst Temperature Bank 1, Sensor 2',
    parse: function(d) {
      return ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 10 - 40;
    }
  },
  '3F': {
    name: 'catTempBank2Sensor2',
    pid: '3F',
    desc: 'Catalyst Temperature Bank 2, Sensor 2',
    parse: function(d) {
      return ( (parseInt(d[0], 16)*256)+parseInt(d[1], 16) ) / 10 - 40;
    }
  },

  '40': {
    name: 'supportPID4160',
    pid: '40',
    desc: 'PIDs supported [41 - 60]',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '60': {
    name: 'supportPID6180',
    pid: '60',
    desc: 'PIDs supported [61 - 80]',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  '80': {
    name: 'supportPID81A0',
    pid: '80',
    desc: 'PIDs supported [81 - A0]',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  'A0': {
    name: 'supportPIDA1C0',
    pid: 'A0',
    desc: 'PIDs supported [A1 - C0]',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  'C0': {
    name: 'supportPIDC1E0',
    pid: 'C0',
    desc: 'PIDs supported [C1 - E0]',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  },

  'E0': {
    name: 'supportPIDE1FF',
    pid: 'E0',
    desc: 'PIDs supported [E1 - FF]',
    parse: function(d) {
      return parseInt( d.join(''), 16).toString(2);
    } // Bit encoded
  }
};

module.exports = parse;
