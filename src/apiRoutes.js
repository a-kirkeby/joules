import * as mysql from './mysql.js'
import { runSite } from '../monitorMysql.js'

const AKI_PASSWORD = 'XjN3f8rfR7Q69Hfu'
const ACCESS_TOKEN = 'XjN3f8rfR7Q69HfuXjN3f8rfR7Q69Hfu'

export default app => {
  app.post('/api/websites', async (req, res) => {
    console.log('Got post to /api/websites', {data: req.body})

    const { name, url, description } = req.body
    const slug = name.toLowerCase().replace(/ /g, '-')
    const { insertId } = await mysql.query(`
      INSERT INTO Websites (tenantId, name, slug, url, description) 
      VALUES (1, "${name}", "${slug}" , "${url}", "${description.replace("'", "\'")}");`)
    res.sendStatus(200)
  })

  app.post('/api/websites/:websiteId/measurements', async (req, res) => {
      const { websiteId } = req.params
      const measurementId = await runSite(parseInt(websiteId))
      console.log('ran site', {measurementId})
      res.json({success: true, measurementId})
  })

  // for simulating heavy api calls
  app.get('/api/payload', async (req, res) => {
    res.json({payload: 'this is a payload of 311 bytes'})
  })

  app.post('/api/auth/authenticate', async (req, res) => {
    console.log('Got post to /api/auth/authenticate', {data: req.body})
    const { email, password } = req.body

    if (email === 'aki@noveltygraph.com' && password === AKI_PASSWORD) {
      res.cookie('access_token', 'Bearer ' + ACCESS_TOKEN, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true, 
        secure: false, 
        sameSite: true
      })
      res.json({success: true})
    } else {
      res.json({success: false})
    }
  })
}