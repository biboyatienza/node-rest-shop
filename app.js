const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(process.env.MONGO_ATLAS_CREDENTIAL.replace('<password>', process.env.MONGO_ATLAS_PW), {useNewUrlParser: true, useUnifiedTopology: true});

app.use(morgan('dev')); // HTTP request logger
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// CORS: manual seting:
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     if(req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();
// });
// End of CORS: manual seting:

// CORS thru cors npm:
app.use(cors());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Error Traping:
app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

module.exports = app;