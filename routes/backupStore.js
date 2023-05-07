const express = require('express');
const router = express.Router();
const db = require('../models');
const otpHandler = require('../handlers/otpHandler')
const ethers = require('ethers');
const crypto = require('crypto-js');

const FACTORY_ABI = require('../ABI/MultiSigWalletFactory.json').abi;
const WALLET_ABI = require('../ABI/MultiSigWallet.json').abi;
const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
const server_wallet = new ethers.Wallet(process.env.SYSTEM_KEY, provider)

/*

/backup_store
{key: , phone: , password}

/load_key
{phone: , password}

*/

router.post('/backup_store', async (req, res, next) => {
    const { key, phone, password } = req.body;

    db.BackupKey.create({
        encryptedKey: crypto.AES.encrypt(key,password).toString(),
        passwordHash: crypto.SHA256(password).toString(),
        phone: phone
    }).then((backupKey) => {
        res.status(200).send('Key Stored');
    }
    ).catch((err) => {
        next(err);
    }
    )
})

router.post('/load_key', async (req, res, next) => {
    const { phone, password } = req.body;
    db.BackupKey.findOne({ phone: phone }).then((backupKey) => {
        if (crypto.SHA256(password).toString()==backupKey.passwordHash) {
            res.status(200).send(crypto.AES.decrypt(backupKey.encryptedKey,password).toString(crypto.enc.Utf8));
        } else {
            res.status(400).send('Invalid Password');
        }
    }
    ).catch((err) => {
        next(err);
    }
    )
})

module.exports = router;



