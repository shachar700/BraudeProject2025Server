const { initBadges, resetBadges } = require('../controllers/DevController');

const express = require('express');
const router = express.Router();

// TODO - POST /initBadges
router.post('/initBadges', async (req, res) => {
    const msg = await initBadges();
    res.status(200).send(msg);
})

// TODO - POST /resetBadges
router.post('/resetBadges', async (req, res) => {
    const msg = await resetBadges();
    res.status(200).send(msg);
})

module.exports = router;