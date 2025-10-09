
const subscriptionService = new Map();

const subscribe = (ip, ws) =>{
    subscriptionService.set(ip, ws);
}
const unsubscribe = (ip) =>{
    subscriptionService.delete(ip);
}

const publish = (topic, msg) =>{
    subscriptionService.forEach((ws) => {
        if (ws.readyState === ws.OPEN)
            ws.send(JSON.stringify({topic: topic, message: msg}));
    });
}

module.exports = {subscribe, unsubscribe, publish};