
import express from 'express'

const app = express()
const port = process.env.PORT || 4001

app.use(express.json())
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})