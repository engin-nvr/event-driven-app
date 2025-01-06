// Import necessary modules
const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');

// Kafka and MongoDB configuration from environment variables
const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';
const kafkaTopic = process.env.KAFKA_TOPIC || 'default_topic';
const kafkaGroupId = process.env.KAFKA_GROUP_ID || 'nodejs_consumer_group';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const mongoDbName = process.env.MONGO_DB_NAME || 'kafka_events';
const mongoCollectionName = process.env.MONGO_COLLECTION_NAME || 'events';

// Initialize Kafka consumer
const kafka = new Kafka({
  clientId: 'nodejs_consumer',
  brokers: [kafkaBroker],
});

const consumer = kafka.consumer({ groupId: kafkaGroupId });

// MongoDB client
const mongoClient = new MongoClient(mongoUri);

async function consumeAndStore() {
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    const db = mongoClient.db(mongoDbName);
    const collection = db.collection(mongoCollectionName);

    console.log(JSON.stringify({ level: 'info', message: 'Connected to MongoDB' }));

    // Connect to Kafka
    await consumer.connect();
    console.log(JSON.stringify({ level: 'info', message: 'Kafka consumer connected' }));

    // Subscribe to topic
    await consumer.subscribe({ topic: kafkaTopic, fromBeginning: true });

    // Consume messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log(JSON.stringify({ level: 'info', message: 'Event received', event }));

        // Store event in MongoDB
        try {
          await collection.insertOne(event);
          console.log(JSON.stringify({ level: 'info', message: 'Event stored in MongoDB', event }));
        } catch (error) {
          console.error(JSON.stringify({ level: 'error', message: 'Failed to store event in MongoDB', error: error.message }));
        }
      },
    });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'Error in Kafka consumer', error: error.message }));
  }
}

consumeAndStore();


