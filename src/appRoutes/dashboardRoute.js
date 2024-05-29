import * as mysql from '../mysql.js';

export const dashboardRoute = async (req, res) => {

  const websites = await mysql.query(`
    SELECT * FROM view_websitesModel1
  `)

  const summary = await mysql.query(`
    SELECT sum(m.totalTransferSize) as totalTransferSize,
      sum(m.totalGramsCO2) as totalGramsCO2,
      sum(m.totalKWHours) as totalKWHours,
      sum(m.resourceCount) as totalResourceCount,
      count(DISTINCT websiteId) as activeAppCount,
      (SELECT COUNT(*) FROM Websites) as appCount,
      (SELECT COUNT(*) FROM Measurements) as measurementCount
    FROM view_MeasurementsModel1 m
    WHERE m.measurementId IN (
      SELECT MAX(measurementId)
      from view_MeasurementsModel1
      GROUP BY websiteId
    )
    LIMIT 1;
  `)

  const measurementsByWeek = await mysql.query(`
      SELECT 
        WEEK(createdDate) as week,
        YEAR(createdDate) as year,
        SUM(totalTransferSize) as totalTransferSize,
        LAG(SUM(totalTransferSize), 1,0) OVER (ORDER BY SUM(totalTransferSize)) as previousWeek
      FROM view_MeasurementsModel1
      GROUP BY WEEK(createdDate), YEAR(createdDate)
      ORDER BY year desc, week desc
      LIMIT 2
  `)

  console.log('dashboard', summary)
  res.render('dashboard', {
    websites,
    measurementsByWeek,
    summary
  });
}