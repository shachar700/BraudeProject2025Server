const {SystemStatus} = require("./messages");
const {StationIDs, CartIDs, PublisherTopics} = require("./enums");
const {publish} = require("../services/WebSocketService");
const config = require("../../config");

const systemStatusManager = new SystemStatus();

// init stations
systemStatusManager.stationOccupants.set(StationIDs.STATION_1, {oldCart:CartIDs.cart_empty, newCart:CartIDs.cart_empty});
systemStatusManager.stationOccupants.set(StationIDs.STATION_2, {oldCart:CartIDs.cart_empty, newCart:CartIDs.cart_empty});
systemStatusManager.stationOccupants.set(StationIDs.STATION_3, {oldCart:CartIDs.cart_empty, newCart:CartIDs.cart_empty});
systemStatusManager.stationOccupants.set(StationIDs.STATION_4, {oldCart:CartIDs.cart_empty, newCart:CartIDs.cart_empty});

setInterval(()=>{
    systemStatusManager.refreshTimestamp();
    publish(PublisherTopics.SYSTEM_STATUS, systemStatusManager.toJSON());
    // console.log("Published SystemStatus update");
}, config.SystemStatusPublishIntervalsMs);

module.exports = systemStatusManager;