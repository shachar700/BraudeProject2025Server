// src/app.js
const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const favicon = require('serve-favicon');
const path = require('path');

// const {subscriber} = require('./models/SubscribersManager');

// setup for the mqtt connection and topics
require('./services/MqttConnection');


const app = express();

// Middleware
app.use(express.json());
app.use(logger)
app.use(errorHandler);
app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));


// Routes
const simRoutes = require("./routes/simRoutes");
app.use('/sim', simRoutes)

app.use(express.static(path.join(__dirname, './public')));

module.exports = app;
