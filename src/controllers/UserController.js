
/**
 * first insert the quizResult to the db, and get it's new id
 * afterward set the quizResult_id to that id in each of the answerResult in the given array
 * after you've set the quizResult_id insert the AnswerResult array to the db
 */

const { Badge, UserBadge, QuizResult, AnswerResult, UserProgress, GuideRead } = require('../services/database/Schemas');
const mongoose = require('mongoose');

/**
 * Get all badges unlocked by a specific user.
 * @param {string} username
 * @returns {Promise<UserBadge[]>}
 */
async function getUserBadges(username) {
    try {
        return await UserBadge.find({username}).select('-_id -__v');
    } catch (err) {
        console.error('Error fetching user badges:', err);
        return [];
    }
}

const getUserProgress = async (username) => {
    try{
        const progressDoc = await UserProgress.findOneAndUpdate(
            { username },
            { $setOnInsert: { username } },
            {
                new: true,
                upsert: true,
                projection: { _id: 0, __v: 0 },
                lean: true
            }
        );

        const guidesReadRecords = await GuideRead.find({username: username}, {guideId: 1, _id: 0}).lean();
        const guidesRead = guidesReadRecords.map(record => record.guideId);

        return {
            ...progressDoc,
            guidesRead
        };
    } catch (err){
        console.error('Error fetching user progress:', err);
        return null;
    }
}

/**
 * Add an existing badge to a user.
 * @param {string} username
 * @param {number} badge_id
 * @returns {Promise<boolean>} Returns true if added, false if user already has it or badge does not exist.
 */
async function addBadge(username, badge_id) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Make sure the badge exists
        const existingBadge = await Badge.findOne({ badge_id }).session(session);
        if (!existingBadge) {
            await session.abortTransaction();
            await session.endSession();
            console.error(`Badge with ID ${badge_id} does not exist`);
            return false;
        }

        // Check if user already has this badge
        const userHasBadge = await UserBadge.findOne({ username, badge_id }).session(session);
        if (userHasBadge) {
            await session.commitTransaction();
            await session.endSession();
            return false;
        }

        // Add the badge to the user
        const userBadge = new UserBadge({ username, badge_id });
        await userBadge.save({ session });

        await session.commitTransaction();
        await session.endSession();
        return true;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        console.error('Error adding badge to user:', err);
        return false;
    }
}

/**
 * Add a quiz result and its associated answer results.
 * @param {QuizResult} quizResult
 * @param {AnswerResult[]} answerResults
 * @returns {Promise<boolean>}
 */
async function addQuizResult(quizResult, answerResults) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // 1️⃣ Generate new numeric quizResult_id
        const lastQuiz = await QuizResult.findOne().sort({ quizResult_id: -1 }).exec();
        const newQuizId = lastQuiz ? lastQuiz.quizResult_id + 1 : 1;

        // 2️⃣ Create QuizResult document with numeric ID
        const newQuizResultDocument = new QuizResult({
            quizResult_id: newQuizId,
            username: quizResult.username,
            totalDurationSec: quizResult.totalDurationSec,
            timestamp: quizResult.timestamp || new Date()
        });

        const savedQuizResult = await newQuizResultDocument.save({ session });

        // 3️⃣ Create AnswerResult documents using numeric quizResult_id
        const answerResultDocuments = answerResults.map(ar => new AnswerResult({
            question_id: ar.question_id,
            quizResult_id: savedQuizResult.quizResult_id, // <-- use numeric ID
            selectedAnswer: ar.selectedAnswer,
            correctAnswer: ar.correctAnswer,
            durationSec: ar.durationSec
        }));

        await AnswerResult.insertMany(answerResultDocuments, { session });

        await session.commitTransaction();
        await session.endSession();
        return true;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        console.error('Error adding quiz result and answers:', err);
        return false;
    }
}

const updateUserProgress = async (username, playDurationMin, completedQuiz, guidesRead) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        await UserProgress.findOneAndUpdate(
            { username },
            {
                $set: {
                    playDurationMin: playDurationMin,
                    completedQuiz: completedQuiz
                }
            }, {session}
        );

        for (const ind in guidesRead) {
            await GuideRead.findOneAndUpdate(
                { GR_id: `${username}_${guidesRead[ind]}` },
                { $setOnInsert: { GR_id: `${username}_${guidesRead[ind]}`, username, guideId: guidesRead[ind] } },
                { upsert: true, session }
            )
        }

        await session.commitTransaction();
        await session.endSession();
        return true;
    } catch (err) {
        await session.abortTransaction();
        await session.endSession();
        console.error('Error updating progress:', err);
        return false;
    }
}

// GET /getUserQuizzes :: params: username
/**
 * Get all quiz results (with answers) for a specific user.
 * @param {string} username
 * @returns {Promise<Object[]>} Array of quiz results with their answers
 */
async function getUserQuizzes(username) {
    try {
        const quizzes = await QuizResult.find({ username })
            .select('-_id -__v')
            .lean();

        if (!quizzes.length) return [];

        const quizIds = quizzes.map(q => q.quizResult_id);

        const answers = await AnswerResult.find({ quizResult_id: { $in: quizIds } })
            .select('-_id -__v')
            .lean();

        // Group answers by quizResult_id
        const answerMap = answers.reduce((acc, answer) => {
            const id = answer.quizResult_id;
            if (!acc[id]) acc[id] = [];
            acc[id].push(answer);
            return acc;
        }, {});

        // Attach answers to their corresponding quiz
        return quizzes.map(q => ({
            ...q,
            answers: answerMap[q.quizResult_id] || []
        }));
    } catch (err) {
        console.error('Error fetching user quizzes:', err);
        return [];
    }
}

module.exports = { getUserBadges, addBadge, addQuizResult, getUserQuizzes, getUserProgress, updateUserProgress };