
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

module.exports = {CartInfo, StationOccupancy}