
const {getBadges} = require("../controllers/DataController");

const express = require('express');
const router = express.Router();

router.get('/getBadges', async (req, res) => {
    try {
        const badges = await getBadges();
        if (badges !== null)
            res.status(200).json(badges);
        else{
            console.error('GET /getBadges :: Error fetching badges');
            res.status(500).json({ message: 'Error fetching badges' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching badges' });
    }
});

module.exports = router;