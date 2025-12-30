export { BaseMailTransport } from './base.transport.js';
export { SMTPTransport } from './smtp.transport.js';
export { GoogleTransport } from './google.transport.js';
export { LoggerTransport } from './logger.transport.js';

export type {
  EmailData,
  EmailResult,
  TransportConfig as DriverConfig,
} from './base.transport.js';
