import { BaseLayout } from '../layouts/base.layout.js';

/**
 * Interface for email verification data
 */
export interface EmailVerificationData {
  userName: string;
  verificationUrl: string;
  expirationTime?: string;
}

/**
 * Email Verification Template
 * Generates HTML email for email address verification
 */
export class EmailVerificationTemplate {
  /**
   * Generate email verification HTML
   * @param data - Email template data
   * @returns Complete HTML email content
   */
  static generate(data: EmailVerificationData): string {
    const { userName, verificationUrl, expirationTime = '24 hours' } = data;

    const content = `
      <h2>Verify Your Email Address</h2>

      <p>Hello <strong>${userName}</strong>,</p>

      <p>
        Thank you for signing up for AsetFlow! To complete your registration and start using
        our platform, please verify your email address.
      </p>

      <p>
        Email verification helps us ensure the security of your account and enables us to
        send you important updates about your assets and account.
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${verificationUrl}" class="button">
          Verify Email Address
        </a>
      </div>

      <p>
        If the button above doesn't work, you can also copy and paste this link into your browser:
      </p>

      <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; word-break: break-all; font-family: monospace; font-size: 14px; color: #4a5568; margin: 20px 0;">
        ${verificationUrl}
      </div>

      <div class="alert">
        <p>
          <strong>Important:</strong> This verification link will expire in ${expirationTime} for security reasons.
          Please verify your email address as soon as possible.
        </p>
      </div>

      <div class="divider"></div>

      <h3 style="color: #2d3748; font-size: 18px; margin-bottom: 15px;">What happens after verification?</h3>

      <ul style="color: #4a5568; margin: 20px 0; padding-left: 20px; line-height: 1.8;">
        <li>Your account will be fully activated</li>
        <li>You'll get access to all AsetFlow features</li>
        <li>You can start uploading and managing your assets</li>
        <li>You'll receive important account notifications</li>
      </ul>

      <p style="color: #718096; font-size: 14px;">
        If you didn't create an account with AsetFlow, please ignore this email.
        Your email address will not be added to our system.
      </p>
    `;

    return BaseLayout.wrap(content, 'Verify Your Email - AsetFlow');
  }

  /**
   * Generate plain text version of the email
   * @param data - Email template data
   * @returns Plain text email content
   */
  static generatePlainText(data: EmailVerificationData): string {
    const { userName, verificationUrl, expirationTime = '24 hours' } = data;

    return `
Verify Your Email Address

Hello ${userName},

Thank you for signing up for AsetFlow! To complete your registration and start using our platform, please verify your email address.

Email verification helps us ensure the security of your account and enables us to send you important updates about your assets and account.

Please verify your email by visiting:
${verificationUrl}

Important: This verification link will expire in ${expirationTime} for security reasons. Please verify your email address as soon as possible.

What happens after verification?
- Your account will be fully activated
- You'll get access to all AsetFlow features
- You can start uploading and managing your assets
- You'll receive important account notifications

If you didn't create an account with AsetFlow, please ignore this email. Your email address will not be added to our system.

---
© 2024 AsetFlow. All rights reserved.
This email was sent from AsetFlow. Please do not reply to this email.
    `.trim();
  }
}
