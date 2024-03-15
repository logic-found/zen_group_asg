const mongoose = require('mongoose')
const {Schema} = mongoose


const schema = new Schema({
    name : {type : String, required : true},
    rate : {type : Number, required : true},
    unit : {type : Number, required : true},
})

exports.Product_Master = mongoose.model('Product_Master', schema)