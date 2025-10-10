// src/app.js
const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');

// const {subscriber} = require('./models/SubscribersManager');

// setup for the mqtt connection and topics
require('./services/MqttConnection');


const app = express();

// Middleware
app.use(express.json());
app.use(logger)
app.use(errorHandler);

// Routes
const simRoutes = require("./routes/simRoutes");
app.use('/sim', simRoutes)

app.use(express.static(path.join(__dirname, './public')));

module.exports = app;
