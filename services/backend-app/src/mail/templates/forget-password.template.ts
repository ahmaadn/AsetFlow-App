import { BaseLayout } from '../layouts/base.layout.js';

/**
 * Interface for forgot password email data
 */
export interface ForgotPasswordEmailData {
  userName: string;
  resetUrl: string;
  expirationTime?: string;
}

/**
 * Forgot Password Email Template
 * Generates HTML email for password reset requests
 */
export class ForgotPasswordTemplate {
  /**
   * Generate forgot password email HTML
   * @param data - Email template data
   * @returns Complete HTML email content
   */
  static generate(data: ForgotPasswordEmailData): string {
    const { userName, resetUrl, expirationTime = '1 hour' } = data;

    const content = `
      <h2>Password Reset Request</h2>

      <p>Hello <strong>${userName}</strong>,</p>

      <p>
        We received a request to reset your password for your AsetFlow account.
        If you didn't make this request, you can safely ignore this email.
      </p>

      <p>
        To reset your password, click the button below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button" style="color:#fff !important;">
          Reset My Password
        </a>
      </div>

      <p>
        Or copy and paste this link into your browser:
      </p>

      <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 14px; color: #4a5568; margin: 20px 0;">
        ${resetUrl}
      </div>

      <div class="alert">
        <p>
          <strong>Security Notice:</strong> This password reset link will expire in ${expirationTime}.
          For your security, please do not share this link with anyone.
        </p>
      </div>

      <div class="divider"></div>

      <p style="color: #718096; font-size: 14px;">
        If you're having trouble with the button above, you can also reset your password by
        logging into your account and going to your profile settings.
      </p>

      <p style="color: #718096; font-size: 14px;">
        If you didn't request a password reset, please contact our support team immediately.
      </p>
    `;

    return BaseLayout.wrap(content, 'Reset Your Password - AsetFlow');
  }

  /**
   * Generate plain text version of the email
   * @param data - Email template data
   * @returns Plain text email content
   */
  static generatePlainText(data: ForgotPasswordEmailData): string {
    const { userName, resetUrl, expirationTime = '1 hour' } = data;

    return `
Password Reset Request

Hello ${userName},

We received a request to reset your password for your AsetFlow account. If you didn't make this request, you can safely ignore this email.

To reset your password, please visit the following link:
${resetUrl}

Security Notice: This password reset link will expire in ${expirationTime}. For your security, please do not share this link with anyone.

If you're having trouble with the link above, you can also reset your password by logging into your account and going to your profile settings.

If you didn't request a password reset, please contact our support team immediately at support@asetflow.com.

---
© 2024 AsetFlow. All rights reserved.
This email was sent from AsetFlow. Please do not reply to this email.
    `.trim();
  }
}
