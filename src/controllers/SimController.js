const {StationStatus} = require("../models/messages");
const systemStatusManager = require("../models/systemStatusManager");
const config = require("../../config");
const {publish} = require("../services/WebSocketService");
const {PublisherTopics, CartIDs, StationIDs} = require("../models/enums");
const {CartInfo} = require("../models/structs");
const {clearTimeout} = require("node:timers");

let regressionTestInProgress = null;

simulateQRMessage = (stationId, currCartId, oldCartId) => {
    const stationStatus = new StationStatus(stationId, currCartId, oldCartId);
    console.log(`simulateQRMessage: ${stationStatus}`);
    systemStatusManager.updateStation(stationStatus);
    if (config.publishMqttMessage) {
        publish(PublisherTopics.MQTT, {type: "StationStatus", message: stationStatus});
    }
}

simulateIMUMessage = (cart_id, speed) => {
    const cartInfo = new CartInfo(cart_id, speed);
    console.log(`simulateIMUMessage: ${cartInfo}`);
    systemStatusManager.updateCart(cartInfo);
    if (config.publishMqttMessage) {
        publish(PublisherTopics.MQTT, {type: "CartInfo", message: cartInfo});
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

resetSystemStatus = (currentTimeout = null) => {
    if (currentTimeout || regressionTestInProgress) {
        clearTimeout(regressionTestInProgress);
        regressionTestInProgress = null;
        console.log("Regression test stopped");
    }
    systemStatusManager.reset();
    console.log("SystemStatus reset successfully");
    publish(PublisherTopics.SYSTEM_RESET, {message: "SystemStatus reset successfully", timestamp: new Date()});
}

regressionTest = () => {
    const currentTimeout = setTimeout(async ()=>{
        console.log("Regression test started");

        resetSystemStatus(currentTimeout);
        await sleep(1000);
        if (regressionTestInProgress === null) return;

        const cartSpeedMPS = 0.2;
        const timeBetweenSt1St2Ms = 8 * 1000;
        const timeBetweenActionsMs = 600;

        const cart1 = 'Cart RT1';
        const cart2 = 'Cart RT2';

        simulateIMUMessage(cart1, cartSpeedMPS)
        simulateIMUMessage(cart2, cartSpeedMPS)
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;

        simulateQRMessage(StationIDs.STATION_1, cart1, CartIDs.cart_empty);
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;
        simulateQRMessage(StationIDs.STATION_1, CartIDs.cart_empty, cart1);
        await sleep(timeBetweenSt1St2Ms);
        if (regressionTestInProgress === null) return;

        simulateQRMessage(StationIDs.STATION_2, cart1, CartIDs.cart_empty);
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;

        simulateQRMessage(StationIDs.STATION_1, cart2, CartIDs.cart_empty);
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;
        simulateQRMessage(StationIDs.STATION_1, CartIDs.cart_empty, cart2);
        await sleep(timeBetweenSt1St2Ms);
        if (regressionTestInProgress === null) return;

        simulateQRMessage(StationIDs.STATION_2, cart2, cart1);
        await sleep(timeBetweenActionsMs);
        if (regressionTestInProgress === null) return;

        console.log("Regression test ended")

    }, 0);
}

module.exports = {simulateQRMessage, simulateIMUMessage, resetSystemStatus, regressionTest}