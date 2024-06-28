import fs from 'fs';

let _data = {
  "user:1": {
    name: "Anders Kirkeby",
    email: "aki@noveltygraph.com",
    createdDate: "2021-01-01T00:00:00Z"
  },
  "website:1": {
    name: "NoveltyGraph",
    desciption: "A graphing library",
    slug: "noveltygraph",
    url: "https://noveltygraph.com",
    createdDate: "2021-01-01T00:00:00Z"
  },
  "website:1:measurement:1": [],
}

export const init = async () => {
  try {
    _data = JSON.parse(fs.readFileSync('./database/keyvaluestore/data.json', 'utf8'))
  } catch (e) {
    console.log('Error reading data.json', e)
  }
}

export const get = async key => _data[key]
export const set = async (key, value) => {
  _data[key] = value
  await persist()
}

export const getWebsite = async websiteSlug => Object.keys(_data).find(key => key === `website:${websiteSlug}`)
export const getWebsites = async () => Object.keys(_data).filter(key => key.match(/^website:[\w_-]+$/)).map(key => _data[key])

export const getMeasurements = async websiteSlug => {
  const keys = Object.keys(_data).filter(key => new RegExp(`^website:${websiteSlug}:measurement:[\\d]+$`, "g").test(key))
  const result = keys.reduce((acc, key) => [...acc, _data[key]],[])
  console.log('res', {keys, result})
  return result
}

export const getMeasurement = async measurementId => {
  const key = Object.keys(_data).find(key => new RegExp(`:measurement:${measurementId}$`, "g").test(key))
  return _data[key]
}

export const createWebsite = async data => {
  const websiteKey = `website:${Object.keys(_data).filter(key => key.match(/^website:[\w_-]+$/)).length + 1}`
  _data[websiteKey] = {...data, websiteId: websiteKey.split(':')[1]}
  await persist()
}

export const createMeasurement = async (websiteSlug, data) => {
  const measurementKey = `${websiteSlug}:measurement:${Object.keys(_data).filter(key => key.match(new RegExp(`^${websiteSlug}:measurement:[\\d]+$`))).length + 1}`
  _data[measurementKey] = {...data, measurementId: measurementKey.split(':')[1]}
  await persist()
}

// Scope calculations to the definitions in Model1
export const model1 = {
  getWebsites: async () => await getWebsites(),
  getWebsite: async websiteSlug => await getWebsite(websiteSlug),
  getMeasurements: async websiteSlug => await getMeasurements(websiteSlug),
  getMeasurement: async measurementId => await getMeasurement(measurementId),
}

const persist = async () => {
  fs.writeFileSync('data.json', JSON.stringify(_data, null, 2))
}