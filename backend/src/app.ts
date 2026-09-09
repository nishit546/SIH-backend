import express, { Request, Response } from 'express';
import cors from 'cors';
import { checkDatabaseConnection } from './config/database';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', async (req: Request, res: Response) => {
  const isDbConnected = await checkDatabaseConnection();

  if (!isDbConnected) {
    return res.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }

  return res.status(200).json({
    status: 'ok',
    database: 'connected',
  });
});

// Main API Routes
app.use('/api', apiRoutes);

// Central Error Handling Middleware
app.use(errorHandler);

export default app;
