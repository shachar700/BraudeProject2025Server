
const express = require('express');
const router = express.Router();
const { getUserBadges, addBadge, addQuizResult , getUserProgress, updateUserProgress} = require('../controllers/UserController');
const {logMessage} = require("../utils"); // adjust path

// GET /getBadges , params: username {string}
// GET /api/getUserBadges/bob
router.get('/getUserBadges/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: 'username is required' });
    }

    try {
        const badges = await getUserBadges(username);
        res.status(200).json(badges);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching badges' });
    }
});

// POST /addBadge , params: username {string} and badge_id {number}
router.post('/addBadge', async (req, res) => {
    const { username, badge_id } = req.body;
    if (!username || !badge_id) return res.status(400).json({ message: 'username and badge_id are required' });

    try {
        const success = await addBadge(username, badge_id);
        res.status(success ? 200 : 500).json({ message: success ? 'Badge added successfully' : 'Failed to add badge' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding badge' });
    }
});

// POST /addQuizResult , params: QuizResult, List<AnswerResult>
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

// GET /getUserQuizzes/bob
router.get('/getUserQuizzes/:username', async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const quizzes = await getUserQuizzes(username);
        res.status(200).json(quizzes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching quiz results' });
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
    const {username, playDurationMin, completedQuiz, guidesRead} = req.body;
    // console.log(req.body)
    try {
        const updated = await updateUserProgress(username, playDurationMin, completedQuiz, guidesRead);
        return res.status(updated? 200:500).json(`Updated progress: ${updated}`);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating progress' });
    }
})

module.exports = router;
