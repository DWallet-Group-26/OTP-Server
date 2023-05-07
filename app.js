const express = require('express');
const app = express();
app.disable('etag').disable('x-powered-by');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Error handler
const errorHandler = require('./handlers/errorHandler');
require('dotenv').config();

const PORT = (process.env.PORT || 3000);

app.listen(PORT, process.env.IP, () => {
    console.log('Server Listening on Port ' + (PORT));
})




// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database
require('./models/index');


// Routes
const walletRoutes = require('./routes/wallet');
const backupStoreRoutes = require('./routes/backupStore');

// Incuding Routes
app.use('/api/dwallet', walletRoutes);
app.use('/api/backupStore', backupStoreRoutes);







app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handling
app.use(errorHandler);
