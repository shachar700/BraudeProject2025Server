const {StationStatus} = require("../models/messages");
const systemStatusManager = require("../models/systemStatusManager");
const config = require("../../config");
const {publish} = require("../services/WebSocketService");
const {PublisherTopics} = require("../models/enums");
const {CartInfo} = require("../models/structs");

simulateQRMessage = (stationId, currCartId, oldCartId) => {
    const stationStatus = new StationStatus(stationId, currCartId, oldCartId);
    console.log(`simulateQRMessage: ${stationStatus}`);
    systemStatusManager.updateStation(stationStatus);
    if (config.publishMqttMessage) {
        publish(PublisherTopics.MQTT, {type: "StationStatus", message: stationStatus});
    }
}

simulateIMUMessage = (id, speed) => {
    const cartInfo = new CartInfo(id, speed);
    console.log(`simulateIMUMessage: ${cartInfo}`);
    systemStatusManager.updateCart(cartInfo);
    if (config.publishMqttMessage) {
        publish(PublisherTopics.MQTT, {type: "CartInfo", message: cartInfo});
    }
}

resetSystemStatus = () => {
    systemStatusManager.reset();
    console.log("SystemStatus reset successfully");
}

module.exports = {simulateQRMessage, simulateIMUMessage, resetSystemStatus}