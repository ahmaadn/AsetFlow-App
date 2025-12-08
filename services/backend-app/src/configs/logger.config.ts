import { Logger, type LogLevel } from '@asetflow/logger';

import { env } from './env.config.js';

export const logger = new Logger({
  level: (env.LOG_LEVEL || 'info') as LogLevel,
  enableFile: false,
});
