DROP VIEW IF EXISTS view_MeasurementEntriesModel1;
CREATE VIEW view_MeasurementEntriesModel1 AS
SELECT  
  e.measurementEntryID,
  e.websiteId,
  w.slug as websiteSlug,
  e.tenantID,
  e.measurementID,
  e.name,
  e.pageUrl,
  e.entryType,
  e.initiatorType,
  e.type,
  IF(e.deliverytype = 'cache', true, false) as isCache,
  e.transferSize,
  e.encodedBodySize as encodedBodySize,
  e.decodedBodySize as decodedBodySize,
  e.headerSize as headerSize,
  IF(e.deliverytype = 'cache', e.transferSize + e.headerSize, 0) AS cacheSavings,
  e.transferSize / (SUM(e.transferSize) over(PARTITION BY measurementID)) * 100 AS emissionsContribution,
  (e.transferSize * (1.805 / 1073741824)) as kWHours,
  (e.transferSize * (1.805 / 1073741824) * 475) as gramsCO2,
  (e.transferSize * (1.805 / 1073741824) * (0.52 + 0.6))  as kWhoursDevice,
  (e.transferSize * (1.805 / 1073741824) * (0.14 + 0.6))  as kWhoursNetwork,
  (e.transferSize * (1.805 / 1073741824) * (0.15 + 0.7)) as kWhoursDataCenter,
  (e.transferSize * (1.805 / 1073741824) * 475 * (0.52 + 0.6))  as gramsCO2Device,
  (e.transferSize * (1.805 / 1073741824) * 475 * (0.14 + 0.6))  as gramsCO2Network,
  (e.transferSize * (1.805 / 1073741824) * 475 * (0.15 + 0.7)) as gramsCO2DataCenter
FROM MeasurementEntries e
LEFT JOIN Websites w ON w.websiteId = e.websiteId;