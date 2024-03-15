const mongoose = require('mongoose')
const {Schema} = mongoose
const AutoIncrement = require('mongoose-sequence');
const autoIncrement = AutoIncrement(mongoose.connection);

const schema = new Schema({
    invoice_date : {type : Date, default : Date.now()},
    customer_name : {type : String, required : true},
    totalAmount : {type : Number, required : true}
})

schema.plugin(autoIncrement, { inc_field: 'invoice_no', startAt: 1, incrementBy: 1 });
const Invoice_Master = mongoose.model('Invoice_Master', schema);

exports.Invoice_Master = Invoice_Master;