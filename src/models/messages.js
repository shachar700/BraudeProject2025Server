const {StationOccupancy, CartInfo} = require("./structs");
const {StationIDs, CartIDs} = require("./enums");

class StationStatus {
    /**
     * @param {number} station_id - Unique identifier for the station
     * @param {string} current_cart_id - ID or name of the current cart
     * @param {string} old_cart_id - ID or name of the current cart
     */
    constructor(station_id, current_cart_id, old_cart_id) {
        this.station_id = station_id;
        this.current_cart_id = current_cart_id;
        this.old_cart_id = old_cart_id;
    }

    // Convert to string for debugging or logging
    toString() {
        return `StationStatus(station_id=${this.station_id}, current_cart_id='${this.current_cart_id}', old_cart_id='${this.old_cart_id}'})`;
    }

    // Optional: Convert to JSON
    toJSON() {
        return {
            station_id: this.station_id,
            current_cart_id: this.current_cart_id,
            old_cart_id: this.old_cart_id,
        };
    }

    // Optional: Create from JSON
    static fromJSON(json) {
        return new StationStatus(
            json.station_id,
            json.current_cart_id,
            json.old_cart_id
        );
    }
}

class SystemStatus {
    /**
     * @param {Array<CartInfo>} carts - List of all carts in the system
     * @param {Map<number, StationOccupancy>} stationOccupants - Maps station_id → cart_id
     * @param {Date} [timestamp=new Date()] - Timestamp of the system status (defaults to now)
     */
    constructor(carts = [], stationOccupants = new Map(), timestamp = new Date()) {
        this.carts = carts;
        this.stationOccupants = stationOccupants;
        this.timestamp = timestamp;
    }

    reset(){

        this.carts = []

        this.stationOccupants.set(StationIDs.STATION_1, {oldCart:CartIDs.cart_empty, newCart:CartIDs.cart_empty});
        this.stationOccupants.set(StationIDs.STATION_2, {oldCart:CartIDs.cart_empty, newCart:CartIDs.cart_empty});
        this.stationOccupants.set(StationIDs.STATION_3, {oldCart:CartIDs.cart_empty, newCart:CartIDs.cart_empty});
        this.stationOccupants.set(StationIDs.STATION_4, {oldCart:CartIDs.cart_empty, newCart:CartIDs.cart_empty});

        this.refreshTimestamp();
    }

    // Update timestamp (e.g., after any change)
    refreshTimestamp() {
        this.timestamp = new Date();
    }

    // Convert to plain JSON (for network or logging)
    toJSON() {
        let json =  {
            carts: this.carts,
            stationOccupants: Object.fromEntries(this.stationOccupants.entries()),
            timestamp: this.timestamp.toISOString(),
        };
        return json;
    }

    /**
     * @param {StationStatus} stationStatus - List of all carts in the system
     */
    updateStation(stationStatus) {
        this.stationOccupants.set(stationStatus.station_id, new StationOccupancy(stationStatus.old_cart_id, stationStatus.current_cart_id));
        this.refreshTimestamp();
    }

    /**
     * @param {CartInfo} cartInfo - List of all carts in the system
     */
    updateCart(cartInfo){
        const cart = this.carts.find(ci => ci.cart_id === cartInfo.cart_id);
        if (cart) {
            cart.speed = cartInfo.speed;
        }
        else{
            this.carts.push(new CartInfo(cartInfo.cart_id, cartInfo.speed));
        }
    }

    toString() {
        const cartsStr = this.carts.map(cart => cart.toString()).join(', ');

        const stationOccupantsStr = Array.from(this.stationOccupants.entries())
            .map(([stationId, cartId]) => `${stationId}: '${cartId}'`)
            .join(', ');

        return `SystemStatus(timestamp=${this.timestamp.toISOString()}, carts=[${cartsStr}], stationOccupants={${stationOccupantsStr}})`;
    }

    // Recreate from JSON
    static fromJSON(json) {
        return new SystemStatus(
            json.carts,
            new Map(json.stationOccupants),
            new Date(json.timestamp)
        );
    }
}

// class QuizResultMessage{
//
//     /**
//      *
//      * @param {QuizResult} quizResult
//      * @param {AnswerResult[]} answerResults
//      */
//     constructor(quizResult, answerResults) {
//         this.quizResult = quizResult;
//         this.answerResults = answerResults;
//     }
//
// }

class Badges{

    /**
     *
     * @param {Badge[]} badges
     */
    constructor(badges) {
        this.badges = badges;
    }
}

module.exports = {StationStatus, SystemStatus, /* QuizResultMessage */Badges};