
import express from 'express'

const app = express()
const port = process.env.PORT || 4003

app.use(express.json())
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})
