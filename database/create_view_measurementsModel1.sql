DROP VIEW IF EXISTS view_MeasurementsModel1;
CREATE VIEW view_MeasurementsModel1 AS
SELECT 
  m.*,
  IFNULL(SUM(e.transferSize),0) as totalTransferSize,
  LAG(IFNULL(e.measurementId, 0), 1, 0) OVER w as previousMeasurementId,
  LAG(SUM(IFNULL(e.transferSize,0)), 1, 0) OVER w as previousTransferSize,
  SUM(IFNULL(e.transferSize, 0)) - LAG(SUM(IFNULL(e.transferSize,0)), 1, 0) OVER w as transferSizeChange,
  IFNULL((SUM(IFNULL(e.transferSize, 0)) - LAG(SUM(IFNULL(e.transferSize,0)), 1, 0) OVER w) / LAG(SUM(IFNULL(e.transferSize,0)), 1, 0) OVER w * 100,0) as transferSizeChangePct,
  IFNULL(SUM(e.gramsCO2),0) as totalGramsCO2,
  LAG(SUM(IFNULL(e.gramsCO2,0)), 1, 0) OVER w as previousGramsCO2,
  SUM(IFNULL(e.gramsCO2, 0)) - LAG(SUM(IFNULL(e.gramsCO2,0)), 1, 0) OVER w as gramsCO2Change,
  IFNULL(SUM(e.kWHours),0) as totalKWHours,
  COUNT(e.measurementId) as resourceCount,
  COUNT(DISTINCT e.initiatorType) as resourceTypeCount,
  LAG(SUM(IFNULL(e.kWHours,0)), 1, 0) OVER w as previousKWHours,
  SUM(IFNULL(e.kWHours, 0)) - LAG(SUM(IFNULL(e.kWHours,0)), 1, 0) OVER w as kWHoursChange,
  IFNULL(SUM(e.gramsCO2Device),0) AS totalGramsCO2Device,
  IFNULL(SUM(e.gramsCO2Network),0) AS totalGramsCO2Network,
  IFNULL(SUM(e.gramsCO2DataCenter),0) AS totalGramsCO2DataCenter,
  IFNULL(SUM(e.kWHoursDevice),0) AS totalKWHoursDevice,
  IFNULL(SUM(e.kWHoursNetwork),0) AS totalKWHoursNetwork,
  IFNULL(SUM(e.kWHoursDataCenter),0) AS totalKWHoursDataCenter
FROM Measurements m
LEFT JOIN view_MeasurementEntriesModel1 e ON m.measurementId = e.measurementID
GROUP BY m.measurementId, m.createdDate
WINDOW w as (PARTITION BY m.websiteId ORDER BY m.measurementId)
ORDER BY m.measurementId DESC;