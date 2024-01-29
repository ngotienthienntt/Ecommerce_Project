const amqp = require("amqplib")
const message = "Hello rabbit mq, i am thien"

const runProducer = async () => {
    try{
        const connection =await amqp.connect("amqp://guest:12345@localhost")
        const channel = await connection.createChannel()

        const queueName = "test-topic"
        await channel.assertQueue(queueName, { durable: true})

        channel.sendToQueue(queueName, Buffer.from(message))
        console.log("message sent: ", message);

        setTimeout(()=> {
            connection.close()
            process.exit(0)
        }, 500)
    }catch(error){
        console.log(error);
    }
}

runProducer().catch(error => console.log(error))