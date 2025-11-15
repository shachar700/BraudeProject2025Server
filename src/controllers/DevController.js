const { Badge, UserBadge} = require('../services/database/Schemas');
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
            }
        ]);
        return 'Badges inserted into the database.';
    } else {
        return 'Badges are already in the database.';
    }
}

// resetAllUserBadges() :: clear the UserBadge table
const resetAllUserBadges = async () => {
    try {
        const result = await UserBadge.deleteMany({});
        return `Reset complete. Deleted ${result.deletedCount} user badge records.`;
    } catch (err) {
        console.error("Error resetting user badges:", err);
        return "Failed to reset user badges.";
    }
};
// resetUserBadges(username) :: clear the UserBadge records for username
const resetUserBadges = async (username) => {
    try {
        const result = await UserBadge.deleteMany({ username });
        return `Reset complete. Deleted ${result.deletedCount} badge records for user "${username}".`;
    } catch (err) {
        console.error(`Error resetting badges for user ${username}:`, err);
        return `Failed to reset badges for user "${username}".`;
    }
};


module.exports = { initBadges, resetAllUserBadges, resetUserBadges};