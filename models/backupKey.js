const mongoose = require('mongoose');


var backupKeySchema = new mongoose.Schema({
    encryptedKey: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('backupKey', backupKeySchema);