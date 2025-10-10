const {StationStatus} = require("../models/messages");
const systemStatusManager = require("../models/systemStatusManager");
const {publish} = require("../services/WebSocketService");
const {PublisherTopics} = require("../models/enums");

handleQRMessage = (msg) =>{
    const data = msgToObject(msg);
    const stationStatus = StationStatus.fromJSON(data);
    console.log(`QR msg obj: ${stationStatus}`);
    systemStatusManager.update(stationStatus);
    publish(PublisherTopics.MQTT, data);
}

handleIMUMessage = (msg) =>{
    console.log(`IMU msg: ${msg}`);
}

function msgToObject(msg){
    const json = msg.toString();
    return JSON.parse(json);
}

module.exports = {handleQRMessage, handleIMUMessage}