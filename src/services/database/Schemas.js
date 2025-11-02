
// TODO - Badge schema based on struct Badge, PK: badge_id
 
// TODO - UserBadge schema based on struct UserBadge, PKs: username + badge_id

// TODO - check if there is a need for User table, beside just for the username

// TODO - QuizResult based on the struct, PK: quizResult_id

// TODO - AnswerResult based on the struct, PKs: answerResult_id + quizResult_id

const mongoose = require('mongoose');

const { Schema, model } = mongoose;

// AnswerResult schema
const AnswerResultSchema = new Schema({
  question_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  quizResult_id: {
    type: Schema.Types.ObjectId,
    ref: "QuizResult",
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  durationSec: {
    type: Number,
    required: true,
  },
});

// QuizResult schema
const QuizResultSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  totalDurationSec: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Models
const QuizResult = model("QuizResult", QuizResultSchema);
const AnswerResult = model("AnswerResult", AnswerResultSchema);

module.exports = { QuizResult, AnswerResult };


