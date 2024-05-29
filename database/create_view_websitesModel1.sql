DROP VIEW IF EXISTS view_websitesModel1;
CREATE VIEW view_websitesModel1 AS
SELECT 
  w.websiteId,
  w.name AS websiteName,
  w.url AS websiteUrl,
  w.slug AS websiteSlug,
  (SELECT measurementId FROM view_MeasurementsModel1 WHERE websiteId = w.websiteId ORDER BY measurementId desc LIMIT 1) as lastMeasurementId,
  (SELECT createdDate FROM view_MeasurementsModel1 WHERE websiteId = w.websiteId ORDER BY measurementId desc LIMIT 1) as lastMeasurementDate,
  (SELECT transferSizeChangePct FROM view_MeasurementsModel1 WHERE websiteId = w.websiteId ORDER BY measurementId desc LIMIT 1) as lastMeasurementChangePct
FROM Websites w 
ORDER BY lastMeasurementDate desc;
