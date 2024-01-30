"use strict"
const amqp = require("amqplib")


async function consumerOrderedMessage(){
    const connection =await amqp.connect("amqp://guest:12345@localhost")
    const channel = await connection.createChannel()

    const queueName = "ordered-queue-message"
    await channel.assertQueue(queueName, {
        durable: true
    })
    //mutex
    //set prefect = 1 to ensure only 1 tasked received
    channel.prefetch(1)

    channel.consume(queueName, msg => {
        const message = msg.content.toString()

        setTimeout(() => {
            console.log("process: ", message)
            channel.ack(msg);
        }, Math.random() * 1000)
    })
}

consumerOrderedMessage().catch((error)=> {
    console.error(error)
})