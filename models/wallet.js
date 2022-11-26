const mongoose = require('mongoose');


var walletSchema = new mongoose.Schema({
    publicKey: {
        type: String,
        required: true,
        unique: true
    },
    privateKey: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    otp: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        required: true,
        unique: true
    }
});


module.exports = mongoose.model('Wallet', walletSchema);