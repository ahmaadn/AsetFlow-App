import { ErrorCode } from '@asetflow/shared';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Response, Express } from 'express';

import { env } from './configs/env.config.js';
import logger from './configs/logger.config.js';
import { createSwaggerDocs } from './docs/swagger.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { requestLogger } from './middleware/request-logger.middleware.js';
import routes from './routes/index.js';

function createApp(): Express {
  const app: Express = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      exposedHeaders: ['Set-Cookie'],
      preflightContinue: false,
      optionsSuccessStatus: 200,
    })
  );
  app.use(requestLogger);
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  createSwaggerDocs(app);

  app.use('/v1', routes);

  // Handler untuk route tidak ditemukan
  app.use((_req, res: Response) => {
    logger.error('Route not found');
    res.status(404).send({
      message: 'Not Found',
      errorCode: ErrorCode.NOT_FOUND,
    });
  });

  app.use(errorHandler);
  return app;
}

export const app = createApp();
export default app;
