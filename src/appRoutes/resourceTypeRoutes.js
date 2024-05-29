import * as mysql from '../mysql.js';

export const resourceTypeRoutes = async (req, res) => {
  const { slug, type } = req.params

  let r = {}
  switch (type) {
    case 'pages': r = {
      headline: 'Pages',
      description: 'Review individual pages and their impact on emisssions',
      sqlFilter: 'e.initiatorType = "navigation"'
    }; break;
    case 'images': r = {
      headline: 'Images',
      description: 'Review how page markup and images impacts emisssions',
      sqlFilter: 'e.initiatorType = "img"'
    }; break;
    case 'styling': r = {
      headline: 'Styling',
      description: 'Review stylesheets styling impacts emisssions',
      sqlFilter: 'e.initiatorType = "link"'
    }; break;
    case 'scripts': r = {
      headline: 'Scripts',
      description: 'Review javascript files and the scripts impacts emisssions',
      sqlFilter: 'e.initiatorType = "script"'
    }; break;
    case 'other': r = {
      headline: 'Other',
      description: 'Review other types of resources',
      sqlFilter: 'e.entryType = "navigation"'
    }; break;
  }


  const resources = await mysql.query(`
    SELECT e.* FROM view_MeasurementEntriesModel1 e
    LEFT JOIN Websites w ON w.websiteId = e.websiteId
    WHERE w.slug = "${slug}" AND ${r.sqlFilter}
    AND e.measurementId = (
      SELECT measurementId FROM Measurements 
      WHERE websiteId = w.websiteId 
      ORDER BY measurementId DESC
      LIMIT 1
    )
    ORDER BY e.transferSize DESC
  `)

  const summary = await mysql.query(`
    SELECT 
      SUM(transferSize) as totalTransferSize,
      SUM(emissionsContribution) as totalEmissionsContribution,
      SUM(kWHours) as totalKWHours,
      SUM(gramsCO2) as totalGramsCO2
    FROM view_MeasurementEntriesModel1 e
    LEFT JOIN Websites w ON w.websiteId = e.websiteId
    WHERE w.slug = "${slug}" AND ${r.sqlFilter}
    AND e.measurementId = (
      SELECT measurementId FROM Measurements 
      WHERE websiteId = w.websiteId 
      ORDER BY measurementId DESC
      LIMIT 1
    )
    LIMIT 1
  `)

  const viewData = {
    ...r,
    resources,
    summary
  }
  console.log('resourceTypeRoutes', viewData)
  
  res.render('resourceType', viewData);
}