// src/app.js
const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const path = require('path');

// const {subscriber} = require('./models/SubscribersManager');

// setup for the mqtt connection and topics
const mqtt = require('./services/MqttConnection');

const {publish} = require("./services/WebSocketService");

const app = express();

// Middleware
app.use(logger)
app.use(errorHandler);

// Routes
app.get('/about', (req, res) => {
    res.send(`Hello There!`);
});

app.get('/about1', (req, res) => {
    res.send(`Hello There!111111111111`);
});

app.get('/subscribe', (req, res) => {
    const ip = req.ip;
    // subscriber.subscribe(ip);
    res.json({message: `User ${ip} subscribed`});
});

app.get('/unsubscribe', (req, res) => {
    const ip = req.ip;
    // subscriber.unsubscribe(ip);
    res.json({message: `User ${ip} unsubscribed`});
});
app.use(express.static(path.join(__dirname, './public')));

module.exports = app;
