import morgan from 'morgan';

import logger from '../configs/logger.config.js';

/**
 * Middleware untuk mencatat setiap permintaan yang masuk.
 */
export const requestLogger = morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }
);
