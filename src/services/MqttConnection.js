// TODO singleton
const config = require('../../config');
const mqtt = require('mqtt');
const {MqttTopics} = require("../models/enums");
const {handleQRMessage, handleIMUMessage} = require("../controllers/MqttController");

const brokerUrl = `https://${config.mqtt.uri}`;

const mqttClient = mqtt.connect(brokerUrl);
mqttClient.on('connect', () => {
    console.log(`📡 Connected to MQTT broker at ${brokerUrl}`);
});

mqttClient.on('error', (err) => {
    console.error(`❌ MQTT (url: ${brokerUrl}) connection error:`, err);
});

const topics = [MqttTopics.QR, MqttTopics.IMU];

mqttClient.subscribe(topics, (err) => {
    if (err) {
        console.error('❌ MQTT subscription error:', err);
    } else {
        console.log(`✅ Subscribed to topics:\n- ${topics.join('\n- ')}`);
    }
});

mqttClient.on('message', (topic, messageBuffer) => {
    const message = messageBuffer.toString();

    switch (topic) {
        case MqttTopics.QR:
            handleQRMessage(message);
            break;

        case MqttTopics.IMU:
            handleIMUMessage(message);
            break;

        default:
            console.warn(`⚠️ Received message from unknown topic: ${topic}`);
    }
});

module.exports = mqttClient;