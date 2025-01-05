// Import necessary modules
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

// Kafka configuration from environment variables
const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';
const kafkaTopic = process.env.KAFKA_TOPIC || 'default_topic';
const kafkaClientId = process.env.KAFKA_CLIENT_ID || 'nodejs_publisher';

// Initialize Kafka client
const kafka = new Kafka({
  clientId: kafkaClientId,
  brokers: [kafkaBroker],
});

const producer = kafka.producer();

// Generate random event
function generateEvent() {
  return {
    eventId: uuidv4(),
    eventType: Math.random() > 0.5 ? 'user_signup' : 'order_created',
    timestamp: new Date().toISOString(),
    payload: {
      randomAttribute: Math.random().toString(36).substring(7),
    },
  };
}

// Publish event to Kafka
async function publishEvent() {
  const event = generateEvent();
  try {
    await producer.send({
      topic: kafkaTopic,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });
    console.log(JSON.stringify({ level: 'info', message: 'Event published', event }));
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to publish event', error: error.message }));
  }
}

// Main function
async function main() {
  try {
    await producer.connect();
    console.log(JSON.stringify({ level: 'info', message: 'Kafka producer connected' }));

    setInterval(() => {
      publishEvent();
    }, 3000);
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'Error in Kafka producer', error: error.message }));
  }
}

main();
