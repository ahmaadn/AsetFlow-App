import { logger } from '@asetflow/logger';

import { env } from './env.config.js';

/**
 * Email service provider types
 */
export type EmailProvider = 'google' | 'smtp';

/**
 * Base email service configuration interface
 */
export interface BaseEmailConfig {
  provider: EmailProvider;
  from: {
    name: string;
    address: string;
  };
}

/**
 * Google email service configuration
 */
export interface GoogleEmailConfig extends BaseEmailConfig {
  provider: 'google';
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * SMTP email service configuration
 */
export interface SMTPEmailConfig extends BaseEmailConfig {
  provider: 'smtp';
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Union type for email configuration
 */
export type EmailConfig = GoogleEmailConfig | SMTPEmailConfig;

/**
 * Email Configuration Manager
 * Handles loading and validation of email service configuration
 */
export class EmailConfigManager {
  /**
   * Load email configuration from environment variables
   * @returns Email configuration object
   */
  static loadConfiguration(): EmailConfig {
    const provider = this.determineProvider();

    if (provider === 'google') {
      return this.loadGoogleConfiguration();
    } else {
      return this.loadSMTPConfiguration();
    }
  }

  /**
   * Determine which email provider to use
   * @returns Email provider type
   */
  private static determineProvider(): EmailProvider {
    const providers =
      env.MAIL_SERVICE_PROVIDER?.toLowerCase()
        .split(',')
        .map((p) => p.trim()) || [];

    logger.info('Available email providers from env:', providers);
    // Check if Google credentials are available and Google is in the provider list
    if (
      providers.includes('google') &&
      env.GOOGLE_APP_MAIL &&
      env.GOOGLE_APP_PASSWORD
    ) {
      logger.info('Using Google email provider');
      return 'google';
    }

    // Check if SMTP credentials are available and SMTP is in the provider list
    if (providers.includes('smtp') && env.SMTP_HOST && env.SMTP_USER) {
      logger.info('Using SMTP email provider');
      return 'smtp';
    }

    // Default fallback logic
    if (env.GOOGLE_APP_MAIL && env.GOOGLE_APP_PASSWORD) {
      logger.info(
        'Defaulting to Google email provider (credentials available)'
      );
      return 'google';
    }

    if (env.SMTP_HOST && env.SMTP_USER) {
      logger.info('Defaulting to SMTP email provider (credentials available)');
      return 'smtp';
    }

    throw new Error(
      'No valid email provider configuration found. Please configure either Google or SMTP credentials.'
    );
  }

  /**
   * Load Google email configuration
   * @returns Google email configuration
   */
  private static loadGoogleConfiguration(): GoogleEmailConfig {
    const requiredEnvVars = ['GOOGLE_APP_MAIL', 'GOOGLE_APP_PASSWORD'];

    const missingVars = requiredEnvVars.filter(
      (varName) => !env[varName as keyof typeof env]
    );

    if (missingVars.length > 0) {
      logger.error('Missing required Google email environment variables:', {
        missing: missingVars,
        hint: 'Please configure Google App Mail settings in your .env file',
      });
      throw new Error(
        `Missing Google email configuration: ${missingVars.join(', ')}`
      );
    }

    return {
      provider: 'google',
      auth: {
        user: env.GOOGLE_APP_MAIL!,
        pass: env.GOOGLE_APP_PASSWORD!,
      },
      from: {
        name: env.SMTP_FROM_NAME || 'AsetFlow',
        address: env.SMTP_FROM_ADDRESS || env.GOOGLE_APP_MAIL!,
      },
    };
  }

  /**
   * Load SMTP email configuration
   * @returns SMTP email configuration
   */
  private static loadSMTPConfiguration(): SMTPEmailConfig {
    const requiredEnvVars = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
      'SMTP_FROM_NAME',
      'SMTP_FROM_ADDRESS',
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !env[varName as keyof typeof env]
    );

    if (missingVars.length > 0) {
      logger.error('Missing required SMTP email environment variables:', {
        missing: missingVars,
        hint: 'Please configure SMTP settings in your .env file',
      });
      throw new Error(
        `Missing SMTP email configuration: ${missingVars.join(', ')}`
      );
    }

    return {
      provider: 'smtp',
      host: env.SMTP_HOST!,
      port: env.SMTP_PORT!,
      secure: !!env.SMTP_SECURE || true,
      auth: {
        user: env.SMTP_USER!,
        pass: env.SMTP_PASS!,
      },
      from: {
        name: env.SMTP_FROM_NAME!,
        address: env.SMTP_FROM_ADDRESS!,
      },
    };
  }

  /**
   * Validate email configuration
   * @param config Email configuration to validate
   * @returns Validation result
   */
  static validateConfiguration(config: EmailConfig): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate common fields
    if (!config.provider) {
      errors.push('Provider is required');
    }

    if (!config.from?.name) {
      errors.push('From name is required');
    }

    if (!config.from?.address) {
      errors.push('From address is required');
    }

    if (!config.auth?.user) {
      errors.push('Auth user is required');
    }

    if (!config.auth?.pass) {
      errors.push('Auth password is required');
    }

    // Provider-specific validation
    if (config.provider === 'smtp') {
      const smtpConfig = config as SMTPEmailConfig;

      if (!smtpConfig.host) {
        errors.push('SMTP host is required');
      }

      if (!smtpConfig.port || smtpConfig.port <= 0) {
        errors.push('Valid SMTP port is required');
      }

      if (typeof smtpConfig.secure !== 'boolean') {
        errors.push('SMTP secure flag must be boolean');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get configuration summary for logging
   * @param config Email configuration
   * @returns Configuration summary
   */
  static getConfigSummary(config: EmailConfig) {
    const summary = {
      provider: config.provider,
      fromName: config.from.name,
      fromAddress: config.from.address,
      authUser: config.auth.user,
    };

    if (config.provider === 'smtp') {
      const smtpConfig = config as SMTPEmailConfig;
      return {
        ...summary,
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
      };
    }

    return summary;
  }
}
