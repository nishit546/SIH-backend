const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sih_db';

let isConnected = false;

/**
 * Connect to MongoDB using Mongoose with resilient retry/fallback logging
 */
async function connectMongoDB() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Connection warning: Unable to connect to MongoDB at ${MONGO_URI}. (${error.message})`);
    return null;
  }
}

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('[MongoDB] Connection established');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('[MongoDB] Connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] Disconnected');
});

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = {
  connectMongoDB,
  isMongoConnected,
  mongoose,
};
