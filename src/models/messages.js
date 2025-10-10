const {StationOccupancy} = require("./structs");

class StationStatus {
    /**
     * @param {number} station_id - Unique identifier for the station
     * @param {string} current_cart_id - ID or name of the current cart
     * @param {string} old_cart_id - ID or name of the current cart
     * @param {Date} [timestamp=new Date()] - Optional timestamp (defaults to now)
     */
    constructor(station_id, current_cart_id, old_cart_id, timestamp = new Date()) {
        this.station_id = station_id;
        this.current_cart_id = current_cart_id;
        this.old_cart_id = old_cart_id;
        this.timestamp = timestamp;
    }

    // Convert to string for debugging or logging
    toString() {
        return `StationStatus(station_id=${this.station_id}, current_cart_id='${this.current_cart_id}', old_cart_id='${this.old_cart_id}', timestamp=${this.timestamp.toISOString()})`;
    }

    // Optional: Convert to JSON
    toJSON() {
        return {
            station_id: this.station_id,
            current_cart_id: this.current_cart_id,
            old_cart_id: this.old_cart_id,
            timestamp: this.timestamp.toISOString(),
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
    update(stationStatus) {
        this.stationOccupants.set(stationStatus.station_id, new StationOccupancy(stationStatus.old_cart_id, stationStatus.current_cart_id));
        this.refreshTimestamp();
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

module.exports = {StationStatus, SystemStatus};