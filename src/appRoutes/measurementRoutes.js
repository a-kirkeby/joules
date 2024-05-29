import * as mysql from '../mysql.js';

export const measurementRoute =  async (req, res) => {
  const {slug} = req.params

  const summary = await mysql.query(`
    SELECT
      COUNT(m.measurementId) as measurementCount,
      SUM(m.totalTransferSize) as totalTransferSize,
      SUM(m.totalGramsCO2) as totalGramsCO2,
      SUM(m.totalKWHours) as totalKWHours,
      (SELECT transferSizeChangePct FROM view_MeasurementsModel1 WHERE websiteId = m.websiteId ORDER BY createdDate DESC LIMIT 1) as transferSizeChangePct
    FROM view_MeasurementsModel1 m
    LEFT JOIN Websites w ON w.websiteId = m.websiteId
    WHERE w.slug = "${slug}"
    GROUP BY m.websiteId
    LIMIT 1
  `)

  const measurements = await mysql.query(`
    SELECT * FROM view_MeasurementsModel1 m
    LEFT JOIN Websites w ON w.websiteId = m.websiteId
    WHERE w.slug = "${slug}"
    ORDER BY m.createdDate DESC
  `)
  console.log('measurements', {summary, measurements})
  res.render('measurements', {
    summary,
    measurements
  });
}

export const measurementDetailsRoute = async (req, res) => {
  const {slug, measurementId} = req.params

  const measurement = await mysql.query(`
    SELECT 
      w.websiteId,
      w.name as websiteName,
      w.slug as websiteSlug,
      m.measurementId,
      m.totalTransferSize,
      m.createdDate,
      m.previousMeasurementId,
      m.previousTransferSize,
      m.transferSizeChange,
      m.transferSizeChangePct,
      m.totalGramsCO2,
      m.previousGramsCO2,
      m.gramsCO2Change,
      m.totalKWHours,
      m.previousKWHours,
      m.kWHoursChange,
      m.totalGramsCO2Device,
      m.totalGramsCO2Network,
      m.totalGramsCO2DataCenter,
      m.totalKWHoursDevice,
      m.totalKWHoursNetwork,
      m.totalKWHoursDataCenter
    FROM view_MeasurementsModel1 m
    LEFT JOIN Websites w ON w.websiteId = m.websiteId
    WHERE w.slug = '${slug}' AND m.measurementId = ${measurementId}
    LIMIT 1;
  `)

  const pages = await mysql.query(`
    SELECT 
      e.pageUrl,
      COUNT(e.measurementEntryID) as resourceCount,
      SUM(e.transferSize) as transferSize,
      SUM(e.kWHours) as kWHours,
      SUM(e.gramsCO2) as gramsCO2,
      SUM(e.emissionsContribution) as emissionsContribution
    FROM view_MeasurementEntriesModel1 e
    WHERE e.websiteSlug = '${slug}' AND e.measurementId = ${req.params.measurementId}
    GROUP BY e.pageUrl
  `)

  const resources = await mysql.query(`
    SELECT 
      e.name,
      SUM(e.transferSize) as transferSize,
      SUM(e.kWHours) as kWHours,
      SUM(e.gramsCO2) as gramsCO2,
      SUM(e.emissionsContribution) as emissionsContribution,
      COUNT(e.measurementEntryID) as visitCount,
      SUM(e.cacheSavings) as cacheSavings,
      SUM(e.cacheSavings)/SUM(transferSize)*100 as cacheRate
    FROM view_MeasurementEntriesModel1 e
    WHERE e.websiteSlug = '${slug}' AND e.measurementId = ${req.params.measurementId}
    GROUP BY e.name
  `)

  const network = await mysql.query(`
    SELECT 
      e.measurementId,
      e.name,
      e.pageUrl,
      e.entryType,
      e.initiatorType,
      e.isCache,
      e.transferSize,
      e.kWHours,
      e.gramsCO2,
      e.emissionsContribution,
      e.kWhoursDevice,
      e.kWhoursNetwork,
      e.kWhoursDataCenter,
      e.gramsCO2Device,
      e.gramsCO2Network,
      e.gramsCO2DataCenter
    FROM view_MeasurementEntriesModel1 e
    WHERE e.websiteSlug = '${slug}' AND e.measurementId = ${req.params.measurementId}
  `)

  const resourceTypes = await mysql.query(`
    SELECT  
      initiatorType,
      COUNT(measurementEntryID) AS resourceCount,
      IFNULL(SUM(transferSize),0) AS totalTransferSize,
      IFNULL(AVG(transferSize),0) AS averageTransferSize,
      IFNULL(SUM(gramsCO2),0) AS totalGramsCO2,
      IFNULL(SUM(gramsCO2) / COUNT(measurementEntryID),0) AS avgGramsCO2,
      IFNULL(SUM(kWHours),0) AS totalKWHours,
      IFNULL(SUM(kWHours) / COUNT(measurementEntryID),0) AS avgKWHours,
      IFNULL((SUM(transferSize) / (SELECT SUM(transferSize) FROM view_MeasurementEntriesModel1 WHERE measurementID = ${req.params.measurementId})) * 100,0) AS typeContribution 
    FROM view_MeasurementEntriesModel1
    WHERE measurementId = ${measurementId}
    GROUP BY initiatorType
  `)
  
  const viewData = {
    measurement,
    resources,
    network,
    resourceTypes,
    pages
  }
  res.render('measurementDetails', viewData)
}