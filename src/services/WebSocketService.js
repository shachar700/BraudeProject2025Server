const {PublisherTopics} = require("../models/enums");


const webSocketService = new Map();
webSocketService.set(PublisherTopics.SYSTEM_STATUS, new Set());
webSocketService.set(PublisherTopics.LOG, new Set());
webSocketService.set(PublisherTopics.MQTT, new Set());

const subscribe = (topic, ws) =>{
    if (webSocketService.has(topic)) {
        webSocketService.get(topic).add(ws);
        return true;
    }
    return false;
}
const unsubscribe = (ws) =>{
    for (const topic of Object.values(PublisherTopics)){
        if (webSocketService.get(topic).has(ws)){
            webSocketService.get(topic).delete(ws);
        }
    }
}

const publish = (topic, msg) =>{
    if (!webSocketService.has(topic)) {
        return;
    }
    for (const ws of webSocketService.get(topic)) {
        if (ws.readyState === ws.OPEN)
            ws.send(JSON.stringify({topic: topic, message: msg}));
    }
}

module.exports = {subscribe, unsubscribe, publish};