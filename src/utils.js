const {PublisherTopics} = require("./models/enums");
const {publish} = require("./services/WebSocketService");
const config = require("../config");


const logMessage = (msg) =>{
    console.log(msg);
    if (config.publishLogMessage)
        publish(PublisherTopics.LOG, {message:msg, timestamp: new Date()});
}

module.exports = { logMessage }