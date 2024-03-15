const router = require('express').Router()
const { getAllProducts, createProduct} = require('../controller/Product_Master')


router
.get('/all', getAllProducts)
.post('/new', createProduct)


module.exports = router
