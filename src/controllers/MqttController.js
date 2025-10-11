const {StationStatus} = require("../models/messages");
const systemStatusManager = require("../models/systemStatusManager");
const {publish} = require("../services/WebSocketService");
const {PublisherTopics} = require("../models/enums");
const config = require("../../config");
const {CartInfo} = require("../models/structs");

handleQRMessage = (msg) =>{
    const data = msgToObject(msg);
    const stationStatus = StationStatus.fromJSON(data);
    console.log(`QR msg obj: ${stationStatus}`);
    systemStatusManager.updateStation(stationStatus);
    if (config.publishMqttMessage) {
        publish(PublisherTopics.MQTT, data);
    }
}

handleIMUMessage = (msg) =>{
    const data = msgToObject(msg);
    const cartInfo = CartInfo.fromJSON(data);
    console.log(`IMU msg: ${msg}`);
    systemStatusManager.updateCart(cartInfo);
    if (config.publishMqttMessage) {
        publish(PublisherTopics.MQTT, data);
    }
}

function msgToObject(msg){
    const json = msg.toString();
    return JSON.parse(json);
}

module.exports = {handleQRMessage, handleIMUMessage}