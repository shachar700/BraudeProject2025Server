const { Badge} = require('../services/database/Schemas');
const { logMessage } = require("../utils");

const initBadges = async () => {
    const existingCount = await Badge.countDocuments();

    if (existingCount === 0) {
        await Badge.insertMany([
            {
                badge_id: 101,
                title: "Getting Started",
                description: "Play for 5 minutes."
            },
            {
                badge_id: 102,
                title: "Settling In",
                description: "Play for 10 minutes."
            },
            {
                badge_id: 201,
                title: "Curious Mind",
                description: "Read your first guide."
            },
            {
                badge_id: 202,
                title: "Guide Explorer",
                description: "Read 2 guides."
            },
            {
                badge_id: 203,
                title: "Avid Reader",
                description: "Read 3 guides."
            },
            {
                badge_id: 204,
                title: "Master Reader",
                description: "Read all guides."
            },
            {
                badge_id: 301,
                title: "Quiz Challenger",
                description: "Complete a quiz."
            },
            {
                badge_id: 302,
                title: "Quiz Master",
                description: "Score 100% on a quiz."
            },
            {
                badge_id: 401,
                title: "Ultimate Collector",
                description: "Unlocked all other badges."
            }
        ]);
        return 'Badges inserted into the database.';
    } else {
        return 'Badges are already in the database.';
    }
}

// TODO - resetAllUserBadges() :: clear the UserBadge table

// TODO - resetUserBadges(username) :: clear the UserBadge records for username

module.exports = { initBadges};