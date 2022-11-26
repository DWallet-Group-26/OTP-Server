const express = require('express');
const router = express.Router();
const db = require('../models');
const otpHandler = require('../handlers/otpHandler')


// --------- Create Wallet and Verify Phone Number ---------

// Create Wallet
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

// Verify Phone Number
router.post('/verifyphone', async (req, res, next) => {
    db.Wallet.findOne({ phone: req.body.phone })
        .then(async (wallet) => {
            if (wallet.otp == req.body.otp) {
                wallet.otp = null
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

// Send OTP
router.post('/send-otp', (req, res, next) => {
    db.Wallet.find({ publicKey: req.body.publicKey })
        .then(async (wallet) => {
            otp = Math.floor(100000 + Math.random() * 900000)
            wallet.otp = otp
            message = `Your OTP is ${otp}`
            await wallet.save()
            otpHandler(req, wallet.phone, message)
            return res.status(200).send('OTP Sent')
        })
        .catch((err) => {
            next(err)
        })
})

// Verify OTP
router.post('/verify-otp', async (req, res, next) => {
    db.Wallet.find({ publicKey: req.body.publicKey })
        .then(async (wallet) => {
            if (wallet.otp == req.body.otp) {
                wallet.otp = null
                await wallet.save()

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







