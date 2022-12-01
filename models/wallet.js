const mongoose = require('mongoose');


var walletSchema = new mongoose.Schema({
    publicKey: {
        type: String,
        required: true,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    },

    phone: {
        type: String,
        required: true
    },
    isverified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Wallet', walletSchema);