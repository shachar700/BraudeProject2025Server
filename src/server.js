// src/server.js
require('dotenv').config(); // load .env
const http = require('http');
const {WebSocketServer} = require('ws');
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocketServer({server});

const {subscribe, unsubscribe, publish} = require('./services/WebSocketService');

wss.on('connection', (ws, req) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    subscribe(ws);
    console.log("Connection opened for ip: ", ip)

    ws.on('close', (code, reason) => {
        unsubscribe(ws);
        console.log(`Connection closed (code=${code}, reason='${reason}') for ip: `, ip)
    })
})


server.listen(PORT, () => {
    const { address, port } = server.address();
    let host = address;

    // On many systems, address can be '::' or '0.0.0.0', replace with 'localhost' for readability
    if (address === '::' || address === '0.0.0.0') {
        host = 'localhost';
    }

    console.log(`✅ Server running on http://${host}:${port}`);
});

