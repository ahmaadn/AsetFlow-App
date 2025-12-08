import { app } from './app.js';
import { env, PORT } from './configs/env.config.js';
import { logger } from './configs/logger.js';

if (env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
