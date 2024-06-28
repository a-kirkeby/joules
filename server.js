
import express from 'express'
import { engine } from 'express-handlebars';
import cors from 'cors'

import helpers from './src/templateHelpers.js'
import registerApiRoutes from './src/apiRoutes.js'
import { init } from './database/keyvaluestore/keyvaluestore.js'

import { dashboardRoute } from './src/appRoutes/dashboardRoute.js'
import { measurementDetailsRoute, measurementRoute } from './src/appRoutes/measurementRoutes.js'
import { websiteDetailsRoute, websitesRoute } from './src/appRoutes/websitesRoutes.js'

import { addGlobalData, attachFullUrl, verifyToken } from './src/middleware.js'
import { insightsRoute } from './src/appRoutes/insightsRoutes.js';
import { loginRoute } from './src/appRoutes/login.js';
import cookieParser from 'cookie-parser';
import { resourceTypeRoutes } from './src/appRoutes/resourceTypeRoutes.js';

const app = express()
const port = process.env.PORT || 4000

// Set up Handlebars as the template engine
app.engine('.hbs', engine({ 
    extname: '.hbs',
    helpers
}));

app.set('view engine', '.hbs');
app.set('views', './views');

app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use(attachFullUrl)

// public assets and login page
app.use(express.static('public'))
app.get('/login', loginRoute)

// routes from here on require authentication
app.use(verifyToken)
app.use('/staradmin', express.static('star-admin2-free-admin-template-1.0.0/template'))

app.get('/', addGlobalData, dashboardRoute)
app.get('/websites', addGlobalData, websitesRoute)
app.get('/websites/:slug', addGlobalData, websiteDetailsRoute)
app.get('/websites/:slug/measurements', addGlobalData, measurementRoute)
app.get('/websites/:slug/measurements/:measurementId', addGlobalData, measurementDetailsRoute)
app.get('/websites/:slug/:type', addGlobalData, resourceTypeRoutes)
app.get('/insights', addGlobalData, insightsRoute)
app.get('*', (req, res) => res.render('404', { layout: 'login' }))


init()
registerApiRoutes(app)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})