const mongoose = require('mongoose')

// connect to DB
const connection = async () => {
    const connect = mongoose.connect(process.env.MONGODB_URI, {
        dbName: 'zen_group',
        
    })
    console.log("connected to db")
}

module.exports = connection