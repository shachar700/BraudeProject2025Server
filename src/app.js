// src/app.js
const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// const {subscriber} = require('./models/SubscribersManager');

// setup for the mqtt connection and topics
const mqtt = require('./services/MqttConnection');

const {publish} = require("./services/SubscriptionService");

const app = express();

// Middleware
app.use(logger)
app.use(errorHandler);

// Routes
app.get('/', (req, res) => {
    res.send(`Hello world!`);
});

app.get('/about', (req, res) => {
    res.send(`Hello There!`);
    publish('Hello There subs!');
    let cntr = 0;
    setInterval(()=>{
        publish(`Counter = ${cntr++}`)
    }, 500);
});

app.get('/about1', (req, res) => {
    res.send(`Hello There!111111111111`);
    publish('Hello There subs!11111111111111');
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

module.exports = app;
