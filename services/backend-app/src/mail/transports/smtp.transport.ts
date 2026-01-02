import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

import {
  BaseMailTransport,
  EmailData,
  EmailResult,
  TransportConfig,
} from './base.transport.js';
import { env } from '../../configs/env.config.js';

interface SMTPTransportConfig {
  host: string;
  port: number;
  secure: boolean;
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
 * SMTP Email Transports
 * Handles email sending through SMTP servers
 */
export class SMTPTransport extends BaseMailTransport {
  private transporter: Transporter | null = null;
  private config: SMTPTransportConfig | null = null;

  constructor() {
    super('SMTP');
  }

  /**
   * Check if SMTP can be configured with current environment
   */
  public canBeConfigured(): boolean {
    return !!(
      env.SMTP_HOST &&
      env.SMTP_PORT &&
      env.SMTP_USER &&
      env.SMTP_PASS &&
      env.SMTP_FROM_NAME &&
      env.SMTP_FROM_ADDRESS
    );
  }

  /**
   * Initialize SMTP transport
   */
  public async initialize(): Promise<boolean> {
    try {
      if (!this.canBeConfigured()) {
        this.log('error', 'Missing required SMTP configuration');
        return false;
      }

      this.config = {
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

      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
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

      this.log('info', 'SMTP transport initialized successfully');

      return true;
    } catch (error) {
      this.isReady = false;
      this.log('error', 'Failed to initialize SMTP transport', error);
      return false;
    }
  }

  /**
   * Send email using SMTP
   */
  public async sendEmail(emailData: EmailData): Promise<EmailResult> {
    if (!this.isReady || !this.transporter || !this.config) {
      const error = 'SMTP transport not properly initialized';
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

      this.log('info', 'Email sent successfully via SMTP', {
        messageId: info.messageId,
        to: emailData.to,
        subject: emailData.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.log('error', 'Failed to send email via SMTP', {
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
   * Get SMTP transport configuration
   */
  public getConfig(): TransportConfig {
    return {
      name: this.transportName,
      isConfigured: this.canBeConfigured(),
      host: this.config?.host,
      port: this.config?.port,
      secure: this.config?.secure,
      user: this.config?.auth.user,
      fromName: this.config?.from.name,
      fromAddress: this.config?.from.address,
    };
  }

  /**
   * Close SMTP transport connection
   */
  public async close(): Promise<void> {
    try {
      if (this.transporter) {
        this.transporter.close();
        this.transporter = null;
      }
      this.isReady = false;
      this.log('info', 'SMTP transport connection closed');
    } catch (error) {
      this.log('error', 'Error closing SMTP transport connection', error);
    }
  }
}
