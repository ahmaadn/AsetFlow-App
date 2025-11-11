import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { DEFAULT_LOGGER_CONFIG } from './config/logger.config';
import type { LoggerConfig, LogMetadata } from './types/logger.types';

class Logger {
  private logger: winston.Logger;
  private config: LoggerConfig;

  constructor(config: LoggerConfig = {}) {
    this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // Console transport
    if (this.config.enableConsole) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaStr = Object.keys(meta).length
                ? `\n${JSON.stringify(meta, null, 2)}`
                : '';
              return `${timestamp} [${level}]: ${message}${metaStr}`;
            })
          ),
        })
      );
    }

    // File transport with daily rotation
    if (this.config.enableFile) {
      // Error logs
      transports.push(
        new DailyRotateFile({
          filename: `${this.config.logDir}/error-%DATE%.log`,
          datePattern: this.config.datePattern,
          level: 'error',
          maxFiles: this.config.maxFiles,
          maxSize: this.config.maxSize,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );

      // Combined logs
      transports.push(
        new DailyRotateFile({
          filename: `${this.config.logDir}/combined-%DATE%.log`,
          datePattern: this.config.datePattern,
          maxFiles: this.config.maxFiles,
          maxSize: this.config.maxSize,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
        })
      );
    }

    return winston.createLogger({
      level: this.config.level,
      silent: this.config.silent,
      transports,
    });
  }

  public error(message: string, meta?: LogMetadata): void {
    this.logger.error(message, meta);
  }

  public warn(message: string, meta?: LogMetadata): void {
    this.logger.warn(message, meta);
  }

  public info(message: string, meta?: LogMetadata): void {
    this.logger.info(message, meta);
  }

  public http(message: string, meta?: LogMetadata): void {
    this.logger.http(message, meta);
  }

  public debug(message: string, meta?: LogMetadata): void {
    this.logger.debug(message, meta);
  }

  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.close();
    this.logger = this.createLogger();
  }
}

// Default logger instance
export const logger = new Logger();

export { Logger };
