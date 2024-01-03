const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
})

const producer = kafka.producer()

const runProducer = async () => {
    const result = await producer.connect()
    console.log("result: " + result);
    await producer.send({
    topic: 'test-topic',
    messages: [
        { value: 'Hello KafkaJS user!, I am Thien Ngo' },
    ],
    })

    await producer.disconnect()
}

runProducer().catch((error)=>{console.log(`KAFKA ERROR: ${error}`)});
