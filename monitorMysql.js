
import fs from 'fs';
import puppeteer from 'puppeteer-core';
import { executablePath } from 'puppeteer'

import * as mysql from './src/mysql.js'

// https://www.npmjs.com/package/bytes-to-co2?activeTab=code
const AVERAGE_KILO_WATT_HOUR_PER_GB = 1.805;
const AVERAGE_CARBON_FACTOR_GRID = 475;
const GIGABYTE_TO_BYTES = 1073741824;
// const METHOD_AND_MODEL_NUMBER = '1.0.0-1.0.0'
const bytesToKWhours = bytes => parseFloat(bytes / (AVERAGE_KILO_WATT_HOUR_PER_GB * GIGABYTE_TO_BYTES)).toFixed(15)
//const kWhoursToGramsOfCarbon = (kwhours, carbonFactor = AVERAGE_CARBON_FACTOR_GRID) => kwhours * carbonFactor
const bytesToGramsOfCarbon = bytes => parseFloat(bytesToKWhours(bytes) * AVERAGE_CARBON_FACTOR_GRID).toFixed(15)
// const version = METHOD_AND_MODEL_NUMBER

const numberOrString = x => {

    if (x === null || x === undefined)
        return 'NULL'

    if (typeof x === 'number' || x.slice(0, 2) === '0.')
        return x

    if (typeof x === 'string')
        return `'${x}'`

    return 'NULL'
}


const sendMysql2 = async (websiteId, tenantId, measurementId, perfEntries) => {
    //console.log('sendMysql2', { perfEntries })

    let insertStatement = `
        INSERT INTO MeasurementEntries (
            websiteId, 
            tenantID, 
            measurementId, 
            name, 
            pageUrl,
            entryType, 
            startTime, 
            duration, 
            initiatorType, 
            deliveryType, 
            nextHopProtocol, 
            renderBlockingStatus, 
            workerStart, 
            redirectStart, 
            redirectEnd, 
            fetchStart, 
            domainLookupStart, 
            domainLookupEnd, 
            connectStart, 
            secureConnectionStart, 
            connectEnd, 
            requestStart, 
            responseStart, 
            firstInterimResponseStart, 
            responseEnd, 
            transferSize, 
            encoding,
            headerSize,
            encodedBodySize, 
            decodedBodySize, 
            responseStatus, 
            unloadEventStart, 
            unloadEventEnd, 
            domInteractive, 
            domContentLoadedEventStart, 
            domContentLoadedEventEnd, 
            domComplete, 
            loadEventStart, 
            loadEventEnd, 
            type, 
            redirectCount, 
            activationStart, 
            criticalCHRestart
        ) VALUES `;

    insertStatement += perfEntries.map((entry, i) => {
        // well calculate the watts and carbon consumed for each entry
        return `(
            ${websiteId}, 
            ${tenantId}, 
            ${measurementId}, 
            ${numberOrString(entry.name)}, 
            ${numberOrString(entry.pageUrl)}, 
            ${numberOrString(entry.entryType)}, 
            ${numberOrString(entry.startTime)}, 
            ${numberOrString(entry.duration)}, 
            ${numberOrString(entry.initiatorType)}, 
            ${numberOrString(entry.deliveryType)}, 
            ${numberOrString(entry.nextHopProtocol)}, 
            ${numberOrString(entry.renderBlockingStatus)}, 
            ${numberOrString(entry.workerStart)}, 
            ${numberOrString(entry.redirectStart)}, 
            ${numberOrString(entry.redirectEnd)}, 
            ${numberOrString(entry.fetchStart)}, 
            ${numberOrString(entry.domainLookupStart)}, 
            ${numberOrString(entry.domainLookupEnd)}, 
            ${numberOrString(entry.connectStart)}, 
            ${numberOrString(entry.secureConnectionStart)}, 
            ${numberOrString(entry.connectEnd)}, 
            ${numberOrString(entry.requestStart)}, 
            ${numberOrString(entry.responseStart)}, 
            ${numberOrString(entry.firstInterimResponseStart)}, 
            ${numberOrString(entry.responseEnd)}, 
            ${numberOrString(entry.transferSize)},
            ${numberOrString(entry.encoding)}, 
            ${numberOrString(entry.headerSize)}, 
            ${numberOrString(entry.encodedBodySize)},
            ${numberOrString(entry.decodedBodySize)}, 
            ${numberOrString(entry.responseStatus)}, 
            ${numberOrString(entry.unloadEventStart)}, 
            ${numberOrString(entry.unloadEventEnd)}, 
            ${numberOrString(entry.domInteractive)}, 
            ${numberOrString(entry.domContentLoadedEventStart)}, 
            ${numberOrString(entry.domContentLoadedEventEnd)}, 
            ${numberOrString(entry.domComplete)}, 
            ${numberOrString(entry.loadEventStart)}, 
            ${numberOrString(entry.loadEventEnd)}, 
            ${numberOrString(entry.type)}, 
            ${numberOrString(entry.redirectCount)}, 
            ${numberOrString(entry.activationStart)}, 
            ${numberOrString(entry.criticalCHRestart)}
        )`
    }).join(',\n');


    const result = await mysql.query(insertStatement)
    console.log('Done inserting')
}

