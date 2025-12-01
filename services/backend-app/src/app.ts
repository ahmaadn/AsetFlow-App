import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express, { Response } from 'express';

import { errorHandler } from './middleware/error-handler.middleware';
import { requestLogger } from './middleware/request-logger.middleware';
import routes from './routes';
import { setupSwaggerDocs } from './swagger';
import { auth } from './utils/auth';
import { ErrorCode } from './utils/error-code';

export const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.all('/v1/auth/{*any}', toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(requestLogger);

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
