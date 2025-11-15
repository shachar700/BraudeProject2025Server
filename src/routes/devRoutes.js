const { initBadges, resetAllUserBadges, resetUserBadges } = require('../controllers/DevController');

const express = require('express');
const router = express.Router();

// POST /initBadges
router.post('/initBadges', async (req, res) => {
    const msg = await initBadges();
    res.status(200).send(msg);
})

// POST /resetAllUserBadges
router.post('/resetAllUserBadges', async (req, res) => {
    const msg = await resetAllUserBadges();
    res.status(200).send(msg);
})

// POST /resetUserBadges/bob
router.post('/resetUserBadges/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).send("Username is required.");
    }

    const msg = await resetUserBadges(username);
    res.status(200).send(msg);
});

module.exports = router;