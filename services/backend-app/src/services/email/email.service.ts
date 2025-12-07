import { logger } from '@asetflow/logger';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

import {
  ForgotPasswordTemplate,
  type ForgotPasswordEmailData,
  WelcomeTemplate,
  type WelcomeEmailData,
  EmailVerificationTemplate,
  type EmailVerificationData,
} from './templates';
import {
  EmailConfigManager,
  EmailConfig,
  GoogleEmailConfig,
  SMTPEmailConfig,
} from '../../configs/email.config';

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
 * Email Service Class
 * Handles all email operations using Nodemailer
 */
export class EmailService {
  private transporter: Transporter;
  private config: EmailConfig;
  private isConfigured: boolean = false;

  constructor() {
    this.config = EmailConfigManager.loadConfiguration();
    this.transporter = this.createTransporter();
    this.verifyConnection();
  }

  /**
   * Create Nodemailer transporter with configuration
   * @returns Configured Nodemailer transporter
   */
  private createTransporter(): Transporter {
    try {
      let transporter: Transporter;

      if (this.config.provider === 'google') {
        transporter = this.createGoogleTransporter();
      } else {
        transporter = this.createSMTPTransporter();
      }

      logger.info('Email transporter created successfully', {
        provider: this.config.provider,
        user: this.config.auth.user,
      });

      return transporter;
    } catch (error) {
      logger.error('Failed to create email transporter:', error);
      throw error;
    }
  }

  /**
   * Create Google SMTP transporter
   * @returns Google SMTP transporter
   */
  private createGoogleTransporter(): Transporter {
    const googleConfig = this.config as GoogleEmailConfig;

    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: googleConfig.auth,
      // Additional security and debugging options
      logger: false, // Enable for debugging
      debug: false, // Enable for debugging
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
  }

  /**
   * Create custom SMTP transporter
   * @returns SMTP transporter
   */
  private createSMTPTransporter(): Transporter {
    const smtpConfig = this.config as SMTPEmailConfig;

    return nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: smtpConfig.auth,
      // Additional security and debugging options
      logger: false, // Enable for debugging
      debug: false, // Enable for debugging
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
  }

  /**
   * Verify email server connection
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.isConfigured = true;
      logger.info('Email server connection verified successfully');
    } catch (error) {
      this.isConfigured = false;
      logger.error('Email server connection failed:', error);
      logger.warn(
        'Email service will not be available until configuration is fixed'
      );
    }
  }

  /**
   * Check if email service is properly configured and ready
   * @returns Configuration status
   */
  public isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Get current email provider information
   * @returns Email provider and configuration details
   */
  public getProviderInfo() {
    return {
      provider: this.config.provider,
      from: this.config.from,
      user: this.config.auth.user,
      isConfigured: this.isConfigured,
    };
  }

  /**
   * Send a generic email
   * @param emailData - Email data object
   * @returns Email sending result
   */
  public async sendEmail(emailData: EmailData): Promise<EmailResult> {
    if (!this.isConfigured) {
      const error = 'Email service is not properly configured';
      logger.error(error);
      return { success: false, error };
    }

    try {
      const mailOptions: SendMailOptions = {
        from: `"${this.config.from.name}" <${this.config.from.address}>`,
        to: Array.isArray(emailData.to)
          ? emailData.to.join(', ')
          : emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        cc: emailData.cc
          ? Array.isArray(emailData.cc)
            ? emailData.cc.join(', ')
            : emailData.cc
          : undefined,
        bcc: emailData.bcc
          ? Array.isArray(emailData.bcc)
            ? emailData.bcc.join(', ')
            : emailData.bcc
          : undefined,
        attachments: emailData.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: emailData.to,
        subject: emailData.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error('Failed to send email:', {
        error: error instanceof Error ? error.message : error,
        to: emailData.to,
        subject: emailData.subject,
      });

      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
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
   * Close the email transporter connection
   */
  public async close(): Promise<void> {
    try {
      this.transporter.close();
      logger.info('Email service connection closed');
    } catch (error) {
      logger.error('Error closing email service connection:', error);
    }
  }
}

/**
 * Create a new EmailService instance
 * Should be called after environment variables are loaded
 * @returns New EmailService instance
 */
export function createEmailService(): EmailService {
  return new EmailService();
}

export type {
  ForgotPasswordEmailData,
  WelcomeEmailData,
  EmailVerificationData,
};
