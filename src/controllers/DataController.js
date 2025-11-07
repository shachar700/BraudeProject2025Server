
const { Badge} = require('../services/database/Schemas');

const getBadges = async (req, res) => {
    try {
        return await Badge.find().select('-_id -__v').sort({ badge_id: 1 });
    } catch (err) {
        console.error('Error fetching badges:', err);
        return null;
    }
}

module.exports = { getBadges };