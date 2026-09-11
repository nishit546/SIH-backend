const express = require('express');
const cors = require('cors');
const { checkDatabaseConnection } = require('./config/database');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { aiConfig } = require('./config/aiConfig');
const { connectMongoDB, isMongoConnected } = require('./config/mongodb');

// Connect to MongoDB asynchronously
connectMongoDB();

// Health Check Route
app.get('/health', async (req, res) => {
  const isDbConnected = await checkDatabaseConnection();
  const mongoStatus = isMongoConnected() ? 'connected' : 'disconnected';

  let aiHealth = {
    provider: aiConfig.provider,
    status: aiConfig.provider === 'mock' ? 'operational (mock)' : 'unknown',
  };

  if (aiConfig.provider === 'real') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const aiResponse = await fetch(`${aiConfig.serviceUrl}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      aiHealth.status = aiResponse.ok ? 'operational' : `degraded (HTTP ${aiResponse.status})`;
    } catch {
      aiHealth.status = 'unreachable';
    }
  }

  if (!isDbConnected) {
    return res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      mongodb: mongoStatus,
      aiService: aiHealth,
    });
  }

  return res.status(200).json({
    status: 'ok',
    database: 'connected',
    mongodb: mongoStatus,
    aiService: aiHealth,
  });
});

// Main API Routes
app.use('/api', apiRoutes);

// Central Error Handling Middleware
app.use(errorHandler);

module.exports = app;
