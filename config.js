require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5000,
    mongo: {
        url: process.env.MONGODB_URL
    },
    mqtt:{
        uri: process.env.MQTT_BROKER_URI,
        port: process.env.MQTT_BROKER_PORT
    }
}