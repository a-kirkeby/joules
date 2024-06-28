
import { getWebsites } from '../database/keyvaluestore/keyvaluestore.js';
import * as mysql from './mysql.js';

const port = process.env.PORT || 4000

export const attachFullUrl = (req, res, next) => {
  const protocol = req.protocol;
  const host = req.hostname;
  const url = req.originalUrl;
  const fullUrl = `${protocol}://${host}:${port}${url}`
  req.fullUrl = fullUrl
  req.siteName = new URL(fullUrl).hostname

  next()
}

export const addGlobalData = async (req, res, next) => {
  // for future shared data between routes
  //const websites = await mysql.query('SELECT * FROM Websites WHERE tenantId = 1')
  const websites = await getWebsites()
  const items = websites.map(site => Object.assign({}, site, { isActive: req.url.includes(site.slug)}))
  
  res.locals.globals = {
    websites: items
  }
  next()
}

export const verifyToken = (req, res, next) => {

  const publicRoutes = ['/login', '/api/auth/authenticate']
  if (publicRoutes.includes(req.path)) {
    next()
    return
  }

  const token = req.cookies.access_token
  if (!token) {
    console.log('No token found, redirecting to login')
    res.redirect('/login')
    return
  }

  next()
}
