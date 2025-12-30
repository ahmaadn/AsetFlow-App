import {
  BaseMailTransport,
  EmailData,
  EmailResult,
  TransportConfig,
} from './base.transport.js';

/**
 * Logger Email Transport
 * Fallback transport that only logs email attempts without actually sending
 */
export class LoggerTransport extends BaseMailTransport {
  constructor() {
    super('Logger');
  }

  /**
   * Logger transport can always be configured (fallback)
   */
  public canBeConfigured(): boolean {
    return true;
  }

  /**
   * Initialize Logger transport (always succeeds)
   */
  public async initialize(): Promise<boolean> {
    this.isReady = true;
    this.log(
      'warn',
      'Logger transport initialized - emails will only be logged, not sent'
    );
    return true;
  }

  /**
   * "Send" email using Logger (just log the attempt)
   */
  public async sendEmail(emailData: EmailData): Promise<EmailResult> {
    if (!this.isReady) {
      const error = 'Logger transport not initialized';
      this.log('error', error);
      return { success: false, error };
    }

    // Log the email data
    this.log('info', 'Email logged (not sent - no mail transport configured)', {
      to: emailData.to,
      subject: emailData.subject,
      hasHtml: !!emailData.html,
      hasText: !!emailData.text,
      cc: emailData.cc,
      bcc: emailData.bcc,
      attachmentCount: emailData.attachments?.length || 0,
    });

    // Return success with a mock message ID
    return {
      success: true,
      messageId: `logger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  /**
   * Get Logger transport configuration
   */
  public getConfig(): TransportConfig {
    return {
      name: this.transportName,
      isConfigured: true,
      mode: 'logging-only',
      description: 'Fallback driver that logs emails without sending',
    };
  }

  /**
   * Close Logger driver (no-op)
   */
  public async close(): Promise<void> {
    this.isReady = false;
    this.log('info', 'Logger driver closed');
  }
}
