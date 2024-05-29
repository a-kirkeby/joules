import fs from 'fs'

export const fileSize = (path) => {
  const file = fs.readFileSync('./clients/client3/public/AceVenturaCover.jpeg');
  return file.byteLength
}
