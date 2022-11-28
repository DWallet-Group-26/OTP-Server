const express = require('express');
const router = express.Router();
const db = require('../models');
const otpHandler = require('../handlers/otpHandler')
const ethers = require('ethers');

const FACTORY_ABI = require('../ABI/MultiSigWalletFactory.json').abi;
const WALLET_ABI = require('../ABI/MultiSigWallet.json').abi;
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const server_wallet = new ethers.Wallet(process.env.SYSTEM_KEY, provider)

//  --------- Send Server Address ---------
router.get('/serveraddress', (req, res, next) => {
    res.send({"address": process.env.SYSTEM_ADDRESS});
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
    db.Wallet.findOne({ publicKey: req.body.publicKey })
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
            transaction = await db.Transaction.create({ publicKey: req.body.publicKey, transactionID: req.body.transactionID, otp })
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
                const factory = new ethers.Contract(process.env.MULTISIG_FACTORY_ADDRESS, FACTORY_ABI, server_wallet);
                
                const multisig_wallet_addr = await factory.mainMapping(publicKey);
                const multisig_wallet = new ethers.Contract(multisig_wallet_addr, WALLET_ABI, server_wallet);
    
                await multisig_wallet.confirmTransaction(transactionID)

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







