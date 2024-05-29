import { equal } from 'assert';
import * as convert from '../src/convert.js';

describe('Convert', function () {
  describe('bytesToKWhours', function () {
    it('should return 0 for 0 bytes', function () {
      equal(convert.bytesToKWhours(0), 0);
    });
    it('should return 0 for negative bytes', function () {
      equal(convert.bytesToKWhours(-1), 0);
    });

    it('shoud return 0 for unsupported input', function () {
      equal(convert.bytesToKWhours('unsupported'), 0);
      equal(convert.bytesToKWhours(undefined), 0);
      equal(convert.bytesToKWhours([]), 0);
      equal(convert.bytesToKWhours(new Date()), 0);
      equal(convert.bytesToKWhours(new Set()), 0);
    });

    it(`should convert 1 byte to ${convert.KWH_PER_BYTE} kWh`, function () {
      equal(convert.bytesToKWhours(1), convert.KWH_PER_BYTE);
    });
    it(`should convert 1 Kb to ${convert.KWH_PER_KILOBYTE} kWh`, function () {
      equal(convert.bytesToKWhours(convert.BYTES_PER_KILOBYTE), convert.KWH_PER_KILOBYTE);
    });
    it(`should convert 1 Mb to ${convert.KWH_PER_MEGABYTE} kWh`, function () {
      equal(convert.bytesToKWhours(convert.BYTES_PER_MEGABYTE), convert.KWH_PER_MEGABYTE);
    });
    it(`should convert 1 Gb to ${convert.KWH_PER_GIGABYTE} kWh`, function () {
      equal(convert.bytesToKWhours(convert.BYTES_PER_GIGABYTE), convert.KWH_PER_GIGABYTE);
    });
  });

  describe('bytesToGramsOfCarbon', function () {
    it('should return 0 for 0 bytes', function () {
      equal(convert.bytesToGramsOfCarbon(0), 0);
    });

    it('shoud return 0 for unsupported input', function () {
      equal(convert.bytesToGramsOfCarbon('unsupported'), 0);
      equal(convert.bytesToGramsOfCarbon(undefined), 0);
      equal(convert.bytesToGramsOfCarbon([]), 0);
      equal(convert.bytesToGramsOfCarbon(new Date()), 0);
      equal(convert.bytesToGramsOfCarbon(new Set()), 0);
      equal(convert.bytesToGramsOfCarbon(-1), 0);
    });

    it(`should return ${convert.GRAMS_OF_CARBON_PER_GIGABYTE} gCO2e for 1 GB of data`, function () {
      equal(convert.bytesToGramsOfCarbon(convert.BYTES_PER_GIGABYTE), convert.GRAMS_OF_CARBON_PER_GIGABYTE);
    });
    it(`should return ${convert.GRAMS_OF_CARBON_PER_MEGABYTE} gCO2e for 1 Mb of data`, function () {
      equal(convert.bytesToGramsOfCarbon(convert.BYTES_PER_MEGABYTE), convert.GRAMS_OF_CARBON_PER_MEGABYTE);
    });
    it(`should return ${convert.GRAMS_OF_CARBON_PER_KILOBYTE} gCO2e for 1 Kb of data`, function () {
      equal(convert.bytesToGramsOfCarbon(convert.BYTES_PER_KILOBYTE), convert.GRAMS_OF_CARBON_PER_KILOBYTE);
    });
    it(`should return ${convert.GRAMS_OF_CARBON_PER_BYTE} gCO2e for 1 byte of data`, function () {
      equal(convert.bytesToGramsOfCarbon(1), convert.GRAMS_OF_CARBON_PER_BYTE);
    });
    it(`should return 0.8740722656250002 gCO2e for 2.5 Mb of data`, function () {
      equal(convert.bytesToGramsOfCarbon(2.5 * convert.BYTES_PER_MEGABYTE), 0.8740722656250002);
    });
    
  });

  describe('bytesToCPM',  () => {
    it('should return 0 for 0 bytes', function () {
      equal(convert.bytesToCPM(0), 0);
    })
    it(`should return ${0.3414344787597657} for 1 Kb`, function () {
      equal(convert.bytesToCPM(convert.BYTES_PER_KILOBYTE), 0.3414344787597657);
    })
    it(`should return ${349.62890625000006} for 1 Mb`, function () {
      equal(convert.bytesToCPM(convert.BYTES_PER_MEGABYTE), 349.62890625000006);
    })
    it(`should return ${358020.00000000006} for 1 GB`, function () {
      equal(convert.bytesToCPM(convert.BYTES_PER_GIGABYTE), 358020.00000000006);
    })
  })
});
