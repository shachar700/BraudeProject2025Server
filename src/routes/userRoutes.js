
// TODO - GET /getBadges , params: username {string} 

// TODO - POST /addBadge , params: username {string} and badge_id {number}

// TODO - POST /addQuizResult , params: QuizResult, List<AnswerResult>

const express = require('express');
const router = express.Router();
const { getUserBadges, addBadge, addQuizResult , getUserProgress, updateUserProgress} = require('../controllers/UserController');
const {logMessage} = require("../utils"); // adjust path

// GET /api/getUserBadges?username=bob
router.get('/getUserBadges', async (req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ message: 'username is required' });

    try {
        const badges = await getUserBadges(username);
        res.status(200).json(badges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching badges' });
    }
});

// POST /api/addBadge
router.post('/addBadge', async (req, res) => {
    const { username, badge_id } = req.body;
    if (!username || badge_id == null) return res.status(400).json({ message: 'username and badge_id are required' });

    try {
        const success = await addBadge(username, badge_id);
        res.status(success ? 200 : 500).json({ message: success ? 'Badge added successfully' : 'Failed to add badge' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding badge' });
    }
});

// POST /api/addQuizResult
router.post('/addQuizResult', async (req, res) => {
    const body = req.body;
    const quizResult = body["QuizResult"];
    const answerResults = body["AnswerResults"];
    if (!quizResult || !answerResults) return res.status(400).json({ message: 'quizResult and answerResults are required' });

    logMessage(` POST '/addQuizResult' :: Received QuizResult from ${quizResult.username}`)

    try {
        const success = await addQuizResult(quizResult, answerResults);
        res.status(success ? 200 : 500).json({ message: success ? 'Quiz result added successfully' : 'Failed to add quiz result' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding quiz result' });
    }
});

router.get('/getProgress/:username', async (req, res) => {
    try {
        const progress = await getUserProgress(req.params.username);
        return res.status(200).json(progress);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error getting progress' });
    }
})

router.put('/updateProgress', async (req, res) => {
    const {username, playDurationMs, completedQuiz, guideRead} = req.body;
    try {
        const updated = await updateUserProgress(username, playDurationMs, completedQuiz, guideRead);
        return res.status(updated? 200:500).json(`Updated progress: ${updated}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating progress' });
    }
})

module.exports = router;
