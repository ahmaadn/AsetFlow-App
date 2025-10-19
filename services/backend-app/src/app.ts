import express, { Response } from 'express';

import { errorHandler } from './middleware/error-handler.middleware';
import { requestLogger } from './middleware/request-logger.middleware';
import routes from './routes';
import { setupSwaggerDocs } from './swagger';
import { ErrorCode } from './utils/error-code';

export const app = express();

// Middleware
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
