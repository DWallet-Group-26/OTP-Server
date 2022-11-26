const express = require('express');
const app = express();
app.disable('etag').disable('x-powered-by');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');



app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log('Server Listening on Port 3000')
})


// Error handler
const errorHandler = require('./handlers/errorHandler');
require('dotenv').config();


// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Database
require('./models/index');


// Routes
const walletRoutes = require('./routes/wallet');


// Incuding Routes
app.use('/api/dwallet', walletRoutes);







app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handling
app.use(errorHandler);
