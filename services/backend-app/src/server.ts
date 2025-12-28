import app from './app.js';
import { PORT } from './configs/env.config.js';
import logger from './utils/logger.js';

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/docs`);
  });
}

export default app;
