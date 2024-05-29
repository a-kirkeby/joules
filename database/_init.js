
import * as mysql from '../src/mysql.js'
import fs from 'fs'


fs.readdir('./database', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const filenames = data.filter(x => x.startsWith('create_') && x.endsWith('.sql'))
  console.log(filenames)
  fs.readFile('./database/'+filenames[0], (err, data) => {
    console.log('data', data)
    
  })

  process.exit(0)
})


