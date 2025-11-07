require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongo: {
        uri: process.env.MONGODB_URI
    },
    mqtt:{
        uri: process.env.MQTT_BROKER_URI,
        port: process.env.MQTT_BROKER_PORT
    },
    SystemStatusPublishIntervalsMs: process.env.SYSTEM_STATUS_PUBLISH_INTERVALS_MS,
    MaxSystemStatusPublishIntervalsMs: process.env.MAX_SYSTEM_STATUS_PUBLISH_INTERVALS_MS,
    publishMqttMessage: (process.env.PUBLISH_MQTT_MESSAGESS === 'true'),
    publishLogMessage: (process.env.PUBLISH_LOG_MESSAGESS === 'true'),
    logMqttMessage: (process.env.LOG_MQTT_MESSAGESS === 'true')
}