const { Badge} = require('../services/database/Schemas');
const { logMessage } = require("../utils");

const initBadges = async () => {
    const existingCount = await Badge.countDocuments();

    if (existingCount === 0) {
        await Badge.insertMany([
            {
                badge_id: 100,
                title: "Getting Started",
                description: "Played for 5 minutes."
            },
            {
                badge_id: 101,
                title: "Settling In",
                description: "Played for 10 minutes."
            },
            {
                badge_id: 102,
                title: "Curious Mind",
                description: "Read your first guide."
            },
            {
                badge_id: 103,
                title: "Guide Explorer",
                description: "Read 2 guides."
            },
            {
                badge_id: 104,
                title: "Master Reader",
                description: "Read all guides."
            },
            {
                badge_id: 105,
                title: "Quiz Challenger",
                description: "Completed a quiz."
            },
            {
                badge_id: 106,
                title: "Quiz Master",
                description: "Scored 100% on a quiz."
            },
            {
                badge_id: 107,
                title: "Ultimate Collector",
                description: "Unlocked all other badges."
            }
        ]);
        return 'Badges inserted into the database.';
    } else {
        return 'Badges were already in the database.';
    }
}

// TODO - resetAllUserBadges() :: clear the UserBadge table
const resetBadges = async () => {
    try {
        const result = await UserBadge.deleteMany({});
        return `Reset complete. Deleted ${result.deletedCount} user badge records.`;
    } catch (err) {
        console.error("Error resetting user badges:", err);
        return "Failed to reset user badges.";
    }
};
// TODO - resetUserBadges(username) :: clear the UserBadge records for username

module.exports = { initBadges, resetBadges};