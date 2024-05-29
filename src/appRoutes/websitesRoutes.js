import * as mysql from '../mysql.js';


// Websites List
export const websitesRoute = async (req, res) => {
  const websites = await mysql.query(`
    SELECT 
        w.websiteId, 
        w.name, 
        w.url, 
        w.slug, 
        w.description,
        w.createdDate,
        (SELECT COUNT(*) FROM view_MeasurementsModel1 WHERE websiteId = w.websiteId) as measurementCount,
        IFNULL((SELECT totalGramsCO2 FROM view_MeasurementsModel1 WHERE websiteId = w.websiteId ORDER BY createdDate DESC LIMIT 1),0) as totalGramsCO2,
        (SELECT createdDate FROM view_MeasurementsModel1 WHERE websiteId = w.websiteId ORDER BY createdDate DESC LIMIT 1) as lastMeasurementDate,
        (SELECT measurementId FROM view_MeasurementsModel1 WHERE websiteId = w.websiteId ORDER BY createdDate DESC LIMIT 1) as lastMeasurementId
      FROM Websites w
  `)

  const summary = await mysql.query(`
    SELECT 
      COUNT(m.measurementId) as measuredWebsiteCount,
      SUM(m.totalGramsCO2) as totalGramsCO2,
      AVG(m.totalGramsCO2) as averageGramsCO2,
      SUM(m.totalKWHours) as totalKWHours,
      AVG(m.totalKWHours) as averageKWHours
    FROM view_MeasurementsModel1 m
    WHERE m.measurementId IN (
      SELECT MAX(measurementId) from view_MeasurementsModel1 GROUP BY websiteId
    ) 
    LIMIT 1;
  `)

  const data = {
    websites,
    summary
  }

  console.log('done result', data)
  res.render('websites', data);
}

// Website Details
export const websiteDetailsRoute = async (req, res) => {
  const website = await mysql.query(`
    SELECT 
      w.websiteId, 
      w.name, 
      w.url, 
      w.slug, 
      w.description,
      w.createdDate
    FROM Websites w
    WHERE w.tenantId = 1 and w.slug = '${req.params.slug}'
    LIMIT 1
  `)

  const summary = await mysql.query(`
    SELECT
      SUM(m.totalGramsCO2) as totalGramsCO2,
      AVG(m.totalGramsCO2) as averageGramsCO2,
      SUM(m.totalKWHours) as totalKWHours,
      AVG(m.totalKWHours) as averageKWHours
    FROM view_MeasurementsModel1 m
    WHERE m.websiteId = 2
    GROUP BY m.websiteId
    LIMIT 1
  `)

  const measurements = await mysql.query(`
    SELECT 
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
      m.totalKWHoursDataCenter,
      (SELECT COUNT(*) FROM view_MeasurementEntriesModel1 WHERE measurementId = m.measurementId) as resourceCount
    FROM view_MeasurementsModel1 m
    WHERE m.websiteId = ${website.websiteId}
    ORDER BY m.measurementId DESC
  `)

  const viewData = {
    website,
    measurements: measurements.map(x => ({...x, hasChangeIncrease: x.transferSizeChange > 0})),
    latestMeasurement: measurements[0],
    summary
  }
  console.log('rendering websiteDetails', { ...viewData })
  res.render('websiteDetails', { ...viewData });
}