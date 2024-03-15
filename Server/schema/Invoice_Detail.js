const mongoose = require("mongoose");
const { Schema } = mongoose;

const schema = new Schema({
    invoice_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Invoice_Master",
        required: true,
    },
    data: {
        type: [{
            product_id: {
                type: mongoose.Schema.ObjectId,
                ref: "Product_Master",
                required: true,
            },
            rate: { type: Number, required: true },
            unit: { type: Number, required: true },
            quantity: { type: Number, required: true },
            discount: { type: Number, required: true },
            netAmount: { type: Number, required: true },
            totalAmount: { type: Number, required: true },
        }],
    },
});

exports.Invoice_Detail = mongoose.model("Invoice_Detail", schema);
