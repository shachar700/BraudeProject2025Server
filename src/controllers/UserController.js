
// TODO - getBadges(username) returns List<UserBadge>

// TODO - addBadge(username, badge_id) returns boolean

// TODO addQuizResult(QuizResult, AnswerResult[]) returns boolean
/**
 * first insert the quizResult to the db, and get it's new id
 * afterward set the quizResult_id to that id in each of the answerResult in the given array
 * after you've set the quizResult_id insert the AnswerResult array to the db
 */