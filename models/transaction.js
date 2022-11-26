const mongoose = require('mongoose');


var transactionSchema = new mongoose.Schema({
    publicKey: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
        required: true,
    },
    transactionID: {
        type: String,
        default: null,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('transaction', transactionSchema);