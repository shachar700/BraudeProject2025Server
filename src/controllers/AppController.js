const {StationStatus} = require("../models/messages");
const systemStatusManager = require("../models/systemStatusManager");
const config = require("../../config");
const {publish} = require("../services/WebSocketService");
const {PublisherTopics} = require("../models/enums");

simulateQRMessage = (stationId, currCartId, oldCartId) => {
    const stationStatus = new StationStatus(stationId, currCartId, oldCartId);
    console.log(`QR msg obj: ${stationStatus}`);
    systemStatusManager.update(stationStatus);
    if (config.publishMqttMessage) {
        publish(PublisherTopics.MQTT, data);
    }
}

module.exports = {simulateQRMessage}