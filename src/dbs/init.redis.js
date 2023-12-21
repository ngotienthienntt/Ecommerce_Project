const { createClient } = require("redis");
const {  redis: { url } } = require('../configs/config.app');

const client = createClient({
    // url: url
});

client.ping((err, result) => {
    console.log(result);
})

client.on('connect', () => {
    console.log("Redis is connecting with url: ")
})

client.on("error", (error) => {
    console.log("Redis connect error: ", error)
})

module.exports = client;