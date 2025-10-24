
const express = require('express');
const {simulateQRMessage, simulateIMUMessage, resetSystemStatus, regressionTest} = require("../controllers/SimController");
const path = require("path");
const router = express.Router();

router.post("/qr", (req, res) => {
    const { station_id, current_cart_id, old_cart_id } = req.body;

    simulateQRMessage(Number(station_id), current_cart_id, old_cart_id);
    res.status(200).send({message: "Simulated QR message"});
});

router.post("/imu", (req, res) => {
    const { cart_id, speed } = req.body;

    simulateIMUMessage(cart_id, Number(speed));
    res.status(200).send({message: "Simulated IMU message"});
});

router.get("/reset", (req, res) => {
    resetSystemStatus();
    res.status(200).send({message: "SystemStatus reset successfully"});
});

router.get("/regressionTest", (req, res) => {
    regressionTest();
    res.status(200).send({message: "Regression test started"});
});

router.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '..', './public', 'simPage.html'));
})

module.exports = router;