
class CartInfo {
    /**
     * @param {string} cart_id - Unique identifier for the cart
     * @param {number} [speed=0] - Current speed of the cart
     */
    constructor(cart_id, speed = 0) {
        this.cart_id = cart_id;
        this.speed = speed;
    }

    // Update the cart speed
    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    // Convert to plain JSON for transport/storage
    toJSON() {
        return {
            cart_id: this.cart_id,
            speed: this.speed,
        };
    }

    // Recreate from JSON
    static fromJSON(json) {
        return new CartInfo(json.cart_id, json.speed);
    }

    toString() {
        return `CartInfo(id=${this.id}, speed=${this.speed})`;
    }
}

class StationOccupancy{

    constructor(oldCart, newCart) {
        this.oldCart = oldCart;
        this.newCart = newCart;
    }
}

class Badge{

    constructor(badge_id, title, description){
        this.badge_id = badge_id;
        this.title = title;
        this.description = description;
    }
}


class UserBadge{
    constructor(username, badge_id, unlockedDate){
        this.username = username;
        this.badge_id = badge_id;
        this.unlockedDate = unlockedDate;
    }
}

// TODO - QuizResult { quizResult_id, username, answerResults { list<answerResult> } totalDuration { sec }, timestamp {timestamp} }
// TODO AnswerResult { answerResult_id, quizResult_id, selectedAnswer, correctAnswer, duration}

module.exports = {CartInfo, StationOccupancy}