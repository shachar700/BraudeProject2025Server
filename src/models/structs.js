
export class CartInfo {
    /**
     * @param {string} id - Unique identifier for the cart
     * @param {number} [speed=0] - Current speed of the cart
     */
    constructor(id, speed = 0) {
        this.id = id;
        this.speed = speed;
    }

    // Update the cart speed
    setSpeed(newSpeed) {
        this.speed = newSpeed;
    }

    // Convert to plain JSON for transport/storage
    toJSON() {
        return {
            id: this.id,
            speed: this.speed,
        };
    }

    // Recreate from JSON
    static fromJSON(json) {
        return new CartInfo(json.id, json.speed);
    }

    // Readable string for logging
    toString() {
        return `Cart ${this.id}: speed=${this.speed}`;
    }
}
