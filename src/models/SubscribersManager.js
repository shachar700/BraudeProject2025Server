const redis = require('redis');
const redisClient = redis.createClient({
    url: `redis://localhost:6379`
});

redisClient.on('message', (channel, message) => {
    console.log(`Received message from ${channel}: ${message}`);
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));


redisClient.connect()
    .then((t)=> console.log(`Redis Connected: ${t}`))
    .catch((err) => console.error('Redis Client Error', err));

module.exports = { redisClient,  };