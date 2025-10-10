
const webSocketService = new Set();

const subscribe = (ws) =>{
    webSocketService.add(ws);
}
const unsubscribe = (ws) =>{
    webSocketService.delete(ws);
}

const publish = (topic, msg) =>{
    webSocketService.forEach((ws) => {
        if (ws.readyState === ws.OPEN)
            ws.send(JSON.stringify({topic: topic, message: msg}));
    });
}

module.exports = {subscribe, unsubscribe, publish};