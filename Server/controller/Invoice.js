const { Invoice_Detail } = require("../schema/Invoice_Detail");
const { Invoice_Master } = require("../schema/Invoice_Master");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createInvoice = catchAsyncError(async (req, res, next) => {
    const  { data } = req.body;
    if (!data) res.status(400).json({ message: "please provie the data" });
    else {
        let totalAmount = data.reduce((acc, d) => d.totalAmount + acc, 0);
        let customer_name = data[0].customer_name;

        const newInvoiceMaster = new Invoice_Master({
            customer_name,
            totalAmount,
        });
        const invoiceMaster = await newInvoiceMaster.save();
        const invoiceDetailsData = data.map((p) => {
            return {
                product_id : p.selectedProduct?._id,
                rate : p.selectedProduct?.rate,
                unit : p.selectedProduct?.unit,
                quantity : Number(p.quantity),
                discount : Number(p.discount),
                netAmount : Number(p.netAmount),
                totalAmount : Number(p.totalAmount)
            }
        })
        const newInvoiceDetails = new Invoice_Detail({
            invoice_id: invoiceMaster._id,
            data : invoiceDetailsData
            
        });
        const invoiceDetails = await newInvoiceDetails.save();
        res.status(200).json({ message: "Invoice Created Successfully" });
    }
});
