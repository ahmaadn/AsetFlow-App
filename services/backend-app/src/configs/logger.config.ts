import { Logger, type LogLevel } from '@asetflow/logger';

export const logger = new Logger({
  level: (process.env.LOG_LEVEL || 'info') as LogLevel,
  enableFile: false,
});
