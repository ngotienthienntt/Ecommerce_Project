const amqp = require("amqplib")
const message = "Hello rabbit mq, i am thien"
const log = console.log
console.log = function(){
    log.apply(console, [new Date()].concat(arguments))
}
const runProducer = async () => {
    try{
        const connection =await amqp.connect("amqp://guest:12345@localhost")
        const channel = await connection.createChannel()

        const notificationExchange = "notificationEx" // notificaitonEx - direct
        const notiQueue = "notificationQueueProcess" // assert Queue
        const notificationExchangeDLX = "notificationExDLX" // notificationEx direct
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX" // assert

        //1. create exchange
        await channel.assertExchange(notificationExchange, "direct", {
            durable: true
        })

        //2. create queue
        const { queue } = await channel.assertQueue(notiQueue, {
            exclusive: false,
            deadLetterExchange: notificationExchangeDLX, ///set up to send DLX queue
            deadLetterRoutingKey: notificationRoutingKeyDLX,
        })

        //3. bindQueue
        await channel.bindQueue(queue, notificationExchange)

        //4. send message
        const msg = "a new product"
        console.log("msg:::", msg)

        await channel.sendToQueue(queue, Buffer.from(msg), {
            expiration: "10000"
        })


        setTimeout(()=> {
            connection.close()
            process.exit(0)
        }, 500) 
    }catch(error){
        console.log(error);
    }
}

runProducer().catch(error => console.log(error))