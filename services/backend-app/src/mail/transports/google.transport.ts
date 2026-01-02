import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

import {
  BaseMailTransport,
  EmailData,
  EmailResult,
  TransportConfig,
} from './base.transport.js';
import { env } from '../../configs/env.config.js';

interface GoogleTransportConfig {
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    address: string;
  };
}

/**
 * Google Email Transport
 * Handles email sending through Gmail SMTP
 */
export class GoogleTransport extends BaseMailTransport {
  private transporter: Transporter | null = null;
  private config: GoogleTransportConfig | null = null;

  constructor() {
    super('Google');
  }

  /**
   * Check if Google can be configured with current environment
   */
  public canBeConfigured(): boolean {
    return !!(env.GOOGLE_APP_MAIL && env.GOOGLE_APP_PASSWORD);
  }

  /**
   * Initialize Google transport
   */
  public async initialize(): Promise<boolean> {
    try {
      if (!this.canBeConfigured()) {
        this.log('error', 'Missing required Google configuration');
        return false;
      }

      this.config = {
        auth: {
          user: env.GOOGLE_APP_MAIL!,
          pass: env.GOOGLE_APP_PASSWORD!,
        },
        from: {
          name: env.SMTP_FROM_NAME || 'AsetFlow',
          address: env.SMTP_FROM_ADDRESS || env.GOOGLE_APP_MAIL!,
        },
      };

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: this.config.auth,
        logger: false,
        debug: false,
        tls: {
          rejectUnauthorized: env.NODE_ENV === 'production',
        },
      });

      // Verify connection
      await this.transporter.verify();
      this.isReady = true;

      this.log('info', 'Google transport initialized successfully');

      return true;
    } catch (error) {
      this.isReady = false;
      this.log('error', 'Failed to initialize Google transport', error);
      return false;
    }
  }

  /**
   * Send email using Google
   */
  public async sendEmail(emailData: EmailData): Promise<EmailResult> {
    if (!this.isReady || !this.transporter || !this.config) {
      const error = 'Google transport not properly initialized';
      this.log('error', error);
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

      this.log('info', 'Email sent successfully via Google', {
        messageId: info.messageId,
        to: emailData.to,
        subject: emailData.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.log('error', 'Failed to send email via Google', {
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
   * Get Google transport configuration
   */
  public getConfig(): TransportConfig {
    return {
      name: this.transportName,
      isConfigured: this.canBeConfigured(),
      user: this.config?.auth.user,
      fromName: this.config?.from.name,
      fromAddress: this.config?.from.address,
    };
  }

  /**
   * Close Google transport connection
   */
  public async close(): Promise<void> {
    try {
      if (this.transporter) {
        this.transporter.close();
        this.transporter = null;
      }
      this.isReady = false;
      this.log('info', 'Google transport connection closed');
    } catch (error) {
      this.log('error', 'Error closing Google transport connection', error);
    }
  }
}
