
const express = require('express');
const {simulateQRMessage} = require("../controllers/AppController");
const router = express.Router();

router.post("/qr", (req, res) => {
    const { stationId, oldCartId, newCartId } = req.body;

    simulateQRMessage(Number(stationId), newCartId, oldCartId);
    res.status(200).send({message: "Simulated QR message"});
});

module.exports = router;