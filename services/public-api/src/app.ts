import { prisma } from '@asetflow/database';
import { logger } from '@asetflow/logger';
import cors from 'cors';
import express, { type Express } from 'express';

import routes from './routes';
import { setupSwaggerDocs } from './swagger';

export const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors());
setupSwaggerDocs(app);

// Request logging
app.use((req, _res, next) => {
  logger.http(`${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip,
  });
  next();
});

// Routes
app.use('/v1', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'public-api' });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response) => {
  logger.error(err.message, {
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An error occurred while processing your request',
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
