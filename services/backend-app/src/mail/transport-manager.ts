import { logger } from '@asetflow/logger';

import {
  BaseMailTransport,
  SMTPTransport,
  GoogleTransport,
  LoggerTransport,
  EmailData,
  EmailResult,
} from './transports/index.js';

/**
 * Email Transport Manager
 * Manages email transports with priority-based selection:
 * 1. SMTP (if configured)
 * 2. Google (if configured)
 * 3. Logger (fallback)
 */
export class MailTransportManager {
  private installedTransport: BaseMailTransport | null = null;
  private availableTransports: BaseMailTransport[] = [];

  constructor() {
    this.initializeTransports();
  }

  /**
   * Initialize available transports
   */
  private initializeTransports(): void {
    this.availableTransports = [
      new SMTPTransport(),
      new GoogleTransport(),
      new LoggerTransport(),
    ];

    logger.info('Email Transports initialized', {
      available: this.availableTransports.map((transport) => ({
        name: transport.getName(),
        canBeConfigured: transport.canBeConfigured(),
      })),
    });
  }

  /**
   * Install the best available transport based on priority
   */
  public async installTransport(): Promise<boolean> {
    // If a transport is already installed, close it first
    if (this.installedTransport) {
      await this.installedTransport.close();
      this.installedTransport = null;
    }

    // Try to install transports in priority order
    for (const transport of this.availableTransports) {
      if (transport.canBeConfigured()) {
        logger.info(`Attempting to install ${transport.getName()} transport`);

        const initialized = await transport.initialize();
        if (initialized) {
          this.installedTransport = transport;
          logger.info(
            `Successfully installed ${transport.getName()} transport`
          );
          return true;
        } else {
          logger.warn(`Failed to initialize ${transport.getName()} transport`);
        }
      } else {
        logger.debug(
          `${transport.getName()} transport cannot be configured (missing environment variables)`
        );
      }
    }

    logger.error('No email transport could be installed');
    return false;
  }

  /**
   * Get currently installed transport
   */
  public getInstalledTransport(): BaseMailTransport | null {
    return this.installedTransport;
  }

  /**
   * Check if any transport is installed and ready
   */
  public isReady(): boolean {
    return this.installedTransport?.isTransportReady() ?? false;
  }

  /**
   * Get transport information
   */
  public getTransportInfo() {
    const installedTransport = this.installedTransport;

    return {
      hasInstalledTransport: !!installedTransport,
      installedTransportName: installedTransport?.getName() || null,
      isReady: this.isReady(),
      installedTransportConfig: installedTransport?.getConfig() || null,
      availableTransports: this.availableTransports.map((transport) => ({
        name: transport.getName(),
        canBeConfigured: transport.canBeConfigured(),
        config: transport.getConfig(),
      })),
    };
  }

  /**
   * Send email using the installed transport
   */
  public async sendEmail(emailData: EmailData): Promise<EmailResult> {
    if (!this.installedTransport) {
      // Try to install a transport if none is installed
      const installed = await this.installTransport();
      if (!installed) {
        const error = 'No email transport is installed and available';
        logger.error(error);
        return { success: false, error };
      }
    }

    if (!this.installedTransport!.isTransportReady()) {
      const error = `Installed transport (${this.installedTransport!.getName()}) is not ready`;
      logger.error(error);
      return { success: false, error };
    }

    return await this.installedTransport!.sendEmail(emailData);
  }

  /**
   * Reinstall transport (useful for configuration changes)
   */
  public async reinstallTransport(): Promise<boolean> {
    logger.info('Reinstalling email transport');
    return await this.installTransport();
  }

  /**
   * Close all transports and cleanup
   */
  public async close(): Promise<void> {
    if (this.installedTransport) {
      await this.installedTransport.close();
      this.installedTransport = null;
    }

    // Close all transports to ensure cleanup
    await Promise.all(
      this.availableTransports.map((transport) => transport.close())
    );

    logger.info('Email transport manager closed');
  }
}
