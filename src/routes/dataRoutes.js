
const {getBadges} = require("../controllers/DataController");

const express = require('express');
const path = require('path');
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

const validGroupNumbers = [1,2,3];
router.get('/getQuiz/:groupNumber', (req, res) => {
   const groupNumber = req.params['groupNumber'];
   if (!validGroupNumbers.includes(parseInt(groupNumber, 10))){
       return res.status(404).json({ message: 'Invalid group number' });
   }
   res.sendFile(path.join(__dirname, `../assets/files/QuizGroup${groupNumber}.json`), (err)=>{
       if (err){
           return res.status(404).json({ message: `Quiz not found for group ${groupNumber}` });
       }
   });
});

module.exports = router;