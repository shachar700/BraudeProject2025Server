const {StationStatus} = require("../models/messages");
const systemStatusManager = require("../models/systemStatusManager");
const {publish} = require("../services/WebSocketService");
const {PublisherTopics} = require("../models/enums");
const config = require("../../config");

handleQRMessage = (msg) =>{
    const data = msgToObject(msg);
    const stationStatus = StationStatus.fromJSON(data);
    console.log(`QR msg obj: ${stationStatus}`);
    systemStatusManager.update(stationStatus);
    if (config.publishMqttMessage) {
        publish(PublisherTopics.MQTT, data);
    }
}

handleIMUMessage = (msg) =>{
    console.log(`IMU msg: ${msg}`);
}

function msgToObject(msg){
    const json = msg.toString();
    return JSON.parse(json);
}

module.exports = {handleQRMessage, handleIMUMessage}