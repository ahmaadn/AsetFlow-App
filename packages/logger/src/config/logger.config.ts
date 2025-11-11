import type { LoggerConfig } from '../types/logger.types';

export const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  level: 'info',
  silent: false,
  enableConsole: true,
  enableFile: false,
  logDir: 'logs',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
};
