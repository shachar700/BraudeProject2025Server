const Stations = Object.freeze({
    STATION_1: 1,
    STATION_2: 2,
    STATION_3: 3,
    STATION_4: 4,
});

const MqttTopics = Object.freeze({
    QR: 'braude/D106/prodLine/qr',
    IMU: 'braude/D106/prodLine/imu',
});


module.exports = {Stations, MqttTopics};