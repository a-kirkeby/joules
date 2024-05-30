import mysql from 'mysql2/promise';

// TODO: Move to true env file
const localCredentials = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'aki',
  password: process.env.MYSQL_PASSWORD || 'R0bertParr',
  database: process.env.MYSQL_DB || 'noveltygraph'
}

const doCredentials = {
  host: process.env.MYSQL_HOST || 'dbaas-db-1812534-do-user-1635203-0.c.db.ondigitalocean.com',
  user: process.env.MYSQL_USER || 'noveltygraph',
  password: process.env.MYSQL_PASSWORD || 'AVNS_ToqtaskMe37Jo2Lm1EB',
  port: process.env.MYSQL_PORT || 25060,
  database: process.env.MYSQL_DB || 'noveltygraph',
  ssl: {
    ca: './database/ca-certificate.crt',
  }
}

// Create MySQL connection
const connection = await mysql.createConnection(process.env.ENV == 'DEV' ? doCredentials : localCredentials);

export const columnNames = {
  NAME: 'name',
  ENTRY_TYPE: 'entryType',
  START_TIME: 'startTime',
  DURATION: 'duration',
  INITIATOR_TYPE: 'initiatorType',
  DELIVERY_TYPE: 'deliveryType',
  NEXT_HOP_PROTOCOL: 'nextHopProtocol',
  RENDER_BLOCKING_STATUS: 'renderBlockingStatus',
  WORKER_START: 'workerStart',
  REDIRECT_START: 'redirectStart',
  REDIRECT_END: 'redirectEnd',
  FETCH_START: 'fetchStart',
  DOMAIN_LOOKUP_START: 'domainLookupStart',
  DOMAIN_LOOKUP_END: 'domainLookupEnd',
  CONNECT_START: 'connectStart',
  SECURE_CONNECTION_START: 'secureConnectionStart',
  CONNECT_END: 'connectEnd',
  REQUEST_START: 'requestStart',
  RESPONSE_START: 'responseStart',
  FIRST_INTERIM_RESPONSE_START: 'firstInterimResponseStart',
  RESPONSE_END: 'responseEnd',
  TRANSFER_SIZE: 'transferSize',
  ENCODED_BODY_SIZE: 'encodedBodySize',
  DECODED_BODY_SIZE: 'decodedBodySize',
  RESPONSE_STATUS: 'responseStatus',
  SERVER_TIMING: 'serverTiming',
  UNLOAD_EVENT_START: 'unloadEventStart',
  UNLOAD_EVENT_END: 'unloadEventEnd',
  DOM_INTERACTIVE: 'domInteractive',
  DOM_CONTENT_LOADED_EVENT_START: 'domContentLoadedEventStart',
  DOM_CONTENT_LOADED_EVENT_END: 'domContentLoadedEventEnd',
  DOM_COMPLETE: 'domComplete',
  LOAD_EVENT_START: 'loadEventStart',
  LOAD_EVENT_END: 'loadEventEnd',
  TYPE: 'type',
  REDIRECT_COUNT: 'redirectCount',
  ACTIVATION_START: 'activationStart',
  CRITICAL_CH_RESTART: 'criticalCHRestart'
}

export const columns = Object.values(columnNames);
/*
DATA FORMAT
const jsonData = {
  name: 'http://localhost:4000/',
  entryType: 'navigation',
  startTime: 0,
  duration: 67.5,
  initiatorType: 'navigation',
  deliveryType: '',
  nextHopProtocol: 'http/1.1',
  renderBlockingStatus: 'non-blocking',
  workerStart: 0,
  redirectStart: 0,
  redirectEnd: 0,
  fetchStart: 0.09999999403953552,
  domainLookupStart: 43.19999998807907,
  domainLookupEnd: 43.19999998807907,
  connectStart: 43.19999998807907,
  secureConnectionStart: 0,
  connectEnd: 43.599999994039536,
  requestStart: 43.69999998807907,
  responseStart: 55.69999998807907,
  firstInterimResponseStart: 0,
  responseEnd: 56.400000005960464,
  transferSize: 686,
  encodedBodySize: 386,
  decodedBodySize: 386,
  responseStatus: 200,
  serverTiming: [],
  unloadEventStart: 0,
  unloadEventEnd: 0,
  domInteractive: 65.90000000596046,
  domContentLoadedEventStart: 65.90000000596046,
  domContentLoadedEventEnd: 67.09999999403954,
  domComplete: 67.5,
  loadEventStart: 67.5,
  loadEventEnd: 67.5,
  type: 'navigate',
  redirectCount: 0,
  activationStart: 0,
  criticalCHRestart: 0
};
*/

// Function to query data from MySQL
export async function query(query) {

  if (!query) {
    console.error('No query provided');
    return;
  }

  try {
    const [results, fields] = await connection.query(query)
    // if the query ends with 'LIMIT 1', return the first result
    if (query.slice(-15).includes('LIMIT 1')) {
      return results[0]
    }
    return results
  } catch (err) {
    console.error('Error querying data: ' + err.message);
    throw err;
  }
}