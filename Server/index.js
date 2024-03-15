const express = require('express')
const app = express()
const cors = require('cors');
const connectDB = require('./connectDB')
 const Product_Master = require('./routes/Product')
const Invoice = require('./routes/Invoice')
require('dotenv').config()
const PORT = process.env.PORT || 8000


app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send("server running...")
})
app.use('/product', Product_Master)
app.use('/invoice', Invoice)


app.listen(PORT, () => {
    console.log("server started")
    connectDB()
})