const visitedUrls = new Set()
const errorLog = []
const videoFormats = ['.mp4', '.avi', '.flv', '.mov', '.wmv', '.webm']
const fileFormats = ['.pdf', '.xlsx', '.csv', '.docx', '.doc', '.ppt', '.pptx', '.xls']
const webFormats = ['.css', '.js', '.html', '.htm', '.json', '.xml', '.svg', '.txt', '.md', '.php', '.asp', '.aspx', '.jsp', '.py', '.rb', '.java', '.c', '.cpp', '.cs', '.ts', '.jsx', '.tsx', '.vue', '.svelte', '.go', '.rs', '.swift', '.kt', '.dart', '.pl', '.sh', '.bat', '.ps1', '.psm1', '.psd1', '.ps1xml']

const isVideoFormat = url => videoFormats.some(ext => url.endsWith(ext))
const isFileFormat = url => fileFormats.some(ext => url.endsWith(ext))
const getFileFormat = (url, entryType) => {
    
    const extention = url.split('.').pop()
    console.log('getFileFormat', { url, extention, entryType })

    const formats = [...webFormats, ...fileFormats, ...videoFormats]

    return formats.some(ext => url.endsWith(ext)) ? extention : 'html'
}

const pageVisit = async (browser, websiteId, tenantId, siteName, url, measurementId, depth = 0, maxDepth = -1) => {
    const originalUrl = url

    // remove railing slashes to avoid duplicate pages like "index.html" and "index.html/"
    url = url.replace(/\/$/, "")

    if (visitedUrls.has(url)) {
        console.log('already visited', { url, depth }, '. Skipping')
        return
    }

    if (isVideoFormat(url)) {
        console.log('skipping video', url)
        return
    }

    console.log('visiting', { browser, websiteId, tenantId, siteName, url, originalUrl, measurementId })

    visitedUrls.add(url)
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    await page.setRequestInterception(true);
    const requestPayloads = [];

    // required for request to continue when intercepting
    page.on('request', async request => {
        const url = request.url().toLowerCase();
        const resourceType = request.resourceType();

        // skip chrome resources, as they are not needed
        if (url.startsWith('chrome')) {
            //console.log('--- skipping chrome resource', url, resourceType)
            request.abort()
            return
        }

        // add blocking of certain resources here
        request.continue()
    })

    page.on('response', async response => {
        
        try {
            const requestUrl = response.url()
            const type = response.headers()['content-type']
            const encoding = response.headers()['content-encoding']
            const status = response.status()
            
            if (status == 404) {
                // no need to handle non-existing resources
                console.log('!!!> 404 found', { requestUrl, status })
                return
            }
            
            const headerSize = Buffer.byteLength(JSON.stringify(response.headers()))
            const encodedBodySize = parseInt(response.headers()['content-length']) || 0
            const decodedBodySize = (isVideoFormat(requestUrl) || isFileFormat(requestUrl)) ? encodedBodySize : Buffer.byteLength(await response.buffer())
    
            requestPayloads.push({ requestUrl, pageUrl: url, status, type, headerSize, encodedBodySize, decodedBodySize, encoding })
            console.log('Done with response', requestUrl, {decodedBodySize, requestPayloads})

        } catch (error) {
            console.error('Error: Could not get response for request. Skipping', url)
            console.error(error)
            errorLog.push({ url, error })
        }
    })

    // Navigate the page to a URL and wait for the required 
    // DOM to be rendered (required to get all requests)
    try {
        console.log('navigating to', { url, depth })
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log('done navigating')
    } catch (e) {
        errorLog.push({ url, error: e.message })

        // if this is not a known file format, we should exit
        if (!isFileFormat(url)) {
            console.error('!!!> Could not visit', url, { message: e.message })
            if (depth == 0) {
                console.log('Depth is zero, is the site running?')
                process.exit(1)
            }
    
            console.log('Skipping', url, 'because it errored')
            return
        }
        // continue processing the known file type
        console.log('Continuing processing know format', url)
    }

    // wait for the page to load
    await page.waitForSelector('body');
    
    // filter out paint and visibility-state entries as they are not needed for measuring
    const pageData = await page.evaluate(() => JSON.stringify(performance.getEntries()))
    const perfEntries = JSON.parse(pageData).filter(x => !['paint', 'visibility-state','long-animation-frame'].includes(x.entryType));

    // map collected payload sizes onto their matching perf entries
    const entries = [...perfEntries]
    entries.map(x => {
        x.pageUrl = url
        x.type = getFileFormat(x.name, x.entryType)

        // for files opened in a new tab, we still need them to appear as regular file resources and not navigation items
        // if (x.name === 'about:blank' && isFileFormat(x.pageUrl)) {
        //     x.name = x.pageUrl
        //     x.entryType = 'resource'
        //     x.initiatorType = 'file'
        // }

        // TODO: for favicon.ico, we need to find the correct pageUrl, currently it finds the PDF page
        const payload = requestPayloads.find(y => y.requestUrl == x.name)
        if (!payload) return
        
        const { headerSize, decodedBodySize, encodedBodySize, encoding } = payload

        // if (isFileFormat(x.name)) {
        //     x.type = payload.type
        // }
        x.headerSize = headerSize || 0
        x.encodedBodySize = encoding ? encodedBodySize : decodedBodySize
        x.decodedBodySize = decodedBodySize || 0
        x.encoding = encoding || 'none'
        
        // transferSize is the sum of the header size and the body size (encoded or non-encoded, depending on compression)
        // if the file is served from cache, the transfer size is 0
        
        //x.transferSize = x.deliveryType == 'cache' ?  0 : headerSize + (encodedBodySize && encodedBodySize > 0 ? encodedBodySize : decodedBodySize)
        x.transferSize = headerSize + (encodedBodySize && encodedBodySize > 0 ? encodedBodySize : decodedBodySize)

        // identify cache hits?
        // See: https://developer.mozilla.org/en-US/docs/Web/API/PerformanceResourceTiming/transferSize
    })

    // send the data to the database
    console.log('sending data to mysql', { measurementId, perfEntries, requestPayloads, result: entries })
    await sendMysql2(websiteId, tenantId, measurementId, entries)

    // if maxDepth is set and we're at the limit, don't go any deeper
    if (maxDepth > -1 && depth > maxDepth) {
        return
    }

    // find links to traverse
    const hrefs = await page.$$eval('a', links => links.map(a => a.href.replace(/#$/, '')));

    // only traverse internal links
    const site = new URL(url)
    const links = hrefs
        .filter(href => href.startsWith(site.origin))
        .filter(href =>  !href.toLowerCase().includes('mailto'))
        .filter(href =>  !isVideoFormat(href))
        //.filter(href =>  !['.pdf', 'tel:', '.xlsx', '.csv', '.docx', '.doc', '.ppt', '.pptx', '.xls'].some(ext => href.endsWith(ext)))
        .map(x => x.replace(/\/+$/g, ''))

    const promises = []
    for (let i = 0; i < links.length; i++) {
        promises.push(pageVisit(browser, websiteId, tenantId, siteName, links[i], measurementId, depth + 1))
    }
    await Promise.all(promises)
}

const runSite = async (siteId) => {
    //const url = args[0] || 'http://localhost:4001'
    console.log('Running site', siteId)
    const siteResult = await mysql.query(`SELECT websiteId, name, url FROM Websites WHERE websiteId = ${siteId}`)
    const { name, url } = siteResult[0]
    const { insertId: measurementId } = await mysql.query(`INSERT INTO Measurements (tenantId, websiteId, modelId) VALUES (1, ${siteId}, 1);`)
    console.log('Created measurement', { measurementId, name, url })

    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
        executablePath: executablePath()
    });

    await pageVisit(browser, siteId, 1, name, url, measurementId)

    visitedUrls.clear()
    await browser.close();
    console.log('done with', { url, measurementId })
    console.log('Errors found', errorLog.length, '\n', {errorLog})
    return measurementId
}

export {
    runSite
}

// CLI 
(async () => {

    console.log('-------------------------------------')
    console.log('---------- Running monitor ----------')
    console.log('-------------------------------------')

    const args = process.argv.slice(2)
    if (args.length == 0) {
        console.log('Ran monitor, but no arguments. Exitting.')
        return
    }

    const promises = []
    args.forEach(url => promises.push(runSite(url)))
    await Promise.all(promises)
    
    console.log('Done running', promises.length, 'sites')
    process.exit(0)
})()
