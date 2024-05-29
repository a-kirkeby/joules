/*
  FROM Sustainable Web Design: https://sustainablewebdesign.org/calculating-digital-emissions/

  We used these data points to define the formulas below:

  Annual Internet Energy: 1988 TWh (worldwide)
  Annual End User Traffic: 2444 EB
  Annual Internet Energy / Annual End User Traffic = 0.81 tWh/EB or 0.81 kWh/GB
  Carbon factor (global grid): 442 g/kWh
  Carbon factor (renewable energy source): 50 g/kWh

  Energy per visit in kWh (E):
  E = [Data Transfer per Visit (new visitors) in GB x 0.81 kWh/GB x 0.75] + [Data Transfer per Visit (returning visitors) in GB x 0.81 kWh/GB x 0.25 x 0.02]

  Emissions per visit in grams CO2e (C):
  C = E x 442 g/kWh (or alternative/region-specific carbon factor)

  Annual energy in kWh (AE):
  AE = E x Monthly Visitors x 12

  Annual emissions in grams CO2e (AC):
  AC = C x Monthly Visitors x 12

  Examples for kWh per data size:
  1 GB of data = 1 GB Data x 0.81 kWh/GB = 0.81 kWh
  1 MB of data = 1 GB Data / 1000 x 0.81 kWh/GB = 0.00081 kWh
  1 KB of data = 1 GB Data / 1,000,000 x 0.81 kWh/GB = 0.00000081 kWh
  1 Byte of data = 1 GB Data / 1,000,000,000 x 0.81 kWh/GB = 0.00000000081 kWh

  Examples for gCO2e per data size:
  1 GB of data = 1 GB Data x 0.81 kWh/GB x 442 g/kWh = 358.02 gCO2e
  1 MB of data = 1 GB Data / 1000 x 0.81 kWh/GB x 442 g/kWh = 0.35982 gCO2e
  1 KB of data = 1 GB Data / 1,000,000 x 0.81 kWh/GB x 442 g/kWh = 0.00035982 gCO2e
  1 Byte of data = 1 GB Data / 1,000,000,000 x 0.81 kWh/GB x 442 g/kWh = 0.00000035982 gCO2e
*/

// precalculated values based on above formulas and using 442 g/kWh as the carbon factor
export const KWH_PER_GIGABYTE = 0.81;
export const KWH_PER_MEGABYTE = 0.000791015625;
export const KWH_PER_KILOBYTE = 7.724761962890626e-7;
export const KWH_PER_BYTE = 7.543712854385376e-10;

export const GRAMS_OF_CARBON_PER_GIGABYTE = 358.02000000000004;
export const GRAMS_OF_CARBON_PER_MEGABYTE = 0.34962890625000004;
export const GRAMS_OF_CARBON_PER_KILOBYTE = 0.00034143447875976566;
export const GRAMS_OF_CARBON_PER_BYTE = 3.3343210816383365e-7;

export const BYTES_PER_GIGABYTE = 1073741824;
export const BYTES_PER_MEGABYTE = 1048576;
export const BYTES_PER_KILOBYTE = 1024;

// Bytes to kWh: bytes / BYTES_PER_GIGABYTE * KWH_PER_GIGABYTE
// Bytes to cO2e: bytes / BYTES_PER_GIGABYTE * KWH_PER_GIGABYTE * AVERAGE_CARBON_GRID_FACTOR

// https://sustainablewebdesign.org/calculating-digital-emissions/
export const DEVICE_CONSUMPTION_RATIO = 0.52;
export const NETWORK_CONSUMPTION_RATIO = 0.14;
export const DATA_CENTER_CONSUMPTION_RATIO = 0.15;
export const PRODUCTION_CONSUMPTION_RATIO = 0.19;

// https://www.npmjs.com/package/bytes-to-co2?activeTab=code
export const AVERAGE_CARBON_GRID_FACTOR = 442;

export const bytesToCPM = bytes => {
  if (typeof bytes !== 'number' || bytes < 0) {
    return 0
  }
  return bytesToGramsOfCarbon(bytes) * 1000
}

export const bytesToKWhours = bytes => {
  if (typeof bytes !== 'number' || bytes < 0) {
    return 0
  }
  return bytes / BYTES_PER_GIGABYTE * KWH_PER_GIGABYTE
}
//const kWhoursToGramsOfCarbon = (kwhours, carbonFactor = AVERAGE_CARBON_FACTOR_GRID) => kwhours * carbonFactor
export const bytesToGramsOfCarbon = bytes => bytesToKWhours(bytes) * AVERAGE_CARBON_GRID_FACTOR

export const bytesSegmentBreakdown = bytes => {
  if (typeof bytes !== 'number') {
    return {
      totalBytes: 0,
      totalKwhours: 0,
      deviceBytes: 0,
      deviceKWhours: 0,
      networkBytes: 0,
      networkKWhours: 0,
      dataCenterBytes: 0,
      dataCenterKWhours: 0,
      productionBytes: 0,
    }
  }

  return {
    totalBytes: bytes,
    totalKwhours: bytesToKWhours(bytes),
    deviceBytes: bytes * DEVICE_CONSUMPTION_RATIO,
    deviceKWhours: bytesToKWhours(bytes * DEVICE_CONSUMPTION_RATIO),
    networkBytes: bytes * NETWORK_CONSUMPTION_RATIO,
    networkKWhours: bytesToKWhours(bytes * NETWORK_CONSUMPTION_RATIO),
    dataCenterBytes: bytes * DATA_CENTER_CONSUMPTION_RATIO,
    dataCenterKWhours: bytesToKWhours(bytes * DATA_CENTER_CONSUMPTION_RATIO),
    productionBytes: bytes * PRODUCTION_CONSUMPTION_RATIO,
  }
}