import { logger } from '@asetflow/logger';

/**
 * Email sending result interface
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Generic email data interface
 */
export interface EmailData {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Transport configuration interface
 */
export interface TransportConfig {
  name: string;
  isConfigured: boolean;
  [key: string]: unknown;
}

/**
 * Base email transport interface
 * All email transports must implement this interface
 */
export abstract class BaseMailTransport {
  protected transportName: string;
  protected isReady: boolean = false;

  constructor(transportName: string) {
    this.transportName = transportName;
  }

  /**
   * Get transport name
   */
  public getName(): string {
    return this.transportName;
  }

  /**
   * Check if transport is ready to send emails
   */
  public isTransportReady(): boolean {
    return this.isReady;
  }

  /**
   * Initialize the transport with configuration
   * @returns Promise<boolean> - true if initialization successful
   */
  public abstract initialize(): Promise<boolean>;

  /**
   * Send email using the transport
   * @param emailData - Email data to send
   * @returns Promise<EmailResult> - Result of email sending
   */
  public abstract sendEmail(emailData: EmailData): Promise<EmailResult>;

  /**
   * Get transport configuration info
   * @returns TransportConfig - Transport configuration details
   */
  public abstract getConfig(): TransportConfig;

  /**
   * Check if transport can be configured with current environment
   * @returns boolean - true if transport can be configured
   */
  public abstract canBeConfigured(): boolean;

  /**
   * Close transport connections and cleanup resources
   */
  public abstract close(): Promise<void>;

  /**
   * Log transport activity
   * @param level - Log level
   * @param message - Log message
   * @param meta - Additional metadata
   */
  protected log(
    level: 'info' | 'error' | 'warn' | 'debug',
    message: string,
    meta?: Record<string, unknown> | unknown
  ): void {
    logger[level](`[${this.transportName}] ${message}`, meta);
  }
}
