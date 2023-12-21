const Redis = require("redis");

class RedisPubsubService {
    constructor(){
        this.subcriber = Redis.createClient();
        this.publisher = Redis.createClient()
    }

    publish(channel, message){
        return new Promise(async (resolve, reject) => {
            this.publisher.connect();
            this.publisher.publish(channel, message, (err, reply) => {
                if(err){
                    reject(err)
                }else{
                    resolve(reply)
                }
            })
        })
    }

    async subcribe(channel, callback){
        try{
            this.subcriber.connect();
            this.subcriber.subscribe(channel, (message, subscriberChannel) => {
                if(channel === subscriberChannel){
                    const payload = JSON.parse(message)
                    callback(channel, payload);
                }
            });
        }catch(error){
            console.log(error)
        }
    }
}

module.exports = new RedisPubsubService();