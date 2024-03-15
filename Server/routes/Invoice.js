const router = require('express').Router()
const { createInvoice } = require('../controller/Invoice')


router
.post('/new', createInvoice)


module.exports = router
