// Import necessary modules
const express = require('express');
const { MongoClient } = require('mongodb');

// MongoDB configuration from environment variables
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const mongoDbName = process.env.MONGO_DB_NAME || 'kafka_events';
const mongoCollectionName = process.env.MONGO_COLLECTION_NAME || 'events';
const port = process.env.PORT || 3000;

// Initialize Express app
const app = express();
const mongoClient = new MongoClient(mongoUri);

let collection;

// Middleware to log requests
app.use((req, res, next) => {
  console.log(JSON.stringify({
    level: 'info',
    message: 'Request received',
    path: req.path,
    headers: req.headers,
  }));
  next();
});

// Connect to MongoDB and set up the collection
async function connectToMongoDB() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(mongoDbName);
    collection = db.collection(mongoCollectionName);
    console.log(JSON.stringify({ level: 'info', message: 'Connected to MongoDB' }));
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to connect to MongoDB', error: error.message }));
    process.exit(1);
  }
}

// List endpoint
app.get('/events', async (req, res) => {
  try {
    const { eventType, startTime, endTime, page = 1, limit = 10 } = req.query;

    // Build query object
    const query = {};
    if (eventType) query.eventType = eventType;
    if (startTime || endTime) {
      query.timestamp = {};
      if (startTime) query.timestamp.$gte = new Date(startTime);
      if (endTime) query.timestamp.$lte = new Date(endTime);
    }

    // Pagination options
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const options = {
      skip,
      limit: parseInt(limit),
    };

    // Fetch events from MongoDB
    const events = await collection.find(query, options).toArray();

    res.status(200).json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      events,
    });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', message: 'Error fetching events', error: error.message }));
    res.status(500).json({ success: false, message: 'Failed to fetch events' });
  }
});

// Start the server
async function startServer() {
  await connectToMongoDB();
  app.listen(port, () => {
    console.log(JSON.stringify({ level: 'info', message: `Server running on port ${port}` }));
  });
}

startServer();


