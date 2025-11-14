
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

const validGroupNums = [1,2,3];
router.get('/getQuiz/:groupNum', (req, res) => {
   const groupNum = req.params['groupNum'];
   if (!validGroupNums.includes(parseInt(groupNum, 10))){
       return res.status(404).json({ message: 'Invalid group number' });
   }
   res.sendFile(path.join(__dirname, `../assets/files/QuizGroup${groupNum}.json`), (err)=>{
       if (err){
           return res.status(404).json({ message: `Quiz not found for group ${groupNum}` });
       }
   });
});

module.exports = router;