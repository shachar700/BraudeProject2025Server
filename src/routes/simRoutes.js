
const express = require('express');
const {simulateQRMessage, simulateIMUMessage} = require("../controllers/SimController");
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

module.exports = router;