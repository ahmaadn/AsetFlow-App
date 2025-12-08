import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express, { type Response, Express } from 'express';

import { env } from './configs/env.config.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { requestLogger } from './middleware/request-logger.middleware.js';
import routes from './routes/index.js';
import { setupSwaggerDocs } from './swagger.js';
import { auth } from './utils/auth.js';
import { ErrorCode } from './utils/error-code.js';

export const app: Express = express();

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
app.all('/v1/auth/{*any}', toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

setupSwaggerDocs(app);

app.use('/v1', routes);

// Handler untuk route tidak ditemukan
app.use((_req, res: Response) => {
  res.status(404).send({
    message: 'Not Found',
    errorCode: ErrorCode.NOT_FOUND,
  });
});

app.use(errorHandler);

export default app;
