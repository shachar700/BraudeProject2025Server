
const express = require('express');
const {simulateQRMessage, simulateIMUMessage, resetSystemStatus} = require("../controllers/SimController");
const router = express.Router();

router.post("/qr", (req, res) => {
    const { stationId, oldCartId, newCartId } = req.body;

    simulateQRMessage(Number(stationId), newCartId, oldCartId);
    res.status(200).send({message: "Simulated QR message"});
});

router.post("/imu", (req, res) => {
    const { id, speed } = req.body;

    simulateIMUMessage(id, Number(speed));
    res.status(200).send({message: "Simulated IMU message"});
});

router.get("/reset", (req, res) => {
    resetSystemStatus();
    res.status(200).send({message: "SystemStatus reset successfully"});
});

module.exports = router;