const StationIDs = Object.freeze({
    STATION_1: 1,
    STATION_2: 2,
    STATION_3: 3,
    STATION_4: 4,
});

const MqttTopics = Object.freeze({
    QR: 'braude/D106/prodLine/qr',
    IMU: 'braude/D106/prodLine/imu',
});

const CartIDs = Object.freeze({
    cart_empty: 'cart_empty',
    cart_1: 'cart_1',
    cart_2: 'cart_2',
    cart_3: 'cart_3',
    cart_4: 'cart_4',
    cart_5: 'cart_5'
});

const PublisherTopics = Object.freeze({
    SYSTEM_STATUS: 'system_status',
    SYSTEM_RESET: 'system_reset',
    LOG: 'log',
    MQTT: 'mqtt'
});

module.exports = {StationIDs, CartIDs, MqttTopics, PublisherTopics};