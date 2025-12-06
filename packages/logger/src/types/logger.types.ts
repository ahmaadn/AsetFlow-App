export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

export interface LoggerConfig {
  level?: LogLevel;
  silent?: boolean;
  enableConsole?: boolean;
  enableFile?: boolean;
  logDir?: string;
  datePattern?: string;
  maxFiles?: string;
  maxSize?: string;
}
