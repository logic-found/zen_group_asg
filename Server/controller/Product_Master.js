const {Product_Master} = require('../schema/Product_Master')
const catchAsyncError = require('../utils/catchAsyncError')


exports.createProduct = catchAsyncError(async (req, res, next) => {
    const {name, rate, unit} = req.body
    const newProduct = new Product_Master({
        name, rate, unit
    })
    const response = await newProduct.save()
    res.status(200).json({response})
})


exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const response = await Product_Master.find()
    res.status(200).json({response})
})