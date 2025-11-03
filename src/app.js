// src/app.js
const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const favicon = require('serve-favicon');
const cors = require('cors');
const path = require('path');

// const {subscriber} = require('./models/SubscribersManager');

// setup for the mqtt connection and topics
require('./services/MqttConnection');

const DB_Service = require('./services/database/MongoConnection');

DB_Service.getInstance().connect()
  .then(() => console.log('✅ DB connected (from app.js)'))
  .catch(err => console.error('❌ DB connection failed (from app.js):', err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger)
app.use(errorHandler);
app.use(favicon(path.join(__dirname, './public', 'favicon.ico')));


// Routes
const simRoutes = require("./routes/simRoutes");
app.use('/sim', simRoutes)

const userRoutes = require("./routes/userRoutes");
app.use('/user', userRoutes);


app.use(express.static(path.join(__dirname, './public')));

module.exports = app;
