const express = require('express');
const router = express.Router();
const db = require('../models');
const otpHandler = require('../handlers/otpHandler')
const ethers = require('ethers');



//  --------- Send Server Address ---------
router.get('/serveraddress', (req, res, next) => {
    res.send(process.env.SERVER_ADDRESS);
})
// --------- Create Wallet and Verify Phone Number ---------

// Create Wallet ({phoneNumber, publicKey})
router.post('/createwallet', async (req, res, next) => {
    console.log(req.body);
    db.Wallet.create(req.body)
        .then(async (wallet) => {
            otp = Math.floor(100000 + Math.random() * 900000)
            wallet.otp = otp
            await wallet.save()
            message = `Your OTP is ${otp}`
            otpHandler(wallet.phone, message)
                .then((response) => {
                    console.log(response);
                    res.status(200).send('OTP sent to your phone number');
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send(err);
                })

        })
        .catch((err) => {
            next(err);
        });
})

// Verify Phone Number ({publicKey, otp})
router.post('/verifyphone', async (req, res, next) => {
    db.Wallet.findOne({ phone: req.body.phone })
        .then(async (wallet) => {
            if (wallet.otp == req.body.otp) {
                wallet.otp = null
                wallet.isverified = true
                await wallet.save()
                res.status(200).send('Phone Number Verified');
            } else {
                res.status(400).send('Invalid OTP');
            }
        })
        .catch((err) => {
            next(err);
        });
})





// --------- OTP Verification for Transaction ---------

// Send OTP ({publicKey, transactionID})
router.post('/send-otp', (req, res, next) => {
    db.Wallet.find({ publicKey: req.body.publicKey })
        .then(async (wallet) => {
            otp = Math.floor(100000 + Math.random() * 900000)
            wallet.otp = otp
            message = `Your OTP is ${otp}`
            transaction = await db.Transaction.create({ publicKey: req.body.publicKey, transactionID: req.body.transactionID, opt })
            await wallet.save()
            otpHandler(req, wallet.phone, message)
            return res.status(200).send(transaction);
        })
        .catch((err) => {
            next(err)
        })
})

// Verify OTP ({transactionID, otp})
router.post('/verify-otp', async (req, res, next) => {
    db.Transaction.findOne({ transactionID: req.body.transactionID })
        .then(async (transaction) => {
            if (transaction.otp == req.body.otp) {
                transaction.otp = null
                transaction.isCompleted = true
                await transaction.save()

                // Eth.js
                var publicKey = transaction.publicKey
                var transactionID = transaction.transactionID


                res.status(200).send('Verification Successful')
            } else {
                res.status(400).send('OTP is Incorrect')
            }
        })
        .catch((err) => {
            next(err)
        })
})

module.exports = router;







