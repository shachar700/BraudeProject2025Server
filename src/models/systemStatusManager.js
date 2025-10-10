const {SystemStatus} = require("./messages");
const {StationIDs, CartIDs, PublisherTopics} = require("./enums");
const {publish} = require("../services/WebSocketService");
const config = require("../../config");

const systemStatusManager = new SystemStatus();

// init stations
systemStatusManager.stationOccupants.set(StationIDs.STATION_1, CartIDs.cart_empty);
systemStatusManager.stationOccupants.set(StationIDs.STATION_2, CartIDs.cart_empty);
systemStatusManager.stationOccupants.set(StationIDs.STATION_3, CartIDs.cart_empty);
systemStatusManager.stationOccupants.set(StationIDs.STATION_4, CartIDs.cart_empty);

setInterval(()=>{
    systemStatusManager.refreshTimestamp();
    publish(PublisherTopics.SYSTEM_STATUS, systemStatusManager);
    // console.log("Published SystemStatus update");
}, config.SystemStatusPublishIntervalsMs);

module.exports = systemStatusManager;