
// TODO - GET /getBadges , params: username {string} 

// TODO - POST /addBadge , params: username {string} and badge_id {number}

// TODO - POST /addQuizResult , params: QuizResult, List<AnswerResult>

const express = require('express');
const router = express.Router();
const { getBadges, addBadge, addQuizResult } = require('../controllers/UserController'); // adjust path

// GET /api/getBadges?username=john_doe
router.get('/getBadges', async (req, res) => {
    const username = req.query.username;
    if (!username) return res.status(400).json({ message: 'username is required' });

    try {
        const badges = await getBadges(username);
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
    const { quizResult, answerResults } = req.body;
    if (!quizResult || !answerResults) return res.status(400).json({ message: 'quizResult and answerResults are required' });

    try {
        const success = await addQuizResult(quizResult, answerResults);
        res.status(success ? 200 : 500).json({ message: success ? 'Quiz result added successfully' : 'Failed to add quiz result' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding quiz result' });
    }
});

module.exports = router;
