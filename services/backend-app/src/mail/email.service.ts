import logger from '../configs/logger.config.js';
import {
  ForgotPasswordTemplate,
  type ForgotPasswordEmailData,
  WelcomeTemplate,
  type WelcomeEmailData,
  EmailVerificationTemplate,
  type EmailVerificationData,
} from './templates/index.js';
import { MailTransportManager } from './transport-manager.js';
import { EmailData, EmailResult } from './transports/index.js';

export class EmailService {
  private transportManager: MailTransportManager;

  constructor() {
    this.transportManager = new MailTransportManager();
    this.initializeService();
  }

  /**
   * Initialize email service by installing the best available transport
   */
  private async initializeService(): Promise<void> {
    try {
      const installed = await this.transportManager.installTransport();
      if (installed) {
        logger.info('Email service initialized successfully');
      } else {
        logger.warn(
          'Email service initialized with fallback (no drivers available)'
        );
      }
    } catch (error) {
      logger.error('Failed to initialize email service:', error);
    }
  }

  /**
   * Check if email service is properly configured and ready
   * @returns Configuration status
   */
  public isReady(): boolean {
    return this.transportManager.isReady();
  }

  /**
   * Get current email transport information
   * @returns Email transport and configuration details
   */
  public getProviderInfo() {
    const driverInfo = this.transportManager.getTransportInfo();
    return {
      hasDriver: driverInfo.hasInstalledTransport,
      driverName: driverInfo.installedTransportName,
      isConfigured: driverInfo.isReady,
      config: driverInfo.installedTransportConfig,
      availableTransports: driverInfo.availableTransports,
    };
  }

  /**
   * Reinstall email transport (useful after configuration changes)
   * @returns Success status
   */
  public async reinstallTransport(): Promise<boolean> {
    return await this.transportManager.reinstallTransport();
  }

  /**
   * Send a generic email
   * @param emailData - Email data object
   * @returns Email sending result
   */
  public async sendEmail(emailData: EmailData): Promise<EmailResult> {
    return await this.transportManager.sendEmail(emailData);
  }

  /**
   * Send forgot password email
   * @param to - Recipient email address
   * @param data - Forgot password template data
   * @returns Email sending result
   */
  public async sendForgotPasswordEmail(
    to: string,
    data: ForgotPasswordEmailData
  ): Promise<EmailResult> {
    try {
      const html = ForgotPasswordTemplate.generate(data);
      const text = ForgotPasswordTemplate.generatePlainText(data);

      return await this.sendEmail({
        to,
        subject: 'Reset Your Password - AsetFlow',
        html,
        text,
      });
    } catch (error) {
      logger.error('Failed to send forgot password email:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate email content',
      };
    }
  }

  /**
   * Send welcome email to new users
   * @param to - Recipient email address
   * @param data - Welcome email template data
   * @returns Email sending result
   */
  public async sendWelcomeEmail(
    to: string,
    data: WelcomeEmailData
  ): Promise<EmailResult> {
    try {
      const html = WelcomeTemplate.generate(data);
      const text = WelcomeTemplate.generatePlainText(data);

      return await this.sendEmail({
        to,
        subject: 'Welcome to AsetFlow!',
        html,
        text,
      });
    } catch (error) {
      logger.error('Failed to send welcome email:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate email content',
      };
    }
  }

  /**
   * Send email verification email
   * @param to - Recipient email address
   * @param data - Email verification template data
   * @returns Email sending result
   */
  public async sendEmailVerification(
    to: string,
    data: EmailVerificationData
  ): Promise<EmailResult> {
    try {
      const html = EmailVerificationTemplate.generate(data);
      const text = EmailVerificationTemplate.generatePlainText(data);

      return await this.sendEmail({
        to,
        subject: 'Verify Your Email Address - AsetFlow',
        html,
        text,
      });
    } catch (error) {
      logger.error('Failed to send email verification:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate email content',
      };
    }
  }

  /**
   * Close the email service and all drivers
   */
  public async close(): Promise<void> {
    try {
      await this.transportManager.close();
      logger.info('Email service closed');
    } catch (error) {
      logger.error('Error closing email service:', error);
    }
  }
}

let _mailServiceInstance: EmailService | null = null;

/**
 * Create a new EmailService instance
 * Should be called after environment variables are loaded
 * @returns New EmailService instance
 */
export function createEmailService(): EmailService {
  if (_mailServiceInstance) {
    return _mailServiceInstance;
  }
  _mailServiceInstance = new EmailService();
  return _mailServiceInstance;
}

export const emailService = createEmailService();

export type {
  ForgotPasswordEmailData,
  WelcomeEmailData,
  EmailVerificationData,
  EmailData,
  EmailResult,
};
