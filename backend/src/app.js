const express = require('express')
const { json } = require('body-parser');

const app = express();


app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))

app.use('/', (req, res) => {
    res.status(200).json('Welcome to Watermark Distribution Center')
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('Listening for requests on port', port)
})