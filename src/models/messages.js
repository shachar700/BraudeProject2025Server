
export class StationStatus {
    /**
     * @param {number} station_id - Unique identifier for the station
     * @param {string} current_cart_id - ID or name of the current cart
     * @param {Date} [timestamp=new Date()] - Optional timestamp (defaults to now)
     */
    constructor(station_id, current_cart_id, timestamp = new Date()) {
        this.station_id = station_id;
        this.current_cart_id = current_cart_id;
        this.timestamp = timestamp;
    }

    // Convert to string for debugging or logging
    toString() {
        return `Station ${this.station_id}: Current cart - ${this.current_cart_id} (updated at ${this.timestamp.toISOString()})`;
    }

    // Optional: Convert to JSON
    toJSON() {
        return {
            station_id: this.station_id,
            current_cart_id: this.current_cart_id,
            timestamp: this.timestamp.toISOString(),
        };
    }

    // Optional: Create from JSON
    static fromJSON(json) {
        return new StationStatus(
            json.station_id,
            json.current_cart_id,
            new Date(json.timestamp)
        );
    }
}

export class SystemStatus {
    /**
     * @param {Array<CartInfo>} carts - List of all carts in the system
     * @param {Map<number, string>} stationOccupants - Maps station_id → cart_id
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

    // Update a specific station's occupant
    setStationOccupant(stationId, cartId) {
        this.stationOccupants.set(stationId, cartId);
        this.refreshTimestamp();
    }

    // Convert to plain JSON (for network or logging)
    toJSON() {
        return {
            carts: this.carts,
            stationOccupants: Array.from(this.stationOccupants.entries()),
            timestamp: this.timestamp.toISOString(),
        };
    }

    // Recreate from JSON
    static fromJSON(json) {
        return new SystemStatus(
            json.carts,
            new Map(json.stationOccupants),
            new Date(json.timestamp)
        );
    }

    // Optional: readable string representation
    toString() {
        return `SystemStatus @ ${this.timestamp.toISOString()} | Stations: ${this.stationOccupants.size}, Carts: ${this.carts.length}`;
    }
}
