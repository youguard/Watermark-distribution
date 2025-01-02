const express = require('express')
const { json } = require('body-parser');
const authRoutes = require('./routes/authRoutes')
const bodyParser = require('body-parser')
const connectDB = require('../src/config/db')
const app = express();
const { swaggerUi, swaggerDocs } = require('./config/swagger');

connectDB()

app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true}))

//routes
app.use('/api', authRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', (req, res) => {
    res.status(200).json('Welcome to Watermark Distribution Center')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Listening for requests on port', port)
})