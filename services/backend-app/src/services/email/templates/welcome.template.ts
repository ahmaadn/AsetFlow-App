import { BaseLayout } from '../layouts/base.layout';

/**
 * Interface for welcome email data
 */
export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  dashboardUrl?: string;
}

/**
 * Welcome Email Template
 * Generates HTML email for new user registration
 */
export class WelcomeTemplate {
  /**
   * Generate welcome email HTML
   * @param data - Email template data
   * @returns Complete HTML email content
   */
  static generate(data: WelcomeEmailData): string {
    const {
      userName,
      dashboardUrl = process.env.FRONTEND_URL || 'https://app.asetflow.com',
    } = data;

    const content = `
      <h2>Welcome to AsetFlow!</h2>

      <p>Hello <strong>${userName}</strong>,</p>

      <p>
        Welcome to AsetFlow - your comprehensive digital asset management platform!
        We're thrilled to have you join our community.
      </p>

      <p>With AsetFlow, you can:</p>

      <ul style="color: #4a5568; margin: 20px 0; padding-left: 20px; line-height: 1.8;">
        <li><strong>Upload & Organize:</strong> Easily upload and categorize your digital assets</li>
        <li><strong>Smart Folders:</strong> Create organized folder structures for better management</li>
        <li><strong>Secure Sharing:</strong> Share assets safely with your team members</li>
        <li><strong>Analytics:</strong> Track usage patterns and asset performance</li>
        <li><strong>Advanced Search:</strong> Find your assets quickly with powerful search tools</li>
        <li><strong>Version Control:</strong> Keep track of asset versions and changes</li>
      </ul>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${dashboardUrl}" class="button">
          Explore Your Dashboard
        </a>
      </div>

      <div class="divider"></div>

      <h3 style="color: #2d3748; font-size: 20px; margin-bottom: 15px;">Getting Started</h3>

      <p>Here are some quick steps to get you started:</p>

      <ol style="color: #4a5568; margin: 20px 0; padding-left: 20px; line-height: 1.8;">
        <li>Complete your profile setup</li>
        <li>Upload your first assets</li>
        <li>Create folder structures for organization</li>
        <li>Invite team members if needed</li>
      </ol>

      <div style="background-color: #ebf8ff; border-left: 4px solid #3182ce; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <p style="color: #2c5282; margin: 0; font-weight: 500;">
          💡 <strong>Pro Tip:</strong> Start by creating a folder structure that matches your workflow.
          This will make asset management much more efficient!
        </p>
      </div>

      <p>
        If you have any questions or need assistance, our support team is here to help.
        Don't hesitate to reach out!
      </p>
    `;

    return BaseLayout.wrap(content, 'Welcome to AsetFlow');
  }

  /**
   * Generate plain text version of the email
   * @param data - Email template data
   * @returns Plain text email content
   */
  static generatePlainText(data: WelcomeEmailData): string {
    const {
      userName,
      dashboardUrl = process.env.FRONTEND_URL || 'https://app.asetflow.com',
    } = data;

    return `
Welcome to AsetFlow!

Hello ${userName},

Welcome to AsetFlow - your comprehensive digital asset management platform! We're thrilled to have you join our community.

With AsetFlow, you can:
- Upload & Organize: Easily upload and categorize your digital assets
- Smart Folders: Create organized folder structures for better management
- Secure Sharing: Share assets safely with your team members
- Analytics: Track usage patterns and asset performance
- Advanced Search: Find your assets quickly with powerful search tools
- Version Control: Keep track of asset versions and changes

Get started with your dashboard: ${dashboardUrl}

Getting Started:
1. Complete your profile setup
2. Upload your first assets
3. Create folder structures for organization
4. Invite team members if needed

Pro Tip: Start by creating a folder structure that matches your workflow. This will make asset management much more efficient!

If you have any questions or need assistance, our support team is here to help at support@asetflow.com.

---
© 2024 AsetFlow. All rights reserved.
This email was sent from AsetFlow. Please do not reply to this email.
    `.trim();
  }
}
